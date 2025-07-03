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
use Piwik\Container\StaticContainer;
use Piwik\Config;
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
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidCredentialsException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingOAuthConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\UnknownAPIException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Google as GoogleModel;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;
use Piwik\Segment;
use Piwik\Site;
use Piwik\Log\LoggerInterface;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Google as Provider;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Google as GoogleRecordBuilder;

class Google
{
    public const DATATABLE_METADATA_TEMPORARY = 'isTemporary';
    /**
     * @var int site id
     */
    protected $idSite = null;
    /**
     * @var string url, eg http://matomo.org
     */
    protected $searchConsoleUrl = null;
    /**
     * Id if account, to use for querying data
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
     * Search types available for import
     *
     * @var array
     */
    protected static $typesToImport = ['web', 'video', 'image', 'news'];
    /**
     * Holding the dates data is available for
     * will be filled with a call of `getAvailableDates`
     */
    public static $availableDates = [];
    /**
     * Holding the dates non final data is available for
     * will be filled with a call of `getAvailableDates`
     */
    public static $availableDatesNonFinal = [];
    /**
     * @param int $idSite
     * @param bool $force  force reimport of all data
     */
    public function __construct($idSite, $force = \false)
    {
        $this->idSite = $idSite;
        $this->force = $force;
        $setting = new MeasurableSettings($idSite);
        $searchConsoleUrl = $setting->googleSearchConsoleUrl;
        [$this->accountId, $this->searchConsoleUrl] = explode('##', $searchConsoleUrl->getValue());
    }
    protected static function getRowCountToImport()
    {
        return Config::getInstance()->General['datatable_archiving_maximum_rows_referrers'];
    }
    /**
     * Triggers keyword import and plugin archiving for all dates search console has data for
     *
     * @param string|int|null $limitKeywordDates if integer given: limits the amount of imported dates to the last
     *                                           available X if string given: only imports keywords for the given
     *                                           string date
     * @return void
     */
    public function importAllAvailableData($limitKeywordDates = null)
    {
        // if specific date given
        if (is_string($limitKeywordDates) && strlen($limitKeywordDates) == 10) {
            $availableDates = [$limitKeywordDates];
        } else {
            $availableDates = self::getAvailableDates($this->accountId, $this->searchConsoleUrl);
            sort($availableDates);
            if ($limitKeywordDates > 0) {
                $limitKeywordDates += 5;
                // always import 5 days more in the past, to ensure that non final data is imported again.
                $availableDates = array_slice($availableDates, -$limitKeywordDates, $limitKeywordDates);
            }
        }
        $this->importKeywordsForListOfDates($availableDates);
        $this->completeExistingArchivesForListOfDates($availableDates);
    }
    protected function importKeywordsForListOfDates($datesToImport)
    {
        foreach ($datesToImport as $date) {
            foreach (self::$typesToImport as $type) {
                $this->importKeywordsIfNecessary($this->accountId, $this->searchConsoleUrl, $date, $type, $this->force);
            }
        }
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
     * Imports keyword to model storage if not already done
     *
     * @param string $accountId google account id
     * @param string $url       url, eg http://matomo.org
     * @param string $date      date string, eg 2016-12-24
     * @param string $type      'web', 'image', 'video' or 'news'
     * @param bool   $force     force reimport
     * @return boolean
     */
    public function importKeywordsIfNecessary($accountId, $url, $date, $type, $force = \false)
    {
        $model = new GoogleModel();
        $logger = StaticContainer::get(LoggerInterface::class);
        $keywordData = $model->getKeywordData($url, $date, $type);
        // check if available data is temporary and force a reimport in that case
        if ($keywordData) {
            $dataTable = new DataTable();
            $dataTable->addRowsFromSerializedArray($keywordData);
            $isTemporary = $dataTable->getMetadata(self::DATATABLE_METADATA_TEMPORARY);
            if ($isTemporary === \true) {
                $logger->info('[SearchEngineKeywordsPerformance] Forcing reimport Google keywords for ' . $url . ' as imported data was not final.');
                $force = \true;
            }
        }
        if ($keywordData && !$force) {
            $logger->info('[SearchEngineKeywordsPerformance] Skipping import of Google keywords for ' . $date . ' and ' . $url . ' as data already imported.');
            return \false;
            // skip if data already available and no reimport forced
        }
        $dataTable = $this->getKeywordsFromConsoleAsDataTable($accountId, $url, $date, $type);
        if ($dataTable) {
            $keywordData = $dataTable->getSerialized(self::getRowCountToImport(), null, Metrics::NB_CLICKS);
            $model->archiveKeywordData($url, $date, $type, $keywordData[0]);
            return \true;
        }
        return \false;
    }
    protected static function getAvailableDates($accountId, $url)
    {
        $logger = StaticContainer::get(LoggerInterface::class);
        try {
            if (!array_key_exists($accountId . $url, self::$availableDates) || defined('PIWIK_TEST_MODE')) {
                $finalDates = StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Google')->getDatesWithSearchAnalyticsData($accountId, $url);
                self::$availableDates[$accountId . $url] = StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Google')->getDatesWithSearchAnalyticsData($accountId, $url, \false);
                self::$availableDatesNonFinal[$accountId . $url] = array_diff(self::$availableDates[$accountId . $url], $finalDates);
            }
        } catch (InvalidCredentialsException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        } catch (InvalidClientConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        } catch (MissingOAuthConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        } catch (MissingClientConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        } catch (UnknownAPIException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        } catch (\Exception $e) {
            $logger->error('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return [];
        }
        if (array_key_exists($accountId . $url, self::$availableDates)) {
            return self::$availableDates[$accountId . $url];
        }
        return [];
    }
    private static function isFinalDate($accountId, $url, $date)
    {
        if (array_key_exists($accountId . $url, self::$availableDatesNonFinal)) {
            return !in_array($date, self::$availableDatesNonFinal[$accountId . $url]);
        }
        return \true;
    }
    /**
     * Fetches data from google search console and migrates it to a Matomo Datatable
     *
     * @param string $accountId google account id
     * @param string $url       url, eg http://matomo.org
     * @param string $date      date string, eg 2016-12-24
     * @param string $type      'web', 'image', 'video' or 'news'
     * @return null|DataTable
     */
    protected function getKeywordsFromConsoleAsDataTable($accountId, $url, $date, $type)
    {
        $dataTable = new DataTable();
        $logger = StaticContainer::get(LoggerInterface::class);
        try {
            if (!defined('PIWIK_TEST_MODE') && !$this->isImportAllowedForDate($date)) {
                $logger->debug("[SearchEngineKeywordsPerformance] Skip fetching keywords from Search Console for today and dates more than 500 days in the past: " . $date);
                return null;
            }
            $availableDates = self::getAvailableDates($accountId, $url);
            if (!in_array($date, $availableDates)) {
                $logger->debug("[SearchEngineKeywordsPerformance] No {$type} keywords available for {$date} and {$url}");
                return null;
            }
            $logger->debug("[SearchEngineKeywordsPerformance] Fetching {$type} keywords for {$date} and {$url}");
            $keywordData = StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Google')->getSearchAnalyticsData($accountId, $url, $date, $type, self::getRowCountToImport());
        } catch (InvalidCredentialsException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        } catch (InvalidClientConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        } catch (MissingOAuthConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        } catch (MissingClientConfigException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        } catch (UnknownAPIException $e) {
            $logger->info('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        } catch (\Exception $e) {
            $logger->error('[SearchEngineKeywordsPerformance] Exception while importing Google keywords for ' . $url . ': ' . $e->getMessage());
            Provider::getInstance()->recordNewApiErrorForProvider();
            return null;
        }
        if (!self::isFinalDate($accountId, $url, $date)) {
            $dataTable->setMetadata(self::DATATABLE_METADATA_TEMPORARY, \true);
        }
        if (empty($keywordData) || !($rows = $keywordData->getRows())) {
            return $dataTable;
            // return empty table so it will be stored
        }
        foreach ($rows as $keywordDataSet) {
            /** @var \Google\Service\SearchConsole\ApiDataRow $keywordDataSet */
            $keys = $keywordDataSet->getKeys();
            $rowData = [
                DataTable\Row::COLUMNS => [
                    'label' => reset($keys),
                    Metrics::NB_CLICKS => (int) $keywordDataSet->getClicks(),
                    Metrics::NB_IMPRESSIONS => (int) $keywordDataSet->getImpressions(),
                    Metrics::CTR => (float) $keywordDataSet->getCtr(),
                    Metrics::POSITION => (float) $keywordDataSet->getPosition()
                ]
            ];
            $row = new DataTable\Row($rowData);
            $dataTable->addRow($row);
        }
        unset($keywordData);
        return $dataTable;
    }
    protected function isImportAllowedForDate($date): bool
    {
        $site = new Site($this->idSite);
        $siteCreationDate = $site->getCreationDate()->subDay(30);
        $earliestDate = Date::now()->subDay(500);
        $earliestImportDate = $siteCreationDate->isEarlier($earliestDate) ? $earliestDate : $siteCreationDate;
        $archivedDate = Date::factory($date);
        if ($archivedDate->isEarlier($earliestImportDate) || $archivedDate->isToday()) {
            return \false;
        }
        return \true;
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
        /** @var GoogleRecordBuilder[] $recordBuilders */
        $recordBuilders = GoogleRecordBuilder::makeAll($this->idSite);
        if (empty($recordBuilders)) {
            return;
        }
        foreach ($recordBuilders as $builder) {
            if ($period instanceof Day) {
                $builder->buildFromLogs($archiveProcessor);
            } else {
                $builder->buildForNonDayPeriod($archiveProcessor);
            }
        }
        $archiveWriter->flushSpools();
        DataTableManager::getInstance()->deleteAll();
    }
}
