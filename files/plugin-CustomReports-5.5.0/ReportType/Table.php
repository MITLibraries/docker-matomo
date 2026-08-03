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

namespace Piwik\Plugins\CustomReports\ReportType;

use Piwik\Archive;
use Piwik\Container\StaticContainer;
use Piwik\Plugins\CoreVisualizations\Visualizations\HtmlTable;
use Piwik\Plugins\CustomReports\Archiver;
use Piwik\Plugins\CustomReports\GetCustomReport;
use Piwik\Plugins\Actions\Columns\DownloadUrl;
use Piwik\Piwik;
use Piwik\DataTable;
use Piwik\Plugins\CustomReports\RecordBuilders\CustomReport;

class Table extends ReportType
{
    public const ID = 'table';

    public function getName()
    {
        return Piwik::translate('General_Table');
    }

    public function needsDimensions()
    {
        return true;
    }

    public function getDefaultViewDataTable()
    {
        return HtmlTable::ID;
    }

    public function alwaysUseDefaultViewDataTable()
    {
        return false;
    }

    public function fetchApi($idSite, $idCustomReport, $period, $date, $segment, $expanded, $flat, $idSubtable, $columns)
    {
        $customReport = StaticContainer::get('\Piwik\Plugins\CustomReports\Model\CustomReportsModel');
        $reportData = $customReport->getCustomReport($idSite, $idCustomReport);

        $recordName = Archiver::makeRecordName($idCustomReport, $reportData['revision']);

        $table = Archive::createDataTableFromArchive($recordName, $idSite, $period, $date, $segment, $expanded, $flat, $idSubtable);
        $table->disableFilter('AddColumnsProcessedMetrics');

        $recordBuilder = StaticContainer::getContainer()->make(CustomReport::class, ['report' => $reportData]);
        $aggregations = $recordBuilder->getMetricAggregations();
        $table->filter(function (DataTable $t) use ($aggregations) {
            $t->setMetadata(DataTable::COLUMN_AGGREGATION_OPS_METADATA_NAME, $aggregations);
        });

        $report = new GetCustomReport();
        $report->initCustomReport($reportData, $table);
        $dimension = $report->getDimension();
        $dimensions = $reportData['dimensions'];
        $nestedDimensions = [];
        if (!empty($dimensions) && count($dimensions) > 1) {
            foreach ($dimensions as $index => $dimensionName) {
                if ($index === 0) {
                    continue;
                }
                $dimensionToAdd = $report->getDimensionInstance($dimensionName);
                if ($dimensionToAdd && $dimension !== $dimensionToAdd) {
                    $nestedDimensions[] = $dimensionToAdd;
                }
            }
        }

        if (!empty($dimension) && $dimension->getSegmentName() && !$flat && !$idSubtable) {
            if ($dimension instanceof DownloadUrl) {
                // skip see DEV-2635, for now disabling as the segment won't work properly
            } elseif (!empty($reportData['segment_filter'])) {
                // we do not add segmented label to table when requesting a subtable since we would need to combine the segment
                // with the root table or all root tables above this table. We do not have this information though
                $segmentFilter = $reportData['segment_filter'];
                $segmentNameDimension = $dimension->getSegmentName();
                $table->filter(function (DataTable $table) use ($segmentFilter, $segmentNameDimension) {
                    foreach ($table->getRowsWithoutSummaryRow() as $row) {
                        $firstPart = $segmentNameDimension . '==' . urlencode($row->getColumn('label'));
                        $row->setMetadata('segment', $firstPart . ';' . $segmentFilter);
                    }
                });
            } else {
                $table->filter('AddSegmentByLabel', array($dimension->getSegmentName()));
            }
        }

        if (!empty($dimension)) {
            // we cannot really queue since the sorting by label wouldn't work correctly when it would sort eg
            // a translation key or an enum value like "EU" or "MAC"
            $table->filter('Piwik\Plugins\CustomReports\DataTable\Filter\ReportTypeTableFilter', [$idSite, $dimension, $nestedDimensions, $flat]);
        }

        if (!GetCustomReport::supportsUniqueMetric($period, $isEvolution = false)) {
            $hasUniqueMetrics = array_intersect(GetCustomReport::$RAW_DATA_UNIQUE_METRICS, array_keys($report->getMetrics()));
            if (!empty($hasUniqueMetrics)) {
                $table->queueFilter('ColumnDelete', array(GetCustomReport::$RAW_DATA_UNIQUE_METRICS));
            }
        }

        // we cannot delete level column otherwise GetCustomReport won't be able to detect currently active dimension anymore
        // $table->filter('ColumnDelete', array('level'));

        return $table;
    }
}
