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
