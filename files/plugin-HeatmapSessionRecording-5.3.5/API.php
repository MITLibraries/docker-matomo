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
 *
 * @OA\Tag(name="HeatmapSessionRecording")
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Adds a new heatmap.
     *
     * Once added, the system will start recording activities for this heatmap.
     *
     * @param int $idSite ID of the site to which the heatmap configuration should be assigned.
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
     * @param bool $captureDomManually Optional, indicate whether the DOM should be configured to be captured manually instead of the usual automatic capture.
     *
     * @return int ID of the newly created heatmap configuration.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.addHeatmap",
     *     operationId="HeatmapSessionRecording.addHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(
     *         name="idSite",
     *         in="query",
     *         required=true,
     *         description="ID of the site to which the heatmap configuration should be assigned.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of heatmap which will be visible in the reporting UI.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="matchPageRules",
     *         in="query",
     *         required=true,
     *         description="Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory')) For a list of available attribute and type values call {@link getAvailableTargetPageRules()}. ""inverted"" should be ""0"" or ""1"".",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items()
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleLimit",
     *         in="query",
     *         required=false,
     *         description="The number of page views you want to record. Once the sample limit has been reached, the heatmap will be ended automatically.",
     *         @OA\Schema(
     *             type="integer",
     *             default=1000
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleRate",
     *         in="query",
     *         required=false,
     *         description="Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%. Defines how often a visitor will be actually recorded when they match the page rules, also known as ""traffic"". Currently max one decimal is supported.",
     *         @OA\Schema(
     *             type="number",
     *             default="5"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="excludedElements",
     *         in="query",
     *         required=false,
     *         description="Optional, a comma separated list of CSS selectors to exclude elements from being shown in the heatmap. For example to disable popups etc.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="screenshotUrl",
     *         in="query",
     *         required=false,
     *         description="Optional, a URL to define on which page a screenshot should be taken.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="breakpointMobile",
     *         in="query",
     *         required=false,
     *         description="If the device type cannot be detected, we will put any device having a lower width than this value into the mobile category. Useful if your website is responsive.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="breakpointTablet",
     *         in="query",
     *         required=false,
     *         description="If the device type cannot be detected, we will put any device having a lower width than this value into the tablet category. Useful if your website is responsive.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="captureDomManually",
     *         in="query",
     *         required=false,
     *         description="Optional, indicate whether the DOM should be configured to be captured manually instead of the usual automatic capture.",
     *         @OA\Schema(
     *             type="boolean",
     *             default=false
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="ID of the newly created heatmap configuration.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
     * @param int $idSite ID of the site to which the source heatmap configuration is assigned.
     * @param int $idSiteHsr ID of the heatmap to duplicate.
     * @param int[] $idDestinationSites Optional array of IDs identifying which site(s) the new heatmap is to be
     * assigned to. The default is [idSite] when nothing is provided.
     *
     * @return array The result of the duplication request, such as whether it was successful and the IDs of the newly
     * created heatmaps.
     * @throws Exception
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.duplicateHeatmap",
     *     operationId="HeatmapSessionRecording.duplicateHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(
     *         name="idSite",
     *         in="query",
     *         required=true,
     *         description="ID of the site to which the source heatmap configuration is assigned.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="ID of the heatmap to duplicate.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idDestinationSites",
     *         in="query",
     *         required=false,
     *         description="Optional array of IDs identifying which site(s) the new heatmap is to be assigned to. The default is [idSite] when nothing is provided.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(type="integer"),
     *             default={}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The result of the duplication request, such as whether it was successful and the IDs of the newly
     * created heatmaps.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items()
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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

    // phpcs:disable Generic.Files.LineLength
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
     * @param bool $captureDomManually Optional, indicate whether the DOM should be configured to be captured manually instead of the usual automatic capture.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.updateHeatmap",
     *     operationId="HeatmapSessionRecording.updateHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap you want to update.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of heatmap which will be visible in the reporting UI.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="matchPageRules",
     *         in="query",
     *         required=true,
     *         description="Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory')) For a list of available attribute and type values call {@link getAvailableTargetPageRules()}. ""inverted"" should be ""0"" or ""1"".",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items()
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleLimit",
     *         in="query",
     *         required=false,
     *         description="The number of page views you want to record. Once the sample limit has been reached, the heatmap will be ended automatically.",
     *         @OA\Schema(
     *             type="integer",
     *             default=1000
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleRate",
     *         in="query",
     *         required=false,
     *         description="Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%. Defines how often a visitor will be actually recorded when they match the page rules, also known as ""traffic"". Currently max one decimal is supported.",
     *         @OA\Schema(
     *             type="number",
     *             default="5"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="excludedElements",
     *         in="query",
     *         required=false,
     *         description="Optional, a comma separated list of CSS selectors to exclude elements from being shown in the heatmap. For example to disable popups etc.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="screenshotUrl",
     *         in="query",
     *         required=false,
     *         description="Optional, a URL to define on which page a screenshot should be taken.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="breakpointMobile",
     *         in="query",
     *         required=false,
     *         description="If the device type cannot be detected, we will put any device having a lower width than this value into the mobile category. Useful if your website is responsive.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="breakpointTablet",
     *         in="query",
     *         required=false,
     *         description="If the device type cannot be detected, we will put any device having a lower width than this value into the tablet category. Useful if your website is responsive.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="captureDomManually",
     *         in="query",
     *         required=false,
     *         description="Optional, indicate whether the DOM should be configured to be captured manually instead of the usual automatic capture.",
     *         @OA\Schema(
     *             type="boolean",
     *             default=false
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
    // phpcs:enable Generic.Files.LineLength
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
        $captureDomManually = false
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

        $this->siteHsr->updateHeatmap($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $captureDomManually, $updatedDate);
    }

    /**
     * Deletes / removes the screenshot from a heatmap
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the heatmap you want to delete.
     *
     * @return bool Indication of whether the deletion was successful.
     * @throws Exception
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.deleteHeatmapScreenshot",
     *     operationId="HeatmapSessionRecording.deleteHeatmapScreenshot",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap you want to delete.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Indication of whether the deletion was successful.",
     *         @OA\Schema(
     *             type="boolean"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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

    // phpcs:disable Generic.Files.LineLength
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
     *
     * @return int ID of the newly created session recording configuration.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.addSessionRecording",
     *     operationId="HeatmapSessionRecording.addSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of session recording which will be visible in the reporting UI.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="matchPageRules",
     *         in="query",
     *         required=false,
     *         description="Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory')) For a list of available attribute and type values call {@link getAvailableTargetPageRules()}. ""inverted"" should be ""0"" or ""1"". Leave it empty to record any page. If page rules are set, a session will be only recorded as soon as a visitor has reached a page that matches these rules.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(),
     *             default={}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleLimit",
     *         in="query",
     *         required=false,
     *         description="The number of sessions you want to record. Once the sample limit has been reached, the session recording will be ended automatically.",
     *         @OA\Schema(
     *             type="integer",
     *             default=1000
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleRate",
     *         in="query",
     *         required=false,
     *         description="Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%. Defines how often a visitor will be actually recorded when they match the page rules, also known as ""traffic"". Currently max one decimal is supported.",
     *         @OA\Schema(
     *             type="number",
     *             default="10"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="minSessionTime",
     *         in="query",
     *         required=false,
     *         description="If defined, will only record sessions when the visitor has spent more than this many seconds on the current page.",
     *         @OA\Schema(
     *             type="integer",
     *             default=0
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="requiresActivity",
     *         in="query",
     *         required=false,
     *         description="If enabled (default), the session will be only recorded if the visitor has at least scrolled and clicked once.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="captureKeystrokes",
     *         in="query",
     *         required=false,
     *         description="If enabled (default), any text that a user enters into text form elements will be recorded. Password fields will be automatically masked and you can mask other elements with sensitive data using a data-matomo-mask attribute.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="ID of the newly created session recording configuration.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function addSessionRecording($idSite, $name, $matchPageRules = array(), $sampleLimit = 1000, $sampleRate = 10, $minSessionTime = 0, $requiresActivity = true, $captureKeystrokes = true)
    {
        $this->validator->checkSessionReportWritePermission($idSite);

        $createdDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        return $this->siteHsr->addSessionRecording($idSite, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $createdDate);
    }

    // phpcs:disable Generic.Files.LineLength
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.updateSessionRecording",
     *     operationId="HeatmapSessionRecording.updateSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording you want to update.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         required=true,
     *         description="The name of session recording which will be visible in the reporting UI.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="matchPageRules",
     *         in="query",
     *         required=false,
     *         description="Eg. array(array('attribute' => 'url', 'type' => 'equals_simple', 'inverted' => 0, 'value' => 'http://example.com/directory')) For a list of available attribute and type values call {@link getAvailableTargetPageRules()}. ""inverted"" should be ""0"" or ""1"". Leave it empty to record any page. If page rules are set, a session will be only recorded as soon as a visitor has reached a page that matches these rules.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(),
     *             default={}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleLimit",
     *         in="query",
     *         required=false,
     *         description="The number of sessions you want to record. Once the sample limit has been reached, the session recording will be ended automatically.",
     *         @OA\Schema(
     *             type="integer",
     *             default=1000
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sampleRate",
     *         in="query",
     *         required=false,
     *         description="Needs to be between 0 and 100 where 100 means => 100%, 10 => 10%, 0.1 => 0.1%. Defines how often a visitor will be actually recorded when they match the page rules, also known as ""traffic"". Currently max one decimal is supported.",
     *         @OA\Schema(
     *             type="number",
     *             default="10"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="minSessionTime",
     *         in="query",
     *         required=false,
     *         description="If defined, will only record sessions when the visitor has spent more than this many seconds on the current page.",
     *         @OA\Schema(
     *             type="integer",
     *             default=0
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="requiresActivity",
     *         in="query",
     *         required=false,
     *         description="If enabled (default), the session will be only recorded if the visitor has at least scrolled and clicked once.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="captureKeystrokes",
     *         in="query",
     *         required=false,
     *         description="If enabled (default), any text that a user enters into text form elements will be recorded. Password fields will be automatically masked and you can mask other elements with sensitive data using a data-matomo-mask attribute.",
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
    // phpcs:enable Generic.Files.LineLength
    public function updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules = array(), $sampleLimit = 1000, $sampleRate = 10, $minSessionTime = 0, $requiresActivity = true, $captureKeystrokes = true): void
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $updatedDate = Date::now()->getDatetime();

        $matchPageRules = $this->unsanitizePageRules($matchPageRules);

        $this->siteHsr->updateSessionRecording($idSite, $idSiteHsr, $name, $matchPageRules, $sampleLimit, $sampleRate, $minSessionTime, $requiresActivity, $captureKeystrokes, $updatedDate);
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a specific heatmap by its ID.
     *
     * @param int $idSite
     * @param int $idSiteHsr  The id of the heatmap. [@example=11]
     *
     * @return array An indexed array containing the heatmap values. If the heatmap cannot be found, an error response.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getHeatmap",
     *     operationId="HeatmapSessionRecording.getHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap.",
     *         @OA\Schema(
     *             type="integer",
     *             example=11
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="An indexed array containing the heatmap values. If the heatmap cannot be found, an error response.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getHeatmap&idSite=1&idSiteHsr=11&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getHeatmap&idSite=1&idSiteHsr=11&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"idsitehsr":"11","idsite":"1","name":"Homepage","sample_rate":"100.0","sample_limit":"2000","match_page_rules":{"row":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}}},"excluded_elements":"","screenshot_url":"https:\/\/divezone.net\/","breakpoint_mobile":"600","breakpoint_tablet":"960","created_date":"2018-04-08 08:24:27","updated_date":"2018-04-08 09:50:54","status":"active","capture_manually":"0","created_date_pretty":"Apr 8, 2018","heatmapViewUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=showHeatmap&idSiteHsr=11&useDateUrl=0&idSite=1&period=day&date=yesterday&token_auth=anonymous"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="match_page_rules",
     *                     type="object",
     *                     @OA\Property(
     *                         property="row",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Xml(name="row"),
     *                             additionalProperties=true
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"idsitehsr":11,"idsite":1,"name":"Homepage","sample_rate":"100.0","sample_limit":2000,"match_page_rules":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}},"excluded_elements":"","screenshot_url":"https:\/\/divezone.net\/","breakpoint_mobile":600,"breakpoint_tablet":960,"created_date":"2018-04-08 08:24:27","updated_date":"2018-04-08 09:50:54","status":"active","capture_manually":0,"created_date_pretty":"Apr 8, 2018","heatmapViewUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=showHeatmap&idSiteHsr=11&useDateUrl=0&idSite=1&period=day&date=yesterday&token_auth=anonymous"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="idsitehsr", type="integer"),
     *                 @OA\Property(property="idsite", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="sample_rate", type="string"),
     *                 @OA\Property(property="sample_limit", type="integer"),
     *                 @OA\Property(
     *                     property="match_page_rules",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             type="object",
     *                             @OA\Property(property="attribute", type="string"),
     *                             @OA\Property(property="type", type="string"),
     *                             @OA\Property(property="value", type="string"),
     *                             @OA\Property(property="inverted", type="string")
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="excluded_elements", type="string"),
     *                 @OA\Property(property="screenshot_url", type="string"),
     *                 @OA\Property(property="breakpoint_mobile", type="integer"),
     *                 @OA\Property(property="breakpoint_tablet", type="integer"),
     *                 @OA\Property(property="created_date", type="string"),
     *                 @OA\Property(property="updated_date", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="capture_manually", type="integer"),
     *                 @OA\Property(property="created_date_pretty", type="string"),
     *                 @OA\Property(property="heatmapViewUrl", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getHeatmap($idSite, $idSiteHsr): array
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);
        $this->siteHsr->checkHeatmapExists($idSite, $idSiteHsr);

        $heatmap = $this->siteHsr->getHeatmap($idSite, $idSiteHsr);

        return $heatmap;
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a specific session recording by its ID.
     *
     * @param int $idSite
     * @param int $idSiteHsr   The id of the recording. [@example=13]
     *
     * @return array An indexed array containing the session recording values. If the recording cannot be found, an
     * error response.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getSessionRecording",
     *     operationId="HeatmapSessionRecording.getSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the recording.",
     *         @OA\Schema(
     *             type="integer",
     *             example=13
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="An indexed array containing the session recording values. If the recording cannot be found, an error response.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getSessionRecording&idSite=1&idSiteHsr=13&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getSessionRecording&idSite=1&idSiteHsr=13&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"idsitehsr":"13","idsite":"1","name":"Homepage","sample_rate":"100.0","sample_limit":"250","match_page_rules":{"row":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}}},"min_session_time":"10","requires_activity":"1","capture_keystrokes":"1","created_date":"2018-05-10 16:34:54","updated_date":"2018-06-01 07:37:01","status":"active","capture_manually":"0","created_date_pretty":"May 10, 2018"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="match_page_rules",
     *                     type="object",
     *                     @OA\Property(
     *                         property="row",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Xml(name="row"),
     *                             additionalProperties=true
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"idsitehsr":13,"idsite":1,"name":"Homepage","sample_rate":"100.0","sample_limit":250,"match_page_rules":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}},"min_session_time":10,"requires_activity":true,"capture_keystrokes":true,"created_date":"2018-05-10 16:34:54","updated_date":"2018-06-01 07:37:01","status":"active","capture_manually":0,"created_date_pretty":"May 10, 2018"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="idsitehsr", type="integer"),
     *                 @OA\Property(property="idsite", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="sample_rate", type="string"),
     *                 @OA\Property(property="sample_limit", type="integer"),
     *                 @OA\Property(
     *                     property="match_page_rules",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             type="object",
     *                             @OA\Property(property="attribute", type="string"),
     *                             @OA\Property(property="type", type="string"),
     *                             @OA\Property(property="value", type="string"),
     *                             @OA\Property(property="inverted", type="string")
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="min_session_time", type="integer"),
     *                 @OA\Property(property="requires_activity", type="boolean"),
     *                 @OA\Property(property="capture_keystrokes", type="boolean"),
     *                 @OA\Property(property="created_date", type="string"),
     *                 @OA\Property(property="updated_date", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="capture_manually", type="integer"),
     *                 @OA\Property(property="created_date_pretty", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getSessionRecording($idSite, $idSiteHsr): array
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.pauseHeatmap",
     *     operationId="HeatmapSessionRecording.pauseHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap",
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
    public function pauseHeatmap($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.resumeHeatmap",
     *     operationId="HeatmapSessionRecording.resumeHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap",
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
    public function resumeHeatmap($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.deleteHeatmap",
     *     operationId="HeatmapSessionRecording.deleteHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap",
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
    public function deleteHeatmap($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.endHeatmap",
     *     operationId="HeatmapSessionRecording.endHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap.",
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
    public function endHeatmap($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.pauseSessionRecording",
     *     operationId="HeatmapSessionRecording.pauseSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap",
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
    public function pauseSessionRecording($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.resumeSessionRecording",
     *     operationId="HeatmapSessionRecording.resumeSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap",
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
    public function resumeSessionRecording($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.deleteSessionRecording",
     *     operationId="HeatmapSessionRecording.deleteSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording.",
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
    public function deleteSessionRecording($idSite, $idSiteHsr): void
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
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.endSessionRecording",
     *     operationId="HeatmapSessionRecording.endSessionRecording",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording.",
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
    public function endSessionRecording($idSite, $idSiteHsr): void
    {
        $this->validator->checkSessionReportWritePermission($idSite);
        $this->siteHsr->checkSessionRecordingExists($idSite, $idSiteHsr);

        $this->siteHsr->endSessionRecording($idSite, $idSiteHsr);
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get all available heatmaps for a specific website or app.
     *
     * It will return active as well as ended heatmaps but not any deleted heatmaps.
     *
     * @param int $idSite
     * @param bool|int $includePageTreeMirror set to 0 if you don't need the page tree mirror for heatmaps (improves performance)
     *
     * @return array List of indexed arrays containing the data for each heatmap configuration.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getHeatmaps",
     *     operationId="HeatmapSessionRecording.getHeatmaps",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="includePageTreeMirror",
     *         in="query",
     *         required=false,
     *         description="set to 0 if you don't need the page tree mirror for heatmaps (improves performance)",
     *         @OA\Schema(
     *             type="integer",
     *             enum={0,1},
     *             example=0,
     *             default=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of indexed arrays containing the data for each heatmap configuration.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getHeatmaps&idSite=1&includePageTreeMirror=0&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getHeatmaps&idSite=1&includePageTreeMirror=0&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{"idsitehsr":"11","idsite":"1","name":"Homepage","sample_rate":"100.0","sample_limit":"2000","match_page_rules":{"row":{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}},"excluded_elements":"","page_treemirror":"","screenshot_url":"https:\/\/divezone.net\/","breakpoint_mobile":"600","breakpoint_tablet":"960","created_date":"2018-04-08 08:24:27","updated_date":"2018-04-08 09:50:54","status":"active","capture_manually":"0","created_date_pretty":"Apr 8, 2018","heatmapViewUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=showHeatmap&idSiteHsr=11&useDateUrl=0&idSite=1&period=day&date=yesterday&token_auth=anonymous"}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="match_page_rules",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"idsitehsr":11,"idsite":1,"name":"Homepage","sample_rate":"100.0","sample_limit":2000,"match_page_rules":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}},"excluded_elements":"","page_treemirror":"","screenshot_url":"https:\/\/divezone.net\/","breakpoint_mobile":"600","breakpoint_tablet":"960","created_date":"2018-05-10 16:34:54","updated_date":"2018-06-01 07:37:01","status":"active","capture_manually":0,"created_date_pretty":"May 10, 2018","heatmapViewUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=showHeatmap&idSiteHsr=11&useDateUrl=0&idSite=1&period=day&date=yesterday&token_auth=anonymous"}},
     *             @OA\Schema(
     *                 type="object",
     *                 additionalProperties=true,
     *                 @OA\Property(
     *                     type="object",
     *                     @OA\Property(property="idsitehsr", type="integer"),
     *                     @OA\Property(property="idsite", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="sample_rate", type="string"),
     *                     @OA\Property(property="sample_limit", type="integer"),
     *                     @OA\Property(
     *                         property="match_page_rules",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             additionalProperties=true,
     *                             @OA\Property(
     *                                 type="object",
     *                                 @OA\Property(property="attribute", type="string"),
     *                                 @OA\Property(property="type", type="string"),
     *                                 @OA\Property(property="value", type="string"),
     *                                 @OA\Property(property="inverted", type="string")
     *                             )
     *                         )
     *                     ),
     *                     @OA\Property(property="min_session_time", type="integer"),
     *                     @OA\Property(property="requires_activity", type="boolean"),
     *                     @OA\Property(property="capture_keystrokes", type="boolean"),
     *                     @OA\Property(property="created_date", type="string"),
     *                     @OA\Property(property="updated_date", type="string"),
     *                     @OA\Property(property="status", type="string"),
     *                     @OA\Property(property="capture_manually", type="integer"),
     *                     @OA\Property(property="created_date_pretty", type="string")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getHeatmaps($idSite, $includePageTreeMirror = true)
    {
        $this->validator->checkHeatmapReportViewPermission($idSite);

        return $this->siteHsr->getHeatmaps($idSite, !empty($includePageTreeMirror));
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get all available session recordings for a specific website or app.
     *
     * It will return active as well as ended session recordings but not any deleted session recordings.
     *
     * @param int $idSite
     *
     * @return array List of indexed arrays containing the data for each session recording configuration.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getSessionRecordings",
     *     operationId="HeatmapSessionRecording.getSessionRecordings",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Response(
     *         response=200,
     *         description="List of indexed arrays containing the data for each session recording configuration.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getSessionRecordings&idSite=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getSessionRecordings&idSite=1&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{"idsitehsr":"13","idsite":"1","name":"Homepage","sample_rate":"100.0","sample_limit":"250","match_page_rules":{"row":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}}},"min_session_time":"10","requires_activity":"1","capture_keystrokes":"1","created_date":"2018-05-10 16:34:54","updated_date":"2018-06-01 07:37:01","status":"active","capture_manually":"0","created_date_pretty":"May 10, 2018"}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="match_page_rules",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"idsitehsr":13,"idsite":1,"name":"Homepage","sample_rate":"100.0","sample_limit":250,"match_page_rules":{{"attribute":"url","type":"equals_exactly","value":"https:\/\/divezone.net","inverted":"0"}},"min_session_time":10,"requires_activity":true,"capture_keystrokes":true,"created_date":"2018-05-10 16:34:54","updated_date":"2018-06-01 07:37:01","status":"active","capture_manually":0,"created_date_pretty":"May 10, 2018"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="idsitehsr", type="integer"),
     *                         @OA\Property(property="idsite", type="integer"),
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(property="sample_rate", type="string"),
     *                         @OA\Property(property="sample_limit", type="integer"),
     *                         @OA\Property(
     *                             property="match_page_rules",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 additionalProperties=true,
     *                                 @OA\Property(
     *                                     type="object",
     *                                     @OA\Property(property="attribute", type="string"),
     *                                     @OA\Property(property="type", type="string"),
     *                                     @OA\Property(property="value", type="string"),
     *                                     @OA\Property(property="inverted", type="string")
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(property="min_session_time", type="integer"),
     *                         @OA\Property(property="requires_activity", type="boolean"),
     *                         @OA\Property(property="capture_keystrokes", type="boolean"),
     *                         @OA\Property(property="created_date", type="string"),
     *                         @OA\Property(property="updated_date", type="string"),
     *                         @OA\Property(property="status", type="string"),
     *                         @OA\Property(property="capture_manually", type="integer"),
     *                         @OA\Property(property="created_date_pretty", type="string")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Returns all recorded sessions for a specific session recording.
     *
     * To get the actual recorded data for any of the recorded sessions, call {@link getRecordedSession()}.
     *
     * @param int $idSite
     * @param string $period
     * @param string $date
     * @param int $idSiteHsr  The id of the session recording you want to retrieve all the recorded sessions for.
     *  [@example=13]
     * @param bool $segment
     * @param int $idSubtable Optional visit id if you want to get all recorded pageviews of a specific visitor
     *
     * @return DataTable A list of recorded sessions from a specific period of time.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getRecordedSessions",
     *     operationId="HeatmapSessionRecording.getRecordedSessions",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording you want to retrieve all the recorded sessions for.",
     *         @OA\Schema(
     *             type="integer",
     *             example=13
     *         )
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Parameter(
     *         name="idSubtable",
     *         in="query",
     *         required=false,
     *         description="Optional visit id if you want to get all recorded pageviews of a specific visitor",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="A list of recorded sessions from a specific period of time.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedSessions&idSite=1&period=day&date=today&idSiteHsr=13&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedSessions&idSite=1&period=day&date=today&idSiteHsr=13&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedSessions&idSite=1&period=day&date=today&idSiteHsr=13&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"label":"17207151","nb_pageviews":"2","idvisit":"17207151","first_url":"divezone.net\/","last_url":"divezone.net\/diving\/red-sea","time_on_site":"314793","total_events":"211","idloghsr":"154216","idvisitor":"0","location_country":"us","location_region":"FL","location_city":"Jacksonville","config_os":"WIN","config_device_type":"0","config_device_model":"generic desktop","config_browser_name":"FF","server_time":"2025-09-21 23:46:58","sessionReplayUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154216&idSite=1&period=day&date=today&token_auth=anonymous"},{"label":"17209023","nb_pageviews":"3","idvisit":"17209023","first_url":"divezone.net\/","last_url":"divezone.net\/best-similan-islands-liveaboard-reviews-2013","time_on_site":"406131","total_events":"202","idloghsr":"154223","idvisitor":"0","location_country":"my","location_region":"14","location_city":"Kuala Lumpur","config_os":"WIN","config_device_type":"0","config_device_model":"generic desktop","config_browser_name":"IE","server_time":"2025-09-22 03:40:06","sessionReplayUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154223&idSite=1&period=day&date=today&token_auth=anonymous"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"label":"17207151","nb_pageviews":2,"idvisit":17207151,"first_url":"divezone.net\/","last_url":"divezone.net\/diving\/red-sea","time_on_site":"314793","total_events":211,"idloghsr":154216,"idvisitor":false,"location_country":"us","location_region":"FL","location_city":"Jacksonville","config_os":"WIN","config_device_type":0,"config_device_model":"generic desktop","config_browser_name":"FF","server_time":"2025-09-21 23:46:58","sessionReplayUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154216&idSite=1&period=day&date=today&token_auth=anonymous"},{"label":"17209023","nb_pageviews":3,"idvisit":17209023,"first_url":"divezone.net\/","last_url":"divezone.net\/best-similan-islands-liveaboard-reviews-2013","time_on_site":"406131","total_events":202,"idloghsr":154223,"idvisitor":false,"location_country":"my","location_region":"14","location_city":"Kuala Lumpur","config_os":"WIN","config_device_type":0,"config_device_model":"generic desktop","config_browser_name":"IE","server_time":"2025-09-22 03:40:06","sessionReplayUrl":"index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154223&idSite=1&period=day&date=today&token_auth=anonymous"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="label", type="string"),
     *                         @OA\Property(property="nb_pageviews", type="integer"),
     *                         @OA\Property(property="idvisit", type="integer"),
     *                         @OA\Property(property="first_url", type="string"),
     *                         @OA\Property(property="last_url", type="string"),
     *                         @OA\Property(property="time_on_site", type="string"),
     *                         @OA\Property(property="total_events", type="integer"),
     *                         @OA\Property(property="idloghsr", type="integer"),
     *                         @OA\Property(property="idvisitor", type="string"),
     *                         @OA\Property(property="location_country", type="string"),
     *                         @OA\Property(property="location_region", type="string"),
     *                         @OA\Property(property="location_city", type="string"),
     *                         @OA\Property(property="config_os", type="string"),
     *                         @OA\Property(property="config_device_type", type="integer"),
     *                         @OA\Property(property="config_device_model", type="string"),
     *                         @OA\Property(property="config_browser_name", type="string"),
     *                         @OA\Property(property="server_time", type="string"),
     *                         @OA\Property(property="sessionReplayUrl", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="label    nb_pageviews    idvisit    first_url    last_url    time_on_site    total_events    idloghsr    idvisitor    location_country    location_region    location_city    config_os    config_device_type    config_device_model    config_browser_name    server_time    metadata_sessionReplayUrl
17207151    2    17207151    divezone.net/    divezone.net/diving/red-sea    314793    211    154216    0    us    FL    Jacksonville    WIN    0    generic desktop    FF    2025-09-21 23:46:58    index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154216&idSite=1&period=day&date=today&token_auth=anonymous
17209023    3    17209023    divezone.net/    divezone.net/best-similan-islands-liveaboard-reviews-2013    408824    202    154223    0    my    14    Kuala Lumpur    WIN    0    generic desktop    IE    2025-09-22 03:40:06    index.php?module=Widgetize&action=iframe&moduleToWidgetize=HeatmapSessionRecording&actionToWidgetize=replayRecording&idSiteHsr=13&idLogHsr=154223&idSite=1&period=day&date=today&token_auth=anonymous"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
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
     * @param int $idSiteHsr  The id of the session recording you want to retrieve the data for. [@example=13]
     * @param int $idLogHsr   The id of the recorded session you want to retrieve the data for. [@example=153241]
     *
     * @return array A list of actions related to a specific session recording.
     * @throws Exception
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getRecordedSession",
     *     operationId="HeatmapSessionRecording.getRecordedSession",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the session recording you want to retrieve the data for.",
     *         @OA\Schema(
     *             type="integer",
     *             example=13
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="idLogHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the recorded session you want to retrieve the data for.",
     *         @OA\Schema(
     *             type="integer",
     *             example=153241
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="A list of actions related to a specific session recording.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedSession&idSite=1&idSiteHsr=13&idLogHsr=154216&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedSession&idSite=1&idSiteHsr=13&idLogHsr=154216&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"url":"divezone.net\/","idvisit":"","idvisitor":"","idsite":"1","location_country":"","location_region":"","location_city":"","config_os":"","config_device_type":"","config_device_model":"","config_browser_name":"","time_on_page":"74771","server_time":"2025-09-11 19:25:03","viewport_w_px":"1440","viewport_h_px":"769","scroll_y_max_relative":"1000","fold_y_relative":"85","browser_name":"Unknown","browser_logo":"plugins\/Morpheus\/icons\/dist\/browsers\/UNK.png","os_name":"Unknown","os_logo":"plugins\/Morpheus\/icons\/dist\/os\/UNK.png","device_name":"Unknown","device_logo":"plugins\/Morpheus\/icons\/dist\/devices\/unknown.png","location_name":"","location_logo":"","server_time_pretty":"Sep 11, 2025 21:25:03","time_on_page_pretty":"1 min 14s","pageviews":"","numPageviews":"0"},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="pageviews",
     *                     type="object",
     *                     @OA\Property(
     *                         property="row",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Xml(name="row"),
     *                             additionalProperties=true
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"url":"divezone.net\/","idvisit":null,"idvisitor":null,"idsite":1,"location_country":null,"location_region":null,"location_city":null,"config_os":null,"config_device_type":null,"config_device_model":null,"config_browser_name":null,"time_on_page":74771,"server_time":"2025-09-11 19:25:03","viewport_w_px":1440,"viewport_h_px":769,"scroll_y_max_relative":1000,"fold_y_relative":85,"browser_name":"Unknown","browser_logo":"plugins\/Morpheus\/icons\/dist\/browsers\/UNK.png","os_name":"Unknown","os_logo":"plugins\/Morpheus\/icons\/dist\/os\/UNK.png","device_name":"Unknown","device_logo":"plugins\/Morpheus\/icons\/dist\/devices\/unknown.png","location_name":"","location_logo":"","server_time_pretty":"Sep 11, 2025 21:25:03","time_on_page_pretty":"1 min 14s","pageviews":{},"numPageviews":0},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="url", type="string"),
     *                 @OA\Property(property="idvisit", type="integer"),
     *                 @OA\Property(property="idvisitor", type="string"),
     *                 @OA\Property(property="idsite", type="integer"),
     *                 @OA\Property(property="location_country", type="string"),
     *                 @OA\Property(property="location_region", type="string"),
     *                 @OA\Property(property="location_city", type="string"),
     *                 @OA\Property(property="config_os", type="string"),
     *                 @OA\Property(property="config_device_type", type="integer"),
     *                 @OA\Property(property="config_device_model", type="string"),
     *                 @OA\Property(property="config_browser_name", type="string"),
     *                 @OA\Property(property="time_on_page", type="integer"),
     *                 @OA\Property(property="server_time", type="string"),
     *                 @OA\Property(property="viewport_w_px", type="integer"),
     *                 @OA\Property(property="viewport_h_px", type="integer"),
     *                 @OA\Property(property="scroll_y_max_relative", type="integer"),
     *                 @OA\Property(property="fold_y_relative", type="integer"),
     *                 @OA\Property(property="browser_name", type="string"),
     *                 @OA\Property(property="browser_logo", type="string"),
     *                 @OA\Property(property="os_name", type="string"),
     *                 @OA\Property(property="os_logo", type="string"),
     *                 @OA\Property(property="device_name", type="string"),
     *                 @OA\Property(property="device_logo", type="string"),
     *                 @OA\Property(property="location_name", type="string"),
     *                 @OA\Property(property="location_logo", type="string"),
     *                 @OA\Property(property="server_time_pretty", type="string"),
     *                 @OA\Property(property="time_on_page_pretty", type="string"),
     *                 @OA\Property(
     *                     property="pageviews",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             type="object",
     *                             @OA\Property(property="label", type="string"),
     *                             @OA\Property(property="idloghsr", type="integer"),
     *                             @OA\Property(property="time_on_page", type="integer"),
     *                             @OA\Property(property="resolution", type="string"),
     *                             @OA\Property(property="server_time", type="string"),
     *                             @OA\Property(property="scroll_y_max_relative", type="integer"),
     *                             @OA\Property(property="fold_y_relative", type="integer"),
     *                             @OA\Property(property="server_time_pretty", type="string"),
     *                             @OA\Property(property="time_on_page_pretty", type="string")
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="numPageviews", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
     * It only deletes one recorded session of one page view, not all recorded sessions.
     * Once a recorded page view has been deleted, the replay video will no longer be available in the UI and no data
     * can be retrieved anymore via the API for this page view.
     *
     * @param int $idSite
     * @param int $idSiteHsr The id of the session recording you want to delete the data.
     * @param int $idLogHsr  The id of the recorded session you want to delete.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.deleteRecordedPageview",
     *     operationId="HeatmapSessionRecording.deleteRecordedPageview",
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
     *         name="idLogHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the recorded session you want to delete.",
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
    public function deleteRecordedPageview($idSite, $idSiteHsr, $idLogHsr): void
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
     * @param int $idSiteHsr  The id of the heatmap you want to retrieve the metadata for. [@example=11]
     * @param bool|string $segment
     *
     * @return array The collection of metadata from a specific heatmap configuration during a period of time.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getRecordedHeatmapMetadata",
     *     operationId="HeatmapSessionRecording.getRecordedHeatmapMetadata",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap you want to retrieve the meta data for.",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The collection of metadata from a specific heatmap configuration during a period of time.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items()
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
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

    // phpcs:disable Generic.Files.LineLength
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
     * @param int $idSiteHsr    The id of the heatmap you want to retrieve the data for. [@example=11]
     * @param int $heatmapType  To see which heatmap types can be used, call {@link getAvailableHeatmapTypes()}
     * [@example=2]
     * @param int $deviceType   To see which device types can be used, call {@link getAvailableDeviceTypes()}
     * [@example=1]
     * @param bool|string $segment
     *
     * @return array The list of activities associated with a specific heatmap recording within a period of time.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getRecordedHeatmap",
     *     operationId="HeatmapSessionRecording.getRecordedHeatmap",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(ref="#/components/parameters/idSiteRequired"),
     *     @OA\Parameter(ref="#/components/parameters/periodRequired"),
     *     @OA\Parameter(ref="#/components/parameters/dateRequired"),
     *     @OA\Parameter(
     *         name="idSiteHsr",
     *         in="query",
     *         required=true,
     *         description="The id of the heatmap you want to retrieve the data for.",
     *         @OA\Schema(
     *             type="integer",
     *             example=11
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="heatmapType",
     *         in="query",
     *         required=true,
     *         description="To see which heatmap types can be used, call {@link getAvailableHeatmapTypes()}",
     *         @OA\Schema(
     *             type="integer",
     *             example=2
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="deviceType",
     *         in="query",
     *         required=true,
     *         description="To see which device types can be used, call {@link getAvailableDeviceTypes()}",
     *         @OA\Schema(
     *             type="integer",
     *             example=1
     *         )
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/segmentOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of activities associated with a specific heatmap recording within a period of time.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedHeatmap&idSite=1&period=day&date=today&idSiteHsr=11&heatmapType=2&deviceType=1&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedHeatmap&idSite=1&period=day&date=today&idSiteHsr=11&heatmapType=2&deviceType=1&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getRecordedHeatmap&idSite=1&period=day&date=today&idSiteHsr=11&heatmapType=2&deviceType=1&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"selector":"article#post-10 > div > p:nth-child(20) > img","offset_x":"1378","offset_y":"1608","value":"1"},{"selector":"html","offset_x":"2006","offset_y":"18","value":"1"},{"selector":"li#menu-item-2643 > a","offset_x":"1020","offset_y":"758","value":"2"},{"selector":"li#menu-item-2687 > a","offset_x":"286","offset_y":"854","value":"1"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"selector":"article#post-10 > div > p:nth-child(20) > img","offset_x":1378,"offset_y":1608,"value":1},{"selector":"html","offset_x":2006,"offset_y":18,"value":1},{"selector":"li#menu-item-2643 > a","offset_x":1020,"offset_y":758,"value":2},{"selector":"li#menu-item-2687 > a","offset_x":286,"offset_y":854,"value":1}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="selector", type="string"),
     *                         @OA\Property(property="offset_x", type="integer"),
     *                         @OA\Property(property="offset_y", type="integer"),
     *                         @OA\Property(property="value", type="integer")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="selector    offset_x    offset_y    value
article#post-10 > div > p:nth-child(20) > img   1378    1608    1
html    2006    18  1
li#menu-item-2643 > a   1020    758 2
li#menu-item-2687 > a   286 854 1"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
     * @param int $idSite
     * @param int $idSiteHsr
     * @param int $idLogHsr
     * @return array
     * @hide
     */
    public function getEmbedSessionInfo($idSite, $idSiteHsr, $idLogHsr)
    {
        $this->validator->checkSessionReportViewPermission($idSite);

        $aggregator = new Aggregator();
        return $aggregator->getEmbedSessionInfo($idSite, $idSiteHsr, $idLogHsr);
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Tests, checks whether the given URL matches the given page rules.
     *
     * This can be used before configuring a heatmap or session recording to make sure the configured target page(s)
     * will match a specific URL.
     *
     * @param string $url The URL to test the matching rules against.
     * @param array $matchPageRules Collection of rules determining whether a visit to a URL should be recorded.
     *
     * @return array The result of the test, including the URL and whether it matches all rules.
     * @throws Exception
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.testUrlMatchPages",
     *     operationId="HeatmapSessionRecording.testUrlMatchPages",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Parameter(
     *         name="url",
     *         in="query",
     *         required=true,
     *         description="The URL to test the matching rules against.",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="matchPageRules",
     *         in="query",
     *         required=false,
     *         description="Collection of rules determining whether a visit to a URL should be recorded.",
     *         @OA\Schema(
     *             type="array",
     *             @OA\Items(),
     *             default={}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The result of the test, including the URL and whether it matches all rules.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.testUrlMatchPages&url=https://divezone.net/&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.testUrlMatchPages&url=https://divezone.net/&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.testUrlMatchPages&url=https://divezone.net/&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{"url":"https:\/\/divezone.net\/","matches":"1"}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={"url":"https:\/\/divezone.net\/","matches":true},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="url", type="string"),
     *                 @OA\Property(property="matches", type="boolean")
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="url    matches
https://divezone.net/    1"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of valid heatmap and session recording statuses (eg "active", "ended")
     *
     * @return array The list of potential statuses and their human-friendly names.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getAvailableStatuses",
     *     operationId="HeatmapSessionRecording.getAvailableStatuses",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of potential statuses and their human-friendly names.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableStatuses&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableStatuses&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableStatuses&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"value":"active","name":"Active"},{"value":"ended","name":"Ended"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"value":"active","name":"Active"},{"value":"ended","name":"Ended"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="value", type="string"),
     *                         @OA\Property(property="name", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="value    name
active    Active
ended    Ended"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getAvailableStatuses()
    {
        $this->validator->checkHasSomeWritePermission();

        return array(
            array('value' => SiteHsrDao::STATUS_ACTIVE, 'name' => Piwik::translate('HeatmapSessionRecording_StatusActive')),
            array('value' => SiteHsrDao::STATUS_ENDED, 'name' => Piwik::translate('HeatmapSessionRecording_StatusEnded')),
        );
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of all available target attributes and target types for "pageTargets" / "page rules".
     *
     * For example URL, URL Parameter, Path, simple comparison, contains, starts with, and more.
     *
     * @return array The list of the available components for building matching rules.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getAvailableTargetPageRules",
     *     operationId="HeatmapSessionRecording.getAvailableTargetPageRules",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of the available components for building matching rules.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableTargetPageRules&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableTargetPageRules&format=JSON&token_auth=anonymous), TSV (N/A)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"value":"url","name":"URL","types":{"row":{{"value":"equals_exactly","name":"equals exactly"},{"value":"equals_simple","name":"equals simple"},{"value":"contains","name":"contains"},{"value":"starts_with","name":"starts with"},{"value":"regexp","name":"matches the regular expression"}}},"example":"http:\/\/www.example.com\/directory"},{"value":"path","name":"Path","types":{"row":{{"value":"equals_exactly","name":"equals exactly"},{"value":"equals_simple","name":"equals simple"},{"value":"contains","name":"contains"},{"value":"starts_with","name":"starts with"},{"value":"regexp","name":"matches the regular expression"}}},"example":"\/directory"},{"value":"urlparam","name":"URL Parameter","types":{"row":{{"value":"exists","name":"exists"},{"value":"equals_exactly","name":"equals exactly"},{"value":"contains","name":"contains"},{"value":"regexp","name":"matches the regular expression"}}},"example":"nameOfUrlParameter"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true,
     *                         @OA\Property(
     *                             property="types",
     *                             type="object",
     *                             @OA\Property(
     *                                 property="row",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Xml(name="row"),
     *                                     additionalProperties=true
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"value":"url","name":"URL","types":{{"value":"equals_exactly","name":"equals exactly"},{"value":"equals_simple","name":"equals simple"},{"value":"contains","name":"contains"},{"value":"starts_with","name":"starts with"},{"value":"regexp","name":"matches the regular expression"}},"example":"http:\/\/www.example.com\/directory"},{"value":"path","name":"Path","types":{{"value":"equals_exactly","name":"equals exactly"},{"value":"equals_simple","name":"equals simple"},{"value":"contains","name":"contains"},{"value":"starts_with","name":"starts with"},{"value":"regexp","name":"matches the regular expression"}},"example":"\/directory"},{"value":"urlparam","name":"URL Parameter","types":{{"value":"exists","name":"exists"},{"value":"equals_exactly","name":"equals exactly"},{"value":"contains","name":"contains"},{"value":"regexp","name":"matches the regular expression"}},"example":"nameOfUrlParameter"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="value", type="string"),
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(
     *                             property="types",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 additionalProperties=true,
     *                                 @OA\Property(
     *                                     type="object",
     *                                     @OA\Property(property="value", type="string"),
     *                                     @OA\Property(property="name", type="string")
     *                                 )
     *                             )
     *                         ),
     *                         @OA\Property(property="example", type="string")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getAvailableTargetPageRules(): array
    {
        $this->validator->checkHasSomeWritePermission();

        return PageRuleMatcher::getAvailableTargetTypes();
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available device types that can be used when fetching a heatmap report.
     *
     * For example desktop, tablet, mobile.
     *
     * @return array The list of available device types and their human-friendly names.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getAvailableDeviceTypes",
     *     operationId="HeatmapSessionRecording.getAvailableDeviceTypes",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of available device types and their human-friendly names.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableDeviceTypes&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableDeviceTypes&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableDeviceTypes&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"name":"Desktop","key":"1","logo":"plugins\/Morpheus\/icons\/dist\/devices\/desktop.png"},{"name":"Tablet","key":"2","logo":"plugins\/Morpheus\/icons\/dist\/devices\/tablet.png"},{"name":"Mobile","key":"3","logo":"plugins\/Morpheus\/icons\/dist\/devices\/smartphone.png"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"name":"Desktop","key":1,"logo":"plugins\/Morpheus\/icons\/dist\/devices\/desktop.png"},{"name":"Tablet","key":2,"logo":"plugins\/Morpheus\/icons\/dist\/devices\/tablet.png"},{"name":"Mobile","key":3,"logo":"plugins\/Morpheus\/icons\/dist\/devices\/smartphone.png"}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(property="key", type="integer"),
     *                         @OA\Property(property="logo", type="string")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="name    key    logo
Desktop    1    plugins/Morpheus/icons/dist/devices/desktop.png
Tablet    2    plugins/Morpheus/icons/dist/devices/tablet.png
Mobile    3    plugins/Morpheus/icons/dist/devices/smartphone.png"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available heatmap types that can be used when fetching a heatmap report.
     *
     * For example click, mouse move, scroll.
     *
     * @return array The list of available categories of heatmaps and their human-friendly names.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getAvailableHeatmapTypes",
     *     operationId="HeatmapSessionRecording.getAvailableHeatmapTypes",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of available categories of heatmaps and their human-friendly names.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableHeatmapTypes&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableHeatmapTypes&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableHeatmapTypes&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"name":"Click","key":"2"},{"name":"Move","key":"1"},{"name":"Scroll","key":"3"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"name":"Click","key":2},{"name":"Move","key":1},{"name":"Scroll","key":3}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(property="key", type="integer")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="name    key
Click    2
Move    1
Scroll    3"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available session recording sample limits.
     *
     * Note: This is only a suggested list of sample limits that should be shown in the UI when creating or editing a
     * session recording. When you configure a session recording via the API directly, any limit can be used.
     *
     * For example 50, 100, 200, 500
     *
     * @return array The list of available integer values that can be used as the session recording sample limit.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits",
     *     operationId="HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of available integer values that can be used as the session recording sample limit.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{"50","100","250","500","1000","2000","5000"}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="string"
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={50,100,250,500,1000,2000,5000},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items()
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="50
100
250
500
1000
2000
5000"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
    public function getAvailableSessionRecordingSampleLimits()
    {
        $this->validator->checkHasSomeWritePermission();
        $this->validator->checkSessionRecordingEnabled();

        return $this->configuration->getSessionRecordingSampleLimits();
    }

    // phpcs:disable Generic.Files.LineLength
    /**
     * Get a list of available event types that may be returned. E.g. when fetching a recorded session.
     *
     * @return array The list of the types of events and their human-friendly names which can be tracked as part of a
     * recording.
     *
     * @OA\Get(
     *     path="/index.php?module=API&method=HeatmapSessionRecording.getEventTypes",
     *     operationId="HeatmapSessionRecording.getEventTypes",
     *     tags={"HeatmapSessionRecording"},
     *     @OA\Parameter(ref="#/components/parameters/formatOptional"),
     *     @OA\Response(
     *         response=200,
     *         description="The list of the types of events and their human-friendly names which can be tracked as part of a recording.</br>Example links: [XML](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getEventTypes&format=xml&token_auth=anonymous), [JSON](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getEventTypes&format=JSON&token_auth=anonymous), [TSV (Excel)](https://demo.matomo.cloud/?module=API&method=HeatmapSessionRecording.getEventTypes&format=Tsv&token_auth=anonymous)",
     *         @OA\MediaType(
     *             mediaType="text/xml",
     *             example={"row":{{"name":"Move","key":"1"},{"name":"Click","key":"2"},{"name":"Scroll","key":"3"},{"name":"Resize","key":"4"},{"name":"Initial Page","key":"5"},{"name":"Change Within Page","key":"6"},{"name":"Form Text Change","key":"9"},{"name":"Form Value Change","key":"10"},{"name":"Scroll Element","key":"12"}}},
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Xml(name="result"),
     *                 @OA\Property(
     *                     property="row",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Xml(name="row"),
     *                         additionalProperties=true
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             example={{"name":"Move","key":1},{"name":"Click","key":2},{"name":"Scroll","key":3},{"name":"Resize","key":4},{"name":"Initial Page","key":5},{"name":"Change Within Page","key":6},{"name":"Form Text Change","key":9},{"name":"Form Value Change","key":10},{"name":"Scroll Element","key":12}},
     *             @OA\Schema(
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     additionalProperties=true,
     *                     @OA\Property(
     *                         type="object",
     *                         @OA\Property(property="name", type="string"),
     *                         @OA\Property(property="key", type="integer")
     *                     )
     *                 )
     *             )
     *         ),
     *         @OA\MediaType(
     *             mediaType="application/vnd.ms-excel",
     *             example="name    key
Move    1
Click    2
Scroll    3
Resize    4
Initial Page    5
Change Within Page    6
Form Text Change    9
Form Value Change    10
Scroll Element    12"
     *         )
     *     ),
     *     @OA\Response(response=400, ref="#/components/responses/BadRequest"),
     *     @OA\Response(response=401, ref="#/components/responses/Unauthorized"),
     *     @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *     @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *     @OA\Response(response=500, ref="#/components/responses/ServerError"),
     *     @OA\Response(response="default", ref="#/components/responses/DefaultError")
     * )
     */
    // phpcs:enable Generic.Files.LineLength
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
