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

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Log\LoggerInterface;
use Piwik\Plugins\CustomReports\Commands\BackfillReportUsers;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;
use Piwik\Updater;
use Piwik\Updater\Migration;
use Piwik\Updater\Migration\Custom as CustomMigration;
use Piwik\Updater\Migration\Factory as MigrationFactory;
use Piwik\Updates as PiwikUpdates;

/**
 * Update for version 5.6.0.
 *
 * Adds the `created_by` and `updated_by` columns and, where the Activity Log plugin is available,
 * backfills them for existing reports from the activity log. Any report left with a creator but no
 * last updater, and never changed since it was created, then inherits its creator as last updater.
 * The backfill runs once, as part of this update: reports whose users cannot be determined at that
 * point stay unknown permanently.
 */
class Updates_5_6_0 extends PiwikUpdates
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
     * @param Updater $updater
     * @return Migration[]
     */
    public function getMigrations(Updater $updater)
    {
        $migrations = array(
            $this->migration->db->addColumn(
                'custom_reports',
                'created_by',
                'VARCHAR(' . CustomReportsDao::USER_LOGIN_MAX_LENGTH . ') NULL DEFAULT NULL',
                'created_date'
            ),
            $this->migration->db->addColumn(
                'custom_reports',
                'updated_by',
                'VARCHAR(' . CustomReportsDao::USER_LOGIN_MAX_LENGTH . ') NULL DEFAULT NULL',
                'updated_date'
            ),
        );

        if (BackfillReportUsers::canBackfillFromActivityLog()) {
            $migrations[] = new CustomMigration(
                [self::class, 'backfillWithoutFailingTheUpdate'],
                './console ' . BackfillReportUsers::COMMAND_NAME
            );
        }

        // a report whose updated_date still equals its created_date has not been changed since it
        // was created, so whoever the backfill above attributed it to is also its last updater
        $migrations[] = $this->migration->db->sql(sprintf(
            'UPDATE %s SET `updated_by` = `created_by`
              WHERE `updated_by` IS NULL AND `created_by` IS NOT NULL AND `updated_date` = `created_date`',
            Common::prefixTable('custom_reports')
        ));

        return $migrations;
    }

    public function doUpdate(Updater $updater): void
    {
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }

    /**
     * Core deactivates a plugin whose update throws, so a failing backfill would cost the customer
     * the whole Custom Reports feature. Who created a report does not justify that, so a failure is
     * logged and leaves the reports unattributed; the command the migration names can fill them in.
     */
    public static function backfillWithoutFailingTheUpdate(): void
    {
        try {
            BackfillReportUsers::backfillFromActivityLog();
        } catch (\Throwable $e) {
            StaticContainer::get(LoggerInterface::class)->warning(
                'Custom reports could not be attributed to the users who created and last updated them. Run "./console {command}" to complete it: {exception}',
                [
                    'command' => BackfillReportUsers::COMMAND_NAME,
                    'exception' => $e,
                ]
            );
        }
    }
}
