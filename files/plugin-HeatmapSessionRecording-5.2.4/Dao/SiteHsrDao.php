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
use Piwik\Date;
use Piwik\Db;
use Piwik\DbHelper;
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
use Piwik\Plugins\HeatmapSessionRecording\Input\SampleRate;

class SiteHsrDao
{
    private $table = 'site_hsr';
    private $tablePrefixed = '';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_DELETED = 'deleted';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_ENDED = 'ended';

    public const RECORD_TYPE_HEATMAP = 1;
    public const RECORD_TYPE_SESSION = 2;

    public const MAX_SMALLINT = 65535;

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
        DbHelper::createTable($this->table, "
                  `idsitehsr` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                  `idsite` INT(10) UNSIGNED NOT NULL,
                  `name` VARCHAR(" . Name::MAX_LENGTH . ") NOT NULL,
                  `sample_rate` DECIMAL(4,1) UNSIGNED NOT NULL DEFAULT " . SampleRate::MAX_RATE . ",
                  `sample_limit` MEDIUMINT(8) UNSIGNED NOT NULL DEFAULT 1000,
                  `match_page_rules` TEXT DEFAULT '',
                  `excluded_elements` TEXT DEFAULT '',
                  `record_type` TINYINT(1) UNSIGNED DEFAULT 0,
                  `page_treemirror` MEDIUMBLOB NULL DEFAULT NULL,
                  `screenshot_url` VARCHAR(300) NULL DEFAULT NULL,
                  `breakpoint_mobile` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 0,
                  `breakpoint_tablet` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 0,
                  `min_session_time` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 0,
                  `requires_activity` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
                  `capture_keystrokes` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
                  `created_date` DATETIME NOT NULL,
                  `updated_date` DATETIME NOT NULL,
                  `status` VARCHAR(10) NOT NULL DEFAULT '" . self::STATUS_ACTIVE . "',
                  `capture_manually` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY(`idsitehsr`),
                  INDEX index_status_idsite (`status`, `idsite`),
                  INDEX index_idsite_record_type (`idsite`, `record_type`)");
    }

    public function createHeatmapRecord($idSite, $name, $sampleLimit, $sampleRate, $matchPageRules, $excludedElements, $screenshotUrl, $breakpointMobile, $breakpointTablet, $status, $captureDomManually, $createdDate)
    {
        $columns = array(
            'idsite' => $idSite,
            'name' => $name,
            'sample_limit' => $sampleLimit,
            'match_page_rules' => $matchPageRules,
            'sample_rate' => $sampleRate,
            'status' => $status,
            'record_type' => self::RECORD_TYPE_HEATMAP,
            'created_date' => $createdDate,
            'updated_date' => $createdDate,
            'capture_manually' => !empty($captureDomManually) ? 1 : 0,
        );

        if (!empty($excludedElements)) {
            $columns['excluded_elements'] = $excludedElements;
        }

        if (!empty($screenshotUrl)) {
            $columns['screenshot_url'] = $screenshotUrl;
        }
        if ($breakpointMobile !== false && $breakpointMobile !== null) {
            $columns['breakpoint_mobile'] = $breakpointMobile;
        }

        if ($breakpointTablet !== false && $breakpointTablet !== null) {
            $columns['breakpoint_tablet'] = $breakpointTablet;
        }

        return $this->insertColumns($columns);
    }

    public function createSessionRecord($idSite, $name, $sampleLimit, $sampleRate, $matchPageRules, $minSessionTime, $requiresActivity, $captureKeystrokes, $status, $createdDate)
    {
        $columns = array(
            'idsite' => $idSite,
            'name' => $name,
            'sample_limit' => $sampleLimit,
            'match_page_rules' => $matchPageRules,
            'sample_rate' => $sampleRate,
            'status' => $status,
            'record_type' => self::RECORD_TYPE_SESSION,
            'min_session_time' => !empty($minSessionTime) ? $minSessionTime : 0,
            'requires_activity' => !empty($requiresActivity) ? 1 : 0,
            'capture_keystrokes' => !empty($captureKeystrokes) ? 1 : 0,
            'created_date' => $createdDate,
            'updated_date' => $createdDate,
        );

        return $this->insertColumns($columns);
    }

    private function insertColumns($columns)
    {
        $columns = $this->encodeFieldsWhereNeeded($columns);

        $bind = array_values($columns);
        $placeholder = Common::getSqlStringFieldsArray($columns);

        $sql = sprintf(
            'INSERT INTO %s (`%s`) VALUES(%s)',
            $this->tablePrefixed,
            implode('`,`', array_keys($columns)),
            $placeholder
        );

        $this->getDb()->query($sql, $bind);

        $idSiteHsr = $this->getDb()->lastInsertId();

        return (int) $idSiteHsr;
    }

    protected function getCurrentTime()
    {
        return Date::now()->getDatetime();
    }

    public function updateHsrColumns($idSite, $idSiteHsr, $columns)
    {
        $columns = $this->encodeFieldsWhereNeeded($columns);

        if (!empty($columns)) {
            if (!isset($columns['updated_date'])) {
                $columns['updated_date'] = $this->getCurrentTime();
            }

            if (!empty($columns['page_treemirror'])) {
                $columns['capture_manually'] = 0;
            } elseif (!empty($columns['capture_manually'])) {
                $columns['page_treemirror'] = null;
            }

            $fields = array();
            $bind = array();
            foreach ($columns as $key => $value) {
                $fields[] = ' ' . $key . ' = ?';
                $bind[] = $value;
            }
            $fields = implode(',', $fields);

            $query = sprintf('UPDATE %s SET %s WHERE idsitehsr = ? AND idsite = ?', $this->tablePrefixed, $fields);
            $bind[] = (int) $idSiteHsr;
            $bind[] = (int) $idSite;

            // we do not use $db->update() here as this method is as well used in Tracker mode and the tracker DB does not
            // support "->update()". Therefore we use the query method where we know it works with tracker and regular DB
            $this->getDb()->query($query, $bind);
        }
    }

    public function hasRecords($idSite, $recordType)
    {
        $sql = sprintf('SELECT idsite FROM %s WHERE record_type = ? and `status` IN(?,?) and idsite = ? LIMIT 1', $this->tablePrefixed);
        $records = $this->getDb()->fetchRow($sql, array($recordType, self::STATUS_ENDED, self::STATUS_ACTIVE, $idSite));

        return !empty($records);
    }

    public function deleteRecord($idSite, $idSiteHsr)
    {
        // now we delete the heatmap manually and it should notice all log entries for that heatmap are no longer needed
        $sql = sprintf('DELETE FROM %s WHERE idsitehsr = ? and idsite = ?', $this->tablePrefixed);
        Db::query($sql, array($idSiteHsr, $idSite));
    }

    private function getAllFieldNames($includePageTreeMirror)
    {
        $fields =  '`idsitehsr`,`idsite`,`name`, `sample_rate`, `sample_limit`, `match_page_rules`, `excluded_elements`, `record_type`, ';
        if (!empty($includePageTreeMirror)) {
            $fields .= '`page_treemirror`,';
        }
        $fields .= '`screenshot_url`, `breakpoint_mobile`,  `breakpoint_tablet`, `min_session_time` ,  `requires_activity`, `capture_keystrokes`, `created_date`,  `updated_date`, `status`, `capture_manually`';
        return $fields;
    }

    public function getRecords($idSite, $recordType, $includePageTreeMirror)
    {
        $fields = $this->getAllFieldNames($includePageTreeMirror);
        $sql = sprintf('SELECT ' . $fields . ' FROM %s WHERE record_type = ? and `status` IN(?,?,?) and idsite = ? order by created_date desc', $this->tablePrefixed);
        $records = $this->getDb()->fetchAll($sql, array($recordType, self::STATUS_ENDED, self::STATUS_ACTIVE, self::STATUS_PAUSED, $idSite));

        return $this->enrichRecords($records);
    }

    public function getRecord($idSite, $idSiteHsr, $recordType)
    {
        $sql = sprintf('SELECT * FROM %s WHERE record_type = ? and `status` IN(?,?,?) and idsite = ? and idsitehsr = ? LIMIT 1', $this->tablePrefixed);
        $record = $this->getDb()->fetchRow($sql, array($recordType, self::STATUS_ENDED, self::STATUS_ACTIVE, self::STATUS_PAUSED, $idSite, $idSiteHsr));

        return $this->enrichRecord($record);
    }

    public function getNumRecordsTotal($recordType)
    {
        $sql = sprintf('SELECT count(*) as total FROM %s WHERE record_type = ? and `status` IN(?,?,?)', $this->tablePrefixed);
        return $this->getDb()->fetchOne($sql, array($recordType, self::STATUS_ENDED, self::STATUS_ACTIVE, self::STATUS_PAUSED));
    }

    public function hasActiveRecordsAcrossSites()
    {
        $query = $this->getQueryActiveRequests();

        $sql = sprintf("SELECT count(*) as numrecords FROM %s WHERE %s LIMIT 1", $this->tablePrefixed, $query['where']);
        $numRecords = $this->getDb()->fetchOne($sql, $query['bind']);

        return !empty($numRecords);
    }

    private function getQueryActiveRequests()
    {
        // for sessions we also need to return ended sessions to make sure to record all page views once a user takes part in
        // a session recording. Otherwise as soon as the limit of sessions has reached, it would stop recording any further page views in already started session recordings

        // we only fetch recorded sessions with status ended for the last 24 hours to not expose any potential config and for faster processing etc
        $oneDayAgo = Date::now()->subDay(1)->getDatetime();

        return array(
            'where' => '(status = ? or (record_type = ? and status = ? and updated_date > ?))',
            'bind' => array(self::STATUS_ACTIVE, self::RECORD_TYPE_SESSION, self::STATUS_ENDED, $oneDayAgo)
        );
    }

    /**
     * For performance reasons the page_treemirror will be read only partially!
     * @param $idSite
     * @return mixed
     * @throws \Piwik\Tracker\Db\DbException
     */
    public function getActiveRecords($idSite)
    {
        $query = $this->getQueryActiveRequests();

        $bind = $query['bind'];
        $bind[] = $idSite;

        $fields = $this->getAllFieldNames(false);
        // we want to avoid needing to read all the entire treemirror every time the tracking cache will be updated
        // as in worst case every treemirror can be 16MB or in rare cases even more. Most of the time it's only like 50KB or so
        // but we want to avoid fetching heaps of unneeded data
        $fields .= ', SUBSTRING(page_treemirror, 1, 10) as page_treemirror';

        // NOTE: If you adjust this query, you might also
        $sql = sprintf("SELECT " . $fields . " FROM %s WHERE %s and idsite = ? ORDER BY idsitehsr asc", $this->tablePrefixed, $query['where']);
        $records = $this->getDb()->fetchAll($sql, $bind);

        foreach ($records as $index => $record) {
            if (!empty($record['page_treemirror'])) {
                // avoids an error when it tries to uncompress
                $records[$index]['page_treemirror'] = $this->compress($record['page_treemirror']);
            }
        }

        return $this->enrichRecords($records);
    }

    private function enrichRecords($records)
    {
        if (empty($records)) {
            return $records;
        }

        foreach ($records as $index => $record) {
            $records[$index] = $this->enrichRecord($record);
        }

        return $records;
    }

    private function enrichRecord($record)
    {
        if (empty($record)) {
            return $record;
        }

        $record['idsitehsr'] = (int) $record['idsitehsr'];
        $record['idsite'] = (int) $record['idsite'];
        $record['sample_rate'] = number_format($record['sample_rate'], 1, '.', '');
        $record['record_type'] = (int) $record['record_type'];
        $record['sample_limit'] = (int) $record['sample_limit'];
        $record['min_session_time'] = (int) $record['min_session_time'];
        $record['breakpoint_mobile'] = (int) $record['breakpoint_mobile'];
        $record['breakpoint_tablet'] = (int) $record['breakpoint_tablet'];
        $record['match_page_rules'] = $this->decodeField($record['match_page_rules']);
        $record['requires_activity'] = !empty($record['requires_activity']);
        $record['capture_keystrokes'] = !empty($record['capture_keystrokes']);
        $record['capture_manually'] = !empty($record['capture_manually']) ? 1 : 0;

        if (!empty($record['page_treemirror'])) {
            $record['page_treemirror'] = $this->uncompress($record['page_treemirror']);
        } else {
            $record['page_treemirror'] = '';
        }

        return $record;
    }

    public function uninstall()
    {
        Db::query(sprintf('DROP TABLE IF EXISTS `%s`', $this->tablePrefixed));
    }

    public function getAllEntities()
    {
        $records = $this->getDb()->fetchAll('SELECT * FROM ' . $this->tablePrefixed);

        return $this->enrichRecords($records);
    }

    private function encodeFieldsWhereNeeded($columns)
    {
        foreach ($columns as $column => $value) {
            if ($column === 'match_page_rules') {
                $columns[$column] = $this->encodeField($value);
            } elseif ($column === 'page_treemirror') {
                if (!empty($value)) {
                    $columns[$column] = $this->compress($value);
                } else {
                    $columns[$column] = null;
                }
            } elseif (in_array($column, array('breakpoint_mobile', 'breakpoint_tablet', 'min_session_time', 'sample_rate'), $strict = true)) {
                if ($value > self::MAX_SMALLINT) {
                    $columns[$column] = self::MAX_SMALLINT;
                }
            } elseif (in_array($column, array('requires_activity', 'capture_keystrokes'), $strict = true)) {
                if (!empty($value)) {
                    $columns[$column] = 1;
                } else {
                    $columns[$column] = 0;
                }
            }
        }

        return $columns;
    }

    private function compress($data)
    {
        if (!empty($data)) {
            return gzcompress($data);
        }

        return $data;
    }

    private function uncompress($data)
    {
        if (!empty($data)) {
            return gzuncompress($data);
        }

        return $data;
    }

    private function encodeField($field)
    {
        if (empty($field) || !is_array($field)) {
            $field = array();
        }

        return json_encode($field);
    }

    private function decodeField($field)
    {
        if (!empty($field)) {
            $field = @json_decode($field, true);
        }

        if (empty($field) || !is_array($field)) {
            $field = array();
        }

        return $field;
    }
}
