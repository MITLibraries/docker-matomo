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
 * @link    https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\SearchEngineKeywordsPerformance;

use Piwik\Archive;
use Piwik\DataTable;
use Piwik\Date;
use Piwik\Period;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Google as GoogleRecordBuilder;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Bing as BingRecordBuilder;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Yandex as YandexRecordBuilders;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Bing;

/**
 * The <a href='https://plugins.matomo.org/SearchEngineKeywordsPerformance'
 * target='_blank'>SearchEngineKeywordsPerformance</a> API lets you download all your SEO search keywords from Google,
 * Bing & Yahoo and Yandex, as well as getting a detailed overview of how search robots crawl your websites and any
 * error they may encounter.
 * <br/><br/>
 * 1) download all your search keywords as they were searched on Google, Bing & Yahoo and Yandex. This includes Google
 * Images, Google Videos and Google News. This lets you view all keywords normally hidden from view behind "keyword not defined".
 * With this plugin you can view them all!
 * <br/><br/>
 * 2) download all crawling overview stats and metrics from Bring and Yahoo and Google. Many metrics are available such
 * as: Crawled pages, Crawl errors, Connection timeouts, HTTP-Status Code 301 (Permanently moved), HTTP-Status Code
 * 400-499 (Request errors), All other HTTP-Status Codes, Total pages in index, Robots.txt exclusion, DNS failures,
 * HTTP-Status Code 200-299, HTTP-Status Code 301 (Temporarily moved), HTTP-Status Code 500-599 (Internal server
 * errors), Malware infected sites, Total inbound links.
 *
 * @package Piwik\Plugins\SearchEngineKeywordsPerformance
 */
class API extends \Piwik\Plugin\API
{
    /**
     * Returns Keyword data used on any search
     * Combines imported search keywords with those returned by Referrers plugin
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywords($idSite, $period, $date)
    {
        $keywordsDataTable = $this->getKeywordsImported($idSite, $period, $date);
        $keywordsDataTable->deleteColumns([\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::POSITION, \Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS, \Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::CTR]);
        $keywordsDataTable->filter('ColumnCallbackDeleteRow', [\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_CLICKS, function ($clicks) {
            return $clicks === 0;
        }]);
        $keywordsDataTable->filter('ReplaceColumnNames', [[\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_CLICKS => 'nb_visits']]);
        $setting = new \Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings($idSite);
        $googleEnabled = !empty($setting->googleSearchConsoleUrl) && $setting->googleSearchConsoleUrl->getValue();
        $bingEnabled = !empty($setting->bingSiteUrl) && $setting->bingSiteUrl->getValue();
        $referrersApi = new \Piwik\Plugins\Referrers\API();
        $referrersKeywords = $referrersApi->getSearchEngines($idSite, $period, $date, \false, \true);
        if ($keywordsDataTable instanceof DataTable\Map) {
            $referrerTables = $referrersKeywords->getDataTables();
            foreach ($keywordsDataTable->getDataTables() as $label => $table) {
                if (!empty($referrerTables[$label])) {
                    $this->combineKeywordReports($table, $referrerTables[$label], $googleEnabled, $bingEnabled, $period);
                }
            }
        } else {
            $this->combineKeywordReports($keywordsDataTable, $referrersKeywords, $googleEnabled, $bingEnabled, $period);
        }
        return $keywordsDataTable;
    }
    private function combineKeywordReports(DataTable $keywordsDataTable, DataTable $referrersKeywords, $googleEnabled, $bingEnabled, $period)
    {
        foreach ($referrersKeywords->getRowsWithoutSummaryRow() as $searchEngineRow) {
            $label = $searchEngineRow->getColumn('label');
            if (strpos($label, 'Google') !== \false && $googleEnabled) {
                continue;
            }
            if (strpos($label, 'Bing') !== \false && $bingEnabled && $period !== 'day') {
                continue;
            }
            if (strpos($label, 'Yahoo') !== \false && $bingEnabled && $period !== 'day') {
                continue;
            }
            $keywordsTable = $searchEngineRow->getSubtable();
            if (empty($keywordsTable) || !$keywordsTable->getRowsCount()) {
                continue;
            }
            foreach ($keywordsTable->getRowsWithoutSummaryRow() as $keywordRow) {
                if ($keywordRow->getColumn('label') == \Piwik\Plugins\Referrers\API::LABEL_KEYWORD_NOT_DEFINED) {
                    continue;
                }
                $keywordsDataTable->addRow(new DataTable\Row([DataTable\Row::COLUMNS => ['label' => $keywordRow->getColumn('label'), 'nb_visits' => $keywordRow->getColumn(\Piwik\Metrics::INDEX_NB_VISITS)]]));
            }
        }
        $keywordsDataTable->filter('GroupBy', ['label']);
        $keywordsDataTable->filter('ReplaceSummaryRowLabel');
    }
    /**
     * Returns Keyword data used on any imported search engine
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsImported($idSite, $period, $date)
    {
        $googleWebKwds = $this->getKeywordsGoogleWeb($idSite, $period, $date);
        $googleImgKwds = $this->getKeywordsGoogleImage($idSite, $period, $date);
        $googleVidKwds = $this->getKeywordsGoogleVideo($idSite, $period, $date);
        $googleNwsKwds = $this->getKeywordsGoogleNews($idSite, $period, $date);
        $bingKeywords = $this->getKeywordsBing($idSite, $period, $date);
        $yandexKeywords = $this->getKeywordsYandex($idSite, $period, $date);
        return $this->combineDataTables([$googleWebKwds, $googleImgKwds, $googleVidKwds, $googleNwsKwds, $bingKeywords, $yandexKeywords]);
    }
    /**
     * Returns Keyword data used on Google
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsGoogle($idSite, $period, $date)
    {
        $googleWebKwds = $this->getKeywordsGoogleWeb($idSite, $period, $date);
        $googleImgKwds = $this->getKeywordsGoogleImage($idSite, $period, $date);
        $googleVidKwds = $this->getKeywordsGoogleVideo($idSite, $period, $date);
        $googleNwsKwds = $this->getKeywordsGoogleNews($idSite, $period, $date);
        return $this->combineDataTables([$googleWebKwds, $googleImgKwds, $googleVidKwds, $googleNwsKwds]);
    }
    /**
     * Returns a DataTable with the given datatables combined
     *
     * @param DataTable[]|DataTable\Map[] $dataTablesToCombine
     *
     * @return DataTable|DataTable\Map
     */
    protected function combineDataTables(array $dataTablesToCombine)
    {
        if (reset($dataTablesToCombine) instanceof DataTable\Map) {
            $dataTable = new DataTable\Map();
            $dataTables = [];
            foreach ($dataTablesToCombine as $dataTableMap) {
                /** @var DataTable\Map $dataTableMap */
                $tables = $dataTableMap->getDataTables();
                foreach ($tables as $label => $table) {
                    if (empty($dataTables[$label])) {
                        $dataTables[$label] = new DataTable();
                        $dataTables[$label]->setAllTableMetadata($table->getAllTableMetadata());
                        $dataTables[$label]->setMetadata(DataTable::COLUMN_AGGREGATION_OPS_METADATA_NAME, \Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::getColumnsAggregationOperations());
                    }
                    $dataTables[$label]->addDataTable($table);
                }
            }
            foreach ($dataTables as $label => $table) {
                $dataTable->addTable($table, $label);
            }
        } else {
            $dataTable = new DataTable();
            $dataTable->setAllTableMetadata(reset($dataTablesToCombine)->getAllTableMetadata());
            $dataTable->setMetadata(DataTable::COLUMN_AGGREGATION_OPS_METADATA_NAME, \Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::getColumnsAggregationOperations());
            foreach ($dataTablesToCombine as $table) {
                $dataTable->addDataTable($table);
            }
        }
        return $dataTable;
    }
    /**
     * Returns Bing keyword data used on search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsBing($idSite, $period, $date)
    {
        if (!Bing::getInstance()->isSupportedPeriod($date, $period)) {
            if (Period::isMultiplePeriod($date, $period)) {
                return new DataTable\Map();
            }
            return new DataTable();
        }
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Bing')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(BingRecordBuilder::KEYWORDS_BING_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns Yandex keyword data used on search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsYandex($idSite, $period, $date)
    {
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Yandex')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(YandexRecordBuilders::KEYWORDS_YANDEX_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns Google keyword data used on Web search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsGoogleWeb($idSite, $period, $date)
    {
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Google', 'web')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(GoogleRecordBuilder::KEYWORDS_GOOGLE_WEB_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns Google keyword data used on Image search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsGoogleImage($idSite, $period, $date)
    {
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Google', 'image')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(GoogleRecordBuilder::KEYWORDS_GOOGLE_IMAGE_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns Google keyword data used on Video search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsGoogleVideo($idSite, $period, $date)
    {
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Google', 'video')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(GoogleRecordBuilder::KEYWORDS_GOOGLE_VIDEO_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns Google keyword data used on News search
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getKeywordsGoogleNews($idSite, $period, $date)
    {
        if (!SearchEngineKeywordsPerformance::isReportEnabled('Google', 'news')) {
            return SearchEngineKeywordsPerformance::commonEmptyDataTable($period, $date);
        }
        $dataTable = $this->getDataTable(GoogleRecordBuilder::KEYWORDS_GOOGLE_NEWS_RECORD_NAME, $idSite, $period, $date);
        return $dataTable;
    }
    /**
     * Returns crawling metrics for Bing
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getCrawlingOverviewBing($idSite, $period, $date)
    {
        Piwik::checkUserHasViewAccess($idSite);
        $archive = Archive::build($idSite, $period, $date);
        $dataTable = $archive->getDataTableFromNumeric([
            BingRecordBuilder::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_IN_INDEX_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_IN_LINKS_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_MALWARE_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_ERRORS_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_DNS_FAILURE_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_TIMEOUT_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_CODE_2XX_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_CODE_301_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_CODE_302_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_CODE_4XX_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_CODE_5XX_RECORD_NAME,
            BingRecordBuilder::CRAWLSTATS_OTHER_CODES_RECORD_NAME
        ]);
        return $dataTable;
    }
    /**
     * Returns crawling metrics for Yandex
     *
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    public function getCrawlingOverviewYandex($idSite, $period, $date)
    {
        Piwik::checkUserHasViewAccess($idSite);
        $archive = Archive::build($idSite, $period, $date);
        $dataTable = $archive->getDataTableFromNumeric([
            YandexRecordBuilders::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_IN_INDEX_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_CODE_2XX_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_CODE_3XX_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_CODE_4XX_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_CODE_5XX_RECORD_NAME,
            YandexRecordBuilders::CRAWLSTATS_ERRORS_RECORD_NAME
        ]);
        return $dataTable;
    }
    /**
     * Returns list of pages that had an error while crawling for Bing
     *
     * Note: This methods returns data imported lately. It does not support any historical reports
     *
     * @param $idSite
     *
     * @return DataTable
     */
    public function getCrawlingErrorExamplesBing($idSite)
    {
        Piwik::checkUserHasViewAccess($idSite);
        $dataTable = new DataTable();
        $settings = new \Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings($idSite);
        $bingSiteSetting = $settings->bingSiteUrl;
        if (empty($bingSiteSetting) || empty($bingSiteSetting->getValue())) {
            return $dataTable;
        }
        list($apiKey, $bingSiteUrl) = explode('##', $bingSiteSetting->getValue());
        $model = new \Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Bing();
        $data = $model->getCrawlErrors($bingSiteUrl);
        if (empty($data)) {
            return $dataTable;
        }
        $dataTable->addRowsFromSerializedArray($data);
        $dataTable->filter('ColumnCallbackAddMetadata', array('label', 'url'));
        $dataTable->filter('ColumnCallbackReplace', array('label', function ($val) use ($bingSiteUrl) {
            return preg_replace('|https?://[^/]*/|i', '', $val);
        }));
        return $dataTable;
    }
    /**
     * Returns datatable for the requested archive
     *
     * @param string           $name    name of the archive to use
     * @param string|int|array $idSite  A single ID (eg, `'1'`), multiple IDs (eg, `'1,2,3'` or `array(1, 2, 3)`),
     *                                  or `'all'`.
     * @param string           $period  'day', `'week'`, `'month'`, `'year'` or `'range'`
     * @param Date|string      $date    'YYYY-MM-DD', magic keywords (ie, 'today'; {@link Date::factory()}
     *                                  or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD').
     * @return DataTable|DataTable\Map
     */
    private function getDataTable($name, $idSite, $period, $date)
    {
        Piwik::checkUserHasViewAccess($idSite);
        $archive = Archive::build($idSite, $period, $date, $segment = \false);
        $dataTable = $archive->getDataTable($name);
        $dataTable->queueFilter('ReplaceSummaryRowLabel');
        return $dataTable;
    }
}
