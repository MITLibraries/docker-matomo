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

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\Common;
use Piwik\DbHelper;
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;
use Piwik\Updater\Migration\Factory as MigrationFactory;

class Updates_5_5_5 extends PiwikUpdates
{
    /**
     * @var MigrationFactory
     */
    private $migration;

    public function __construct(MigrationFactory $factory)
    {
        $this->migration = $factory;
    }

    public function getMigrations(Updater $updater)
    {
        $siteHsrTable = Common::prefixTable('site_hsr');
        $columns = DbHelper::getTableColumns($siteHsrTable);

        $migrations = array();
        if (!array_key_exists('auto_repeat', $columns)) {
            $migrations[] = $this->migration->db->addColumn('site_hsr', 'auto_repeat', 'TINYINT(1) UNSIGNED NOT NULL DEFAULT 0');
        }

        if (!array_key_exists('repeat_source_idsitehsr', $columns)) {
            $migrations[] = $this->migration->db->addColumn('site_hsr', 'repeat_source_idsitehsr', 'INT(10) UNSIGNED NULL DEFAULT NULL');
        }

        if (!DbHelper::tableHasIndex($siteHsrTable, 'unique_repeat_source')) {
            $migrations[] = $this->migration->db->addUniqueKey('site_hsr', 'repeat_source_idsitehsr', 'unique_repeat_source');
        }

        // repeat_processed was only ever added by an earlier revision of this migration, it is now derived
        // from the copies themselves
        if (array_key_exists('repeat_processed', $columns)) {
            $migrations[] = $this->migration->db->dropColumn('site_hsr', 'repeat_processed');
        }

        if (!array_key_exists('scheduled_date', $columns)) {
            $migrations[] = $this->migration->db->addColumn('site_hsr', 'scheduled_date', 'DATETIME NULL');
        }

        $migrations[] = $this->migration->db->changeColumnType('site_hsr', 'name', 'VARCHAR(' . Name::MAX_LENGTH . ') NOT NULL');

        return $migrations;
    }

    public function doUpdate(Updater $updater)
    {
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }
}
