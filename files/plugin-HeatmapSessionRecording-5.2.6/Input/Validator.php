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

namespace Piwik\Plugins\HeatmapSessionRecording\Input;

use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Configuration;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Site;
use Piwik\Plugins\HeatmapSessionRecording\SystemSettings;

class Validator
{
    /**
     * @var Configuration
     */
    private $configuration;

    /**
     * @var SystemSettings
     */
    private $systemSettings;

    public function __construct(SystemSettings $systemSettings)
    {
        $this->configuration = new Configuration();
        $this->systemSettings = $systemSettings;
    }

    private function supportsMethod($method)
    {
        return method_exists('Piwik\Piwik', $method);
    }

    public function checkHasSomeWritePermission()
    {
        Piwik::checkUserHasSomeWriteAccess();
    }

    public function checkWritePermission($idSite)
    {
        $this->checkSiteExists($idSite);
        Piwik::checkUserIsNotAnonymous();
        Piwik::checkUserHasWriteAccess($idSite);
    }

    public function checkHeatmapReportViewPermission($idSite)
    {
        $this->checkSiteExists($idSite);
        Piwik::checkUserHasViewAccess($idSite);
        $this->checkHeatmapRecordingEnabled();
    }

    public function checkSessionReportViewPermission($idSite)
    {
        $this->checkSiteExists($idSite);
        $this->checkUserIsNotAnonymousForView($idSite);
        Piwik::checkUserHasViewAccess($idSite);
        $this->checkSessionRecordingEnabled();
    }

    public function checkSessionReportWritePermission($idSite)
    {
        $this->checkWritePermission($idSite);
        $this->checkSessionRecordingEnabled();
    }

    public function checkHeatmapReportWritePermission($idSite)
    {
        $this->checkWritePermission($idSite);
        $this->checkHeatmapRecordingEnabled();
    }

    public function checkSessionRecordingEnabled()
    {
        if ($this->isSessionRecordingDisabled()) {
            throw new \Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDisabled'));
        }
    }

    public function checkHeatmapRecordingEnabled()
    {
        if ($this->isHeatmapRecordingDisabled()) {
            throw new \Exception(Piwik::translate('HeatmapSessionRecording_ErrorHeatmapRecordingDisabled'));
        }
    }

    /**
     * Check whether the current user is allowed to duplicate to specified sites.
     *
     * @param int[] $idSites
     * @param int $hsrType Optional type indicating the permission check is for Heatmaps (1) or SessionRecordings (2).
     * The default is Heatmaps.
     * @return void
     * @throws \Exception If heatmaps aren't enabled, the user doesn't have write permission, or the site is a rollup
     */
    public function checkSitesDuplicationPermission(array $idSites, int $hsrType = SiteHsrDao::RECORD_TYPE_HEATMAP)
    {
        if ($hsrType === SiteHsrDao::RECORD_TYPE_HEATMAP) {
            $this->checkHeatmapRecordingEnabled();
        } elseif ($hsrType === SiteHsrDao::RECORD_TYPE_SESSION) {
            $this->checkSessionRecordingEnabled();
        } else {
            throw new \Exception('Unsupported HSR Type: ' . $hsrType);
        }

        if (count($idSites) < 1) {
            throw new \Exception(Piwik::translate('General_Required', ['idSites']));
        }

        Piwik::checkUserHasWriteAccess($idSites);
        // Check if any of the specified sites are rollups
        $rollupSiteNames = [];
        foreach ($idSites as $idSite) {
            if (Site::getTypeFor($idSite) === 'rollup') {
                $rollupSiteNames[] = Site::getNameFor($idSite);
            }
        }

        if (count($rollupSiteNames) > 0) {
            throw new \Exception(Piwik::translate(
                'HeatmapSessionRecording_HeatmapDuplicationSiteTypeError',
                ['\'' . implode('\', \'', $rollupSiteNames) . '\'']
            ));
        }
    }

    private function checkUserIsNotAnonymousForView($idSite)
    {
        if ($this->configuration->isAnonymousSessionRecordingAccessEnabled($idSite)) {
            Piwik::checkUserHasViewAccess($idSite);
            return;
        }

        Piwik::checkUserIsNotAnonymous();
    }

    private function checkSiteExists($idSite)
    {
        new Site($idSite);
    }

    public function canViewSessionReport($idSite)
    {
        if (empty($idSite) || $this->isSessionRecordingDisabled()) {
            return false;
        }

        if (
            !$this->configuration->isAnonymousSessionRecordingAccessEnabled($idSite)
            && Piwik::isUserIsAnonymous()
        ) {
            return false;
        }

        return Piwik::isUserHasViewAccess($idSite);
    }

    public function canViewHeatmapReport($idSite)
    {
        if (empty($idSite) || $this->isHeatmapRecordingDisabled()) {
            return false;
        }

        return Piwik::isUserHasViewAccess($idSite);
    }

    public function canWrite($idSite)
    {
        if (empty($idSite)) {
            return false;
        }

        return Piwik::isUserHasWriteAccess($idSite);
    }

    public function isSessionRecordingDisabled()
    {
        return $this->systemSettings->disableSessionRecording->getValue();
    }

    public function isHeatmapRecordingDisabled()
    {
        return $this->systemSettings->disableHeatmapRecording->getValue();
    }
}
