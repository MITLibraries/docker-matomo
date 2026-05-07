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
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Log;
use Piwik\ArchiveProcessor\Record;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Importer\Yandex as YandexImporter;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Yandex as YandexModel;
use Piwik\Site;

class Yandex extends \Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Base
{
    /**
     * Key used for archives
     */
    public const KEYWORDS_YANDEX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_keywords';
    /**
     * Keys used for crawl stats archives / metrics
     */
    public const CRAWLSTATS_IN_INDEX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_inindex';
    public const CRAWLSTATS_APPEARED_PAGES_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_appeared';
    public const CRAWLSTATS_REMOVED_PAGES_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_removed';
    public const CRAWLSTATS_CODE_2XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_code_2xx';
    public const CRAWLSTATS_CODE_3XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_code_3xx';
    public const CRAWLSTATS_CODE_4XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_code_4xx';
    public const CRAWLSTATS_CODE_5XX_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_code_5xx';
    public const CRAWLSTATS_ERRORS_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_errors';
    public const CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME = 'SearchEngineKeywordsPerformance_yandex_crawlstats_crawledpages';
    /**
     * @var string
     */
    private $accountId;
    /**
     * @var string
     */
    private $hostId;
    /**
     * @var Log\LoggerInterface
     */
    private $logger;
    public function __construct(string $accountId, string $hostId, Log\LoggerInterface $logger)
    {
        parent::__construct();
        $this->accountId = $accountId;
        $this->hostId = $hostId;
        $this->logger = $logger;
        $this->columnAggregationOps = array_merge(Metrics::getColumnsAggregationOperations(), [
            self::CRAWLSTATS_IN_INDEX_RECORD_NAME => 'max',
            self::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME => 'max',
            self::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME => 'max',
            self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_2XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_3XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_4XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_CODE_5XX_RECORD_NAME => 'max',
            self::CRAWLSTATS_ERRORS_RECORD_NAME => 'max'
        ]);
    }
    public function getRecordMetadata(ArchiveProcessor $archiveProcessor): array
    {
        return [
            Record::make(Record::TYPE_BLOB, self::KEYWORDS_YANDEX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_IN_INDEX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_2XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_3XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_4XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_CODE_5XX_RECORD_NAME),
            Record::make(Record::TYPE_NUMERIC, self::CRAWLSTATS_ERRORS_RECORD_NAME)
        ];
    }
    protected function aggregate(ArchiveProcessor $archiveProcessor): array
    {
        $records = [];
        $parameters = $archiveProcessor->getParams();
        $date = $parameters->getDateStart()->setTimezone('UTC')->toString('Y-m-d');
        $this->logger->debug("[SearchEngineKeywordsPerformance] Archiving yandex records for {$date} and {$this->hostId}");
        $dataTable = $this->getKeywordsAsDataTable($date);
        if (empty($dataTable)) {
            // ensure data is present (if available)
            YandexImporter::importAvailableDataForDate($this->accountId, $this->hostId, $date);
            $dataTable = $this->getKeywordsAsDataTable($date);
        }
        if (!empty($dataTable)) {
            Log::debug("[SearchEngineKeywordsPerformance] Archiving yandex keywords for {$date} and {$this->hostId}");
            $records[self::KEYWORDS_YANDEX_RECORD_NAME] = $dataTable;
        }
        $records = array_merge($records, $this->archiveDayCrawlStatNumerics($date));
        return $records;
    }
    public function isEnabled(ArchiveProcessor $archiveProcessor): bool
    {
        $segment = $archiveProcessor->getParams()->getSegment();
        if (!$segment->isEmpty()) {
            $this->logger->debug("Skip Archiving for SearchEngineKeywordsPerformance plugin for segments");
            return \false;
            // do not archive data for segments
        }
        return \true;
    }
    /**
     * Returns keyword data for given parameters as DataTable
     */
    protected function getKeywordsAsDataTable(string $date): ?DataTable
    {
        $model = new YandexModel();
        $keywordData = $model->getKeywordData($this->hostId, $date);
        if (!empty($keywordData)) {
            $dataTable = new DataTable();
            $dataTable->addRowsFromSerializedArray($keywordData);
            return $dataTable;
        }
        return null;
    }
    /**
     * Returns keyword data for given parameters as DataTable
     */
    protected function archiveDayCrawlStatNumerics(string $date): array
    {
        $dataTable = $this->getCrawlStatsAsDataTable($date);
        if (!empty($dataTable)) {
            $this->logger->debug("[SearchEngineKeywordsPerformance] Archiving yandex crawl stats for {$date} and {$this->hostId}");
            $getValue = function ($label) use ($dataTable) {
                $row = $dataTable->getRowFromLabel($label);
                if ($row) {
                    return (int) $row->getColumn(Metrics::NB_PAGES);
                }
                return 0;
            };
            $numericRecords = [
                self::CRAWLSTATS_IN_INDEX_RECORD_NAME => $getValue('SEARCHABLE'),
                self::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME => $getValue('APPEARED_IN_SEARCH'),
                self::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME => $getValue('REMOVED_FROM_SEARCH'),
                self::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => $getValue('HTTP_2XX') + $getValue('HTTP_3XX') + $getValue('HTTP_4XX') + $getValue('HTTP_5XX') + $getValue('OTHER'),
                self::CRAWLSTATS_CODE_2XX_RECORD_NAME => $getValue('HTTP_2XX'),
                self::CRAWLSTATS_CODE_3XX_RECORD_NAME => $getValue('HTTP_3XX'),
                self::CRAWLSTATS_CODE_4XX_RECORD_NAME => $getValue('HTTP_4XX'),
                self::CRAWLSTATS_CODE_5XX_RECORD_NAME => $getValue('HTTP_5XX'),
                self::CRAWLSTATS_ERRORS_RECORD_NAME => $getValue('OTHER')
            ];
            Common::destroy($dataTable);
            unset($dataTable);
            return $numericRecords;
        }
        return [];
    }
    /**
     * Returns crawl stats for given parameters as DataTable
     */
    protected function getCrawlStatsAsDataTable(string $date): ?DataTable
    {
        $model = new YandexModel();
        $keywordData = $model->getCrawlStatsData($this->hostId, $date);
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
        $yandexConfig = $setting->yandexAccountAndHostId;
        $doesNotHaveYandex = empty($yandexConfig) || !$yandexConfig->getValue() || \false === strpos($yandexConfig->getValue(), '##');
        if ($doesNotHaveYandex) {
            // yandex api not activated for that site
            return null;
        }
        list($accountId, $hostId) = explode('##', $yandexConfig->getValue());
        return StaticContainer::getContainer()->make(self::class, ['accountId' => $accountId, 'hostId' => $hostId]);
    }
}
