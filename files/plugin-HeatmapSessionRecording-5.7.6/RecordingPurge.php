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

use Piwik\API\Request;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\SitesManager\API as SitesManagerAPI;
use Piwik\Site;
use Piwik\Tracker\Cache;

/**
 * Removes the existing heatmaps or session recordings once recording them has been
 * disabled, either by the super user turning the system setting on or by a compliance
 * policy starting to enforce it.
 *
 * The records are removed through this plugin's own API so the activity log keeps
 * recording the deletions. That API refuses to hand them out while recording is
 * disabled - which is exactly the state that triggers the purge - so the purge marks
 * itself while it runs and {@link Input\Validator} lets it through for that record type
 * only.
 *
 * @internal
 */
class RecordingPurge
{
    /**
     * The API methods used to list and delete each record type.
     */
    private const API_METHODS = [
        SiteHsrDao::RECORD_TYPE_HEATMAP => [
            'list' => 'HeatmapSessionRecording.getHeatmaps',
            'delete' => 'HeatmapSessionRecording.deleteHeatmap',
        ],
        SiteHsrDao::RECORD_TYPE_SESSION => [
            'list' => 'HeatmapSessionRecording.getSessionRecordings',
            'delete' => 'HeatmapSessionRecording.deleteSessionRecording',
        ],
    ];

    /**
     * Keyed by the SiteHsrDao::RECORD_TYPE_* constant currently being purged.
     *
     * @var array<int, bool>
     */
    private static $activeTypes = [];

    /**
     * @param int $hsrType One of the SiteHsrDao::RECORD_TYPE_* constants
     */
    public static function isActiveFor($hsrType): bool
    {
        return !empty(self::$activeTypes[$hsrType]);
    }

    /**
     * Deletes every record of the given type, for the given websites or for all of them.
     *
     * @param int $hsrType One of the SiteHsrDao::RECORD_TYPE_* constants
     * @param array<int|string>|null $idSites The websites to purge, or null for every website
     */
    public static function purge($hsrType, ?array $idSites = null): void
    {
        if (!isset(self::API_METHODS[$hsrType])) {
            throw new \Exception('Unsupported HSR Type: ' . $hsrType);
        }

        if (is_null($idSites)) {
            $idSites = SitesManagerAPI::getInstance()->getAllSitesId();
        }

        if (empty($idSites)) {
            return;
        }

        self::run($hsrType, function () use ($hsrType, $idSites) {
            foreach ($idSites as $id) {
                $id = (int) $id;

                if (Site::getTypeFor($id) === 'proxysite') {
                    continue; //do not delete records for proxySite as it will throw an exception due to read only behaviour
                }

                $records = Request::processRequest(self::API_METHODS[$hsrType]['list'], [
                    'idSite' => $id, 'filter_limit' => -1
                ]);

                foreach ($records as $record) {
                    Request::processRequest(self::API_METHODS[$hsrType]['delete'], [
                        'idSite' => $id,
                        'idSiteHsr' => $record['idsitehsr']
                    ]);
                }
            }
        });

        Cache::deleteTrackerCache();
    }

    /**
     * Runs the given callable as a purge of the given record type.
     *
     * @param int $hsrType One of the SiteHsrDao::RECORD_TYPE_* constants
     * @param callable $callback
     * @return mixed whatever $callback returns
     */
    private static function run($hsrType, callable $callback)
    {
        $previous = self::isActiveFor($hsrType);
        self::$activeTypes[$hsrType] = true;

        try {
            return $callback();
        } finally {
            self::$activeTypes[$hsrType] = $previous;
        }
    }
}
