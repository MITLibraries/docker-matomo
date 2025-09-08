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

namespace Piwik\Plugins\CustomReports;

use Piwik\Columns\Dimension;
use Piwik\Columns\MetricsList;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Date;
use Piwik\Period;
use Piwik\Piwik;
use Piwik\Plugin;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugin\Report;
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugin\ProcessedMetric;
use Piwik\Plugins\CoreVisualizations\Visualizations\JqplotGraph\Bar;
use Piwik\Plugins\CoreVisualizations\Visualizations\JqplotGraph\Evolution;
use Piwik\Plugins\CoreVisualizations\Visualizations\JqplotGraph\Pie;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;
use Piwik\Plugins\CustomReports\Model\CustomReportsModel;
use Piwik\Plugins\CustomReports\ReportType\ReportType;
use Piwik\Report\ReportWidgetFactory;
use Piwik\Request;
use Piwik\SettingsPiwik;
use Piwik\Url;
use Piwik\Widget\WidgetsList;

class GetCustomReport extends Report
{
    public static $RAW_DATA_UNIQUE_METRICS = array('nb_uniq_corehome_userid', 'nb_uniq_visitors', 'nb_users');
    // nb_users is listed in case we ever rename nb_uniq_corehome_userid so it'll work automatically

    private $customReport = array();

    /**
     * @var ReportType
     */
    private $reportType;

    private $metricTranslations = array();

    private $doNotInitTwice = false;

    private $isFlat = false;

    protected function init()
    {
        parent::init();

        $this->module = 'CustomReports';
        $this->action = 'getCustomReport';
        $this->order = 99;

        $this->actionToLoadSubTables = $this->action;
        $request = Request::fromRequest();

        $idSite = $request->getIntegerParameter('idSite', 0);
        $idCustomReport = $request->getIntegerParameter('idCustomReport', 0);
        $this->isFlat = $request->getIntegerParameter('flat', 0);

        if (
            !empty($idSite)
            && (   Common::getRequestVar('actionToWidgetize', '', 'string') === 'previewReport'
                || Common::getRequestVar('action', '', 'string') === 'previewReport')
            && (   Common::getRequestVar('moduleToWidgetize', '', 'string') === 'CustomReports'
                || Common::getRequestVar('module', '', 'string') === 'CustomReports')
        ) {
            $report = null;
            Piwik::postEvent('CustomReports.buildPreviewReport', array(&$report));

            $this->initCustomReport($report);
            $this->doNotInitTwice = true;
        } elseif (!empty($idCustomReport) && !empty($idSite)) {
            // needed when this report is being rendered because viewDataTable would not find correct report.
            $model = StaticContainer::get('Piwik\Plugins\CustomReports\Model\CustomReportsModel');
            $report = $model->getCustomReport($idSite, $idCustomReport);
            if (!empty($report)) {
                $this->initCustomReport($report);
            }
        }
    }

    public function isEnabled()
    {
        if (!empty($this->dimension) && !$this->dimension->isAnonymousAllowed() && Piwik::isUserIsAnonymous()) {
            return false;
        }
        return parent::isEnabled();
    }

    public function render()
    {
        if (!empty($this->dimension) && !$this->dimension->isAnonymousAllowed()) {
            Piwik::checkUserIsNotAnonymous();
        }
        return parent::render();
    }

    public function initCustomReport($report, DataTable\DataTableInterface $table = null)
    {
        if ($this->doNotInitTwice) {
            return;
        }

        $this->customReport = $report;

        $this->reportType = ReportType::factory($report['report_type']);

        $this->categoryId = $report['category']['id'];
        $this->name = $report['name'];
        $this->documentation = $report['description'];
        $this->metrics = $report['metrics'];
        $this->metricSemanticTypes = [];
        $this->processedMetrics = array();

        // TODO we may need to adjust defaultSortColumn if it was ignored by report builder eg if metric is actually
        // not joinable anymore or does not exist anymore
        $this->defaultSortColumn = reset($report['metrics']);
        $this->order = 0;

        if (!empty($report['subcategory']['id'])) {
            $this->subcategoryId = $report['subcategory']['id'];
            if ($report['subcategory_order'] != 9999999) {
                $this->order = $report['subcategory_order'];
            }
        } elseif (!empty($report['category']['id']) && $report['category']['id'] === CustomReportsDao::DEFAULT_CATEGORY) {
            $this->subcategoryId = $report['idcustomreport'];
        } else {
            // when the category is not specified and does not go into the custom reports category, we use the report name
            // as the category ID. Otherwise we may add eg for a reportId 19 a subcategory to Goals with the ID 19.
            // when there a goal exists with ID 19 as well, we would accidentally put the report on the page of the goal.
            $this->subcategoryId = $report['name'];
        }

        $idSubtable = $this->getSelectedSubtableId();

        $this->dimension = null;
        if (empty($idSubtable) && !empty($report['dimensions'][0])) {
            $this->dimension = $this->getDimensionInstance($report['dimensions'][0]);
        } elseif (!empty($idSubtable)) {
            $this->tryToSetDimensionBasedOnTable($table);

            if (empty($this->dimension) && isset($report['dimensions'][1])) {
                // we assume second dimension
                $this->dimension = $this->getDimensionInstance($report['dimensions'][1]);
            }
        }

        $factory = MetricsList::get();

        $this->metricTranslations = array();
        $period = Common::getRequestVar('period', '', 'string');
        foreach ($report['metrics'] as $metric) {
            $metricInstance = $factory->getMetric($metric);
            if (
                !empty($metricInstance) &&
                ($metricInstance instanceof ProcessedMetric || $metricInstance instanceof ArchivedMetric)
            ) {
                if ($period != 'day' && stripos($metricInstance->getTranslatedName(), 'unique') === 0) {
                    $metricInstance->setDocumentation(Piwik::translate(
                        'CustomReports_CommonUniqueMetricDescription',
                        array($metricInstance->getDocumentation(), ucwords($metricInstance->getTranslatedName()), str_ireplace('Unique ', '', ucwords($metricInstance->getTranslatedName())))
                    ));
                    $metricInstance->setTranslatedName(Piwik::translate('CustomReports_CommonUniqueMetric', array($metricInstance->getTranslatedName())));
                }
                $this->processedMetrics[] = $metricInstance;
                $this->metricTranslations[$metric] = $metricInstance->getTranslatedName();
            }

            if ($metricInstance instanceof Plugin\Metric && method_exists($metricInstance, 'getSemanticType')) {
                $this->metricSemanticTypes[$metric] = $metricInstance->getSemanticType();
            } else {
                $this->metricSemanticTypes[$metric] = null;
            }
        }
        if (!empty($report['idcustomreport'])) {
            $this->parameters = array('idCustomReport' => $report['idcustomreport']);
        } else {
            $this->parameters = array();
        }
    }

    private function getSelectedSubtableId()
    {
        return Common::getRequestVar('idSubtable', 0, 'int');
    }

    public function getMetrics()
    {
        return $this->metricTranslations;
    }

    private function tryToSetDimensionBasedOnTable(DataTable\DataTableInterface $table = null)
    {
        if (!empty($table)) {
            $level = $this->detectSubtableLevelOnTable($table);
            if (!empty($level) && isset($this->customReport['dimensions'][$level - 1])) {
                $this->dimension = $this->getDimensionInstance($this->customReport['dimensions'][$level - 1]);
            }
        }
    }

    private function detectSubtableLevelOnTable(DataTable\DataTableInterface $table)
    {
        $row = $table->getFirstRow();

        if ($row && $row instanceof DataTable\DataTableInterface) {
            $row = $row->getFirstRow();
        }

        if ($row && $row instanceof DataTable\Row) {
            $level = $row->getColumn('level');
            if (!empty($level)) {
                return $level;
            }
        }
    }

    public function getDimensionInstance($dimensionName)
    {
        $factory = StaticContainer::get('Piwik\Columns\DimensionsProvider');
        return $factory->factory($dimensionName);
    }

    public function getDefaultTypeViewDataTable()
    {
        if ($this->reportType) {
            return $this->reportType->getDefaultViewDataTable();
        }

        return parent::getDefaultTypeViewDataTable();
    }

    public function alwaysUseDefaultViewDataTable()
    {
        if ($this->reportType) {
            return $this->reportType->alwaysUseDefaultViewDataTable();
        }

        return parent::alwaysUseDefaultViewDataTable();
    }

    public function configureWidgets(WidgetsList $widgetsList, ReportWidgetFactory $factory)
    {
        if ($this->categoryId && $this->subcategoryId && $this->reportType) {
            $widget = $factory->createWidget();
            $widget->setAction($this->reportType->getRenderAction());
            $widgetsList->addWidgetConfig($widget);
        }
    }

    public function configureView(ViewDataTable $view)
    {
        $dimensionName = 'Label';

        if (!empty($this->dimension)) {
            $dimensionName = $this->dimension->getName();
            $view->config->addTranslations(array('label' => $dimensionName));
        }

        // The insights API is currently hardcoded to use 'nb_visits', and doesn't work
        // if we don't have 'nb_visits' included.
        if (!in_array('nb_visits', $this->metrics, true)) {
            $view->config->show_insights = false;
        }

        $view->config->show_flatten_table = true;

        $subdimension = $this->getSubtableDimension();
        if (!empty($subdimension)) {
            $view->config->show_pivot_by_subtable = true;
            $view->config->pivot_by_dimension = $subdimension->getId();
            $view->config->pivot_by_column = $this->metrics[0];
        } else {
            $view->config->show_pivot_by_subtable = false;
        }

        $metricsList = MetricsList::get();

        foreach ($this->metrics as $metric) {
            $metricInstance = $metricsList->getMetric($metric);
            if (!empty($metricInstance) && $metricInstance->getDocumentation()) {
                $view->config->metrics_documentation[$metricInstance->getName()] = $metricInstance->getDocumentation();
            }
            if (!empty($metricInstance) && $metricInstance->getTranslatedName()) {
                $view->config->addTranslation($metricInstance->getName(), $metricInstance->getTranslatedName());
            }
        }

        $self = $this;
        $report = $this->customReport;
        $request = Request::fromRequest();
        $idSite = $request->getIntegerParameter('idSite', 0);
        $view->config->filters[] = function (DataTable $table) use ($self, $view, $report, $metricsList, $idSite) {
            // we fix the dimension based on the data table content.
            $self->tryToSetDimensionBasedOnTable($table);

            $dimension = $self->getDimension();

            if (!empty($dimension)) {
                $view->config->addTranslations(array('label' => $dimension->getName()));
            }

            // make urls clickable...
            if ($dimension && $dimension->getType() === Dimension::TYPE_URL && (!$this->isFlat || (count($self->customReport['dimensions']) === 1))) {
                $table->filter('ColumnCallbackAddMetadata', array('label', 'url', function ($label) {
                    if ($label === Archiver::LABEL_NOT_DEFINED) {
                        return false;
                    }
                    return $label;
                }));
            }

            if ($table->getRowsCount() === 0 && $table->getMetadata('period')) {
                $period = $table->getMetadata('period');
                if (!empty($period) && $period instanceof Period) {
                    /** @var Period $period */
                    $reportStartDate = $period->getDateStart()->getTimestampUTC();

                    if (
                        (!empty($report['created_date']) && $reportStartDate < Date::factory($report['created_date'])->getTimestamp())
                        || (!empty($report['updated_date']) && $reportStartDate < Date::factory($report['updated_date'])->getTimestamp())
                    ) {
                        $view->config->no_data_message = Piwik::translate('CoreHome_ThereIsNoDataForThisReport') . ' ' . Piwik::translate('CustomReports_NoDataNotArchivedYet');

                        if (!Plugin\Manager::getInstance()->isPluginActivated('Cloud')) {
                            $view->config->no_data_message .= ' ' . Piwik::translate(
                                'CustomReports_NoDataNotArchivedYetReprocess',
                                ['<a href="' . Url::addCampaignParametersToMatomoLink('https://matomo.org/faq/custom-reports/faq_25265/') . '" target="_blank" rel="noreferrer">', '</a>']
                            );
                        }
                    }
                }
            } else {
                $periodLabel = Common::getRequestVar('period', '', 'string');
                $isEvolution = $view->isViewDataTableId(Evolution::ID);

                if (!self::supportsUniqueMetric($periodLabel, $isEvolution)) {
                    $removed = array_intersect(self::$RAW_DATA_UNIQUE_METRICS, $view->config->columns_to_display);
                    $removed2 = array_intersect(self::$RAW_DATA_UNIQUE_METRICS, (property_exists($view->config, 'selectable_columns') && is_array($view->config->selectable_columns)) ? $view->config->selectable_columns : array());
                    if (!empty($removed) || !empty($removed2)) {
                        $view->config->columns_to_display = array_diff($view->config->columns_to_display, self::$RAW_DATA_UNIQUE_METRICS);

                        if ($isEvolution || $view->isViewDataTableId(Bar::ID) || $view->isViewDataTableId(Pie::ID)) {
                            $period = Common::getRequestVar('period', '', 'string');
                            if (!GetCustomReport::supportsUniqueMetric($period, true)) {
                                /** @var Evolution $view */
                                if (is_array($view->config->selectable_columns)) {
                                    $view->config->selectable_columns = array_diff($view->config->selectable_columns, GetCustomReport::$RAW_DATA_UNIQUE_METRICS);
                                }
                            }
                        }

                        $removedHumanReadable = array();
                        foreach ($removed as $metricName) {
                            $foundMetric = $metricsList->getMetric($metricName);
                            if ($foundMetric) {
                                $removedHumanReadable[] = $foundMetric->getTranslatedName();
                            } elseif (is_string($metricName)) {
                                $removedHumanReadable[] = $metricName;
                            }
                        }

                        if (empty($view->config->columns_to_display)) {
                            $view->config->show_header_message = Piwik::translate('CustomReports_NoDataRemovedMetrics', implode(', ', $removedHumanReadable));
                        } elseif ($view->config->columns_to_display == array('label')) {
                            $view->config->show_header_message = Piwik::translate('CustomReports_NoDataRemovedMetrics', implode(', ', $removedHumanReadable));
                            $view->config->columns_to_display = array();
                            $view->config->show_pagination_control = false;
                            $view->config->show_offset_information = false;
                        } else {
                            if (empty($view->config->show_footer_message)) {
                                $view->config->show_footer_message = '';
                            } else {
                                $view->config->show_footer_message .= ' ';
                            }
                            $view->config->show_footer_message .= Piwik::translate('CustomReports_RemovedMetrics', implode(', ', $removedHumanReadable));
                        }
                    }
                }
            }
            if (!empty($report['status']) && $report['status'] === CustomReportsModel::STATUS_PAUSED) {
                $url = Url::getCurrentQueryStringWithParametersModified(array(
                    'module' => 'CustomReports',
                    'action' => 'manage'
                ));
                $view->config->no_data_message = Piwik::translate('CustomReports_NoDataMessagePausedStateAdminUser', ['<a href="' . $url . '" target="_blank" rel="noreferrer noopener">', '</a>']);
                $idSitesToCheck = !empty($report['multiple_idsites']) ? explode(',', $report['multiple_idsites']) : array($idSite);
                foreach ($idSitesToCheck as $idSite) {
                    if (!$this->getValidator()->canWrite($idSite)) {
                        $view->config->no_data_message = Piwik::translate('CustomReports_NoDataMessagePausedStateNonAdminUser');
                        break;
                    }
                }
            }
        };

        $idCustomReport = Common::getRequestVar('idCustomReport', 0, 'int');
        $idSubtable = $this->getSelectedSubtableId();

        if (!empty($this->customReport['segment_filter']) && empty($idSubtable)) {
            // we do not show it in subtable gain...
            $segmentFormatter = StaticContainer::get('Piwik\Plugins\SegmentEditor\SegmentFormatter');

            try {
                $segmentDefinition = $segmentFormatter->getHumanReadable($this->customReport['segment_filter'], $idSite);
                $view->config->show_footer_message = Piwik::translate('CustomReports_ReportHasFilterApplied', Common::sanitizeInputValue($segmentDefinition));
            } catch (\Exception $e) {
                // may fail when a configured segment is no longer available
            }
        }

        $view->config->filters[] = function (DataTable $table) {
            $table->filter('ReplaceSummaryRowLabel');
            $table->setLabelsHaveChanged();
        };

        $view->config->show_table_all_columns = false;
        $view->config->show_exclude_low_population = false;

        $pivotBy = Common::getRequestVar('pivotBy', false);
        if (empty($pivotBy)) {
            if (
                $view->isViewDataTableId(Pie::ID)
                || $view->isViewDataTableId(Bar::ID)
            ) {
                /** @var Pie $view */
                $selectableColumns = array_values($this->metrics);
                $view->config->selectable_columns = $selectableColumns;
                $view->config->columns_to_display = array(reset($selectableColumns));
            } else {
                $view->config->columns_to_display = array_merge(array('label'), $this->metrics);
            }
        }

        if (!empty($idCustomReport)) {
            $view->config->report_id = 'CustomReports.getCustomReport_idCustomReport--' . $idCustomReport;
            $view->requestConfig->request_parameters_to_modify['idCustomReport'] = $idCustomReport;
            $view->requestConfig->request_parameters_to_modify['reportUniqueId'] = 'CustomReports_getCustomReport_idCustomReport--' . $idCustomReport;

            if ($this->getValidator()->canWrite($idSite)) {
                $view->config->title_edit_entity_url = 'index.php' . Url::getCurrentQueryStringWithParametersModified(array(
                    'module' => 'CustomReports',
                    'action' => 'manage'
                )) . '#?idCustomReport=' . (int)$idCustomReport;
            }
        }

        // Is this an evolution graph. If it is, we need to override the controller action so the right API call is made
        if ($view->isViewDataTableId(Evolution::ID) && !in_array(Common::getRequestVar('action', '', 'string'), ['getMultiRowEvolutionPopover', 'getRowEvolutionPopover', 'getRowEvolutionGraph'])) {
            $view->config->controllerAction = 'getEvolutionGraph';
        }

        if (!$this->isFlat && !empty($this->customReport['dimensions']) && is_array($this->customReport['dimensions']) && count($this->customReport['dimensions']) > 3) {
            // add a css class to update the width of table for hierarchical, when dimensions are > 3 to resolve scrolling issue
            $view->config->datatable_css_class = 'customReportsHigherDimensions';
        }
    }

    public static function supportsUniqueMetric($period, $isEvolutionGraph)
    {
        $config = StaticContainer::get(Configuration::class);
        if ($config->shouldAlwaysShowUniqueVisitors()) {
            return true;
        }

        if ($isEvolutionGraph) {
            return SettingsPiwik::isUniqueVisitorsEnabled($period);
        }

        return $period === 'day';
    }

    public function getSubtableDimension()
    {
        return $this->getSecondLeveltableDimension();
    }

    public function getSecondLeveltableDimension()
    {
        if (isset($this->customReport['dimensions'][1])) {
            return $this->getDimensionInstance($this->customReport['dimensions'][1]);
        }
    }

    public function getThirdLeveltableDimension()
    {
        if (isset($this->customReport['dimensions'][2])) {
            return $this->getDimensionInstance($this->customReport['dimensions'][2]);
        }
    }

    public function getNthLevelTableDimension(int $level): ?Dimension
    {
        if (isset($this->customReport['dimensions'][$level])) {
            return $this->getDimensionInstance($this->customReport['dimensions'][$level]);
        }

        return null;
    }

    private function getValidator()
    {
        return StaticContainer::get('Piwik\Plugins\CustomReports\Input\Validator');
    }
}
