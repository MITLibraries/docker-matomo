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
 * The <a href='https://plugins.matomo.org/CustomReports' target='_blank'>Custom Reports</a> API lets you 1) create custom
 * reports within Matomo and 2) view the created reports in the Matomo Reporting UI or consume them via the API.
 * <br/><br/>
 * You can choose between different visualizations (eg table or evolution graph) and combine hundreds of dimensions
 * and metrics to get the data you need.
 *
 * @method static \Piwik\Plugins\CustomReports\API getInstance()
 *
 * @OA\Tag(name="CustomReports")
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
     * Copies a specified custom report to one or more sites. If a custom report with the same name already exists, the new custom report
     * will have an automatically adjusted name to make it unique to the assigned site.
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report to duplicate.
     * @param int[] $idDestinationSites Optional array of IDs identifying which site(s) the new custom report is to be
     * assigned to. The default is [idSite] when nothing is provided.
     *
     * @return array Response indicating success and containing the ID of the newly created report.
     * @throws Exception
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.duplicateCustomReport",
     *     operationId="CustomReports.duplicateCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to duplicate.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idDestinationSites",
     *         in="query",
     *         required=false,
     *         description="Optional array of IDs identifying which site(s) the new custom report is to be assigned to. The default is [idSite] when nothing is provided.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="integer"),
     *             default={}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Response indicating success and containing the ID of the newly created report.",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"success":"1","message":"The custom report has been successfully copied.","additionalData":{"idSite":"1","idDestinationSites":"","idCustomReport":"1","newIds":"9"}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="additionalData",
     *                     type="object"
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"success":true,"message":"The custom report has been successfully copied.","additionalData":{"idSite":1,"idDestinationSites":{},"idCustomReport":1,"newIds":9}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="success", type="boolean"),
     *                 @OA\Property(property="message", type="string"),
     *                 @OA\Property(
     *                     property="additionalData",
     *                     type="object",
     *                     @OA\Property(property="idSite", type="integer"),
     *                     @OA\Property(
     *                         property="idDestinationSites",
     *                         type="array",
     *                         @OA\Items()
     *                     ),
     *                     @OA\Property(property="idCustomReport", type="integer"),
     *                     @OA\Property(property="newIds", type="integer")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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
     * Adds a new custom report
     *
     * @param int $idSite
     * @param string $name  The name of the report.
     * @param string $reportType    The type of report you want to create, for example 'table' or 'evolution'.
     *                              For a list of available reports call 'CustomReports.getAvailableReportTypes'
     * @param string[] $metricIds   A list of metric IDs. For a list of available metrics call 'CustomReports.getAvailableMetrics'
     * @param string $categoryId  By default, the report will be put into a custom report category unless a specific
     *                            categoryId is provided. For a list of available categories call 'CustomReports.getAvailableCategories'.
     * @param string[] $dimensionIds A list of dimension IDs.  For a list of available metrics call 'CustomReports.getAvailableDimensions'
     * @param string $subcategoryId By default, a new reporting page will be created for this report unless you
     *                                   specifiy a specific name or subcategoryID. For a list of available subcategories
     *                                   call 'CustomReports.getAvailableCategories'.
     * @param string $description  An optional description for the report, will be shown in the title help icon of the report.
     * @param string $segmentFilter   An optional segment to filter the report data. Needs to be sent urlencoded.
     * @param string[] $multipleIdSites   An optional list of idsites for which we need to execute the report
     *
     * @return int
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.addCustomReport",
     *     operationId="CustomReports.addCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of the report.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="reportType",
     *         in="query",
     *         required=true,
     *         description="The type of report you want to create, for example 'table' or 'evolution'. For a list of available reports call 'CustomReports.getAvailableReportTypes'",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="metricIds",
     *         in="query",
     *         required=true,
     *         description="A list of metric IDs. For a list of available metrics call 'CustomReports.getAvailableMetrics'",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="categoryId",
     *         in="query",
     *         required=false,
     *         description="By default, the report will be put into a custom report category unless a specific categoryId is provided. For a list of available categories call 'CustomReports.getAvailableCategories'.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="dimensionIds",
     *         in="query",
     *         required=false,
     *         description="A list of dimension IDs.  For a list of available metrics call 'CustomReports.getAvailableDimensions'",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string"),
     *             default={}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="subcategoryId",
     *         in="query",
     *         required=false,
     *         description="By default, a new reporting page will be created for this report unless you specifiy a specific name or subcategoryID. For a list of available subcategories call 'CustomReports.getAvailableCategories'.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="description",
     *         in="query",
     *         required=false,
     *         description="An optional description for the report, will be shown in the title help icon of the report.",
     *         @OA\Schema(
     *             type="string",
     *             default=""
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="segmentFilter",
     *         in="query",
     *         required=false,
     *         description="An optional segment to filter the report data. Needs to be sent urlencoded.",
     *         @OA\Schema(
     *             type="string",
     *             default=""
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="multipleIdSites",
     *         in="query",
     *         required=false,
     *         description="An optional list of idsites for which we need to execute the report",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string"),
     *             default={}
     *         )
     *     ),
     *     @OA\Response(response=200, ref="#/components/responses/GenericInteger"),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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
     * Updates an existing custom report. Be aware that if you change metrics, dimensions, the report type or the segment filter,
     * previously processed/archived reports may become unavailable and would need to be re-processed.
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report to update.
     * @param string $name  The name of the report.
     * @param string $reportType    The type of report you want to create, for example 'table' or 'evolution'.
     *                              For a list of available reports call 'CustomReports.getAvailableReportTypes'
     * @param string[] $metricIds   A list of metric IDs. For a list of available metrics call 'CustomReports.getAvailableMetrics'
     * @param string $categoryId  By default, the report will be put into a custom report category unless a specific
     *                            categoryId is provided. For a list of available categories call 'CustomReports.getAvailableCategories'.
     * @param string[] $dimensionIds A list of dimension IDs.  For a list of available metrics call 'CustomReports.getAvailableDimensions'
     * @param string $subcategoryId By default, a new reporting page will be created for this report unless you
     *                                   specify a specific name or subcategoryID. For a list of available subcategories
     *                                   call 'CustomReports.getAvailableCategories'.
     * @param string $description  An optional description for the report, will be shown in the title help icon of the report.
     * @param string $segmentFilter   An optional segment to filter the report data. Needs to be sent urlencoded.
     * @param int[] $subCategoryReportIds List of sub report ids mapped to this report
     * @param string[] $multipleIdSites An optional list of idSites for which we need to execute the report
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.updateCustomReport",
     *     operationId="CustomReports.updateCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to update.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of the report.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="reportType",
     *         in="query",
     *         required=true,
     *         description="The type of report you want to create, for example 'table' or 'evolution'. For a list of available reports call 'CustomReports.getAvailableReportTypes'",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="metricIds",
     *         in="query",
     *         required=true,
     *         description="A list of metric IDs. For a list of available metrics call 'CustomReports.getAvailableMetrics'",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="categoryId",
     *         in="query",
     *         required=false,
     *         description="By default, the report will be put into a custom report category unless a specific categoryId is provided. For a list of available categories call 'CustomReports.getAvailableCategories'.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="dimensionIds",
     *         in="query",
     *         required=false,
     *         description="A list of dimension IDs.  For a list of available metrics call 'CustomReports.getAvailableDimensions'",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string"),
     *             default={}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="subcategoryId",
     *         in="query",
     *         required=false,
     *         description="By default, a new reporting page will be created for this report unless you specifiy a specific name or subcategoryID. For a list of available subcategories call 'CustomReports.getAvailableCategories'.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="description",
     *         in="query",
     *         required=false,
     *         description="An optional description for the report, will be shown in the title help icon of the report.",
     *         @OA\Schema(
     *             type="string",
     *             default=""
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="segmentFilter",
     *         in="query",
     *         required=false,
     *         description="An optional segment to filter the report data. Needs to be sent urlencoded.",
     *         @OA\Schema(
     *             type="string",
     *             default=""
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="subCategoryReportIds",
     *         in="query",
     *         required=false,
     *         description="List of sub report ids mapped to this report",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="integer"),
     *             default={}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="multipleIdSites",
     *         in="query",
     *         required=false,
     *         description="An optional list of idsites for which we need to execute the report",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="string"),
     *             default={}
     *         )
     *     ),
     *     @OA\Response(response=200, ref="#/components/responses/GenericSuccess"),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get all custom report configurations for a specific site.
     *
     * @param int $idSite
     * @param bool $skipCategoryMetadata Optional flag indicating whether to omit metadata for the category.
     * @return array The list of configured custom reports.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getConfiguredReports",
     *     operationId="CustomReports.getConfiguredReports",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="skipCategoryMetadata",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *             default=false
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getConfiguredReports&idSite=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getConfiguredReports&idSite=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"idcustomreport":"1","idsite":"1","revision":"0","report_type":"table","name":"Pages by New\/Returning visitor","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":"65","icon":"icon-business"},"subcategory":"","subcategory_order":"9999999","dimensions":{"row":{"CoreHome.VisitorReturning","Actions.PageTitle"}},"metrics":{"row":{"nb_uniq_visitors","nb_visits","pageviews"}},"segment_filter":"","created_date":"2017-10-20 02:31:50","updated_date":"2017-10-20 02:31:50","status":"active","multiple_idsites":"","site":{"id":"1","name":"Demo Site"},"allowedToEdit":"0"},{"idcustomreport":"2","idsite":"1","revision":"0","report_type":"table","name":"Bali pages, breakdown new\/returning","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":"65","icon":"icon-business"},"subcategory":"","subcategory_order":"9999999","dimensions":{"row":{"Actions.PageTitle","CoreHome.VisitorReturning"}},"metrics":{"row":{"nb_uniq_visitors","pageviews","nb_visits"}},"segment_filter":"pageTitle=@bali","created_date":"2017-10-20 02:41:08","updated_date":"2017-10-20 02:41:08","status":"active","multiple_idsites":"","site":{"id":"1","name":"Demo Site"},"allowedToEdit":"0"},{"idcustomreport":"5","idsite":"1","revision":"0","report_type":"table","name":"Country by New\/returning with a filter","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":"65","icon":"icon-business"},"subcategory":"","subcategory_order":"9999999","dimensions":{"row":{"UserCountry.Country","CoreHome.VisitorReturning"}},"metrics":{"row":{"nb_uniq_visitors","goal_7_conversion","goal_7_conversion_uniq_visitors_rate"}},"segment_filter":"countryCode!=pl","created_date":"2018-01-26 03:51:11","updated_date":"2018-01-26 03:51:11","status":"active","multiple_idsites":"","site":{"id":"1","name":"Demo Site"},"allowedToEdit":"0"},{"idcustomreport":"8","idsite":"1","revision":"0","report_type":"evolution","name":"Evolution KPIs","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":"65","icon":"icon-business"},"subcategory":"","subcategory_order":"9999999","dimensions":"","metrics":{"row":{"nb_uniq_visitors","goal_7_conversion","goal_7_conversion_uniq_visitors_rate","goal_4_conversion"}},"segment_filter":"","created_date":"2018-04-03 02:55:32","updated_date":"2018-04-03 02:55:32","status":"active","multiple_idsites":"","site":{"id":"1","name":"Demo Site"},"allowedToEdit":"0"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="category",
     *                             type="object"
     *                         ),
     *                         @OA\Property(
     *                             property="dimensions",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="string"
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(
     *                             property="metrics",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="string"
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(
     *                             property="site",
     *                             type="object"
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"idcustomreport":1,"idsite":1,"revision":0,"report_type":"table","name":"Pages by New\/Returning visitor","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":65,"icon":"icon-business"},"subcategory":null,"subcategory_order":9999999,"dimensions":{"CoreHome.VisitorReturning","Actions.PageTitle"},"metrics":{"nb_uniq_visitors","nb_visits","pageviews"},"segment_filter":"","created_date":"2017-10-20 02:31:50","updated_date":"2017-10-20 02:31:50","status":"active","multiple_idsites":null,"site":{"id":1,"name":"Demo Site"},"allowedToEdit":false},{"idcustomreport":2,"idsite":1,"revision":0,"report_type":"table","name":"Bali pages, breakdown new\/returning","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":65,"icon":"icon-business"},"subcategory":null,"subcategory_order":9999999,"dimensions":{"Actions.PageTitle","CoreHome.VisitorReturning"},"metrics":{"nb_uniq_visitors","pageviews","nb_visits"},"segment_filter":"pageTitle=@bali","created_date":"2017-10-20 02:41:08","updated_date":"2017-10-20 02:41:08","status":"active","multiple_idsites":null,"site":{"id":1,"name":"Demo Site"},"allowedToEdit":false},{"idcustomreport":5,"idsite":1,"revision":0,"report_type":"table","name":"Country by New\/returning with a filter","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":65,"icon":"icon-business"},"subcategory":null,"subcategory_order":9999999,"dimensions":{"UserCountry.Country","CoreHome.VisitorReturning"},"metrics":{"nb_uniq_visitors","goal_7_conversion","goal_7_conversion_uniq_visitors_rate"},"segment_filter":"countryCode!=pl","created_date":"2018-01-26 03:51:11","updated_date":"2018-01-26 03:51:11","status":"active","multiple_idsites":null,"site":{"id":1,"name":"Demo Site"},"allowedToEdit":false},{"idcustomreport":8,"idsite":1,"revision":0,"report_type":"evolution","name":"Evolution KPIs","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":65,"icon":"icon-business"},"subcategory":null,"subcategory_order":9999999,"dimensions":{},"metrics":{"nb_uniq_visitors","goal_7_conversion","goal_7_conversion_uniq_visitors_rate","goal_4_conversion"},"segment_filter":"","created_date":"2018-04-03 02:55:32","updated_date":"2018-04-03 02:55:32","status":"active","multiple_idsites":null,"site":{"id":1,"name":"Demo Site"},"allowedToEdit":false}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="idcustomreport", type="integer"),
     *                         @OA\Property(property="idsite", type="integer"),
     *                         @OA\Property(property="revision", type="integer"),
     *                         @OA\Property(property="report_type", type="string"),
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(property="description", type="string"),
     *                         @OA\Property(
     *                             property="site",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer"),
     *                             @OA\Property(property="name", type="string")
     *                         ),
     *                         @OA\Property(property="subcategory", type={"string", "number", "integer", "boolean", "array", "object", "null"}),
     *                         @OA\Property(property="subcategory_order", type="integer"),
     *                         @OA\Property(property="segment_filter", type="string"),
     *                         @OA\Property(property="created_date", type="string"),
     *                         @OA\Property(property="updated_date", type="string"),
     *                         @OA\Property(property="status", type="string"),
     *                         @OA\Property(property="multiple_idsites", type={"string", "number", "integer", "boolean", "array", "object", "null"}),
     *                         @OA\Property(property="allowedToEdit", type="boolean")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a specific custom report configuration.
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report. [@example=1]
     * @return array The details of the configured custom report.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getConfiguredReport",
     *     operationId="CustomReports.getConfiguredReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report.",
     *         @OA\Schema(
     *             type="integer",
     *             example=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getConfiguredReport&idSite=1&idCustomReport=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getConfiguredReport&idSite=1&idCustomReport=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"idcustomreport":"1","idsite":"1","revision":"0","report_type":"table","name":"Pages by New\/Returning visitor","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":"65","icon":"icon-business"},"subcategory":"","subcategory_order":"9999999","dimensions":{"row":{"CoreHome.VisitorReturning","Actions.PageTitle"}},"metrics":{"row":{"nb_uniq_visitors","nb_visits","pageviews"}},"segment_filter":"","created_date":"2017-10-20 02:31:50","updated_date":"2017-10-20 02:31:50","status":"active","multiple_idsites":"","site":{"id":"1","name":"Demo Site"},"child_reports":"","multipleIdSites":"","allowedToEdit":"0"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="category",
     *                     type="object"
     *                 ),
     *                 @OA\Property(
     *                     property="dimensions",
     *                     type="object",
     *                     @OA\Property(
     *                         property="row",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Xml(name="row"),
     *                             additionalProperties=true
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="metrics",
     *                     type="object",
     *                     @OA\Property(
     *                         property="row",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Xml(name="row"),
     *                             additionalProperties=true
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="site",
     *                     type="object"
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"idcustomreport":1,"idsite":1,"revision":0,"report_type":"table","name":"Pages by New\/Returning visitor","description":"","category":{"id":"CustomReports_CustomReports","name":"Custom Reports","order":65,"icon":"icon-business"},"subcategory":null,"subcategory_order":9999999,"dimensions":{"CoreHome.VisitorReturning","Actions.PageTitle"},"metrics":{"nb_uniq_visitors","nb_visits","pageviews"},"segment_filter":"","created_date":"2017-10-20 02:31:50","updated_date":"2017-10-20 02:31:50","status":"active","multiple_idsites":null,"site":{"id":1,"name":"Demo Site"},"child_reports":{},"multipleIdSites":{},"allowedToEdit":false},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="idcustomreport", type="integer"),
     *                 @OA\Property(property="idsite", type="integer"),
     *                 @OA\Property(property="revision", type="integer"),
     *                 @OA\Property(property="report_type", type="string"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(
     *                     property="multipleIdSites",
     *                     type="array",
     *                     @OA\Items()
     *                 ),
     *                 @OA\Property(property="subcategory", type={"string", "number", "integer", "boolean", "array", "object", "null"}),
     *                 @OA\Property(property="subcategory_order", type="integer"),
     *                 @OA\Property(property="segment_filter", type="string"),
     *                 @OA\Property(property="created_date", type="string"),
     *                 @OA\Property(property="updated_date", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="multiple_idsites", type={"string", "number", "integer", "boolean", "array", "object", "null"}),
     *                 @OA\Property(property="allowedToEdit", type="boolean")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
     * Deletes the given custom report.
     *
     * When a custom report is deleted, its report will be no longer available in the API and tracked data for this
     * report might be removed at some point by the system.
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report to duplicate.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.deleteCustomReport",
     *     operationId="CustomReports.deleteCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to duplicate.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"success":""},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result")
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"result":"success","message":"ok"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="result", type="string"),
     *                 @OA\Property(property="message", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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
     * Pauses the given custom report.
     *
     * When a custom report is paused, its report will be no longer be archived
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report to pause.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.pauseCustomReport",
     *     operationId="CustomReports.pauseCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to pause.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(response=200, ref="#/components/responses/GenericSuccess"),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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
     * Resumes the given custom report.
     *
     * When a custom report is resumed, its report will start archiving again
     *
     * @param int $idSite
     * @param int $idCustomReport The ID of the custom report to resume.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.resumeCustomReport",
     *     operationId="CustomReports.resumeCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to resume.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(response=200, ref="#/components/responses/GenericSuccess"),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available categories that can be used in custom reports.
     *
     * @param int $idSite
     * @return array
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getAvailableCategories",
     *     operationId="CustomReports.getAvailableCategories",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableCategories&idSite=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableCategories&idSite=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"uniqueId":"General_Actions","name":"Behaviour","subcategories":{"row":{{"uniqueId":"customdimension2","name":"Page Author"},{"uniqueId":"customdimension4","name":"Page Location"},{"uniqueId":"customdimension5","name":"Page Type"},{"uniqueId":"VisitorInterest_Engagement","name":"Engagement"},{"uniqueId":"Transitions_Transitions","name":"Transitions"},{"uniqueId":"General_Downloads","name":"Downloads"},{"uniqueId":"Actions_SubmenuPagesEntry","name":"Entry pages"},{"uniqueId":"Actions_SubmenuPagesExit","name":"Exit pages"},{"uniqueId":"General_Outlinks","name":"Outlinks"},{"uniqueId":"Actions_SubmenuPageTitles","name":"Page titles"},{"uniqueId":"General_Pages","name":"Pages"},{"uniqueId":"Actions_SubmenuSitesearch","name":"Site Search"},{"uniqueId":"Events_Events","name":"Events"},{"uniqueId":"Contents_Contents","name":"Contents"},{"uniqueId":"PagePerformance_Performance","name":"Performance"},{"uniqueId":"UsersFlow_TopPaths","name":"Top Paths"},{"uniqueId":"UsersFlow_UsersFlow","name":"Users Flow"},{"uniqueId":"SearchEngineKeywordsPerformance_CrawlingErrors","name":"Crawling errors"}}}},{"uniqueId":"General_Visitors","name":"Visitors","subcategories":{"row":{{"uniqueId":"customdimension1","name":"User Type"},{"uniqueId":"DevicesDetection_Devices","name":"Devices"},{"uniqueId":"DevicesDetection_Software","name":"Software"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"UserCountry_SubmenuLocations","name":"Locations"},{"uniqueId":"VisitTime_SubmenuTimes","name":"Times"},{"uniqueId":"UserCountryMap_RealTimeMap","name":"Real-time Map"},{"uniqueId":"General_RealTime","name":"Real-time"},{"uniqueId":"Live_VisitorLog","name":"Visits Log"},{"uniqueId":"UserId_UserReportTitle","name":"User IDs"},{"uniqueId":"CustomVariables_CustomVariables","name":"Custom Variables"}}}},{"uniqueId":"Referrers_Referrers","name":"Acquisition","subcategories":{"row":{{"uniqueId":"Referrers_AIAssistants","name":"AI Assistants"},{"uniqueId":"Referrers_WidgetGetAll","name":"All Channels"},{"uniqueId":"Referrers_URLCampaignBuilder","name":"Campaign URL Builder"},{"uniqueId":"Referrers_Campaigns","name":"Campaigns"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"Referrers_SubmenuSearchEngines","name":"Search Engines & Keywords"},{"uniqueId":"Referrers_Socials","name":"Social Networks"},{"uniqueId":"Referrers_SubmenuWebsitesOnly","name":"Websites"},{"uniqueId":"SearchEngineKeywordsPerformance_CrawlingStats","name":"Crawling overview"}}}},{"uniqueId":"Goals_Goals","name":"Goals","subcategories":{"row":{{"uniqueId":"8","name":"Agoda click"},{"uniqueId":"7","name":"Liveaboard.com click"},{"uniqueId":"4","name":"New Job Application"},{"uniqueId":"6","name":"New Resume"},{"uniqueId":"10","name":"Newsletter Signup"},{"uniqueId":"9","name":"User Comments"},{"uniqueId":"5","name":"View Submit Job"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"MultiChannelConversionAttribution_MultiAttribution","name":"Multi Attribution"}}}}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="subcategories",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"uniqueId":"General_Actions","name":"Behaviour","subcategories":{{"uniqueId":"customdimension2","name":"Page Author"},{"uniqueId":"customdimension4","name":"Page Location"},{"uniqueId":"customdimension5","name":"Page Type"},{"uniqueId":"VisitorInterest_Engagement","name":"Engagement"},{"uniqueId":"Transitions_Transitions","name":"Transitions"},{"uniqueId":"General_Downloads","name":"Downloads"},{"uniqueId":"Actions_SubmenuPagesEntry","name":"Entry pages"},{"uniqueId":"Actions_SubmenuPagesExit","name":"Exit pages"},{"uniqueId":"General_Outlinks","name":"Outlinks"},{"uniqueId":"Actions_SubmenuPageTitles","name":"Page titles"},{"uniqueId":"General_Pages","name":"Pages"},{"uniqueId":"Actions_SubmenuSitesearch","name":"Site Search"},{"uniqueId":"Events_Events","name":"Events"},{"uniqueId":"Contents_Contents","name":"Contents"},{"uniqueId":"PagePerformance_Performance","name":"Performance"},{"uniqueId":"UsersFlow_TopPaths","name":"Top Paths"},{"uniqueId":"UsersFlow_UsersFlow","name":"Users Flow"},{"uniqueId":"SearchEngineKeywordsPerformance_CrawlingErrors","name":"Crawling errors"}}},{"uniqueId":"General_Visitors","name":"Visitors","subcategories":{{"uniqueId":"customdimension1","name":"User Type"},{"uniqueId":"DevicesDetection_Devices","name":"Devices"},{"uniqueId":"DevicesDetection_Software","name":"Software"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"UserCountry_SubmenuLocations","name":"Locations"},{"uniqueId":"VisitTime_SubmenuTimes","name":"Times"},{"uniqueId":"UserCountryMap_RealTimeMap","name":"Real-time Map"},{"uniqueId":"General_RealTime","name":"Real-time"},{"uniqueId":"Live_VisitorLog","name":"Visits Log"},{"uniqueId":"UserId_UserReportTitle","name":"User IDs"},{"uniqueId":"CustomVariables_CustomVariables","name":"Custom Variables"}}},{"uniqueId":"Referrers_Referrers","name":"Acquisition","subcategories":{{"uniqueId":"Referrers_AIAssistants","name":"AI Assistants"},{"uniqueId":"Referrers_WidgetGetAll","name":"All Channels"},{"uniqueId":"Referrers_URLCampaignBuilder","name":"Campaign URL Builder"},{"uniqueId":"Referrers_Campaigns","name":"Campaigns"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"Referrers_SubmenuSearchEngines","name":"Search Engines & Keywords"},{"uniqueId":"Referrers_Socials","name":"Social Networks"},{"uniqueId":"Referrers_SubmenuWebsitesOnly","name":"Websites"},{"uniqueId":"SearchEngineKeywordsPerformance_CrawlingStats","name":"Crawling overview"}}},{"uniqueId":"Goals_Goals","name":"Goals","subcategories":{{"uniqueId":"8","name":"Agoda click"},{"uniqueId":"7","name":"Liveaboard.com click"},{"uniqueId":"4","name":"New Job Application"},{"uniqueId":"6","name":"New Resume"},{"uniqueId":"10","name":"Newsletter Signup"},{"uniqueId":"9","name":"User Comments"},{"uniqueId":"5","name":"View Submit Job"},{"uniqueId":"General_Overview","name":"Overview"},{"uniqueId":"MultiChannelConversionAttribution_MultiAttribution","name":"Multi Attribution"}}}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="uniqueId", type="string"),
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(
     *                             property="subcategories",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 additionalProperties=true,
     *                                 @OA\Property(
     *                                     type="object",
     *                                     @OA\Property(property="uniqueId", type="string"),
     *                                     @OA\Property(property="name", type="string")
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available report types that can be used in custom reports.
     *
     * @return array
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getAvailableReportTypes",
     *     operationId="CustomReports.getAvailableReportTypes",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableReportTypes&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableReportTypes&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableReportTypes&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"key":"table","value":"Table"},{"key":"evolution","value":"Evolution"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"key":"table","value":"Table"},{"key":"evolution","value":"Evolution"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="key", type="string"),
     *                         @OA\Property(property="value", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="key    value
     * table    Table
     * evolution    Evolution"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available dimensions that can be used in custom reports.
     *
     * @param int $idSite
     * @return array
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getAvailableDimensions",
     *     operationId="CustomReports.getAvailableDimensions",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableDimensions&idSite=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableDimensions&idSite=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"category":"Visitor location","dimensions":{"row":{{"uniqueId":"UserCountry.City","name":"City","sqlSegment":"log_visit.location_city"},{"uniqueId":"UserCountry.Continent","name":"Continent","sqlSegment":"log_visit.location_country"},{"uniqueId":"UserCountry.Country","name":"Country","sqlSegment":"log_visit.location_country"},{"uniqueId":"UserLanguage.Language","name":"Language","sqlSegment":"log_visit.location_browser_lang"},{"uniqueId":"UserCountry.Latitude","name":"Latitude","sqlSegment":"log_visit.location_latitude"},{"uniqueId":"UserCountry.Longitude","name":"Longitude","sqlSegment":"log_visit.location_longitude"},{"uniqueId":"UserCountry.Region","name":"Region","sqlSegment":"log_visit.location_region"}}},"orderId":"7"},{"category":"Events","dimensions":{"row":{{"uniqueId":"Events.EventAction","name":"Event Action","sqlSegment":"log_link_visit_action.idaction_event_action"},{"uniqueId":"Events.EventCategory","name":"Event Category","sqlSegment":"log_link_visit_action.idaction_event_category"},{"uniqueId":"Events.EventName","name":"Event Name","sqlSegment":"log_link_visit_action.idaction_name"},{"uniqueId":"Events.EventUrl","name":"Event URL","sqlSegment":"log_link_visit_action.idaction_url"},{"uniqueId":"Events.EventValue","name":"Event Value","sqlSegment":"log_link_visit_action.custom_float"}}},"orderId":"12"},{"category":"Acquisition","dimensions":{"row":{{"uniqueId":"AdvertisingConversionExport.AdClickId","name":"Ad Click ID","sqlSegment":"log_clickid.adclickid"},{"uniqueId":"AdvertisingConversionExport.AdProvider","name":"Ad Provider","sqlSegment":"log_clickid.adprovider"},{"uniqueId":"MarketingCampaignsReporting.CampaignContent","name":"Campaign Content","sqlSegment":"log_visit.campaign_content"},{"uniqueId":"MarketingCampaignsReporting.CampaignGroup","name":"Campaign Group","sqlSegment":"log_visit.campaign_group"},{"uniqueId":"MarketingCampaignsReporting.CampaignId","name":"Campaign Id","sqlSegment":"log_visit.campaign_id"},{"uniqueId":"MarketingCampaignsReporting.CampaignKeyword","name":"Campaign Keyword","sqlSegment":"log_visit.campaign_keyword"},{"uniqueId":"MarketingCampaignsReporting.CampaignMedium","name":"Campaign Medium","sqlSegment":"log_visit.campaign_medium"},{"uniqueId":"MarketingCampaignsReporting.CampaignName","name":"Campaign Name","sqlSegment":"log_visit.campaign_name"},{"uniqueId":"MarketingCampaignsReporting.CampaignPlacement","name":"Campaign Placement","sqlSegment":"log_visit.campaign_placement"},{"uniqueId":"MarketingCampaignsReporting.CampaignSource","name":"Campaign Source","sqlSegment":"log_visit.campaign_source"},{"uniqueId":"Referrers.ReferrerType","name":"Channel Type","sqlSegment":"log_visit.referer_type"},{"uniqueId":"Referrers.Keyword","name":"Keyword","sqlSegment":"log_visit.referer_keyword"},{"uniqueId":"Referrers.ReferrerName","name":"Referrer Name","sqlSegment":"log_visit.referer_name"},{"uniqueId":"Referrers.ReferrerUrl","name":"Referrer URL","sqlSegment":"log_visit.referer_url"}}},"orderId":"15"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="dimensions",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"category":"Visitor location","dimensions":{{"uniqueId":"UserCountry.City","name":"City","sqlSegment":"log_visit.location_city"},{"uniqueId":"UserCountry.Continent","name":"Continent","sqlSegment":"log_visit.location_country"},{"uniqueId":"UserCountry.Country","name":"Country","sqlSegment":"log_visit.location_country"},{"uniqueId":"UserLanguage.Language","name":"Language","sqlSegment":"log_visit.location_browser_lang"},{"uniqueId":"UserCountry.Latitude","name":"Latitude","sqlSegment":"log_visit.location_latitude"},{"uniqueId":"UserCountry.Longitude","name":"Longitude","sqlSegment":"log_visit.location_longitude"},{"uniqueId":"UserCountry.Region","name":"Region","sqlSegment":"log_visit.location_region"}},"orderId":7},{"category":"Events","dimensions":{{"uniqueId":"Events.EventAction","name":"Event Action","sqlSegment":"log_link_visit_action.idaction_event_action"},{"uniqueId":"Events.EventCategory","name":"Event Category","sqlSegment":"log_link_visit_action.idaction_event_category"},{"uniqueId":"Events.EventName","name":"Event Name","sqlSegment":"log_link_visit_action.idaction_name"},{"uniqueId":"Events.EventUrl","name":"Event URL","sqlSegment":"log_link_visit_action.idaction_url"},{"uniqueId":"Events.EventValue","name":"Event Value","sqlSegment":"log_link_visit_action.custom_float"}},"orderId":12},{"category":"Acquisition","dimensions":{{"uniqueId":"AdvertisingConversionExport.AdClickId","name":"Ad Click ID","sqlSegment":"log_clickid.adclickid"},{"uniqueId":"AdvertisingConversionExport.AdProvider","name":"Ad Provider","sqlSegment":"log_clickid.adprovider"},{"uniqueId":"MarketingCampaignsReporting.CampaignContent","name":"Campaign Content","sqlSegment":"log_visit.campaign_content"},{"uniqueId":"MarketingCampaignsReporting.CampaignGroup","name":"Campaign Group","sqlSegment":"log_visit.campaign_group"},{"uniqueId":"MarketingCampaignsReporting.CampaignId","name":"Campaign Id","sqlSegment":"log_visit.campaign_id"},{"uniqueId":"MarketingCampaignsReporting.CampaignKeyword","name":"Campaign Keyword","sqlSegment":"log_visit.campaign_keyword"},{"uniqueId":"MarketingCampaignsReporting.CampaignMedium","name":"Campaign Medium","sqlSegment":"log_visit.campaign_medium"},{"uniqueId":"MarketingCampaignsReporting.CampaignName","name":"Campaign Name","sqlSegment":"log_visit.campaign_name"},{"uniqueId":"MarketingCampaignsReporting.CampaignPlacement","name":"Campaign Placement","sqlSegment":"log_visit.campaign_placement"},{"uniqueId":"MarketingCampaignsReporting.CampaignSource","name":"Campaign Source","sqlSegment":"log_visit.campaign_source"},{"uniqueId":"Referrers.ReferrerType","name":"Channel Type","sqlSegment":"log_visit.referer_type"},{"uniqueId":"Referrers.Keyword","name":"Keyword","sqlSegment":"log_visit.referer_keyword"},{"uniqueId":"Referrers.ReferrerName","name":"Referrer Name","sqlSegment":"log_visit.referer_name"},{"uniqueId":"Referrers.ReferrerUrl","name":"Referrer URL","sqlSegment":"log_visit.referer_url"}},"orderId":15}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="category", type="string"),
     *                         @OA\Property(
     *                             property="dimensions",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 additionalProperties=true,
     *                                 @OA\Property(
     *                                     type="object",
     *                                     @OA\Property(property="uniqueId", type="string"),
     *                                     @OA\Property(property="name", type="string"),
     *                                     @OA\Property(property="sqlSegment", type="string")
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(property="orderId", type="integer")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getAvailableDimensions($idSite)
    {
        Piwik::checkUserIsNotAnonymous();
        Piwik::checkUserHasSomeViewAccess();

        $dimensions = $this->columnsProvider->getAllDimensions();

        $rows = array();

        $dimensionsToIgnore = array(
            'Actions.IdPageview', 'CoreHome.VisitId',
            'DevicesDetection.OsVersion', // only makes sense in combination with Os Family
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available metrics that can be used in custom reports.
     *
     * @param int $idSite
     * @return array
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getAvailableMetrics",
     *     operationId="CustomReports.getAvailableMetrics",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableMetrics&idSite=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=CustomReports.getAvailableMetrics&idSite=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"category":"Visitor location","metrics":{"row":{{"uniqueId":"nb_uniq_usercountry_city","name":"Unique Cities","description":"The unique number of Cities. When viewing a period that is not day, then this metric will become ""Sum of Unique Cities"". In such case, if the same Cities appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_continent","name":"Unique Continents","description":"The unique number of Continents. When viewing a period that is not day, then this metric will become ""Sum of Unique Continents"". In such case, if the same Continents appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_country","name":"Unique Countries","description":"The unique number of Countries. When viewing a period that is not day, then this metric will become ""Sum of Unique Countries"". In such case, if the same Countries appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_userlanguage_language","name":"Unique Languages","description":"The unique number of Languages. When viewing a period that is not day, then this metric will become ""Sum of Unique Languages"". In such case, if the same Languages appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_latitude","name":"Unique Latitudes","description":"The unique number of Latitudes. When viewing a period that is not day, then this metric will become ""Sum of Unique Latitudes"". In such case, if the same Latitudes appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_longitude","name":"Unique Longitudes","description":"The unique number of Longitudes. When viewing a period that is not day, then this metric will become ""Sum of Unique Longitudes"". In such case, if the same Longitudes appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_region","name":"Unique Regions","description":"The unique number of Regions. When viewing a period that is not day, then this metric will become ""Sum of Unique Regions"". In such case, if the same Regions appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."}}},"orderId":"7"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="metrics",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"category":"Visitor location","metrics":{{"uniqueId":"nb_uniq_usercountry_city","name":"Unique Cities","description":"The unique number of Cities. When viewing a period that is not day, then this metric will become ""Sum of Unique Cities"". In such case, if the same Cities appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_continent","name":"Unique Continents","description":"The unique number of Continents. When viewing a period that is not day, then this metric will become ""Sum of Unique Continents"". In such case, if the same Continents appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_country","name":"Unique Countries","description":"The unique number of Countries. When viewing a period that is not day, then this metric will become ""Sum of Unique Countries"". In such case, if the same Countries appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_userlanguage_language","name":"Unique Languages","description":"The unique number of Languages. When viewing a period that is not day, then this metric will become ""Sum of Unique Languages"". In such case, if the same Languages appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_latitude","name":"Unique Latitudes","description":"The unique number of Latitudes. When viewing a period that is not day, then this metric will become ""Sum of Unique Latitudes"". In such case, if the same Latitudes appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_longitude","name":"Unique Longitudes","description":"The unique number of Longitudes. When viewing a period that is not day, then this metric will become ""Sum of Unique Longitudes"". In such case, if the same Longitudes appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."},{"uniqueId":"nb_uniq_usercountry_region","name":"Unique Regions","description":"The unique number of Regions. When viewing a period that is not day, then this metric will become ""Sum of Unique Regions"". In such case, if the same Regions appear in 2 or more days within the selected period, then it will be counted as 2 or the total number of days it has appeared and not 1."}},"orderId":7}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="category", type="string"),
     *                         @OA\Property(
     *                             property="metrics",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 additionalProperties=true,
     *                                 @OA\Property(
     *                                     type="object",
     *                                     @OA\Property(property="uniqueId", type="string"),
     *                                     @OA\Property(property="name", type="string"),
     *                                     @OA\Property(property="description", type="string")
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(property="orderId", type="integer")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get report data for a previously created custom report.
     *
     * @param int    $idSite
     * @param string $period
     * @param string $date
     * @param int $idCustomReport The ID of the custom report to look up data for.
     * @param string $segment
     * @param bool $expanded
     * @param bool $flat
     * @param int $idSubtable
     * @param string $columns
     *
     * @return DataTable\DataTableInterface
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=CustomReports.getCustomReport",
     *     operationId="CustomReports.getCustomReport",
     *     tags={"CustomReports"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         required=true,
     *         description="The ID of the custom report to look up data for.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="date",
     *         in="query",
     *         required=true,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idCustomReport",
     *         in="query",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="segment",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="expanded",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *             default=false
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="flat",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *             default=false
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idSubtable",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="columns",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/index.php?module=API&method=CustomReports.getCustomReport&idSite=1&idCustomReport=5&period=day&date=today&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/index.php?module=API&method=CustomReports.getCustomReport&idSite=1&idCustomReport=5&period=day&date=today&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/index.php?module=API&method=CustomReports.getCustomReport&idSite=1&idCustomReport=5&period=day&date=today&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"label":"Australia","nb_uniq_visitors":"1","goal_7_conversion":"0","level":"1","goal_7_conversion_uniq_visitors_rate":"0","segment":"countryCode==au;countryCode!=pl"},{"label":"United States","nb_uniq_visitors":"1","goal_7_conversion":"0","level":"1","goal_7_conversion_uniq_visitors_rate":"0","segment":"countryCode==us;countryCode!=pl"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"label":"Australia","nb_uniq_visitors":1,"goal_7_conversion":0,"level":1,"goal_7_conversion_uniq_visitors_rate":0,"segment":"countryCode==au;countryCode!=pl"},{"label":"United States","nb_uniq_visitors":1,"goal_7_conversion":0,"level":1,"goal_7_conversion_uniq_visitors_rate":0,"segment":"countryCode==us;countryCode!=pl"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="label", type="string"),
     *                         @OA\Property(property="nb_uniq_visitors", type="integer"),
     *                         @OA\Property(property="goal_7_conversion", type="integer"),
     *                         @OA\Property(property="level", type="integer"),
     *                         @OA\Property(property="goal_7_conversion_uniq_visitors_rate", type="integer"),
     *                         @OA\Property(property="segment", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="label    nb_uniq_visitors    goal_7_conversion    level    goal_7_conversion_uniq_visitors_rate    metadata_segment
     * Australia    1    0    1    0    ""countryCode==au;countryCode!=pl""
     * United States    1    0    1    0    ""countryCode==us;countryCode!=pl"""
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
