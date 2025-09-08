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

namespace Piwik\Plugins\CustomReports\Archiver;

use Piwik\Piwik;
use Piwik\ArchiveProcessor\Parameters;
use Piwik\Columns\Dimension;
use Piwik\Columns\Join;
use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\DataAccess\LogAggregator;
use Piwik\DataAccess\LogQueryBuilder\JoinTables;
use Piwik\DataTable;
use Piwik\Log;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugins\Actions\Columns\ActionType;
use Piwik\Plugins\CustomReports\Configuration;
use Piwik\Plugin\LogTablesProvider;
use Piwik\Segment;
use Piwik\RankingQuery;
use Piwik\Version;

class QueryBuilder
{
    /** @var  ReportQuery */
    private $reportQuery;

    /** @var RankingQuery $rankingQuery */
    private $rankingQuery;

    /** @var  LogAggregator $logAggregator */
    private $logAggregator;

    /** @var  Configuration $configuration */
    private $configuration;

    /** @var LogTablesProvider $logTablesProvider */
    private $logTablesProvider;

    public $metricGroupBy = '';

    private $hasMetric = false;

    /**
     * @var bool
     */
    private $shouldLowerCampaignCase  = false;

    /**
     * @var Parameters
     */
    private $parameters;

    public function __construct(LogAggregator $logAggregator, Configuration $configuration, Parameters $parameters)
    {
        $this->reportQuery = StaticContainer::getContainer()->make('Piwik\Plugins\CustomReports\Archiver\ReportQuery');
        $this->configuration = $configuration;

        $this->rankingQuery = new RankingQuery(50000);
        if (version_compare(Version::VERSION, '3.12.0-b2', '<')) {
            $this->rankingQuery->setOthersLabel(DataTable::LABEL_SUMMARY_ROW);
        }

        $this->logTablesProvider = StaticContainer::get('Piwik\Plugin\LogTablesProvider');

        $this->logAggregator = $logAggregator;
        $this->parameters = $parameters;
        Piwik::postEvent('Plugin.shouldLowerCampaignCase', [$pluginName = 'CustomReports', &$this->shouldLowerCampaignCase]);
    }

    public function isValid()
    {
        $selects = $this->reportQuery->getSelect();
        return !empty($selects) && $this->hasMetric;
    }

    public function addDimension($dimension, $useRightJoin = false)
    {
        if (!$dimension instanceof Dimension) {
            return;
        }

        $join = $dimension->getDbColumnJoin();
        $dbTable = $dimension->getDbTableName();
        $dbColumn = $dimension->getColumnName();

        $dbDiscriminator = $dimension->getDbDiscriminator();

        // if other ways to join the table are defined (and it's joinable to visit or action)
        // ensure to add log_visit/log_action first, otherwise it might fail when a custom table is added first
        $logTable = $this->logTablesProvider->getLogTable($dbTable);
        $tables = new JoinTables($this->logTablesProvider, [$dbTable]);

        if (
            !$logTable->getColumnToJoinOnIdVisit() && !$logTable->getColumnToJoinOnIdAction() &&
            !$logTable->getLinkTableToBeAbleToJoinOnVisit() && $logTable->getWaysToJoinToOtherLogTables()
        ) {
            if ($tables->isTableJoinableOnVisit($dbTable)) {
                $this->reportQuery->addFrom('log_visit');
            }
            if ($tables->isTableJoinableOnAction($dbTable)) {
                $this->reportQuery->addFrom('log_action');
            }
        }

        // Special handling for ActionType dimension
        if ($dimension instanceof ActionType) {
            if (!$this->reportQuery->hasFrom('log_link_visit_action')) {
                $this->reportQuery->addFrom('log_link_visit_action');
            }
            if (!$this->reportQuery->hasFrom('log_visit')) {
                $this->reportQuery->addFrom('log_visit');
            }
        }

        if ($useRightJoin) {
            $tableArray = [
                'table' => $dbTable,
                'join' => 'RIGHT JOIN',
            ];
            $this->reportQuery->addFrom($tableArray);
        } else {
            $this->rankingQuery->addLabelColumn($dimension->getId());
            $this->reportQuery->addFrom($dbTable);
        }

        if ($dbTable && $dbColumn) {
            if (!empty($join)) {
                $tableAlias = $join->getTable() . '_' . $dbColumn;


                $this->reportQuery->addFrom([
                    'table' => $join->getTable(),
                    'tableAlias' => $tableAlias,
                    'joinOn' => $dbTable . '.' . $dbColumn . ' = ' . $tableAlias . '.' . $join->getColumn() .
                                            $this->addExtraJoinConditions($join, $tableAlias)
                ]);

                if (!$useRightJoin) {
                    $tableColumn = $tableAlias . '.' . $join->getTargetColumn();
                    $this->reportQuery->addSelect($tableColumn . " AS '" . $dimension->getId() . "'");
                    $this->reportQuery->addGroupBy($tableColumn);

                    // prevent "XYZ not defined"
                    // we cannot do something like " and $tableColumn != ''" as it could break dimension like visitor type
                    $this->reportQuery->addWhere($tableColumn . ' is not null');
                }

                if ($dbDiscriminator && $dbDiscriminator->isValid()) {
                    // we make sure discriminator is valid and has only allowed values to prevent injections

                    $dbDiscriminatorTable = $dbDiscriminator->getTable();

                    // table might be joined under an alias
                    $actualTableName = $this->reportQuery->getFromAlias($dbDiscriminatorTable);

                    if ($dbDiscriminatorTable === $join->getTable()) {
                        $actualTableName = $tableAlias; // we need to make sure to apply the where condition on this joined table
                    } elseif (empty($actualTableName)) {
                        // not joined yet
                        $actualTableName = $dbDiscriminatorTable;
                        $this->reportQuery->addFrom($dbDiscriminatorTable);
                    }

                    // we support for now only numeric values because we cannot use bind here as it would not be possible to position bind correctly
                    $this->reportQuery->addWhere(($actualTableName === $join->getTable() ? $tableAlias : $actualTableName) . '.' . $dbDiscriminator->getColumn() . ' = "' . $dbDiscriminator->getValue() . '"');
                }
            } else {
                if (!$useRightJoin) {
                    if ($dimension->getSegmentName() === 'regionCode') {
                        $this->reportQuery->addSelect("CONCAT(log_visit.location_region, '|', log_visit.location_country) AS '" . $dimension->getId() . "'");
                        $this->reportQuery->addGroupBy($dimension->getSqlSegment());
                        $this->reportQuery->addGroupBy('log_visit.location_country');
                    } else {
                        $select = $dimension->getSqlSegment();
                        if ($this->shouldLowerCampaignCase && stripos($dimension->getSegmentName(), 'campaign') === 0) {
                            $select = 'LOWER(' . $select . ')';
                        }
                        $this->reportQuery->addSelect($select . " AS '" . $dimension->getId() . "'");
                        $this->reportQuery->addGroupBy($dimension->getSqlSegment());
                    }
                }

                if ($dbDiscriminator) {
                    $dbDiscriminatorTable = $dbDiscriminator->getTable();

                    if ($dbDiscriminator->isValid()) {
                        // we make sure discriminator is valid and has only allowed values to prevent injections

                        // table might be joined under an alias
                        $actualTableName = $this->reportQuery->getFromAlias($dbDiscriminatorTable);
                        if (empty($actualTableName)) {
                            // not joined yet
                            $actualTableName = $dbDiscriminatorTable;
                            $this->reportQuery->addFrom($dbDiscriminatorTable);
                        }

                        // we support for now only numeric values because we cannot use bind here as it would not be possible to position bind correctly
                        $where = $actualTableName . '.' . $dbDiscriminator->getColumn() . ' = "' . $dbDiscriminator->getValue() . '"';

                        $this->reportQuery->addWhere($where);
                    }
                }

                if (!$useRightJoin) {
                    $tableColumn = $dimension->getDbTableName() . '.' . $dimension->getColumnName();
                    if ($tableColumn === $dimension->getSqlSegment() && $dimension->getSegmentName() !== 'regionCode') {
                        // when the segment goes on the sql segment, we do not fetch any values with NULL otherwise we often see "XYZ is not defined"
                        // we cannot do something like " and $tableColumn != ''" as it could break dimension like visitor type
                        $this->reportQuery->addWhere($tableColumn . ' is not null');
                    }
                }
            }
        }
    }

    private function addExtraJoinConditions(Join $join, $tableAlias)
    {
        if ($join->getTable() === 'goal') {
            $idSites = $this->parameters->getIdSites();
            if (!empty($idSites)) {
                $idSites = array_map('intval', $idSites);
                $idSites = implode(',', $idSites);
                return ' AND ' . $tableAlias . '.idsite IN (' . $idSites . ')';
            }
        }
    }

    public function addMetric($metric)
    {
        if (!$metric instanceof ArchivedMetric || !$metric->getDimension() || !$metric->getQuery()) {
            return;
        }

        $metricName = $metric->getName();
        $dimension = $metric->getDimension();

        $tableName = $dimension->getDbTableName();
        $dbDiscriminator = $dimension->getDbDiscriminator();

        $this->reportQuery->addFrom($tableName);

        if ($dbDiscriminator) {
            // we need to add a join for this table to make sure to calc correct results when eg a goal metric or action metric is selected (to be able to measure different values for eg clicked urls vs page urls)
            $join = $dimension->getDbColumnJoin();
            $dbDiscriminatorValue = $dbDiscriminator->getValue();
            $dbDiscriminatorTable = $dbDiscriminator->getTable();

            if (!$dbDiscriminator->isValid()) {
                // we make sure discriminator is valid and has only allowed values to prevent injections
                Log::debug(sprintf('Ignored metric %s because dbDiscriminator does not valid value', $metricName));
                return;
            }

            if ($join && $join->getTable() === $dbDiscriminatorTable) {
                // we need to use that join only when a discriminator is actually on the joined table, otherwise ignore it as not needed

                $tableAlias = $join->getTable() . '_' . $metricName;
                $dbColumn = $dimension->getColumnName();
                $this->reportQuery->addFrom([
                    'table' => $join->getTable(),
                    'tableAlias' => $tableAlias,
                    'joinOn' => $tableName . '.' . $dbColumn . ' = ' . $tableAlias . '.' . $join->getColumn() . $this->addExtraJoinConditions($join, $tableAlias)
                ]);

                // we need to make sure that the query uses the newly joined table and the correct column...
                $metricQuery = str_replace($dbColumn, $join->getTargetColumn(), $metric->getQuery());
                $select = str_replace($tableName . '.', $tableAlias . '.', $metricQuery) . " AS '" . $metricName . "'";
                $this->reportQuery->addSelect($select);
                $where = $tableAlias . '.' . $dbDiscriminator->getColumn() . ' = "' . $dbDiscriminatorValue . '"';
                $this->reportQuery->addWhere($where);
            } elseif ($tableName === $dbDiscriminatorTable || $this->reportQuery->hasFrom($dbDiscriminatorTable)) {
                $actualTableName = $this->reportQuery->getFromAlias($dbDiscriminatorTable);

                // we support for now only numeric values because we cannot use bind here as it would not be possible to position bind correctly
                $where = $actualTableName . '.' . $dbDiscriminator->getColumn() . ' = "' . $dbDiscriminatorValue . '"';
                $this->reportQuery->addWhere($where);
                $this->reportQuery->addSelect($metric->getQuery() . " AS '" . $metricName . "'");
            } elseif ($this->reportQuery->isTableJoinable($dbDiscriminatorTable)) {
                $actualTableName = $this->reportQuery->getFromAlias($dbDiscriminatorTable);

                if (empty($actualTableName)) {
                    $this->reportQuery->addFrom($dbDiscriminatorTable);
                    $actualTableName = $dbDiscriminatorTable;
                }

                // we support for now only numeric values because we cannot use bind here as it would not be possible to position bind correctly
                $where = $actualTableName . '.' . $dbDiscriminator->getColumn() . ' = "' . $dbDiscriminatorValue . '"';
                $this->reportQuery->addWhere($where);
                $this->reportQuery->addSelect($metric->getQuery() . " AS '" . $metricName . "'");
            } else {
                Log::debug(sprintf('Cannot select metric %s because not supported discriminator table?!?', $metricName));
                return;
            }
        } else {
            $this->reportQuery->addSelect($metric->getQuery() . " AS '" . $metricName . "'");
        }

        $this->hasMetric = true;
        $this->setMetricGroupBy($tableName, $tableName);
        $this->rankingQuery->addColumn($metricName);
        $this->reportQuery->setSortBy($metricName);
    }

    private function setMetricGroupBy($tableName, $tableAlias)
    {
        if (empty($this->metricGroupBy)) {
            $this->metricGroupBy = str_replace($tableName, $tableAlias, $this->reportQuery->getTableColumnId($tableName));
        }
    }

    public function addSegmentFilter($segmentFilter, $idSite)
    {
        if (empty($segmentFilter)) {
            return;
        }

        $from = $this->reportQuery->getFrom();

        $segment = new Segment($segmentFilter, [$idSite]);
        $segmentExpression = $segment->getSegmentExpression();
        $segmentExpression->parseSubExpressionsIntoSqlExpressions($from);
        $sql = $segmentExpression->getSql();

        $this->reportQuery->setFrom($from);
        $this->reportQuery->addExtraWhere($sql['where']);
        $this->reportQuery->addExtraBind($sql['bind']);
    }

    public function getOrderBy()
    {
        return $this->reportQuery->getSortBy();
    }

    public function getReportQuery()
    {
        return $this->reportQuery;
    }

    private function getMaxExecutionTimeMySQLHint()
    {
        $maxExecutionTime = $this->configuration->getMaxExecutionTime();
        if (Piwik::getAction() == 'previewReport' && Piwik::getModule() == 'CustomReports') {
            $maxExecutionTime = Config::getInstance()->General['live_query_max_execution_time'];
        }
        $maxExecutionTimeHint = '';
        if (is_numeric($maxExecutionTime) && $maxExecutionTime > 0) {
            $timeInMs = $maxExecutionTime * 1000;
            $timeInMs = (int) $timeInMs;
            $maxExecutionTimeHint = ' /*+ MAX_EXECUTION_TIME(' . $timeInMs . ') */ ';
        }
        return $maxExecutionTimeHint;
    }

    public function buildQuery()
    {
        // needed because we generate the where condition based on this
        $this->reportQuery->addFrom('log_visit');
        $condition = $this->logAggregator->getWhereStatement('log_visit', 'visit_last_action_time');

        // If joining other log tables then if possible add extra default binds to limit the query scope
        // These may be removed by LogAggregator later on if deemed unnecessary
        $joinConditions = [];
        $joinBinds = 0;
        $logTablesProvider = StaticContainer::get(LogTablesProvider::class);
        foreach ($logTablesProvider->getAllLogTables() as $logTable) {
            foreach ($this->reportQuery->getFrom() as $table) {
                if (!is_array($table) || !array_key_exists('join', $table) || strtolower($table['join']) != 'right join') {
                    continue;
                }
                $tableName = (array_key_exists('tableAlias', $table) ? $table['tableAlias'] : $table['table']);
                if ($tableName !== 'log_visit' && $tableName === $logTable->getName()) {
                    $dateTimeColumn = $logTable->getDateTimeColumn();
                    if ($dateTimeColumn) {
                        $joinConditions[$tableName] = $this->logAggregator->getWhereStatement($tableName, $dateTimeColumn);
                        $joinBinds++;
                    }
                }
            }
        }

        $select = $this->reportQuery->getSelect();
        $groupBy = $this->reportQuery->getGroupBy();
        $where = $this->reportQuery->getWhere();
        $from = $this->reportQuery->getFrom();
        $orderBy = $this->reportQuery->getSortBy();

        foreach ($joinConditions as $joinCondition) {
            $condition .= ' AND ' . $joinCondition;
        }

        if (!empty($where)) {
            $condition .= ' AND (' . $where . ') ';
        }

        /** @var \Piwik\DataAccess\LogQueryBuilder $segmentQueryBuilder */
        $segmentQueryBuilder = StaticContainer::getContainer()->make('Piwik\DataAccess\LogQueryBuilder');

        if ($this->metricGroupBy && !empty($groupBy)) {
            // there is no groupBy eg for evolution reports
            $segmentQueryBuilder->forceInnerGroupBySubselect($groupBy . ', ' . $this->metricGroupBy);
        }

        $defaultBindCount = count($this->logAggregator->getGeneralQueryBindParams());

        try {
            $query = $this->logAggregator->generateQuery($select, $from, $condition, $groupBy, $orderBy);
        } catch (\Exception $e) {
            $segmentQueryBuilder->forceInnerGroupBySubselect('');
            throw $e;
        }

        // Add extra default bind parameters for any right join conditions
        $bindCount = $defaultBindCount;
        $defaultBinds = $this->logAggregator->getGeneralQueryBindParams();
        for ($i = 0; $i < $joinBinds; $i++) {
            $query['bind'] = array_merge($query['bind'], $defaultBinds);
            $bindCount += $defaultBindCount;
        }

        $segmentQueryBuilder->forceInnerGroupBySubselect('');

        $select = 'SELECT';
        if (is_array($query) && 0 === strpos(trim($query['sql']), $select)) {
            $query['sql'] = trim($query['sql']);
            $query['sql'] = 'SELECT /* CustomReports */' . substr($query['sql'], strlen($select));
        }

        $bind = $this->reportQuery->getExtraBind();

        if (!empty($bind)) {
            // we need to add bind parameters from applied "report segment filter" at correct position right after the general
            // query parameters but before any Matomo segment.
            $newBind = $query['bind'];
            array_splice($newBind, $bindCount, 0, $bind);
            $bind = $newBind;
        } else {
            $bind = $query['bind'];
        }

        if (!empty($this->rankingQuery->getLabelColumns())) {
            // we only do this when there are dimensions, not for evolution graph queries
            $query['sql'] = $this->rankingQuery->generateRankingQuery($query['sql']);
        }

        $maxExecutionTimeHint = $this->getMaxExecutionTimeMySQLHint();
        if ($maxExecutionTimeHint) {
            $query['sql'] = trim($query['sql']);
            $pos = stripos($query['sql'], 'SELECT');
            if ($pos !== false) {
                $query['sql'] = substr_replace($query['sql'], 'SELECT ' . $maxExecutionTimeHint, $pos, strlen('SELECT'));
            }
        }

        return [
            'sql' => $query['sql'],
            'bind' => $bind
        ];
    }
}
