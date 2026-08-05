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
use Piwik\DataTable;
use Piwik\NumberFormatter;
use Piwik\Piwik;
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Importer\Google;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;
use Piwik\Date;
use Piwik\Period;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Model\Google as ModelGoogle;
use Piwik\Plugins\SearchEngineKeywordsPerformance\SearchEngineKeywordsPerformance;
use Piwik\Plugins\SearchEngineKeywordsPerformance\SystemSettings;
use Piwik\Url;

abstract class Base extends \Piwik\Plugin\Report
{
    protected $idSite = \false;
    protected function init()
    {
        $this->categoryId = 'Referrers_Referrers';
        $this->subcategoryId = 'Referrers_SubmenuSearchEngines';
        $this->defaultSortColumn = Metrics::NB_CLICKS;
        $this->metrics = Metrics::getKeywordMetrics();
        $this->processedMetrics = [];
        if (property_exists($this, 'onlineGuideUrl')) {
            $this->onlineGuideUrl = Url::addCampaignParametersToMatomoLink('https://matomo.org/guide/installation-maintenance/import-search-keywords/');
        }
    }
    public function getMetricsDocumentation()
    {
        return Metrics::getMetricsDocumentation();
    }
    public function configureReportMetadata(&$availableReports, $infos)
    {
        $this->idSite = $infos['idSite'];
        parent::configureReportMetadata($availableReports, $infos);
    }
    public function configureView(ViewDataTable $view)
    {
        $view->config->addTranslations(['label' => $this->dimension->getName()]);
        $view->config->show_limit_control = \true;
        $view->config->show_all_views_icons = \false;
        $view->config->show_table_all_columns = \false;
        $view->config->columns_to_display = ['label', Metrics::NB_CLICKS, Metrics::NB_IMPRESSIONS, Metrics::CTR, Metrics::POSITION];
        $view->requestConfig->filter_limit = 10;
        $this->configureSegmentNotSupported($view);
    }
    public function getSecondarySortColumnCallback()
    {
        return function ($firstSortColumn, $table) {
            return $firstSortColumn === Metrics::NB_CLICKS ? Metrics::NB_IMPRESSIONS : Metrics::NB_CLICKS;
        };
    }
    protected function configureSegmentNotSupported(ViewDataTable $view)
    {
        // show 'not supported' message if segment is chosen
        if (Common::getRequestVar('segment', '')) {
            $view->config->show_footer_message .= '<p style="margin-top:2em;margin-bottom:2em" class=" alert-info alert">' . Piwik::translate('SearchEngineKeywordsPerformance_NoSegmentation') . '</p>';
        }
    }
    public function isGoogleEnabledForType($type)
    {
        $idSite = Common::getRequestVar('idSite', $this->idSite, 'int');
        if (empty($idSite)) {
            return \false;
        }
        if (SearchEngineKeywordsPerformance::isGoogleForceEnabled($idSite)) {
            return \true;
        }
        $setting = new MeasurableSettings($idSite);
        $searchConsoleSetting = $setting->googleSearchConsoleUrl;
        $typeSetting = $setting->getSetting('google' . $type . 'keywords');
        return $searchConsoleSetting && $searchConsoleSetting->getValue() && $typeSetting && $typeSetting->getValue() && (strpos($searchConsoleSetting->getValue(), 'android-app') === \false || $type == 'web');
    }
    public function isAnyGoogleTypeEnabled()
    {
        return $this->isGoogleEnabledForType('web') || $this->isGoogleEnabledForType('image') || $this->isGoogleEnabledForType('video') || $this->isGoogleEnabledForType('news');
    }
    public function isBingEnabled()
    {
        $idSite = Common::getRequestVar('idSite', $this->idSite, 'int');
        if (empty($idSite)) {
            return \false;
        }
        if (SearchEngineKeywordsPerformance::isBingForceEnabled($idSite)) {
            return \true;
        }
        $setting = new MeasurableSettings($idSite);
        return !empty($setting->bingSiteUrl) && $setting->bingSiteUrl->getValue();
    }
    public function isYandexEnabled()
    {
        $idSite = Common::getRequestVar('idSite', \false, 'int');
        if (empty($idSite)) {
            return \false;
        }
        if (SearchEngineKeywordsPerformance::isYandexForceEnabled($idSite)) {
            return \true;
        }
        $setting = new MeasurableSettings($idSite);
        return !empty($setting->yandexAccountAndHostId) && $setting->yandexAccountAndHostId->getValue();
    }
    public function getMetricNamesToProcessReportTotals()
    {
        return Metrics::getMetricIdsToProcessReportTotal();
    }
    /**
     * @param ViewDataTable $view
     * @param $type
     * @throws \Exception
     */
    public function configureViewMessagesGoogle($view, $type)
    {
        $period = Common::getRequestVar('period', \false, 'string');
        $date = Common::getRequestVar('date', \false, 'string');
        $idSite = Common::getRequestVar('idSite', \false, 'string');
        // Append a footer message if data was not yet reported as final
        $view->config->filters[] = function ($table) use ($view) {
            if ($table->getMetadata(Google::DATATABLE_METADATA_TEMPORARY) === \true && \false === strpos($view->config->show_footer_message, Piwik::translate('SearchEngineKeywordsPerformance_GoogleDataNotFinal'))) {
                $view->config->show_footer_message .= '<p style="margin-bottom:2em" class=" alert-info alert">' . Piwik::translate('SearchEngineKeywordsPerformance_GoogleDataNotFinal') . '</p>';
            }
        };
        if (SearchEngineKeywordsPerformance::isGoogleForceEnabled($idSite)) {
            return;
        }
        $measurableSetting = new MeasurableSettings($idSite);
        [$account, $url] = explode('##', $measurableSetting->googleSearchConsoleUrl->getValue());
        $model = new ModelGoogle();
        $message = '';
        $periodObj = Period\Factory::build($period, $date);
        $lastDate = $model->getLatestDateKeywordDataIsAvailableFor($url);
        $lastDateForType = $model->getLatestDateKeywordDataIsAvailableFor($url, $type);
        if ($lastDate && !Date::factory($lastDate)->isEarlier($periodObj->getDateStart())) {
            return;
        }
        $lastDateMessage = '';
        if ($lastDateForType && $period != 'range') {
            $periodObjType = Period\Factory::build($period, Date::factory($lastDateForType));
            $lastDateMessage = Piwik::translate('SearchEngineKeywordsPerformance_LatestAvailableDate', '<a href="javascript:broadcast.propagateNewPage(\'date=' . $lastDateForType . '\')">' . $periodObjType->getLocalizedShortString() . '</a>');
        }
        if ($periodObj->getDateEnd()->isLater(Date::now()->subDay(5))) {
            $message .= '<p style="margin-bottom:2em" class=" alert-info alert">'
                . Piwik::translate('CoreHome_ThereIsNoDataForThisReport')
                . '<br />' . Piwik::translate('SearchEngineKeywordsPerformance_GoogleDataProvidedWithDelay')
                . '<br />' . $lastDateMessage . '</p>';
            $view->config->no_data_message = $message;
        }
        if (empty($message) && $lastDateMessage) {
            $view->config->show_footer_message .= '<p style="margin-bottom:2em" class=" alert-info alert">' . $lastDateMessage . '</p>';
        }
    }
    protected function formatColumnsAsNumbers($view, $columns)
    {
        $numberFormatter = NumberFormatter::getInstance();
        $view->config->filters[] = function (DataTable $table) use ($columns, $numberFormatter) {
            $firstRow = $table->getFirstRow();
            if (empty($firstRow)) {
                return;
            }
            foreach ($columns as $metric) {
                $value = $firstRow->getColumn($metric);
                if (\false !== $value) {
                    $firstRow->setColumn($metric, $numberFormatter->formatNumber($value));
                }
            }
        };
    }
    /**
     * @param ViewDataTable $view
     */
    protected function formatCtrAndPositionColumns($view)
    {
        $settings = new SystemSettings();
        $numberFormatter = NumberFormatter::getInstance();
        $view->config->filters[] = ['ColumnCallbackReplace', [Metrics::CTR, function ($value) use ($numberFormatter) {
            return $numberFormatter->formatPercent($value * 100, 0, 0);
        }]];
        $precision = $settings->roundKeywordPosition->getValue() ? 0 : 1;
        $view->config->filters[] = ['ColumnCallbackReplace', [Metrics::POSITION, function ($value) use ($precision, $numberFormatter) {
            if ($precision) {
                return $numberFormatter->formatNumber($value, $precision, $precision);
            }
            return round($value, $precision);
        }]];
    }
}
