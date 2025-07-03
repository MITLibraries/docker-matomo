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
use Piwik\Piwik;

class TotalEvents extends BaseMetric
{
    public function getName()
    {
        return 'total_events';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('HeatmapSessionRecording_TotalEvents');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnTotalEventsDocumentation');
    }

    public function compute(Row $row)
    {
        return $this->getMetric($row, 'total_events');
    }

    public function getDependentMetrics()
    {
        return [];
    }
}
