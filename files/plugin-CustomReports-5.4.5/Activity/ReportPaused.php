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

namespace Piwik\Plugins\CustomReports\Activity;

use Piwik\Piwik;

class ReportPaused extends BaseActivity
{
    protected $eventName = 'API.CustomReports.pauseCustomReport.end';

    public function extractParams($eventData)
    {
        $finalAPIParameters = $eventData[1]['parameters'];

        $idSite = $finalAPIParameters['idSite'];
        $idCustomReport = $finalAPIParameters['idCustomReport'];

        return $this->formatActivityData($idSite, $idCustomReport);
    }

    public function getTranslatedDescription($activityData, $performingUser)
    {
        $siteName = $this->getSiteNameFromActivityData($activityData);
        $reportName = $this->getReportNameFromActivityData($activityData);

        return Piwik::translate('CustomReports_ActivityReportPausedDescription', [$reportName, $siteName]);
    }
}
