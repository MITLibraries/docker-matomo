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
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugins\CoreVisualizations\Visualizations\JqplotGraph\Evolution;
use Piwik\Plugins\CoreVisualizations\Visualizations\Sparklines;
use Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders\Yandex as YandexRecordBuilder;
use Piwik\Report\ReportWidgetFactory;
use Piwik\Widget\WidgetsList;

class GetCrawlingOverviewYandex extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Reports\Base
{
    protected function init()
    {
        parent::init();
        $this->subcategoryId = 'SearchEngineKeywordsPerformance_CrawlingStats';
        $this->name = Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlingStats');
        $this->documentation = Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlingStatsDocumentation');
        $this->defaultSortColumn = null;
        $this->metrics = [];
        $this->order = 10;
    }
    public function configureView(ViewDataTable $view)
    {
        $period = Common::getRequestVar('period', \false, 'string');
        $viewDataTable = Common::getRequestVar('viewDataTable', \false, 'string');
        if ($period != 'day' && $viewDataTable != 'graphEvolution') {
            $view->config->show_footer_message .= '<p style="margin-top:2em;margin-bottom:2em" class=" alert-info alert">' . Piwik::translate('SearchEngineKeywordsPerformance_ReportShowMaximumValues') . '</p>';
        }
        $view->config->show_limit_control = \false;
        $view->config->show_all_views_icons = \false;
        $view->config->show_table_all_columns = \false;
        $view->config->setDefaultColumnsToDisplay([YandexRecordBuilder::CRAWLSTATS_IN_INDEX_RECORD_NAME], \false, \false);
        $view->config->addTranslations([
            YandexRecordBuilder::CRAWLSTATS_IN_INDEX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlInIndex'),
            YandexRecordBuilder::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlAppearedPages'),
            YandexRecordBuilder::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlRemovedPages'),
            YandexRecordBuilder::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlCrawledPages'),
            YandexRecordBuilder::CRAWLSTATS_CODE_2XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus2xx'),
            YandexRecordBuilder::CRAWLSTATS_CODE_3XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus3xx'),
            YandexRecordBuilder::CRAWLSTATS_CODE_4XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus4xx'),
            YandexRecordBuilder::CRAWLSTATS_CODE_5XX_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlHttpStatus5xx'),
            YandexRecordBuilder::CRAWLSTATS_ERRORS_RECORD_NAME => Piwik::translate('SearchEngineKeywordsPerformance_YandexCrawlErrors')
        ]);
        $view->config->selectable_columns = [
            YandexRecordBuilder::CRAWLSTATS_IN_INDEX_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_APPEARED_PAGES_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_REMOVED_PAGES_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_CRAWLED_PAGES_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_CODE_2XX_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_CODE_3XX_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_CODE_4XX_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_CODE_5XX_RECORD_NAME,
            YandexRecordBuilder::CRAWLSTATS_ERRORS_RECORD_NAME
        ];
        $this->configureSegmentNotSupported($view);
    }
    public function configureWidgets(WidgetsList $widgetsList, ReportWidgetFactory $factory)
    {
        $idSite = Common::getRequestVar('idSite', 0, 'int');
        if (empty($idSite)) {
            return;
        }
        $subcategory = 'SearchEngineKeywordsPerformance_CrawlingStats';
        $widgets = [];
        $config = $factory->createWidget();
        $config->forceViewDataTable(Evolution::ID);
        $config->setSubcategoryId($subcategory);
        $config->setIsNotWidgetizable();
        $widgets[] = $config;
        $config = $factory->createWidget();
        $config->forceViewDataTable(Sparklines::ID);
        $config->setSubcategoryId($subcategory);
        $config->setName('');
        $config->setIsNotWidgetizable();
        $widgets[] = $config;
        $config = $factory->createContainerWidget('CrawlingStatsYandex');
        $config->setCategoryId($widgets[0]->getCategoryId());
        $config->setSubcategoryId($subcategory);
        $config->setIsWidgetizable();
        foreach ($widgets as $widget) {
            $config->addWidgetConfig($widget);
        }
        $widgetsList->addWidgetConfigs([$config]);
    }
    public function isEnabled()
    {
        return parent::isYandexEnabled();
    }
}
