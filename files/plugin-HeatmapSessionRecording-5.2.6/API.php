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

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Date;
use Piwik\Metrics\Formatter;
use Piwik\Period\Factory as PeriodFactory;
use Piwik\Piwik;
use Piwik\Plugins\CoreHome\EntityDuplicator\DuplicateRequestResponse;
use Piwik\Plugins\CoreHome\EntityDuplicator\EntityDuplicatorHelper;
use Piwik\Plugins\HeatmapSessionRecording\Archiver\Aggregator;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrEvent;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\DataTable\Filter\EnrichRecordedSessions;
use Piwik\Plugins\HeatmapSessionRecording\Input\PageRules;
use Piwik\Plugins\HeatmapSessionRecording\Input\Validator;
use Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\HsrMatcher;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\PageRuleMatcher;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;
use Exception;
use Piwik\Plugins\Intl\DateTimeFormatProvider;
use Piwik\SettingsServer;
use Piwik\Site;
use Piwik\Tracker\Cache;
use Piwik\Tracker\Visit;
use Piwik\Plugin;

/**
 * API for plugin Heatmap & Session Recording.
 *
 * When you request activity data for a heatmap or a recorded session, please note that any X or Y coordinate,
 * scroll reach position, and above the fold is relative and not absolute. X and Y coordinate are between 0 and 2000
 * and are relative to the selector where 2000 means the position is at 100% of the element, 1000 means the position
 * is at 50% and 0 means the position is actually 0 pixel from the element.
 *
 * Scroll and above the fold positions are between 0 and 1000. If for example a web page is 3000 pixel high, and scroll
 * reach is 100, it means the user has seen the content up to 300 pixels (10%, or 100 of 1000).
 *
 * We differentiate between two different IDs here:
 * * idSiteHsr represents the ID of a heatmap or session recording configuration
 * * idLogHsr represents the ID of an actually recorded / tracked session or heatmap activity
 *
 * @method static \Piwik\Plugins\HeatmapSessionRecording\API getInstance()
 */
class API extends \Piwik\Plugin\API
{
    /**
     * @var Validator
     */
    private $validator = null;

    /**
     * @var SiteHsrModel
     */
    private $siteHsr = null;

    /**
     * @var LogHsr
     */
    private $logHsr = null;

    /**
     * @var LogHsrEvent
     */
    private $logEvent = null;

    /**
     * @var LogHsrSite
     */
    private $logHsrSite = null;

    /**
     * @var Aggregator
     */
    private $aggregator = null;

    /**
     * @var SystemSettings
     */
    private $systemSettings = null;

    /**
     * @var Configuration
     */
    private $configuration = null;

    public function __construct(Validator $validator, Aggregator $aggregator, SiteHsrModel $siteHsr, LogHsr $logHsr, LogHsrEvent $logEvent, LogHsrSite $logHsrSite, SystemSettings $settings, Configuration $configuration)
    {
        $this->validator = $validator;
        $this->aggregator = $aggregator;
        $this->siteHsr = $siteHsr;
        $this->logHsr = $logHsr;
        $this->logEvent = $logEvent;
        $this->logHsrSite = $logHsrSite;
        $this->systemSettings = $settings;
        $this->configuration = $configuration;

        $dir = Plugin\Manager::getPluginDirectory('UserCountry');
        require_once $dir . '/functions.php';
    }

    /**
     * Adds a new heatmap.
     *
     * Once added, the system will start recording activities for this heatmap.
     *
     * @param int $idSite
     * @param string $name    The name of heatmap which will be visible in the reporting UI.
     * @param array $matchPageRules  Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory'))
     *                               For a list of available attribute and type values call {@link getAvailableTargetPageRules()}.
     *                               "inverted" should be "0" or "1".
     * @param int $sampleLimit    The number of page views you want to record. Once the sample limit has been reached, the heatmap will be ended automatically.
     * @param float $sampleRate     Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%.
     * Defines how often a visitor will be actually recorded when they match the page rules, also known as "traffic". Currently max one decimal is supported.
     * @param string $excludedElements  Optional, a comma separated list of CSS selectors to exclude elements from being shown in the heatmap. For example to disable popups etc.
     * @param string $screenshotUrl    Optional, a URL to define on which page a screenshot should be taken.
     * @param int $breakpointMobile    If the device type cannot be detected, we will put any device having a lower width than this value into the mobile category. Useful if your website is responsive.
     * @param int $breakpointTablet   If the device type cannot be detected, we will put any device having a lower width than this value into the tablet category. Useful if your website is responsive.
     * @return int
     */
    public function addHeatmap($idSite, $name, $matchPageRules, $sampleLimit = 1000, $sampleRate = 5, $excludedElements = false, $screenshotUrl = false, $breakpointMobile = false, $breakpointTablet = false, $captureDomManually = false)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);

        if ($breakpointMobile === false || $breakpointMobile === null) {
            $breakpointMobile = $this->systemSettings->breakpointMobile->getValue();
        }

        if ($breakpointTablet === false || $breakpointTablet === null) {
            $breakpointTablet = $this->systemSettings->breakpointTablet->getValue();
        }

        $createdDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);
        $screenshotUrl = $this->unsanitizeScreenshotUrl($screenshotUrl);

        return $this->siteHsr->addHeatmap($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $createdDate);
    }

    /**
     * Copies a specified heatmap to one or more sites. If a heatmap with the same name already exists, the new heatmap
     * will have an automatically adjusted name to make it unique to the assigned site.
     *
     * @param int $idSite
     * @param int $idSiteHsr ID of the heatmap to duplicate.
     * @param int[] $idDestinationSites Optional array of IDs identifying which site(s) the new heatmap is to be
     * assigned to. The default is [idSite] when nothing is provided.
     * @return array
     * @throws Exception
     */
    public function duplicateHeatmap(int $idSite, int $idSiteHsr, array $idDestinationSites = []): array
    {
        // Define data array before any alterations to the variables
        $additionalData = [
            'idSite' => $idSite,
            'idDestinationSites' => $idDestinationSites,
            'idSiteHsr' => $idSiteHsr,
        ];

        $idDestinationSites = count($idDestinationSites) > 0 ? $idDestinationSites : [$idSite];
        $idSitesToCheck = array_unique(array_merge([$idSite], $idDestinationSites));
        $this->validator->checkSitesDuplicationPermission($idSitesToCheck);

        // Initialise the common response values
        $duplicateRequestResponse = new DuplicateRequestResponse();

        $heatmap = null;
        try {
            $heatmap = $this->getHeatmap($idSite, $idSiteHsr);
        } catch (\Throwable $e) {
            // Log the error, but continue for the proper response to be built later
            $this->logError('Uncaught exception looking up heatmap to duplicate: {exception}', $e);
        }
        if (empty($heatmap['name']) || empty($heatmap['match_page_rules'])) {
            $duplicateRequestResponse->setSuccess(false);
            $duplicateRequestResponse->setMessage(Piwik::translate('HeatmapSessionRecording_SourceHeatmapLookupError'));
            $duplicateRequestResponse->setAdditionalData($additionalData);

            return $duplicateRequestResponse->getResponseArray();
        }

        $idSitesFailed = $idHrsNew = [];
        foreach ($idDestinationSites as $idDestinationSite) {
            try {
                // Make sure that the new name is unique.
                $newName = $heatmap['name'];
                $heatmaps = $this->siteHsr->getHeatmaps($idDestinationSite, false, true);
                // It can only be a duplicate name if some heatmaps were found for the site.
                if (is_array($heatmaps) && count($heatmaps) > 0) {
                    $heatmapNames = array_column($heatmaps, 'name');
                    $newName = EntityDuplicatorHelper::getUniqueNameComparedToList($newName, $heatmapNames, 50);
                }

                $response = $this->addHeatmap(
                    $idDestinationSite,
                    $newName,
                    $heatmap['match_page_rules'],
                    $heatmap['sample_limit'] ?? 1000,
                    $heatmap['sample_rate'] ?? 5,
                    $heatmap['excluded_elements'] ?? false,
                    $heatmap['screenshot_url'] ?? false,
                    $heatmap['breakpoint_mobile'] ?? false,
                    $heatmap['breakpoint_tablet'] ?? false,
                    $heatmap['capture_manually'] ?? false
                );

                // Check response for success or failure. The only return is the new ID, so make sure it's a valid int
                if (!is_int($response) || $response < 1) {
                    $idSitesFailed[] = $idDestinationSite;
                    continue;
                }

                $idHrsNew[] = $response;
            } catch (\Throwable $e) {
                $idSitesFailed[] = $idDestinationSite;

                // Log the error, but continue in case there are other sites to copy to
                $this->logError('Uncaught exception duplicating heatmap: {exception}', $e);
            }
        }

        // Set the values for success response
        $duplicateRequestResponse->setSuccess(true);
        $duplicateRequestResponse->setMessage(Piwik::translate('HeatmapSessionRecording_HeatmapCopied'));
        $additionalData['newIds'] = $idHrsNew;
        $duplicateRequestResponse->setAdditionalData($additionalData);

        // If any of the sites failed, update to error response
        if (count($idSitesFailed) > 0) {
            $successSites = array_diff($idDestinationSites, $idSitesFailed);
            $sitesString = count($successSites) ? implode(',', $successSites) : Piwik::translate('HeatmapSessionRecording_None');
            $message = Piwik::translate('HeatmapSessionRecording_HeatmapDuplicationError', [implode(',', $idSitesFailed), $sitesString]);
            $duplicateRequestResponse->setSuccess(false);
            $duplicateRequestResponse->setMessage($message);
        }

        return $duplicateRequestResponse->getResponseArray();
    }

    private function logError(string $message, \Throwable $e): void
    {
        StaticContainer::get(\Piwik\Log\LoggerInterface::class)->error(
            $message,
            [
                'exception' => $e,
                'ignoreInScreenWriter' => true,
            ]
        );
    }

    private function unsanitizeScreenshotUrl($screenshotUrl)
    {
        if (!empty($screenshotUrl) && is_string($screenshotUrl)) {
            $screenshotUrl = Common::unsanitizeInputValue($screenshotUrl);
        }

        return $screenshotUrl;
    }

    private function unsanitizePageRules($matchPageRules)
    {
        if (!empty($matchPageRules) && is_array($matchPageRules)) {
            foreach ($matchPageRules as $index => $matchPageRule) {
                if (is_array($matchPageRule) && !empty($matchPageRule['value'])) {
                    $matchPageRules[$index]['value'] = Common::unsanitizeInputValue($matchPageRule['value']);
                }
            }
        }
        return $matchPageRules;
    }

    /**
     * Updates an existing heatmap.
     *
     * All fields need to be set in order to update a heatmap. Easiest way is to get all  values for a heatmap via
     * "HeatmapSessionRecording.getHeatmap", make the needed changes on the heatmap, and send all values back to
     * "HeatmapSessionRecording.updateHeatmap".
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap you want to update.
     * @param string $name    The name of heatmap which will be visible in the reporting UI.
     * @param array $matchPageRules  Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory'))
     *                               For a list of available attribute and type values call {@link getAvailableTargetPageRules()}.
     *                               "inverted" should be "0" or "1".
     * @param int $sampleLimit    The number of page views you want to record. Once the sample limit has been reached, the heatmap will be ended automatically.
     * @param float $sampleRate     Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%.
     * Defines how often a visitor will be actually recorded when they match the page rules, also known as "traffic". Currently max one decimal is supported.
     * @param string $excludedElements  Optional, a comma separated list of CSS selectors to exclude elements from being shown in the heatmap. For example to disable popups etc.
     * @param string $screenshotUrl    Optional, a URL to define on which page a screenshot should be taken.
     * @param int $breakpointMobile    If the device type cannot be detected, we will put any device having a lower width than this value into the mobile category. Useful if your website is responsive.
     * @param int $breakpointTablet   If the device type cannot be detected, we will put any device having a lower width than this value into the tablet category. Useful if your website is responsive.
     */
    public function updateHeatmap($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit = 1000, $sampleRate = 5, $excludedElements = false, $screenshotUrl = false, $breakpointMobile = false, $breakpointTablet = false, $captureDomManually = false)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        if ($breakpointMobile === false || $breakpointMobile === null) {
            $breakpointMobile = $this->systemSettings->breakpointMobile->getValue();
        }

        if ($breakpointTablet === false || $breakpointTablet === null) {
            $breakpointTablet = $this->systemSettings->breakpointTablet->getValue();
        }

        $updatedDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);
        $screenshotUrl = $this->unsanitizeScreenshotUrl($screenshotUrl);

        $this->siteHsr->updateHeatmap($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $updatedDate);
    }

    /**
     * Deletes / removes the screenshot from a heatmap
     * @param int $idSite
     * @param int $idSiteHsr
     * @return bool
     * @throws Exception
     */
    public function deleteHeatmapScreenshot($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $heatmap = $this->siteHsr->getHeatmap($idSite, $idSiteHsr);
        if (!empty($heatmap['status']) && $heatmap['status'] === SiteHsrDao::STATUS_ACTIVE) {
            $this->siteHsr->setPageTreeMirror($idSite, $idSiteHsr, null, null);

            if (!empty($heatmap['page_treemirror'])) {
                // only needed when a screenshot existed before that
                Cache::deleteCacheWebsiteAttributes($idSite);
            }
            return true;
        } elseif (!empty($heatmap['status'])) {
            throw new Exception('The screenshot can be only removed from active heatmaps');
        }
    }

    /**
     * Adds a new session recording.
     *
     * Once added, the system will start recording sessions.
     *
     * @param int $idSite
     * @param string $name    The name of session recording which will be visible in the reporting UI.
     * @param array $matchPageRules  Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory'))
     *                               For a list of available attribute and type values call {@link getAvailableTargetPageRules()}.
     *                               "inverted" should be "0" or "1". Leave it empty to record any page.
     *                               If page rules are set, a session will be only recorded as soon as a visitor has reached a page that matches these rules.
     * @param int $sampleLimit    The number of sessions you want to record. Once the sample limit has been reached, the session recording will be ended automatically.
     * @param float $sampleRate     Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%.
     * Defines how often a visitor will be actually recorded when they match the page rules, also known as "traffic". Currently max one decimal is supported.
     * @param int $minSessionTime     If defined, will only record sessions when the visitor has spent more than this many seconds on the current page.
     * @param int $requiresActivity   If enabled (default), the session will be only recorded if the visitor has at least scrolled and clicked once.
     * @param int $captureKeystrokes  If enabled (default), any text that a user enters into text form elements will be recorded.
     * Password fields will be automatically masked and you can mask other elements with sensitive data using a data-matomo-mask attribute.
     * @return int
     */
    public function addSessionRecording($idSite, $name, $matchPageRules = array(), $sampleLimit = 1000, $sampleRate = 10, $minSessionTime = 0, $requiresActivity = true, $captureKeystrokes = true)
    {
        $this->validator->checkSessionReportWritePermission($idSite);

        $createdDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        return $this->siteHsr->addSessionRecording($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $createdDate);
    }

    /**
     * Updates an existing session recording.
     *
     * All fields need to be set in order to update a session recording. Easiest way is to get all values for a
     * session recording via "HeatmapSessionRecording.getSessionRecording", make the needed changes on the recording,
     * and send all values back to "HeatmapSessionRecording.updateSessionRecording".
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the session recording you want to update.
     * @param string $name    The name of session recording which will be visible in the reporting UI.
     * @param array $matchPageRules  Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory'))
     *                               For a list of available attribute and type values call {@link getAvailableTargetPageRules()}.
     *                               "inverted" should be "0" or "1". Leave it empty to record any page.
     *                               If page rules are set, a session will be only recorded as soon as a visitor has reached a page that matches these rules.
     * @param int $sampleLimit    The number of sessions you want to record. Once the sample limit has been reached, the session recording will be ended automatically.
     * @param float $sampleRate     Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%.
     * Defines how often a visitor will be actually recorded when they match the page rules, also known as "traffic". Currently max one decimal is supported.
     * @param int $minSessionTime     If defined, will only record sessions when the visitor has spent more than this many seconds on the current page.
     * @param int $requiresActivity   If enabled (default), the session will be only recorded if the visitor has at least scrolled and clicked once.
     * @param int $captureKeystrokes  If enabled (default), any text that a user enters into text form elements will be recorded.
     * Password fields will be automatically masked and you can mask other elements with sensitive data using a data-matomo-mask attribute.
     */
    public function updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules = array(), $sampleLimit = 1000, $sampleRate = 10, $minSessionTime = 0, $requiresActivity = true, $captureKeystrokes = true)
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $updatedDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        $this->siteHsr->updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $updatedDate);
    }

    /**
     * Get a specific heatmap by its ID.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap.
     * @return array|false
     */
    public function getHeatmap($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $heatmap = $this->siteHsr->getHeatmap($idSite, $idSiteHsr);

        return $heatmap;
    }

    /**
     * Get a specific session recording by its ID.
     *
     * @param int $idSite
     * @param int $idSiteHsr   The id of the heatmap.
     * @return array|false
     */
    public function getSessionRecording($idSite, $idSiteHsr)
    {
        $this->validator->checkSessionReportViewPermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        return $this->siteHsr->getSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Pauses the given heatmap.
     *
     * When a heatmap is paused, all the tracking will be paused until its resumed again.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap
     */
    public function pauseHeatmap($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->pauseHeatmap($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Resumes the given heatmap.
     *
     * When a heatmap is resumed, all the tracking will be enabled.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap
     */
    public function resumeHeatmap($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->resumeHeatmap($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Deletes the given heatmap.
     *
     * When a heatmap is deleted, the report will be no longer available in the API and tracked data for this
     * heatmap might be removed.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap
     */
    public function deleteHeatmap($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);

        $this->siteHsr->deactivateHeatmap($idSite, $idSiteHsr);
    }

    /**
     * Ends / finishes the given heatmap.
     *
     * When you end a heatmap, the heatmap reports will be still available via API and UI but no new heatmap activity
     * will be recorded for this heatmap.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the heatmap.
     */
    public function endHeatmap($idSite, $idSiteHsr)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->endHeatmap($idSite, $idSiteHsr);
    }

    /**
     * Pauses the given session recording.
     *
     * When a session recording is paused, all the tracking will be paused until its resumed again.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap
     */
    public function pauseSessionRecording($idSite, $idSiteHsr)
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->pauseSessionRecording($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Resumes the given session recording.
     *
     * When a session recording is resumed, all the tracking will be enabled.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap
     */
    public function resumeSessionRecording($idSite, $idSiteHsr)
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->resumeSessionRecording($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Deletes the given session recording.
     *
     * When a session recording is deleted, any related recordings be no longer available in the API and tracked data
     * for this session recording might be removed.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the session recording.
     */
    public function deleteSessionRecording($idSite, $idSiteHsr)
    {

        $this->validator->checkSessionReportWritePermission($idSite);

        $this->siteHsr->deactivateSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Ends / finishes the given session recording.
     *
     * When you end a session recording, the session recording reports will be still available via API and UI but no new
     * session will be recorded anymore.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the session recording.
     */
    public function endSessionRecording($idSite, $idSiteHsr)
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->endSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Get all available heatmaps for a specific website or app.
     *
     * It will return active as well as ended heatmaps but not any deleted heatmaps.
     *
     * @param int $idSite
     * @param bool|int $includePageTreeMirror set to 0 if you don't need the page tree mirror for heatmaps (improves performance)
     * @return array
     */
    public function getHeatmaps($idSite, $includePageTreeMirror = true)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);

        return $this->siteHsr->getHeatmaps($idSite, !empty($includePageTreeMirror));
    }

    /**
     * Get all available session recordings for a specific website or app.
     *
     * It will return active as well as ended session recordings but not any deleted session recordings.
     *
     * @param int $idSite
     * @return array
     */
    public function getSessionRecordings($idSite)
    {
        $this->validator->checkSessionReportViewPermission($idSite);

        return $this->siteHsr->getSessionRecordings($idSite);
    }

    /**
     * Returns all page views that were recorded during a particular session / visit. We do not apply segments as it is
     * used for video player when replaying sessions etc.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of a session recording
     * @param int $idVisit   The visit / session id
     * @return array
     */
    private function getRecordedPageViewsInSession($idSite, $idSiteHsr, $idVisit, $period, $date)
    {
        $timezone = Site::getTimezoneFor($idSite);

        // ideally we would also check if idSiteHsr is actually linked to idLogHsr but not really needed for security reasons
        $pageviews = $this->aggregator->getRecordedPageViewsInSession($idSite, $idSiteHsr, $idVisit, $period, $date, $segment = false);

        $isAnonymous = Piwik::isUserIsAnonymous();

        foreach ($pageviews as &$pageview) {
            $pageview['server_time_pretty'] = Date::factory($pageview['server_time'], $timezone)->getLocalized(DateTimeFormatProvider::DATETIME_FORMAT_SHORT);

            if ($isAnonymous) {
                unset($pageview['idvisitor']);
            } else {
                $pageview['idvisitor'] = bin2hex($pageview['idvisitor']);
            }

            $formatter = new Formatter();
            $pageview['time_on_page_pretty'] = $formatter->getPrettyTimeFromSeconds(intval($pageview['time_on_page'] / 1000), $asSentence = true);
        }

        return $pageviews;
    }

    /**
     * Returns all recorded sessions for a specific session recording.
     *
     * To get the actual recorded data for any of the recorded sessions, call {@link getRecordedSession()}.
     *
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param int $idSiteHsr  The id of the session recording you want to retrieve all the recorded sessions for.
     * @param bool $segment
     * @param int $idSubtable Optional visit id if you want to get all recorded pageviews of a specific visitor
     * @return DataTable
     */
    public function getRecordedSessions($idSite, $period, $date, $idSiteHsr, $segment = false, $idSubtable = false)
    {
        $this->validator->checkSessionReportViewPermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $idVisit = $idSubtable;

        try {
            PeriodFactory::checkPeriodIsEnabled($period);
        } catch (\Exception $e) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_PeriodDisabledErrorMessage', $period));
        }

        if (!empty($idVisit)) {
            $recordings = $this->aggregator->getRecordedPageViewsInSession($idSite, $idSiteHsr, $idVisit, $period, $date, $segment);
        } else {
            $recordings = $this->aggregator->getRecordedSessions($idSite, $idSiteHsr, $period, $date, $segment);
        }

        $table = new DataTable();
        $table->disableFilter('AddColumnsProcessedMetrics');
        $table->setMetadata('idSiteHsr', $idSiteHsr);

        if (!empty($recordings)) {
            $table->addRowsFromSimpleArray($recordings);
        }

        if (empty($idVisit)) {
            $table->queueFilter(function (DataTable $table) {
                foreach ($table->getRowsWithoutSummaryRow() as $row) {
                    if ($idVisit = $row->getColumn('idvisit')) {
                        $row->setNonLoadedSubtableId($idVisit);
                    }
                }
            });
        } else {
            $table->disableFilter('Sort');
        }

        if (!method_exists(SettingsServer::class, 'isMatomoForWordPress') || !SettingsServer::isMatomoForWordPress()) {
            $table->queueFilter(function (DataTable $table) use ($idSite, $idSiteHsr, $period, $date) {
                foreach ($table->getRowsWithoutSummaryRow() as $row) {
                    $idLogHsr = $row->getColumn('idloghsr');
                    $row->setMetadata('sessionReplayUrl', SiteHsrModel::completeWidgetUrl('replayRecording', 'idSiteHsr=' . (int) $idSiteHsr . '&idLogHsr=' . (int) $idLogHsr, $idSite, $period, $date));
                }
            });
        }

        $table->filter('Piwik\Plugins\HeatmapSessionRecording\DataTable\Filter\EnrichRecordedSessions');

        return $table;
    }

    /**
     * Get all activities of a specific recorded session.
     *
     * This includes events such as clicks, mouse moves, scrolls, resizes, page / HTML DOM changes, form changed.
     * It is recommended to call this API method with filter_limit = -1 to retrieve all results. It also returns
     * metadata like the viewport size the user had when it was recorded, the browser, operating system, and more.
     *
     * To see what each event type in the events property means, call {@link getEventTypes()}.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the session recording you want to retrieve the data for.
     * @param int $idLogHsr   The id of the recorded session you want to retrieve the data for.
     * @return array
     * @throws Exception
     */
    public function getRecordedSession($idSite, $idSiteHsr, $idLogHsr)
    {
        $this->validator->checkSessionReportViewPermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        // ideally we would also check if idSiteHsr is actually linked to idLogHsr but not really needed for security reasons
        $session = $this->aggregator->getRecordedSession($idLogHsr);

        if (empty($session['idsite']) || empty($idSite)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }

        if ($session['idsite'] != $idSite) {
            // important otherwise can fetch any log entry!
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }

        $session['idvisitor'] = !empty($session['idvisitor']) ? bin2hex($session['idvisitor']) : '';

        if (Piwik::isUserIsAnonymous()) {
            foreach (EnrichRecordedSessions::getBlockedFields() as $blockedField) {
                if (isset($session[$blockedField])) {
                    $session[$blockedField] = null;
                }
            }
        }


        $configBrowserName = !empty($session['config_browser_name']) ? $session['config_browser_name'] : '';
        $session['browser_name'] = \Piwik\Plugins\DevicesDetection\getBrowserName($configBrowserName);
        $session['browser_logo'] = \Piwik\Plugins\DevicesDetection\getBrowserLogo($configBrowserName);
        $configOs = !empty($session['config_os']) ? $session['config_os'] : '';
        $session['os_name'] = \Piwik\Plugins\DevicesDetection\getOsFullName($configOs);
        $session['os_logo'] = \Piwik\Plugins\DevicesDetection\getOsLogo($configOs);
        $session['device_name'] = \Piwik\Plugins\DevicesDetection\getDeviceTypeLabel($session['config_device_type']);
        $session['device_logo'] = \Piwik\Plugins\DevicesDetection\getDeviceTypeLogo($session['config_device_type']);

        if (!empty($session['config_device_model'])) {
            $session['device_name'] .= ', ' . $session['config_device_model'];
        }

        $session['location_name'] = '';
        $session['location_logo'] = '';

        if (!empty($session['location_country'])) {
            $session['location_name'] = \Piwik\Plugins\UserCountry\countryTranslate($session['location_country']);
            $session['location_logo'] = \Piwik\Plugins\UserCountry\getFlagFromCode($session['location_country']);

            if (!empty($session['location_region']) && $session['location_region'] != Visit::UNKNOWN_CODE) {
                $session['location_name'] .= ', ' . \Piwik\Plugins\UserCountry\getRegionNameFromCodes($session['location_country'], $session['location_region']);
            }

            if (!empty($session['location_city'])) {
                $session['location_name'] .= ', ' . $session['location_city'];
            }
        }

        $timezone = Site::getTimezoneFor($idSite);
        $session['server_time_pretty'] = Date::factory($session['server_time'], $timezone)->getLocalized(DateTimeFormatProvider::DATETIME_FORMAT_SHORT);

        $formatter = new Formatter();
        $session['time_on_page_pretty'] = $formatter->getPrettyTimeFromSeconds(intval($session['time_on_page'] / 1000), $asSentence = true);

        // we make sure to get all recorded pageviews in this session
        $serverTime = Date::factory($session['server_time']);
        $from = $serverTime->subDay(1)->toString();
        $to = $serverTime->addDay(1)->toString();

        $period = 'range';
        $dateRange = $from . ',' . $to;

        $session['events'] = $this->logEvent->getEventsForPageview($idLogHsr);
        $session['pageviews'] = $this->getRecordedPageViewsInSession($idSite, $idSiteHsr, $session['idvisit'], $period, $dateRange);
        $session['numPageviews'] = count($session['pageviews']);

        return $session;
    }

    /**
     * Deletes all recorded page views within a recorded session.
     *
     * Once a recorded session has been deleted, the replay video will no longer be available in the UI and no data
     * can be retrieved anymore via the API.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the session recording you want to delete the data.
     * @param int $idVisit  The visitId of the recorded session you want to delete.
     */
    public function deleteRecordedSession($idSite, $idSiteHsr, $idVisit)
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        // make sure the recording actually belongs to that site, otherwise could delete any recording for any other site
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        // we also need to make sure the visit actually belongs to that site
        $idLogHsrs = $this->logHsr->findLogHsrIdsInVisit($idSite, $idVisit);

        foreach ($idLogHsrs as $idLogHsr) {
            $this->logHsrSite->unlinkRecord($idLogHsr, $idSiteHsr);
        }
    }

    /**
     * Deletes an individual page view within a recorded session.
     *
     * It only deletes one recorded session of one page view, not all recorded sessions.
     * Once a recorded page view has been deleted, the replay video will no longer be available in the UI and no data
     * can be retrieved anymore via the API for this page view.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the session recording you want to delete the data.
     * @param int $idLogHsr  The id of the recorded session you want to delete.
     */
    public function deleteRecordedPageview($idSite, $idSiteHsr, $idLogHsr)
    {
        $this->validator->checkWritePermission($idSite);
        // make sure the recording actually belongs to that site, otherwise could delete any recording for any other site
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->logHsrSite->unlinkRecord($idLogHsr, $idSiteHsr);
    }

    /**
     * Get metadata for a specific heatmap like the number of samples / pageviews that were recorded or the
     * average above the fold per device type.
     *
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param int $idSiteHsr  The id of the heatmap you want to retrieve the meta data for.
     * @param bool|string $segment
     * @return array
     */
    public function getRecordedHeatmapMetadata($idSite, $period, $date, $idSiteHsr, $segment = false)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $samples = $this->aggregator->getRecordedHeatmapMetadata($idSiteHsr, $idSite, $period, $date, $segment);

        $result = array('nb_samples_device_all' => 0);

        foreach ($samples as $sample) {
            $result['nb_samples_device_' . $sample['device_type']] = $sample['value'];
            $result['avg_fold_device_' . $sample['device_type']] = round(($sample['avg_fold'] / LogHsr::SCROLL_ACCURACY) * 100, 1);
            $result['nb_samples_device_all'] += $sample['value'];
        }

        return $result;
    }

    /**
     * Get all activities of a heatmap.
     *
     * For example retrieve all mouse movements made by desktop visitors, or all clicks made my tablet visitors, or
     * all scrolls by mobile users. It is recommended to call this method with filter_limit = -1 to retrieve all
     * results. As there can be many results, you may want to call this method several times using filter_limit and
     * filter_offset.
     *
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param int $idSiteHsr    The id of the heatmap you want to retrieve the data for.
     * @param int $heatmapType  To see which heatmap types can be used, call {@link getAvailableHeatmapTypes()}
     * @param int $deviceType   To see which device types can be used, call {@link getAvailableDeviceTypes()}
     * @param bool|string $segment
     * @return array
     */
    public function getRecordedHeatmap($idSite, $period, $date, $idSiteHsr, $heatmapType, $deviceType, $segment = false)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        if ($heatmapType == RequestProcessor::EVENT_TYPE_SCROLL) {
            $heatmap = $this->aggregator->aggregateScrollHeatmap($idSiteHsr, $deviceType, $idSite, $period, $date, $segment);
        } else {
            $heatmap = $this->aggregator->aggregateHeatmap($idSiteHsr, $heatmapType, $deviceType, $idSite, $period, $date, $segment);
        }

        // we do not return dataTable here as it doubles the time it takes to call this method (eg 4s vs 7s when heaps of data)
        // datatable is not really needed here as we don't want to sort it or so
        return $heatmap;
    }

    /**
     * @param $idSite
     * @param $idSiteHsr
     * @param $idLogHsr
     * @return array
     * @hide
     */
    public function getEmbedSessionInfo($idSite, $idSiteHsr, $idLogHsr)
    {
        $this->validator->checkSessionReportViewPermission($idSite);

        $aggregator = new Aggregator();
        return $aggregator->getEmbedSessionInfo($idSite, $idSiteHsr, $idLogHsr);
    }

    /**
     * Tests, checks whether the given URL matches the given page rules.
     *
     * This can be used before configuring a heatmap or session recording to make sure the configured target page(s)
     * will match a specific URL.
     *
     * @param string $url
     * @param array $matchPageRules
     * @return array
     * @throws Exception
     */
    public function testUrlMatchPages($url, $matchPageRules = array())
    {
        $this->validator->checkHasSomeWritePermission();

        if ($url === '' || $url === false || $url === null) {
            return array('url' => '', 'matches' => false);
        }

        if (!empty($matchPageRules) && !is_array($matchPageRules)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorNotAnArray', 'matchPageRules'));
        }

        $url = Common::unsanitizeInputValue($url);

        if (!empty($matchPageRules)) {
            $pageRules = new PageRules($matchPageRules, '', $needsOneEntry = false);
            $pageRules->check();
        }

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        $allMatch = HsrMatcher::matchesAllPageRules($matchPageRules, $url);

        return array('url' => $url, 'matches' => $allMatch);
    }

    /**
     * Get a list of valid heatmap and session recording statuses (eg "active", "ended")
     *
     * @return array
     */
    public function getAvailableStatuses()
    {
        $this->validator->checkHasSomeWritePermission();

        return array(
            array('value' => SiteHsrDao::STATUS_ACTIVE, 'name' => Piwik::translate('HeatmapSessionRecording_StatusActive')),
            array('value' => SiteHsrDao::STATUS_ENDED, 'name' => Piwik::translate('HeatmapSessionRecording_StatusEnded')),
        );
    }

    /**
     * Get a list of all available target attributes and target types for "pageTargets" / "page rules".
     *
     * For example URL, URL Parameter, Path, simple comparison, contains, starts with, and more.
     *
     * @return array
     */
    public function getAvailableTargetPageRules()
    {
        $this->validator->checkHasSomeWritePermission();

        return PageRuleMatcher::getAvailableTargetTypes();
    }

    /**
     * Get a list of available device types that can be used when fetching a heatmap report.
     *
     * For example desktop, tablet, mobile.
     *
     * @return array
     */
    public function getAvailableDeviceTypes()
    {
        Piwik::checkUserHasSomeViewAccess();

        return array(
            array('name' => Piwik::translate('General_Desktop'),
                  'key' => LogHsr::DEVICE_TYPE_DESKTOP,
                  'logo' => 'plugins/Morpheus/icons/dist/devices/desktop.png'),
            array('name' => Piwik::translate('DevicesDetection_Tablet'),
                  'key' => LogHsr::DEVICE_TYPE_TABLET,
                  'logo' => 'plugins/Morpheus/icons/dist/devices/tablet.png'),
            array('name' => Piwik::translate('General_Mobile'),
                  'key' => LogHsr::DEVICE_TYPE_MOBILE,
                  'logo' => 'plugins/Morpheus/icons/dist/devices/smartphone.png'),
        );
    }

    /**
     * Get a list of available heatmap types that can be used when fetching a heatmap report.
     *
     * For example click, mouse move, scroll.
     *
     * @return array
     */
    public function getAvailableHeatmapTypes()
    {
        Piwik::checkUserHasSomeViewAccess();

        return array(
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityClick'),
                'key' => RequestProcessor::EVENT_TYPE_CLICK),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityMove'),
                'key' => RequestProcessor::EVENT_TYPE_MOVEMENT),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityScroll'),
                'key' => RequestProcessor::EVENT_TYPE_SCROLL),
        );
    }

    /**
     * Get a list of available session recording sample limits.
     *
     * Note: This is only a suggested list of sample limits that should be shown in the UI when creating or editing a
     * session recording. When you configure a session recording via the API directly, any limit can be used.
     *
     * For example 50, 100, 200, 500
     *
     * @return array
     */
    public function getAvailableSessionRecordingSampleLimits()
    {
        $this->validator->checkHasSomeWritePermission();
        $this->validator->checkSessionRecordingEnabled();

        return $this->configuration->getSessionRecordingSampleLimits();
    }

    /**
     * Get a list of available event types that may be returned eg when fetching a recorded session.
     *
     * @return array
     */
    public function getEventTypes()
    {
        Piwik::checkUserHasSomeViewAccess();

        return array(
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityMove'),
                'key' => RequestProcessor::EVENT_TYPE_MOVEMENT),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityClick'),
                'key' => RequestProcessor::EVENT_TYPE_CLICK),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityScroll'),
                'key' => RequestProcessor::EVENT_TYPE_SCROLL),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityResize'),
                'key' => RequestProcessor::EVENT_TYPE_RESIZE),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityInitialDom'),
                'key' => RequestProcessor::EVENT_TYPE_INITIAL_DOM),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityPageChange'),
                'key' => RequestProcessor::EVENT_TYPE_MUTATION),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityFormText'),
                'key' => RequestProcessor::EVENT_TYPE_FORM_TEXT),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityFormValue'),
                'key' => RequestProcessor::EVENT_TYPE_FORM_VALUE),
            array(
                'name' => Piwik::translate('HeatmapSessionRecording_ActivityScrollElement'),
                'key' => RequestProcessor::EVENT_TYPE_SCROLL_ELEMENT),
        );
    }
}
