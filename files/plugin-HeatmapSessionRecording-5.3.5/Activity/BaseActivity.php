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

namespace Piwik\Plugins\HeatmapSessionRecording\Activity;

use Piwik\Container\StaticContainer;
use Piwik\Piwik;
use Piwik\Plugins\ActivityLog\Activity\Activity;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Site;

abstract class BaseActivity extends Activity
{
    protected function getHsrNameFromActivityData($activityData)
    {
        if (!empty($activityData['hsr']['name'])) {
            return $activityData['hsr']['name'];
        }

        if (!empty($activityData['hsr']['id'])) {
            return $activityData['hsr']['id'];
        }

        return '';
    }

    protected function getSiteNameFromActivityData($activityData)
    {
        if (!empty($activityData['site']['site_name'])) {
            return $activityData['site']['site_name'];
        }

        if (!empty($activityData['site']['site_id'])) {
            return $activityData['site']['site_id'];
        }

        return '';
    }

    protected function formatActivityData($idSiteHsr, $idSite)
    {
        if (!is_numeric($idSite) || !is_numeric($idSiteHsr)) {
            return;
        }

        return array(
            'site' => $this->getSiteData($idSite),
            'version' => 'v1',
            'hsr' => $this->getHsrData($idSiteHsr, $idSite),
        );
    }

    private function getSiteData($idSite)
    {
        return array(
            'site_id'   => $idSite,
            'site_name' => Site::getNameFor($idSite)
        );
    }

    private function getHsrData($idSiteHsr, $idSite)
    {
        $dao = $this->getDao();
        $hsr = $dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_HEATMAP);
        if (empty($hsr)) {
            // maybe it is a session? we could make this faster by adding a new method to DAO that returns hsr independent of type
            $hsr = $dao->getRecord($idSite, $idSiteHsr, SiteHsrDao::RECORD_TYPE_SESSION);
        }

        $hsrName = '';
        if (!empty($hsr['name'])) {
            // hsr name might not be set when we are handling deleteExperiment activity
            $hsrName = $hsr['name'];
        }

        return array(
            'id' => $idSiteHsr,
            'name' => $hsrName
        );
    }

    public function getPerformingUser($eventData = null)
    {
        $login = Piwik::getCurrentUserLogin();

        if ($login === self::USER_ANONYMOUS || empty($login)) {
            // anonymous cannot change an experiment, in this case the system changed it, eg during tracking it started
            // an experiment
            return self::USER_SYSTEM;
        }

        return $login;
    }

    private function getDao()
    {
        // we do not get it via DI as it would slow down creation of all activities on all requests. Instead only
        // create instance when needed
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao');
    }
}
