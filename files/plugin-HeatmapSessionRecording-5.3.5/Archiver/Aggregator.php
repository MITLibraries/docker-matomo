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

namespace Piwik\Plugins\HeatmapSessionRecording\Archiver;

use Piwik\Common;
use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\DataAccess\LogAggregator;
use Piwik\Date;
use Piwik\Db;
use Piwik\DbHelper;
use Piwik\Period;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;
use Piwik\Plugins\Live\Model;
use Piwik\Segment;
use Piwik\ArchiveProcessor;
use Piwik\Site;

class Aggregator
{
    /**
     * @internal tests only
     * @var bool
     */
    public $forceSleepInQuery = false;

    public function findRecording($idVisit)
    {
        $extraWhere = '';
        if ($this->forceSleepInQuery) {
            $extraWhere = 'SLEEP(1) AND';
        }

        $query = sprintf(
            'SELECT /* HeatmapSessionRecording.findRecording */ hsrsite.idsitehsr,
                   min(hsr.idloghsr) as idloghsr
                   FROM %s hsr 
                   LEFT JOIN %s hsrsite ON hsr.idloghsr = hsrsite.idloghsr 
                   LEFT JOIN %s hsrevent ON hsrevent.idloghsr = hsr.idloghsr and hsrevent.event_type = %s
                   LEFT JOIN %s sitehsr ON hsrsite.idsitehsr = sitehsr.idsitehsr
                   WHERE %s hsr.idvisit = ? and sitehsr.record_type = ? and hsrevent.idhsrblob is not null and hsrsite.idsitehsr is not null
                   GROUP BY hsrsite.idsitehsr 
                  LIMIT 1',
            Common::prefixTable('log_hsr'),
            Common::prefixTable('log_hsr_site'),
            Common::prefixTable('log_hsr_event'),
            RequestProcessor::EVENT_TYPE_INITIAL_DOM,
            Common::prefixTable('site_hsr'),
            $extraWhere
        );

        $readerDb = $this->getDbReader();
        $query = DbHelper::addMaxExecutionTimeHintToQuery($query, $this->getLiveQueryMaxExecutionTime());

        try {
            return $readerDb->fetchRow($query, array($idVisit, SiteHsrDao::RECORD_TYPE_SESSION));
        } catch (\Exception $e) {
            Model::handleMaxExecutionTimeError($readerDb, $e, '', Date::now(), Date::now(), null, 0, ['sql' => $query]);
            throw $e;
        }
    }

    private function getDbReader()
    {
        if (method_exists(Db::class, 'getReader')) {
            return Db::getReader();
        } else {
            return Db::get();
        }
    }

    public function findRecordings($visitIds)
    {
        if (empty($visitIds)) {
            return array();
        }

        $visitIds = array_map('intval', $visitIds);

        $extraWhere = '';
        if ($this->forceSleepInQuery) {
            $extraWhere = 'SLEEP(1) AND';
        }

        $query = sprintf(
            'SELECT /* HeatmapSessionRecording.findRecordings */ hsrsite.idsitehsr,
                   min(hsr.idloghsr) as idloghsr,
                   hsr.idvisit
                   FROM %s hsr 
                   LEFT JOIN %s hsrsite ON hsr.idloghsr = hsrsite.idloghsr 
                   LEFT JOIN %s hsrevent ON hsrevent.idloghsr = hsr.idloghsr and hsrevent.event_type = %s
                   LEFT JOIN %s sitehsr ON hsrsite.idsitehsr = sitehsr.idsitehsr
                   WHERE %s hsr.idvisit IN ("%s") and sitehsr.record_type = ? and hsrevent.idhsrblob is not null and hsrsite.idsitehsr is not null
                   GROUP BY hsr.idvisit, hsrsite.idsitehsr',
            Common::prefixTable('log_hsr'),
            Common::prefixTable('log_hsr_site'),
            Common::prefixTable('log_hsr_event'),
            RequestProcessor::EVENT_TYPE_INITIAL_DOM,
            Common::prefixTable('site_hsr'),
            $extraWhere,
            implode('","', $visitIds)
        );

        $readerDb = $this->getDbReader();
        $query = DbHelper::addMaxExecutionTimeHintToQuery($query, $this->getLiveQueryMaxExecutionTime());

        try {
            return $readerDb->fetchAll($query, array(SiteHsrDao::RECORD_TYPE_SESSION));
        } catch (\Exception $e) {
            Model::handleMaxExecutionTimeError($readerDb, $e, '', Date::now(), Date::now(), null, 0, ['sql' => $query]);
            throw $e;
        }
    }

    private function getLiveQueryMaxExecutionTime()
    {
        return Config::getInstance()->General['live_query_max_execution_time'];
    }

    public function getEmbedSessionInfo($idSite, $idSiteHsr, $idLogHsr)
    {
        $logHsr = Common::prefixTable('log_hsr');
        $logHsrSite = Common::prefixTable('log_hsr_site');
        $logAction = Common::prefixTable('log_action');
        $logEvent = Common::prefixTable('log_hsr_event');
        $logBlob = Common::prefixTable('log_hsr_blob');

        $query = sprintf(
            'SELECT laction.name as base_url,
                                        laction.url_prefix, hsrblob.`value` as initial_mutation, hsrblob.compressed
                          FROM %s hsr 
                          LEFT JOIN %s laction ON laction.idaction = hsr.idaction_url
                          LEFT JOIN %s hsr_site ON hsr_site.idloghsr = hsr.idloghsr
                          LEFT JOIN %s hsrevent ON hsrevent.idloghsr = hsr.idloghsr and hsrevent.event_type = %s
                          LEFT JOIN %s hsrblob ON hsrevent.idhsrblob = hsrblob.idhsrblob
                          WHERE hsr.idloghsr = ? and hsr.idsite = ? and hsr_site.idsitehsr = ? 
                                and hsrevent.idhsrblob is not null and `hsrblob`.`value` is not null
                          LIMIT 1',
            $logHsr,
            $logAction,
            $logHsrSite,
            $logEvent,
            RequestProcessor::EVENT_TYPE_INITIAL_DOM,
            $logBlob
        );

        $row = $this->getDbReader()->fetchRow($query, array($idLogHsr, $idSite, $idSiteHsr));

        if (!empty($row['compressed'])) {
            $row['initial_mutation'] = gzuncompress($row['initial_mutation']);
        }

        return $row;
    }

    public function getRecordedSession($idLogHsr)
    {
        $select = 'log_action.name as url,
                   log_visit.idvisit,
                   log_visit.idvisitor,
                   log_hsr.idsite,
                   log_visit.location_country,
                   log_visit.location_region,
                   log_visit.location_city,
                   log_visit.config_os,
                   log_visit.config_device_type,
                   log_visit.config_device_model,
                   log_visit.config_browser_name,
                   log_hsr.time_on_page,
                   log_hsr.server_time,
                   log_hsr.viewport_w_px,
                   log_hsr.viewport_h_px,
                   log_hsr.scroll_y_max_relative,
                   log_hsr.fold_y_relative';

        $logHsr = Common::prefixTable('log_hsr');
        $logVisit = Common::prefixTable('log_visit');
        $logAction = Common::prefixTable('log_action');

        $query = sprintf('SELECT %s 
                          FROM %s log_hsr 
                          LEFT JOIN %s log_visit ON log_hsr.idvisit = log_visit.idvisit
                          LEFT JOIN %s log_action ON log_action.idaction = log_hsr.idaction_url
                          WHERE log_hsr.idloghsr = ?', $select, $logHsr, $logVisit, $logAction);

        return $this->getDbReader()->fetchRow($query, array($idLogHsr));
    }

    public function getRecordedSessions($idSite, $idSiteHsr, $period, $date, $segment)
    {
        $period = Period\Factory::build($period, $date);
        $segment = new Segment($segment, array($idSite));
        $site = new Site($idSite);

        $from = array(
            'log_hsr',
            array(
                'table' => 'log_hsr_site',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr.idloghsr'
            ),
            array(
                'table' => 'log_visit',
                'joinOn' => 'log_visit.idvisit = log_hsr.idvisit'
            ),
            array(
                'table' => 'log_action',
                'joinOn' => 'log_action.idaction = log_hsr.idaction_url'
            ),
            array(
                'table' => 'log_hsr_event',
                'joinOn' => 'log_hsr_event.idloghsr = log_hsr.idloghsr and log_hsr_event.event_type = ' . RequestProcessor::EVENT_TYPE_INITIAL_DOM
            )
        );

        // we need to make sure to show only sessions that have an initial mutation with time_since_load = 0, otherwise
        // the recording won't work.
        $logHsrEventTable = Common::prefixTable('log_hsr_event');

        $actionQuery = sprintf('SELECT count(*) FROM %1$s as hsr_ev
                        WHERE hsr_ev.idloghsr = log_hsr_site.idloghsr and hsr_ev.event_type not in (%2$s, %3$s)', $logHsrEventTable, RequestProcessor::EVENT_TYPE_CSS, RequestProcessor::EVENT_TYPE_INITIAL_DOM);

        $select = 'log_hsr.idvisit as label,
                   count(*) as nb_pageviews,
                   log_hsr.idvisit,
                   SUBSTRING_INDEX(GROUP_CONCAT(CAST(log_action.name AS CHAR) ORDER BY log_hsr.server_time ASC SEPARATOR \'##\'), \'##\', 1) as first_url,
                   SUBSTRING_INDEX(GROUP_CONCAT(CAST(log_action.name AS CHAR) ORDER BY log_hsr.server_time DESC SEPARATOR \'##\'), \'##\', 1) as last_url,
                   sum(log_hsr.time_on_page) as time_on_site,
                   (' . $actionQuery . ') as total_events,
                   min(log_hsr_site.idloghsr) as idloghsr,
                   log_visit.idvisitor,
                   log_visit.location_country,
                   log_visit.location_region,
                   log_visit.location_city,
                   log_visit.config_os,
                   log_visit.config_device_type,
                   log_visit.config_device_model,
                   log_visit.config_browser_name,
                   min(log_hsr.server_time) as server_time';

        $params = new ArchiveProcessor\Parameters($site, $period, $segment);
        $logAggregator = new LogAggregator($params);

        $where = $logAggregator->getWhereStatement('log_hsr', 'server_time');
        $where .= sprintf(" and log_hsr_site.idsitehsr = %d and log_hsr_event.idhsrblob is not null", (int) $idSiteHsr);
        $groupBy = 'log_hsr.idvisit';
        $orderBy = 'log_hsr.server_time DESC';

        $revertSubselect = $this->applyForceSubselect($segment, 'log_hsr.idvisit,log_hsr_site.idloghsr');

        $query = $logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy);

        if (!empty($revertSubselect) && is_callable($revertSubselect)) {
            call_user_func($revertSubselect);
        }

        $dbReader = $this->getDbReader();
        $query['sql'] = DbHelper::addMaxExecutionTimeHintToQuery($query['sql'], $this->getLiveQueryMaxExecutionTime());

        try {
            return $dbReader->fetchAll($query['sql'], $query['bind']);
        } catch (\Exception $e) {
            Model::handleMaxExecutionTimeError($dbReader, $e, '', Date::now(), Date::now(), null, 0, $query);
            throw $e;
        }
    }

    private function applyForceSubselect($segment, $subselectForced)
    {
        // for performance reasons we use this and not `LogAggregator->allowUsageSegmentCache()`
        // That's because this is a LIVE query and not archived... and HSR tables usually have few entries < 5000
        // so segmentation should be fairly fast using this method compared to allowUsageSegmentCache
        // which would query the entire log_visit over several days with the applied query and then create the temp table
        // and only then apply the log_hsr query.
        // it should be a lot faster this way
        if (class_exists('Piwik\DataAccess\LogQueryBuilder') && !$segment->isEmpty()) {
            $logQueryBuilder = StaticContainer::get('Piwik\DataAccess\LogQueryBuilder');
            if (
                method_exists($logQueryBuilder, 'getForcedInnerGroupBySubselect') &&
                method_exists($logQueryBuilder, 'forceInnerGroupBySubselect')
            ) {
                $forceGroupByBackup = $logQueryBuilder->getForcedInnerGroupBySubselect();
                $logQueryBuilder->forceInnerGroupBySubselect($subselectForced);

                return function () use ($forceGroupByBackup, $logQueryBuilder) {
                    $logQueryBuilder->forceInnerGroupBySubselect($forceGroupByBackup);
                };
            }
        }
    }

    public function getRecordedPageViewsInSession($idSite, $idSiteHsr, $idVisit, $period, $date, $segment)
    {
        $period = Period\Factory::build($period, $date);
        $segment = new Segment($segment, array($idSite));
        $site = new Site($idSite);

        $from = array(
            'log_hsr',
            array(
                'table' => 'log_hsr_site',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr.idloghsr'
            ),
            array(
                'table' => 'log_visit',
                'joinOn' => 'log_visit.idvisit = log_hsr.idvisit'
            ),
            array(
                'table' => 'log_action',
                'joinOn' => 'log_action.idaction = log_hsr.idaction_url'
            ),
            array(
                'table' => 'log_hsr_event',
                'joinOn' => 'log_hsr_event.idloghsr = log_hsr.idloghsr and log_hsr_event.event_type = ' . RequestProcessor::EVENT_TYPE_INITIAL_DOM
            )
        );

        // we need to make sure to show only sessions that have an initial mutation with time_since_load = 0, otherwise
        // the recording won't work. If this happens often, we might "end / finish" a configured session recording
        // earlier since we have eg recorded 1000 sessions, but user sees only 950 which will be confusing but we can
        // for now not take this into consideration during tracking when we get number of available samples only using
        // log_hsr_site to detect if the number of configured sessions have been reached. ideally we would at some point
        // also make sure to include this check there but will be slower.

        $select = 'log_action.name as label,
                   log_visit.idvisitor,
                   log_hsr_site.idloghsr,
                   log_hsr.time_on_page as time_on_page,
                   CONCAT(log_hsr.viewport_w_px, "x", log_hsr.viewport_h_px) as resolution,
                   log_hsr.server_time,
                   log_hsr.scroll_y_max_relative,
                   log_hsr.fold_y_relative';

        $params = new ArchiveProcessor\Parameters($site, $period, $segment);
        $logAggregator = new LogAggregator($params);

        $where = $logAggregator->getWhereStatement('log_hsr', 'server_time');
        $where .= sprintf(" and log_hsr_site.idsitehsr = %d and log_hsr.idvisit = %d and log_hsr_event.idhsrblob is not null ", (int) $idSiteHsr, (int) $idVisit);
        $groupBy = '';
        $orderBy = 'log_hsr.server_time ASC';

        $revertSubselect = $this->applyForceSubselect($segment, 'log_hsr.idvisit,log_hsr_site.idloghsr');

        $query = $logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy);

        if (!empty($revertSubselect) && is_callable($revertSubselect)) {
            call_user_func($revertSubselect);
        }

        return $this->getDbReader()->fetchAll($query['sql'], $query['bind']);
    }

    public function aggregateHeatmap($idSiteHsr, $heatmapType, $deviceType, $idSite, $period, $date, $segment)
    {
        $heatmapTypeWhere = '';
        if ($heatmapType == RequestProcessor::EVENT_TYPE_CLICK) {
            $heatmapTypeWhere .= 'log_hsr_event.event_type = ' . (int) $heatmapType;
        } elseif ($heatmapType == RequestProcessor::EVENT_TYPE_MOVEMENT) {
            $heatmapTypeWhere .= 'log_hsr_event.event_type IN(' . (int) RequestProcessor::EVENT_TYPE_MOVEMENT . ',' . (int) RequestProcessor::EVENT_TYPE_CLICK . ')';
        } else {
            throw new \Exception('Heatmap type not supported');
        }

        $period = Period\Factory::build($period, $date);
        $segment = new Segment($segment, array($idSite));
        $site = new Site($idSite);

        $from = array(
            'log_hsr',
            array(
                'table' => 'log_hsr_site',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr.idloghsr'
            ),
            array(
                'table' => 'log_hsr_event',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr_event.idloghsr'
            ),
            array(
                'table' => 'log_action',
                'joinOn' => 'log_action.idaction = log_hsr_event.idselector'
            )
        );

        $select = 'log_action.name as selector, 
                   log_hsr_event.x as offset_x,
                   log_hsr_event.y as offset_y,
                   count(*) as value';

        $params = new ArchiveProcessor\Parameters($site, $period, $segment);
        $logAggregator = new LogAggregator($params);

        $where = $logAggregator->getWhereStatement('log_hsr', 'server_time');
        $where .= ' and log_hsr_site.idsitehsr = ' . (int) $idSiteHsr . ' and log_hsr_event.idselector is not null and ' . $heatmapTypeWhere;
        $where .= ' and log_hsr.device_type = ' . (int) $deviceType;

        $groupBy = 'log_hsr_event.idselector, log_hsr_event.x, log_hsr_event.y';
        $orderBy = '';

        $query = $logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy);

        return $this->getDbReader()->fetchAll($query['sql'], $query['bind']);
    }

    public function getRecordedHeatmapMetadata($idSiteHsr, $idSite, $period, $date, $segment)
    {
        $period = Period\Factory::build($period, $date);
        $segment = new Segment($segment, array($idSite));
        $site = new Site($idSite);

        $from = array(
            'log_hsr',
            array(
                'table' => 'log_hsr_site',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr.idloghsr'
            )
        );

        $select = 'log_hsr.device_type, count(*) as value, avg(log_hsr.fold_y_relative) as avg_fold';

        $params = new ArchiveProcessor\Parameters($site, $period, $segment);
        $logAggregator = new LogAggregator($params);

        $where = $logAggregator->getWhereStatement('log_hsr', 'server_time');
        $where .= ' and log_hsr_site.idsitehsr = ' . (int) $idSiteHsr;
        $groupBy = 'log_hsr.device_type';
        $orderBy = '';

        $query = $logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy);

        return $this->getDbReader()->fetchAll($query['sql'], $query['bind']);
    }

    public function aggregateScrollHeatmap($idSiteHsr, $deviceType, $idSite, $period, $date, $segment)
    {
        $period = Period\Factory::build($period, $date);
        $segment = new Segment($segment, array($idSite));
        $site = new Site($idSite);

        $from = array('log_hsr',
            array(
                'table' => 'log_hsr_site',
                'joinOn' => 'log_hsr_site.idloghsr = log_hsr.idloghsr'
            ),
        );

        $select = 'log_hsr.scroll_y_max_relative as label,
                   count(*) as value';

        $params = new ArchiveProcessor\Parameters($site, $period, $segment);
        $logAggregator = new LogAggregator($params);
        $where = $logAggregator->getWhereStatement('log_hsr', 'server_time');
        $where .= ' and log_hsr_site.idsitehsr = ' . (int) $idSiteHsr;
        $where .= ' and log_hsr.device_type = ' . (int) $deviceType;

        $groupBy = 'log_hsr.scroll_y_max_relative';
        $orderBy = 'label ASC'; // labels are no from 0-1000 i.e page from top to bottom, so top label should always come first 0..100..500..1000

        $query = $logAggregator->generateQuery($select, $from, $where, $groupBy, $orderBy);

        return $this->getDbReader()->fetchAll($query['sql'], $query['bind']);
    }
}
