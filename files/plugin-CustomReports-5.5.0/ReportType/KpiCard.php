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

namespace Piwik\Plugins\CustomReports\ReportType;

use Piwik\Piwik;
use Piwik\Plugins\CoreVisualizations\Visualizations\Sparkline;

class KpiCard extends Evolution
{
    public const ID = 'kpicard';

    public function getName(): string
    {
        return Piwik::translate('CustomReports_ReportTypeKpiCard');
    }

    public function getRenderAction(): string
    {
        return 'getSingleMetricView';
    }

    public function getDefaultViewDataTable(): string
    {
        return Sparkline::ID;
    }

    public function getMaxMetrics(): int
    {
        return 1;
    }
}
