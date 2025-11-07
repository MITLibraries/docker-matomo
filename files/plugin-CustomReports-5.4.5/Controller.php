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

use Piwik\Columns\DimensionsProvider;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Date;
use Piwik\Piwik;
use Piwik\Plugin\ReportsProvider;
use Piwik\Plugins\CustomReports\Input\Validator;
use Piwik\ArchiveProcessor;
use Piwik\DataAccess\ArchiveWriter;
use Piwik\Plugins\CustomReports\RecordBuilders\CustomReport;
use Piwik\Plugins\CustomReports\ReportType\ReportType;
use Piwik\Plugins\CustomReports\ReportType\Table;
use Piwik\Request;
use Piwik\Segment;
use Piwik\Site;
use Piwik\Period\Factory as PeriodFactory;
use Piwik\Url;
use Piwik\ViewDataTable\Factory;

class Controller extends \Piwik\Plugin\Controller
{
    /**
     * @var Validator
     */
    private $validator;

    public function __construct(Validator $validator)
    {
        $this->validator = $validator;

        parent::__construct();
    }

    /**
     * Manage custom reports in the admin area.
     * @return string
     */
    public function manage()
    {
        $idSite = Common::getRequestVar('idSite');

        if (strtolower($idSite) === 'all') {
            // prevent fatal error... redirect to a specific site as it is not possible to manage for all sites
            $this->validator->checkHasSomeWritePermission();
            $this->redirectToIndex('CustomReports', 'manage');
            exit;
        }

        $this->checkSitePermission();
        $this->validator->checkWritePermission($this->idSite);

        $configuration =  StaticContainer::get(Configuration::class);

        return $this->renderTemplate('manage', [
            'browserArchivingDisabled' => !ArchiveProcessor\Rules::isBrowserTriggerEnabled(),
            'reArchiveLastN' => $configuration->getReArchiveReportsInPastLastNMonths(),
            'maxDimensions' => $configuration->getMaxDimensions(),
            'isCloud' => \Piwik\Plugin\Manager::getInstance()->isPluginLoaded('Cloud'),
        ]);
    }

    /**
     * Preview a custom reports report. Only supports table visualization so far.
     * @return string
     * @throws \Exception
     */
    public function previewReport()
    {
        $this->checkSitePermission();
        $this->validator->checkWritePermission($this->idSite);

        $report = null;
        Piwik::postEvent('CustomReports.buildPreviewReport', array(&$report));

        $date = Common::getRequestVar('date', null, 'string');
        $period = defined('PIWIK_TEST_MODE') && PIWIK_TEST_MODE ? 'day' : 'range';
        $configuration =  StaticContainer::get(Configuration::class);
        try {
            $iterations = $configuration->getPreviewReportIterations();
        } catch (\Exception $e) {
            $message = $e->getMessage();
            $view = Factory::build();
            $view->setDataTable(new DataTable());
            $view->config->show_header_message = '<div class="alert alert-danger">' . $message . '</div>';
            $view->config->no_data_message = ' ';
            return $view->render();
        }

        try {
            // only for UI tests
            if (StaticContainer::get('test.vars.previewDate')) {
                $date = StaticContainer::get('test.vars.previewDate');
                $period = 'day';
            }
        } catch (\Exception $e) {
            // ignore any possible error
        }
        // for now we only support day period as weekly or monthly doesn't really work and would take way too long
        // so it can also not be misused to fetch not yet archived reports

        $site = new Site($this->idSite);
        if ($period === 'day') {
            $iterations = [
                ['startDate' => '-1 day', 'minRowsRequired' => 0],
            ];
        }

        $startDateObj = null;
        $endDateObj = null;
        $timezone = $site->getTimezone();

        foreach ($iterations as $iteration) {
            $periodObject = null;
            if ($period === 'range') {
                // hack for PeriodFactory::build('range'); to work, as it throws an error for same day, our archives are date based i.e 2024-02-01, sending 2 same dates will create an issue
                // Since we are sending $startDateObj and $endDateObj, start and end date will be overwritten with the help of CustomLogAggregator for range period
                $date = date('Y-m-d', strtotime('-1 day')) . ',' . date('Y-m-d');
                $startDateObj = new \DateTime($iteration['startDate'], new \DateTimeZone($timezone));
                $endDateObj = new \DateTime('now', new \DateTimeZone($timezone));
            }
            try {
                $dataTable = $this->getReportDataTable($report, $date, $site, $period, $periodObject, $startDateObj, $endDateObj);
            } catch (\Exception $e) {
                $message = $e->getMessage();
                if (stripos($message, 'be joined for segmentation') !== false) {
                    $faqLink = Url::addCampaignParametersToMatomoLink('https://matomo.org/faq/custom-reports/how-to-resolve-errors-when-using-different-dimension-combinations-in-matomo/');
                    $message = Piwik::translate('CustomReports_NoSegmentationJoinExceptionMessage', ['<a href="' . $faqLink . '" target="_blank" rel="noopener noreferrer">', '</a>']);
                    $type = ReportType::factory($report['report_type']);
                    $view = Factory::build($type->getDefaultViewDataTable(), 'CustomReports.getCustomReport', 'CustomReports.previewReport', true);
                    $view->setDataTable(new DataTable());
                    $view->config->show_header_message = '<div class="alert alert-danger">' . $message . '</div>';
                    $view->config->no_data_message = ' ';
                    return $view->render();
                }

                throw $e;
            }

            $count = $dataTable->getRowsCount();
            if ($count >= $iteration['minRowsRequired']) {
                break;
            }
        }

        $idSubTable = Request::fromRequest()->getIntegerParameter('idSubtable', 0);
        if (!empty($idSubTable)) {
            $row = $dataTable->getRowFromIdSubDataTable($idSubTable);
            if ($row !== false) {
                $dataTable = $row->getSubTable();
            } else {
                $searchResult = $this->searchDescendentsForSubtable($dataTable, $idSubTable);
                if ($searchResult !== null) {
                    $dataTable = $searchResult;
                }
            }
        }

        $showFooterMessage = true;

        if ($report['report_type'] === Table::ID) {
            $factory = StaticContainer::get('Piwik\Columns\DimensionsProvider');
            if (empty($idSubTable)) {
                $dimension = $factory->factory(reset($report['dimensions']));
            } else {
                $showFooterMessage = false; // do not show message again for subtables
                $firstRow = $dataTable ? $dataTable->getFirstRow() : false;
                $level = $firstRow ? $firstRow->getColumn('level') : 0;
                if (!empty($level) && !empty($report['dimensions'][$level - 1])) {
                    $dimension = $factory->factory($report['dimensions'][$level - 1]);
                }
            }
            if (!empty($dimension)) {
                $dataTable->filter('Piwik\Plugins\CustomReports\DataTable\Filter\ReportTypeTableFilter', [$this->idSite, $dimension, array()]);
            }
        }

        $type = ReportType::factory($report['report_type']);
        $view = Factory::build($type->getDefaultViewDataTable(), 'CustomReports.getCustomReport', 'CustomReports.previewReport', true);
        $view->setDataTable($dataTable);

        $reportInstance = ReportsProvider::factory('CustomReports', 'getCustomReport');
        if (!$reportInstance) {
            // user has not configured any custom reports yet, we need to configure manually otherwise it won't work
            // because reports are cached
            $reportInstance = new GetCustomReport();
            $reportInstance->initCustomReport($report);

            $subtable = $reportInstance->getActionToLoadSubTables();
            if (!empty($subtable)) {
                $view->config->subtable_controller_action = $subtable;
            }

            $metrics = $reportInstance->getMetrics();
            if (!empty($metrics)) {
                $view->config->addTranslations($metrics);
            }

            $processedMetrics = $reportInstance->getProcessedMetrics();
            if (!empty($processedMetrics)) {
                $view->config->addTranslations($processedMetrics);
            }

            $view->config->title = $reportInstance->getName();
            $reportInstance->configureView($view);
        }

        // make sure any action will be correctly forwarded
        if (property_exists($view->config, 'disable_row_evolution')) {
            $view->config->disable_row_evolution = true;
        }
        $view->config->custom_parameters['module'] = 'CustomReports';
        $view->config->custom_parameters['action'] = 'previewReport';
        $view->config->subtable_controller_action = 'previewReport';

        if ($showFooterMessage) {
            $dateString = $periodObject->getLocalizedLongString();
            if (!empty($startDateObj) && !empty($endDateObj) && $period === 'range') {
                $dateString =  $startDateObj->format('M d Y h:i:s A T') . ' - ' . $endDateObj->format('M d Y h:i:s A T');
            }
            $view->config->show_footer_message = Piwik::translate('CustomReports_PreviewDate', $dateString);
        }

        $view->config->show_flatten_table = false;
        $view->config->show_pivot_by_subtable = false;
        $view->config->show_insights = false;
        $view->config->show_pie_chart = false;
        $view->config->show_bar_chart = false;
        $view->config->show_tag_cloud = false;
        $view->config->show_all_views_icons = false;
        $view->config->show_search = false;
        $view->config->show_title = false;
        $view->config->show_limit_control = false;
        $view->config->show_export_as_image_icon = false;
        $view->config->show_export_as_rss_feed = false;
        $view->config->show_export = false;
        $view->config->show_pagination_control = false;
        $view->config->show_offset_information = false;
        $view->requestConfig->filter_limit = 10;
        $view->requestConfig->request_parameters_to_modify['report_type'] = $report['report_type'];
        $view->requestConfig->request_parameters_to_modify['metrics'] = $report['metrics'];
        $view->requestConfig->request_parameters_to_modify['totals'] = 0;
        if (!empty($report['dimensions'])) {
            $view->requestConfig->request_parameters_to_modify['dimensions'] = $report['dimensions'];
        }

        return $view->render();
    }

    private function getReportDataTable(?array $report, string $date, Site $site, string $period, ?string &$periodObject, ?\DateTime $startDateObj, ?\DateTime $endDateObj): DataTable
    {
        if ($period === 'range') {
            $periodObject = PeriodFactory::build('range', $date, $site->getTimezone());
        } else {
            $periodObject = PeriodFactory::makePeriodFromQueryParams($site->getTimezone(), $period, $date);
        }
        $parameters = new ArchiveProcessor\Parameters($site, $periodObject, new Segment('', [$this->idSite]));
        $archiveWriter = new ArchiveWriter($parameters);
        $logAggregator = new CustomLogAggregator($parameters);
        if ($startDateObj && $endDateObj && $period === 'range') {
            $logAggregator->setDateStart(Date::factory($startDateObj->getTimestamp()));
            $logAggregator->setDateEnd(Date::factory($endDateObj->getTimestamp()));
        }

        $processor = new ArchiveProcessor($parameters, $archiveWriter, $logAggregator);

        $dataTable = null;
        if (!empty($report)) {
            $recordBuilder = new CustomReport($report, StaticContainer::get(DimensionsProvider::class), StaticContainer::get(Configuration::class));
            $dataTables = $recordBuilder->aggregate($processor);
            $dataTable = reset($dataTables);
        }

        if (!$dataTable) {
            throw new \Exception('Invalid report information');
        }

        return $dataTable;
    }

    private function searchDescendentsForSubtable(DataTable $dataTable, int $idSubtable): ?DataTable
    {
        foreach ($dataTable->getRows() as $row) {
            $subTable = $row->getSubtable();
            if ($subTable) {
                $row = $subTable->getRowFromIdSubDataTable($idSubtable);
                if ($row) {
                    return $row->getSubtable();
                }

                // Recursively search further descendents
                $searchResult = $this->searchDescendentsForSubtable($subTable, $idSubtable);
                if ($searchResult !== null) {
                    return $searchResult;
                }
            }
        }

        return null;
    }

    /**
     * Renders an evolution graph visualization.
     * @return string|void
     */
    public function getEvolutionGraph()
    {
        $this->checkSitePermission();
        $this->validator->checkReportViewPermission($this->idSite);

        if (empty($columns)) {
            $columns = Common::getRequestVar('columns', false);
            if (false !== $columns) {
                $columns = Piwik::getArrayFromApiParameter($columns);
            }
        }

        $report = new GetCustomReport();
        $documentation = $report->getDocumentation();

        $selectableColumns = array_keys($report->getMetrics());

        if (empty($columns) && !empty($selectableColumns) && count($selectableColumns) <= 4) {
            // pre-select all columns when there are only 4 columns
            $columns = $selectableColumns;
        } elseif (empty($columns) && !empty($selectableColumns)) {
            // pre-select only first column when there are more than 5 columns
            $columns = array(reset($selectableColumns));
        }

        // Use getCustomReport as the controller action so that the apiMethod and currentControllerAction match
        // This is important so that the stored viewDataTableParameters values for the report are used
        $view = $this->getLastUnitGraphAcrossPlugins(
            $this->pluginName,
            'getCustomReport',
            $columns,
            $selectableColumns,
            $documentation,
            'CustomReports.getCustomReport'
        );

        if (empty($view->config->columns_to_display) && $report->getDefaultSortColumn()) {
            $view->config->columns_to_display = array($report->getDefaultSortColumn());
        }

        return $this->renderView($view);
    }
}
