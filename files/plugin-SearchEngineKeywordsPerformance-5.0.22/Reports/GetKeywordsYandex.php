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
use Piwik\Date;
use Piwik\Period;
use Piwik\Piwik;
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Columns\Keyword;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Yandex as ModelYandex;
use Piwik\Plugins\SearchEngineKeywordsPerformance\SearchEngineKeywordsPerformance;

class GetKeywordsYandex extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Reports\Base
{
    protected function init()
    {
        parent::init();
        $this->dimension = new Keyword();
        $this->name = Piwik::translate('SearchEngineKeywordsPerformance_YandexKeywords');
        $this->documentation = Piwik::translate('SearchEngineKeywordsPerformance_YandexKeywordsDocumentation');
        $this->order = 17;
    }
    public function configureView(ViewDataTable $view)
    {
        parent::configureView($view);
        $period = Common::getRequestVar('period', \false, 'string');
        $idSite = Common::getRequestVar('idSite', \false, 'string');
        $model = new ModelYandex();
        $measurableSetting = new MeasurableSettings($idSite);
        if (!SearchEngineKeywordsPerformance::isYandexForceEnabled($idSite)) {
            [$account, $url] = explode('##', $measurableSetting->yandexAccountAndHostId->getValue());
            $dateLastData = $model->getLatestDateKeywordDataIsAvailableFor($url);
        }
        if ($dateLastData && $period != 'range') {
            $periodObjType = Period\Factory::build($period, Date::factory($dateLastData));
            $lastDateMessage = Piwik::translate('SearchEngineKeywordsPerformance_LatestAvailableDate', '<a href="javascript:broadcast.propagateNewPage(\'date=' . $dateLastData . '\')">' . $periodObjType->getLocalizedShortString() . '</a>');
            $message = '<p style="margin-bottom:2em" class=" alert-info alert">' . Piwik::translate('CoreHome_ThereIsNoDataForThisReport') . '<br />' . $lastDateMessage . '</p>';
            $view->config->no_data_message = $message;
        }
        $this->formatCtrAndPositionColumns($view);
    }
    public function isEnabled()
    {
        return parent::isYandexEnabled();
    }
}
