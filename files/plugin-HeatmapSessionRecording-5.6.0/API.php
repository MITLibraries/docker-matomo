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
use Piwik\Http\BadRequestException;
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
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
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
 * Exposes the Heatmap & Session Recording API endpoints for managing configurations and retrieving recorded activity.
 *
 * Heatmap coordinates use relative values: X and Y positions range from 0 to 2000, where 1000 represents 50% of the
 * matched element. Scroll reach and above-the-fold positions range from 0 to 1000, where 100 represents 10% of the
 * page height. `idSiteHsr` identifies a heatmap or session recording configuration, while `idLogHsr` identifies an
 * individual recorded activity entry.
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
     * Once created, Matomo starts recording matching page activity for this heatmap.
     *
     * @param int $idSite The numeric ID of the website to configure.
     * @param string $name The heatmap name shown in the reporting UI.
     * @param array $matchPageRules Matching rules that define which pages contribute to this heatmap.
     * @param int $sampleLimit The number of matching page views to record before the heatmap ends automatically.
     * @param float $sampleRate The percentage of matching traffic to record, from 0 to 100 with up to one decimal
     *                          place.
     * @param string|false $excludedElements Comma-separated CSS selectors to exclude from the heatmap output.
     * @param string|false $screenshotUrl URL of the page to capture for the heatmap screenshot.
     * @param int|false $breakpointMobile Width threshold used to classify visits as mobile when device detection is
     *                                    unavailable.
     * @param int|false $breakpointTablet Width threshold used to classify visits as tablet when device detection is
     *                                    unavailable.
     * @param bool $captureDomManually Whether the DOM should be captured manually instead of automatically.
     * @param string $description Optional description providing additional context, such as the purpose or usage.
     * @param bool $autoRepeat Whether Matomo should automatically create a new heatmap once this one finishes.
     *
     * @return int The ID of the newly created heatmap configuration.
     */
    public function addHeatmap(
        $idSite,
        $name,
        $matchPageRules,
        $sampleLimit = 1000,
        $sampleRate = 5,
        $excludedElements = false,
        $screenshotUrl = false,
        $breakpointMobile = false,
        $breakpointTablet = false,
        $captureDomManually = false,
        $description = '',
        bool $autoRepeat = false
    ) {
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

        return $this->siteHsr->addHeatmap($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $createdDate, $description, $autoRepeat);
    }

    /**
     * Copies a specified heatmap to one or more sites. If a heatmap with the same name already exists, the new heatmap
     * will have an automatically adjusted name to make it unique to the assigned site.
     *
     * @param int $idSite The numeric ID of the website that owns the source heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to duplicate.
     * @param int[] $idDestinationSites Site IDs to copy the heatmap to. Defaults to the source site when omitted.
     *
     * @return array The duplication result, including success state, messages, and any newly created heatmap IDs.
     */
    public function duplicateHeatmap(int $idSite, int $idSiteHsr, array $idDestinationSites = []): array
    {
        if (!class_exists('\Piwik\Plugins\CoreHome\EntityDuplicator\DuplicateRequestResponse')) {
            throw new BadRequestException('This endpoint is not available until Matomo 5.4.0');
        }

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
                    $newName = EntityDuplicatorHelper::getUniqueNameComparedToList($newName, $heatmapNames, Name::MAX_LENGTH);
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
                    $heatmap['capture_manually'] ?? false,
                    $heatmap['description'] ?? '',
                    $heatmap['auto_repeat'] ?? false
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

        // Make sure to record the activity for the report being copied
        if (class_exists('\Piwik\Plugins\ActivityLog\ActivityParamObject\EntityDuplicatedData')) {
            // TODO - Remove this if/else and always use the setRequestDataForActivity method for Matomo 6.x
            if (method_exists($duplicateRequestResponse, 'setRequestDataForEvent')) {
                $duplicateRequestResponse->setRequestDataForEvent(
                    'HeatmapSessionRecording_Heatmap',
                    $heatmap['name'],
                    $idSiteHsr,
                    $idSite,
                    $idDestinationSites,
                    $additionalData
                );
            } else {
                (
                    new \Piwik\Plugins\ActivityLog\ActivityParamObject\EntityDuplicatedData(
                        'HeatmapSessionRecording_Heatmap',
                        $heatmap['name'],
                        $idSiteHsr,
                        $idSite,
                        $idDestinationSites,
                        $additionalData
                    )
                )->postActivityEvent();
            }
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
     * Send the full configuration payload when updating a heatmap, not only the fields you changed.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to update.
     * @param string $name The heatmap name shown in the reporting UI.
     * @param array $matchPageRules Matching rules that define which pages contribute to this heatmap.
     * @param int $sampleLimit The number of matching page views to record before the heatmap ends automatically.
     * @param float $sampleRate The percentage of matching traffic to record, from 0 to 100 with up to one decimal
     *                          place.
     * @param string|false $excludedElements Comma-separated CSS selectors to exclude from the heatmap output.
     * @param string|false $screenshotUrl URL of the page to capture for the heatmap screenshot.
     * @param int|false $breakpointMobile Width threshold used to classify visits as mobile when device detection is
     *                                    unavailable.
     * @param int|false $breakpointTablet Width threshold used to classify visits as tablet when device detection is
     *                                    unavailable.
     * @param bool $captureDomManually Whether the DOM should be captured manually instead of automatically.
     * @param string $description Optional description providing additional context, such as the purpose or usage.
     * @param bool $autoRepeat Whether Matomo should automatically create a new heatmap once this one finishes.
     *
     * @return void
     */
    public function updateHeatmap(
        $idSite,
        $idSiteHsr,
        $name,
        $matchPageRules,
        $sampleLimit = 1000,
        $sampleRate = 5,
        $excludedElements = false,
        $screenshotUrl = false,
        $breakpointMobile = false,
        $breakpointTablet = false,
        $captureDomManually = false,
        $description = '',
        bool $autoRepeat = false
    ): void {
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

        $this->siteHsr->updateHeatmap($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $updatedDate, $description, $autoRepeat);
    }

    /**
     * Deletes the stored snapshot (screenshot) for a heatmap.
     *
     * Works for active, ended and paused heatmaps. When $captureManually is set, the snapshot is not retaken
     * automatically on the next recorded visit and must be captured manually; this is only allowed for active
     * heatmaps, as ended or paused heatmaps no longer record any visits.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to update.
     * @param bool $captureManually Whether the new snapshot must be captured manually instead of automatically.
     *
     * @return bool Whether the snapshot reference was removed.
     */
    public function deleteHeatmapScreenshot($idSite, $idSiteHsr, bool $captureManually = false)
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $heatmap = $this->siteHsr->getHeatmap($idSite, $idSiteHsr);
        $isActive = !empty($heatmap['status']) && $heatmap['status'] === SiteHsrDao::STATUS_ACTIVE;

        if ($captureManually && !$isActive) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorSnapshotManualRetakeOnlyActive'));
        }

        $hadScreenshot = !empty($heatmap['page_treemirror']);
        $captureManuallyChanged = (int) ($heatmap['capture_manually'] ?? 0) !== ($captureManually ? 1 : 0);

        $this->siteHsr->setPageTreeMirror($idSite, $idSiteHsr, null, null);
        $this->siteHsr->markScreenshotDeleted($idSite, $idSiteHsr, $captureManually);

        if ($hadScreenshot || $captureManuallyChanged) {
            // the tracker cache carries page_treemirror and capture_manually, so it must be
            // rebuilt when the snapshot existed or the stored manual-capture flag changed
            Cache::deleteCacheWebsiteAttributes($idSite);
        }

        return true;
    }

    /**
     * Adds a new session recording.
     *
     * Once created, Matomo starts recording matching visitor sessions.
     *
     * @param int $idSite The numeric ID of the website to configure.
     * @param string $name The session recording name shown in the reporting UI.
     * @param array $matchPageRules Matching rules that define which pages contribute to this heatmap.
     * @param int $sampleLimit The number of sessions to record before the recording ends automatically.
     * @param float $sampleRate The percentage of matching traffic to record, from 0 to 100 with up to one decimal
     *                          place.
     * @param int $minSessionTime Minimum time in seconds a visitor must spend on the current page before recording.
     * @param bool $requiresActivity Whether the visitor must interact by scrolling or clicking before the session is
     *                               kept.
     * @param bool $captureKeystrokes Whether entered form text should be recorded. Password fields are masked
     *                                automatically.
     * @param string $description Optional description providing additional context, such as the purpose or usage.
     * @param bool $autoRepeat Whether Matomo should automatically create a new session recording once this one
     *                         finishes.
     *
     * @return int The ID of the newly created session recording configuration.
     */
    public function addSessionRecording($idSite, $name, $matchPageRules = array(), $sampleLimit = 1000, $sampleRate = 10, $minSessionTime = 0, $requiresActivity = true, $captureKeystrokes = true, $description = '', bool $autoRepeat = false)
    {
        $this->validator->checkSessionReportWritePermission($idSite);

        $createdDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        return $this->siteHsr->addSessionRecording($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $createdDate, $description, $autoRepeat);
    }

    /**
     * Updates an existing session recording.
     *
     * Send the full configuration payload when updating a session recording, not only the fields you changed.
     *
     * @param int $idSite The numeric ID of the website that owns the session recording.
     * @param int $idSiteHsr The ID of the session recording configuration to update.
     * @param string $name The session recording name shown in the reporting UI.
     * @param array $matchPageRules Matching rules that define which pages contribute to this heatmap.
     * @param int $sampleLimit The number of sessions to record before the recording ends automatically.
     * @param float $sampleRate The percentage of matching traffic to record, from 0 to 100 with up to one decimal
     *                          place.
     * @param int $minSessionTime Minimum time in seconds a visitor must spend on the current page before recording.
     * @param bool $requiresActivity Whether the visitor must interact by scrolling or clicking before the session is
     *                               kept.
     * @param bool $captureKeystrokes Whether entered form text should be recorded. Password fields are masked
     *                                automatically.
     * @param string $description Optional description providing additional context, such as the purpose or usage.
     * @param bool $autoRepeat Whether Matomo should automatically create a new session recording once this one
     *                         finishes.
     *
     * @return void
     */
    public function updateSessionRecording(
        $idSite,
        $idSiteHsr,
        $name,
        $matchPageRules = array(),
        $sampleLimit = 1000,
        $sampleRate = 10,
        $minSessionTime = 0,
        $requiresActivity = true,
        $captureKeystrokes = true,
        $description = '',
        bool $autoRepeat = false
    ): void {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $updatedDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        $this->siteHsr->updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $updatedDate, $description, $autoRepeat);
    }

    /**
     * Returns a single heatmap configuration.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param int $idSiteHsr The ID of the heatmap configuration to fetch.
     *
     * @return array The heatmap configuration data for the requested heatmap.
     */
    public function getHeatmap($idSite, $idSiteHsr): array
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $heatmap = $this->siteHsr->getHeatmap($idSite, $idSiteHsr);

        return $heatmap;
    }

    /**
     * Returns a single session recording configuration.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param int $idSiteHsr The ID of the session recording configuration to fetch.
     *
     * @return array The session recording configuration data for the requested recording.
     */
    public function getSessionRecording($idSite, $idSiteHsr): array
    {
        $this->validator->checkSessionReportViewPermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        return $this->siteHsr->getSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Pauses a heatmap configuration.
     *
     * While paused, Matomo stops collecting new activity for the heatmap until it is resumed.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to pause.
     *
     * @return void
     */
    public function pauseHeatmap($idSite, $idSiteHsr): void
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->pauseHeatmap($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Resumes a paused heatmap configuration.
     *
     * Once resumed, Matomo starts collecting new matching activity again.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to resume.
     *
     * @return void
     */
    public function resumeHeatmap($idSite, $idSiteHsr): void
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->resumeHeatmap($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Deletes a heatmap configuration.
     *
     * Deleted heatmaps are no longer available through the API, and related tracked data may be removed.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to delete.
     *
     * @return void
     */
    public function deleteHeatmap($idSite, $idSiteHsr): void
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);

        $this->siteHsr->deactivateHeatmap($idSite, $idSiteHsr);
    }

    /**
     * Ends a heatmap configuration.
     *
     * Ended heatmaps remain available in the API and UI, but no new heatmap activity is recorded.
     * Only a heatmap that has started (active or paused) can be ended. A heatmap that is on hold waiting for its
     * scheduled date, or one that has already ended, is left unchanged and can only be deleted.
     *
     * @param int $idSite The numeric ID of the website that owns the heatmap.
     * @param int $idSiteHsr The ID of the heatmap configuration to end.
     *
     * @return void
     */
    public function endHeatmap($idSite, $idSiteHsr): void
    {
        $this->validator->checkHeatmapReportWritePermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $this->siteHsr->endHeatmap($idSite, $idSiteHsr);
    }

    /**
     * Pauses a session recording configuration.
     *
     * While paused, Matomo stops collecting new recorded sessions until it is resumed.
     *
     * @param int $idSite The numeric ID of the website that owns the session recording.
     * @param int $idSiteHsr The ID of the session recording configuration to pause.
     *
     * @return void
     */
    public function pauseSessionRecording($idSite, $idSiteHsr): void
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->pauseSessionRecording($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Resumes a paused session recording configuration.
     *
     * Once resumed, Matomo starts collecting new matching sessions again.
     *
     * @param int $idSite The numeric ID of the website that owns the session recording.
     * @param int $idSiteHsr The ID of the session recording configuration to resume.
     *
     * @return void
     */
    public function resumeSessionRecording($idSite, $idSiteHsr): void
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->resumeSessionRecording($idSite, $idSiteHsr);

        Cache::deleteCacheWebsiteAttributes($idSite);
    }

    /**
     * Deletes a session recording configuration.
     *
     * Deleted session recordings are no longer available through the API, and related tracked data may be removed.
     *
     * @param int $idSite The numeric ID of the website that owns the session recording.
     * @param int $idSiteHsr The ID of the session recording configuration to delete.
     *
     * @return void
     */
    public function deleteSessionRecording($idSite, $idSiteHsr): void
    {

        $this->validator->checkSessionReportWritePermission($idSite);

        $this->siteHsr->deactivateSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Ends a session recording configuration.
     *
     * Ended session recordings remain available in the API and UI, but no new sessions are recorded.
     *
     * @param int $idSite The numeric ID of the website that owns the session recording.
     * @param int $idSiteHsr The ID of the session recording configuration to end.
     *
     * @return void
     */
    public function endSessionRecording($idSite, $idSiteHsr): void
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->endSessionRecording($idSite, $idSiteHsr);
    }

    /**
     * Returns all non-deleted heatmaps for a website.
     *
     * The response can include active and ended heatmaps, but not deleted ones.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param bool|int $includePageTreeMirror Whether to include the stored page tree mirror for each heatmap.
     *
     * @return array A list of heatmap configurations for the requested website.
     */
    public function getHeatmaps($idSite, $includePageTreeMirror = true)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);

        return $this->siteHsr->getHeatmaps($idSite, !empty($includePageTreeMirror));
    }

    /**
     * Returns all non-deleted session recordings for a website.
     *
     * The response can include active and ended session recordings, but not deleted ones.
     *
     * @param int $idSite The numeric ID of the website to query.
     *
     * @return array A list of session recording configurations for the requested website.
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
     * @param int $idSiteHsr The id of a session recording. [@example=13]
     * @param int $idVisit   The visit / session id
     * @return array A collection of session recordings tied to a specific visit and within a period of time.
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
     * Set `idSubtable` to a visit ID to return the recorded pageviews for that visit instead of the session list.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param int $idSiteHsr The ID of the session recording configuration to query.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     * @param int|false $idSubtable Visit ID to fetch recorded pageviews for one visit instead of the session list.
     *
     * @return DataTable The recorded sessions, or the recorded pageviews for one visit when `idSubtable` is provided.
     */
    public function getRecordedSessions($idSite, $period, $date, $idSiteHsr, $segment = false, $idSubtable = false): DataTable
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
     * The response includes event data, related pageviews, viewport details, device information, and derived display
     * metadata for replaying a recorded session.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param int $idSiteHsr The ID of the session recording configuration to query.
     * @param int $idLogHsr The ID of the recorded session entry to fetch.
     *
     * @return array The recorded session details, including events and recorded pageviews for the replay.
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
     * After deletion, the session replay is no longer available in the UI or through the API.
     *
     * @param int $idSite The numeric ID of the website that owns the recording.
     * @param int $idSiteHsr The ID of the session recording configuration whose data should be deleted.
     * @param int $idVisit The visit ID of the recorded session to delete.
     *
     * @return void
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.deleteRecordedSession",
     *     operationId="HeatmapSessionRecording.deleteRecordedSession",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording you want to delete the data.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idVisit",
     *         in="query",
     *         required=true,
     *         description="The visitId of the recorded session you want to delete.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(response=200, ref="#/components/responses/GenericSuccessNoBody"),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    public function deleteRecordedSession($idSite, $idSiteHsr, $idVisit): void
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
     * This removes only one recorded pageview, not the entire recorded session.
     *
     * @param int $idSite The numeric ID of the website that owns the recording.
     * @param int $idSiteHsr The ID of the session recording configuration whose data should be deleted.
     * @param int $idLogHsr The ID of the recorded pageview entry to delete.
     *
     * @return void
     */
    public function deleteRecordedPageview($idSite, $idSiteHsr, $idLogHsr): void
    {
        $this->validator->checkWritePermission($idSite);
        // make sure the recording actually belongs to that site, otherwise could delete any recording for any other site
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->logHsrSite->unlinkRecord($idLogHsr, $idSiteHsr);
    }

    /**
     * Returns summary metadata for a recorded heatmap.
     *
     * The response includes sample counts and average above-the-fold values for each device type.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param int $idSiteHsr The ID of the heatmap configuration to query.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     *
     * @return array The recorded heatmap metadata for the requested period.
     *
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
     * Use this endpoint to fetch aggregated click, move, or scroll activity for one device type and period.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param 'day'|'week'|'month'|'year'|'range' $period The period to process, processes data for the period
     *                                                    containing the specified date.
     * @param string $date The date or date range to process.
     *                     'YYYY-MM-DD', magic keywords (today, yesterday, lastWeek, lastMonth, lastYear),
     *                     or date range (ie, 'YYYY-MM-DD,YYYY-MM-DD', lastX, previousX).
     * @param int $idSiteHsr The ID of the heatmap configuration to query.
     * @param int $heatmapType Heatmap activity type to return.
     * @param int $deviceType Device type to return.
     * @param string|null|false $segment Custom segment to filter the report.
     *                                   Example: "referrerName==example.com"
     *                                   Supports AND (;) and OR (,) operators.
     *
     * @return array The aggregated heatmap activity points for the requested heatmap, period, and device type.
     *
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
     * Returns the minimal session replay context needed by the embed view.
     *
     * @param int $idSite The numeric ID of the website to query.
     * @param int $idSiteHsr The ID of the session recording configuration to query.
     * @param int $idLogHsr The ID of the recorded session entry to fetch.
     *
     * @return array The embedded replay metadata for the requested recorded session.
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
     * Use this before saving a heatmap or session recording to validate that the configured rules match a URL.
     *
     * @param string $url The URL to test the matching rules against.
     * @param array $matchPageRules Matching rules to evaluate against the URL.
     *
     * @return array The result of the test, including the URL and whether it matches all rules.
     *
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
     * Returns the valid heatmap and session recording statuses.
     *
     * @return array The list of potential statuses and their human-friendly names.
     */
    public function getAvailableStatuses()
    {
        $this->validator->checkHasSomeWritePermission();

        return array(
            array('value' => SiteHsrDao::STATUS_ACTIVE, 'name' => Piwik::translate('HeatmapSessionRecording_StatusActive')),
            array('value' => SiteHsrDao::STATUS_ENDED, 'name' => Piwik::translate('HeatmapSessionRecording_StatusEnded')),
            array('value' => SiteHsrDao::STATUS_ONHOLD, 'name' => Piwik::translate('HeatmapSessionRecording_StatusOnHold')),
        );
    }

    /**
     * Returns the available target attributes and rule types for page matching.
     *
     * @return array The available components for building heatmap and session recording page rules.
     */
    public function getAvailableTargetPageRules(): array
    {
        $this->validator->checkHasSomeWritePermission();

        return PageRuleMatcher::getAvailableTargetTypes();
    }

    /**
     * Returns the device types supported by the heatmap reporting endpoints.
     *
     * @return array The list of available device types and their human-friendly names.
     */
    public function getAvailableDeviceTypes(): array
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
     * Returns the heatmap activity types supported by the heatmap reporting endpoints.
     *
     * @return array The list of available categories of heatmaps and their human-friendly names.
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
     * This is the suggested list shown in the UI. Direct API calls can still use other limits.
     *
     * @return array The list of available integer values that can be used as the session recording sample limit.
     */
    public function getAvailableSessionRecordingSampleLimits()
    {
        $this->validator->checkHasSomeWritePermission();
        $this->validator->checkSessionRecordingEnabled();

        return $this->configuration->getSessionRecordingSampleLimits();
    }

    /**
     * Returns the event types that may appear in recorded session data.
     *
     * @return array The tracked event types and their human-friendly names.
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
