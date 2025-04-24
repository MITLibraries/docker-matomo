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

use Piwik\DataTable\Row;
use Piwik\Metrics\Formatter;
use Piwik\Piwik;

class Browser extends BaseMetric
{
    public function getName()
    {
        return 'browser';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('DevicesDetection_ColumnBrowser');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnBrowserDocumentation');
    }

    public function compute(Row $row)
    {
        return $this->getMetric($row, 'config_browser_name');
    }

    public function getDependentMetrics()
    {
        return array(
            'config_browser_name',
        );
    }

    public function showsHtml()
    {
        return true;
    }

    public function format($value, Formatter $formatter)
    {
        if (empty($value) || $value === 'UNK') {
            return false;
        }

        $title = \Piwik\Plugins\DevicesDetection\getBrowserName($value);

        return '<img title="' . $title . '" style="height:16px;" src="' . \Piwik\Plugins\DevicesDetection\getBrowserLogo($value) . '">';
    }
}
