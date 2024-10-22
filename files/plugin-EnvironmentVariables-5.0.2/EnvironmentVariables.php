<?php 
/**
 * Plugin Name: Environment Variables (Matomo Plugin)
 * Plugin URI: http://plugins.matomo.org/EnvironmentVariables
 * Description: Allows you to specify Matomo config in environment variables instead of the config file.
 * Author: Matomo
 * Author URI: https://matomo.org
 * Version: 5.0.2
 */
?><?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\EnvironmentVariables;

 
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

class EnvironmentVariables extends \Piwik\Plugin
{
    public function isTrackerPlugin()
    {
        return true;
    }
}
