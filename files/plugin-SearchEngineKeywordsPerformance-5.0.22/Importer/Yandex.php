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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Importer;

use Piwik\ArchiveProcessor;
use Piwik\ArchiveProcessor\Parameters;
use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\DataAccess\ArchiveSelector;
use Piwik\DataAccess\ArchiveWriter;
use Piwik\DataAccess\LogAggregator;
use Piwik\DataTable;
use Piwik\DataTable\Manager as DataTableManager;
use Piwik\Date;
use Piwik\Period\Day;
use Piwik\Period\Month;
use Piwik\Period\Week;
use Piwik\Period\Year;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidCredentialsException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\RateLimitApiException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Yandex as YandexModel;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;
use Piwik\Segment;
use Piwik\Site;
use Piwik\Log\LoggerInterface;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex as Provider;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Yandex as YandexRecordBuilder;

class Yandex
{
    /**
     * Yandex provides keyword data with a delay of some days
     * Dates newer than X days, will automatically forced to be re-imported
     * If an empty result is returned by the API for such a day, the result will not be stored at all
     * This prevents the UI from displaying that data is available for such a day
     */
    public const MAX_DAYS_KEYWORD_DATA_DELAY = 6;
    /**
     * Site id
     *
     * @var int
     */
    protected $idSite = null;
    /**
     * Host Id to query data for, eg https:piwik.org:443
     *
     * @var string
     */
    protected $yandexHostId = null;
    /**
     * ID of account, to use for querying data
     *
     * @var string
     */
    protected $accountId = null;
    /**
     * Force Data Import
     *
     * @var bool
     */
    protected $force = \false;
    /**
     * @param int $idSite
     * @param bool $force  force reimport of all data
     */
    public function __construct($idSite, $force = \false)
    {
        $this->idSite = $idSite;
        $this->force = $force;
        $setting = new MeasurableSettings($idSite);
        $yandexConfig = $setting->yandexAccountAndHostId;
        $siteConfig = $yandexConfig->getValue();
        [$this->accountId, $this->yandexHostId] = explode('##', $siteConfig);
    }
    protected static function getRowCountToImport()
    {
        return Config::getInstance()->General['datatable_archiving_maximum_rows_referrers'];
    }
    /**
     * Run importer for all available data
     */
    public function importAllAvailableData($limitDays = 100)
    {
        if (is_string($limitDays) && strlen($limitDays) == 10) {
            $dates = [$limitDays];
        } else {
            for ($i = 0; $i <= $limitDays; $i++) {
                $dates[] = date('Y-m-d', strtotime("-{$i} days"));
            }
        }
        foreach ($dates as $date) {
            self::importAvailableDataForDate($this->accountId, $this->yandexHostId, $date, $this->force);
        }
        if (empty($dates)) {
            return;
        }
        $this->completeExistingArchivesForListOfDates($dates);
    }
    protected function completeExistingArchivesForListOfDates($datesToComplete)
    {
        $days = $weeks = $months = $years = [];
        sort($datesToComplete);
        foreach ($datesToComplete as $date) {
            $date = Date::factory($date);
            $day = new Day($date);
            $days[$day->toString()] = $day;
            $week = new Week($date);
            $weeks[$week->getRangeString()] = $week;
            $month = new Month($date);
            $months[$month->getRangeString()] = $month;
            $year = new Year($date);
            $years[$year->getRangeString()] = $year;
        }
        $periods = $days + $weeks + $months + $years;
        foreach ($periods as $period) {
            $this->completeExistingArchiveIfAny($period);
        }
    }
    /**
     * Imports available data to model storage if not already done
     *
     * @param string $accountId Id oc account to use
     * @param string $hostId    url, eg https:piwik.org:443
     * @param string $date     date, eg 2019-05-20
     * @return array
     */
    public static function importAvailableDataForDate($accountId, $hostId, $date, $force = \false)
    {
        $datesImported = [];
        $timestamp = strtotime($date);
        if ($timestamp > time()) {
            return [];
            // no import for dates in the future
        }
        $logger = StaticContainer::get(LoggerInterface::class);
        if ($timestamp > time() - self::MAX_DAYS_KEYWORD_DATA_DELAY * 24 * 3600) {
            $force = \true;
            // always reimport the last few days
        }
        $model = new YandexModel();
        try {
            $availableKeywordsDataTable = new DataTable();
            $availableKeywords = $model->getKeywordData($hostId, $date);
            if (!empty($availableKeywords)) {
                $availableKeywordsDataTable->addRowsFromSerializedArray($availableKeywords);
            }
            // Only assume keywords were imported if there are actually some rows available, otherwise try to import them (again)
            if ($availableKeywordsDataTable->getRowsCountWithoutSummaryRow() > 0 && !$force) {
                $logger->debug("[SearchEngineKeywordsPerformance] Yandex keywords already imported for {$hostId} and date {$date}");
            } else {
                $logger->debug("[SearchEngineKeywordsPerformance] Fetching Yandex keywords for {$hostId} and date {$date}");
                $keywords = StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Yandex')->getSearchAnalyticsData($accountId, $hostId, $date);
                $datesImported[] = $date;
                $dataTable = self::getKeywordsAsDataTable($keywords);
                // do not store empty results for the last days
                if ($dataTable && ($dataTable->getRowsCountWithoutSummaryRow() > 0 || $timestamp < time() - self::MAX_DAYS_KEYWORD_DATA_DELAY * 24 * 3600)) {
                    $keywordData = $dataTable->getSerialized(self::getRowCountToImport(), null, Metrics::NB_CLICKS);
                    $logger->debug("[SearchEngineKeywordsPerformance] Importing Yandex keywords for {$hostId} / {$date}");
                    $model->archiveKeywordData($hostId, $date, $keywordData[0]);
                }
            }
        } catch (InvalidCredentialsException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Yandex keywords for ' . $hostId . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
        } catch (RateLimitApiException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Yandex keywords for ' . $hostId . ': ' . $e->getMessage());
        } catch (\Exception $e) {
            $logger->error('[SearchEngineKeywordsPerformance] Exception while importing Yandex keywords for ' . $hostId . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
        }
        try {
            $availableCrawlStats = $model->getCrawlStatsData($hostId, $date);
            if (!empty($availableCrawlStats) && !$force) {
                $logger->debug("[SearchEngineKeywordsPerformance] Yandex crawl stats already imported for {$hostId} and date {$date}");
            } else {
                $logger->debug("[SearchEngineKeywordsPerformance] Fetching Yandex crawl stats for {$hostId} and date {$date}");
                $crawlStats = StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Yandex')->getCrawlStats($accountId, $hostId, $date);
                $datesImported[] = $date;
                $dataTable = self::getCrawlStatsAsDataTable($crawlStats);
                if ($dataTable) {
                    $keywordData = $dataTable->getSerialized();
                    $logger->debug("[SearchEngineKeywordsPerformance] Importing Yandex crawl stats for {$hostId} and date {$date}");
                    $model->archiveCrawlStatsData($hostId, $date, $keywordData[0]);
                }
            }
        } catch (InvalidCredentialsException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Yandex crawl stats for ' . $hostId . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
        } catch (RateLimitApiException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Yandex crawl stats for ' . $hostId . ': ' . $e->getMessage());
        } catch (\Exception $e) {
            // ignore empty server reply as they seem temporary only
            if (strpos($e->getMessage(), 'Empty reply from server')) {
                $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Yandex crawl stats for ' . $hostId . ': ' . $e->getMessage());
            } else {
                $logger->error('[SearchEngineKeywordsPerformance] Exception while importing Yandex crawl stats for ' . $hostId . ': ' . $e->getMessage());
            }
            Provider::getInstance()->recordNewApiErrorForProvider();
        }
        $datesImported = array_unique($datesImported);
        sort($datesImported);
        return $datesImported;
    }
    protected static function getKeywordsAsDataTable($keywords)
    {
        $dataTable = new DataTable();
        if (empty($keywords)) {
            return $dataTable;
        }
        foreach ($keywords as $keywordDataSet) {
            // If the keyword is empty, that will cause an error if we try to add the row. Skip and move on to the next.
            if (empty($keywordDataSet['keyword'])) {
                continue;
            }
            $rowData = [
                DataTable\Row::COLUMNS => [
                    'label' => $keywordDataSet['keyword'],
                    Metrics::NB_CLICKS => (int) $keywordDataSet['clicks'],
                    Metrics::NB_IMPRESSIONS => (int) $keywordDataSet['impressions'],
                    Metrics::CTR => (float) round($keywordDataSet['clicks'] / $keywordDataSet['impressions'], 2),
                    Metrics::POSITION => (float) $keywordDataSet['position']
                ]
            ];
            $row = new DataTable\Row($rowData);
            $dataTable->addRow($row);
        }
        return $dataTable;
    }
    protected static function getCrawlStatsAsDataTable($crawlStats)
    {
        $dataTable = new DataTable();
        if (empty($crawlStats) || !is_array($crawlStats)) {
            return $dataTable;
        }
        foreach ($crawlStats as $label => $pagesCount) {
            if (empty($label)) {
                continue;
            }
            $rowData = [DataTable\Row::COLUMNS => ['label' => $label, Metrics::NB_PAGES => (int) $pagesCount]];
            $row = new DataTable\Row($rowData);
            $dataTable->addRow($row);
        }
        return $dataTable;
    }
    /**
     * Runs the Archiving for SearchEngineKeywordsPerformance plugin if an archive for the given period already exists
     *
     * @param \Piwik\Period $period
     */
    protected function completeExistingArchiveIfAny($period)
    {
        $parameters = new Parameters(new Site($this->idSite), $period, new Segment('', [$this->idSite]));
        $parameters->setRequestedPlugin('SearchEngineKeywordsPerformance');
        $parameters->onlyArchiveRequestedPlugin();
        $result = ArchiveSelector::getArchiveIdAndVisits($parameters, $period->getDateStart()->getDateStartUTC());
        $idArchive = $result[0][0] ?? null;
        if (empty($idArchive)) {
            return;
            // ignore periods that weren't archived before
        }
        $archiveWriter = new ArchiveWriter($parameters);
        $archiveWriter->idArchive = $idArchive;
        $archiveProcessor = new ArchiveProcessor($parameters, $archiveWriter, new LogAggregator($parameters));
        $archiveProcessor->setNumberOfVisits(1, 1);
        $builder = YandexRecordBuilder::make($this->idSite);
        if (empty($builder)) {
            return;
        }
        if ($period instanceof Day) {
            $builder->buildFromLogs($archiveProcessor);
        } else {
            $builder->buildForNonDayPeriod($archiveProcessor);
        }
        $archiveWriter->flushSpools();
        DataTableManager::getInstance()->deleteAll();
    }
}
