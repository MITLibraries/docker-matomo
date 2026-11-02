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

use DeviceDetector\Parser\Device\AbstractDeviceParser;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Db;
use Piwik\Piwik;
use Piwik\Tracker;
use Piwik\DbHelper;
use Piwik\Tracker\Action;
use Piwik\Tracker\PageUrl;
use Piwik\Tracker\TableLogAction;

class LogHsr
{
    private $table = 'log_hsr';
    private $tablePrefixed = '';

    // HAS TO MATCH VALUE IN TRACKER!
    public const SCROLL_ACCURACY = 1000;

    public const DEVICE_TYPE_DESKTOP = 1;
    public const DEVICE_TYPE_TABLET = 2;
    public const DEVICE_TYPE_MOBILE = 3;

    /**
     * @var Db|Db\AdapterInterface|\Piwik\Tracker\Db
     */
    private $db;

    /**
     * @var LogHsrSite
     */
    private $logHsrSite;

    public function __construct(LogHsrSite $logHsrSite)
    {
        $this->tablePrefixed = Common::prefixTable($this->table);
        $this->logHsrSite = $logHsrSite;
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
                  `idloghsr` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                  `idsite` INT UNSIGNED NOT NULL,
                  `idvisit` BIGINT UNSIGNED NOT NULL,
                  `idhsrview` CHAR(6) NOT NULL,
                  `idpageview` CHAR(6) NULL,
                  `idaction_url` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `device_type` TINYINT(1) NOT NULL DEFAULT 1,
                  `server_time` DATETIME NOT NULL,
                  `time_on_page` BIGINT(8) UNSIGNED NOT NULL,
                  `viewport_w_px` SMALLINT(5) UNSIGNED DEFAULT 0,
                  `viewport_h_px` SMALLINT(5) UNSIGNED DEFAULT 0,
                  `scroll_y_max_relative` SMALLINT(5) UNSIGNED DEFAULT 0,
                  `fold_y_relative` SMALLINT(5) UNSIGNED DEFAULT 0,
                  PRIMARY KEY(`idloghsr`),
                  UNIQUE KEY idvisit_idhsrview (`idvisit`,`idhsrview`),
                  KEY idsite_servertime (`idsite`,`server_time`)");

        // idpageview is only there so we can add it to visitor log later. Please note that idpageview is only set on
        // the first tracking request. As the user may track a new pageview during the recording, the pageview may
        // change over time. This is why we need the idhsrview.

        // we need the idhsrview as there can be many recordings during one visit and this way we can control when
        // to trigger a new recording / heatmap in the tracker by changing this id
    }

    public function uninstall()
    {
        Db::query(sprintf('DROP TABLE IF EXISTS `%s`', $this->tablePrefixed));
    }

    protected function getDeviceWidth($resolution)
    {
        if (!empty($resolution)) {
            $parts = explode('x', $resolution);
            if (count($parts) === 2 && $parts[0] > 1 && $parts[1] > 1) {
                $width = $parts[0];
                return (int) $width;
            }
        }

        return 1280; // default desktop
    }

    protected function getDeviceType($hsrSiteIds, $idSite, $userAgent, $deviceWidth)
    {
        $deviceType = null;

        // we want to detect device type only once for faster performance
        $ddFactory = StaticContainer::get(\Piwik\DeviceDetector\DeviceDetectorFactory::class);
        $deviceDetector = $ddFactory->makeInstance($userAgent);
        $device = $deviceDetector->getDevice();

        $checkWidth = false;
        if (
            in_array(
                $device,
                array(
                    AbstractDeviceParser::DEVICE_TYPE_FEATURE_PHONE,
                    AbstractDeviceParser::DEVICE_TYPE_PHABLET,
                    AbstractDeviceParser::DEVICE_TYPE_SMARTPHONE,
                    AbstractDeviceParser::DEVICE_TYPE_CAMERA,
                    AbstractDeviceParser::DEVICE_TYPE_CAR_BROWSER
                ),
                $strict = true
            )
        ) {
            $deviceType = self::DEVICE_TYPE_MOBILE;
        } elseif (in_array($device, array(AbstractDeviceParser::DEVICE_TYPE_TABLET), $strict = true)) {
            $deviceType = self::DEVICE_TYPE_TABLET;
        } elseif ($deviceType === AbstractDeviceParser::DEVICE_TYPE_DESKTOP) {
            $deviceType = LogHsr::DEVICE_TYPE_DESKTOP;
            $checkWidth = true;
        } else {
            $checkWidth = true;
        }

        if ($checkWidth && !empty($deviceWidth)) {
            $hsrs = $this->getCachedHsrs($idSite);

            foreach ($hsrs as $hsr) {
                // the device type is only relevant for heatmaps so we only look for breakpoints in heatmaps
                if (
                    $hsr['record_type'] == SiteHsrDao::RECORD_TYPE_HEATMAP
                    && in_array($hsr['idsitehsr'], $hsrSiteIds)
                ) {
                    if ($deviceWidth < $hsr['breakpoint_mobile']) {
                        // resolution has to be lower than this
                        $deviceType = self::DEVICE_TYPE_MOBILE;
                    } elseif ($deviceWidth < $hsr['breakpoint_tablet']) {
                        $deviceType = self::DEVICE_TYPE_TABLET;
                    } else {
                        $deviceType = self::DEVICE_TYPE_DESKTOP;
                    }

                    break;
                }
            }
        }

        if (empty($deviceType)) {
            $deviceType = LogHsr::DEVICE_TYPE_DESKTOP;
        }

        return $deviceType;
    }

    protected function getCachedHsrs($idSite)
    {
        $cache = Tracker\Cache::getCacheWebsiteAttributes($idSite);

        if (!empty($cache['hsr'])) {
            return $cache['hsr'];
        }

        return array();
    }

    public function findIdLogHsr($idVisit, $idHsrView)
    {
        $query = sprintf('SELECT idloghsr FROM %s WHERE idvisit = ? and idhsrview = ? LIMIT 1', $this->tablePrefixed);

        return $this->getDb()->fetchOne($query, array($idVisit, $idHsrView));
    }

    public function hasRecordedIdVisit($idVisit, $idSiteHsr)
    {
        $siteTable = Common::prefixTable('log_hsr_site');
        $query = sprintf('SELECT lhsr.idvisit 
                                 FROM %s lhsr 
                                 LEFT JOIN %s lhsrsite ON lhsr.idloghsr=lhsrsite.idloghsr 
                                 WHERE lhsr.idvisit = ? and lhsrsite.idsitehsr = ? 
                                 LIMIT 1', $this->tablePrefixed, $siteTable);
        $id = $this->getDb()->fetchOne($query, array($idVisit, $idSiteHsr));
        return !empty($id);
    }

    // $hsrSiteIds => one recording may be long to several actual recordings.
    public function record($hsrSiteIds, $idSite, $idVisit, $idHsrView, $idPageview, $url, $serverTime, $userAgent, $resolution, $timeOnPage, $viewportW, $viewportH, $scrollYMaxRelative, $foldYRelative)
    {
        if ($foldYRelative > self::SCROLL_ACCURACY) {
            $foldYRelative = self::SCROLL_ACCURACY;
        }

        if ($scrollYMaxRelative > self::SCROLL_ACCURACY) {
            $scrollYMaxRelative = self::SCROLL_ACCURACY;
        }

        $idLogHsr = $this->findIdLogHsr($idVisit, $idHsrView);

        if (empty($idLogHsr)) {
            // to prevent race conditions we use atomic insert. It may lead to more gaps in auto increment but there is
            // no way around it

            Piwik::postEvent('HeatmapSessionRecording.trackNewHsrSiteIds', array(&$hsrSiteIds, array('idSite' => $idSite, 'serverTime' => $serverTime, 'idVisit' => $idVisit)));

            if (empty($hsrSiteIds)) {
                throw new \Exception('No hsrSiteIds');
            }

            $values = array(
                'idvisit' => $idVisit,
                'idsite' => $idSite,
                'idhsrview' => $idHsrView,
                'idpageview' => $idPageview,
                'server_time' => $serverTime,
                'time_on_page' => $timeOnPage,
                'viewport_w_px' => $viewportW,
                'viewport_h_px' => $viewportH,
                'scroll_y_max_relative' => (int)$scrollYMaxRelative,
                'fold_y_relative' => (int) $foldYRelative,
            );

            $columns = implode('`,`', array_keys($values));
            $bind = array_values($values);
            $sql = sprintf('INSERT INTO %s (`%s`) VALUES(?,?,?,?,?,?,?,?,?,?)', $this->tablePrefixed, $columns);

            try {
                $result = $this->getDb()->query($sql, $bind);
            } catch (\Exception $e) {
                if (Db::get()->isErrNo($e, \Piwik\Updater\Migration\Db::ERROR_CODE_DUPLICATE_ENTRY)) {
                    // race condition where two tried to insert at same time... we need to update instead

                    $idLogHsr = $this->findIdLogHsr($idVisit, $idHsrView);
                    $this->updateRecord($idLogHsr, $timeOnPage, $scrollYMaxRelative);
                    return $idLogHsr;
                }
                throw $e;
            }

            $all = $this->getDb()->rowCount($result);

            $idLogHsr = $this->getDb()->lastInsertId();

            if ($all === 1 || $all === '1') {
                // was inserted, resolve idaction! would be 2 or 0 on update
                // to be efficient we want to resolve idaction only once
                $url = PageUrl::normalizeUrl($url);
                $ids = TableLogAction::loadIdsAction(array('idaction_url' => array($url['url'], Action::TYPE_PAGE_URL, $url['prefixId'])));

                if (!empty($viewportW)) {
                    $deviceWidth = (int) $viewportW;
                } else {
                    $deviceWidth = $this->getDeviceWidth($resolution);
                }
                $deviceType = $this->getDeviceType($hsrSiteIds, $idSite, $userAgent, $deviceWidth);

                $idaction = $ids['idaction_url'];
                $this->getDb()->query(
                    sprintf('UPDATE %s set idaction_url = ?, device_type = ? where idloghsr = ?', $this->tablePrefixed),
                    array($idaction, $deviceType, $idLogHsr)
                );

                foreach ($hsrSiteIds as $hsrId) {
                    // for performance reasons we check the limit only on hsr start and we make this way sure to still
                    // accept all following requests to that hsr
                    $this->logHsrSite->linkRecord($idLogHsr, $hsrId);
                }
            }
        } else {
            $this->updateRecord($idLogHsr, $timeOnPage, $scrollYMaxRelative);
        }

        return $idLogHsr;
    }

    public function updateRecord($idLogHsr, $timeOnPage, $scrollYMaxRelative)
    {
        $sql = sprintf(
            'UPDATE %s SET
                              time_on_page = if(? > time_on_page, ?, time_on_page), 
                              scroll_y_max_relative = if(? > scroll_y_max_relative, ?, scroll_y_max_relative) 
                              WHERE idloghsr = ?',
            $this->tablePrefixed
        );

        $bind = array();
        $bind[] = $timeOnPage;
        $bind[] = $timeOnPage;
        $bind[] = $scrollYMaxRelative;
        $bind[] = $scrollYMaxRelative;
        $bind[] = $idLogHsr;

        $this->getDb()->query($sql, $bind);
    }

    public function getAllRecords()
    {
        return $this->getDb()->fetchAll('SELECT * FROM ' . $this->tablePrefixed);
    }

    public function findLogHsrIdsInVisit($idSite, $idVisit)
    {
        $rows = Db::fetchAll(sprintf('SELECT idloghsr FROM %s WHERE idvisit = ? and idsite = ?', $this->tablePrefixed), array($idVisit, $idSite));

        $idLogHsrs = array();
        foreach ($rows as $row) {
            $idLogHsrs[] = (int) $row['idloghsr'];
        }

        return $idLogHsrs;
    }

    public function findDeletedLogHsrIds()
    {
        // DELETE ALL LOG ENTRIES WHOSE IDSITEHSR DOES NO LONGER EXIST
        $rows = Db::fetchAll(sprintf(
            'SELECT DISTINCT log_hsr.idloghsr FROM %s log_hsr LEFT OUTER JOIN %s log_hsr_site ON log_hsr.idloghsr = log_hsr_site.idloghsr WHERE log_hsr_site.idsitehsr IS NULL',
            $this->tablePrefixed,
            Common::prefixTable('log_hsr_site')
        ));

        $idLogHsrsToDelete = array();
        foreach ($rows as $row) {
            $idLogHsrsToDelete[] = (int) $row['idloghsr'];
        }

        return $idLogHsrsToDelete;
    }

    public function deleteIdLogHsrsFromAllTables($idLogHsrsToDelete)
    {
        if (!is_array($idLogHsrsToDelete)) {
            throw new \Exception('idLogHsrsToDelete is not an array');
        }

        if (empty($idLogHsrsToDelete)) {
            return;
        }

        // we delete them in chunks of 2500
        $idLogHsrsToDelete = array_chunk($idLogHsrsToDelete, 2500);

        $tablesToDelete = array(
            Common::prefixTable('log_hsr_event'),
            Common::prefixTable('log_hsr_site'),
            Common::prefixTable('log_hsr'),
        );
        foreach ($idLogHsrsToDelete as $idsToDelete) {
            $idsToDelete = array_map('intval', $idsToDelete);
            $idsToDelete = implode(',', $idsToDelete);
            foreach ($tablesToDelete as $tableToDelete) {
                $sql = sprintf('DELETE FROM %s WHERE idloghsr IN(%s)', $tableToDelete, $idsToDelete);
                Db::query($sql);
            }
        }
    }
}
