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
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Importer\Google as GoogleImporter;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Google as GoogleModel;
use Piwik\Site;
use Piwik\Log\LoggerInterface;

class Google extends \Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Base
{
    /**
     * Key used to archive web keywords
     */
    public const KEYWORDS_GOOGLE_WEB_RECORD_NAME = 'SearchEngineKeywordsPerformance_google_keywords_web';
    /**
     * Key used to archive image keywords
     */
    public const KEYWORDS_GOOGLE_IMAGE_RECORD_NAME = 'SearchEngineKeywordsPerformance_google_keywords_image';
    /**
     * Key used to archive video keywords
     */
    public const KEYWORDS_GOOGLE_VIDEO_RECORD_NAME = 'SearchEngineKeywordsPerformance_google_keywords_video';
    /**
     * Key used to archive news keywords
     */
    public const KEYWORDS_GOOGLE_NEWS_RECORD_NAME = 'SearchEngineKeywordsPerformance_google_keywords_news';
    /**
     * @var string
     */
    private $accountId;
    /**
     * @var string
     */
    private $searchConsoleUrl;
    /**
     * @var string
     */
    private $recordName;
    /**
     * @var LoggerInterface
     */
    private $logger;
    public function __construct(string $accountId, string $searchConsoleUrl, string $recordName, LoggerInterface $logger)
    {
        parent::__construct();
        $this->accountId = $accountId;
        $this->searchConsoleUrl = $searchConsoleUrl;
        $this->recordName = $recordName;
        $this->logger = $logger;
    }
    public function getRecordMetadata(ArchiveProcessor $archiveProcessor): array
    {
        return [ArchiveProcessor\Record::make(Record::TYPE_BLOB, $this->recordName)];
    }
    protected function aggregate(ArchiveProcessor $archiveProcessor): array
    {
        $parameters = $archiveProcessor->getParams();
        $date = $parameters->getDateStart()->setTimezone('UTC')->toString('Y-m-d');
        $record = $this->aggregateDayBySearchType($archiveProcessor, $this->recordName, $date);
        if (empty($record)) {
            return [];
        }
        return [$this->recordName => $record];
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
     * Aggregates data for a given day by type of search
     */
    protected function aggregateDayBySearchType(ArchiveProcessor $archiveProcessor, string $recordName, string $date): ?DataTable
    {
        $types = [self::KEYWORDS_GOOGLE_WEB_RECORD_NAME => 'web', self::KEYWORDS_GOOGLE_IMAGE_RECORD_NAME => 'image', self::KEYWORDS_GOOGLE_VIDEO_RECORD_NAME => 'video', self::KEYWORDS_GOOGLE_NEWS_RECORD_NAME => 'news'];
        $this->logger->debug("[SearchEngineKeywordsPerformance] Archiving {$types[$recordName]} keywords for {$date} and {$this->searchConsoleUrl}");
        $dataTable = $this->getKeywordsAsDataTable($archiveProcessor, $date, $types[$recordName]);
        if (empty($dataTable)) {
            return null;
        }
        return $dataTable;
    }
    /**
     * Returns keyword data for given parameters as DataTable
     */
    protected function getKeywordsAsDataTable(ArchiveProcessor $archiveProcessor, string $date, string $type): ?DataTable
    {
        // ensure keywords are present (if available)
        $googleImporter = new GoogleImporter($archiveProcessor->getParams()->getSite()->getId());
        $googleImporter->importKeywordsIfNecessary($this->accountId, $this->searchConsoleUrl, $date, $type);
        $model = new GoogleModel();
        $keywordData = $model->getKeywordData($this->searchConsoleUrl, $date, $type);
        if (!empty($keywordData)) {
            $dataTable = new DataTable();
            $dataTable->addRowsFromSerializedArray($keywordData);
            return $dataTable;
        }
        return null;
    }
    public static function makeAll(int $idSite): array
    {
        $site = new Site($idSite);
        $settings = new MeasurableSettings($site->getId(), $site->getType());
        $searchConsoleUrl = $settings->googleSearchConsoleUrl;
        if (empty($searchConsoleUrl) || !$searchConsoleUrl->getValue() || \false === strpos($searchConsoleUrl->getValue(), '##')) {
            return [];
            // search console not activated for that site
        }
        $searchConsoleSetting = $settings->googleSearchConsoleUrl->getValue();
        list($accountId, $searchConsoleUrl) = explode('##', $searchConsoleSetting);
        $archives = [];
        if ($settings->googleWebKeywords->getValue()) {
            $archives[] = self::KEYWORDS_GOOGLE_WEB_RECORD_NAME;
        }
        if ($settings->googleImageKeywords->getValue()) {
            $archives[] = self::KEYWORDS_GOOGLE_IMAGE_RECORD_NAME;
        }
        if ($settings->googleVideoKeywords->getValue()) {
            $archives[] = self::KEYWORDS_GOOGLE_VIDEO_RECORD_NAME;
        }
        if ($settings->googleNewsKeywords->getValue()) {
            $archives[] = self::KEYWORDS_GOOGLE_NEWS_RECORD_NAME;
        }
        $logger = StaticContainer::get(LoggerInterface::class);
        $builders = array_map(function ($recordName) use ($accountId, $searchConsoleUrl, $logger) {
            return new self($accountId, $searchConsoleUrl, $recordName, $logger);
        }, $archives);
        return $builders;
    }
}
