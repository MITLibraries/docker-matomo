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

class TimeOnPage extends BaseMetric
{
    public function getName()
    {
        return 'time_on_page';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('General_TimeOnPage');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnTimeOnPageDocumentation');
    }

    public function compute(Row $row)
    {
        return $this->getMetric($row, $this->getName());
    }

    public function getDependentMetrics()
    {
        return array($this->getName());
    }

    public function format($value, Formatter $formatter)
    {
        if (!empty($value)) {
            $value = round($value / 1000, 1); // convert ms to seconds
            $value = (int) round($value);
        }

        $time = $formatter->getPrettyTimeFromSeconds($value, $asSentence = false);

        if (strpos($time, '00:') === 0) {
            $time = substr($time, 3);
        }

        return $time;
    }
}
