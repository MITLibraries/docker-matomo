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

class Description
{
    public const MAX_LENGTH = 255;

    /**
     * @var string
     */
    private $description;

    public function __construct($description)
    {
        $this->description = $description;
    }

    public function check()
    {
        if ($this->description === null || $this->description === false || $this->description === '') {
            // description is optional
            return;
        }

        $title = Piwik::translate('General_Description');

        if (Common::mb_strlen($this->description) > static::MAX_LENGTH) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLong', array($title, static::MAX_LENGTH)));
        }
    }
}
