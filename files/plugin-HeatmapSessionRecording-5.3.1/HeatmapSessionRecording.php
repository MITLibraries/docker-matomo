<?php

/**
 * Plugin Name: Heatmap & Session Recording for Matomo
 * Description: Truly understand your visitors by seeing where they click, hover, type and scroll. Replay their actions in a video and ultimately increase conversions
 * Author: InnoCraft
 * Author URI: https://www.innocraft.com
 * Version: 5.3.1
 * License: InnoCraft EULA
 * License URI: https://www.innocraft.com/license
 * Plugin URI: https://plugins.matomo.org/HeatmapSessionRecording
 *
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

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\API\Request;
use Piwik\Category\Subcategory;
use Piwik\Common;
use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\DataTable\Row;
use Piwik\Piwik;
use Piwik\Plugin\Manager;
use Piwik\Plugins\CoreHome\SystemSummary;
use Piwik\Plugins\CustomJsTracker\File;
use Piwik\Plugins\HeatmapSessionRecording\Archiver\Aggregator;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrEvent;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrBlob;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\Install\HtAccess;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\HsrMatcher;
use Piwik\Session;
use Piwik\SettingsPiwik;
use Piwik\SettingsServer;
use Piwik\Tracker\TrackerCodeGenerator;
use Piwik\Widget\WidgetConfig;
use Piwik\Plugin;
use WpMatomo\Admin\Menu;
use WpMatomo\Bootstrap;
use WpMatomo\Site;

if (
    defined('ABSPATH')
    && function_exists('add_action')
) {
    $path = '/matomo/app/core/Plugin.php';
    if (defined('WP_PLUGIN_DIR') && WP_PLUGIN_DIR && file_exists(WP_PLUGIN_DIR . $path)) {
        require_once WP_PLUGIN_DIR . $path;
    } elseif (defined('WPMU_PLUGIN_DIR') && WPMU_PLUGIN_DIR && file_exists(WPMU_PLUGIN_DIR . $path)) {
        require_once WPMU_PLUGIN_DIR . $path;
    } else {
        return;
    }
    add_action('plugins_loaded', function () {
        if (function_exists('matomo_add_plugin')) {
            matomo_add_plugin(__DIR__, __FILE__);
        }
    });

    add_filter('matomo_install_tables', function ($tables) {
        $tables[] = 'site_hsr';
        $tables[] = 'log_hsr';
        $tables[] = 'log_hsr_blob';
        $tables[] = 'log_hsr_event';
        $tables[] = 'log_hsr_site';
        return $tables;
    }, 10, 1);

    add_filter('post_row_actions', __NAMESPACE__ . '\add_new_heat_map_link', 10, 2);
    add_filter('post_row_actions', __NAMESPACE__ . '\add_view_heat_map_link', 10, 2);

    add_filter('page_row_actions', __NAMESPACE__ . '\add_new_heat_map_link', 10, 2);
    add_filter('page_row_actions', __NAMESPACE__ . '\add_view_heat_map_link', 10, 2);

    add_action('rest_api_init', function () {
        if (
            !is_plugin_active('matomo/matomo.php')
            || !class_exists('\WpMatomo\API')
        ) {
            return;
        }

        $api = new \WpMatomo\API();
        $api->register_route('HeatmapSessionRecording', 'getHeatmap');
        $api->register_route('HeatmapSessionRecording', 'getHeatmaps');
        $api->register_route('HeatmapSessionRecording', 'getRecordedHeatmapMetadata');
        $api->register_route('HeatmapSessionRecording', 'getRecordedHeatmap');

        $api->register_route('HeatmapSessionRecording', 'getSessionRecording');
        $api->register_route('HeatmapSessionRecording', 'getSessionRecordings');
        $api->register_route('HeatmapSessionRecording', 'getRecordedSessions');
        $api->register_route('HeatmapSessionRecording', 'getRecordedSession');
    });

    /**
     * @param array $actions
     * @param \WP_Post $post
     *
     * @return mixed
     */
    function add_new_heat_map_link($actions, $post)
    {
        if (
            !$post
            || !is_plugin_active('matomo/matomo.php')
            || !current_user_can('write_matomo')
        ) {
            return $actions;
        }

        if ($post->post_status !== 'publish') {
            // the permalink url wouldn't be correct yet for unpublished post
            return $actions;
        }

        $postUrl = get_permalink($post);
        $rules = array(array(
            'attribute' => 'url',
            'type' => 'equals_simple',
            'inverted' => 0,
            'value' => $postUrl
        ));

        $hsrParams = array(
            'idSite' => 1,
            'idSiteHsr' => 0,
            'name' => $post->post_title,
            // Encoded to avoid pitfalls of decoding multi-dimensional array URL params in JavaScript
            'matchPageRules' => json_encode($rules)
        );

        $url = Menu::get_matomo_reporting_url(
            'HeatmapSessionRecording_Heatmaps',
            'HeatmapSessionRecording_ManageHeatmaps',
            $hsrParams
        );

        $actions['create_heatmap'] = '<a target="_blank" href="' . esc_url($url) . '">Create Heatmap</a>';
        return $actions;
    }

    function get_matomo_heatmaps()
    {
        static $heatmaps_cached;

        global $wpdb;

        if (!isset($heatmaps_cached)) {
            $site = new Site();
            $idsite = $site->get_current_matomo_site_id();

            if (!$idsite) {
                $heatmaps_cached = array(); // prevent it not being executed again
            } else {
                $wpDbSettings = new \WpMatomo\Db\Settings();
                $tableName = $wpDbSettings->prefix_table_name('site_hsr');
                $idsite = (int) $idsite;// needed cause we don't bind parameters below

                $heatmaps_cached = $wpdb->get_results(
                    "select * from $tableName WHERE record_type = 1 AND idsite = $idsite AND status != 'deleted'",
                    ARRAY_A
                );
            }
        }
        return $heatmaps_cached;
    }

    /**
     * @param array $actions
     * @param \WP_Post $post
     *
     * @return mixed
     */
    function add_view_heat_map_link($actions, $post)
    {
        if (
            !$post
            || !is_plugin_active('matomo/matomo.php')
            || !current_user_can('write_matomo')
        ) {
            return $actions;
        }

        $heatmaps = get_matomo_heatmaps();

        if (empty($heatmaps)) {
            return $actions;
        }

        $postUrl = get_permalink($post);

        if (!$postUrl) {
            return $actions;
        }

        if (class_exists(Bootstrap::class)) {
            Bootstrap::do_bootstrap();
        }

        require_once('Tracker/PageRuleMatcher.php');
        require_once('Tracker/HsrMatcher.php');

        $heatmaps = array_values(array_filter($heatmaps, function ($heatmap) use ($postUrl) {
            $systemSettings = StaticContainer::get(SystemSettings::class);
            $includedCountries = $systemSettings->getIncludedCountries();
            return HsrMatcher::matchesAllPageRules(json_decode($heatmap['match_page_rules'], true), $postUrl) && HsrMatcher::isIncludedCountry($includedCountries);
        }));

        $numMatches = count($heatmaps);
        foreach ($heatmaps as $i => $heatmap) {
            $url = Menu::get_matomo_reporting_url(
                'HeatmapSessionRecording_Heatmaps',
                $heatmap['idsitehsr'],
                array()
            );
            $linkText = 'View Heatmap';
            if ($numMatches > 1) {
                $linkText .= ' #' . ($i + 1);
            }
            $actions['view_heatmap_' . $i] =
                '<a target="_blank" title="' . esc_attr($heatmap['name']) . '" href="' . esc_url($url) . '">' . esc_html($linkText) . '</a>';
        }

        return $actions;
    }
}

class HeatmapSessionRecording extends \Piwik\Plugin
{
    public const EMBED_SESSION_TIME = 43200; // half day in seconds
    public const ULR_PARAM_FORCE_SAMPLE = 'pk_hsr_forcesample';
    public const ULR_PARAM_FORCE_CAPTURE_SCREEN = 'pk_hsr_capturescreen';
    public const EMBED_SESSION_NAME = 'HSR_EMBED_SESSID';

    public const TRACKER_READY_HOOK_NAME = '/*!! hsrTrackerReadyHook */';
    public const TRACKER_READY_HOOK_NAME_WHEN_MINIFIED = '/*!!! hsrTrackerReadyHook */';

    public function registerEvents()
    {
        return array(
            'Db.getActionReferenceColumnsByTable' => 'addActionReferenceColumnsByTable',
            'Tracker.Cache.getSiteAttributes'  => 'addSiteTrackerCache',
            'AssetManager.getStylesheetFiles' => 'getStylesheetFiles',
            'AssetManager.getJavaScriptFiles' => 'getJsFiles',
            'Translate.getClientSideTranslationKeys' => 'getClientSideTranslationKeys',
            'Template.jsGlobalVariables' => 'addJsGlobalVariables',
            'Category.addSubcategories' => 'addSubcategories',
            'SitesManager.deleteSite.end' => 'onDeleteSite',
            'Tracker.PageUrl.getQueryParametersToExclude' => 'getQueryParametersToExclude',
            'Widget.addWidgetConfigs' => 'addWidgetConfigs',
            'System.addSystemSummaryItems' => 'addSystemSummaryItems',
            'API.HeatmapSessionRecording.addHeatmap.end' => 'updatePiwikTracker',
            'API.HeatmapSessionRecording.addSessionRecording.end' => 'updatePiwikTracker',
            'CustomJsTracker.shouldAddTrackerFile' => 'shouldAddTrackerFile',
            'Updater.componentUpdated' => 'installHtAccess',
            'Live.visitorLogViewBeforeActionsInfo' => 'visitorLogViewBeforeActionsInfo',
            'Widgetize.shouldEmbedIframeEmpty'  => 'shouldEmbedIframeEmpty',
            'Session.beforeSessionStart' => 'changeSessionLengthIfEmbedPage',
            'TwoFactorAuth.requiresTwoFactorAuthentication' => 'requiresTwoFactorAuthentication',
            'API.getPagesComparisonsDisabledFor'     => 'getPagesComparisonsDisabledFor',
            'CustomJsTracker.manipulateJsTracker'  => 'disableHeatmapsDefaultIfNeeded',
            'AssetManager.addStylesheets' => [
                'function' => 'addStylesheets',
                'after' => true,
            ],
            'Db.getTablesInstalled' => 'getTablesInstalled',
        );
    }

    public function disableHeatmapsDefaultIfNeeded(&$content)
    {
        $settings = StaticContainer::get(SystemSettings::class);
        if ($settings->disableTrackingByDefault->getValue()) {
            $replace = 'Matomo.HeatmapSessionRecording._setDisabled();';
        } else {
            $replace = '';
        }

        $content = str_replace(array(self::TRACKER_READY_HOOK_NAME_WHEN_MINIFIED, self::TRACKER_READY_HOOK_NAME), $replace, $content);
    }

    /**
     * Register the new tables, so Matomo knows about them.
     *
     * @param array $allTablesInstalled
     */
    public function getTablesInstalled(&$allTablesInstalled)
    {
        $allTablesInstalled[] = Common::prefixTable('log_hsr');
        $allTablesInstalled[] = Common::prefixTable('log_hsr_blob');
        $allTablesInstalled[] = Common::prefixTable('log_hsr_event');
        $allTablesInstalled[] = Common::prefixTable('log_hsr_site');
        $allTablesInstalled[] = Common::prefixTable('site_hsr');
    }

    public static function getPathPrefix()
    {
        $webRootDirs = Manager::getInstance()->getWebRootDirectoriesForCustomPluginDirs();
        if (!empty($webRootDirs['HeatmapSessionRecording'])) {
            $baseUrl = trim($webRootDirs['HeatmapSessionRecording'], '/');
        } else {
            $baseUrl = 'plugins';
        }
        return $baseUrl;
    }

    public static function isMatomoForWordPress()
    {
        return defined('ABSPATH') && function_exists('add_action');
    }

    public function addStylesheets(&$mergedContent)
    {
        if (self::isMatomoForWordPress()) {
            // we hide this icon since it uses the widgetize feature which is disabled in WordPress
            $mergedContent .= '.manageHsr .action .icon-show { display: none; }';
        }
    }
    public function getPagesComparisonsDisabledFor(&$pages)
    {
        $pages[] = 'HeatmapSessionRecording_Heatmaps.*';
        $pages[] = 'HeatmapSessionRecording_SessionRecordings.*';
    }

    public function addJsGlobalVariables()
    {
        $idSite = Common::getRequestVar('idSite', 0, 'int');

        if ($idSite > 0 && Piwik::isUserHasWriteAccess($idSite)) {
            echo 'piwik.heatmapWriteAccess = true;';
        } else {
            echo 'piwik.heatmapWriteAccess = false;';
        }
    }

    public function requiresTwoFactorAuthentication(&$requiresAuth, $module, $action, $parameters)
    {
        if ($module == 'HeatmapSessionRecording' && $action === 'embedPage') {
            $requiresAuth = false;
        }
    }

    public function shouldEmbedIframeEmpty(&$shouldEmbedEmpty, $controllerName, $actionName)
    {
        if ($controllerName == 'HeatmapSessionRecording' && ($actionName == 'replayRecording' || $actionName == 'embedPage')) {
            $shouldEmbedEmpty = true;
        }
    }

    /**
     * Fallback to add play session link for Matomo < 3.1.0
     *
     * NOTE: TO BE REMOVED EG FROM FEBRUARY OR MARCH 2018
     *
     * @param string $out
     * @param Row $visitor
     */
    public function visitorLogViewBeforeActionsInfo(&$out, $visitor)
    {
        if (class_exists('\\Piwik\\Plugins\\Live\\VisitorDetailsAbstract')) {
            return;
        }

        $idVisit = $visitor->getColumn('idVisit');
        $idSite = (int) $visitor->getColumn('idSite');

        if (empty($idSite) || empty($idVisit) || !$this->getValidator()->canViewSessionReport($idSite)) {
            return;
        }

        $aggregator = new Aggregator();
        $recording = $aggregator->findRecording($idVisit);
        if (!empty($recording['idsitehsr'])) {
            $title = Piwik::translate('HeatmapSessionRecording_ReplayRecordedSession');
            $out .= '<a class="visitorLogReplaySession" href="?module=HeatmapSessionRecording&action=replayRecording&idSite=' . $idSite . '&idLogHsr=' . (int)$recording['idloghsr'] . '&idSiteHsr=' . (int) $recording['idsitehsr'] . '"
target="_blank" rel="noreferrer noopener"><span class="icon-play"></span> ' . $title . '</a><br />';
        }
    }

    public function shouldAddTrackerFile(&$shouldAdd, $pluginName)
    {
        if ($pluginName === 'HeatmapSessionRecording') {
            $config = new Configuration();

            $siteHsrDao = $this->getSiteHsrDao();
            if ($config->shouldOptimizeTrackingCode() && !$siteHsrDao->hasActiveRecordsAcrossSites()) {
                // saves requests to configs.php while no heatmap or session recording configured.
                $shouldAdd = false;
            }
        }
    }

    public function updatePiwikTracker()
    {
        if (Plugin\Manager::getInstance()->isPluginActivated('CustomJsTracker')) {
            $trackerUpdater = StaticContainer::get('Piwik\Plugins\CustomJsTracker\TrackerUpdater');
            if (!empty($trackerUpdater)) {
                $trackerUpdater->update();
            }
        }
    }

    public function addSystemSummaryItems(&$systemSummary)
    {
        $dao = $this->getSiteHsrDao();
        $numHeatmaps = $dao->getNumRecordsTotal(SiteHsrDao::RECORD_TYPE_HEATMAP);
        $numSessions = $dao->getNumRecordsTotal(SiteHsrDao::RECORD_TYPE_SESSION);

        $systemSummary[] = new SystemSummary\Item(
            $key = 'heatmaps',
            Piwik::translate('HeatmapSessionRecording_NHeatmaps', $numHeatmaps),
            $value = null,
            array('module' => 'HeatmapSessionRecording', 'action' => 'manageHeatmap'),
            $icon = 'icon-drop',
            $order = 6
        );
        $systemSummary[] = new SystemSummary\Item(
            $key = 'sessionrecordings',
            Piwik::translate('HeatmapSessionRecording_NSessionRecordings', $numSessions),
            $value = null,
            array('module' => 'HeatmapSessionRecording', 'action' => 'manageSessions'),
            $icon = 'icon-play',
            $order = 7
        );
    }

    public function getQueryParametersToExclude(&$parametersToExclude)
    {
        // these are used by the tracker
        $parametersToExclude[] = self::ULR_PARAM_FORCE_CAPTURE_SCREEN;
        $parametersToExclude[] = self::ULR_PARAM_FORCE_SAMPLE;
    }

    public function onDeleteSite($idSite)
    {
        $model = $this->getSiteHsrModel();
        $model->deactivateRecordsForSite($idSite);
    }

    private function getSiteHsrModel()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel');
    }

    private function getValidator()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
    }

    public function addWidgetConfigs(&$configs)
    {
        $idSite = Common::getRequestVar('idSite', 0, 'int');

        if (!$this->getValidator()->canViewHeatmapReport($idSite)) {
            return;
        }

        $heatmaps = $this->getHeatmaps($idSite);

        foreach ($heatmaps as $heatmap) {
            $widget = new WidgetConfig();
            $widget->setCategoryId('HeatmapSessionRecording_Heatmaps');
            $widget->setSubcategoryId($heatmap['idsitehsr']);
            $widget->setModule('HeatmapSessionRecording');
            $widget->setAction('showHeatmap');
            $widget->setParameters(array('idSiteHsr' => $heatmap['idsitehsr']));
            $widget->setIsNotWidgetizable();
            $configs[] = $widget;
        }
    }

    public function addSubcategories(&$subcategories)
    {
        $idSite = Common::getRequestVar('idSite', 0, 'int');

        if (empty($idSite)) {
            // fallback for eg API.getReportMetadata which uses idSites
            $idSite = Common::getRequestVar('idSites', 0, 'int');

            if (empty($idSite)) {
                return;
            }
        }

        if ($this->getValidator()->canViewHeatmapReport($idSite)) {
            $heatmaps = $this->getHeatmaps($idSite);

            // we list recently created heatmaps first
            $order = 20;
            foreach ($heatmaps as $heatmap) {
                $subcategory = new Subcategory();
                $subcategory->setName($heatmap['name']);
                $subcategory->setCategoryId('HeatmapSessionRecording_Heatmaps');
                $subcategory->setId($heatmap['idsitehsr']);
                $subcategory->setOrder($order++);
                $subcategories[] = $subcategory;
            }
        }

        if ($this->getValidator()->canViewSessionReport($idSite)) {
            $recordings = $this->getSessionRecordings($idSite);

            // we list recently created recordings first
            $order = 20;
            foreach ($recordings as $recording) {
                $subcategory = new Subcategory();
                $subcategory->setName($recording['name']);
                $subcategory->setCategoryId('HeatmapSessionRecording_SessionRecordings');
                $subcategory->setId($recording['idsitehsr']);
                $subcategory->setOrder($order++);
                $subcategories[] = $subcategory;
            }
        }
    }

    public function getClientSideTranslationKeys(&$result)
    {
        $result[] = 'General_Save';
        $result[] = 'General_Done';
        $result[] = 'General_Actions';
        $result[] = 'General_Yes';
        $result[] = 'General_No';
        $result[] = 'General_Add';
        $result[] = 'General_Remove';
        $result[] = 'General_Id';
        $result[] = 'General_Ok';
        $result[] = 'General_Cancel';
        $result[] = 'General_Name';
        $result[] = 'General_Loading';
        $result[] = 'General_LoadingData';
        $result[] = 'General_Mobile';
        $result[] = 'General_All';
        $result[] = 'General_Search';
        $result[] = 'CorePluginsAdmin_Status';
        $result[] = 'DevicesDetection_Tablet';
        $result[] = 'CoreUpdater_UpdateTitle';
        $result[] = 'DevicesDetection_Device';
        $result[] = 'Installation_Legend';
        $result[] = 'HeatmapSessionRecording_DeleteScreenshot';
        $result[] = 'HeatmapSessionRecording_DeleteHeatmapScreenshotConfirm';
        $result[] = 'HeatmapSessionRecording_enable';
        $result[] = 'HeatmapSessionRecording_disable';
        $result[] = 'HeatmapSessionRecording_ChangeReplaySpeed';
        $result[] = 'HeatmapSessionRecording_ClickToSkipPauses';
        $result[] = 'HeatmapSessionRecording_AutoPlayNextPageview';
        $result[] = 'HeatmapSessionRecording_XSamples';
        $result[] = 'HeatmapSessionRecording_StatusActive';
        $result[] = 'HeatmapSessionRecording_StatusEnded';
        $result[] = 'HeatmapSessionRecording_StatusPaused';
        $result[] = 'HeatmapSessionRecording_RequiresActivity';
        $result[] = 'HeatmapSessionRecording_RequiresActivityHelp';
        $result[] = 'HeatmapSessionRecording_CaptureKeystrokes';
        $result[] = 'HeatmapSessionRecording_CaptureKeystrokesHelp';
        $result[] = 'HeatmapSessionRecording_SessionRecording';
        $result[] = 'HeatmapSessionRecording_Heatmap';
        $result[] = 'HeatmapSessionRecording_ActivityClick';
        $result[] = 'HeatmapSessionRecording_ActivityMove';
        $result[] = 'HeatmapSessionRecording_ActivityScroll';
        $result[] = 'HeatmapSessionRecording_ActivityResize';
        $result[] = 'HeatmapSessionRecording_ActivityFormChange';
        $result[] = 'HeatmapSessionRecording_ActivityPageChange';
        $result[] = 'HeatmapSessionRecording_HeatmapWidth';
        $result[] = 'HeatmapSessionRecording_Width';
        $result[] = 'HeatmapSessionRecording_Action';
        $result[] = 'HeatmapSessionRecording_DeviceType';
        $result[] = 'HeatmapSessionRecording_PlayerDurationXofY';
        $result[] = 'HeatmapSessionRecording_PlayerPlay';
        $result[] = 'HeatmapSessionRecording_PlayerPause';
        $result[] = 'HeatmapSessionRecording_PlayerRewindFast';
        $result[] = 'HeatmapSessionRecording_PlayerForwardFast';
        $result[] = 'HeatmapSessionRecording_PlayerReplay';
        $result[] = 'HeatmapSessionRecording_PlayerPageViewPrevious';
        $result[] = 'HeatmapSessionRecording_PlayerPageViewNext';
        $result[] = 'HeatmapSessionRecording_SessionRecordingsUsageBenefits';
        $result[] = 'HeatmapSessionRecording_ManageSessionRecordings';
        $result[] = 'HeatmapSessionRecording_ManageHeatmaps';
        $result[] = 'HeatmapSessionRecording_NoSessionRecordingsFound';
        $result[] = 'HeatmapSessionRecording_FieldIncludedTargetsHelpSessions';
        $result[] = 'HeatmapSessionRecording_NoHeatmapsFound';
        $result[] = 'HeatmapSessionRecording_AvgAboveFoldTitle';
        $result[] = 'HeatmapSessionRecording_AvgAboveFoldDescription';
        $result[] = 'HeatmapSessionRecording_TargetPage';
        $result[] = 'HeatmapSessionRecording_TargetPages';
        $result[] = 'HeatmapSessionRecording_ViewReport';
        $result[] = 'HeatmapSessionRecording_SampleLimit';
        $result[] = 'HeatmapSessionRecording_SessionNameHelp';
        $result[] = 'HeatmapSessionRecording_HeatmapSampleLimit';
        $result[] = 'HeatmapSessionRecording_SessionSampleLimit';
        $result[] = 'HeatmapSessionRecording_HeatmapSampleLimitHelp';
        $result[] = 'HeatmapSessionRecording_SessionSampleLimitHelp';
        $result[] = 'HeatmapSessionRecording_MinSessionTime';
        $result[] = 'HeatmapSessionRecording_MinSessionTimeHelp';
        $result[] = 'HeatmapSessionRecording_EditX';
        $result[] = 'HeatmapSessionRecording_StopX';
        $result[] = 'HeatmapSessionRecording_HeatmapUsageBenefits';
        $result[] = 'HeatmapSessionRecording_AdvancedOptions';
        $result[] = 'HeatmapSessionRecording_SampleRate';
        $result[] = 'HeatmapSessionRecording_HeatmapSampleRateHelp';
        $result[] = 'HeatmapSessionRecording_SessionSampleRateHelp';
        $result[] = 'HeatmapSessionRecording_ExcludedElements';
        $result[] = 'HeatmapSessionRecording_ExcludedElementsHelp';
        $result[] = 'HeatmapSessionRecording_ScreenshotUrl';
        $result[] = 'HeatmapSessionRecording_ScreenshotUrlHelp';
        $result[] = 'HeatmapSessionRecording_BreakpointX';
        $result[] = 'HeatmapSessionRecording_BreakpointGeneralHelp';
        $result[] = 'HeatmapSessionRecording_Rule';
        $result[] = 'HeatmapSessionRecording_UrlParameterValueToMatchPlaceholder';
        $result[] = 'HeatmapSessionRecording_EditHeatmapX';
        $result[] = 'HeatmapSessionRecording_TargetTypeIsAny';
        $result[] = 'HeatmapSessionRecording_TargetTypeIsNot';
        $result[] = 'HeatmapSessionRecording_PersonalInformationNote';
        $result[] = 'HeatmapSessionRecording_UpdatingData';
        $result[] = 'HeatmapSessionRecording_FieldIncludedTargetsHelp';
        $result[] = 'HeatmapSessionRecording_DeleteX';
        $result[] = 'HeatmapSessionRecording_DeleteHeatmapConfirm';
        $result[] = 'HeatmapSessionRecording_BreakpointGeneralHelpManage';
        $result[] = 'HeatmapSessionRecording_TargetPageTestTitle';
        $result[] = 'HeatmapSessionRecording_TargetPageTestErrorInvalidUrl';
        $result[] = 'HeatmapSessionRecording_TargetPageTestUrlMatches';
        $result[] = 'HeatmapSessionRecording_TargetPageTestUrlNotMatches';
        $result[] = 'HeatmapSessionRecording_TargetPageTestLabel';
        $result[] = 'HeatmapSessionRecording_ErrorXNotProvided';
        $result[] = 'HeatmapSessionRecording_ErrorPageRuleRequired';
        $result[] = 'HeatmapSessionRecording_CreationDate';
        $result[] = 'HeatmapSessionRecording_HeatmapCreated';
        $result[] = 'HeatmapSessionRecording_HeatmapUpdated';
        $result[] = 'HeatmapSessionRecording_FieldNamePlaceholder';
        $result[] = 'HeatmapSessionRecording_HeatmapNameHelp';
        $result[] = 'HeatmapSessionRecording_CreateNewHeatmap';
        $result[] = 'HeatmapSessionRecording_CreateNewSessionRecording';
        $result[] = 'HeatmapSessionRecording_EditSessionRecordingX';
        $result[] = 'HeatmapSessionRecording_DeleteSessionRecordingConfirm';
        $result[] = 'HeatmapSessionRecording_EndHeatmapConfirm';
        $result[] = 'HeatmapSessionRecording_EndSessionRecordingConfirm';
        $result[] = 'HeatmapSessionRecording_SessionRecordingCreated';
        $result[] = 'HeatmapSessionRecording_SessionRecordingUpdated';
        $result[] = 'HeatmapSessionRecording_Filter';
        $result[] = 'HeatmapSessionRecording_PlayRecordedSession';
        $result[] = 'HeatmapSessionRecording_DeleteRecordedSession';
        $result[] = 'HeatmapSessionRecording_DeleteRecordedPageview';
        $result[] = 'Live_ViewVisitorProfile';
        $result[] = 'HeatmapSessionRecording_HeatmapXRecordedSamplesSince';
        $result[] = 'HeatmapSessionRecording_PageviewsInVisit';
        $result[] = 'HeatmapSessionRecording_ColumnTime';
        $result[] = 'General_TimeOnPage';
        $result[] = 'Goals_URL';
        $result[] = 'General_Close';
        $result[] = 'HeatmapSessionRecording_HeatmapX';
        $result[] = 'HeatmapSessionRecording_NoHeatmapSamplesRecordedYet';
        $result[] = 'HeatmapSessionRecording_NoHeatmapScreenshotRecordedYet';
        $result[] = 'HeatmapSessionRecording_NoHeatmapSamplesRecordedYetWithoutSystemConfiguration';
        $result[] = 'HeatmapSessionRecording_NoHeatmapScreenshotRecordedYetWithoutSystemConfiguration';
        $result[] = 'HeatmapSessionRecording_HeatmapInfoTrackVisitsFromCountries';
        $result[] = 'HeatmapSessionRecording_SessionRecordingInfoTrackVisitsFromCountries';
        $result[] = 'HeatmapSessionRecording_AdBlockerDetected';
        $result[] = 'HeatmapSessionRecording_CaptureDomTitle';
        $result[] = 'HeatmapSessionRecording_CaptureDomInlineHelp';
        $result[] = 'HeatmapSessionRecording_MatomoJSNotWritableErrorMessage';
        $result[] = 'HeatmapSessionRecording_SessionRecordings';
        $result[] = 'HeatmapSessionRecording_Heatmaps';
        $result[] = 'HeatmapSessionRecording_Clicks';
        $result[] = 'HeatmapSessionRecording_ClickRate';
        $result[] = 'HeatmapSessionRecording_Moves';
        $result[] = 'HeatmapSessionRecording_MoveRate';
        $result[] = 'HeatmapSessionRecording_HeatmapTroubleshoot';
        $result[] = 'General_Required';
        $result[] = 'HeatmapSessionRecording_ErrorHeatmapNameDuplicate';
        $result[] = 'HeatmapSessionRecording_QuotaReachedForX';
        $result[] = 'HeatmapSessionRecording_HeatmapDuplicationError';
        $result[] = 'HeatmapSessionRecording_None';
    }

    public function getJsFiles(&$jsFiles)
    {
        $jsFiles[] = "plugins/HeatmapSessionRecording/javascripts/rowaction.js";
    }

    public function getStylesheetFiles(&$stylesheets)
    {
        $stylesheets[] = "plugins/HeatmapSessionRecording/stylesheets/list-entities.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/stylesheets/edit-entities.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/stylesheets/recordings.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.less";
        $stylesheets[] = "plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.less";
    }

    public function activate()
    {
        $this->installHtAccess();
    }

    public function install()
    {
        $siteHsr = new SiteHsrDao();
        $siteHsr->install();

        $hsrSite = new LogHsrSite();
        $hsrSite->install();

        $hsr = new LogHsr($hsrSite);
        $hsr->install();

        $blobHsr = new LogHsrBlob();
        $blobHsr->install();

        $event = new LogHsrEvent($blobHsr);
        $event->install();

        $this->installHtAccess();

        $configuration = new Configuration();
        $configuration->install();
    }

    public function installHtAccess()
    {
        $htaccess = new HtAccess();
        $htaccess->install();
    }

    public function uninstall()
    {
        $siteHsr = new SiteHsrDao();
        $siteHsr->uninstall();

        $hsrSite = new LogHsrSite();
        $hsrSite->uninstall();

        $hsr = new LogHsr($hsrSite);
        $hsr->uninstall();

        $blobHsr = new LogHsrBlob();
        $blobHsr->uninstall();

        $event = new LogHsrEvent($blobHsr);
        $event->uninstall();

        $configuration = new Configuration();
        $configuration->uninstall();
    }

    public function isTrackerPlugin()
    {
        return true;
    }

    private function getSiteHsrDao()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao');
    }

    public function addSiteTrackerCache(&$content, $idSite)
    {
        $hsr = $this->getSiteHsrDao();
        $hsrs = $hsr->getActiveRecords($idSite);

        foreach ($hsrs as $index => $hsr) {
            // we make sure to keep the cache file small as this is not needed in the cache
            $hsrs[$index]['page_treemirror'] = !empty($hsr['page_treemirror']) ? '1' : null;
        }

        $content['hsr'] = $hsrs;
    }

    public function addActionReferenceColumnsByTable(&$result)
    {
        $result['log_hsr'] = array('idaction_url');
        $result['log_hsr_event'] = array('idselector');
    }

    public function changeSessionLengthIfEmbedPage()
    {
        if (
            SettingsServer::isTrackerApiRequest()
            || Common::isPhpCliMode()
        ) {
            return;
        }

        // if there's no token_auth=... in the URL and there's no existing HSR session, then
        // we don't change the session options and try to use the normal matomo session.
        if (
            Common::getRequestVar('token_auth', false) === false
            && empty($_COOKIE[self::EMBED_SESSION_NAME])
        ) {
            return;
        }

        $module = Common::getRequestVar('module', '', 'string');
        $action = Common::getRequestVar('action', '', 'string');
        if (
            $module == 'HeatmapSessionRecording'
            && $action == 'embedPage'
        ) {
            Config::getInstance()->General['login_cookie_expire'] = self::EMBED_SESSION_TIME;

            Session::$sessionName = self::EMBED_SESSION_NAME;
            Session::rememberMe(Config::getInstance()->General['login_cookie_expire']);
        }
    }

    public static function getTranslationKey($type)
    {
        $key = '';
        switch ($type) {
            case 'pause':
                $key = 'HeatmapSessionRecording_PauseReason';
                break;
            case 'noDataSession':
                $key = 'HeatmapSessionRecording_NoSessionRecordedYetWithoutSystemConfiguration';
                break;
            case 'noDataHeatmap':
                $key = 'HeatmapSessionRecording_NoHeatmapSamplesRecordedYetWithoutSystemConfiguration';
                break;
        }

        if (!$key) {
            return null;
        }

        Piwik::postEvent('HeatmapSessionRecording.updateTranslationKey', [&$key]);
        return $key;
    }

    public static function isMatomoJsWritable($checkSpecificFile = '')
    {
        if (Manager::getInstance()->isPluginActivated('Cloud')) {
            return true;
        }

        $updater = StaticContainer::get('Piwik\Plugins\CustomJsTracker\TrackerUpdater');
        $filePath = $updater->getToFile()->getPath();
        $filesToCheck = array($filePath);
        $jsCodeGenerator = new TrackerCodeGenerator();
        if (SettingsPiwik::isMatomoInstalled() && $jsCodeGenerator->shouldPreferPiwikEndpoint()) {
            // if matomo is not installed yet, we definitely prefer matomo.js... check for isMatomoInstalled is needed
            // cause otherwise it would perform a db query before matomo DB is configured
            $filesToCheck[] = str_replace('matomo.js', 'piwik.js', $filePath);
        }

        if (!empty($checkSpecificFile)) {
            $filesToCheck = [$checkSpecificFile]; // mostly used for testing isMatomoJsWritable functionality
        }

        if (!Manager::getInstance()->isPluginActivated('CustomJsTracker')) {
            return false;
        }

        foreach ($filesToCheck as $fileToCheck) {
            $file = new File($fileToCheck);

            if (!$file->hasWriteAccess()) {
                return false;
            }
        }

        return true;
    }

    private function getHeatmaps($idSite)
    {
        return Request::processRequest('HeatmapSessionRecording.getHeatmaps', [
            'idSite' => $idSite, 'filter_limit' => -1,
            'includePageTreeMirror' => 0 // IMPORTANT for performance and IO. If you need page tree mirror please add another method and don't remove this parameter
        ], $default = []);
    }

    private function getSessionRecordings($idSite)
    {
        return Request::processRequest('HeatmapSessionRecording.getSessionRecordings', [
            'idSite' => $idSite, 'filter_limit' => -1
        ], $default = []);
    }
}
