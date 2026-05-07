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

namespace Piwik\Plugins\HeatmapSessionRecording\Tracker;

use Piwik\Common;
use Piwik\Date;
use Piwik\Exception\InvalidRequestParameterException;
use Piwik\Plugins\HeatmapSessionRecording\Configuration;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrEvent;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrBlob;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel;
use Piwik\Tracker\Request;
use Piwik\Tracker;
use Piwik\Tracker\Visit\VisitProperties;

class RequestProcessor extends Tracker\RequestProcessor
{
    public const ACTION_TYPE_HSR_SELECTOR = 96;

    public const TRACKING_PARAM_HSR_ID_VIEW = 'hsr_vid';
    public const TRACKING_PARAM_HSR_IDS = 'hsr_ids';
    public const TRACKING_PARAM_VIEWPORT_WIDTH = 'hsr_vw';
    public const TRACKING_PARAM_VIEWPORT_HEIGHT = 'hsr_vh';
    public const TRACKING_PARAM_SCROLL_MAX_PERCENTAGE = 'hsr_smp';
    public const TRACKING_PARAM_FOLD_Y_PERCENT = 'hsr_fyp';
    public const TRACKING_PARAM_TOTAL_TIME = 'hsr_ti';
    public const TRACKING_PARAM_INITIAL_DOM = 'hsr_dom';
    public const TRACKING_PARAM_EVENTS = 'hsr_ev';

    public const EVENT_TYPE_MOVEMENT = 1;
    public const EVENT_TYPE_CLICK = 2;
    public const EVENT_TYPE_SCROLL = 3;
    public const EVENT_TYPE_RESIZE = 4;
    public const EVENT_TYPE_INITIAL_DOM = 5;
    public const EVENT_TYPE_MUTATION = 6;
    public const EVENT_TYPE_LINK_HSR = 7;
    public const EVENT_TYPE_PAGE_TREEMIRROR = 8;
    public const EVENT_TYPE_FORM_TEXT = 9;
    public const EVENT_TYPE_FORM_VALUE = 10;
    public const EVENT_TYPE_STOP_RECORDING = 11;
    public const EVENT_TYPE_SCROLL_ELEMENT = 12;
    public const EVENT_TYPE_CSS = 13;

    public const MYSQL_MAX_MEDIUM_UINT = 16777215;

    /**
     * @var LogHsr
     */
    private $logHsr;

    /**
     * @var LogHsrEvent
     */
    private $logEvent;

    /**
     * @var LogHsrBlob
     */
    private $logMutation;

    /**
     * @var SiteHsrModel
     */
    private $siteHsr;

    /**
     * @var LogHsrSite
     */
    private $logHsrSite;

    public function __construct(LogHsr $logHsr, LogHsrEvent $logEvent, LogHsrBlob $logMutation, LogHsrSite $logHsrSite, SiteHsrModel $siteHsr)
    {
        $this->logHsr = $logHsr;
        $this->logEvent = $logEvent;
        $this->logMutation = $logMutation;
        $this->siteHsr = $siteHsr;
        $this->logHsrSite = $logHsrSite;
    }

    public function afterRequestProcessed(VisitProperties $visitProperties, Request $request)
    {
        $params = $request->getParams();

        if (!empty($params[self::TRACKING_PARAM_HSR_ID_VIEW])) {
            // we need to make sure no action will be recorded! especially since we might go into record logs!
            $request->setMetadata('Actions', 'action', null);
            // make sure no goals will be recorded!
            $request->setMetadata('Goals', 'goalsConverted', array());

            // for all tracking requests further down we need at least one hsrid
            if (empty($params[self::TRACKING_PARAM_HSR_IDS]) || !is_array($params[self::TRACKING_PARAM_HSR_IDS])) {
                // nothing to record, abort request
                return true;
            }

            $idVisit = $visitProperties->getProperty('idvisit');

            if (empty($idVisit)) {
                // this is a NEW VISIT request, this should usually not happen as HSR requests are usually sent after
                // pageviews. We need to handle the visit during recordLogs()
                // For faster performance and to reduce load on visit table etc we want to record those requests
                // ideally always here in afterRequestProcessed and terminate as early as possible
                return false;
            }

            $this->handleHsrRequest($idVisit, $request);

            // abort anything else
            return true;
        }
    }

    public function recordLogs(VisitProperties $visitProperties, Request $request)
    {
        // we try to insert the request again if it is a new visit, as we now have the idVisit (should have)
        return $this->afterRequestProcessed($visitProperties, $request);
    }

    private function handleHsrRequest($idVisit, Request $request)
    {
        $params = $request->getParams();
        $url = $request->getParam('url');
        $idPageview = $request->getParam('pv_id');
        $idSite = $request->getIdSite();

        $serverTime = Date::getDatetimeFromTimestamp($request->getCurrentTimestamp());
        $timeOnPage = $params[self::TRACKING_PARAM_TOTAL_TIME];
        $viewportW = $params[self::TRACKING_PARAM_VIEWPORT_WIDTH];
        $viewportH = $params[self::TRACKING_PARAM_VIEWPORT_HEIGHT];
        $scrollYMaxPercent = $params[self::TRACKING_PARAM_SCROLL_MAX_PERCENTAGE];
        $foldYpercent = $params[self::TRACKING_PARAM_FOLD_Y_PERCENT];
        $hsrIds = $params[self::TRACKING_PARAM_HSR_IDS];
        $idHsrView = $params[self::TRACKING_PARAM_HSR_ID_VIEW];

        $maxAllowedTimeOnPage = self::MYSQL_MAX_MEDIUM_UINT;
        $configuration = new Configuration();
        $maxAllowedTimeOnPageConfigValue = $configuration->getMaximumAllowedPageTime();
        if (!empty($maxAllowedTimeOnPageConfigValue)) {
            $maxAllowedTimeOnPage = $maxAllowedTimeOnPageConfigValue;
        }

        if ($timeOnPage > $maxAllowedTimeOnPage) {
            return;
        }

        $hsrIds = $this->getValidHsrIds($idSite, $hsrIds);

        if (empty($hsrIds)) {
            Common::printDebug('Warning! no active hsrIds provided, will ignore tracking request');
            throw new InvalidRequestParameterException('No active hsrIds provided');
        }

        $action = $request->getMetadata('Actions', 'action');
        if (!empty($action)) {
            /** @var Tracker\Action $action */
            $action->loadIdsFromLogActionTable();
            $url = $action->getActionUrl();
        }
        $userAgent = $request->getUserAgent();
        $resolution = $request->getParam('res');

        $idLogHsr = $this->logHsr->record($hsrIds, $idSite, $idVisit, $idHsrView, $idPageview, $url, $serverTime, $userAgent, $resolution, $timeOnPage, $viewportW, $viewportH, $scrollYMaxPercent, $foldYpercent);

        $events = $params[self::TRACKING_PARAM_EVENTS];

        $selectors = array();
        foreach ($events as $index => $event) {
            // DO NOT USE VARIABLE REFERENCE HERE!
            if (isset($event['s'])) {
                $key = md5($event['s']);
                $events[$index]['skey'] = $key;
                $selectors[$key] = array($event['s'], self::ACTION_TYPE_HSR_SELECTOR, null);
            }
        }

        $selectorIds = array();
        if (!empty($selectors)) {
            $selectorIds = Tracker\TableLogAction::loadIdsAction($selectors);
        }

        foreach ($events as $event) {
            $this->recordEvent($idLogHsr, $idSite, $event, $url, $selectorIds);
        }
    }

    private function recordEvent($idLogHsr, $idSite, $event, $url, $selectorIds)
    {
        $event['ty'] = (int) $event['ty'];

        switch ($event['ty']) {
            case self::EVENT_TYPE_STOP_RECORDING:
                // we don't record any event for this, only there to track accurate recording time (time when we stopped recording)
                break;
            case self::EVENT_TYPE_PAGE_TREEMIRROR:
                if (!empty($event['dom'])) {
                    // we need to save the initial DOM for heatmap
                    $clearCache = false;
                    $cachedHsrs = $this->getCachedHsrs($idSite);
                    // we cannot overwrite simply all matching idsitehsr because someone might define a screenshot url and this
                    // url might be different per hsr.
                    foreach ($cachedHsrs as $hsr) {
                        if (empty($hsr['page_treemirror']) && $hsr['idsitehsr'] == $event['id'] && $hsr['record_type'] == SiteHsrDao::RECORD_TYPE_HEATMAP) {
                            $screenshotUrl = $hsr['screenshot_url'];
                            if (empty($hsr['screenshot_url'])) {
                                $screenshotUrl = $url;
                            }

                            if (!empty($screenshotUrl)) {
                                // we need to make sure a url is set
                                $this->siteHsr->setPageTreeMirror($idSite, $hsr['idsitehsr'], $event['dom'], $screenshotUrl);
                                $clearCache = true;
                            }
                        }
                    }
                    if ($clearCache) {
                        // prevent tracking initial dom again
                        Tracker\Cache::deleteCacheWebsiteAttributes($idSite);
                    }
                }

                break;

            case self::EVENT_TYPE_LINK_HSR:
                if (isset($event['id'])) {
                    // we need to link a new idsitehsr to an existing recording
                    $idSiteHsr = (int) $event['id'];

                    if (!empty($idSiteHsr)) {
                        $this->logHsrSite->linkRecord($idLogHsr, $idSiteHsr);
                    }
                }

                break;

            default:
                $idSelector = null;
                if (isset($event['skey']) && isset($selectorIds[$event['skey']])) {
                    $idSelector = $selectorIds[$event['skey']];
                }
                $x = null;
                if (isset($event['x'])) {
                    $x = $event['x'];
                }
                $y = null;
                if (isset($event['y'])) {
                    $y = $event['y'];
                }
                $text = null;
                if (isset($event['te'])) {
                    $text = $event['te'];
                }

                if ($event['ty'] == RequestProcessor::EVENT_TYPE_INITIAL_DOM) {
                    $event['ti'] = 0;// we make sure to force 0 time since load
                }

                $this->logEvent->record($idLogHsr, $event['ti'], $event['ty'], $idSelector, $x, $y, $text);
        }
    }

    // we need to make sure it is only possible to track data into currently active heatmaps, and currently
    // active or ended session recordings. Otherwise other users could track in advance data into any heatmap or recording
    // it is still possible to track data into completed sessions because we want to make sure to include all tracking requests
    // of a session
    private function getValidHsrIds($idSite, $hsrIds)
    {
        $hsrs = $this->getCachedHsrs($idSite);

        $existingIds = array();
        foreach ($hsrs as $hsr) {
            $existingIds[] = $hsr['idsitehsr'];
        }

        $ids = array();
        foreach ($hsrIds as $hsrId) {
            if (in_array($hsrId, $existingIds)) {
                $ids[] = $hsrId;
            } else {
                Common::printDebug(sprintf("Notice! hsrId %d is not active anymore and will be ignored", (int) $hsrId));
            }
        }

        $ids = array_unique($ids);
        return $ids;
    }

    private function getCachedHsrs($idSite)
    {
        $cache = Tracker\Cache::getCacheWebsiteAttributes($idSite);
        if (!empty($cache['hsr'])) {
            return $cache['hsr'];
        }
        return array();
    }
}
