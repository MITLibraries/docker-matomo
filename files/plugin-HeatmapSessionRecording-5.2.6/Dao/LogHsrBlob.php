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

class LogHsrBlob
{
    private $table = 'log_hsr_blob';
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
        DbHelper::createTable($this->table, "
                  `idhsrblob` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                  `hash` INT(10) UNSIGNED NOT NULL,
                  `compressed` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
                  `value` MEDIUMBLOB NULL DEFAULT NULL,
                  PRIMARY KEY (`idhsrblob`),
                  INDEX (`hash`)");

        // we always build the hash on the raw text for simplicity
    }

    public function uninstall()
    {
        Db::query(sprintf('DROP TABLE IF EXISTS `%s`', $this->tablePrefixed));
    }

    public function findEntry($textHash, $text, $textCompressed)
    {
        $sql = sprintf('SELECT idhsrblob FROM %s WHERE `hash` = ? and (`value` = ? or `value` = ?) LIMIT 1', $this->tablePrefixed);
        $id = $this->getDb()->fetchOne($sql, array($textHash, $text, $textCompressed));

        return $id;
    }

    public function createEntry($textHash, $text, $isCompressed)
    {
        $sql = sprintf('INSERT INTO %s (`hash`, `compressed`, `value`) VALUES(?,?,?) ', $this->tablePrefixed);
        $this->getDb()->query($sql, array($textHash, (int) $isCompressed, $text));

        return $this->getDb()->lastInsertId();
    }

    public function record($text)
    {
        if ($text === null || $text === false) {
            return null;
        }

        $textHash = abs(crc32($text));
        $textCompressed = $this->compress($text);

        $id = $this->findEntry($textHash, $text, $textCompressed);

        if (!empty($id)) {
            return $id;
        }

        $isCompressed = 0;
        if ($text !== $textCompressed && strlen($textCompressed) < strlen($text)) {
            // detect if it is more efficient to store compressed or raw text
            $text = $textCompressed;
            $isCompressed = 1;
        }

        return $this->createEntry($textHash, $text, $isCompressed);
    }

    public function deleteUnusedBlobEntries()
    {
        $eventTable = Common::prefixTable('log_hsr_event');
        $blobTable = Common::prefixTable('log_hsr_blob');

        $blobEntries = Db::fetchAll('SELECT distinct idhsrblob FROM ' . $eventTable . ' LIMIT 2');
        $blobEntries = array_filter($blobEntries, function ($val) {
            return $val['idhsrblob'] !== null;
        }); // remove null values.

        if (empty($blobEntries)) {
            // no longer any blobs in use... delete all blobs
            $sql = 'DELETE FROM ' . $blobTable;
            Db::query($sql);
            return $sql;
        }

        $indexes = Db::fetchAll('SHOW INDEX FROM ' . $eventTable);
        $indexSql = '';
        foreach ($indexes as $index) {
            if (
                (!empty($index['Column_name']) && !empty($index['Key_name']) && $index['Column_name'] === 'idhsrblob')
                || (!empty($index['Key_name']) && $index['Key_name'] === 'idhsrblob')
                || (!empty($index['Key_name']) && $index['Key_name'] === 'index_idhsrblob')
            ) {
                $indexSql = 'FORCE INDEX FOR JOIN (' . $index['Key_name'] . ')';
                break;
            }
        }

        $sql = sprintf('DELETE hsrblob
            FROM %s hsrblob
            LEFT JOIN %s hsrevent %s on hsrblob.idhsrblob = hsrevent.idhsrblob
            WHERE hsrevent.idloghsr is null', $blobTable, $eventTable, $indexSql);

        Db::query($sql);
        return $sql;
    }

    public function getAllRecords()
    {
        $blobs = $this->getDb()->fetchAll('SELECT * FROM ' . $this->tablePrefixed);
        return $this->enrichRecords($blobs);
    }

    private function enrichRecords($blobs)
    {
        if (!empty($blobs)) {
            foreach ($blobs as $index => &$blob) {
                if (!empty($blob['compressed'])) {
                    $blob['value'] = $this->uncompress($blob['value']);
                }
            }
        }

        return $blobs;
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
}
