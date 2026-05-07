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
use Piwik\Container\StaticContainer;
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Archiver\Aggregator;
use Piwik\Plugins\Live\VisitorDetailsAbstract;

class VisitorDetails extends VisitorDetailsAbstract
{
    protected $recordings = null;

    public function provideActionsForVisitIds(&$actions, $visitIds)
    {
        if (empty($visitIds)) {
            return;
        }
        // use this method to fetch all available recordings
        $this->recordings = array_fill_keys($visitIds, null);

        $aggregator = new Aggregator();
        $recordings = $aggregator->findRecordings($visitIds);

        foreach ($recordings as $recording) {
            $this->recordings[$recording['idvisit']] = $recording;
        }
    }

    public function extendVisitorDetails(&$visitor)
    {
        $visitor['sessionReplayUrl'] = null;

        $idVisit = $visitor['idVisit'];
        $idSite  = $visitor['idSite'];

        if (empty($idSite) || empty($idVisit) || !$this->getValidator()->canViewSessionReport($idSite)) {
            return;
        }

        $recording = $this->getRecoding($idVisit);

        if (!empty($recording) && !empty($recording['idsitehsr'])) {
            $visitor['sessionReplayUrl'] = '?module=HeatmapSessionRecording&action=replayRecording&idSite=' . (int)$idSite . '&idLogHsr=' . (int)$recording['idloghsr'] . '&idSiteHsr=' . (int)$recording['idsitehsr'];

            $token_auth = Common::getRequestVar('token_auth', '', 'string');
            $force_api_session = Common::getRequestVar('force_api_session', 0, 'int');
            if (
                !empty($token_auth)
                && ctype_xdigit($token_auth) && strlen($token_auth) > 30 && strlen($token_auth) < 81
                && !HeatmapSessionRecording::isMatomoForWordPress()
                && !$force_api_session
            ) {
                $visitor['sessionReplayUrl'] .= '&token_auth=' . rawurlencode($token_auth);
            }
        }
    }

    protected function getRecoding($idVisit)
    {
        if (empty($this->recordings) || !array_key_exists($idVisit, $this->recordings)) {
            // if not prefetched
            $aggregator = new Aggregator();
            return $aggregator->findRecording($idVisit);
        }

        return $this->recordings[$idVisit];
    }

    /**
     * @return \Piwik\Plugins\HeatmapSessionRecording\Input\Validator
     */
    protected function getValidator()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
    }

    public function renderIcons($visitorDetails)
    {
        if (!empty($visitorDetails['sessionReplayUrl'])) {
            $title = htmlentities(
                Piwik::translate('HeatmapSessionRecording_ReplayRecordedSession'),
                ENT_COMPAT | ENT_HTML401,
                'UTF-8'
            );
            return '<a class="visitorLogIconReplaySession" href="' . $visitorDetails['sessionReplayUrl'] . '" target="_blank" rel="noreferrer noopener" title="' . $title . '"><span class="icon-play"></a>';
        }

        return '';
    }

    public function renderVisitorDetails($visitorDetails)
    {
        if (!empty($visitorDetails['sessionReplayUrl'])) {
            $title = htmlentities(
                Piwik::translate('HeatmapSessionRecording_ReplayRecordedSession'),
                ENT_COMPAT | ENT_HTML401,
                'UTF-8'
            );
            return [
                [
                    100,
                    '<a class="visitorLogReplaySession" href="' . $visitorDetails['sessionReplayUrl'] . '" target="_blank" rel="noreferrer noopener"><span class="icon-play"></span> ' . $title . '</a><br />'
                ]
            ];
        }

        return [];
    }
}
