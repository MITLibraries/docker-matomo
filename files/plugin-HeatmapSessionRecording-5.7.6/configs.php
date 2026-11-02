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

use Piwik\Container\StaticContainer;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\HsrMatcher;
use Piwik\Plugins\HeatmapSessionRecording\SystemSettings;

/**
 * USAGE: Append a query string ?idsite=$idSite&trackerid=$id eg
 * http://demo.matomo.org/plugins/HeatmapSessionRecording/configs.php?idsite=35&trackerid=123456
 */
if (
    empty($_GET['idsite'])
    || empty($_GET['trackerid'])
    || empty($_GET['url'])
    || !preg_match('/^[a-z0-9A-Z]{6}$/', (string) $_GET['trackerid'])
    || !ctype_alnum((string) $_GET['trackerid'])
) {
    http_response_code(400);
    exit;
}

if (!defined('PIWIK_INCLUDE_PATH')) {
    $path = realpath('../..');
    $coreBootstrapExists = file_exists($path . '/core/bootstrap.php');

    if (!$coreBootstrapExists && file_exists('../matomo/app/core/bootstrap.php')) {
        // wordpress ... note: this might not work if eg matomo is network activated in mu-plugins
        // and the other one isn't or the other way around
        $path = realpath('../matomo/app');
    } elseif (!$coreBootstrapExists && isset($_SERVER['SCRIPT_FILENAME'])) {
        // eg when plugins is a symlink
        $scriptPath = dirname(dirname(dirname($_SERVER['SCRIPT_FILENAME'])));
        if (file_exists($scriptPath . '/core/bootstrap.php')) {
            $path = $scriptPath;
        }
    }

    define('PIWIK_INCLUDE_PATH', $path);
}

define('PIWIK_DOCUMENT_ROOT', PIWIK_INCLUDE_PATH);
define('PIWIK_ENABLE_DISPATCH', false);
define('PIWIK_ENABLE_ERROR_HANDLER', false);
define('PIWIK_ENABLE_SESSION_START', false);
define('PIWIK_DISPLAY_ERRORS', 0);
$GLOBALS['PIWIK_TRACKER_DEBUG'] = false;

if (file_exists(PIWIK_DOCUMENT_ROOT . '/bootstrap.php')) {
    require_once PIWIK_DOCUMENT_ROOT . '/bootstrap.php';
}

if (!defined('PIWIK_USER_PATH')) {
    define('PIWIK_USER_PATH', PIWIK_INCLUDE_PATH);
}

// we do not load index.php as it would register safeMode!
require_once PIWIK_INCLUDE_PATH . '/core/bootstrap.php';

// Set the request as a tracker request to skip certain actions, which is not necessary for a config request
\Piwik\SettingsServer::setIsTrackerApiRequest();

$configs = new \Piwik\Plugins\HeatmapSessionRecording\Tracker\Configs();
$configs->init();

$originalIdSite = $_GET['idsite'];
$trackerId = (string) $_GET['trackerid'];
$url = (string) $_GET['url'];

$idSite = $configs->getIdSite($originalIdSite);

if ($idSite <= 0) {
    http_response_code(400);
    exit;
}

$trackerConfig = array(
    'heatmaps' => array(), // for getdom we later need to check if a screenhot url is configured array('enabled' => false, 'getdom' => [])
    'sessions' => array(), //  array('enabled' => false)
);

$cache = $configs->getCachedWebsiteAttributes($idSite);

if (empty($cache['hsr'])) {
    $configs->sendResponse($trackerConfig, $originalIdSite, $trackerId);
    exit;
}

$systemSettings = StaticContainer::get(SystemSettings::class);
$includedCountries = $systemSettings->getIncludedCountries(false);
$isIncludedCountry = true;
if (!empty($includedCountries)) {
    $configs->loadTrackerEnvironment();
    $isIncludedCountry = HsrMatcher::isIncludedCountry($includedCountries);
}

foreach ($cache['hsr'] as $hsr) {
    $sessionGroup = HsrMatcher::isUserPartOfSampleGroup($hsr['record_type'], $hsr['idsitehsr']);

    if ($sessionGroup === HsrMatcher::SAMPLE_GROUP_NOT_PART) {
        // user is not part of sample group
        continue;
    }

    $shouldForceBeIncluded = $sessionGroup === HsrMatcher::SAMPLE_GROUP_IS_PART;
    // For sessions we need to record all pages, even if page rules does not match as soon as the session is being recorded. That is
    // as soon as the visitor has visited at least one page that matches the page rules

    if (
        (
            $shouldForceBeIncluded ||
            (
                HsrMatcher::matchesAllPageRules($hsr['match_page_rules'], $url) &&
                HsrMatcher::checkIsNotEnded($hsr)
            )
        ) &&
        $isIncludedCountry
    ) {
        // by returning the hsrid IDs here we can make sure to record all updates for this user
        // also it makes request processor faster since we won't have to match the records there again
        // it also prevents starting to track only partial data after a heatmap or session was created while a different
        // session or heatmap is already being recorded
        // it will also make the JS tracker easier since user will be able to configure manually which ids to track
        // also because the sample rate is based on random number generation we cannot check sample rate and whether a user
        // is in the group or not on each tracking request. We would need to send a cookie

        if ($hsr['record_type'] == \Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao::RECORD_TYPE_SESSION) {
            $trackerConfig['sessions'][] = array(
                'id' => $hsr['idsitehsr'],
                'sample_rate' => $hsr['sample_rate'],
                'min_time' => $hsr['min_session_time'],
                'activity' => $hsr['requires_activity'],
                'keystrokes' => $hsr['capture_keystrokes'],
            );
        } elseif ($hsr['record_type'] == \Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao::RECORD_TYPE_HEATMAP) {
                $heatmap = array('id' => $hsr['idsitehsr'], 'getdom' => false, 'sample_rate' => $hsr['sample_rate'], 'capture_manually' => $hsr['capture_manually']);

            if (
                empty($hsr['page_treemirror']) &&
                empty($hsr['capture_manually']) &&
                \Piwik\Plugins\HeatmapSessionRecording\Tracker\HsrMatcher::doesScreenshotUrlMatch($hsr['screenshot_url'], $url)
            ) {
                $heatmap['getdom'] = true;
            }

            $trackerConfig['heatmaps'][] = $heatmap;
        }
    }
}

$configs->sendResponse($trackerConfig, $originalIdSite, $trackerId);
