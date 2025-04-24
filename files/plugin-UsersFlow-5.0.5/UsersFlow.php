<?php 
/**
 * Plugin Name: Users Flow (Matomo Plugin)
 * Plugin URI: https://plugins.matomo.org/UsersFlow
 * Description: Users Flow is a visual representation of the most popular paths your users take through your website & app which lets you understand your users needs
 * Author: InnoCraft
 * Author URI: https://plugins.matomo.org/UsersFlow
 * Version: 5.0.5
 */
?><?php

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

namespace Piwik\Plugins\UsersFlow;

use Piwik\Archive\ArchiveInvalidator;
use Piwik\Columns\Dimension;
use Piwik\Container\StaticContainer;

 
if (defined( 'ABSPATH')
&& function_exists('add_action')) {
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
            matomo_add_plugin(__DIR__, __FILE__, true);
        }
    });
}

class UsersFlow extends \Piwik\Plugin
{
    public function install()
    {
        $configuration = new Configuration();
        $configuration->install();
    }

    public function uninstall()
    {
        $configuration = new Configuration();
        $configuration->uninstall();
    }

    public function activate()
    {
        $this->schedulePluginReArchiving();
    }

    public function deactivate()
    {
        $archiveInvalidator = StaticContainer::get(ArchiveInvalidator::class);
        $archiveInvalidator->removeInvalidationsSafely('all', $this->getPluginName());
    }

    /**
     * @see \Piwik\Plugin::registerEvents
     */
    public function registerEvents()
    {
        return array(
            'AssetManager.getStylesheetFiles' => 'getStylesheetFiles',
            'Translate.getClientSideTranslationKeys' => 'getClientSideTranslationKeys',
            'Metrics.getDefaultMetricSemanticTypes' => 'addDefaultMetricSemanticTypes',
        );
    }

    public function addDefaultMetricSemanticTypes(&$types)
    {
        $types[Metrics::NB_EXITS] = Dimension::TYPE_NUMBER;
    }

    public function getStylesheetFiles(&$stylesheets)
    {
        $stylesheets[] = "plugins/UsersFlow/vue/src/Visualization/Visualization.less";
        $stylesheets[] = "plugins/UsersFlow/stylesheets/d3-tip.less";
    }

    public function getClientSideTranslationKeys(&$translationKeys)
    {
        $translationKeys[] = 'CoreHome_ThereIsNoDataForThisReport';
        $translationKeys[] = 'UsersFlow_Interactions';
        $translationKeys[] = 'UsersFlow_ColumnInteraction';
        $translationKeys[] = 'Transitions_ExitsInline';
        $translationKeys[] = 'General_NVisits';
        $translationKeys[] = 'General_Others';
        $translationKeys[] = 'General_Search';
        $translationKeys[] = 'General_ColumnNbVisits';
        $translationKeys[] = 'General_ColumnExits';
        $translationKeys[] = 'General_Source';
        $translationKeys[] = 'Installation_SystemCheckOpenURL';
        $translationKeys[] = 'VisitorInterest_NPages';
        $translationKeys[] = 'UsersFlow_ExploringInfo';
        $translationKeys[] = 'UsersFlow_ColumnProceeded';
        $translationKeys[] = 'UsersFlow_ActionShowDetails';
        $translationKeys[] = 'UsersFlow_ActionClearHighlight';
        $translationKeys[] = 'UsersFlow_ActionHighlightTraffic';
        $translationKeys[] = 'UsersFlow_ActionRemoveStep';
        $translationKeys[] = 'UsersFlow_ActionAddStep';
        $translationKeys[] = 'UsersFlow_NProceededInline';
        $translationKeys[] = 'UsersFlow_InteractionXToY';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail1';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail2';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail3';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail4';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail5';
        $translationKeys[] = 'UsersFlow_OptionLevelOfDetail6';
        $translationKeys[] = 'UsersFlow_OptionNumActionsPerStep';
        $translationKeys[] = 'UsersFlow_ExploreTraffic';
        $translationKeys[] = 'UsersFlow_UnexploreTraffic';
        $translationKeys[] = 'UsersFlow_UsersFlowReportDescription';
        $translationKeys[] = 'UsersFlow_UsersFlow';
        $translationKeys[] = 'UsersFlow_UsersFlowVisualizationDescription1';
        $translationKeys[] = 'UsersFlow_UsersFlowVisualizationDescription2';
    }
}
