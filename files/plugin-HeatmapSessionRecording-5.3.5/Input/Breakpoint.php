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

class Breakpoint
{
    /**
     * @var int
     */
    private $breakpoint;

    /**
     * @var string
     */
    private $name;

    public const MAX_LIMIT = 65000;

    public const DEFAULT_MOBILE = 600;
    public const DEFAULT_TABLET = 960;

    public function __construct($breakpoint, $name)
    {
        $this->breakpoint = $breakpoint;
        $this->name = $name;
    }

    public function check()
    {
        $title = Piwik::translate('HeatmapSessionRecording_BreakpointX', array($this->name));

        // zero is a valid value!
        if ($this->breakpoint === false || $this->breakpoint === null || $this->breakpoint === '') {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotProvided', $title));
        }

        if (!is_numeric($this->breakpoint)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotANumber', array($title)));
        }

        if ($this->breakpoint < 0) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLow', array($title, 0)));
        }

        if ($this->breakpoint > self::MAX_LIMIT) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooHigh', array($title, self::MAX_LIMIT)));
        }
    }
}
