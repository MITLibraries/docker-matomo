<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\CustomReports;

use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;

/**
 * Update for version 5.4.2.
 */
class Updates_5_4_2 extends PiwikUpdates
{
    /**
     * Perform the incremental version update.
     *
     * This method should perform all updating logic. If you define queries in the `getMigrations()` method,
     * you must call {@link Updater::executeMigrations()} here.
     *
     * @param Updater $updater
     */
    public function doUpdate(Updater $updater)
    {
        $config = Config::getInstance();
        $customReportsConfig = $config->CustomReports;

        if (!isset($customReportsConfig[Configuration::KEY_MAX_DIMENSIONS])) {
            $configuration =  StaticContainer::get(Configuration::class);
            $customReportsConfig[Configuration::KEY_MAX_DIMENSIONS] = $configuration->getMaxDimensions();
            $config->CustomReports = $customReportsConfig;
            $config->forceSave();
        }
    }
}
