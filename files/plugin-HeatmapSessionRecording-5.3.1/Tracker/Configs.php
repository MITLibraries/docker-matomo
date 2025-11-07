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

use Exception;
use Piwik\Exception\NotYetInstalledException;
use Piwik\Tracker;

class Validator
{
    public function validate()
    {
    }
}

class Configs
{
    private $hasLoadedTrackerEnvironment = false;

    public function init()
    {
        // we do not want it to be validate, saves 25-50ms or up to 50% of whole request
        $validator = new Validator();

        $environment = new \Piwik\Application\Environment('tracker', array(
            'Piwik\Application\Kernel\EnvironmentValidator' => $validator
        ));
        try {
            $environment->init();
        } catch (NotYetInstalledException $e) {
            http_response_code(403);
            exit;
        } catch (Exception $e) {
            if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
                // the validator is disabled for performance so we would not detect a not installed matomo
                http_response_code(403);
                exit;
            }
            throw $e;
        }
    }

    public function sendResponse($response, $originalIdSite, $trackerId)
    {
        $response['idsite'] = $originalIdSite;
        $response['trackerid'] = $trackerId;
        header('Content-Type: application/javascript');
        echo 'Piwik.HeatmapSessionRecording.configuration.assign(' . json_encode($response) . ');';
    }

    public function loadTrackerEnvironment()
    {
        if (!$this->hasLoadedTrackerEnvironment) {
            $this->hasLoadedTrackerEnvironment = true;
            try {
                Tracker::loadTrackerEnvironment();
                $GLOBALS['PIWIK_TRACKER_DEBUG'] = false;
            } catch (Exception $e) {
                $GLOBALS['PIWIK_TRACKER_DEBUG'] = false;
                if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
                    // the validator is disabled for performance so we would not detect a not installed matomo
                    http_response_code(403);
                    exit;
                }
                throw $e;
            }
        }
    }

    private function isNumber($value)
    {
        return preg_match('/^\d+$/', (string) $value);
    }

    public function getIdSite($idSite)
    {
        if (is_string($idSite) && !$this->isNumber($idSite)) {
            $this->loadTrackerEnvironment();

            /**
             * Triggered when obtaining the ID of the site we are tracking a visit for.
             *
             * This event can be used to change the site ID so data is tracked for a different
             * website.
             *
             * @param int &$idSite Initialized to the value of the **idsite** query parameter. If a
             *                     subscriber sets this variable, the value it uses must be greater
             *                     than 0.
             * @param array $params The entire array of request parameters in the current tracking
             *                      request.
             */
            \Piwik\Piwik::postEvent('Tracker.Request.getIdSite', array(&$idSite, array_merge($_GET, $_POST)));

            if (!$this->isNumber($idSite)) {
                // the string idsite was not converted to an integer / number...
                // we do not cast to int as it could result in using the wrong idsite when eg string is '5Tk3k' => could result
                // in idsite=5 which may not be the correct idsite
                http_response_code(400);
                exit;
            }
        }

        $idSite = (int) abs($idSite);
        return $idSite;
    }

    public function getCachedWebsiteAttributes($idSite)
    {
        try {
            $cache = Tracker\Cache::getCacheWebsiteAttributes($idSite);
        } catch (\Piwik\Exception\UnexpectedWebsiteFoundException $exception) {
            http_response_code(400);
            exit;
        } catch (Exception $e) {
            if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
                // the validator is disabled for performance so we would not detect a not installed matomo
                http_response_code(403);
                exit;
            }
            throw $e;
        }

        if (empty($cache)) {
            ob_start();
            // this is a performance improvement to bootstrap the plugins only if the cache does not exist right now
            $this->loadTrackerEnvironment();

            try {
                $cache = Tracker\Cache::getCacheWebsiteAttributes($idSite);
            } catch (\Piwik\Exception\UnexpectedWebsiteFoundException $exception) {
                http_response_code(400);
                exit;
            } catch (Exception $e) {
                if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
                    // the validator is disabled for performance so we would not detect a not installed matomo
                    http_response_code(403);
                    exit;
                }
                throw $e;
            }
            ob_end_clean();
        }

        return $cache;
    }
}
