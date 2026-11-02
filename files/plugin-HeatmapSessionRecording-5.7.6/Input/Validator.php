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
use Piwik\Plugins\HeatmapSessionRecording\RecordingPurge;
use Piwik\Plugins\HeatmapSessionRecording\Settings\DisableSessionRecording;
use Piwik\Plugins\HeatmapSessionRecording\Settings\DisableHeatmapRecording;
use Piwik\Site;
use Piwik\Plugins\HeatmapSessionRecording\SystemSettings;
use Piwik\Container\StaticContainer;
use Piwik\Exception\DI\NotFoundException;
use Piwik\Plugins\FeatureFlags\FeatureFlagManager;

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
        $this->checkHeatmapRecordingEnabled($idSite);
    }

    public function checkSessionReportViewPermission($idSite)
    {
        $this->checkSiteExists($idSite);
        $this->checkUserIsNotAnonymousForView($idSite);
        Piwik::checkUserHasViewAccess($idSite);
        $this->checkSessionRecordingEnabled($idSite);
    }

    public function checkSessionReportWritePermission($idSite)
    {
        $this->checkWritePermission($idSite);
        $this->checkSessionRecordingEnabled($idSite);
    }

    public function checkHeatmapReportWritePermission($idSite)
    {
        $this->checkWritePermission($idSite);
        $this->checkHeatmapRecordingEnabled($idSite);
    }

    public function checkSessionRecordingEnabled(?int $idSite = null)
    {
        if ($this->isSessionRecordingDisabled($idSite)) {
            throw $this->buildRecordingDisabledException(DisableSessionRecording::class, [
                'generic' => 'HeatmapSessionRecording_ErrorSessionRecordingDisabled',
                'policy' => 'HeatmapSessionRecording_ErrorSessionRecordingDisabledByPolicy',
            ], $idSite);
        }
    }

    public function checkHeatmapRecordingEnabled(?int $idSite = null)
    {
        if ($this->isHeatmapRecordingDisabled($idSite)) {
            throw $this->buildRecordingDisabledException(DisableHeatmapRecording::class, [
                'generic' => 'HeatmapSessionRecording_ErrorHeatmapRecordingDisabled',
                'policy' => 'HeatmapSessionRecording_ErrorHeatmapRecordingDisabledByPolicy',
            ], $idSite);
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
            foreach ($idSites as $idSite) {
                $this->checkHeatmapRecordingEnabled($idSite);
            }
        } elseif ($hsrType === SiteHsrDao::RECORD_TYPE_SESSION) {
            foreach ($idSites as $idSite) {
                $this->checkSessionRecordingEnabled($idSite);
            }
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

    public function canViewSessionReport(int $idSite)
    {
        if (empty($idSite) || $this->isSessionRecordingDisabled($idSite)) {
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

    public function canViewHeatmapReport(int $idSite)
    {
        if (empty($idSite) || $this->isHeatmapRecordingDisabled($idSite)) {
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

    public function isSessionRecordingDisabled(?int $idSite = null)
    {
        if (RecordingPurge::isActiveFor(SiteHsrDao::RECORD_TYPE_SESSION)) {
            // the settings save is removing the existing recordings because recording them
            // was just disabled, so it has to be able to read and delete them one last time
            return false;
        }

        try {
            $featureFlagManager = StaticContainer::get(FeatureFlagManager::class);
            if ($featureFlagManager->isFeatureActive('Piwik\Plugins\PrivacyManager\FeatureFlags\PrivacyCompliance')) {
                return DisableSessionRecording::getInstance($idSite)->getValue();
            }
        } catch (NotFoundException $e) {
            /*
                if the feature flag manager cannot be loaded,
                just move on to backup/original setting
                value retrieval
             */
        }
        return $this->systemSettings->disableSessionRecording->getValue();
    }

    public function isHeatmapRecordingDisabled(?int $idSite = null)
    {
        if (RecordingPurge::isActiveFor(SiteHsrDao::RECORD_TYPE_HEATMAP)) {
            // the settings save is removing the existing heatmaps because recording them was
            // just disabled, so it has to be able to read and delete them one last time
            return false;
        }

        try {
            $featureFlagManager = StaticContainer::get(FeatureFlagManager::class);
            if ($featureFlagManager->isFeatureActive('Piwik\Plugins\PrivacyManager\FeatureFlags\PrivacyCompliance')) {
                return DisableHeatmapRecording::getInstance($idSite)->getValue();
            }
        } catch (NotFoundException $e) {
            /*
                if the feature flag manager cannot be loaded,
                just move on to backup/original setting
                value retrieval
             */
        }
        return $this->systemSettings->disableHeatmapRecording->getValue();
    }

    /**
     * Says why recording is off: the plugin's own setting, or a policy enforced for this
     * website. isXRecordingDisabled() collapses the two into one boolean, so the cause has
     * to be resolved again here.
     *
     * @param class-string $settingClass
     * @param array{generic: string, policy: string} $keys
     */
    private function buildRecordingDisabledException(string $settingClass, array $keys, ?int $idSite): \Exception
    {
        // on Matomo versions without the policy interfaces the setting is aliased to its
        // no-interfaces fallback, which has neither method - there is no policy to name,
        // and calling them would be a fatal error
        if (
            !method_exists($settingClass, 'getSystemValue')
            || !method_exists($settingClass, 'isEnforced')
        ) {
            return new \Exception(Piwik::translate($keys['generic']));
        }

        // the general setting turns recording off on its own, so it is the whole reason
        // whenever it is on - blaming the policy there would send someone to stop enforcing
        // it, which weakens compliance and still leaves recording off
        if ($settingClass::getSystemValue() || !$settingClass::isEnforced($idSite)) {
            return new \Exception(Piwik::translate($keys['generic']));
        }

        return new \Exception(Piwik::translate($keys['policy']));
    }

    /**
     * Says whether a compliance policy, rather than the plugin's own general setting, is what
     * turns session recording off for this website. The reporting page shows a notice for that
     * case instead of refusing, since there is no setting the user can go and change.
     */
    public function isSessionRecordingDisabledByPolicy(?int $idSite = null): bool
    {
        return $this->isSessionRecordingDisabled($idSite)
            && $this->isRecordingDisabledByPolicy(DisableSessionRecording::class, $idSite);
    }

    public function isHeatmapRecordingDisabledByPolicy(?int $idSite = null): bool
    {
        return $this->isHeatmapRecordingDisabled($idSite)
            && $this->isRecordingDisabledByPolicy(DisableHeatmapRecording::class, $idSite);
    }

    /**
     * @param class-string $settingClass
     */
    private function isRecordingDisabledByPolicy(string $settingClass, ?int $idSite): bool
    {
        // on Matomo versions without the policy interfaces the setting is aliased to its
        // no-interfaces fallback, which has neither method - no policy can be enforced
        // there, and calling them would be a fatal error
        if (
            !method_exists($settingClass, 'getSystemValue')
            || !method_exists($settingClass, 'isEnforced')
        ) {
            return false;
        }

        // only ever asked once isXRecordingDisabled() is true, so this just resolves the cause
        // the way buildRecordingDisabledException() does: the general setting turns recording
        // off on its own, so a policy is only the cause while that setting is off
        return !$settingClass::getSystemValue() && $settingClass::isEnforced($idSite);
    }
}
