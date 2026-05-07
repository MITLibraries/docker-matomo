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

use Piwik\Piwik;
use Piwik\Plugin\ReportsProvider;
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Columns\Keyword;

class GetKeywords extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Reports\Base
{
    protected function init()
    {
        parent::init();
        $this->dimension = new Keyword();
        $this->name = Piwik::translate('SearchEngineKeywordsPerformance_KeywordsCombined');
        $this->documentation = Piwik::translate('SearchEngineKeywordsPerformance_KeywordsCombinedDocumentation');
        $this->metrics = ['nb_visits'];
        $this->order = 1;
    }
    public function configureView(ViewDataTable $view)
    {
        parent::configureView($view);
        $view->config->columns_to_display = ['label', 'nb_visits'];
    }
    public function getRelatedReports()
    {
        $getKeywordsImported = new GetKeywordsImported();
        if ($getKeywordsImported->isEnabled()) {
            return [ReportsProvider::factory('SearchEngineKeywordsPerformance', 'getKeywordsImported'), ReportsProvider::factory('Referrers', 'getKeywords')];
        }

        return [ReportsProvider::factory('Referrers', 'getKeywords')];
    }
    public function alwaysUseDefaultViewDataTable()
    {
        return \true;
    }
}
