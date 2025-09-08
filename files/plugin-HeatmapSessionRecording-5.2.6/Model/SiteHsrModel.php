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
use Piwik\Plugins\HeatmapSessionRecording\Input\ExcludedElements;
use Piwik\Plugins\HeatmapSessionRecording\Input\MinSessionTime;
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
use Piwik\Plugins\HeatmapSessionRecording\Input\PageRules;
use Piwik\Plugins\HeatmapSessionRecording\Input\RequiresActivity;
use Piwik\Plugins\HeatmapSessionRecording\Input\SampleLimit;
use Piwik\Plugins\HeatmapSessionRecording\Input\SampleRate;
use Piwik\Plugins\HeatmapSessionRecording\Input\ScreenshotUrl;
use Piwik\Plugins\Intl\DateTimeFormatProvider;
use Piwik\Plugins\UsersManager\UserPreferences;
use Piwik\SettingsServer;
use Piwik\Tracker;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Exception;

class SiteHsrModel
{
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

    public function addHeatmap($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $createdDate)
    {
        $this->checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet);

        $status = SiteHsrDao::STATUS_ACTIVE;

        $idSiteHsr = $this->dao->createHeatmapRecord($idSite, $name, $sampleLimit, $sampleRate, $matchPageRules, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $status, $captureDomManually, $createdDate);
        $this->clearTrackerCache($idSite);

        return (int) $idSiteHsr;
    }

    public function updateHeatmap($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $updatedDate)
    {
        $this->checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet);

        $columns = array(
            'name' => $name,
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

        $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        $this->clearTrackerCache($idSite);
    }

    private function checkHeatmap($name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet)
    {
        $name = new Name($name);
        $name->check();

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

    public function addSessionRecording($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $createdDate)
    {
        $this->checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes);
        $status = SiteHsrDao::STATUS_ACTIVE;

        $idSiteHsr = $this->dao->createSessionRecord($idSite, $name, $sampleLimit, $sampleRate, $matchPageRules, $minSessionTime, $requiresActivity, $captureKeystrokes, $status, $createdDate);

        $this->clearTrackerCache($idSite);
        return (int) $idSiteHsr;
    }

    public function updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $updatedDate)
    {
        $this->checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes);

        $columns = array(
            'name' => $name,
            'sample_limit' => $sampleLimit,
            'match_page_rules' => $matchPageRules,
            'sample_rate' => $sampleRate,
            'min_session_time' => $minSessionTime,
            'requires_activity' => $requiresActivity,
            'capture_keystrokes' => $captureKeystrokes,
            'updated_date' => $updatedDate,
        );

        $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        $this->clearTrackerCache($idSite);
    }

    private function checkSession($name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes)
    {
        $name = new Name($name);
        $name->check();

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
        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_PAUSED));
    }

    public function resumeHeatmap($idSite, $idSiteHsr)
    {
        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ACTIVE));
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

    public function checkHeatmapExists($idSite, $idSiteHsr)
    {
        $hsr = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);

        if (empty($hsr)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorHeatmapDoesNotExist'));
        }
    }

    public function checkSessionRecordingExists($idSite, $idSiteHsr)
    {
        $hsr = $this->dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);

        if (empty($hsr)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }
    }

    public function pauseSessionRecording($idSite, $idSiteHsr)
    {
        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_PAUSED));
    }

    public function resumeSessionRecording($idSite, $idSiteHsr)
    {
        $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ACTIVE));
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

    public function endHeatmap($idSite, $idSiteHsr)
    {
        $heatmap = $this->getHeatmap($idSite, $idSiteHsr);
        if (!empty($heatmap)) {
            $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ENDED));

            Piwik::postEvent('HeatmapSessionRecording.endHeatmap', array($idSite, $idSiteHsr));
        }
    }

    public function endSessionRecording($idSite, $idSiteHsr)
    {
        $session = $this->getSessionRecording($idSite, $idSiteHsr);
        if (!empty($session)) {
            $this->updateHsrColumns($idSite, $idSiteHsr, array('status' => SiteHsrDao::STATUS_ENDED));

            Piwik::postEvent('HeatmapSessionRecording.endSessionRecording', array($idSite, $idSiteHsr));
        }
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
            if (!empty($heatmap['capture_manually']) && !empty($treeMirror)) {
                $columns['capture_manually'] = 0;
            }
            $this->updateHsrColumns($idSite, $idSiteHsr, $columns);
        }
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

        return $session;
    }

    protected function getCurrentDateTime()
    {
        return Date::now()->getDatetime();
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
