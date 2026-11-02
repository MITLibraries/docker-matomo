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
 * @link    https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\SearchEngineKeywordsPerformance;

use Piwik\Date;
use Piwik\Period;
use Piwik\Period\Factory as PeriodFactory;
use Piwik\Site;

/**
 * Shared timezone and period construction helpers for keyword performance reports.
 */
class PeriodHelper
{
    /**
     * Returns the timezone when exactly one accessible site is selected, or UTC when zero or
     * several sites are selected. An 'all' request uses the site's timezone when only one
     * accessible site remains.
     *
     * @param int|string|int[] $idSite
     * @param bool|string $restrictSitesToLogin Restrict an 'all' request to sites visible to the login.
     * @return string
     */
    public static function getTimezoneForSingleSite($idSite, $restrictSitesToLogin = false)
    {
        $idSites = Site::getIdSitesFromIdSitesString($idSite, $restrictSitesToLogin);

        if (count($idSites) !== 1) {
            return 'UTC';
        }

        return Site::getTimezoneFor(reset($idSites));
    }

    /**
     * Creates a period using the same query-parameter rules as the core
     * ArchiveQueryFactory while resolving relative dates in the given timezone.
     * Multiple-period dates are built directly because the core query factory
     * expands those periods into subperiods itself; unlike the core factory,
     * this helper returns the period object rather than the expanded list.
     *
     * @param string $timezone
     * @param string $period
     * @param string|Date $date
     * @return Period
     */
    public static function makePeriod($timezone, $period, $date)
    {
        if (Period::isMultiplePeriod($date, $period)) {
            // makePeriodFromQueryParams() cannot build multiple periods; core's archive query splits the same way.
            return PeriodFactory::build($period, $date, $timezone);
        }

        return PeriodFactory::makePeriodFromQueryParams($timezone, $period, $date);
    }
}
