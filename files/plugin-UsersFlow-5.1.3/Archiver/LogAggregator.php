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

namespace Piwik\Plugins\UsersFlow\Archiver;

use Piwik\Piwik;
use Piwik\Plugin;
use Piwik\Plugins\UsersFlow\Archiver;
use Piwik\Plugins\UsersFlow\Configuration;
use Piwik\Plugins\UsersFlow\Metrics;
use Piwik\RankingQuery;
use Piwik\Version;
use Piwik\DataAccess\LogAggregator as PiwikLogAggregator;
use Piwik\Tracker\Action;

/**
 * Builds the log queries behind the users flow reports.
 */
class LogAggregator
{
    /**
     * Marks where the explored value is bound, after the bind parameters have been assembled.
     */
    private const EXPLORE_VALUE_PLACEHOLDER = '##UsersFlowExploredValue##';

    /**
     * @var PiwikLogAggregator
     */
    private $logAggregator;

    /**
     * @var Configuration
     */
    private $configuration;

    public function __construct(PiwikLogAggregator $logAggregator, Configuration $configuration)
    {
        $this->logAggregator = $logAggregator;
        $this->configuration = $configuration;
    }

    public function makeUrlColumn($column, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments)
    {
        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            return $column;
        }

        $theColumn = $column;

        if ($ignoreSearchQuery) {
            if ($siteKeepsUrlFragments) {
                $removeHash = "SUBSTRING_INDEX(%s, '#', 1)"; // if the site keeps url hashes, we remove them as well
            } else {
                $removeHash = '%s';
            }

            $pathName = "TRIM(TRAILING '/' FROM SUBSTRING_INDEX($removeHash, '?', 1))";

            $column = sprintf($pathName, $column);
        }

        if ($ignoreDomain) {
            $pathName = "SUBSTR(%s, LOCATE('/', $theColumn))";
            $column = sprintf($pathName, $column);
        }

        return $column;
    }

    /**
     * Builds the query returning the flow of a single interaction.
     *
     * Restricted to the visits that performed the explored action at the explored interaction when one is
     * given. The plugin explores traffic with aggregateExploredSteps() since 5.1.2, which reports on every
     * interaction with one query instead of one query per interaction, these arguments are kept for callers
     * that report on one interaction at a time.
     *
     * @param int $step The interaction to report on
     * @param string $dataSource
     * @param bool $ignoreSearchQuery
     * @param bool $ignoreDomain
     * @param bool $siteKeepsUrlFragments
     * @param int|null $exploreStep The interaction the explored action was performed at, if any
     * @param string|null $exploreValueToMatch The label of the explored action, if any
     * @return array{sql: string, bind: array<scalar>}
     */
    public function aggregateTopStepActions($step, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep = null, $exploreValueToMatch = null)
    {
        $doExploreTraffic = !empty($exploreStep) && !empty($exploreValueToMatch);

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $columnToFetch = 'idaction_name';
            $idAction = Action::TYPE_PAGE_TITLE;
        } else {
            $columnToFetch = 'idaction_url';
            $idAction = Action::TYPE_PAGE_URL;
        }

        $step = (int) $step;
        $nextStep = $step + 1;

        $fromTable = $this->supportsForcedIndex()
            ? array('table' => 'log_link_visit_action', 'useIndex' => 'index_idsite_servertime')
            : 'log_link_visit_action';
        $from = array($fromTable, array(
            'table'  => 'log_action',
            'joinOn' => "log_link_visit_action.$columnToFetch = log_action.idaction"
        ));

        $extraWhere = $this->getInteractionOnlyCondition('log_link_visit_action');

        $urlLabel = $this->makeUrlColumn('`log_action`.`name`', $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments);

        $from[] = array(
            'table' => 'log_link_visit_action',
            'tableAlias' => 'log_link_visit_action_next',
            'joinOn' => "log_link_visit_action.idvisit = log_link_visit_action_next.idvisit
                            AND log_link_visit_action_next.pageview_position = " . $nextStep
        );

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $extraWhere .= " AND (log_action.type = $idAction or log_action.type = " . Action::TYPE_SITE_SEARCH . ")";
            $extraWhere .= " AND (log_action_url_next.type = $idAction or log_link_visit_action_next.idlink_va is null or log_action_url_next.type = " . Action::TYPE_SITE_SEARCH . ")";
        } else {
            $extraWhere .= " AND (log_action.type = $idAction or log_link_visit_action.idaction_url is null)";
            $extraWhere .= " AND (log_action_url_next.type = $idAction or log_link_visit_action_next.idaction_url is null)";
        }

        $from[] = array(
            'table' => 'log_action',
            'tableAlias' => 'log_action_url_next',
            'joinOn' => "log_link_visit_action_next.$columnToFetch = log_action_url_next.idaction"
        );

        $nextUrlLabel = $this->makeUrlColumn('`log_action_url_next`.`name`', $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments);
        $searchLabel = Archiver::LABEL_SEARCH;

        if ($doExploreTraffic) {
            $extraWhere .= $this->joinExploredAction($from, $columnToFetch, $idAction, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep, $exploreValueToMatch);
        }

        $where = $this->logAggregator->getWhereStatement('log_link_visit_action', 'server_time');
        $where .= " AND log_link_visit_action.pageview_position = $step " . $extraWhere;


        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $select = "if(log_action.type = " . Action::TYPE_SITE_SEARCH . ", '$searchLabel', $urlLabel) as label,
                   CASE WHEN log_link_visit_action_next.idlink_va is null THEN null WHEN log_action_url_next.type = " . Action::TYPE_SITE_SEARCH . " THEN '$searchLabel' ELSE $nextUrlLabel END as nextLabel,";
        } else {
            $select = "if(log_link_visit_action.idaction_url is null, '$searchLabel', $urlLabel) as label,
                   CASE WHEN log_link_visit_action_next.idlink_va is null THEN null WHEN log_link_visit_action_next.idaction_url is null THEN '$searchLabel' ELSE $nextUrlLabel END as nextLabel,
                   ";
        }

        $select .= " count(*) as " . Metrics::NB_VISITS . ",
                   sum(if(log_link_visit_action_next.idlink_va is null, 1, 0)) as " . Metrics::NB_EXITS;
        $groupBy = "label, nextLabel";
        $orderBy = Metrics::NB_VISITS . ' DESC';

        $limit = $this->configuration->getMaxLinksPerInteractions();

        $query = $this->logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy, $limit);

        return $this->insertExploreValue($query['sql'], $query['bind'], $exploreValueToMatch);
    }

    /**
     * Builds one query returning the flow of every interaction at once, restricted to the visits that performed
     * the explored action at the explored interaction.
     *
     * Unlike the archiving query this runs while a request is waiting for it, so it reports on every interaction
     * at once instead of joining log_link_visit_action onto itself once per interaction.
     *
     * The connections of each interaction are limited to Configuration::getMaxLinksPerInteractions() by a
     * ranking query, which sums the remaining connections of an interaction into a single row labelled
     * RankingQuery::LABEL_SUMMARY_ROW. The archiving queries drop those connections, so the caller drops
     * that row as well.
     *
     * @param int $maxStep The highest interaction to report on
     * @param string $dataSource
     * @param bool $ignoreSearchQuery
     * @param bool $ignoreDomain
     * @param bool $siteKeepsUrlFragments
     * @param int $exploreStep The interaction the explored action was performed at
     * @param string $exploreValueToMatch The label of the explored action
     * @return array{sql: string, bind: array<scalar>}
     */
    public function aggregateExploredSteps($maxStep, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep, $exploreValueToMatch)
    {
        $maxStep = (int) $maxStep;

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $columnToFetch = 'idaction_name';
            $idAction = Action::TYPE_PAGE_TITLE;
        } else {
            $columnToFetch = 'idaction_url';
            $idAction = Action::TYPE_PAGE_URL;
        }

        $fromTable = $this->supportsForcedIndex()
            ? array('table' => 'log_link_visit_action', 'useIndex' => 'index_idsite_servertime')
            : 'log_link_visit_action';
        $from = array($fromTable, array(
            'table'  => 'log_action',
            'joinOn' => "log_link_visit_action.$columnToFetch = log_action.idaction"
        ));

        $extraWhere = $this->getInteractionOnlyCondition('log_link_visit_action');

        $urlLabel = $this->makeUrlColumn('`log_action`.`name`', $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments);

        $from[] = array(
            'table' => 'log_link_visit_action',
            'tableAlias' => 'log_link_visit_action_next',
            'joinOn' => "log_link_visit_action.idvisit = log_link_visit_action_next.idvisit
                            AND log_link_visit_action_next.pageview_position = log_link_visit_action.pageview_position + 1"
        );

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $extraWhere .= " AND (log_action.type = $idAction or log_action.type = " . Action::TYPE_SITE_SEARCH . ")";
            $extraWhere .= " AND (log_action_url_next.type = $idAction or log_link_visit_action_next.idlink_va is null or log_action_url_next.type = " . Action::TYPE_SITE_SEARCH . ")";
        } else {
            $extraWhere .= " AND (log_action.type = $idAction or log_link_visit_action.idaction_url is null)";
            $extraWhere .= " AND (log_action_url_next.type = $idAction or log_link_visit_action_next.idaction_url is null)";
        }

        $from[] = array(
            'table' => 'log_action',
            'tableAlias' => 'log_action_url_next',
            'joinOn' => "log_link_visit_action_next.$columnToFetch = log_action_url_next.idaction"
        );

        $nextUrlLabel = $this->makeUrlColumn('`log_action_url_next`.`name`', $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments);
        $searchLabel = Archiver::LABEL_SEARCH;

        $extraWhere .= $this->joinExploredAction($from, $columnToFetch, $idAction, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep, $exploreValueToMatch);

        $where = $this->logAggregator->getWhereStatement('log_link_visit_action', 'server_time');
        $where .= " AND log_link_visit_action.pageview_position >= 1
                    AND log_link_visit_action.pageview_position <= $maxStep " . $extraWhere;

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $select = "log_link_visit_action.pageview_position as step,
                   if(log_action.type = " . Action::TYPE_SITE_SEARCH . ", '$searchLabel', $urlLabel) as label,
                   CASE WHEN log_link_visit_action_next.idlink_va is null THEN null WHEN log_action_url_next.type = " . Action::TYPE_SITE_SEARCH . " THEN '$searchLabel' ELSE $nextUrlLabel END as nextLabel,";
        } else {
            $select = "log_link_visit_action.pageview_position as step,
                   if(log_link_visit_action.idaction_url is null, '$searchLabel', $urlLabel) as label,
                   CASE WHEN log_link_visit_action_next.idlink_va is null THEN null WHEN log_link_visit_action_next.idaction_url is null THEN '$searchLabel' ELSE $nextUrlLabel END as nextLabel,
                   ";
        }

        $select .= " count(*) as " . Metrics::NB_VISITS . ",
                   sum(if(log_link_visit_action_next.idlink_va is null, 1, 0)) as " . Metrics::NB_EXITS;
        $groupBy = "step, label, nextLabel";
        $orderBy = 'step ASC, ' . Metrics::NB_VISITS . ' DESC';

        $query = $this->logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy, $limit = 0);
        $query = $this->insertExploreValue($query['sql'], $query['bind'], $exploreValueToMatch);

        // a query returning every interaction at once cannot limit the connections of each interaction with a
        // plain LIMIT, so the limit is applied per interaction by a ranking query instead
        $query['sql'] = $this->makeRankingQuery($maxStep)->generateRankingQuery($query['sql']);

        return $query;
    }

    /**
     * Whether core accepts an array as the first FROM entry, which is how a forced index is requested.
     *
     * Before 5.2.0-b6 JoinTables::sort() hands that entry straight to strpos(), so an array fatals there.
     *
     * @return bool
     */
    private function supportsForcedIndex()
    {
        return version_compare(Version::VERSION, '5.2.0-b6', '>=');
    }

    /**
     * Joins the action that was explored at an interaction, so that the query reports on the visits that
     * performed it only.
     *
     * The explored action is reached through the visit rather than searched for, so it needs no date
     * restriction of its own and the reported visits stay the same however many interactions are queried at
     * once. Resolving it in a sub query instead would have to scan for it, no index covers the action.
     *
     * @param array<int, mixed> $from The joins of the query, the joins the explored action needs are added
     * @param string $columnToFetch
     * @param int $idAction
     * @param string $dataSource
     * @param bool $ignoreSearchQuery
     * @param bool $ignoreDomain
     * @param bool $siteKeepsUrlFragments
     * @param int $exploreStep
     * @param string $exploreValueToMatch
     * @return string The condition restricting the query to the explored action, the explored value is bound
     *                by insertExploreValue() once the query is generated
     */
    private function joinExploredAction(array &$from, $columnToFetch, $idAction, $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments, $exploreStep, $exploreValueToMatch)
    {
        // an INNER JOIN is required: a LEFT JOIN would leave the columns of the explored action null for the
        // visits that never reached the explored interaction, which the search condition below reads as a match
        $from[] = array(
            'table' => 'log_link_visit_action',
            'tableAlias' => 'log_link_visit_action_match',
            'join' => 'INNER JOIN',
            'joinOn' => "log_link_visit_action.idvisit = log_link_visit_action_match.idvisit
                            AND log_link_visit_action_match.pageview_position = " . (int) $exploreStep
                            . $this->getInteractionOnlyCondition('log_link_visit_action_match')
        );

        if ($exploreValueToMatch === 'Search' || $exploreValueToMatch === Piwik::translate('General_Search')) {
            if ($dataSource !== DataSources::DATA_SOURCE_PAGE_TITLE) {
                // a site search is tracked without a url
                return ' AND log_link_visit_action_match.' . $columnToFetch . ' is null';
            }

            // a site search is tracked with the keyword as its name, so the column is set and the type tells
            // it apart from a pageview, the same way the selected label does. The column is only null for
            // downloads and outlinks, which are not searches and re-use the pageview_position they happened on.
            $from[] = array(
                'table' => 'log_action',
                'tableAlias' => 'log_action_match',
                'join' => 'INNER JOIN',
                'joinOn' => "log_link_visit_action_match.$columnToFetch = log_action_match.idaction"
            );

            return ' AND log_action_match.type = ' . Action::TYPE_SITE_SEARCH;
        }

        $columnToExplore = $this->makeUrlColumn('`log_action_match`.`name`', $dataSource, $ignoreSearchQuery, $ignoreDomain, $siteKeepsUrlFragments);

        $from[] = array(
            'table' => 'log_action',
            'tableAlias' => 'log_action_match',
            'join' => 'INNER JOIN',
            'joinOn' => "log_link_visit_action_match.$columnToFetch = log_action_match.idaction AND log_action_match.type = $idAction"
        );

        return " AND $columnToExplore = " . self::EXPLORE_VALUE_PLACEHOLDER;
    }

    /**
     * Builds the condition restricting a log_link_visit_action alias to the rows that count as an interaction.
     *
     * Events and content impressions re-use the pageview_position of the pageview they happened on, so an alias
     * joined on pageview_position alone matches them as well and a visit contributes one row per event or
     * impression instead of one row per interaction.
     *
     * @param string $tableAlias
     * @return string
     */
    private function getInteractionOnlyCondition($tableAlias)
    {
        $condition = '';
        $pluginManager = Plugin\Manager::getInstance();

        if ($pluginManager->isPluginActivated('Events')) {
            $condition .= " AND $tableAlias.idaction_event_category is null";
        }

        if ($pluginManager->isPluginActivated('Contents')) {
            $condition .= " AND $tableAlias.idaction_content_name is null";
        }

        return $condition;
    }

    /**
     * Builds the ranking query limiting the connections of each interaction, see
     * Configuration::getMaxLinksPerInteractions().
     *
     * @param int $maxStep
     * @return RankingQuery
     */
    private function makeRankingQuery($maxStep)
    {
        $rankingQuery = new RankingQuery($this->configuration->getMaxLinksPerInteractions());
        $rankingQuery->addLabelColumn(['label', 'nextLabel']);
        $rankingQuery->addColumn(Metrics::NB_VISITS, 'sum');
        $rankingQuery->addColumn(Metrics::NB_EXITS, 'sum');
        $rankingQuery->partitionResultIntoMultipleGroups('step', range(1, $maxStep));

        return $rankingQuery;
    }

    /**
     * Replaces the explored value placeholder and inserts its bind at the position the placeholder ended up in.
     * The bind cannot simply be appended as the segment adds its own binds after the where statement.
     *
     * Queries that explore nothing, and exploring a search, carry no placeholder and are returned unchanged.
     *
     * @param string $sql
     * @param array<scalar> $bind
     * @param string|null $exploreValueToMatch
     * @return array{sql: string, bind: array<scalar>}
     */
    private function insertExploreValue($sql, array $bind, $exploreValueToMatch)
    {
        $position = strpos($sql, self::EXPLORE_VALUE_PLACEHOLDER);

        if ($position !== false) {
            // a url column may contain a quoted question mark, it must not be counted as a bind
            $precedingSql = str_replace("'?'", '', substr($sql, 0, $position));

            array_splice($bind, substr_count($precedingSql, '?'), 0, [$exploreValueToMatch]);
            $sql = str_replace(self::EXPLORE_VALUE_PLACEHOLDER, '?', $sql);
        }

        return array('sql' => trim($sql), 'bind' => $bind);
    }
}
