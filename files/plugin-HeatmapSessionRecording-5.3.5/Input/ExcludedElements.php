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
use Piwik\Common;
use Piwik\Piwik;

class ExcludedElements
{
    public const MAX_LENGTH = 1000;

    /**
     * @var string
     */
    private $selector;

    public function __construct($name)
    {
        $this->selector = $name;
    }

    public function check()
    {
        if ($this->selector === null || $this->selector === false || $this->selector === '') {
            // selecto may not be set
            return;
        }

        $title = Piwik::translate('HeatmapSessionRecording_ExcludedElements');

        if (Common::mb_strlen($this->selector) > static::MAX_LENGTH) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLong', array($title, static::MAX_LENGTH)));
        }
    }
}
