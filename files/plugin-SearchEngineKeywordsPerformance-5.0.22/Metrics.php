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

use Piwik\Columns\Dimension;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Bing;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Yandex;

/**
 * Defines Metrics used in SearchEngineKeywordsPerformance plugin
 */
class Metrics
{
    public const NB_CLICKS = 'nb_clicks';
    public const NB_IMPRESSIONS = 'nb_impressions';
    public const CTR = 'ctr';
    public const POSITION = 'position';
    public const NB_PAGES = 'nb_pages';
    /**
     * Returns list of available keyword metrics
     *
     * @return array
     */
    public static function getKeywordMetrics()
    {
        return [self::NB_CLICKS, self::NB_IMPRESSIONS, self::CTR, self::POSITION];
    }
    /**
     * Returns metric translations
     *
     * @return array
     */
    public static function getMetricsTranslations()
    {
        return [
            self::NB_CLICKS => Piwik::translate('SearchEngineKeywordsPerformance_Clicks'),
            self::NB_IMPRESSIONS => Piwik::translate('SearchEngineKeywordsPerformance_Impressions'),
            self::CTR => Piwik::translate('SearchEngineKeywordsPerformance_Ctr'),
            self::POSITION => Piwik::translate('SearchEngineKeywordsPerformance_Position')
        ];
    }
    /**
     * Returns metric semantic types for this plugin's metrics.
     *
     * @return array
     */
    public static function getMetricSemanticTypes(): array
    {
        return [self::NB_CLICKS => Dimension::TYPE_NUMBER, self::NB_IMPRESSIONS => Dimension::TYPE_NUMBER, self::CTR => Dimension::TYPE_NUMBER, self::POSITION => Dimension::TYPE_NUMBER];
    }
    /**
     * Return metric documentations
     *
     * @return array
     */
    public static function getMetricsDocumentation()
    {
        return [
            self::NB_CLICKS => Piwik::translate('SearchEngineKeywordsPerformance_ClicksDocumentation'),
            self::NB_IMPRESSIONS => Piwik::translate('SearchEngineKeywordsPerformance_ImpressionsDocumentation'),
            self::CTR => Piwik::translate('SearchEngineKeywordsPerformance_CtrDocumentation'),
            self::POSITION => Piwik::translate('SearchEngineKeywordsPerformance_PositionDocumentation'),
            Bing::CRAWLSTATS_OTHER_CODES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlStatsOtherCodesDesc'),
            Bing::CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlBlockedByRobotsTxtDesc'),
            Bing::CRAWLSTATS_CODE_2XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlHttpStatus2xxDesc'),
            Bing::CRAWLSTATS_CODE_301_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlHttpStatus301Desc'),
            Bing::CRAWLSTATS_CODE_302_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlHttpStatus302Desc'),
            Bing::CRAWLSTATS_CODE_4XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlHttpStatus4xxDesc'),
            Bing::CRAWLSTATS_CODE_5XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlHttpStatus5xxDesc'),
            Bing::CRAWLSTATS_TIMEOUT_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlConnectionTimeoutDesc'),
            Bing::CRAWLSTATS_MALWARE_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlMalwareInfectedDesc'),
            Bing::CRAWLSTATS_ERRORS_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlErrorsDesc'),
            Bing::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlCrawledPagesDesc'),
            Bing::CRAWLSTATS_DNS_FAILURE_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlDNSFailuresDesc'),
            Bing::CRAWLSTATS_IN_INDEX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlPagesInIndexDesc'),
            Bing::CRAWLSTATS_IN_LINKS_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_BingCrawlInboundLinkDesc'),
            Yandex::CRAWLSTATS_IN_INDEX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlInIndexDesc'),
            Yandex::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlAppearedPagesDesc'),
            Yandex::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlRemovedPagesDesc'),
            Yandex::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlCrawledPagesDesc'),
            Yandex::CRAWLSTATS_CODE_2XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus2xxDesc'),
            Yandex::CRAWLSTATS_CODE_3XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus3xxDesc'),
            Yandex::CRAWLSTATS_CODE_4XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus4xxDesc'),
            Yandex::CRAWLSTATS_CODE_5XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus5xxDesc'),
            Yandex::CRAWLSTATS_ERRORS_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlErrorsDesc')
        ];
    }
    public static function getMetricIdsToProcessReportTotal()
    {
        return [self::NB_CLICKS, self::NB_IMPRESSIONS];
    }
    /**
     * Returns operations used to aggregate the metric columns
     *
     * @return array
     */
    public static function getColumnsAggregationOperations()
    {
        /*
         * Calculate average CTR based on summed impressions and summed clicks
         */
        $calcCtr = function ($val1, $val2, $thisRow, $rowToSum) {
            $sumImpressions = $thisRow->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS) + $rowToSum->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS);
            $sumClicks = $thisRow->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_CLICKS) + $rowToSum->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_CLICKS);
            if (!$sumImpressions) {
                return 0.0;
            }
            return round($sumClicks / $sumImpressions, 2);
        };
        /*
         * Calculate average position based on impressions and positions
         */
        $calcPosition = function ($val1, $val2, $thisRow, $rowToSum) {
            return round(
                (
                    $thisRow->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS)
                    * $thisRow->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::POSITION)
                    + $rowToSum->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS)
                    * $rowToSum->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::POSITION)
                ) / (
                    $thisRow->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS)
                    + $rowToSum->getColumn(\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::NB_IMPRESSIONS)
                ),
                2
            );
        };
        return [\Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::CTR => $calcCtr, \Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics::POSITION => $calcPosition];
    }
}
