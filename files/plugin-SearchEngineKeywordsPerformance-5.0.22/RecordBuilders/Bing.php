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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders;

use Piwik\ArchiveProcessor;
use Piwik\ArchiveProcessor\Record;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Log;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Importer\Bing as BingImporter;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Bing as BingModel;
use Piwik\Site;

class Bing extends \Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Base
{
    /**
     * Key used for archives
     */
    public const KEYWORDS_BING_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_keywords';
    /**
     * Keys used for crawl stats archives / metrics
     */
    public const CRAWLSTATS_OTHER_CODES_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_other_codes';
    public const CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_blocked_robots';
    public const CRAWLSTATS_CODE_2XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_code_2xx';
    public const CRAWLSTATS_CODE_301_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_code_301';
    public const CRAWLSTATS_CODE_302_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_code_303';
    public const CRAWLSTATS_CODE_4XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_code_4xx';
    public const CRAWLSTATS_CODE_5XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_code_5xx';
    public const CRAWLSTATS_TIMEOUT_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_timeout';
    public const CRAWLSTATS_MALWARE_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_malware';
    public const CRAWLSTATS_ERRORS_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_errors';
    public const CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_crawledpages';
    public const CRAWLSTATS_DNS_FAILURE_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_dnsfail';
    public const CRAWLSTATS_IN_INDEX_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_inindex';
    public const CRAWLSTATS_IN_LINKS_RECORD_NAME = 'SearchEngineKeywordsPerformance_bing_crawlstats_inlinks';
    /**
     * @var string
     */
    private $apiKey;
    /**
     * @var string
     */
    private $apiUrl;
    /**
     * @var Log\LoggerInterface
     */
    private $logger;
    public function __construct(string $apiKey, string $apiUrl, Log\LoggerInterface $logger)
    {
        parent::__construct();
        $this->apiKey = $apiKey;
        $this->apiUrl = $apiUrl;
        $this->logger = $logger;
        $this->columnAggregationOps = array_merge(Metrics::getColumnsAggregationOperations(), [
            self::CRAWLSTATS_OTHER_CODES_RECORD_NAME => 'max',
            self::CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_2XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_301_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_302_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_4XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_5XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_TIMEOUT_RECORD_NAME => 'max',
            self::CRAWLSTATS_MALWARE_RECORD_NAME => 'max',
            self::CRAWLSTATS_ERRORS_RECORD_NAME => 'max',
            self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => 'max',
            self::CRAWLSTATS_DNS_FAILURE_RECORD_NAME => 'max',
            self::CRAWLSTATS_IN_INDEX_RECORD_NAME => 'max',
            self::CRAWLSTATS_IN_LINKS_RECORD_NAME => 'max'
        ]);
    }
    public function getRecordMetadata(ArchiveProcessor $archiveProcessor): array
    {
        return [
            Record::make(Record::TYPE_BLOB, self::KEYWORDS_BING_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_OTHER_CODES_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_2XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_301_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_302_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_4XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_5XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_TIMEOUT_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_MALWARE_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_ERRORS_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_DNS_FAILURE_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_IN_INDEX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_IN_LINKS_RECORD_NAME)
        ];
    }
    protected function aggregate(ArchiveProcessor $archiveProcessor): array
    {
        $records = [];
        $parameters = $archiveProcessor->getParams();
        $date = $parameters->getDateStart()->setTimezone('UTC')->toString('Y-m-d');
        $this->logger->debug("[SearchEngineKeywordsPerformance] Archiving bing records for {$date} and {$this->apiUrl}");
        $dataTable = $this->getKeywordsAsDataTable($date);
        if (empty($dataTable)) {
            // ensure data is present (if available)
            BingImporter::importAvailablePeriods($this->apiKey, $this->apiUrl);
            $dataTable = $this->getKeywordsAsDataTable($date);
        }
        if (!empty($dataTable)) {
            $this->logger->debug("[SearchEngineKeywordsPerformance] Archiving bing keywords for {$date} and {$this->apiUrl}");
            $records[self::KEYWORDS_BING_RECORD_NAME] = $dataTable;
        }
        $this->archiveDayCrawlStatNumerics($records, $date);
        return $records;
    }
    /**
     * Returns keyword data for given parameters as DataTable
     */
    protected function getKeywordsAsDataTable(string $date): ?DataTable
    {
        $model = new BingModel();
        $keywordData = $model->getKeywordData($this->apiUrl, $date);
        if (!empty($keywordData)) {
            $dataTable = new DataTable();
            $dataTable->addRowsFromSerializedArray($keywordData);
            return $dataTable;
        }
        return null;
    }
    /**
     * Inserts various numeric records for crawl stats
     */
    protected function archiveDayCrawlStatNumerics(array &$records, string $date): void
    {
        $dataTable = $this->getCrawlStatsAsDataTable($date);
        if (!empty($dataTable)) {
            Log::debug("[SearchEngineKeywordsPerformance] Archiving bing crawl stats for {$date} and {$this->apiUrl}");
            $getValue = function ($label) use ($dataTable) {
                $row = $dataTable->getRowFromLabel($label);
                if ($row) {
                    return (int) $row->getColumn(Metrics::NB_PAGES);
                }
                return 0;
            };
            $records = array_merge($records, [
                self::CRAWLSTATS_OTHER_CODES_RECORD_NAME => $getValue('AllOtherCodes'),
                self::CRAWLSTATS_BLOCKED_ROBOTS_RECORD_NAME => $getValue('BlockedByRobotsTxt'),
                self::CRAWLSTATS_CODE_2XX_RECORD_NAME => $getValue('Code2xx'),
                self::CRAWLSTATS_CODE_301_RECORD_NAME => $getValue('Code301'),
                self::CRAWLSTATS_CODE_302_RECORD_NAME => $getValue('Code302'),
                self::CRAWLSTATS_CODE_4XX_RECORD_NAME => $getValue('Code4xx'),
                self::CRAWLSTATS_CODE_5XX_RECORD_NAME => $getValue('Code5xx'),
                self::CRAWLSTATS_TIMEOUT_RECORD_NAME => $getValue('ConnectionTimeout'),
                self::CRAWLSTATS_MALWARE_RECORD_NAME => $getValue('ContainsMalware'),
                self::CRAWLSTATS_ERRORS_RECORD_NAME => $getValue('CrawlErrors'),
                self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => $getValue('CrawledPages'),
                self::CRAWLSTATS_DNS_FAILURE_RECORD_NAME => $getValue('DnsFailures'),
                self::CRAWLSTATS_IN_INDEX_RECORD_NAME => $getValue('InIndex'),
                self::CRAWLSTATS_IN_LINKS_RECORD_NAME => $getValue('InLinks')
            ]);
            Common::destroy($dataTable);
            unset($dataTable);
        }
    }
    /**
     * Returns crawl stats for given parameters as DataTable
     */
    protected function getCrawlStatsAsDataTable(string $date): ?DataTable
    {
        $model = new BingModel();
        $keywordData = $model->getCrawlStatsData($this->apiUrl, $date);
        if (!empty($keywordData)) {
            $dataTable = new DataTable();
            $dataTable->addRowsFromSerializedArray($keywordData);
            return $dataTable;
        }
        return null;
    }
    public static function make(int $idSite): ?self
    {
        $site = new Site($idSite);
        $setting = new MeasurableSettings($site->getId(), $site->getType());
        $bingSiteUrl = $setting->bingSiteUrl;
        $doesNotHaveBing = empty($bingSiteUrl) || !$bingSiteUrl->getValue() || \false === strpos($bingSiteUrl->getValue(), '##');
        if ($doesNotHaveBing) {
            // bing api not activated for that site
            return null;
        }
        list($apiKey, $url) = explode('##', $bingSiteUrl->getValue());
        return StaticContainer::getContainer()->make(\Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Bing::class, ['apiKey' => $apiKey, 'apiUrl' => $url]);
    }
}
