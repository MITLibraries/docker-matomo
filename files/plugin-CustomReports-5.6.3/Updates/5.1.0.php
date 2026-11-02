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

use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;
use Piwik\Updater\Migration;
use Piwik\Updater\Migration\Factory as MigrationFactory;

/**
 * Update for version 5.1.0.
 */
class Updates_5_1_0 extends PiwikUpdates
{
    /**
     * @var MigrationFactory
     */
    private $migration;

    public function __construct(MigrationFactory $factory)
    {
        $this->migration = $factory;
    }

    /**
     * Return database migrations to be executed in this update.
     *
     * Database migrations should be defined here, instead of in `doUpdate()`, since this method is used
     * in the `core:update` command when displaying the queries an update will run. If you execute
     * migrations directly in `doUpdate()`, they won't be displayed to the user. Migrations will be executed in the
     * order as positioned in the returned array.
     *
     * @param Updater $updater
     * @return Migration\Db[]
     */
    public function getMigrations(Updater $updater)
    {
        return [
            $this->migration->db->addColumn('custom_reports', 'subcategory_order', 'MEDIUMINT(8) UNSIGNED NOT NULL DEFAULT 9999999', 'subcategory')
        ];
    }

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
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }
}
