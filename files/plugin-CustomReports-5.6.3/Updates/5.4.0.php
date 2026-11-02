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
use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;

/**
 * Update for version 5.4.0.
 */
class Updates_5_4_0 extends PiwikUpdates
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
        $maxRows = (!empty($customReportsConfig['datatable_archiving_maximum_rows_custom_reports']) ? $customReportsConfig['datatable_archiving_maximum_rows_custom_reports'] : Configuration::DEFAULT_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS_DEFAULT);
        $maxSubTableRows = (
        !empty($customReportsConfig['datatable_archiving_maximum_rows_subtable_custom_reports']) ?
            $customReportsConfig['datatable_archiving_maximum_rows_subtable_custom_reports']
            : Configuration::DEFAULT_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS_DEFAULT
        );
        for ($i = 1; $i <= 3; $i++) {
            if (empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . $i])) {
                $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . $i] = $maxRows;
            }

            // To avoid customer confusion, don't create a subtable entry for first dimension as there are no subtables
            if ($i > 1 && empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . $i])) {
                $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . $i] = $maxSubTableRows;
            }
        }

        if (empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . 4])) {
            $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . 4] = 125;
        }
        if (empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . 4])) {
            $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . 4] = 100;
        }

        for ($i = 5; $i <= 6; $i++) {
            if (empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . $i])) {
                $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS . $i] = Configuration::DEFAULT_ARCHIVE_MAXIMUM_ROWS_CUSTOM_DIMENSIONS_DEFAULT;
            }

            if (empty($customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . $i])) {
                $customReportsConfig[Configuration::KEY_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS . $i] = Configuration::DEFAULT_ARCHIVE_MAXIMUM_ROWS_SUB_TABLE_CUSTOM_DIMENSIONS_DEFAULT;
            }
        }

        if (isset($customReportsConfig['datatable_archiving_maximum_rows_custom_reports'])) {
            unset($customReportsConfig['datatable_archiving_maximum_rows_custom_reports']);
        }
        if (isset($customReportsConfig['datatable_archiving_maximum_rows_subtable_custom_reports'])) {
            unset($customReportsConfig['datatable_archiving_maximum_rows_subtable_custom_reports']);
        }

        $config->CustomReports = $customReportsConfig;
        $config->forceSave();
    }
}
