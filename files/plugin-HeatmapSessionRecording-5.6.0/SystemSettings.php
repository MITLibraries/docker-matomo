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

use Piwik\API\Request;
use Piwik\Container\StaticContainer;
use Piwik\Exception\DI\NotFoundException;
use Piwik\Intl\Data\Provider\RegionDataProvider;
use Piwik\Piwik;
use Piwik\Plugin;
use Piwik\Plugins\CustomJsTracker\TrackerUpdater;
use Piwik\Plugins\FeatureFlags\FeatureFlagManager;
use Piwik\Plugins\HeatmapSessionRecording\Input\Breakpoint;
use Piwik\Plugins\HeatmapSessionRecording\Settings\DisableHeatmapRecording;
use Piwik\Plugins\HeatmapSessionRecording\Settings\DisableSessionRecording;
use Piwik\Plugins\HeatmapSessionRecording\Settings\TrackingDisableDefault;
use Piwik\Plugins\SitesManager\API as SitesManagerAPI;
use Piwik\Settings\Setting;
use Piwik\Settings\FieldConfig;
use Piwik\Site;
use Piwik\Tracker\Cache;

class SystemSettings extends \Piwik\Settings\Plugin\SystemSettings
{
    /** @var Setting */
    public $breakpointTablet;

    /** @var Setting */
    public $breakpointMobile;

    /** @var TrackingDisableDefault */
    public $disableTrackingByDefault;

    /** @var TrackingDisableDefault */
    public $disableSessionRecording;

    /** @var TrackingDisableDefault */
    public $disableHeatmapRecording;

    /** @var Setting */
    public $includeCountries;

    protected function init()
    {
        $this->breakpointMobile = $this->createBreakpointMobileSetting();
        $this->breakpointTablet = $this->createBreakpointTabletSetting();
        $this->disableTrackingByDefault = $this->createDisableTrackingByDefaultSetting();
        $this->disableSessionRecording = $this->createDisableSessionRecordingSetting();
        $this->disableHeatmapRecording = $this->createDisableHeatmapRecordingSetting();
        $this->includeCountries = $this->createIncludeCountriesSetting();

        if (Plugin\Manager::getInstance()->isPluginActivated('CustomJsTracker')) {
            $trackerUpdater = StaticContainer::get(TrackerUpdater::class);
            if (!$trackerUpdater || !$trackerUpdater->getToFile() || !$trackerUpdater->getToFile()->hasWriteAccess()) {
                // only works if matomo file can be updated
                $this->disableTrackingByDefault->setIsWritableByCurrentUser(false);
            }
        } else {
            $this->disableTrackingByDefault->setIsWritableByCurrentUser(false);
        }
    }

    private function createDisableTrackingByDefaultSetting()
    {
        $setting = new TrackingDisableDefault('trackingDisabledDefault', false, FieldConfig::TYPE_BOOL, $this->pluginName);
        $setting->setConfigureCallback(function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_TrackingDisabledDefaultSettingTitle');
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->description = Piwik::translate('HeatmapSessionRecording_TrackingDisabledDefaultSettingDescription');
        });
        $this->addSetting($setting);
        return $setting;
    }

    private function createBreakpointMobileSetting()
    {
        return $this->makeSetting('breakpointMobile', Breakpoint::DEFAULT_MOBILE, FieldConfig::TYPE_INT, function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_BreakpointX', Piwik::translate('General_Mobile'));
            $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
            $field->description = Piwik::translate('HeatmapSessionRecording_BreakpointGeneralHelp');
            $field->validate = function ($value) {
                $breakpoint = new Breakpoint($value, Piwik::translate('General_Mobile'));
                $breakpoint->check();
            };
        });
    }

    private function createBreakpointTabletSetting()
    {
        return $this->makeSetting('breakpointTablet', Breakpoint::DEFAULT_TABLET, FieldConfig::TYPE_INT, function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_BreakpointX', Piwik::translate('DevicesDetection_Tablet'));
            $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
            $field->description = Piwik::translate('HeatmapSessionRecording_BreakpointGeneralHelp');
            $field->validate = function ($value) {
                $breakpoint = new Breakpoint($value, Piwik::translate('DevicesDetection_Tablet'));
                $breakpoint->check();
            };
        });
    }

    private function createDisableSessionRecordingSetting()
    {
        $setting = new TrackingDisableDefault('disableSessionRecording', false, FieldConfig::TYPE_BOOL, $this->pluginName);
        $setting->setConfigureCallback(function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_DisableSessionRecordingTitle', Piwik::translate('General_Mobile'));
            $field->description = Piwik::translate('HeatmapSessionRecording_DisableSessionRecordingDescription');
            $field->inlineHelp = Piwik::translate('HeatmapSessionRecording_DisableSessionRecordingInlineHelp', array('<strong>','</strong>'));
        });
        $this->addSetting($setting);

        return $setting;
    }

    private function createDisableHeatmapRecordingSetting()
    {
        $setting = new TrackingDisableDefault('disableHeatmapRecording', false, FieldConfig::TYPE_BOOL, $this->pluginName);
        $setting->setConfigureCallback(function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_DisableHeatmapRecordingTitle', Piwik::translate('General_Mobile'));
            $field->description = Piwik::translate('HeatmapSessionRecording_DisableHeatmapRecordingDescription');
            $field->inlineHelp = Piwik::translate('HeatmapSessionRecording_DisableHeatmapRecordingInlineHelp', array('<strong>','</strong>'));
        });
        $this->addSetting($setting);

        return $setting;
    }

    public function createIncludeCountriesSetting()
    {
        return $this->makeSetting('included_countries', [], FieldConfig::TYPE_ARRAY, function (FieldConfig $field) {
            $field->title = Piwik::translate('HeatmapSessionRecording_EnableIncludeCountriesTitle');
            $field->description = Piwik::translate('HeatmapSessionRecording_EnableIncludeCountriesDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_MULTI_TUPLE;
            $field1 = new FieldConfig\MultiPair(Piwik::translate('HeatmapSessionRecording_Country'), 'country', FieldConfig::UI_CONTROL_SINGLE_SELECT);
            $field1->availableValues = $this->getAvailableCountries();
            $field->uiControlAttributes['field1'] = $field1->toArray();

            $self = $this;
            $field->transform = function ($value) use ($self) {
                return $self->transformCountryList($value);
            };
            $field->validate = function ($value) use ($field1) {
                foreach ($value as $country) {
                    if (empty($country['country'])) {
                        continue;
                    }
                    if ($country['country'] === 'xx') {
                        continue; // valid,  country not detected
                    }
                    if (!isset($field1->availableValues[$country['country']])) {
                        throw new \Exception('Invalid country code');
                    }
                }
            };
        });
    }

    public function transformCountryList($value)
    {
        if (!empty($value) && is_array($value)) {
            $newVal = [];
            foreach ($value as $index => $val) {
                if (empty($val['country'])) {
                    continue;
                }
                $newVal[] = ['country' => $val['country']];
            }
            return $newVal;
        }
        return $value;
    }

    public function save()
    {
        $this->endSessionRecordings();
        $this->endHeatmapRecordings();
        parent::save();

        if (!empty($this->disableTrackingByDefault)) {
            $oldValue = $this->disableTrackingByDefault->getOldValue();
            $newValue = $this->disableTrackingByDefault->getValue();
            if ($oldValue != $newValue) {
                $plugin = Plugin\Manager::getInstance()->getLoadedPlugin($this->pluginName);
                if (!empty($plugin) && $plugin instanceof HeatmapSessionRecording) {
                    $plugin->updatePiwikTracker();
                }
            }
        }
    }

    public function getIncludedCountries($applyTransformation = true)
    {
        $includedCountries = $this->includeCountries->getValue();
        $transformedList = [];

        if (!empty($includedCountries)) {
            foreach ($includedCountries as $value) {
                $transformedList[] = $value['country'];
            }
        }

        if (!empty($transformedList) && $applyTransformation) {
            $transformedList = $this->getAvailableCountries($transformedList);
        }

        return $transformedList;
    }

    private function getAvailableCountries($countryCodesToFilter = [])
    {
        $regionDataProvider = StaticContainer::get(RegionDataProvider::class);
        $countryList = $regionDataProvider->getCountryList();
        array_walk($countryList, function (&$item, $key) {
            $item = Piwik::translate('Intl_Country_' . strtoupper($key));
        });
        asort($countryList); //order by localized name

        if (!empty($countryCodesToFilter)) {
            $filteredList = [];
            foreach ($countryList as $countryCode => $countryName) {
                if (in_array($countryCode, $countryCodesToFilter)) {
                    $filteredList[$countryCode] = $countryName;
                }
            }

            return $filteredList;
        }

        return $countryList;
    }

    private function endSessionRecordings()
    {
        $settingValue = $this->disableSessionRecording->getValue();
        try {
            $featureFlagManager = StaticContainer::get(FeatureFlagManager::class);
            if ($featureFlagManager->isFeatureActive('Piwik\Plugins\PrivacyManager\FeatureFlags\PrivacyCompliance')) {
                $settingValue = DisableSessionRecording::getInstance()->getValue();
            }
        } catch (NotFoundException $e) {
            /*
                if the feature flag manager cannot be loaded,
                just move on to backup/original setting
                value retrieval
             */
        }
        if (
            !empty($settingValue) &&
            $this->disableSessionRecording->getOldValue() != $settingValue
        ) {
            $sites = SitesManagerAPI::getInstance()->getAllSitesId();
            $this->disableSessionRecording->setValue(false); //added this to fetch results, else it throws an exception
            foreach ($sites as $idSite) {
                if (Site::getTypeFor($idSite) === 'proxysite') {
                    continue; //do not delete session recording for proxySite as it will throw an exception due to read only behaviour
                }
                $recordings = Request::processRequest('HeatmapSessionRecording.getSessionRecordings', [
                    'idSite' => $idSite, 'filter_limit' => -1
                ]);
                foreach ($recordings as $recording) {
                    Request::processRequest('HeatmapSessionRecording.deleteSessionRecording', [
                        'idSite' => $idSite,
                        'idSiteHsr' => $recording['idsitehsr']
                    ]);
                }
            }

            $this->disableSessionRecording->setValue(true);
            Cache::deleteTrackerCache();
        }
    }

    private function endHeatmapRecordings()
    {
        $settingValue = $this->disableHeatmapRecording->getValue();
        try {
            $featureFlagManager = StaticContainer::get(FeatureFlagManager::class);
            if ($featureFlagManager->isFeatureActive('Piwik\Plugins\PrivacyManager\FeatureFlags\PrivacyCompliance')) {
                $settingValue = DisableHeatmapRecording::getInstance()->getValue();
            }
        } catch (NotFoundException $e) {
            /*
                if the feature flag manager cannot be loaded,
                just move on to backup/original setting
                value retrieval
             */
        }
        if (
            !empty($settingValue) &&
            $this->disableHeatmapRecording->getOldValue() != $settingValue
        ) {
            $sites = SitesManagerAPI::getInstance()->getAllSitesId();
            $this->disableHeatmapRecording->setValue(false); //added this to fetch results, else it throws an exception
            foreach ($sites as $idSite) {
                if (Site::getTypeFor($idSite) === 'proxysite') {
                    continue; //do not delete heatmap for proxySite as it will throw an exception due to read only behaviour
                }
                $recordings = Request::processRequest('HeatmapSessionRecording.getHeatmaps', [
                    'idSite' => $idSite, 'filter_limit' => -1
                ]);
                foreach ($recordings as $recording) {
                    Request::processRequest('HeatmapSessionRecording.deleteHeatmap', [
                        'idSite' => $idSite,
                        'idSiteHsr' => $recording['idsitehsr']
                    ]);
                }
            }

            $this->disableHeatmapRecording->setValue(true);
            Cache::deleteTrackerCache();
        }
    }
}
