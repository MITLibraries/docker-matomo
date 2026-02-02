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

namespace Piwik\Plugins\UsersFlow\RecordBuilders;

use Piwik\ArchiveProcessor;
use Piwik\ArchiveProcessor\Record;
use Piwik\ArchiveProcessor\RecordBuilder;
use Piwik\DataTable;
use Piwik\Plugins\UsersFlow\Archiver\LogAggregator;
use Piwik\Plugins\UsersFlow\Configuration;
use Piwik\Plugins\UsersFlow\Metrics;
use Piwik\Plugins\UsersFlow\SystemSettings;
use Piwik\Site;

class GenericUsersFlow extends RecordBuilder
{
    /**
     * @var string
     */
    private $dataSource;

    /**
     * @var string|null
     */
    private $recordName;

    /**
     * @var int
     */
    private $numStepsToAggregate;

    /**
     * @var Configuration
     */
    private $configuration;

    public function __construct(string $dataSource, int $numStepsToAggregate, Configuration $configuration, ?string $recordName = null)
    {
        parent::__construct();

        $this->dataSource = $dataSource;
        $this->numStepsToAggregate = $numStepsToAggregate;
        $this->configuration = $configuration;
        $this->recordName = $recordName;

        $this->maxRowsInSubtable = $this->configuration->getMaxRowsInActions();
        $this->maxRowsInTable = $this->maxRowsInSubtable;
        $this->columnToSortByBeforeTruncation = Metrics::NB_VISITS;
    }

    public function getRecordMetadata(ArchiveProcessor $archiveProcessor): array
    {
        if ($this->recordName) {
            return [Record::make(Record::TYPE_BLOB, $this->recordName)];
        }

        return [];
    }

    // public so API.php can use it directly
    public function aggregate(ArchiveProcessor $archiveProcessor, $exploreStep = null, $exploreValueToMatch = null): array
    {
        $record = $this->createDataTable();

        $logAggregator = new LogAggregator($archiveProcessor->getLogAggregator(), $this->configuration);
        $db = $archiveProcessor->getLogAggregator()->getDb();

        $siteKeepsUrlFragments = $this->doesAnySiteKeepUrlFragments($archiveProcessor);

        $systemSettings = new SystemSettings();
        $ignoreSearchQuery = $systemSettings->ignoreUrlQuery->getValue();
        $ignoreDomain = $systemSettings->ignoreDomain->getValue();

        for ($step = 1; $step <= $this->numStepsToAggregate; $step++) {
            $query = $logAggregator->aggregateTopStepActions($step, $this->dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep, $exploreValueToMatch);
            $cursor = $db->query($query['sql'], $query['bind']);
            while ($row = $cursor->fetch()) {
                $columns = [
                    Metrics::NB_VISITS => $row[Metrics::NB_VISITS] ?: 0,
                    Metrics::NB_EXITS => $row[Metrics::NB_EXITS] ?: 0,
                ];

                $topLevelRow = $record->sumRowWithLabel($step, $columns);

                $label = $row['label'];
                if (!empty($label)) {
                    $subtableRow = $topLevelRow->sumRowWithLabelToSubtable($label, $columns);

                    $nextLabel = $row['nextLabel'];
                    if (!empty($nextLabel)) {
                        $nextColumns = [Metrics::NB_VISITS => $row[Metrics::NB_VISITS] ?: 0];
                        $subtableRow->sumRowWithLabelToSubtable($nextLabel, $nextColumns);
                    }
                }
            }
            $cursor->closeCursor();

            $stepTable = $record->getRowFromLabel($step)->getSubtable();
            if (!empty($stepTable)) {
                $stepTable->filter(DataTable\Filter\Truncate::class, [
                    $this->maxRowsInSubtable,
                    DataTable::LABEL_SUMMARY_ROW,
                    Metrics::NB_VISITS,
                    $filterRecursive = true,
                ]);
            }
        }

        return [$this->recordName => $record];
    }

    private function createDataTable(): DataTable
    {
        $emptyRow = [
            Metrics::NB_VISITS => 0,
            Metrics::NB_EXITS => 0,
        ];

        $table = new DataTable();
        for ($step = 1; $step <= $this->numStepsToAggregate; $step++) {
            $table->addRowFromSimpleArray(array_merge(['label' => $step], $emptyRow));
            $table->getRowFromLabel($step)->setSubtable(new DataTable());
        }
        return $table;
    }

    private function doesAnySiteKeepUrlFragments(ArchiveProcessor $archiveProcessor): bool
    {
        foreach ($archiveProcessor->getParams()->getIdSites() as $idSite) {
            $site = Site::getSite($idSite);
            if (!empty($site['keep_url_fragment'])) {
                return true;
            }
        }

        return false;
    }
}
