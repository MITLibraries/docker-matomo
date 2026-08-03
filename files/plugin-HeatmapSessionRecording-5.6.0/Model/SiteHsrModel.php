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

namespace Piwik\Plugins\HeatmapSessionRecording\Model;

use Piwik\Access;
use Piwik\Date;
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Input\Breakpoint;
use Piwik\Plugins\HeatmapSessionRecording\Input\CaptureKeystrokes;
use Piwik\Plugins\HeatmapSessionRecording\Input\Description;
use Piwik\Plugins\HeatmapSessionRecording\Input\ExcludedElements;
use Piwik\Plugins\HeatmapSessionRecording\Input\MinSessionTime;
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
use Piwik\Plugins\HeatmapSessionRecording\Input\PageRules;
use Piwik\Plugins\HeatmapSessionRecording\Input\RequiresActivity;
use Piwik\Plugins\HeatmapSessionRecording\Input\SampleLimit;
use Piwik\Plugins\HeatmapSessionRecording\Input\SampleRate;
use Piwik\Plugins\HeatmapSessionRecording\Input\ScreenshotUrl;
use Piwik\Plugins\Intl\DateTimeFormatProvider;
use Piwik\Plugins\LanguagesManager\Model as LanguagesManagerModel;
use Piwik\Plugins\UsersManager\UserPreferences;
use Piwik\SettingsServer;
use Piwik\Tracker;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Exception;

class SiteHsrModel
{
    private const REPEAT_DELAY_DAYS = 30;

    /**
     * @var SiteHsrDao
     */
    private $dao;

    /**
     * @var LogHsrSite
     */
    private $logHsrSite;

    public static $defaultDate;
    public static $defaultPeriod;

    public function __construct(SiteHsrDao $dao, LogHsrSite $logHsrSite)
    {
        $this->dao = $dao;
        $this->logHsrSite = $logHsrSite;
    }

    public function addHeatmap($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $createdDate, $description = '', $autoRepeat = false)
    {
        $this->checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $description);

        $status = SiteHsrDao::STATUS_ACTIVE;

        $idSiteHsr = $this->dao->createHeatmapRecord(
            $idSite,
            $name,
            $sampleLimit,
            $sampleRate,
            $matchPageRules,
            $excludedElements,
            $screenshotUrl,
            $breakpointMobile,
            $breakpointTablet,
            $status,
            $captureDomManually,
            $createdDate,
            $description,
            $autoRepeat
        );
        $this->clearTrackerCache($idSite);

        return (int) $idSiteHsr;
    }

    /**
     * @return int|null the id of the copy, or null when the source is no longer eligible to be repeated
     */
    public function createRepeatCopy($idSite, $idSiteHsr)
    {
        $heatmap = $this->getHeatmap($idSite, $idSiteHsr);

        if (empty($heatmap)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorHeatmapDoesNotExist'));
        }

        $repeat = $this->prepareRepeat($idSite, $idSiteHsr, $heatmap);

        if (empty($repeat)) {
            return null;
        }

        $login = $repeat['login'];
        $createdDate = $repeat['created_date'];
        $scheduledDate = $repeat['scheduled_date'];
        $name = $repeat['name'];

        $matchPageRules = $heatmap['match_page_rules'];
        $sampleLimit = $heatmap['sample_limit'] ?? 1000;
        $sampleRate = $heatmap['sample_rate'] ?? 5;
        $excludedElements = $heatmap['excluded_elements'] ?? false;
        $screenshotUrl = $heatmap['screenshot_url'] ?? false;
        $breakpointMobile = $heatmap['breakpoint_mobile'] ?? false;
        $breakpointTablet = $heatmap['breakpoint_tablet'] ?? false;
        $captureDomManually = $heatmap['capture_manually'] ?? false;
        $description = $heatmap['description'] ?? '';

        $this->checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $description);

        $idSiteHsrNew = $this->dao->createHeatmapRecord(
            $idSite,
            $name,
            $sampleLimit,
            $sampleRate,
            $matchPageRules,
            $excludedElements,
            $screenshotUrl,
            $breakpointMobile,
            $breakpointTablet,
            SiteHsrDao::STATUS_ONHOLD,
            $captureDomManually,
            $createdDate,
            $description,
            true,
            $login,
            $scheduledDate,
            $idSiteHsr
        );

        $this->clearTrackerCache($idSite);

        return (int) $idSiteHsrNew;
    }

    public function updateHeatmap(
        $idSite,
        $idSiteHsr,
        $name,
        $matchPageRules,
        $sampleLimit,
        $sampleRate,
        $excludedElements,
        $screenshotUrl,
        $breakpointMobile,
        $breakpointTablet,
        $captureDomManually,
        $updatedDate,
        $description = '',
        $autoRepeat = false
    ) {
        $this->checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $description);

        $columns = array(
            'name' => $name,
            'description' => (string) $description,
            'sample_limit' => $sampleLimit,
            'match_page_rules' => $matchPageRules,
            'sample_rate' => $sampleRate,
            'excluded_elements' => $excludedElements,
            'screenshot_url' => $screenshotUrl,
            'breakpoint_mobile' => $breakpointMobile,
            'breakpoint_tablet' => $breakpointTablet,
            'updated_date' => $updatedDate,
        );

        if (!empty($captureDomManually)) {
            $columns['capture_manually'] = 1;
            $columns['page_treemirror'] = null;
        } else {
            $columns['capture_manually'] = 0;
        }

        $columns['auto_repeat'] = !empty($autoRepeat) ? 1 : 0;

        $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        $this->clearTrackerCache($idSite);
    }

    private function checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $description = '')
    {
        $name = new Name($name);
        $name->check();

        $description = new Description($description);
        $description->check();

        $pageRules = new PageRules($matchPageRules, 'matchPageRules', $needsOneEntry = true);
        $pageRules->check();

        $sampleLimit = new SampleLimit($sampleLimit);
        $sampleLimit->check();

        $sampleRate = new SampleRate($sampleRate);
        $sampleRate->check();

        $screenshotUrl = new ScreenshotUrl($screenshotUrl);
        $screenshotUrl->check();

        $excludedElements = new ExcludedElements($excludedElements);
        $excludedElements->check();

        $breakpointMobile = new Breakpoint($breakpointMobile, 'Mobile');
        $breakpointMobile->check();

        $breakpointTablet = new Breakpoint($breakpointTablet, 'Tablet');
        $breakpointTablet->check();
    }

    public function addSessionRecording($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $createdDate, $description = '', $autoRepeat = false)
    {
        $this->checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $description);
        $status = SiteHsrDao::STATUS_ACTIVE;

        $idSiteHsr = $this->dao->createSessionRecord($idSite, $name, $sampleLimit, $sampleRate, $matchPageRules, $minSessionTime, $requiresActivity, $captureKeystrokes, $status, $createdDate, $description, $autoRepeat);

        $this->clearTrackerCache($idSite);
        return (int) $idSiteHsr;
    }

    /**
     * @return int|null the id of the copy, or null when the source is no longer eligible to be repeated
     */
    public function createSessionRepeatCopy($idSite, $idSiteHsr)
    {
        $session = $this->getSessionRecording($idSite, $idSiteHsr);

        if (empty($session)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }

        $repeat = $this->prepareRepeat($idSite, $idSiteHsr, $session);

        if (empty($repeat)) {
            return null;
        }

        $login = $repeat['login'];
        $createdDate = $repeat['created_date'];
        $scheduledDate = $repeat['scheduled_date'];
        $name = $repeat['name'];

        $matchPageRules = $session['match_page_rules'];
        $sampleLimit = $session['sample_limit'] ?? 1000;
        $sampleRate = $session['sample_rate'] ?? 10;
        $minSessionTime = $session['min_session_time'] ?? 0;
        $requiresActivity = $session['requires_activity'] ?? true;
        $captureKeystrokes = $session['capture_keystrokes'] ?? true;
        $description = $session['description'] ?? '';

        $this->checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $description);

        $idSiteHsrNew = $this->dao->createSessionRecord(
            $idSite,
            $name,
            $sampleLimit,
            $sampleRate,
            $matchPageRules,
            $minSessionTime,
            $requiresActivity,
            $captureKeystrokes,
            SiteHsrDao::STATUS_ONHOLD,
            $createdDate,
            $description,
            true,
            $login,
            $scheduledDate,
            $idSiteHsr
        );

        $this->clearTrackerCache($idSite);

        return (int) $idSiteHsrNew;
    }

    public function updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $updatedDate, $description = '', $autoRepeat = false)
    {
        $this->checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $description);

        $columns = array(
            'name' => $name,
            'description' => (string) $description,
            'sample_limit' => $sampleLimit,
            'match_page_rules' => $matchPageRules,
            'sample_rate' => $sampleRate,
            'min_session_time' => $minSessionTime,
            'requires_activity' => $requiresActivity,
            'capture_keystrokes' => $captureKeystrokes,
            'updated_date' => $updatedDate,
        );

        $columns['auto_repeat'] = !empty($autoRepeat) ? 1 : 0;

        $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        $this->clearTrackerCache($idSite);
    }

    private function checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $description = '')
    {
        $name = new Name($name);
        $name->check();

        $description = new Description($description);
        $description->check();

        $pageRules = new PageRules($matchPageRules, 'matchPageRules', $needsOneEntry = false);
        $pageRules->check();

        $sampleLimit = new SampleLimit($sampleLimit);
        $sampleLimit->check();

        $sampleRate = new SampleRate($sampleRate);
        $sampleRate->check();

        $minSessionTime = new MinSessionTime($minSessionTime);
        $minSessionTime->check();

        $requiresActivity = new RequiresActivity($requiresActivity);
        $requiresActivity->check();

        $captureKeystrokes = new CaptureKeystrokes($captureKeystrokes);
        $captureKeystrokes->check();
    }

    public function getHeatmap($idSite, $idSiteHsr)
    {
        $record = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);

        return $this->enrichHeatmap($record);
    }

    public function getSessionRecording($idSite, $idSiteHsr)
    {
        $record = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);
        return $this->enrichSessionRecording($record);
    }

    public function pauseHeatmap($idSite, $idSiteHsr)
    {
        $this->pauseRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);
    }

    public function resumeHeatmap($idSite, $idSiteHsr)
    {
        $this->resumeRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);
    }

    private function pauseRecord($idSite, $idSiteHsr, $recordType)
    {
        $status = $this->dao->getRecordStatus($idSite, $idSiteHsr, $recordType);

        // only an active record can be paused. Pausing an ended or on hold one would let resumeRecord() turn it
        // active, reviving a finished record or starting a scheduled one before its date.
        if ($status !== SiteHsrDao::STATUS_ACTIVE) {
            return;
        }

        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_PAUSED));
    }

    private function resumeRecord($idSite, $idSiteHsr, $recordType)
    {
        $status = $this->dao->getRecordStatus($idSite, $idSiteHsr, $recordType);

        // only a paused record can be resumed, an on hold record needs to stay on hold until its scheduled date
        if ($status === SiteHsrDao::STATUS_PAUSED) {
            $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ACTIVE));
        }
    }

    private function endRecord($idSite, $idSiteHsr, $recordType, $eventName)
    {
        $status = $this->dao->getRecordStatus($idSite, $idSiteHsr, $recordType);

        // only a record that has started can be ended. Ending an on hold one would finish a record that never
        // recorded anything, and as it repeats the daily task would immediately queue its next copy. It can only
        // be deleted.
        if ($status !== SiteHsrDao::STATUS_ACTIVE && $status !== SiteHsrDao::STATUS_PAUSED) {
            return;
        }

        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ENDED));

        Piwik::postEvent($eventName, array($idSite, $idSiteHsr));
    }

    public function deactivateHeatmap($idSite, $idSiteHsr)
    {
        $heatmap = $this->getHeatmap($idSite, $idSiteHsr);

        if (!empty($heatmap)) {
            $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_DELETED));

            // the actual recorded heatmap data will still exist but we remove the "links" which is quick. a task will later remove all entries
            $this->logHsrSite->unlinkSiteRecords($idSiteHsr);
        }
    }

    public function heatmapExists($idSite, $idSiteHsr): bool
    {
        $hsr = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);

        return !empty($hsr);
    }

    public function sessionRecordingExists($idSite, $idSiteHsr): bool
    {
        $hsr = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);

        return !empty($hsr);
    }

    public function checkHeatmapExists($idSite, $idSiteHsr)
    {
        if (!$this->heatmapExists($idSite, $idSiteHsr)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorHeatmapDoesNotExist'));
        }
    }

    public function checkSessionRecordingExists($idSite, $idSiteHsr)
    {
        if (!$this->sessionRecordingExists($idSite, $idSiteHsr)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }
    }

    public function pauseSessionRecording($idSite, $idSiteHsr)
    {
        $this->pauseRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);
    }

    public function resumeSessionRecording($idSite, $idSiteHsr)
    {
        $this->resumeRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);
    }

    public function deactivateSessionRecording($idSite, $idSiteHsr)
    {
        $session = $this->getSessionRecording($idSite, $idSiteHsr);

        if (!empty($session)) {
            $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_DELETED));

            // the actual recording will still exist but we remove the "links" which is quick. a task will later remove all entries
            $this->logHsrSite->unlinkSiteRecords($idSiteHsr);
        }
    }

    public function deactivateRecordsForSite($idSite)
    {
        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_HEATMAP, false) as $heatmap) {
            $this->deactivateHeatmap($idSite, $heatmap['idsitehsr']);
        }

        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_SESSION, false) as $session) {
            $this->deactivateSessionRecording($idSite, $session['idsitehsr']);
        }
    }

    public function pauseRecordsForSite($idSite)
    {
        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_HEATMAP, false) as $heatmap) {
            $this->pauseHeatmap($idSite, $heatmap['idsitehsr']);
        }

        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_SESSION, false) as $session) {
            $this->pauseSessionRecording($idSite, $session['idsitehsr']);
        }
    }

    public function resumeRecordsForSite($idSite)
    {
        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_HEATMAP, false) as $heatmap) {
            $this->resumeHeatmap($idSite, $heatmap['idsitehsr']);
        }

        foreach ($this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_SESSION, false) as $session) {
            $this->resumeSessionRecording($idSite, $session['idsitehsr']);
        }
    }

    /**
     * @return bool whether the heatmap was activated. False when it is no longer on hold or no longer due.
     */
    public function activateOnHoldHeatmap($idSite, $idSiteHsr)
    {
        return $this->activateOnHoldRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);
    }

    /**
     * @return bool whether the session recording was activated. False when it is no longer on hold or no longer due.
     */
    public function activateOnHoldSessionRecording($idSite, $idSiteHsr)
    {
        return $this->activateOnHoldRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);
    }

    private function activateOnHoldRecord($idSite, $idSiteHsr, $recordType)
    {
        $activated = $this->dao->activateOnHoldRecord($idSite, $idSiteHsr, $this->getCurrentDateTime(), $recordType);

        if ($activated) {
            $this->clearTrackerCache($idSite);
        }

        return $activated;
    }

    public function endHeatmap($idSite, $idSiteHsr)
    {
        $this->endRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP, 'HeatmapSessionRecording.endHeatmap');
    }

    public function endSessionRecording($idSite, $idSiteHsr)
    {
        $this->endRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION, 'HeatmapSessionRecording.endSessionRecording');
    }

    /**
     * @param $idSite
     * @param bool $includePageTreeMirror performance and IO tweak has some heatmaps might have a 16MB or more treemirror and it would be loaded on every request causing a lot of IO etc.
     * @param bool $skipEnrich option to skip enriching heatmaps in order to get unaltered data
     * @return array
     */
    public function getHeatmaps($idSite, $includePageTreeMirror, $skipEnrich = false)
    {
        $heatmaps = $this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_HEATMAP, $includePageTreeMirror);

        if ($skipEnrich) {
            return $heatmaps;
        }

        return $this->enrichHeatmaps($heatmaps);
    }

    /**
     * Only active heatmaps that have a snapshot, page_treemirror included, not enriched.
     * Filters in SQL so other heatmaps' potentially large treemirror blobs are never loaded.
     *
     * @param int $idSite
     * @return array
     */
    public function getActiveHeatmapsWithPageTreemirror($idSite)
    {
        return $this->dao->getActiveHeatmapsWithPageTreemirror($idSite);
    }

    public function getSessionRecordings($idSite)
    {
        $sessionRecordings = $this->dao->getRecords($idSite, SiteHsrDao::RECORD_TYPE_SESSION, $includePageTreeMirror = false);

        return $this->enrichSessionRecordings($sessionRecordings);
    }

    public function hasSessionRecordings($idSite)
    {
        $hasSession = $this->dao->hasRecords($idSite, SiteHsrDao::RECORD_TYPE_SESSION);

        return !empty($hasSession);
    }

    public function hasHeatmaps($idSite)
    {
        $hasHeatmap = $this->dao->hasRecords($idSite, SiteHsrDao::RECORD_TYPE_HEATMAP);

        return !empty($hasHeatmap);
    }

    public function setPageTreeMirror($idSite, $idSiteHsr, $treeMirror, $screenshotUrl)
    {
        $heatmap = $this->getHeatmap($idSite, $idSiteHsr);
        if (!empty($heatmap)) {
            // only supported by heatmaps
            $columns = array(
                'page_treemirror' => $treeMirror,
                'screenshot_url' => $screenshotUrl
            );
            if (!empty($treeMirror)) {
                // a new snapshot leaves the "snapshot deleted" empty state
                $columns['screenshot_deleted_date'] = null;

                if (!empty($heatmap['capture_manually'])) {
                    $columns['capture_manually'] = 0;
                }
            }
            $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        }
    }

    /**
     * Records that the heatmap's snapshot was deleted so the report can show the matching empty state.
     * Setting $captureManually stops the snapshot from being retaken automatically on the next visit.
     */
    public function markScreenshotDeleted($idSite, $idSiteHsr, $captureManually = false)
    {
        // Always persist the requested flag so switching a deleted snapshot from manual back to
        // automatic (or vice versa) actually takes effect, not just when enabling manual capture.
        $this->updateHsrColumns($idSite, $idSiteHsr, array(
            'screenshot_deleted_date' => Date::now()->getDatetime(),
            'capture_manually' => $captureManually ? 1 : 0,
        ));
    }

    public function getPiwikRequestDate($hsr)
    {
        // we sub one day to make sure to include them all
        $from = Date::factory($hsr['created_date'])->subDay(1)->toString();
        $to = Date::now()->addDay(1)->toString();

        if ($from === $to) {
            $dateRange = $from;
            $period = 'year';
        } else {
            $period = 'range';
            $dateRange = $from . ',' . $to;
        }

        return array('period' => $period, 'date' => $dateRange);
    }

    private function enrichHeatmaps($heatmaps)
    {
        if (empty($heatmaps)) {
            return array();
        }

        foreach ($heatmaps as $index => $heatmap) {
            $heatmaps[$index] = $this->enrichHeatmap($heatmap);
        }

        return $heatmaps;
    }

    private function enrichHeatmap($heatmap)
    {
        if (empty($heatmap)) {
            return $heatmap;
        }

        unset($heatmap['record_type']);
        unset($heatmap['min_session_time']);
        unset($heatmap['requires_activity']);
        unset($heatmap['capture_keystrokes']);
        $heatmap['created_date_pretty'] = Date::factory($heatmap['created_date'])->getLocalized(DateTimeFormatProvider::DATE_FORMAT_SHORT);

        if (!empty($heatmap['scheduled_date'])) {
            $heatmap['scheduled_date_pretty'] = Date::factory($heatmap['scheduled_date'])->getLocalized(DateTimeFormatProvider::DATE_FORMAT_SHORT);
        } else {
            $heatmap['scheduled_date_pretty'] = null;
        }

        if ((!method_exists(SettingsServer::class, 'isMatomoForWordPress') || !SettingsServer::isMatomoForWordPress()) && !SettingsServer::isTrackerApiRequest()) {
            $heatmap['heatmapViewUrl'] = self::completeWidgetUrl('showHeatmap', 'idSiteHsr=' . (int) $heatmap['idsitehsr'] . '&useDateUrl=0', (int) $heatmap['idsite']);
        }

        return $heatmap;
    }

    public static function completeWidgetUrl($action, $params, $idSite, $period = null, $date = null)
    {
        if (!isset($date)) {
            if (empty(self::$defaultDate)) {
                $userPreferences = new UserPreferences();
                self::$defaultDate = $userPreferences->getDefaultDate();
                if (empty(self::$defaultDate)) {
                    self:: $defaultDate = 'today';
                }
            }
            $date = self::$defaultDate;
        }

        if (!isset($period)) {
            if (!isset(self::$defaultPeriod)) {
                $userPreferences = new UserPreferences();
                self::$defaultPeriod = $userPreferences->getDefaultPeriod(false);
                if (empty(self::$defaultPeriod)) {
                    self::$defaultPeriod = 'day';
                }
            }
            $period = self::$defaultPeriod;
        }

        $token = Access::getInstance()->getTokenAuth();

        $url = 'index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=' . urlencode($action) . '&' . $params . '&idSite=' . (int) $idSite . '&period=' . urlencode($period) . '&date=' . urlencode($date);
        if (!empty($token)) {
            $url .= '&token_auth=' . urlencode($token);
        }
        return $url;
    }

    private function enrichSessionRecordings($sessionRecordings)
    {
        if (empty($sessionRecordings)) {
            return array();
        }

        foreach ($sessionRecordings as $index => $sessionRecording) {
            $sessionRecordings[$index] = $this->enrichSessionRecording($sessionRecording);
        }

        return $sessionRecordings;
    }

    private function enrichSessionRecording($session)
    {
        if (empty($session)) {
            return $session;
        }

        unset($session['record_type']);
        unset($session['screenshot_url']);
        unset($session['page_treemirror']);
        unset($session['excluded_elements']);
        unset($session['breakpoint_mobile']);
        unset($session['breakpoint_tablet']);
        $session['created_date_pretty'] = Date::factory($session['created_date'])->getLocalized(DateTimeFormatProvider::DATE_FORMAT_SHORT);

        if (!empty($session['scheduled_date'])) {
            $session['scheduled_date_pretty'] = Date::factory($session['scheduled_date'])->getLocalized(DateTimeFormatProvider::DATE_FORMAT_SHORT);
        } else {
            $session['scheduled_date_pretty'] = null;
        }

        return $session;
    }

    protected function getCurrentDateTime()
    {
        return Date::now()->getDatetime();
    }

    /**
     * The parts of a repeat copy that are the same whatever the record type: whether the source may still be
     * repeated, who owns the copy, and when it is created, scheduled and what it is called.
     *
     * @param int $idSite
     * @param int $idSiteHsr
     * @param array $record the source record
     * @return array|null the `login`, `created_date`, `scheduled_date` and `name` for the copy, or null when the
     *                    source is no longer eligible to be repeated
     */
    private function prepareRepeat($idSite, $idSiteHsr, $record)
    {
        // the source may have been resumed or had repetition turned off since the batch was selected
        if ($record['status'] !== SiteHsrDao::STATUS_ENDED || empty($record['auto_repeat'])) {
            return null;
        }

        $login = $this->dao->getRecordLogin($idSite, $idSiteHsr);

        $createdDate = $this->getCurrentDateTime();
        // the delay runs from when the source finished, not from whenever the daily task happened to run
        $scheduledDate = $this->getRepeatAnchorDate($record, $createdDate)->addDay(self::REPEAT_DELAY_DAYS)->getDatetime();

        return array(
            'login' => $login,
            'created_date' => $createdDate,
            'scheduled_date' => $scheduledDate,
            'name' => RepeatName::generate($record['name'], Date::factory($scheduledDate), $this->getRecordLanguage($login)),
        );
    }

    /**
     * `updated_date` is set whenever the status changes, so for an ended heatmap it is the time it finished.
     *
     * @param array $heatmap
     * @param string $fallbackDate
     * @return Date
     */
    private function getRepeatAnchorDate($heatmap, $fallbackDate)
    {
        if (!empty($heatmap['updated_date'])) {
            try {
                return Date::factory($heatmap['updated_date']);
            } catch (Exception $e) {
                // fall through to the fallback below
            }
        }

        return Date::factory($fallbackDate);
    }

    /**
     * @param string|null $login
     * @return string|null the language of the record's owner, or null to use the configured default language
     */
    private function getRecordLanguage($login)
    {
        if (empty($login)) {
            return null;
        }

        $language = (new LanguagesManagerModel())->getLanguageForUser($login);

        return !empty($language) ? $language : null;
    }

    private function updateHsrColumns($idSite, $idSiteHsr, $columns)
    {
        if (!isset($columns['updated_date'])) {
            $columns['updated_date'] = $this->getCurrentDateTime();
        }

        $this->dao->updateHsrColumns($idSite, $idSiteHsr, $columns);
        $this->clearTrackerCache($idSite);
    }

    private function clearTrackerCache($idSite)
    {
        Tracker\Cache::deleteCacheWebsiteAttributes($idSite);
    }
}
