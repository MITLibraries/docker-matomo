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

class SampleRate
{
    public const MAX_RATE = 100;

    private $sampleRate;

    public function __construct($sampleRate)
    {
        $this->sampleRate = $sampleRate;
    }

    public function check()
    {
        $title = 'HeatmapSessionRecording_SampleRate';

        if ($this->sampleRate === false || $this->sampleRate === null || $this->sampleRate === '') {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotProvided', $title));
        }

        if (!is_numeric($this->sampleRate)) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotANumber', array($title)));
        }

        if ($this->sampleRate < 0) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLow', array($title, 0)));
        }

        if ($this->sampleRate > self::MAX_RATE) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooHigh', array($title, self::MAX_RATE)));
        }

        if (!preg_match('/^\d{1,3}\.?\d?$/', (string) $this->sampleRate)) {
            $title = Piwik::translate($title);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotANumber', array($title)));
        }
    }
}
