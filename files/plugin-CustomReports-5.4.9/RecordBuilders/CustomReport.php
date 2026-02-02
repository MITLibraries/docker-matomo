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

namespace Piwik\Plugins\CustomReports\RecordBuilders;

use Piwik\ArchiveProcessor;
use Piwik\ArchiveProcessor\Record;
use Piwik\ArchiveProcessor\RecordBuilder;
use Piwik\Columns\Dimension;
use Piwik\Columns\DimensionsProvider;
use Piwik\Columns\MetricsList;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Log;
use Piwik\Piwik;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugins\CustomDimensions\CustomDimension;
use Piwik\Plugins\CustomReports\Configuration;
use Piwik\Plugins\CustomReports\Archiver;
use Piwik\Plugins\CustomReports\Archiver\ExecutionPlan;
use Piwik\Plugins\CustomReports\Archiver\NotJoinableException;
use Piwik\Plugins\CustomReports\Archiver\QueryBuilder;
use Piwik\Plugins\CustomReports\GetCustomReport;
use Piwik\Plugins\CustomReports\ReportType\Evolution;
use Piwik\Plugins\CustomReports\ReportType\Table;
use Piwik\Updater\Migration\Db as DbMigration;
use Piwik\Plugin;

class CustomReport extends RecordBuilder
{
    /**
     * @var array
     */
    private $report;

    /**
     * @var \Piwik\Columns\DimensionsProvider
     */
    private $dimension;

    /**
     * @var MetricsList
     */
    private $metricsList;

    /**
     * @var \Piwik\Plugins\CustomReports\Configuration
     */
    private $configuration;

    /**
     * @var int
     */
    private $doneLevel = 0;

    public function __construct(array $report, DimensionsProvider $dimension, Configuration $configuration)
    {
        parent::__construct();

        $this->report = $report;
        $this->dimension = $dimension;
        $this->metricsList = MetricsList::get();
        $this->configuration = $configuration;

        $noOfDimensions = (!empty($this->report['dimensions']) ? count($this->report['dimensions']) : 0);
        $this->maxRowsInTable = $this->configuration->getArchiveMaxRowsInMainTable($noOfDimensions);
        $this->maxRowsInSubtable = $this->configuration->getArchiveMaxRowsInSubTable($noOfDimensions);

        $metrics = $this->getArchivableMetricsInReport();

        $orderBy = null;
        if (!empty($metrics)) {
            $metricOrderBy = reset($metrics);
            if (!empty($metricOrderBy) && is_object($metricOrderBy)) {
                $orderBy = $metricOrderBy->getName();
            }
        }

        $this->columnToSortByBeforeTruncation = $orderBy;

        $this->columnAggregationOps = $this->getMetricAggregations();
    }

    public function getRecordMetadata(ArchiveProcessor $archiveProcessor): array
    {
        $report = $this->report;

        $periodLabel = $archiveProcessor->getParams()->getPeriod()->getLabel();
        $isMultiPeriod = $periodLabel != 'day';

        $metricToSort = $this->columnToSortByBeforeTruncation;
        if ($isMultiPeriod) {
            $metricToSort = $this->getMetricToSortMultiPeriod();
        }

        $records = [];

        $record = Record::make(Record::TYPE_BLOB, Archiver::makeRecordName($report['idcustomreport'], $report['revision']));
        if ($metricToSort) {
            $record->setColumnToSortByBeforeTruncation($metricToSort);
        }
        $records[] = $record;

        if ($report['report_type'] == Evolution::ID) {
            $metrics = $this->getArchivableMetricsInReport();
            foreach ($metrics as $metric) {
                if ($isMultiPeriod && $this->shouldAggregateRawDataForMultiPeriodMetric($metric, $periodLabel)) {
                    continue; // these are aggregated in buildMultiplePeriod() manually
                }

                $recordName = Archiver::makeEvolutionRecordName($report['idcustomreport'], $report['revision'], $metric->getName());
                $records[] = Record::make(Record::TYPE_NUMERIC, $recordName);
            }
        }

        return $records;
    }

    // public for use in CustomReports\Controller.php
    public function aggregate(ArchiveProcessor $archiveProcessor): array
    {
        $idSite = $archiveProcessor->getParams()->getSite()->getId();
        if (empty($idSite)) {
            return [];
        }

        $this->doneLevel = 0;

        $records = $this->aggregateReport($archiveProcessor, $idSite);
        return $records;
    }

    public function buildForNonDayPeriod(ArchiveProcessor $archiveProcessor): void
    {
        parent::buildForNonDayPeriod($archiveProcessor);

        if ($this->report['report_type'] != Evolution::ID) {
            return;
        }

        // handle metrics that must be aggregated from raw data for multiple periods (ie unique metrics)
        $idSite = $archiveProcessor->getParams()->getSite()->getId();
        if (empty($idSite)) {
            return;
        }

        $periodLabel = $archiveProcessor->getParams()->getPeriod()->getLabel();
        $metrics = $this->getArchivableMetricsInReport();

        $rawDataMetricNames = [];
        foreach ($metrics as $metric) {
            if ($this->shouldAggregateRawDataForMultiPeriodMetric($metric, $periodLabel)) {
                $rawDataMetricNames[] = $metric->getName();
            }
        }

        if (!empty($rawDataMetricNames)) {
            $aggregatedRecords = $this->aggregateReport($archiveProcessor, $idSite, $rawDataMetricNames);
            foreach ($aggregatedRecords as $name => $value) {
                if ($value instanceof DataTable) {
                    Common::destroy($value); // not needed
                    $aggregatedRecords[$name] = null;
                }
            }

            $aggregatedRecords = array_filter($aggregatedRecords);
            $archiveProcessor->insertNumericRecords($aggregatedRecords);
        }
    }

    public function aggregateReport(ArchiveProcessor $archiveProcessor, int $idSite, $onlyMetrics = array(), bool $isDryRun = false): array
    {
        $report = $this->report;

        /** @var DataTable[] $records */
        $records = [];

        /** @var Dimension[] $allDimensions */
        $allDimensions = array();

        if (!empty($report['dimensions'])) {
            foreach ($report['dimensions'] as $dimension) {
                $columnInstance = $this->dimension->factory($dimension);
                if (!empty($columnInstance)) {
                    $allDimensions[] = $columnInstance;
                } else {
                    $columnInstance = $this->findNotFoundCustomDimensionManually($dimension, $idSite);

                    if (!empty($columnInstance)) {
                        $allDimensions[] = $columnInstance;
                    }
                }
            }
        }

        $metrics = $this->getArchivableMetricsInReport();

        if (empty($metrics)) {
            return $records;
        }

        if ($report['report_type'] === Table::ID && empty($allDimensions)) {
            // none of the orignally assigned dimensions exist anymore. no need to do anything
            return $records;
        }

        if (!empty($onlyMetrics)) {
            foreach ($metrics as $index => $metric) {
                if (!in_array($metric->getName(), $onlyMetrics)) {
                    unset($metrics[$index]);
                }
            }
            $metrics = array_values($metrics);
        }

        if (empty($metrics)) {
            return $records;
        }

        $record = new DataTable();

        $executionPlan = new ExecutionPlan($allDimensions, $metrics);
        $dimensionsPlan = $executionPlan->getDimensionsPlan();

        foreach ($dimensionsPlan as $dimensionsGroup) {
            $metricsPlan = $executionPlan->getMetricsPlanForGroup();

            // for each group of dimensions, we need to resolve all the metrics in several queries
            foreach ($metricsPlan as $metricsToFetch) {
                $queryBuilder = new QueryBuilder($archiveProcessor->getLogAggregator(), $this->configuration, $archiveProcessor->getParams());

                foreach ($dimensionsGroup['left'] as $index => $dimension) {
                    try {
                        /** @var Dimension $dimension */
                        $queryBuilder->addDimension($dimension, false);
                    } catch (NotJoinableException $e) {
                        Log::info(sprintf('Ignored dimension %s in report %d as it is not joinable', $dimension->getId(), $report['idcustomreport']));
                    }
                }

                foreach ($dimensionsGroup['right'] as $index => $dimension) {
                    try {
                        /** @var Dimension $dimension */
                        $queryBuilder->addDimension($dimension, true);
                    } catch (NotJoinableException $e) {
                        Log::info(sprintf('Ignored dimension %s in report %d as it is not joinable', $dimension->getId(), $report['idcustomreport']));
                    }
                }

                foreach ($metricsToFetch as $metric) {
                    try {
                        /** @var ArchivedMetric $metric */
                        $queryBuilder->addMetric($metric);
                    } catch (NotJoinableException $e) {
                        Log::info(sprintf('Ignored metric %s in report %d as it is not joinable', $metric->getName(), $report['idcustomreport']));
                    }
                }

                if (!$queryBuilder->isValid()) {
                    continue;
                }

                if (!empty($report['segment_filter'])) {
                    try {
                        $queryBuilder->addSegmentFilter($report['segment_filter'], $idSite);
                    } catch (\Exception $e) {
                        if (strpos($e->getMessage(), 'is not a supported segment') !== false) {
                            // eg a plugin was uninstalled etc
                            continue;
                        }
                        throw $e;
                    }
                }

                $query = $queryBuilder->buildQuery();
                if ($isDryRun) {
                    continue;
                }

                try {
                    $db = $archiveProcessor->getLogAggregator()->getDb();
                    $cursor = $db->query($query['sql'], $query['bind']);
                } catch (\Exception $e) {
                    // we also need to check for the 'maximum statement execution time exceeded' text as the query might be
                    // aborted at different stages and we can't really know all the possible codes at which it may be aborted etc
                    if ($this->configuration->getMaxExecutionTime()) {
                        // handling this in the IF in here as it requires newer version of Matomo as those constants weren't defined before
                        // Matomo 3.12 or so
                        $isMaxExecutionTimeError = strpos($e->getMessage(), 'maximum statement execution time exceeded') !== false
                            || $db->isErrNo($e, DbMigration::ERROR_CODE_MAX_EXECUTION_TIME_EXCEEDED_QUERY_INTERRUPTED)
                            || $db->isErrNo($e, DbMigration::ERROR_CODE_MAX_EXECUTION_TIME_EXCEEDED_SORT_ABORTED);
                        if ($isMaxExecutionTimeError) {
                            $params = array(
                                'sql' => $query['sql'],
                                'bind' => $query['bind'],
                                'segment' => $archiveProcessor->getParams()->getSegment()->getString(),
                                'dateStart' => $archiveProcessor->getParams()->getDateStart()->getDatetime(),
                                'dateEnd' => $archiveProcessor->getParams()->getDateEnd()->getDatetime(),
                                'report' => $report,
                            );

                            /**
                             * @ignore
                             * @internal
                             */
                            Piwik::postEvent('Live.queryMaxExecutionTimeExceeded', array($params));

                            throw new \Exception('Max execution time exceeded: The custom report ' . $report['idcustomreport'] . ' took too long to execute.', 1, $e);
                        }
                    }
                    // var_export($queryBuilder->getReportQuery()->getFrom());
                    // var_export($queryBuilder->getReportQuery()->getSelect());
                    // var_export($queryBuilder->getReportQuery()->getWhere());
                    // echo $query['sql'];
                    throw $e;
                }

                // we need to bring them in correct order again in case they were reversed
                $this->makeRegularReport($record, $records, $dimensionsGroup['left'], $cursor, $idSite);
            }

            $this->doneLevel = count($dimensionsGroup['left']);
        }

        if ($isDryRun) {
            return $records;
        }

        $recordName = Archiver::makeRecordName($report['idcustomreport'], $report['revision']);
        $records[$recordName] = $record;
        return $records;
    }

    private function findNotFoundCustomDimensionManually(string $dimensionId, int $idSite): ?CustomDimension
    {
        $manager = Plugin\Manager::getInstance();

        if (
            strpos($dimensionId, 'CustomDimension.') === 0
            && $manager->isPluginActivated('CustomDimensions')
        ) {
            try {
                $configuration = StaticContainer::get('Piwik\Plugins\CustomDimensions\Dao\Configuration');
            } catch (\Exception $e) {
                // plugin does not have the class
                return null;
            }

            if (!$configuration || !method_exists($configuration, 'getCustomDimensionsForSite')) {
                return null;
            }

            $dimensions = $configuration->getCustomDimensionsForSite($idSite);
            foreach ($dimensions as $dimension) {
                if (!$dimension['active']) {
                    continue;
                }

                $custom = new CustomDimension();
                $custom->initCustomDimension($dimension);

                if ($custom->getId() === $dimensionId) {
                    return $custom;
                }
            }
        }

        return null;
    }

    /**
     * @deprecated Moved to the model
     * @return ArchivedMetric[]
     */
    public function getArchivableMetricsInReport(): array
    {
        $customReportsModel = StaticContainer::get('Piwik\Plugins\CustomReports\Model\CustomReportsModel');
        return $customReportsModel->getArchivableMetricsInReport($this->report);
    }

    private function usesSqlFunction(string $function, string $select): bool
    {
        return preg_match('/(' . $function . ')\s*\(/', $select);
    }


    /**
     * @param Dimension[]  $dimensionsInThisRun
     * @param \Zend_Db_Statement  $cursor
     * @param int $idSite
     */
    private function makeRegularReport(DataTable $mainRecord, array &$records, array $dimensionsInThisRun, $cursor, int $idSite): void
    {
        $report = $this->report;

        switch ($report['report_type']) {
            case Evolution::ID:
                $row = $cursor->fetch();

                if (!empty($row)) {
                    foreach ($row as $metric => $value) {
                        $records[Archiver::makeEvolutionRecordName($report['idcustomreport'], $report['revision'], $metric)] = $value;
                    }
                }
                return; // TODO: is the main report archived in this case? double check
        }

        $isDimBinaryMap = $dimColumnMap = [];
        foreach ($dimensionsInThisRun as $index => $dimension) {
            $isDimBinaryMap[$index] = $dimension->getType() === Dimension::TYPE_BINARY;
            $dimColumnMap[$index] = $dimension->getId() ?: null;
        }

        while ($row = $cursor->fetch()) {
            $columns = [];
            $dimensionLabelMap = [];
            foreach ($dimensionsInThisRun as $index => $dimension) {
                if ($isDimBinaryMap[$index]) {
                    $row[$dimension->getId()] = bin2hex($row[$dimension->getId()]);
                }

                if (isset($row[$dimension->getId()])) {
                    $row[$dimension->getId()] = $dimension->groupValue($row[$dimension->getId()], $idSite);
                }

                $dimensionLabel = Archiver::LABEL_NOT_DEFINED;
                $dimensionColumn = $dimColumnMap[$index];
                if (isset($dimensionColumn) && isset($row[$dimensionColumn])) {
                    $dimensionLabel = $row[$dimensionColumn];
                    unset($row[$dimensionColumn]);

                    if ($this->isEmptyLabel($dimensionLabel)) {
                        $dimensionLabel = Archiver::LABEL_NOT_DEFINED;
                    }
                }
                $dimensionLabelMap[$index] = $dimensionLabel;

                foreach ($this->columnAggregationOps as $metricName => $ignore) {
                    $columns[$metricName] = (float)($row[$metricName] ?? 0);
                }

                $this->sumRowsForIndex($mainRecord, $columns, $dimensionLabelMap, $index + 1);
            }
        }

        $cursor->closeCursor();
    }

    private function sumRowsForIndex(DataTable $mainRecord, array &$columns, array $dimensionLabelMap, int $level): void
    {
        // If this level has already been done, skip
        if ($this->doneLevel >= $level) {
            return;
        }

        $columns['level'] = $level;
        // If this is level 1, simply sum the row and return
        if ($level === 1) {
            $mainRecord->sumRowWithLabel($dimensionLabelMap[0], $columns, $this->columnAggregationOps);

            return;
        }

        $rowList = [];
        // Build the top level row
        $rowList[] = $mainRecord->sumRowWithLabel($dimensionLabelMap[0], []);
        // Build all the subtables above the current subtable
        for ($i = 1; $i < $level - 1; $i++) {
            $rowList[] = $rowList[$i - 1]->sumRowWithLabelToSubtable($dimensionLabelMap[$i], []);
        }

        // Sum the current subtable
        $rowList[$level - 2]->sumRowWithLabelToSubtable($dimensionLabelMap[$level - 1], $columns, $this->columnAggregationOps);
    }

    /**
     * public wrapper for finalizing an archive
     */
    public function finalize(ArchiveProcessor $archiveProcessor): void
    {
        $archiveProcessor->getArchiveWriter()->flushSpools();
    }

    public function getMetricAggregations(): array
    {
        $metrics = $this->getArchivableMetricsInReport(); // TODO: cache result of this method, it's used a lot

        $allMetricNames = array();
        foreach ($metrics as $metric) {
            $query = $metric->getQuery();
            $metricName = $metric->getName();

            $columnsAggregationOperation = 'sum';
            if ($this->usesSqlFunction('sum', $query)) {
                $columnsAggregationOperation = 'sum'; // we check for sum again in case there is like sum(min(0,1))
            } elseif ($this->usesSqlFunction('min', $query)) {
                $columnsAggregationOperation = 'min';
            } elseif ($this->usesSqlFunction('max', $query)) {
                $columnsAggregationOperation = 'max';
            }
            // TODO add possibility for metric to add custom callback aggregation method and / or operation keyword

            $allMetricNames[$metricName] = $columnsAggregationOperation;
        }

        $allMetricNames['level'] = function ($thisColumnValue, $columnToSumValue) {
            // we do not want to sum the level or so. always keep either value
            if (!empty($thisColumnValue)) {
                return $thisColumnValue;
            }
            if (!empty($columnToSumValue)) {
                return $columnToSumValue;
            }
        };

        return $allMetricNames;
    }

    private function getMetricToSortMultiPeriod(): ?string
    {
        $metrics = $this->getArchivableMetricsInReport();

        $metricsAvailableForSort = [];
        foreach ($metrics as $metric) {
            $metricName = $metric->getName();
            if ($metricName !== 'nb_uniq_visitors' && $metricName !== 'nb_users' && $metricName !== 'nb_uniq_corehome_userid') {
                // we don't want to sort by any unique metric as they are not available in aggregated reports
                $metricsAvailableForSort[] = $metricName;
            }
        }

        $metricToSort = $this->columnToSortByBeforeTruncation;
        foreach (array('nb_visits', 'sum_actions', 'hits', 'pageviews') as $preferredSortMetric) {
            if (in_array($preferredSortMetric, $metricsAvailableForSort, true)) {
                $metricToSort = $preferredSortMetric;
                break;
            }
        }

        if (!$metricToSort && !empty($metricsAvailableForSort)) {
            // we prefer to sort by nb_visits if it is present
            $metricToSort = array_shift($metricsAvailableForSort);
        }

        return $metricToSort;
    }

    private function shouldAggregateRawDataForMultiPeriodMetric(ArchivedMetric $metric, string $periodLabel): bool
    {
        return in_array($metric->getName(), GetCustomReport::$RAW_DATA_UNIQUE_METRICS)
            && GetCustomReport::supportsUniqueMetric($periodLabel, true)
            && !$this->configuration->forceAggregateUniqueMetricsFromReportsInsteadOfRawDataInEvolutionReport($periodLabel);
    }

    protected function isEmptyLabel(string $label): bool
    {
        return !isset($label) || $label === '' || $label === false;
    }
}
