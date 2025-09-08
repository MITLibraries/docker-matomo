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

namespace Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics;

use Piwik\DataTable\Filter\SafeDecodeLabel;
use Piwik\DataTable\Row;
use Piwik\Metrics\Formatter;
use Piwik\Piwik;
use Piwik\Tracker\Visit;

require_once PIWIK_DOCUMENT_ROOT . '/plugins/UserCountry/functions.php';
require_once  PIWIK_DOCUMENT_ROOT . '/core/Twig.php';

class Location extends BaseMetric
{
    public function getName()
    {
        return 'location';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('UserCountry_Location');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnLocationDocumentation');
    }

    public function compute(Row $row)
    {
        return array(
            'country' => $this->getMetric($row, 'location_country'),
            'region' => $this->getMetric($row, 'location_region'),
            'city' => $this->getMetric($row, 'location_city'),
        );
    }

    public function getDependentMetrics()
    {
        return array(
            'location_country',
            'location_region',
            'location_city'
        );
    }

    public function showsHtml()
    {
        return true;
    }

    public function format($value, Formatter $formatter)
    {
        if (empty($value['country']) || $value['country'] === Visit::UNKNOWN_CODE) {
            return false;
        }

        $title = \Piwik\Plugins\UserCountry\countryTranslate($value['country']);

        if (!empty($value['region']) && $value['region'] !== Visit::UNKNOWN_CODE) {
            $title .= ', ' . \Piwik\Plugins\UserCountry\getRegionNameFromCodes($value['country'], $value['region']);
        }

        if (!empty($value['city'])) {
            $title .= ', ' . SafeDecodeLabel::decodeLabelSafe($value['city']);
        }

        return '<img class="countryFlag" style="height:15px;" title="' . $title . '" src="' . \Piwik\Plugins\UserCountry\getFlagFromCode($value['country']) . '">';
    }
}
