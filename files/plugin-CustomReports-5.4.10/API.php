<?php

/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret or copyright law.
 * Redistribution of this information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\CustomReports;

use Piwik\API\Request;
use Piwik\Archive\ArchiveInvalidator;
use Piwik\Cache;
use Piwik\Category\CategoryList;
use Piwik\Columns\DimensionsProvider;
use Piwik\Columns\MetricsList;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataAccess\LogQueryBuilder\JoinTables;
use Piwik\DataTable;
use Piwik\Date;
use Piwik\Http\BadRequestException;
use Piwik\Piwik;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugins\CoreHome\EntityDuplicator\DuplicateRequestResponse;
use Piwik\Plugins\CoreHome\EntityDuplicator\EntityDuplicatorHelper;
use Piwik\Plugin\LogTablesProvider;
use Piwik\Plugin\ProcessedMetric;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;
use Piwik\Plugins\CustomReports\Input\Validator;
use Piwik\Plugins\CustomReports\ReportType\Evolution;
use Piwik\Plugins\CustomReports\ReportType\ReportType;
use Piwik\Plugins\CustomReports\Model\CustomReportsModel;

/**
 * Exposes Custom Reports configuration and reporting endpoints.
 * Use it to create, duplicate, manage, and query custom report definitions and their archived data.
 *
 * @method static \Piwik\Plugins\CustomReports\API getInstance()
 */
class API extends \Piwik\Plugin\API
{
    /**
     * @var MetricsList
     */
    private $metricsList;

    /**
     * @var DimensionsProvider
     */
    private $columnsProvider;

    /**
     * @var CustomReportsModel
     */
    private $model;

    /**
     * @var Validator
     */
    private $validator;

    /**
     * @var LogTablesProvider
     */
    private $logTablesProvider;

    /**
     * @var Configuration
     */
    private $configuration;

    /**
     * @var ArchiveInvalidator
     */
    private $archiveInvalidator;

    public function __construct(
        CustomReportsModel $model,
        Validator $validator,
        DimensionsProvider $columnsProvider,
        LogTablesProvider $logTablesProvider,
        Configuration $configuration,
        ArchiveInvalidator $archiveInvalidator
    ) {
        $this->metricsList = MetricsList::get();
        $this->columnsProvider = $columnsProvider;
        $this->model = $model;
        $this->validator = $validator;
        $this->logTablesProvider = $logTablesProvider;
        $this->configuration = $configuration;
        $this->archiveInvalidator = $archiveInvalidator;
    }

    /**
     * Duplicates a custom report to one or more websites.
     * If the name already exists on a destination site, the copied report is renamed automatically.
     *
     * @param int $idSite The numeric ID of the website that owns the source custom report.
     * @param int $idCustomReport The ID of the custom report to duplicate.
     * @param int[] $idDestinationSites Website IDs to copy the custom report to. Defaults to [$idSite] when omitted.
     * @return array Response indicating whether the duplication succeeded and, on success, the new report ID.
     */
    public function duplicateCustomReport(int $idSite, int $idCustomReport, array $idDestinationSites = []): array
    {
        if (!class_exists('\Piwik\Plugins\CoreHome\EntityDuplicator\DuplicateRequestResponse')) {
            throw new BadRequestException('This endpoint is not available until Matomo 5.4.0');
        }

        // Define data array before any alterations to the variables
        $additionalData = [
            'idSite' => $idSite,
            'idDestinationSites' => $idDestinationSites,
            'idCustomReport' => $idCustomReport,
        ];

        $idDestinationSites = count($idDestinationSites) > 0 ? $idDestinationSites : [$idSite];
        $idSitesToCheck = array_unique(array_merge([$idSite], $idDestinationSites));
        $this->validator->checkSitesDuplicationPermission($idSitesToCheck);

        // Initialise the common response values
        $duplicateRequestResponse = new DuplicateRequestResponse();

        $customReport = null;
        try {
            $customReport = $this->getConfiguredReport($idSite, $idCustomReport);
        } catch (\Throwable $e) {
            // Log the error, but continue for the proper response to be built later
            $this->logError('Uncaught exception looking up custom report to duplicate: {exception}', $e);
        }
        // Name and atleast 1 dimension and 1 metric is needed to create a custom report
        if (empty($customReport['name'])) {
            $duplicateRequestResponse->setSuccess(false);
            $duplicateRequestResponse->setMessage(Piwik::translate('CustomReports_SourceCustomReportLookupError'));
            $duplicateRequestResponse->setAdditionalData($additionalData);

            return $duplicateRequestResponse->getResponseArray();
        }

        $newName = $customReport['name'];
        $customReportNames = [];
        foreach ($idDestinationSites as $idDestinationSite) {
            $customReports = $this->model->getAllCustomReportsForSite($idDestinationSite, true, true);
            // It can only be a duplicate name if some custom reports were found for the site.
            if (is_array($customReports) && count($customReports) > 0) {
                $customReportNames = array_merge($customReportNames, array_column($customReports, 'name'));
            }
        }
        // It can only be a duplicate name if some custom reports were found for the site.
        if (count($customReportNames) > 0) {
            $newName = EntityDuplicatorHelper::getUniqueNameComparedToList($newName, $customReportNames, 50);
        }
        $category = '';
        $subCategory = '';
        if ($idDestinationSites[0] === $idSite) {
            $category = !empty($customReport['category']['id']) ? $customReport['category']['id'] : '';
            $subCategory = !empty($customReport['subcategory']['id']) ? $customReport['subcategory']['id'] : '';
        }
        try {
            $response = $this->addCustomReport(
                $idDestinationSites[0],
                $newName,
                $customReport['report_type'],
                $customReport['metrics'],
                $category,
                $customReport['dimensions'],
                $subCategory,
                $customReport['description'],
                $customReport['segment_filter'],
                (count($idDestinationSites) > 1 ? $idDestinationSites : []) // Add only if more than 1 destination site is passed
            );
        } catch (\Exception $e) {
            $response = false;
            $this->logError('Uncaught exception duplicating custom report: {exception}', $e);
        }

        if (!is_int($response) || $response < 1) {
            $duplicateRequestResponse->setSuccess(false);
            $duplicateRequestResponse->setMessage(Piwik::translate('CustomReports_CustomReportDuplicationError'));
        } else {
            // Set the values for success response
            $duplicateRequestResponse->setSuccess(true);
            $duplicateRequestResponse->setMessage(Piwik::translate('CustomReports_CustomReportCopied'));
            $additionalData['newIds'] = $response;
            $duplicateRequestResponse->setAdditionalData($additionalData);
        }

        // Make sure to record the activity for the report being copied
        if (class_exists('\Piwik\Plugins\ActivityLog\ActivityParamObject\EntityDuplicatedData')) {
            // TODO - Remove this if/else and always use the setRequestDataForActivity method for Matomo 6.x
            if (method_exists($duplicateRequestResponse, 'setRequestDataForEvent')) {
                $duplicateRequestResponse->setRequestDataForEvent(
                    'CustomReports_CustomReport',
                    $customReport['name'],
                    $idCustomReport,
                    $idSite,
                    $idDestinationSites,
                    $additionalData
                );
            } else {
                (
                    new \Piwik\Plugins\ActivityLog\ActivityParamObject\EntityDuplicatedData(
                        'CustomReports_CustomReport',
                        $customReport['name'],
                        $idCustomReport,
                        $idSite,
                        $idDestinationSites,
                        $additionalData
                    )
                )->postActivityEvent();
            }
        }

        return $duplicateRequestResponse->getResponseArray();
    }

    private function logError(string $message, \Throwable $e): void
    {
        StaticContainer::get(\Piwik\Log\LoggerInterface::class)->error(
            $message,
            [
                'exception' => $e,
                'ignoreInScreenWriter' => true,
            ]
        );
    }

    /**
     * Creates a new custom report definition.
     *
     * @param int|string $idSite Website ID that owns the report, or "all"/0 when creating a shared report for multiple websites.
     * @param string $name The report name.
     * @param string $reportType Report type to create, for example "table" or "evolution".
     * @param string[] $metricIds Metric IDs to include in the report.
     * @param string|false $categoryId Category ID to place the report in. Uses the default custom reports category when omitted.
     * @param string[] $dimensionIds Dimension IDs to include in the report.
     * @param string|false $subcategoryId Subcategory ID to place the report in. Creates a new reporting page when omitted.
     * @param string $description Optional report description shown in the report help tooltip.
     * @param string $segmentFilter Optional URL-encoded segment applied to the report data.
     * @param int[]|string[] $multipleIdSites Optional website IDs to assign the report to when creating a shared report.
     * @return int The ID of the newly created custom report.
     */
    public function addCustomReport($idSite, $name, $reportType, $metricIds, $categoryId = false, $dimensionIds = array(), $subcategoryId = false, $description = '', $segmentFilter = '', $multipleIdSites = [])
    {
        if (!empty($multipleIdSites) && $idSite != 'all' && $idSite != '0') {
            $multipleIdSites = array_unique($multipleIdSites);
            foreach ($multipleIdSites as $multipleIdSite) {
                $this->validator->checkWritePermission($multipleIdSite);
            }
            if (!in_array($idSite, $multipleIdSites)) {
                throw new \Exception(Piwik::translate('CustomReports_ErrorInvalidMultipleIdSite', [$idSite]));
            }
        } else {
            $this->validator->checkWritePermission($idSite);
            // prevent creating reports for sites that do not yet exist but might in the future
            $this->validator->checkSiteExists($idSite);
        }

        if (empty($categoryId)) {
            $categoryId = CustomReportsDao::DEFAULT_CATEGORY;
        }

        $createdDate = Date::now()->getDatetime();
        if (!empty($segmentFilter)) {
            $segmentFilter = Common::unsanitizeInputValue($segmentFilter);
            $segmentFilter = urldecode($segmentFilter);
        }

        // If there's a Product Revenue metric without a Product Quantity metric, throw an exception
        if (
            (in_array('sum_product_revenue', $metricIds) || in_array('avg_product_revenue', $metricIds))
            && !in_array('sum_ecommerce_productquantity', $metricIds)
            && !in_array('avg_ecommerce_productquantity', $metricIds)
        ) {
            throw new \Exception(Piwik::translate('CustomReports_ErrorProductRevenueMetricDependency'));
        }

        $idReport = $this->model->createCustomReport($idSite, $name, $description, $reportType, $dimensionIds, $metricIds, $segmentFilter, $categoryId, $subcategoryId, $createdDate, $multipleIdSites);
        $report = $this->model->getCustomReportById($idReport, $idSite);

        $config = StaticContainer::get(Configuration::class);
        $startDate = null;
        $subMonth = $config->getReArchiveReportsInPastLastNMonths();
        if (!empty($subMonth)) {
            $startDate = Date::yesterday()->subMonth($subMonth)->setDay(1);
        }

        $this->scheduleReArchiving($idSite, $multipleIdSites, $report, $startDate);

        $this->clearCache();
        return $idReport;
    }

    private function clearCache()
    {
        // we need to delete possibly cached values. especially ReportsProvider
        try {
            Cache::getLazyCache()->flushAll();
        } catch (\Exception $e) {
        }
        // we need to delete possibly cached values. especially ReportsProvider
        try {
            Cache::getEagerCache()->flushAll();
        } catch (\Exception $e) {
        }
        // we need to delete possibly cached values. especially ReportsProvider
        try {
            Cache::getTransientCache()->flushAll();
        } catch (\Exception $e) {
        }
    }

    /**
     * Updates an existing custom report definition.
     * Changing metrics, dimensions, report type, or segment may require the report to be archived again.
     *
     * @param int|string $idSite Website ID that owns the report, or "all"/0 when updating a shared report.
     * @param int $idCustomReport The ID of the custom report to update.
     * @param string $name The report name.
     * @param string $reportType Report type to store, for example "table" or "evolution".
     * @param string[] $metricIds Metric IDs to include in the report.
     * @param string|false $categoryId Category ID to place the report in. Uses the default custom reports category when omitted.
     * @param string[] $dimensionIds Dimension IDs to include in the report.
     * @param string|false $subcategoryId Subcategory ID to place the report in. Creates a new reporting page when omitted.
     * @param string $description Optional report description shown in the report help tooltip.
     * @param string $segmentFilter Optional URL-encoded segment applied to the report data.
     * @param int[] $subCategoryReportIds Child report IDs mapped to this report.
     * @param int[]|string[] $multipleIdSites Optional website IDs to assign the report to when updating a shared report.
     * @return void
     */
    public function updateCustomReport(
        $idSite,
        $idCustomReport,
        $name,
        $reportType,
        $metricIds,
        $categoryId = false,
        $dimensionIds = array(),
        $subcategoryId = false,
        $description = '',
        $segmentFilter = '',
        $subCategoryReportIds = [],
        $multipleIdSites = []
    ): void {
        if (!empty($multipleIdSites) && $idSite != 'all' && $idSite != '0') {
            $multipleIdSites = array_unique($multipleIdSites);
            foreach ($multipleIdSites as $multipleIdSite) {
                $this->validator->checkWritePermission($multipleIdSite);
            }
            if (!in_array($idSite, $multipleIdSites)) {
                throw new \Exception(Piwik::translate('CustomReports_ErrorInvalidMultipleIdSite', [$idSite]));
            }
        } else {
            $this->validator->checkWritePermission($idSite);
            // prevent creating reports for sites that do not yet exist but might in the future
            $this->validator->checkSiteExists($idSite);
        }

        // we cannot get report by idSite, idCustomReport since the idSite may change!
        $report = $this->model->getCustomReportById($idCustomReport, $idSite);

        if (empty($report)) {
            throw new \Exception(Piwik::translate('CustomReports_ErrorReportDoesNotExist'));
        }

        if ($report['idsite'] != $idSite && empty($multipleIdSites)) {
            // if the site changes for a report, make sure the user write permission for the old and the new site
            $this->validator->checkWritePermission($report['idsite']);
        }

        if (empty($categoryId)) {
            $categoryId = CustomReportsDao::DEFAULT_CATEGORY;
        }

        if (!empty($segmentFilter)) {
            $segmentFilter = Common::unsanitizeInputValue($segmentFilter);
            $segmentFilter = urldecode($segmentFilter);
        }

        $updatedDate = Date::now()->getDatetime();

        $shouldReArchive = false;
        if (
            (
                isset($report['report_type']) &&
                $report['report_type'] != $reportType
            ) ||
            (
                isset($report['dimensions']) &&
                $report['dimensions'] != $dimensionIds
            ) ||
            (
                isset($report['metrics']) &&
                $report['metrics'] != $metricIds
            ) ||
            (
                isset($report['segment_filter']) &&
                $report['segment_filter'] != $segmentFilter
            )
        ) {
            $shouldReArchive = true;
        }

        // If there's a Product Revenue metric without a Product Quantity metric, throw an exception
        if (
            (in_array('sum_product_revenue', $metricIds) || in_array('avg_product_revenue', $metricIds))
            && !in_array('sum_ecommerce_productquantity', $metricIds)
            && !in_array('avg_ecommerce_productquantity', $metricIds)
        ) {
            throw new \Exception(Piwik::translate('CustomReports_ErrorProductRevenueMetricDependency'));
        }

        $this->model->updateCustomReport($idSite, $idCustomReport, $name, $description, $reportType, $dimensionIds, $metricIds, $segmentFilter, $categoryId, $subcategoryId, $updatedDate, $subCategoryReportIds, $multipleIdSites);

        if ($shouldReArchive) {
            $updatedReport = $this->model->getCustomReportById($idCustomReport, $idSite);
            $config = StaticContainer::get(Configuration::class);
            $startDate = null;
            $subMonth = $config->getReArchiveReportsInPastLastNMonths();
            if (!empty($subMonth)) {
                $startDate = Date::yesterday()->subMonth($subMonth)->setDay(1);
            }

            $this->scheduleReArchiving($idSite, $multipleIdSites, $updatedReport, $startDate);
        }

        $this->clearCache();
    }

    private function scheduleReArchiving($idSite, $multipleIdSites, array $report, ?Date $startDate): void
    {
        $idSites = $idSite === 0 || $idSite === '0' || $idSite == 'all' ? 'all' : (!empty($multipleIdSites) ? $multipleIdSites : [$idSite]);

        $this->archiveInvalidator->scheduleReArchiving(
            $idSites,
            'CustomReports',
            Archiver::makeRecordName($report['idcustomreport'], $report['revision'] ?? 0),
            $startDate
        );

        if ($report['report_type'] === Evolution::ID) {
            foreach ($this->model->getArchivableMetricsInReport($report) as $metric) {
                $this->archiveInvalidator->scheduleReArchiving(
                    $idSites,
                    'CustomReports',
                    Archiver::makeEvolutionRecordName($report['idcustomreport'], $report['revision'], $metric->getName()),
                    $startDate
                );
            }
        }
    }

    /**
     * Returns all configured custom reports for a website.
     *
     * @param int|string $idSite The website ID to query, or "all" for reports shared across all websites.
     * @param bool $skipCategoryMetadata Whether to omit category metadata from each returned report.
     * @return array The configured custom reports for the requested website.
     */
    public function getConfiguredReports($idSite, $skipCategoryMetadata = false)
    {
        $this->validator->checkReportViewPermission($idSite);
        $this->validator->checkSiteExists($idSite);

        if ($idSite === 'all') {
            $idSite = 0;
        }

        $reports = $this->model->getAllCustomReportsForSite($idSite, $skipCategoryMetadata == '1');
        usort($reports, function ($a, $b) {
            if ($a['idcustomreport'] > $b['idcustomreport']) {
                return 1; // no need to check for === because two reports won't have same ID
            }
            return -1;
        });

        foreach ($reports as &$report) {
            $this->addAllowedToEditStatus($report);
        }

        return $reports;
    }

    /**
     * Returns a specific custom report configuration.
     *
     * @param int|string $idSite The website ID to query, or "all" for a report shared across all websites.
     * @param int $idCustomReport The ID of the custom report. [@example=1]
     * @return array The configured custom report details.
     */
    public function getConfiguredReport($idSite, $idCustomReport)
    {
        $this->validator->checkReportViewPermission($idSite);
        $this->validator->checkSiteExists($idSite);

        if ($idSite === 'all') {
            $idSite = 0;
        }

        $this->model->checkReportExists($idSite, $idCustomReport);

        $report = $this->model->getCustomReport($idSite, $idCustomReport);
        $this->addAllowedToEditStatus($report);

        return $report;
    }

    /**
     * Deletes a custom report definition.
     * Deleted reports are no longer available through the API, and their archived data may be removed later.
     *
     * @param int|string $idSite The website ID that owns the custom report, or "all" for a shared report.
     * @param int $idCustomReport The ID of the custom report to delete.
     * @return void
     */
    public function deleteCustomReport($idSite, $idCustomReport): void
    {
        $this->validator->checkWritePermission($idSite);

        if ($idSite === 'all') {
            $idSite = 0;
        }

        $report = $this->getCustomReportInfo($idSite, $idCustomReport, 'Delete');

        $multipleIDSites = $report['multiple_idsites'] ? explode(',', $report['multiple_idsites']) : [];
        if ($multipleIDSites) {
            foreach ($multipleIDSites as $multipleIdSite) {
                $this->validator->checkWritePermission($multipleIdSite);
            }
        }
        $this->archiveInvalidator->removeInvalidationsSafely(
            $multipleIDSites ? $multipleIDSites : [$idSite],
            'CustomReports',
            Archiver::makeRecordName($idCustomReport, $report['revision'])
        );

        $this->model->deactivateReport($multipleIDSites ? -1 : $idSite, $idCustomReport, $report['name']);
        Piwik::postEvent('CustomReports.deleteCustomReport.end', array($idSite, $idCustomReport));
        $this->clearCache();
    }

    /**
     * Pauses a custom report.
     * Paused reports stop being archived until they are resumed.
     *
     * @param int|string $idSite The website ID that owns the custom report, or "all" for a shared report.
     * @param int $idCustomReport The ID of the custom report to pause.
     * @return void
     */
    public function pauseCustomReport($idSite, $idCustomReport): void
    {
        $this->validator->checkWritePermission($idSite);

        if ($idSite === 'all') {
            $idSite = 0;
        }

        $report = $this->getCustomReportInfo($idSite, $idCustomReport, 'Pause');

        $multipleIDSites = $report['multiple_idsites'] ? explode(',', $report['multiple_idsites']) : [];
        if ($multipleIDSites) {
            foreach ($multipleIDSites as $multipleIdSite) {
                $this->validator->checkWritePermission($multipleIdSite);
            }
        }
        $this->archiveInvalidator->removeInvalidationsSafely(
            $multipleIDSites ? $multipleIDSites : [$idSite],
            'CustomReports',
            Archiver::makeRecordName($idCustomReport, $report['revision'])
        );

        $this->model->pauseReport($multipleIDSites ? -1 : $idSite, $idCustomReport, $report['name']);
        $this->clearCache();
    }

    /**
     * Resumes a paused custom report.
     * Resumed reports are archived again for future requests.
     *
     * @param int|string $idSite The website ID that owns the custom report, or "all" for a shared report.
     * @param int $idCustomReport The ID of the custom report to resume.
     * @return void
     */
    public function resumeCustomReport($idSite, $idCustomReport): void
    {
        $this->validator->checkWritePermission($idSite);

        if ($idSite === 'all') {
            $idSite = 0;
        }

        $report = $this->getCustomReportInfo($idSite, $idCustomReport, 'Resume');

        $multipleIDSites = $report['multiple_idsites'] ? explode(',', $report['multiple_idsites']) : [];
        if ($multipleIDSites) {
            foreach ($multipleIDSites as $multipleIdSite) {
                $this->validator->checkWritePermission($multipleIdSite);
            }
        }

        $this->model->resumeReport($multipleIDSites ? -1 : $idSite, $idCustomReport, $report['name']);
        $this->clearCache();
    }

    /**
     * Returns report categories and subcategories that can contain custom reports.
     *
     * @param int|string $idSite The website ID used to resolve available report pages.
     * @return array Available categories and subcategories for custom report placement.
     */
    public function getAvailableCategories($idSite)
    {
        $this->validator->checkReportViewPermission($idSite);

        $reportPages = Request::processRequest('API.getReportPagesMetadata', array('idSite' => $idSite, 'filter_limit' => -1));

        $categories = array();
        foreach ($reportPages as $reportPage) {
            if (!empty($reportPage['category']['id'])) {
                $categoryId = $reportPage['category']['id'];

                if ($categoryId === 'Dashboard_Dashboard') {
                    continue;
                }

                $subcategoryId = $reportPage['subcategory']['id'];
                if (strpos($subcategoryId, '_Manage') !== false) {
                    continue; // we do not want to be able to add reports to manage pages
                }

                if (isset($categories[$categoryId])) {
                    $categories[$categoryId]['subcategories'][] = array(
                        'uniqueId' => $reportPage['subcategory']['id'],
                        'name' => $reportPage['subcategory']['name']
                    );
                } else {
                    $categories[$categoryId] = array(
                        'uniqueId' => $categoryId,
                        'name' => $reportPage['category']['name'],
                        'subcategories' => array(
                            array(
                                'uniqueId' => $reportPage['subcategory']['id'],
                                'name' => $reportPage['subcategory']['name']
                            )
                        ),
                    );
                }
            }
        }

        if (!isset($categories['CustomReports_CustomReports'])) {
            $categories['CustomReports_CustomReports'] = array(
                'uniqueId' => 'CustomReports_CustomReports',
                'name' => Piwik::translate('CustomReports_CustomReports'),
                'subcategories' => array()
            );
        }

        return array_values($categories);
    }

    /**
     * Returns report types that can be used for custom reports.
     *
     * @return array Available custom report types keyed by identifier and translated name.
     */
    public function getAvailableReportTypes()
    {
        $this->validator->checkHasSomeWritePermission();

        $rows = array();
        foreach (ReportType::getAll() as $reportType) {
            $rows[] = array('key' => $reportType::ID, 'value' => $reportType->getName());
        }

        return $rows;
    }

    private function isTableJoinable($tableName)
    {
        $logTable = $this->logTablesProvider->getLogTable($tableName);
        if ($logTable && ($logTable->getColumnToJoinOnIdAction() || $logTable->getColumnToJoinOnIdVisit())) {
            if ($logTable->getPrimaryKey()) {
                // without primary key we would not group the data correctly
                return true;
            }
        } elseif ($logTable && $logTable->getWaysToJoinToOtherLogTables()) {
            $tables = new JoinTables($this->logTablesProvider, [$tableName]);
            return $tables->isTableJoinableOnVisit($tableName) || $tables->isTableJoinableOnAction($tableName);
        }

        return false;
    }

    /**
     * Returns dimensions that can be used in custom reports.
     *
     * @param int|string $idSite The website ID used to resolve available dimensions.
     * @return array Available dimensions grouped by category.
     */
    public function getAvailableDimensions($idSite)
    {
        Piwik::checkUserIsNotAnonymous();
        Piwik::checkUserHasSomeViewAccess();

        $dimensions = $this->columnsProvider->getAllDimensions();

        $rows = array();

        $dimensionsToIgnore = array(
            'Actions.IdPageview', 'CoreHome.VisitId',
            'CoreHome.LinkVisitActionId', 'CoreHome.LinkVisitActionIdPages', 'UserCountry.Provider'
        );

        $dimensionsToRename = [
            'CoreHome.IdSite' => Piwik::translate('CustomReports_WebsiteName')
        ];

        $config = StaticContainer::get(Configuration::class);
        foreach ($config->getDisabledDimensions() as $dimensionDisabled) {
            $dimensionsToIgnore[] = $dimensionDisabled;
        }

        /**
         * Adds the possibility to other plugins to ignore more dimensions
         */
        Piwik::postEvent('CustomReports.addDimensionsToIgnore', array(&$dimensionsToIgnore));

        $categoryList = CategoryList::get();

        foreach ($dimensions as $dimension) {
            $categoryId = $dimension->getCategoryId();
            $dimensionName = $dimension->getName();
            $table = $dimension->getDbTableName();
            $dimensionId = $dimension->getId();

            if (!$table) {
                // without table we cannot join it
                continue;
            }

            if (!$this->isTableJoinable($table)) {
                // archiving this dimension would not work
                continue;
            }

            if (in_array($dimensionId, $dimensionsToIgnore)) {
                continue;
            }

            if (key_exists($dimensionId, $dimensionsToRename)) {
                $dimensionName = $dimensionsToRename[$dimensionId];
            }

            if ($dimension->getColumnName() && $dimensionName) {
                if (!isset($rows[$categoryId])) {
                    $category = $categoryList->getCategory($categoryId);
                    $orderId = 999;
                    if (!empty($category)) {
                        $orderId = $category->getOrder();
                    }

                    $categoryName = Piwik::translate($categoryId);
                    if (!is_null($category) && method_exists($category, 'getDisplayName')) {
                        $categoryName = $category->getDisplayName();
                    }

                    $rows[$categoryId] = array(
                        'category' => $categoryName,
                        'dimensions' => array(),
                        'orderId' => $orderId
                    );
                }
                $rows[$categoryId]['dimensions'][] = array(
                    'uniqueId' => $dimension->getId(),
                    'name' => ucwords($dimensionName),
                    'sqlSegment' => $dimension->getSqlSegment(),
                );
            }
        }

        usort($rows, function ($rowA, $rowB) {
            if ((int)$rowA['orderId'] > (int)$rowB['orderId']) {
                return 1;
            }
            if ((int)$rowA['orderId'] === (int)$rowB['orderId']) {
                return 0;
            }
            return -1;
        });

        foreach ($rows as $categoryId => $row) {
            $dimensions = $row['dimensions'];
            usort($dimensions, function ($dimA, $dimB) {
                return strcmp($dimA['name'], $dimB['name']);
            });
            $rows[$categoryId]['dimensions'] = $dimensions;
        }

        return array_values($rows);
    }

    /**
     * Returns metrics that can be used in custom reports.
     *
     * @param int|string $idSite The website ID used to resolve available metrics.
     * @return array Available metrics grouped by category.
     */
    public function getAvailableMetrics($idSite)
    {
        Piwik::checkUserIsNotAnonymous();
        Piwik::checkUserHasSomeViewAccess();

        $metrics = MetricsList::get();
        $categoryList = CategoryList::get();

        $rows = array();
        $period = Common::getRequestVar('period', '', 'string');
        foreach ($metrics->getMetrics() as $metric) {
            if (!$metric) {
                continue;
            }
            if ($metric instanceof ProcessedMetric && !$this->canGenerateMetricAutomatically($metric)) {
                // we do not have all the dependent metrics to generate this processed metric automatically
                continue;
            }

            $categoryId = $metric->getCategoryId();
            $name = $metric->getName();
            $translatedName = $metric->getTranslatedName();

            if (($metric instanceof ProcessedMetric || $metric instanceof ArchivedMetric) && $name && $translatedName) {
                if (method_exists($metric, 'getQuery') && !$metric->getQuery()) {
                    // archiving this metric would not work!
                    continue;
                }

                if (method_exists($metric, 'getDbTableName') && $metric->getDbTableName() && !$this->isTableJoinable($metric->getDbTableName())) {
                    // archiving this metric would not work!
                    continue;
                }

                if (method_exists($metric, 'getDimension') && $metric->getDimension()) {
                    $dimension = $metric->getDimension();
                    $dbDiscriminator = $dimension->getDbDiscriminator();
                    if ($dbDiscriminator) {
                        $dbDiscriminatorValue = $dbDiscriminator->getValue();
                        if (!isset($dbDiscriminatorValue) || !is_numeric($dbDiscriminatorValue)) {
                            continue;
                        }
                    }
                }

                if (!isset($rows[$categoryId])) {
                    $category = $categoryList->getCategory($categoryId);
                    $orderId = 999;
                    if (!empty($category)) {
                        $orderId = $category->getOrder();
                    }

                    $categoryName = Piwik::translate($categoryId);
                    if (!is_null($category) && method_exists($category, 'getDisplayName')) {
                        $categoryName = $category->getDisplayName();
                    }

                    $rows[$categoryId] = array(
                        'category' => $categoryName,
                        'metrics' => array(),
                        'orderId' => $orderId
                    );
                }

                $description = $metric->getDocumentation();
                if (stripos($translatedName, 'unique') === 0) {
                    $description = Piwik::translate('CustomReports_CommonUniqueMetricDescription', array($description, ucwords($translatedName), str_replace('Unique ', '', ucwords($translatedName))));
                }

                $rows[$categoryId]['metrics'][] = array(
                    'uniqueId' => $name, 'name' => ucwords($translatedName), 'description' => $description
                );
            }
        }

        usort($rows, function ($rowA, $rowB) {
            if ((int)$rowA['orderId'] > (int)$rowB['orderId']) {
                return 1;
            }
            if ((int)$rowA['orderId'] === (int)$rowB['orderId']) {
                return 0;
            }
            return -1;
        });

        foreach ($rows as $category => $row) {
            $dimensions = $row['metrics'];
            usort($dimensions, function ($dimA, $dimB) {
                return strcasecmp($dimA['name'], $dimB['name']);
            });
            $rows[$category]['metrics'] = $dimensions;
        }

        return array_values($rows);
    }

    private function canGenerateMetricAutomatically(ProcessedMetric $metric)
    {
        foreach ($metric->getDependentMetrics() as $dependentMetric) {
            $depMetric = $this->metricsList->getMetric($dependentMetric);
            if (!$depMetric) {
                // we cannot generate this metric directly
                return false;
            }

            if ($depMetric instanceof ProcessedMetric && !$this->canGenerateMetricAutomatically($depMetric)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns archived data for a configured custom report.
     *
     * @param int|string $idSite The website ID to query.
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param int $idCustomReport The ID of the custom report to look up data for.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     * @param bool $expanded Whether to expand recursive subtables in the response.
     * @param bool $flat Whether to flatten the report rows into a single level.
     * @param int|false $idSubtable The subtable ID to fetch instead of the root table.
     * @param string|false $columns Comma-separated list of columns to include in the response.
     * @return DataTable\DataTableInterface The archived data for the requested custom report.
     */
    public function getCustomReport($idSite, $period, $date, $idCustomReport, $segment = false, $expanded = false, $flat = false, $idSubtable = false, $columns = false)
    {
        $this->validator->checkReportViewPermission($idSite);
        $this->validator->checkSiteExists($idSite); // lets not return any reports from eg deleted sites if for some reason report still exists
        $this->model->checkReportExists($idSite, $idCustomReport);

        $report = $this->model->getCustomReport($idSite, $idCustomReport);

        $reportType = ReportType::factory($report['report_type']);

        $table = $reportType->fetchApi($idSite, $idCustomReport, $period, $date, $segment, $expanded, $flat, $idSubtable, $columns);

        return $table;
    }

    private function addAllowedToEditStatus(&$report)
    {
        $idSite = $report['idsite'];
        $multipleIdSites = $report['multiple_idsites'] ? explode(',', $report['multiple_idsites']) : array();
        if (Piwik::hasUserSuperUserAccess()) {
            $allowedToEdit = true;
        } elseif ($idSite == 'all' || $idSite == '0') {
            $allowedToEdit = false;
        } else {
            $allowedToEdit = $multipleIdSites ? Piwik::isUserHasWriteAccess($multipleIdSites) : Piwik::isUserHasWriteAccess($idSite);
        }

        $report['allowedToEdit'] = $allowedToEdit;
    }

    private function getCustomReportInfo($idSite, $idCustomReport, $action)
    {
        $report = $this->model->getCustomReport($idSite, $idCustomReport);

        if (empty($report)) {
            throw new \Exception(Piwik::translate('CustomReports_ErrorCustomReportDoesNotExist'));
        } elseif ($report['idsite'] != $idSite) {
            // prevent a possible hack that someone passes a different site than the report has and then we accidentally
            // still delete the report because we match with `idsite = 0 or idsite = ?`. We don't do this here right now
            // and wouldn't need this code but it is to prevent any possible future security bugs.
            throw new \Exception(Piwik::translate('CustomReports_' . $action . 'ExceptionMessage'));
        }

        return $report;
    }
}
