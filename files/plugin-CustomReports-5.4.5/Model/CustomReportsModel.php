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

namespace Piwik\Plugins\CustomReports\Model;

use Piwik\API\Request;
use Piwik\ArchiveProcessor;
use Piwik\Category\CategoryList;
use Piwik\Columns\MetricsList;
use Piwik\Container\StaticContainer;
use Piwik\DataAccess\ArchiveWriter;
use Piwik\DataAccess\LogAggregator;
use Piwik\Date;
use Piwik\Period;
use Piwik\Piwik;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugin\Metric;
use Piwik\Plugin\ProcessedMetric;
use Piwik\Plugins\CustomReports\Configuration;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;
use Piwik\Plugins\CustomReports\Input\Category;
use Piwik\Plugins\CustomReports\Input\Dimensions;
use Piwik\Plugins\CustomReports\Input\Metrics;
use Piwik\Plugins\CustomReports\Input\Name;
use Exception;
use Piwik\Plugins\CustomReports\Input\Description;
use Piwik\Plugins\CustomReports\Input\ReportType;
use Piwik\Plugins\CustomReports\Input\SegmentFilter;
use Piwik\Plugins\CustomReports\Input\Subcategory;
use Piwik\Plugins\CustomReports\ReportType\Evolution;
use Piwik\Segment;
use Piwik\Site;
use Piwik\Url;

class CustomReportsModel
{
    public const STATUS_ACTIVE = 'active';
    public const STATUS_DELETED = 'deleted';
    public const STATUS_PAUSED = 'paused';

    /**
     * @var CustomReportsDao
     */
    private $dao;

    /**
     * @var CategoryList
     */
    private $categoryList;

    public function __construct(CustomReportsDao $dao)
    {
        $this->dao = $dao;
    }

    public function createCustomReport($idSite, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, $createdDate, $multipleIdSites)
    {
        if ($reportType === Evolution::ID) {
            $dimensions = array();
        }

        $this->validateReportValues($idSite, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, [], $multipleIdSites);

        $status = self::STATUS_ACTIVE;

        $idCustomReport = $this->dao->addCustomReport($idSite, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, $status, $createdDate, $multipleIdSites);

        return $idCustomReport;
    }

    private function areMetricsEqual($metricNew, $metricOld)
    {
        if (!is_array($metricNew) || !is_array($metricOld)) {
            return false;
        }

        if (count($metricNew) > count($metricOld)) {
            // there are now more metrics in the new version...
            return false;
        }

        if (array_diff($metricNew, $metricOld) === array_diff($metricOld, $metricNew)) {
            return true; // they are still the same metrics
        }

        if (array_diff($metricNew, $metricOld) === array()) {
            return true; // the new metric contains still all of the old metrics so we do not need to invalidate reports with a new revision
        }

        return false;
    }

    public function updateCustomReport($idSite, $idCustomReport, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, $updatedDate, $subCategoryReportIds, $multipleIdSites)
    {
        if ($reportType === Evolution::ID) {
            $dimensions = array();
        }

        $this->validateReportValues($idSite, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, $subCategoryReportIds, $multipleIdSites);

        $report = $this->getCustomReportById($idCustomReport, $idSite);

        $revision = $report['revision'];

        if (
            $report['dimensions'] !== $dimensions
            || $reportType !== $report['report_type']
            || $segmentFilter !== $report['segment_filter']
            || !$this->areMetricsEqual($metrics, $report['metrics'])
        ) {
            // we do not need to create a new revision if metrics only has a different order as we would still have all the data
            $revision++;
        }

        $columns = array(
            'idsite' => $idSite,
            'name' => $name,
            'description' => $description,
            'report_type' => $reportType,
            'dimensions' => $dimensions,
            'metrics' => $metrics,
            'segment_filter' => $segmentFilter,
            'subcategory' => $subcategoryId,
            'category' => $categoryId,
            'updated_date' => $updatedDate,
            'revision' => $revision,
            'multiple_idsites' => '',
        );
        if (!empty($multipleIdSites)) {
            $columns['idsite'] = -1;
            $columns['multiple_idsites'] = implode(',', $multipleIdSites);
        }
        // idsite might change when configuring a report so we cannot use $idSite but need to use the currently stored
        // idsite in order to update the report!

        $this->updateReportColumns($report['idsite'], $idCustomReport, $columns);

        if (!empty($subCategoryReportIds)) {
            $this->updateSubCategoryReportsOrder($subCategoryReportIds, $idSite);
        }
    }

    /**
     * @param $idSite
     * @param $idCustomReport
     * @return array|false
     * @throws \Exception
     */
    public function getCustomReport($idSite, $idCustomReport)
    {
        $report = $this->dao->getCustomReport($idSite, $idCustomReport);
        return $this->enrichReport($report, false, true);
    }

    /**
     * @param $idCustomReport
     * @param $idSite
     * @return array|false
     * @throws \Exception
     */
    public function getCustomReportById($idCustomReport, $idSite)
    {
        $report = $this->dao->getCustomReportById($idCustomReport, $idSite);
        return $this->enrichReport($report, false, true);
    }

    /**
     * @return array
     */
    public function getAllCustomReportsForSite($idSite, $skipCategoryMetadata = false, $skipEnrich = false)
    {
        $reports = $this->dao->getCustomReports($idSite);
        if ($skipEnrich) {
            return $reports;
        }

        return $this->enrichReports($reports, $skipCategoryMetadata);
    }

    private function enrichReports($reports, $skipCategoryMetadata = false)
    {
        if (empty($reports)) {
            return array();
        }

        foreach ($reports as $index => $report) {
            $reports[$index] = $this->enrichReport($report, $skipCategoryMetadata);
        }

        return $reports;
    }

    private function enrichReport($report, $skipCategoryMetadata = false, $addChildReports = false)
    {
        if (empty($report)) {
            return $report;
        }

        if (empty($report['idsite'])) {
            $report['site'] = array('id' => $report['idsite'], 'name' => Piwik::translate('General_MultiSitesSummary'));
        } else {
            $report['site'] = array('id' => $report['idsite'], 'name' => Site::getNameFor($report['idsite']));
        }

        if (!$skipCategoryMetadata) {
            $category = $report['category'];
            $report['category'] = $this->buildCategoryMetadata($category);
            $report['subcategory'] = $this->buildSubcategoryMetadata($category, $report['subcategory']);
        }

        if ($addChildReports) {
            $report['child_reports'] = $this->dao->getChildReports($report['idsite'], $report['idcustomreport']);

            // Since child reports are added for single reports so add multiple_sites info for single reports only
            $report['multipleIdSites'] = $report['multiple_idsites'] ? $this->getMultipleIdSitesInfo(explode(',', $report['multiple_idsites'])) : [];
        }

        return $report;
    }

    private function getCategoryList()
    {
        if (!$this->categoryList) {
            $this->categoryList = CategoryList::get();
        }
        return $this->categoryList;
    }

    /**
     * Consist API return with API.getWidgetMetadata and API.getReportingPages...
     * @param string $categoryId
     * @return array
     */
    private function buildCategoryMetadata($categoryId)
    {
        if (empty($categoryId)) {
            return array(
                'id'    => CustomReportsDao::DEFAULT_CATEGORY,
                'name'  => Piwik::translate(CustomReportsDao::DEFAULT_CATEGORY),
                'order' => 999,
                'icon' => '',
            );
        }

        $category = $this->getCategoryList()->getCategory($categoryId);

        if (!empty($category)) {
            $name = method_exists($category, 'getDisplayName') ? $category->getDisplayName() : Piwik::translate($category->getId());

            return array(
                'id'    => (string) $category->getId(),
                'name'  => $name,
                'order' => $category->getOrder(),
                'icon' => $category->getIcon(),
            );
        }

        return array(
            'id'    => (string) $categoryId,
            'name'  => Piwik::translate($categoryId),
            'order' => 999,
            'icon' => '',
        );
    }

    /**
     * Consist API return with API.getWidgetMetadata and API.getReportingPages...
     * @param Subcategory|null $subcategory
     * @return array
     */
    private function buildSubcategoryMetadata($categoryId, $subcategoryId)
    {
        if (empty($subcategoryId)) {
            return null;
        }

        if (!empty($categoryId)) {
            $category = $this->getCategoryList()->getCategory($categoryId);
        } else {
            $category = null;
        }

        if (!empty($category)) {
            $subcategory = $category->getSubcategory($subcategoryId);

            if (!empty($subcategory)) {
                return array(
                    'id'    => (string) $subcategory->getId(),
                    'name'  => Piwik::translate($subcategory->getName()),
                    'order' => $subcategory->getOrder(),
                );
            }
        }

        return array(
            'id'    => (string) $subcategoryId,
            'name'  => Piwik::translate((string) $subcategoryId),
            'order' => 999,
        );
    }

    public function checkReportExists($idSite, $idCustomReport)
    {
        $report = $this->dao->getCustomReport($idSite, $idCustomReport);

        if (empty($report)) {
            throw new Exception(Piwik::translate('CustomReports_ErrorReportDoesNotExist'));
        }
    }

    public function deactivateReport($idSite, $idCustomReport, $customReportName = '')
    {
        $columns = array('status' => self::STATUS_DELETED);
        if (!empty($customReportName)) {
            //Since the unique index is created using combination of idsite+name, just soft deleting will not allow to create a new form with deleted form name, so we just update the name too when marking the status as deleted
            $columns['name'] = 'deleted-' . $idCustomReport . '-' . $customReportName;
        }
        $this->updateReportColumns($idSite, $idCustomReport, $columns);
    }

    public function pauseReport($idSite, $idCustomReport, $customReportName = '')
    {
        $columns = array('status' => self::STATUS_PAUSED);
        $this->updateReportColumns($idSite, $idCustomReport, $columns);
    }

    public function resumeReport($idSite, $idCustomReport, $customReportName = '')
    {
        $columns = array('status' => self::STATUS_ACTIVE);
        $this->updateReportColumns($idSite, $idCustomReport, $columns);
    }

    protected function getCurrentDateTime()
    {
        return Date::now()->getDatetime();
    }

    private function validateReportValues($idSite, $name, $description, $reportType, $dimensions, $metrics, $segmentFilter, $categoryId, $subcategoryId, $subCategoryReportIds = [], $multipleIdSites = [])
    {
        $nameObj = new Name($name);
        $nameObj->check();

        $descriptionObj = new Description($description);
        $descriptionObj->check();

        $typeObj = new ReportType($reportType);
        $typeObj->check();

        $categoryObj = new Category($categoryId);
        $categoryObj->check();

        $subcategoryObj = new Subcategory($subcategoryId);
        $subcategoryObj->check();

        if (!empty($multipleIdSites)) {
            foreach ($multipleIdSites as $multipleIdSite) {
                $dimensionsObj = new Dimensions($dimensions, $multipleIdSite);
                $dimensionsObj->check();

                $metricsObj = new Metrics($metrics, $multipleIdSite);
                $metricsObj->check();
            }
        } else {
            $dimensionsObj = new Dimensions($dimensions, $idSite);
            $dimensionsObj->check();

            $metricsObj = new Metrics($metrics, $idSite);
            $metricsObj->check();
        }

        if (!empty($multipleIdSites)) {
            $idSite = $multipleIdSites;
        } elseif ($idSite === '0' || $idSite === 0 || $idSite === 'all') {
            // just fetching some sites as we have to pass them to the segment selector
            $idSite = Request::processRequest('SitesManager.getSitesIdWithAtLeastViewAccess');
        } elseif (!empty($idSite)) {
            $idSite = array($idSite);
        }

        $segment = new SegmentFilter($segmentFilter, $idSite);
        $segment->check();

        $type = \Piwik\Plugins\CustomReports\ReportType\ReportType::factory($reportType);

        if ($type->needsDimensions() && empty($dimensions)) {
            throw new Exception(Piwik::translate('CustomReports_ErrorMissingDimension'));
        }

        $maxDimensions = StaticContainer::get(Configuration::class)->getMaxDimensions();
        if (!empty($dimensions) && is_array($dimensions) && count($dimensions) > $maxDimensions) {
            throw new Exception(Piwik::translate('CustomReports_ErrorTooManyDimension', $maxDimensions));
        }

        if (!empty($subCategoryReportIds) && count($subCategoryReportIds) != count($this->dao->getReportIds($subCategoryReportIds))) {
            throw new Exception(Piwik::translate('CustomReports_ErrorInvalidSubCategoryReport'));
        }

        $this->validateQuery($idSite, $dimensions, $metrics, $segmentFilter, $reportType);
    }

    public function deactivateReportsForSite($idSite)
    {
        foreach ($this->dao->getCustomReports($idSite) as $report) {
            // getCustomReports also returns sites for "all websites"... we need to make sure to not delete those.
            if (!empty($report['idsite']) && $report['idsite'] == $idSite) {
                $this->deactivateReport($idSite, $report['idcustomreport'], $report['name']);
            }
        }
    }

    private function updateReportColumns($idSite, $idCustomReport, $columns)
    {
        if (!isset($columns['updated_date'])) {
            $columns['updated_date'] = $this->getCurrentDateTime();
        }
        $this->dao->updateColumns($idSite, $idCustomReport, $columns);
    }

    private function updateSubCategoryReportsOrder($subCategoryReportIds, $idSite)
    {
        if (!empty($subCategoryReportIds)) {
            foreach ($subCategoryReportIds as $subCategoryReportIdIndex => $subCategoryReportId) {
                $this->dao->updateReportOrder($subCategoryReportId, $subCategoryReportIdIndex, $idSite);
            }
        }
    }

    private function getMultipleIdSitesInfo($idSites)
    {
        $sitesInfo = [];

        if (!empty($idSites)) {
            foreach ($idSites as $idSite) {
                if (empty($idSite)) {
                    $sitesInfo[] = array('idsite' => $idSite, 'name' => Piwik::translate('General_MultiSitesSummary'));
                } else {
                    // If we don't do this, it will fail for admin users who can just view the edit-report, but has no access to all the sites
                    \Piwik\Access::doAsSuperUser(function () use ($idSite, &$sitesInfo) {
                        $sitesInfo[] = array('idsite' => $idSite, 'name' => Site::getNameFor($idSite));
                    });
                }
            }
        }

        return $sitesInfo;
    }

    private function validateQuery($idSites, $dimensions, $metrics, $segmentFilter, $reportType)
    {
        $idSite = $idSites[0];
        $report = [
            'idsite' => $idSite,
            'dimensions' => $dimensions,
            'metrics' => $metrics,
            'segment_filter' => $segmentFilter,
            'report_type' => $reportType,
        ];
        $recordBuilder = StaticContainer::getContainer()->make(\Piwik\Plugins\CustomReports\RecordBuilders\CustomReport::class, ['report' => $report]);
        try {
            $recordBuilder->aggregateReport($this->makeArchiveProcessor($idSite), $idSite, [], $isDryRun = true);
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            if (stripos($message, 'be joined for segmentation') !== false) {
                $faqLink = Url::addCampaignParametersToMatomoLink('https://matomo.org/faq/custom-reports/how-to-resolve-errors-when-using-different-dimension-combinations-in-matomo/', null, null, 'App.CustomReports.validateQuery');
                $message = Piwik::translate('CustomReports_NoSegmentationJoinExceptionMessage', ['<a href="' . $faqLink . '" target="_blank" rel="noopener noreferrer">', '</a>']);
            }
            throw new \Exception($message);
        }
    }

    private function makeArchiveProcessor($idSite, $date = 'today', $period = 'day', $archiveOnlyReport = []): ArchiveProcessor
    {
        $period = Period\Factory::build($period, $date);
        $segment = new Segment('', array($idSite));

        $params = new ArchiveProcessor\Parameters(new Site($idSite), $period, $segment);
        if (!empty($archiveOnlyReport)) {
            $params->setArchiveOnlyReport($archiveOnlyReport);
        }
        $writer = new ArchiveWriter($params);
        $logAggregator = new LogAggregator($params);
        $processor = new ArchiveProcessor($params, $writer, $logAggregator);

        return $processor;
    }

    /**
     * @return Metric[]
     */
    public function getArchivableMetricsInReport(array $report): array
    {
        $metrics = array();

        if (!empty($report['metrics'])) {
            foreach ($report['metrics'] as $metric) {
                $metrics = $this->getMetrics($metrics, $metric);
            }
        }

        return $metrics;
    }

    /**
     * @return Metric[]
     */
    private function getMetrics(array $metricInstances, string $metricName): array
    {
        $metricsList = MetricsList::get();
        $metricInstance = $metricsList->getMetric($metricName);

        if ($metricInstance instanceof ArchivedMetric) {
            if (!in_array($metricInstance, $metricInstances, $strict = true)) {
                $metricInstances[] = $metricInstance;
            }
        } elseif ($metricInstance instanceof ProcessedMetric) {
            $depMetrics = $metricInstance->getDependentMetrics();
            foreach ($depMetrics as $depMetric) {
                $metricInstances = $this->getMetrics($metricInstances, $depMetric);
            }
        }

        return $metricInstances;
    }
}
