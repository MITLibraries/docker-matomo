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

namespace Piwik\Plugins\HeatmapSessionRecording\Dao;

use Piwik\Common;
use Piwik\Db;
use Piwik\DbHelper;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;

class LogHsrSite
{
    private $table = 'log_hsr_site';
    private $tablePrefixed = '';

    /**
     * @var Db|Db\AdapterInterface|\Piwik\Tracker\Db
     */
    private $db;

    public function __construct()
    {
        $this->tablePrefixed = Common::prefixTable($this->table);
    }

    private function getDb()
    {
        if (!isset($this->db)) {
            $this->db = Db::get();
        }
        return $this->db;
    }

    public function install()
    {
        // it actually also has the advantage that removing an entry will be fast because when a user clicks on
        // "delete heatmap" we could only remove this entry, and then have a daily cronjob to delete all entries that are
        // no longer linked. instead of having to directly delete all data. Also it is more efficient to track when eg
        // a session and a heatmap is being recording at the same time or when several heatmaps are being recorded at once
        DbHelper::createTable($this->table, "
                  `idsitehsr` INT(10) UNSIGNED NOT NULL,
                  `idloghsr` INT(10) UNSIGNED NOT NULL,
                  PRIMARY KEY(`idsitehsr`, `idloghsr`),
                  INDEX index_idloghsr (`idloghsr`)");
    }

    public function uninstall()
    {
        Db::query(sprintf('DROP TABLE IF EXISTS `%s`', $this->tablePrefixed));
    }

    public function linkRecord($idLogHsr, $idSiteHsr)
    {
        $bind = array($idLogHsr,$idSiteHsr);
        $sql = sprintf('INSERT INTO %s (`idloghsr`, `idsitehsr`) VALUES(?,?)', $this->tablePrefixed);

        try {
            $this->getDb()->query($sql, $bind);
        } catch (\Exception $e) {
            if (Db::get()->isErrNo($e, \Piwik\Updater\Migration\Db::ERROR_CODE_DUPLICATE_ENTRY)) {
                return;
            }
            throw $e;
        }
    }

    // should be fast as covered index
    public function getNumPageViews($idSiteHsr)
    {
        $sql = sprintf('SELECT count(*) as numsamples FROM %s WHERE idsitehsr = ?', $this->tablePrefixed);

        return (int) $this->getDb()->fetchOne($sql, array($idSiteHsr));
    }

    // should be fast as covered index
    public function getNumSessions($idSiteHsr)
    {
        $sql = sprintf(
            'SELECT count(distinct idvisit) 
                FROM %s loghsrsite 
                left join %s loghsr on loghsr.idloghsr = loghsrsite.idloghsr 
                left join %s loghsrevent on loghsr.idloghsr = loghsrevent.idloghsr and loghsrevent.event_type = %s 
                WHERE loghsrsite.idsitehsr = ? and loghsrevent.idhsrblob is not null',
            $this->tablePrefixed,
            Common::prefixTable('log_hsr'),
            Common::prefixTable('log_hsr_event'),
            RequestProcessor::EVENT_TYPE_INITIAL_DOM
        );

        return (int) $this->getDb()->fetchOne($sql, array($idSiteHsr));
    }

    public function unlinkRecord($idLogHsr, $idSiteHsr)
    {
        $sql = sprintf('DELETE FROM %s WHERE idsitehsr = ? and idloghsr = ?', $this->tablePrefixed);

        return $this->getDb()->query($sql, array($idSiteHsr, $idLogHsr));
    }

    public function unlinkSiteRecords($idSiteHsr)
    {
        $sql = sprintf('DELETE FROM %s WHERE idsitehsr = ?', $this->tablePrefixed);

        return $this->getDb()->query($sql, array($idSiteHsr));
    }

    public function getAllRecords()
    {
        return $this->getDb()->fetchAll('SELECT * FROM ' . $this->tablePrefixed);
    }

    public function deleteNoLongerNeededRecords()
    {
        // DELETE ALL linked LOG ENTRIES WHOSE idsite does no longer exist or was removed
        // we delete links for removed site_hsr entries, and for site_hsr entries with status deleted
        // this query should only delete entries when they were deleted manually in the database basically.
        // otherwise the application takes already care of removing the needed links
        $sql = sprintf(
            'DELETE FROM %1$s WHERE %1$s.idsitehsr NOT IN (select site_hsr.idsitehsr from %2$s site_hsr where site_hsr.status = "%3$s" or site_hsr.status = "%4$s")',
            Common::prefixTable('log_hsr_site'),
            Common::prefixTable('site_hsr'),
            SiteHsrDao::STATUS_ACTIVE,
            SiteHsrDao::STATUS_ENDED
        );

        Db::query($sql);
    }
}
