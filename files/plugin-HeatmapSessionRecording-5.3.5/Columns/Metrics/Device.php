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

require_once  PIWIK_DOCUMENT_ROOT . '/core/Twig.php';

class Device extends BaseMetric
{
    public function getName()
    {
        return 'device';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('DevicesDetection_Device');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnDeviceDocumentation');
    }

    public function compute(Row $row)
    {
        return array(
            'type' => $this->getMetric($row, 'config_device_type'),
            'model' => $this->getMetric($row, 'config_device_model')
        );
    }

    public function getDependentMetrics()
    {
        return array(
            'config_device_type',
            'config_device_model',
        );
    }

    public function showsHtml()
    {
        return true;
    }

    public function format($value, Formatter $formatter)
    {
        if (empty($value['type']) && $value['type'] !== 0 && $value['type'] !== '0') {
            return false;
        }

        $title = \Piwik\Plugins\DevicesDetection\getDeviceTypeLabel($value['type']);

        if (!empty($value['model'])) {
            $title .= ', ' . SafeDecodeLabel::decodeLabelSafe($value['model']);
        }

        return '<img title="' . $title . '" style="height:16px;" src="' . \Piwik\Plugins\DevicesDetection\getDeviceTypeLogo($value['type']) . '">';
    }
}
