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

namespace Piwik\Plugins\HeatmapSessionRecording\Input;

use Exception;
use Piwik\Piwik;

class MinSessionTime
{
    private $minSessionTime;

    public const MAX_LIMIT = 65000;

    public function __construct($minSessionTime)
    {
        $this->minSessionTime = $minSessionTime;
    }

    public function check()
    {
        $title = 'HeatmapSessionRecording_MinSessionTime';

        if ($this->minSessionTime === false || $this->minSessionTime === null || $this->minSessionTime === '') {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotProvided', $title));
        }

        if (!is_numeric($this->minSessionTime)) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotANumber', array($title)));
        }

        if ($this->minSessionTime < 0) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLow', array($title, 0)));
        }

        if ($this->minSessionTime > self::MAX_LIMIT) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooHigh', array($title, self::MAX_LIMIT)));
        }
    }
}
