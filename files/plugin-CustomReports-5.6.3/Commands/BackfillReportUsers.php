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

namespace Piwik\Plugins\CustomReports\Commands;

use Piwik\Common;
use Piwik\Db;
use Piwik\DbHelper;
use Piwik\Plugin;
use Piwik\Plugin\ConsoleCommand;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;

/**
 * Attributes custom reports that have no creator or last updater stored to the users who created
 * and last updated them, as recorded in the activity log.
 *
 * This is the command form of the one off backfill run by the 5.6.0 update, so an interrupted or
 * failed update can be completed manually.
 */
class BackfillReportUsers extends ConsoleCommand
{
    public const COMMAND_NAME = 'customreports:backfill-report-users';

    /**
     * Activity type recorded by {@see \Piwik\Plugins\CustomReports\Activity\ReportAdded}, which is
     * the only type that identifies who created a report.
     */
    private const ACTIVITY_TYPE_REPORT_ADDED = 'CustomReports/ReportAdded';

    /**
     * Activity types recorded for a change that updates the report row and leaves it visible in the
     * manage table, so any of them makes its actor the last updater. Pause and resume are included
     * because they bump `updated_date` just like an edit does, and `updated_by` has to describe the
     * same event as `updated_date`. Report deletions are left out because a deleted report never
     * renders.
     */
    private const ACTIVITY_TYPES_REPORT_UPDATED = array(
        'CustomReports/ReportUpdated',
        'CustomReports/ReportPaused',
        'CustomReports/ReportResumed',
    );

    /**
     * Logins the activity log stores for non-user actors. A report attributed to one of these was
     * not changed by a person, so it stays unknown rather than displaying a fabricated name.
     * `anonymous` is listed even though entries are joined against the user table, because unlike
     * the others it is an actual row in that table and so would survive the join.
     */
    private const ADDITIONAL_NON_USER_LOGINS = array('Matomo System', 'Console Command');

    /**
     * Number of activity log entries read per query. The activity log has no index on `type` and
     * can hold millions of rows, so it is walked in chunks by primary key.
     */
    private const CHUNK_SIZE = 1000;

    /**
     * Logins compared per registration lookup statement.
     */
    private const LOGIN_LOOKUP_BATCH_SIZE = 100;

    protected function configure(): void
    {
        $this->setName(self::COMMAND_NAME);
        $this->setDescription('Sets the creator and last updater of custom reports that have none stored, based on the activity log');
    }

    protected function doExecute(): int
    {
        $output = $this->getOutput();

        if (!self::canBackfillFromActivityLog()) {
            $output->writeln('The activity log is not available, so no creator or last updater can be determined.');

            return self::SUCCESS;
        }

        $updated = self::backfillFromActivityLog();

        $output->writeln(sprintf(
            'Set the creator of %d and the last updater of %d custom report(s).',
            $updated['created_by'],
            $updated['updated_by']
        ));

        return self::SUCCESS;
    }

    /**
     * The plugin can be activated without its tables being installed yet, for example part way
     * through an update or after restoring a partial database dump, so both need checking.
     */
    public static function canBackfillFromActivityLog(): bool
    {
        if (!Plugin\Manager::getInstance()->isPluginActivated('ActivityLog')) {
            return false;
        }

        return DbHelper::tableExists(Common::prefixTable('activity_log'));
    }

    /**
     * Attributes existing reports to the users who created and last updated them, as recorded in
     * the activity log.
     *
     * Only "report added" entries can identify a creator, so a report is never attributed to
     * someone who merely changed it. Reports with no matching entry keep a `NULL` value, which the
     * manage table shows as "unknown".
     *
     * @return array{created_by: int, updated_by: int} the number of reports each column was stored for
     */
    public static function backfillFromActivityLog(): array
    {
        $reportsTable = Common::prefixTable('custom_reports');

        // only reports that still exist can be attributed, and the table is small enough to hold
        // in memory because the number of custom reports is quota limited
        $reportIds = Db::fetchAll(sprintf('SELECT idcustomreport FROM %s', $reportsTable));
        $knownReportIds = array_flip(array_map('intval', array_column($reportIds, 'idcustomreport')));

        if (empty($knownReportIds)) {
            return array('created_by' => 0, 'updated_by' => 0);
        }

        $logins = self::readUserLoginsFromActivityLog($knownReportIds);

        return array(
            'created_by' => self::storeUserLogins($reportsTable, 'created_by', $logins['created_by']),
            'updated_by' => self::storeUserLogins($reportsTable, 'updated_by', $logins['updated_by']),
        );
    }

    /**
     * @param array<int, string> $loginsByReportId report id => login
     * @return int the number of reports the column was stored for
     */
    private static function storeUserLogins(string $reportsTable, string $column, array $loginsByReportId): int
    {
        if (empty($loginsByReportId)) {
            return 0;
        }

        // group by login so we run one query per user instead of one per report
        $reportIdsByLogin = array();
        foreach ($loginsByReportId as $idCustomReport => $login) {
            $reportIdsByLogin[$login][] = $idCustomReport;
        }

        $updated = 0;

        foreach ($reportIdsByLogin as $login => $idCustomReports) {
            // the IS NULL condition keeps this re-runnable and stops it overwriting a login that
            // was stored between adding the column and running the backfill
            $result = Db::query(
                sprintf(
                    'UPDATE %s SET `%s` = ? WHERE `%s` IS NULL AND `idcustomreport` IN (%s)',
                    $reportsTable,
                    $column,
                    $column,
                    implode(',', array_map('intval', $idCustomReports))
                ),
                array($login)
            );

            $updated += $result->rowCount();
        }

        return $updated;
    }

    /**
     * Returns the registration date of each given login that was not looked up already.
     *
     * A login that no user holds maps to false, so it is not looked up again for every later chunk.
     *
     * @param array<int, string> $logins
     * @param array<string, string|null|false> $alreadyKnown login => registration date
     * @return array<string, string|null|false> login => registration date, false when no user holds it
     */
    private static function readRegistrationDates(string $userTable, array $logins, array $alreadyKnown): array
    {
        $lookup = array();

        foreach ($logins as $login) {
            $login = trim((string) $login);

            if ('' !== $login && !array_key_exists($login, $alreadyKnown)) {
                $lookup[$login] = true;
            }
        }

        $lookup = array_keys($lookup);

        if (empty($lookup)) {
            return array();
        }

        $dates = array_fill_keys($lookup, false);

        // The database compares logins with its own collation, which folds case and accents, so the
        // spelling it stores can differ from the one the activity log recorded and PHP cannot map a
        // returned row back on its own. Each login is therefore compared by the database and handed
        // back next to the spelling that was asked for, a batch of logins per statement.
        foreach (array_chunk($lookup, self::LOGIN_LOOKUP_BATCH_SIZE) as $batch) {
            $selects = array();
            $bind = array();

            foreach ($batch as $login) {
                $selects[] = sprintf(
                    'SELECT ? AS `requested`, `date_registered` FROM %s WHERE `login` = ?',
                    $userTable
                );
                $bind[] = $login;
                $bind[] = $login;
            }

            // a login no user holds simply contributes no row, and keeps the false it was filled with
            foreach (Db::fetchAll(implode(' UNION ALL ', $selects), $bind) as $row) {
                $dates[$row['requested']] = $row['date_registered'];
            }
        }

        return $dates;
    }

    /**
     * Walks the activity log once and collects the creator and the last updater of each known
     * report.
     *
     * Entries whose user has since been deleted are dropped, so the backfill cannot reintroduce
     * personal data that was already removed when the user was deleted.
     *
     * Logins can be reused: deleting a user frees the login for a new one, who must not inherit
     * the activity of their predecessor. Entries older than the current holder's registration are
     * therefore skipped, leaving those reports unknown. A null registration date cannot be such a
     * reuse, because every user created through Matomo is stamped with one, so those entries are
     * still attributed rather than discarding data we have no reason to doubt.
     *
     * @param array<int, int> $knownReportIds report ids as keys
     * @return array{created_by: array<int, string>, updated_by: array<int, string>} column => (report id => login)
     */
    private static function readUserLoginsFromActivityLog(array $knownReportIds): array
    {
        $activityTable = Common::prefixTable('activity_log');
        $userTable = Common::prefixTable('user');
        $types = array_merge(array(self::ACTIVITY_TYPE_REPORT_ADDED), self::ACTIVITY_TYPES_REPORT_UPDATED);
        $nonUserLogins = array_merge(CustomReportsDao::NON_USER_LOGINS, self::ADDITIONAL_NON_USER_LOGINS);
        $logins = array('created_by' => array(), 'updated_by' => array());
        $registrationDates = array();
        $lastId = 0;

        while (true) {
            // The activity log and the user table are compared on a login rather than an id, and the two
            // are not guaranteed to share a collation: a plugin table created with the server default
            // meets a core table created with Matomo's, and MySQL rejects the comparison outright. The
            // logins are therefore resolved in a separate lookup, where each one is a bound value that
            // takes the collation of the column it is compared against.
            $rows = Db::fetchAll(
                sprintf(
                    'SELECT a.`id`, a.`type`, a.`user_login`, a.`ts_created`, a.`parameters` FROM %s a
                      WHERE a.`id` > ? AND a.`type` IN (%s) ORDER BY a.`id` ASC LIMIT %d',
                    $activityTable,
                    Common::getSqlStringFieldsArray($types),
                    self::CHUNK_SIZE
                ),
                array_merge(array($lastId), $types)
            );

            if (empty($rows)) {
                return $logins;
            }

            $chunkLogins = array();

            foreach ($rows as $row) {
                $login = trim((string) $row['user_login']);

                if ('' !== $login && !in_array($login, $nonUserLogins, true)) {
                    $chunkLogins[] = $login;
                }
            }

            $registrationDates += self::readRegistrationDates($userTable, $chunkLogins, $registrationDates);

            foreach ($rows as $row) {
                $lastId = (int) $row['id'];

                $login = trim((string) $row['user_login']);
                if ($login === '' || in_array($login, $nonUserLogins, true)) {
                    continue;
                }

                // the join this replaces dropped entries with no matching user, and entries recorded
                // before that user registered, so a recycled login is not credited with older changes
                $registered = array_key_exists($login, $registrationDates)
                    ? $registrationDates[$login]
                    : false;

                // false marks a login that no user holds any more; null is a user registered before
                // Matomo stamped a date, which cannot be a reuse, so those entries are still taken
                if (false === $registered) {
                    continue;
                }

                if (null !== $registered && $row['ts_created'] < $registered) {
                    continue;
                }

                // entries whose parameters could not be built are stored as a serialized null
                $parameters = Common::safe_unserialize($row['parameters']);
                if (!is_array($parameters) || !is_array($parameters['report'] ?? null)) {
                    continue;
                }

                $idReport = $parameters['report']['id'] ?? null;
                if (!is_numeric($idReport)) {
                    continue;
                }

                $idCustomReport = (int) $idReport;
                if (!isset($knownReportIds[$idCustomReport])) {
                    continue;
                }

                // rows are read in ascending id order, so if there is more than one matching entry
                // for a report the most recent one wins: for the creator that is the entry that
                // created the row currently in custom_reports, and for the last updater it is the
                // change that `updated_date` describes
                if ($row['type'] === self::ACTIVITY_TYPE_REPORT_ADDED) {
                    $logins['created_by'][$idCustomReport] = $login;
                } else {
                    $logins['updated_by'][$idCustomReport] = $login;
                }
            }
        }
    }
}
