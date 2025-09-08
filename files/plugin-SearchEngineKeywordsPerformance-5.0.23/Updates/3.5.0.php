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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance;

use Piwik\Updater;
use Piwik\Updater\Migration\Factory as MigrationFactory;
use Piwik\Updates as PiwikUpdates;

class Updates_3_5_0 extends PiwikUpdates
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
        $migrations = [];
        $migrations[] = $this->migration->db->changeColumnType('bing_stats', 'type', 'VARCHAR(15)');
        $migrations[] = $this->migration->db->changeColumnType('bing_stats', 'url', 'VARCHAR(170)');
        $migrations[] = $this->migration->db->changeColumnType('google_stats', 'url', 'VARCHAR(170)');
        return $migrations;
    }
    public function doUpdate(Updater $updater)
    {
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }
}
