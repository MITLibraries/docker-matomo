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

class ReportDeleted extends BaseActivity
{
    protected $eventName = 'CustomReports.deleteCustomReport.end';

    public function extractParams($eventData)
    {
        if (!isset($eventData[0]) || empty($eventData[1])) {
            return false;
        }

        $idSite = $eventData[0];
        $idCustomReport = $eventData[1];

        return $this->formatActivityData($idSite, $idCustomReport);
    }

    public function getTranslatedDescription($activityData, $performingUser)
    {
        $siteName = $this->getSiteNameFromActivityData($activityData);
        $reportName = $this->getReportNameFromActivityData($activityData);

        return Piwik::translate('CustomReports_ActivityReportDeletedDescription', [$reportName, $siteName]);
    }
}
