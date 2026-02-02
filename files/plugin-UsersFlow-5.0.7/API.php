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
 * API for Users Flow. The API lets you explore details about how your users or visitors navigate through your
 * website.
 *
 * @method static \Piwik\Plugins\UsersFlow\API getInstance()
 *
 * @OA\Tag(name="UsersFlow")
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

    // phpcs:disable Generic.Files.LineLength
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
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param string|bool $segment
     * @param bool $expanded
     * @param bool $flat
     * @param int|bool $idSubtable
     * @param string|bool $dataSource Either 'page_url' or 'page_title'. For a list of all available data sources call the API method UsersFlow.getAvailableDataSources
     * @return DataTable|DataTable\Map A collection of flow details.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=UsersFlow.getUsersFlowPretty",
     *     operationId="UsersFlow.getUsersFlowPretty",
     *     tags={"UsersFlow"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Parameter(ref="#/components/parameters/expandedOptional"),
     *     @OA\Parameter(ref="#/components/parameters/flatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSubtableOptional"),
     *     @OA\Parameter(
     *         name="dataSource",
     *         in="query",
     *         required=false,
     *         description="Either 'page_url' or 'page_title'. For a list of all available data sources call the API method UsersFlow.getAvailableDataSources",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="A collection of flow details.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlowPretty&idSite=1&period=day&date=today&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlowPretty&idSite=1&period=day&date=today&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlowPretty&idSite=1&period=day&date=today&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"label":"Interaction 1","nb_visits":"2781","nb_exits":"1926","nb_proceeded":"855","proceeded_rate":"0.31","exit_rate":"69%"},{"label":"Interaction 2","nb_visits":"855","nb_exits":"320","nb_proceeded":"535","proceeded_rate":"0.63","exit_rate":"37%"},{"label":"Interaction 3","nb_visits":"535","nb_exits":"165","nb_proceeded":"370","proceeded_rate":"0.69","exit_rate":"31%"},{"label":"Interaction 4","nb_visits":"370","nb_exits":"85","nb_proceeded":"285","proceeded_rate":"0.77","exit_rate":"23%"},{"label":"Interaction 5","nb_visits":"285","nb_exits":"66","nb_proceeded":"219","proceeded_rate":"0.77","exit_rate":"23%"},{"label":"Interaction 6","nb_visits":"219","nb_exits":"56","nb_proceeded":"163","proceeded_rate":"0.74","exit_rate":"26%"},{"label":"Interaction 7","nb_visits":"163","nb_exits":"28","nb_proceeded":"135","proceeded_rate":"0.83","exit_rate":"17%"},{"label":"Interaction 8","nb_visits":"135","nb_exits":"23","nb_proceeded":"112","proceeded_rate":"0.83","exit_rate":"17%"},{"label":"Interaction 9","nb_visits":"112","nb_exits":"23","nb_proceeded":"89","proceeded_rate":"0.79","exit_rate":"21%"},{"label":"Interaction 10","nb_visits":"89","nb_exits":"14","nb_proceeded":"75","proceeded_rate":"0.84","exit_rate":"16%"}}},
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
     *             example={{"label":"Interaction 1","nb_visits":2781,"nb_exits":1926,"nb_proceeded":855,"proceeded_rate":0.31,"exit_rate":"69%"},{"label":"Interaction 2","nb_visits":855,"nb_exits":320,"nb_proceeded":535,"proceeded_rate":0.63,"exit_rate":"37%"},{"label":"Interaction 3","nb_visits":535,"nb_exits":165,"nb_proceeded":370,"proceeded_rate":0.69,"exit_rate":"31%"},{"label":"Interaction 4","nb_visits":370,"nb_exits":85,"nb_proceeded":285,"proceeded_rate":0.77,"exit_rate":"23%"},{"label":"Interaction 5","nb_visits":285,"nb_exits":66,"nb_proceeded":219,"proceeded_rate":0.77,"exit_rate":"23%"},{"label":"Interaction 6","nb_visits":219,"nb_exits":56,"nb_proceeded":163,"proceeded_rate":0.74,"exit_rate":"26%"},{"label":"Interaction 7","nb_visits":163,"nb_exits":28,"nb_proceeded":135,"proceeded_rate":0.83,"exit_rate":"17%"},{"label":"Interaction 8","nb_visits":135,"nb_exits":23,"nb_proceeded":112,"proceeded_rate":0.83,"exit_rate":"17%"},{"label":"Interaction 9","nb_visits":112,"nb_exits":23,"nb_proceeded":89,"proceeded_rate":0.79,"exit_rate":"21%"},{"label":"Interaction 10","nb_visits":89,"nb_exits":14,"nb_proceeded":75,"proceeded_rate":0.84,"exit_rate":"16%"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="label", type="string"),
     *                         @OA\Property(property="nb_visits", type="integer"),
     *                         @OA\Property(property="nb_exits", type="integer"),
     *                         @OA\Property(property="nb_proceeded", type="integer"),
     *                         @OA\Property(property="proceeded_rate", type={"string", "number", "integer", "boolean", "array", "object", "null"}),
     *                         @OA\Property(property="exit_rate", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="label   nb_visits   nb_exits    nb_proceeded    proceeded_rate  exit_rate
Interaction 1   2781    1926    855 0.31    69%
Interaction 2   855 320 535 0.63    37%
Interaction 3   535 165 370 0.69    31%
Interaction 4   370 85  285 0.77    23%
Interaction 5   285 66  219 0.77    23%
Interaction 6   219 56  163 0.74    26%
Interaction 7   163 28  135 0.83    17%
Interaction 8   135 23  112 0.83    17%
Interaction 9   112 23  89  0.79    21%
Interaction 10  89  14  75  0.84    16%"
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

    // phpcs:disable Generic.Files.LineLength
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
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param int $limitActionsPerStep By default, only 5 rows per interaction step are returned and all other rows are merged into "Others".
     * @param int|bool $exploreStep Optional filter on visit step tied to the pageview_position column.
     * @param string|bool $exploreUrl Optional URL filter by.
     * @param string|bool $segment
     * @param bool $expanded
     * @param string|bool $dataSource Either 'page_url' or 'page_title'. For a list of all available data sources call the API method UsersFlow.getAvailableDataSources
     * @return DataTable|DataTable\Map
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=UsersFlow.getUsersFlow",
     *     operationId="UsersFlow.getUsersFlow",
     *     tags={"UsersFlow"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(
     *         name="limitActionsPerStep",
     *         in="query",
     *         required=false,
     *         description="By default, only 5 rows per interaction step are returned and all other rows are merged into ""Others"".",
     *         @OA\Schema(
     *             type="integer",
     *             default=5
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="exploreStep",
     *         in="query",
     *         required=false,
     *         description="Optional filter on visit step tied to the pageview_position column.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="exploreUrl",
     *         in="query",
     *         required=false,
     *         description="Optional URL filter by.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Parameter(ref="#/components/parameters/expandedOptional"),
     *     @OA\Parameter(
     *         name="dataSource",
     *         in="query",
     *         required=false,
     *         description="Either 'page_url' or 'page_title'. For a list of all available data sources call the API method UsersFlow.getAvailableDataSources",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlow&idSite=1&period=day&date=today&limitActionsPerStep=5&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlow&idSite=1&period=day&date=today&limitActionsPerStep=5&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=UsersFlow.getUsersFlow&idSite=1&period=day&date=today&limitActionsPerStep=5&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"label":"1","nb_visits":"2781","nb_exits":"1926","nb_proceeded":"855"},{"label":"2","nb_visits":"855","nb_exits":"320","nb_proceeded":"535"},{"label":"3","nb_visits":"535","nb_exits":"165","nb_proceeded":"370"},{"label":"4","nb_visits":"370","nb_exits":"85","nb_proceeded":"285"},{"label":"5","nb_visits":"285","nb_exits":"66","nb_proceeded":"219"},{"label":"6","nb_visits":"219","nb_exits":"56","nb_proceeded":"163"},{"label":"7","nb_visits":"163","nb_exits":"28","nb_proceeded":"135"},{"label":"8","nb_visits":"135","nb_exits":"23","nb_proceeded":"112"},{"label":"9","nb_visits":"112","nb_exits":"23","nb_proceeded":"89"},{"label":"10","nb_visits":"89","nb_exits":"14","nb_proceeded":"75"}}},
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
     *             example={{"label":"1","nb_visits":2781,"nb_exits":1926,"nb_proceeded":855},{"label":"2","nb_visits":855,"nb_exits":320,"nb_proceeded":535},{"label":"3","nb_visits":535,"nb_exits":165,"nb_proceeded":370},{"label":"4","nb_visits":370,"nb_exits":85,"nb_proceeded":285},{"label":"5","nb_visits":285,"nb_exits":66,"nb_proceeded":219},{"label":"6","nb_visits":219,"nb_exits":56,"nb_proceeded":163},{"label":"7","nb_visits":163,"nb_exits":28,"nb_proceeded":135},{"label":"8","nb_visits":135,"nb_exits":23,"nb_proceeded":112},{"label":"9","nb_visits":112,"nb_exits":23,"nb_proceeded":89},{"label":"10","nb_visits":89,"nb_exits":14,"nb_proceeded":75}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="label", type="string"),
     *                         @OA\Property(property="nb_visits", type="integer"),
     *                         @OA\Property(property="nb_exits", type="integer"),
     *                         @OA\Property(property="nb_proceeded", type="integer")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="label   nb_visits   nb_exits    nb_proceeded
1   2781    1926    855
2   855 320 535
3   535 165 370
4   370 85  285
5   285 66  219
6   219 56  163
7   163 28  135
8   135 23  112
9   112 23  89
10  89  14  75"
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get all actions that were performed as part of a specific interaction step. For example "Give me all pages that
     * were viewed in the first step". Their subtables hold rows to where the users proceeded to next.
     *
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param string $interactionPosition The label identifying the row to load as a subtable. E.g. '1' for the first
     * row. [@example=2]
     * @param int|bool $offsetActionsPerStep Optional number to offset the results by.
     * @param string|bool $segment
     * @param int|bool $idSubtable
     * @param string|bool $dataSource Either 'page_url' or 'page_title'
     * @return DataTable|DataTable\Map
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=UsersFlow.getInteractionActions",
     *     operationId="UsersFlow.getInteractionActions",
     *     tags={"UsersFlow"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(
     *         name="interactionPosition",
     *         in="query",
     *         required=true,
     *         description="The label identifying the row to load as a subtable. E.g. '1' for the first row.",
     *         @OA\Schema(
     *             type="string",
     *             example="2"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="offsetActionsPerStep",
     *         in="query",
     *         required=false,
     *         description="Optional number to offset the results by.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSubtableOptional"),
     *     @OA\Parameter(
     *         name="dataSource",
     *         in="query",
     *         required=false,
     *         description="Either 'page_url' or 'page_title'",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=UsersFlow.getInteractionActions&idSite=1&period=day&date=today&interactionPosition=2&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=UsersFlow.getInteractionActions&idSite=1&period=day&date=today&interactionPosition=2&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=UsersFlow.getInteractionActions&idSite=1&period=day&date=today&interactionPosition=2&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"label":"dive-shop.net\/cart","nb_visits":"53","nb_exits":"7","nb_proceeded":"46"},{"label":"divezone.net\/jobs","nb_visits":"37","nb_exits":"16","nb_proceeded":"21"},{"label":"dive-shop.net\/products\/diving-tank","nb_visits":"22","nb_exits":"6","nb_proceeded":"16"},{"label":"divezone.net\/diving\/bali","nb_visits":"19","nb_exits":"8","nb_proceeded":"11"},{"label":"divezone.net\/best-dive-sites","nb_visits":"16","nb_exits":"4","nb_proceeded":"12"},{"label":"dive-shop.net\/best-of-the-best","nb_visits":"14","nb_exits":"1","nb_proceeded":"13"},{"label":"dive-shop.net\/products\/basic-wetsuit","nb_visits":"14","nb_exits":"1","nb_proceeded":"13"},{"label":"divezone.net\/diving\/red-sea","nb_visits":"12","nb_exits":"5","nb_proceeded":"7"},{"label":"dive-shop.net","nb_visits":"11","nb_exits":"2","nb_proceeded":"9"},{"label":"divezone.net","nb_visits":"11","nb_exits":"6","nb_proceeded":"5"},{"label":"dive-shop.net\/products\/diving-knife","nb_visits":"10","nb_exits":"3","nb_proceeded":"7"},{"label":"divezone.net\/diving\/komodo-island","nb_visits":"10","nb_exits":"5","nb_proceeded":"5"},{"label":"divezone.net\/diving\/nusa-penida-nusa-lembongan","nb_visits":"10","nb_exits":"4","nb_proceeded":"6"},{"label":"Search","nb_visits":"10","nb_exits":"2","nb_proceeded":"8"},{"label":"dive-shop.net\/checkout","nb_visits":"9","nb_exits":"3","nb_proceeded":"6"},{"label":"divezone.net\/divesite\/uss-liberty-wreck","nb_visits":"9","nb_exits":"3","nb_proceeded":"6"},{"label":"divezone.net\/diving\/great-barrier-reef","nb_visits":"9","nb_exits":"7","nb_proceeded":"2"},{"label":"divezone.net\/diving\/indonesia","nb_visits":"9","nb_exits":"6","nb_proceeded":"3"},{"label":"divezone.net\/diving\/australia","nb_visits":"8","nb_exits":"4","nb_proceeded":"4"},{"label":"divezone.net\/diving\/florida","nb_visits":"8","nb_exits":"5","nb_proceeded":"3"},{"label":"divezone.net\/diving\/maldives","nb_visits":"8","nb_exits":"4","nb_proceeded":"4"},{"label":"divezone.net\/diving\/thailand","nb_visits":"8","nb_exits":"3","nb_proceeded":"5"},{"label":"divezone.net\/jobs\/view\/divemaster-21","nb_visits":"8","nb_exits":"2","nb_proceeded":"6"},{"label":"dive-shop.net\/products\/scuba-fins","nb_visits":"7","nb_exits":"1","nb_proceeded":"6"},{"label":"divezone.net\/diving\/hawaii","nb_visits":"7","nb_exits":"5","nb_proceeded":"2"},{"label":"divezone.net\/diving\/malaysia","nb_visits":"7","nb_exits":"2","nb_proceeded":"5"},{"label":"divezone.net\/diving\/philippines","nb_visits":"7","nb_exits":"3","nb_proceeded":"4"},{"label":"divezone.net\/jobs\/page\/2","nb_visits":"7","nb_exits":"3","nb_proceeded":"4"},{"label":"dive-shop.net\/products\/diving-accessory-starter-kit","nb_visits":"6","nb_exits":"0","nb_proceeded":"6"},{"label":"dive-shop.net\/products\/octopus","nb_visits":"6","nb_exits":"2","nb_proceeded":"4"},{"label":"divezone.net\/diving\/coron-palawan","nb_visits":"6","nb_exits":"4","nb_proceeded":"2"},{"label":"Others","nb_visits":"257","nb_exits":"112","nb_proceeded":"145"}}},
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
     *             example={{"label":"dive-shop.net\/cart","nb_visits":53,"nb_exits":7,"nb_proceeded":46},{"label":"divezone.net\/jobs","nb_visits":37,"nb_exits":16,"nb_proceeded":21},{"label":"dive-shop.net\/products\/diving-tank","nb_visits":22,"nb_exits":6,"nb_proceeded":16},{"label":"divezone.net\/diving\/bali","nb_visits":19,"nb_exits":8,"nb_proceeded":11},{"label":"divezone.net\/best-dive-sites","nb_visits":16,"nb_exits":4,"nb_proceeded":12},{"label":"dive-shop.net\/best-of-the-best","nb_visits":14,"nb_exits":1,"nb_proceeded":13},{"label":"dive-shop.net\/products\/basic-wetsuit","nb_visits":14,"nb_exits":1,"nb_proceeded":13},{"label":"divezone.net\/diving\/red-sea","nb_visits":12,"nb_exits":5,"nb_proceeded":7},{"label":"dive-shop.net","nb_visits":11,"nb_exits":2,"nb_proceeded":9},{"label":"divezone.net","nb_visits":11,"nb_exits":6,"nb_proceeded":5},{"label":"dive-shop.net\/products\/diving-knife","nb_visits":10,"nb_exits":3,"nb_proceeded":7},{"label":"divezone.net\/diving\/komodo-island","nb_visits":10,"nb_exits":5,"nb_proceeded":5},{"label":"divezone.net\/diving\/nusa-penida-nusa-lembongan","nb_visits":10,"nb_exits":4,"nb_proceeded":6},{"label":"Search","nb_visits":10,"nb_exits":2,"nb_proceeded":8},{"label":"dive-shop.net\/checkout","nb_visits":9,"nb_exits":3,"nb_proceeded":6},{"label":"divezone.net\/divesite\/uss-liberty-wreck","nb_visits":9,"nb_exits":3,"nb_proceeded":6},{"label":"divezone.net\/diving\/great-barrier-reef","nb_visits":9,"nb_exits":7,"nb_proceeded":2},{"label":"divezone.net\/diving\/indonesia","nb_visits":9,"nb_exits":6,"nb_proceeded":3},{"label":"divezone.net\/diving\/australia","nb_visits":8,"nb_exits":4,"nb_proceeded":4},{"label":"divezone.net\/diving\/florida","nb_visits":8,"nb_exits":5,"nb_proceeded":3},{"label":"divezone.net\/diving\/maldives","nb_visits":8,"nb_exits":4,"nb_proceeded":4},{"label":"divezone.net\/diving\/thailand","nb_visits":8,"nb_exits":3,"nb_proceeded":5},{"label":"divezone.net\/jobs\/view\/divemaster-21","nb_visits":8,"nb_exits":2,"nb_proceeded":6},{"label":"dive-shop.net\/products\/scuba-fins","nb_visits":7,"nb_exits":1,"nb_proceeded":6},{"label":"divezone.net\/diving\/hawaii","nb_visits":7,"nb_exits":5,"nb_proceeded":2},{"label":"divezone.net\/diving\/malaysia","nb_visits":7,"nb_exits":2,"nb_proceeded":5},{"label":"divezone.net\/diving\/philippines","nb_visits":7,"nb_exits":3,"nb_proceeded":4},{"label":"divezone.net\/jobs\/page\/2","nb_visits":7,"nb_exits":3,"nb_proceeded":4},{"label":"dive-shop.net\/products\/diving-accessory-starter-kit","nb_visits":6,"nb_exits":0,"nb_proceeded":6},{"label":"dive-shop.net\/products\/octopus","nb_visits":6,"nb_exits":2,"nb_proceeded":4},{"label":"divezone.net\/diving\/coron-palawan","nb_visits":6,"nb_exits":4,"nb_proceeded":2},{"label":"divezone.net\/diving\/sipadan","nb_visits":6,"nb_exits":4,"nb_proceeded":2},{"label":"divezone.net\/diving\/tulamben","nb_visits":6,"nb_exits":2,"nb_proceeded":4},{"label":"dive-shop.net\/my-account","nb_visits":5,"nb_exits":0,"nb_proceeded":5}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="label", type="string"),
     *                         @OA\Property(property="nb_visits", type="integer"),
     *                         @OA\Property(property="nb_exits", type="integer"),
     *                         @OA\Property(property="nb_proceeded", type="integer")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="label   nb_visits   nb_exits    nb_proceeded
dive-shop.net/cart  53  7   46
divezone.net/jobs   37  16  21
dive-shop.net/products/diving-tank  22  6   16
divezone.net/diving/bali    19  8   11
divezone.net/best-dive-sites    16  4   12
dive-shop.net/best-of-the-best  14  1   13
dive-shop.net/products/basic-wetsuit    14  1   13
divezone.net/diving/red-sea 12  5   7
dive-shop.net   11  2   9
divezone.net    11  6   5
dive-shop.net/products/diving-knife 10  3   7
divezone.net/diving/komodo-island   10  5   5
divezone.net/diving/nusa-penida-nusa-lembongan  10  4   6
Search  10  2   8
dive-shop.net/checkout  9   3   6
divezone.net/divesite/uss-liberty-wreck 9   3   6
divezone.net/diving/great-barrier-reef  9   7   2
divezone.net/diving/indonesia   9   6   3
divezone.net/diving/australia   8   4   4
divezone.net/diving/florida 8   5   3
divezone.net/diving/maldives    8   4   4
divezone.net/diving/thailand    8   3   5
divezone.net/jobs/view/divemaster-21    8   2   6
dive-shop.net/products/scuba-fins   7   1   6
divezone.net/diving/hawaii  7   5   2
divezone.net/diving/malaysia    7   2   5
divezone.net/diving/philippines 7   3   4
divezone.net/jobs/page/2    7   3   4
dive-shop.net/products/diving-accessory-starter-kit 6   0   6
dive-shop.net/products/octopus  6   2   4
divezone.net/diving/coron-palawan   6   4   2
divezone.net/diving/sipadan 6   4   2
divezone.net/diving/tulamben    6   2   4
dive-shop.net/my-account    5   0   5
dive-shop.net/products/silicone-grease  5   0   5
divezone.net/caribbean-sea-liveaboard-diving    5   3   2
divezone.net/divesite/richelieu-rock    5   1   4
divezone.net/diving/galapagos   5   3   2
divezone.net/diving/gili-islands-lombok 5   1   4
divezone.net/diving/koh-phi-phi 5   1   4
divezone.net/jobs/view/a-couple-of-instructors-needed-to-run-a-brand-new-dive-center-in-little-corn-island  5   2   3
divezone.net/jobs/view/divemaster-2 5   1   4
dive-shop.net/guides/low-visibility-dives   4   0   4
dive-shop.net/products/diving-boots 4   1   3
divezone.net/divesite/manta-point   4   1   3
divezone.net/divesite/ss-yongala-wreck  4   2   2
divezone.net/jobs/view/dive-instructor-27   4   0   4
divezone.net/jobs/view/open-water-scuba-instructor-2    4   0   4
divezone.net/jobs/view/red-sea-fresh-owsi-is-needed-in-aqaba-jordan-asap    4   0   4
divezone.net/ko-tao.htm 4   1   3
divezone.net/liveaboard/mv-belize-aggressor-iv  4   3   1
dive-shop.net/products/diving-snorkel   3   0   3
dive-shop.net/products/regulator    3   3   0
dive-shop.net/promotion/50-off-scuba-diving-masks   3   0   3
divezone.net/divesite/blue-hole 3   3   0
divezone.net/divesite/deep-turbo    3   1   2
divezone.net/divesite/hmas-brisbane 3   1   2
divezone.net/divesite/ss-thistlegorm-wreck  3   0   3
divezone.net/diving/amed    3   1   2
divezone.net/diving/bunaken-manado  3   2   1
divezone.net/diving/cayman-islands  3   1   2
divezone.net/diving/costa-rica  3   2   1
divezone.net/diving/dahab   3   0   3
divezone.net/diving/koh-tao 3   0   3
divezone.net/diving/marsa-alam  3   3   0
divezone.net/diving/padang-bai  3   2   1
divezone.net/diving/perenthians-islands 3   2   1
divezone.net/diving/port-douglas    3   2   1
divezone.net/diving/pulau-menjangan 3   0   3
divezone.net/diving/seychelles  3   2   1
divezone.net/diving/similan-islands 3   2   1
divezone.net/diving/wakatobi    3   2   1
divezone.net/liveaboard 3   0   3"
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
    public function getInteractionActions($idSite, $period, $date, $interactionPosition, $offsetActionsPerStep = false, $segment = false, $idSubtable = false, $dataSource = false)
    {
        Piwik::checkUserHasViewAccess($idSite);

        if (Period::isMultiplePeriod($date, $period) || Site::getIdSitesFromIdSitesString(strval($idSite)) !== [$idSite]) {
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of all available data sources
     * @return array
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=UsersFlow.getAvailableDataSources",
     *     operationId="UsersFlow.getAvailableDataSources",
     *     tags={"UsersFlow"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="Example links: [XML](https://demo.matomo.cloud/?module=API&method=UsersFlow.getAvailableDataSources&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=UsersFlow.getAvailableDataSources&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=UsersFlow.getAvailableDataSources&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"value":"page_url","name":"Page URLs"},{"value":"page_title","name":"Page Titles"}}},
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
     *             example={{"value":"page_url","name":"Page URLs"},{"value":"page_title","name":"Page Titles"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="value", type="string"),
     *                         @OA\Property(property="name", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="value   name
page_url    Page URLs
page_title  Page Titles"
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
