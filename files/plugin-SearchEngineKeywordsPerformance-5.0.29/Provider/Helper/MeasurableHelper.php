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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Helper;

use Piwik\Container\StaticContainer;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SitesManager\Model as SitesManagerModel;
use Piwik\Singleton;

class MeasurableHelper extends Singleton
{
    protected $allSiteSettings = [];

    public function getAllSiteSettings(): array
    {
        if (!empty($this->allSiteSettings)) {
            return $this->allSiteSettings;
        }

        $siteManagerModel = StaticContainer::get(SitesManagerModel::class);
        $allSiteIds = $siteManagerModel->getSitesId();
        $this->allSiteSettings = [];
        foreach ($allSiteIds as $siteId) {
            if (!Piwik::isUserHasAdminAccess($siteId)) {
                continue;
                // skip sites without access
            }
            $this->allSiteSettings[$siteId] = $this->getMeasurableSettings($siteId);
        }

        return $this->allSiteSettings;
    }

    protected function getMeasurableSettings(int $idSite): MeasurableSettings
    {
        return new MeasurableSettings($idSite);
    }
}
