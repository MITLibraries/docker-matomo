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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Reports;

use Piwik\Common;
use Piwik\Piwik;
use Piwik\Plugin\ReportsProvider;

class GetKeywordsReferrers extends \Piwik\Plugins\Referrers\Reports\GetKeywords
{
    protected function init()
    {
        parent::init();
        $this->name = Piwik::translate('SearchEngineKeywordsPerformance_KeywordsReferrers');
        $this->module = 'Referrers';
        $this->action = 'getKeywords';
        $this->subcategoryId = 'Referrers_SubmenuSearchEngines';
        $this->order = 10;
    }
    public function getRelatedReports()
    {
        // don't show related reports when viewing the goals page, as related reports don't contain goal data
        if (Common::getRequestVar('viewDataTable', '') === 'tableGoals' && Common::getRequestVar('idGoal', '') !== '') {
            return [];
        }
        $getKeywordsImported = new GetKeywordsImported();
        if ($getKeywordsImported->isEnabled()) {
            return [ReportsProvider::factory('SearchEngineKeywordsPerformance', 'getKeywordsImported'), ReportsProvider::factory('SearchEngineKeywordsPerformance', 'getKeywords')];
        }
        return [ReportsProvider::factory('SearchEngineKeywordsPerformance', 'getKeywords')];
    }
}
