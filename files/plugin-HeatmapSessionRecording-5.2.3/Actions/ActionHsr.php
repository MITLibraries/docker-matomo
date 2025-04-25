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

namespace Piwik\Plugins\HeatmapSessionRecording\Actions;

use Piwik\Common;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;
use Piwik\Tracker\Action;
use Piwik\Tracker\Request;

class ActionHsr extends Action
{
    public const TYPE_HSR = 96;

    public function __construct(Request $request)
    {
        parent::__construct(static::TYPE_HSR, $request);

        $url = $request->getParam('url');

        $this->setActionUrl($url);
    }

    public static function shouldHandle(Request $request)
    {
        $params = $request->getParams();
        $isHsrRequest = Common::getRequestVar(RequestProcessor::TRACKING_PARAM_HSR_ID_VIEW, '', 'string', $params);

        return !empty($isHsrRequest);
    }

    protected function getActionsToLookup()
    {
        return array();
    }

    // Do not track this Event URL as Entry/Exit Page URL (leave the existing entry/exit)
    public function getIdActionUrlForEntryAndExitIds()
    {
        return false;
    }

    // Do not track this Event Name as Entry/Exit Page Title (leave the existing entry/exit)
    public function getIdActionNameForEntryAndExitIds()
    {
        return false;
    }
}
