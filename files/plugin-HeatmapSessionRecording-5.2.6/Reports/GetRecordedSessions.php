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

namespace Piwik\Plugins\HeatmapSessionRecording\Reports;

use Piwik\API\Request;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\Metrics\Formatter;
use Piwik\Period\Factory as PeriodFactory;
use Piwik\Piwik;
use Piwik\Plugin\Report;
use Piwik\Plugin\ViewDataTable;
use Piwik\Plugins\CoreVisualizations\Visualizations\HtmlTable;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\BaseMetric;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\Browser;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\Device;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\Location;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\OperatingSystem;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\SessionTime;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\TimeOnPage;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\TimeOnSite;
use Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics\TotalEvents;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\DataTable\Filter\EnrichRecordedSessions;
use Piwik\Plugins\HeatmapSessionRecording\HeatmapSessionRecording;
use Piwik\Plugins\HeatmapSessionRecording\SystemSettings;
use Piwik\Plugins\Intl\DateTimeFormatProvider;
use Piwik\Report\ReportWidgetFactory;
use Piwik\Url;
use Piwik\View;
use Piwik\Widget\WidgetsList;

class GetRecordedSessions extends Report
{
    protected function init()
    {
        parent::init();

        $this->categoryId = 'HeatmapSessionRecording_SessionRecordings';
        $this->name          = Piwik::translate('HeatmapSessionRecording_SessionRecordings');
        $this->dimension     = null;
        $this->documentation = Piwik::translate('HeatmapSessionRecording_ReportRecordedSessionsDocumentation');

        $this->metrics = array(
            'server_time',
            'idloghsr',
            'time_on_site',
            'nb_pageviews',
            'config_os',
            'config_device_type',
            'config_device_model',
            'config_browser_name',
        );
        $this->processedMetrics = array();
        $this->actionToLoadSubTables = $this->action;

        $this->order = 1;
    }

    private function getValidator()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
    }


    public function configureView(ViewDataTable $view)
    {
        $view->requestConfig->filter_limit = 100;

        if ($view->isViewDataTableId(HtmlTable::ID)) {
            $view->config->disable_row_evolution = true;
        }

        $view->config->documentation = $this->documentation;

        if (!empty($_GET['filter_sort_column'])) {
            // because we show html in reporting ui we cannot use processed metrics and we need to map it therefore
            // manually

            $paramsToFixSort = array(
                'os' => 'config_os',
                'device' => 'config_device_type',
                'browser' => 'config_browser_name',
                'location' => 'country',
            );
            $sort = $_GET['filter_sort_column'];

            if (isset($paramsToFixSort[$sort])) {
                $_GET['filter_sort_column'] = $paramsToFixSort[$sort];
            }
            $view->config->filters[] = function () use ($view, $sort, $paramsToFixSort) {
                if (isset($paramsToFixSort[$sort])) {
                    // we make sure correct column will be selected (sort icon)
                    $_GET['filter_sort_column'] = $sort;
                    return;
                }
                $key = array_search($sort, $paramsToFixSort);
                if ($key !== false) {
                    $_GET['filter_sort_column'] = $key;
                }
            };
        }

        if (property_exists($view->config, 'show_totals_row')) {
            // since Matomo 3.7 for htmltables
            $view->config->show_totals_row = false;
        }

        $view->config->show_all_views_icons = false;
        $view->config->show_exclude_low_population = false;
        $view->config->show_table_all_columns = false;
        $view->config->show_table = false;
        $view->config->show_flatten_table = false;
        $view->config->show_search = false;
        $view->config->metrics_documentation['resolution'] = Piwik::translate('HeatmapSessionRecording_ColumnResolutionDocumentation');
        $view->config->addTranslation('resolution', Piwik::translate('Resolution_ColumnResolution'));
        $view->config->no_data_message = Piwik::translate(HeatmapSessionRecording::getTranslationKey('noDataSession'));

        $idSubtable = Common::getRequestVar('idSubtable', 0, 'int');

        $idSite = Common::getRequestVar('idSite', 0, 'int');
        $idSiteHsr = Common::getRequestVar('idSiteHsr', 0, 'int');
        if (!empty($idSite) && !empty($idSiteHsr)) {
            $model = StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel');
            $recording = Request::processRequest('HeatmapSessionRecording.getSessionRecording', [
                'idSite' => $idSite,
                'idSiteHsr' => $idSiteHsr,
            ], $default = []);

            if (!empty($recording)) {
                $requestDate = $model->getPiwikRequestDate($recording);

                if (!PeriodFactory::isPeriodEnabledForAPI($requestDate['period'])) {
                    $requestDate['period'] = Common::getRequestVar('period', $requestDate['period'], 'string');
                    $requestDate['date'] = Common::getRequestVar('date', $requestDate['date'], 'string');
                }

                // we want to fetch all recordings
                $view->requestConfig->request_parameters_to_modify['period'] = $requestDate['period'];
                $view->requestConfig->request_parameters_to_modify['date'] = $requestDate['date'];
                $view->requestConfig->request_parameters_to_modify['idSiteHsr'] = (int)$idSiteHsr;

                if (empty($idSubtable)) {
                    if ($this->getValidator()->canWrite($idSite)) {
                        $view->config->title_edit_entity_url = 'index.php' . Url::getCurrentQueryStringWithParametersModified(array(
                                'module' => 'HeatmapSessionRecording',
                                'action' => 'manageSessions'
                            )) . '#?idSiteHsr=' . (int)$idSiteHsr;
                    }

                    $view->config->title = Piwik::translate('HeatmapSessionRecording_SessionRecordingX', '"' . $recording['name'] . '"');

                    if ($recording['status'] == SiteHsrDao::STATUS_ACTIVE) {
                        $view->config->show_footer_message = Piwik::translate('HeatmapSessionRecording_RecordedSessionsDocStatusActive', array($recording['sample_limit'], $recording['sample_rate'] . '%'));
                    } elseif ($recording['status'] == SiteHsrDao::STATUS_ENDED) {
                        $view->config->show_footer_message = Piwik::translate('HeatmapSessionRecording_RecordedSessionsDocStatusEnded');
                    }
                }
            }
        }

        $report = $this;

        if (empty($idSubtable)) {
            $view->config->addTranslation('label', Piwik::translate('HeatmapSessionRecording_ColumnLabelRecordedSessions'));
        } else {
            $view->config->addTranslation('label', 'URL');
            $view->config->enable_sort = false;
            $view->requestConfig->filter_sort_column = 'server_time';
            $view->requestConfig->filter_sort_order = 'asc';
            $_GET['filter_sort_column'] = 'server_time';
            $_GET['filter_sort_order'] = 'asc';
        }

        $view->config->metrics_documentation['nb_pageviews'] = Piwik::translate('HeatmapSessionRecording_ColumnPageviewsDocumentation');

        $validator = StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
        $view->config->custom_parameters['writeAccess'] = $validator->canWrite($idSite);

        $view->config->filters[] = function (DataTable $table) use ($report, $view, $idSiteHsr, $idSubtable) {
            // we need to handle the metrics manually and cannot use processed metrics!
            // this is because we "merge" columns in those metrics using arrays (compute() returns sometimes arrays)
            // returning arrays in compute() wouldn't work in UI tests so we do it here manually and in API always return
            // raw response. This way the API response is also more usable as the HTML those methods return is only
            // interesting for us when visualizing it

            if (empty($idSubtable)) {
                $metrics = array(new TotalEvents(), new TimeOnSite(), new Location(), new Browser(),
                    new Device(), new OperatingSystem(), new SessionTime(DateTimeFormatProvider::DATETIME_FORMAT_SHORT));
            } else {
                $metrics = array(new TimeOnPage(), new SessionTime(DateTimeFormatProvider::TIME_FORMAT));
            }

            $formatter = new Formatter();

            foreach ($table->getRowsWithoutSummaryRow() as $row) {
                $row->setMetadata('idvisitor', $row->getColumn('idvisitor'));
                $row->setMetadata('idsitehsr', $idSiteHsr);
                $row->setMetadata('idloghsr', $row->getColumn('idloghsr'));

                if (empty($idSubtable)) {
                    $row->setMetadata('idvisit', $row->getColumn('idvisit'));
                }

                if (!empty($idSubtable)) {
                    $label = $row->getColumn('label');
                    $row->setMetadata('url', $label);
                    $row->setColumn('label', EnrichRecordedSessions::shortUrl($label));
                } elseif ($row->getColumn('nb_pageviews') == 1) {
                    $firstUrl = $row->getColumn('first_url');
                    $row->setColumn('label', EnrichRecordedSessions::shortUrl($firstUrl));
                    $row->setMetadata('url', $firstUrl);
                    $row->setNonLoadedSubtableId(null); // no need to have it expandable I reckon
                } else {
                    $firstUrl = EnrichRecordedSessions::shortUrl($row->getColumn('first_url'));
                    $lastUrl = EnrichRecordedSessions::shortUrl($row->getColumn('last_url'));
                    $row->setColumn('label', $firstUrl . ' → ' . $lastUrl);
                }
            }

            foreach ($metrics as $processedMetric) {
                /** @var BaseMetric $processedMetric */
                $name = $processedMetric->getName();
                $view->config->addTranslation($name, $processedMetric->getTranslatedName());

                $documentation =  $processedMetric->getDocumentation();
                if (!empty($documentation)) {
                    $view->config->metrics_documentation[$name] = $documentation;
                }

                if (!$processedMetric->beforeCompute($report, $table)) {
                    continue;
                }

                $doFormat = $processedMetric->beforeFormat($report, $table);

                foreach ($table->getRowsWithoutSummaryRow() as $row) {
                    $value = $row->getColumn($name);
                    if ($value === false) {
                        // only compute the metric if it has not been computed already
                        $value = $processedMetric->compute($row);
                    }
                    if ($doFormat) {
                        $value = $processedMetric->format($value, $formatter);
                    }

                    if ($processedMetric->showsHtml() && $value !== false) {
                        $row->setColumn($name, ' ');
                        $row->setMetadata('html_column_' . $name . '_prefix', $value);
                    } else {
                        $row->setColumn($name, $value);
                    }
                }
            }
        };

        if (!empty($idSubtable)) {
            $view->config->columns_to_display = array(
                'label',
                'server_time',
                'time_on_page',
                'resolution'
            );
        } else {
            $systemSettings = StaticContainer::get(SystemSettings::class);
            $includedCountries = $systemSettings->getIncludedCountries();
            $headerMessage = '';
            if (!HeatmapSessionRecording::isMatomoJsWritable()) {
                $headerMessage .= '<div class="alert alert-warning">' .
                    Piwik::translate('HeatmapSessionRecording_MatomoJSNotWritableErrorMessage', [
                        Piwik::translate('HeatmapSessionRecording_SessionRecordings'),
                        '<a href="https://developer.matomo.org/guides/heatmap-session-recording/setup#when-the-matomojs-in-your-piwik-directory-file-is-not-writable" target="_blank" rel="noreferrer noopener">',
                        '</a>'
                    ]) . '</div>';
            }
            if (!empty($includedCountries)) {
                $headerMessage .= '<div class="alert alert-info heatmap-country-alert">' . Piwik::translate('HeatmapSessionRecording_SessionRecordingInfoTrackVisitsFromCountries', [implode(', ', $includedCountries)]) . '</div>';
            }
            $detectAdBlockerView = new View('@HeatmapSessionRecording/_detectAdBlocker');
            $detectAdBlockerView->type = 'Session recordings';
            $headerMessage .= $detectAdBlockerView->render();
            if ($headerMessage) {
                $view->config->show_header_message = $headerMessage;
            }

            $view->config->columns_to_display = array(
                'label',
                'nb_pageviews',
                'total_events',
                'server_time',
                'time_on_site',
                'location',
                'device',
                'os',
                'browser',
            );
        }
    }

    public function alwaysUseDefaultViewDataTable()
    {
        return true;
    }

    public function configureWidgets(WidgetsList $widgetsList, ReportWidgetFactory $factory)
    {
        $idSite = Common::getRequestVar('idSite', $default = 0, 'int');

        if ($this->getValidator()->canViewSessionReport($idSite)) {
            $recordings = Request::processRequest('HeatmapSessionRecording.getSessionRecordings', [
                'idSite' => $idSite, 'filter_limit' => -1
            ], $default = []);

            foreach ($recordings as $recording) {
                $widget = $factory->createWidget();
                $widget->setName(sprintf('Session recording "%s"', $recording['name']));
                $widget->setSubcategoryId($recording['idsitehsr']);
                $widget->setIsNotWidgetizable();
                $widget->setParameters(array('idSiteHsr' => $recording['idsitehsr']));
                $widgetsList->addWidgetConfig($widget);
            }
        }
    }

    public function configureReportMetadata(&$availableReports, $infos)
    {
        // disabled for now
    }
}
