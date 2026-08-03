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

use Piwik\Exception\DI\NotFoundException;
use Piwik\Config;
use Piwik\Container\StaticContainer;

class Configuration
{
    public const DEFAULT_OPTIMIZE_TRACKING_CODE = 1;
    public const DEFAULT_SESSION_RECORDING_SAMPLE_LIMITS = '50,100,250,500,1000,2000,5000';
    public const DEFAULT_ENABLE_LOAD_CSS_FROM_DB = 1;
    public const DEFAULT_ENABLE_ANONYMOUS_SESSION_RECORDING_ACCESS = '';
    public const KEY_OPTIMIZE_TRACKING_CODE = 'add_tracking_code_only_when_needed';
    public const KEY_SESSION_RECORDING_SAMPLE_LIMITS = 'session_recording_sample_limits';
    public const KEY_ENABLE_ANONYMOUS_SESSION_RECORDING_ACCESS = 'session_recording_enable_anonymous_access';
    public const KEY_ENABLE_LOAD_CSS_FROM_DB = 'load_css_from_db';
    public const MAX_ALLOWED_TIME_ON_PAGE_COLUMN_LIMIT = 'max_time_allowed_on_page_column_limit';
    public const KEY_DEFAULT_HEATMAP_WIDTH = 'default_heatmap_width';
    public const DEFAULT_HEATMAP_WIDTH = 1920;
    public const HEATMAP_ALLOWED_WIDTHS = [320, 360, 480, 600, 640, 900, 960, 1024, 1200, 1280, 1366, 1440, 1600, 1680, 1920, 2560];

    public function install()
    {
        $config = $this->getConfig();
        $config->HeatmapSessionRecording = array(
            self::KEY_OPTIMIZE_TRACKING_CODE => self::DEFAULT_OPTIMIZE_TRACKING_CODE,
            self::KEY_SESSION_RECORDING_SAMPLE_LIMITS => self::DEFAULT_SESSION_RECORDING_SAMPLE_LIMITS,
            self::KEY_ENABLE_LOAD_CSS_FROM_DB => self::DEFAULT_ENABLE_LOAD_CSS_FROM_DB,
            self::MAX_ALLOWED_TIME_ON_PAGE_COLUMN_LIMIT => pow(2, 63),
            self::KEY_DEFAULT_HEATMAP_WIDTH => self::DEFAULT_HEATMAP_WIDTH

        );
        $config->forceSave();
    }

    public function uninstall()
    {
        $config = $this->getConfig();
        $config->HeatmapSessionRecording = array();
        $config->forceSave();
    }

    public function shouldOptimizeTrackingCode()
    {
        $value = $this->getConfigValue(self::KEY_OPTIMIZE_TRACKING_CODE, self::DEFAULT_OPTIMIZE_TRACKING_CODE);

        return !empty($value);
    }

    public function isAnonymousSessionRecordingAccessEnabled($idSite)
    {
        $value = $this->getDiValue(self::KEY_ENABLE_ANONYMOUS_SESSION_RECORDING_ACCESS, self::DEFAULT_ENABLE_ANONYMOUS_SESSION_RECORDING_ACCESS);
        $idSites = explode(',', $value);
        $idSites = array_map('trim', $idSites);
        $idSites = array_filter($idSites);
        return in_array($idSite, $idSites);
    }

    public function getSessionRecordingSampleLimits()
    {
        $value = $this->getConfigValue(self::KEY_SESSION_RECORDING_SAMPLE_LIMITS, self::DEFAULT_SESSION_RECORDING_SAMPLE_LIMITS);

        if (empty($value)) {
            $value = self::DEFAULT_SESSION_RECORDING_SAMPLE_LIMITS;
        }

        $value = explode(',', $value);
        $value = array_filter($value, function ($val) {
            return !empty($val);
        });
        $value = array_map(function ($val) {
            return intval(trim($val));
        }, $value);
        natsort($value);

        if (empty($value)) {
            // just a fallback in case config is completely misconfigured
            $value = explode(',', self::DEFAULT_SESSION_RECORDING_SAMPLE_LIMITS);
        }

        return array_values($value);
    }

    public function isLoadCSSFromDBEnabled()
    {
        return $this->getConfigValue(self::KEY_ENABLE_LOAD_CSS_FROM_DB, self::DEFAULT_ENABLE_LOAD_CSS_FROM_DB);
    }

    public function getMaximumAllowedPageTime()
    {
        return $this->getConfigValue(self::MAX_ALLOWED_TIME_ON_PAGE_COLUMN_LIMIT, '');
    }

    public function getDefaultHeatmapWidth()
    {
        $width = $this->getConfigValue(self::KEY_DEFAULT_HEATMAP_WIDTH, 1280);
        if (!in_array($width, self::HEATMAP_ALLOWED_WIDTHS)) {
            $width = self::DEFAULT_HEATMAP_WIDTH;
        }

        return $width;
    }

    private function getConfig()
    {
        return Config::getInstance();
    }

    private function getConfigValue($name, $default)
    {
        $config = $this->getConfig();
        $values = $config->HeatmapSessionRecording;
        if (isset($values[$name])) {
            return $values[$name];
        }
        return $default;
    }

    private function getDiValue($name, $default)
    {
        $value = $default;
        try {
            $value = StaticContainer::get('HeatmapSessionRecording.' . $name);
        } catch (NotFoundException $ex) {
            // ignore
        }
        return $value;
    }
}
