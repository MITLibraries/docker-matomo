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

namespace Piwik\Plugins\UsersFlow;

use Piwik\Archive;
use Piwik\ArchiveProcessor;
use Piwik\DataAccess\ArchiveWriter;
use Piwik\DataTable;
use Piwik\Period;
use Piwik\Piwik;
use Piwik\DataTable\Filter\Sort as SortFilter;
use Piwik\DataAccess\LogAggregator;
use Piwik\Plugins\UsersFlow\Archiver\DataSources;
use Piwik\Plugins\UsersFlow\RecordBuilders\GenericUsersFlow;
use Piwik\Segment;
use Piwik\Site;
use Piwik\Period\Factory as PeriodFactory;

/**
 * Exposes Users Flow reports, drill-downs, and metadata for analyzing how visitors move through your website.
 * Use this API to fetch formatted and raw flow reports, interaction-level actions, and supported data sources.
 *
 * @method static \Piwik\Plugins\UsersFlow\API getInstance()
 */
class API extends \Piwik\Plugin\API
{
    public const DATA_SOURCE_PAGE_URL = 'page_url';

    /**
     * @var Configuration
     */
    private $configuration;

    public function __construct(Configuration $configuration)
    {
        $this->configuration = $configuration;
    }

    /**
     * Get flow details for each available interaction step.
     *
     * The first table level will list all available interaction steps,
     * Their subtables list all pages and actions they viewed or performed within that interaction steps,
     * Their subtables list where they proceeded to afterwards as the next interaction.
     *
     * This report is polished to be more human readable and adds some processed metrics like the proceeded rate and exit rate.
     * If you are interested in integrating the data into a different system you may be interested in the "UsersFlow.getUsersFlow" API method.
     *
     * @param int|string|int[] $idSite Website ID(s) to query.
     *                                 - Single site ID (e.g. 1)
     *                                 - Multiple site IDs (e.g. [1, 4, 5])
     *                                 - Comma-separated list ("1,4,5") or "all"
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     * @param bool $expanded Whether to recursively load subtables in the returned flow report.
     * @param bool $flat Whether to flatten the report so subtable rows are returned in a single table.
     * @param int|false $idSubtable The subtable ID to load when drilling into a specific interaction step.
     * @param string|false $dataSource The data source to use. Supports 'page_url' or 'page_title'; defaults to
     *                                 'page_url'. Call UsersFlow.getAvailableDataSources to list supported values.
     * @return DataTable|DataTable\Map A collection of flow details.
     */
    public function getUsersFlowPretty($idSite, $period, $date, $segment = false, $expanded = false, $flat = false, $idSubtable = false, $dataSource = false)
    {
        Piwik::checkUserHasViewAccess($idSite);

        $dataSource = DataSources::getValidDataSource($dataSource);

        $table = $this->getDataTable($idSite, $period, $date, $segment, $dataSource, $expanded, $idSubtable, $flat);
        $table->queueFilter('\Piwik\Plugins\UsersFlow\DataTable\Filter\ReplaceActionLabels');

        if ($flat) {
            $table->queueFilterSubtables('\Piwik\Plugins\UsersFlow\DataTable\Filter\ReplaceActionLabels');
        }

        if (empty($idSubtable)) {
            $table->filter('ColumnCallbackReplace', array('label', function ($value) {
                if (is_numeric($value)) {
                    return Piwik::translate('UsersFlow_ColumnInteraction') . ' ' . $value;
                }

                return $value;
            }));
        }

        if ($flat) {
            $table->filterSubtables('ColumnCallbackDeleteRow', array('label', function ($value) {
                if (
                    $value === false
                    || $value == DataTable::LABEL_SUMMARY_ROW
                    || $value === Piwik::translate('General_Others')
                ) {
                    return true;
                }
                return false;
            }));
        }

        return $table;
    }

    /**
     * Get flow details for each available interaction step.
     *
     * The first table level will list all available interaction steps,
     * Their subtables list all pages and actions they viewed or performed within that interaction steps,
     * Their subtables list where they proceeded to afterwards as the next interaction.
     *
     * This report is "unformatted" and useful if you want to develop your own visualization on top of this API or if
     * you want to use the data for integrating it into another tool. If you are interested in requesting the report data
     * in a more human readable way you may want to have a look at "UsersFlow.getUsersFlowPretty".
     *
     * @param int|string|int[] $idSite Website ID(s) to query.
     *                                 - Single site ID (e.g. 1)
     *                                 - Multiple site IDs (e.g. [1, 4, 5])
     *                                 - Comma-separated list ("1,4,5") or "all"
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param int $limitActionsPerStep The maximum number of actions to keep per interaction step before the
     *                                 remaining rows are merged into "Others".
     * @param int|false $exploreStep The interaction step to expand when drilling deeper into the flow.
     * @param string|false $exploreUrl The action label to expand for the selected interaction step.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     * @param bool $expanded Whether to recursively load subtables in the returned flow report.
     * @param string|false $dataSource The data source to use. Supports 'page_url' or 'page_title'; defaults to
     *                                 'page_url'. Call UsersFlow.getAvailableDataSources to list supported values.
     * @return DataTable|DataTable\Map A raw users flow report with interaction steps, actions, and proceeded-to
     *                                 subtables.
     */
    public function getUsersFlow($idSite, $period, $date, $limitActionsPerStep = 5, $exploreStep = false, $exploreUrl = false, $segment = false, $expanded = false, $dataSource = false)
    {
        Piwik::checkUserHasViewAccess($idSite);

        $dataSource = DataSources::getValidDataSource($dataSource);

        $table = $this->getUsersFlowDataTable($idSite, $period, $date, $segment, $dataSource, $expanded, $exploreStep, $exploreUrl);
        $table->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\AddLabelsForMissingSteps');
        $table->filter('Sort', array('label', SortFilter::ORDER_ASC, $naturalSort = true, $recursiveSort = false));
        // we do not need to filter the subtables recursive as we will in the sub-subtable only keep rows anyway that are present in the sub-table
        $table->filterSubtables('Sort', array(Metrics::NB_VISITS, SortFilter::ORDER_DESC, $naturalSort = true, $recursiveSort = false));
        $table->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\LimitStepActions', array($limitActionsPerStep));
        $table->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\LimitProceededToActions');
        $table->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\BalanceOtherActions');
        $table->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\ReplaceActionLabels');
        $table->disableFilter('Sort');

        return $table;
    }

    private function getUsersFlowDataTable($idSite, $period, $date, $segment, $dataSource, $expanded, $exploreStep, $exploreUrl)
    {
        if (empty($exploreStep) || empty($exploreUrl)) {
            $table = $this->getDataTable($idSite, $period, $date, $segment, $dataSource, $expanded);
            return $table;
        }

        $site = new Site($idSite);

        if (Period::isMultiplePeriod($date, $period)) {
            throw new \Exception('Multi period is not supported');
        } else {
            $period = PeriodFactory::makePeriodFromQueryParams($site->getTimezone(), $period, $date);
        }

        $parameters = new ArchiveProcessor\Parameters($site, $period, new Segment($segment, array($idSite)));
        $archiveWriter = new ArchiveWriter($parameters);
        $logAggregator = new LogAggregator($parameters);

        $processor = new ArchiveProcessor($parameters, $archiveWriter, $logAggregator);

        $numMaxSteps = $exploreStep + 3;
        $numMaxStepsTotal = $this->configuration->getMaxSteps();
        if ($numMaxSteps > $numMaxStepsTotal) {
            $numMaxSteps = $numMaxStepsTotal;
        }

        $recordBuilder = new GenericUsersFlow($dataSource, $numMaxSteps, $this->configuration);
        $records = $recordBuilder->aggregate($processor, $exploreStep, $exploreUrl);

        $table = reset($records);
        $table->queueFilter('ReplaceSummaryRowLabel');

        return $table;
    }

    /**
     * Get all actions that were performed as part of a specific interaction step. For example "Give me all pages that
     * were viewed in the first step". Their subtables hold rows to where the users proceeded to next.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param string $interactionPosition The interaction step label to expand, such as '1' for the first step.
     * @param int|false $offsetActionsPerStep The row offset to apply when loading additional actions from the
     *                                        "Others" group.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     * @param int|false $idSubtable The subtable ID to load directly when requesting proceeded-to links for an
     *                              action row.
     * @param string|false $dataSource The data source to use. Supports 'page_url' or 'page_title'; defaults to
     *                                 'page_url'.
     * @return DataTable|DataTable\Map The actions for the requested interaction step or action subtable.
     *
     */
    public function getInteractionActions($idSite, $period, $date, $interactionPosition, $offsetActionsPerStep = false, $segment = false, $idSubtable = false, $dataSource = false)
    {
        Piwik::checkUserHasViewAccess($idSite);

        if (Period::isMultiplePeriod($date, $period) || Site::getIdSitesFromIdSitesString(strval($idSite)) != [$idSite]) {
            throw new \Exception('Requesting multiple dates or sites is currently not supported.');
        }

        $requestsTargetLinks = !empty($idSubtable);

        if (!$requestsTargetLinks) {
            // in this case we are fetching first level actions and not the subtable of one of those actions
            $table = $this->getDataTable($idSite, $period, $date, $segment, $dataSource, $expanded = false);
            $stepRow = $table->getRowFromLabel($interactionPosition);

            if (!$stepRow) {
                return new DataTable();
            }
            $idSubtable = $stepRow->getIdSubDataTable();

            if (!$idSubtable) {
                return new DataTable();
            }

            unset($table); // the above table contains like only 10 rows so no need to destroy it
        }

        $stepSubtable = $this->getDataTable($idSite, $period, $date, $segment, $dataSource, $expanded = false, $idSubtable);
        $stepSubtable->filter('Sort', array(Metrics::NB_VISITS));
        if ($offsetActionsPerStep && !$requestsTargetLinks) {
            // this way we only show the actions within the others group
            $stepSubtable->filter('Limit', array($offset = $offsetActionsPerStep, $limit = -1, $keepSummaryRow = true));
        }

        $stepSubtable->filter('\Piwik\Plugins\UsersFlow\DataTable\Filter\ReplaceActionLabels');

        return $stepSubtable;
    }

    /**
     * List the available data sources that can be requested by the Users Flow API.
     *
     * @return array<int, array{value: string, name: string}> The supported data source identifiers and their
     *                                                         translated names.
     */
    public function getAvailableDataSources()
    {
        Piwik::checkUserHasSomeViewAccess();

        return DataSources::getAvailableDataSources();
    }

    private function getDataTable($idSite, $period, $date, $segment, $dataSource, $expanded, $idSubtable = null, $flat = false)
    {
        if (false === $idSubtable) {
            $idSubtable = null;
        }

        if ($dataSource === DataSources::DATA_SOURCE_PAGE_TITLE) {
            $recordName = Archiver::USERSFLOW_PAGE_TITLE_ARCHIVE_RECORD;
        } else {
            $recordName = Archiver::USERSFLOW_ARCHIVE_RECORD;
        }

        return Archive::createDataTableFromArchive(
            $recordName,
            $idSite,
            $period,
            $date,
            $segment,
            $expanded,
            $flat,
            $idSubtable
        );
    }
}
