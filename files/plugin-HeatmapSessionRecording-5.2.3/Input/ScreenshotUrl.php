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

class ScreenshotUrl
{
    public const MAX_LENGTH = 300;

    /**
     * @var string
     */
    private $url;

    public function __construct($name)
    {
        $this->url = $name;
    }

    public function check()
    {
        if ($this->url === null || $this->url === false || $this->url === '') {
            // url may not be set
            return;
        }

        $title = Piwik::translate('HeatmapSessionRecording_ScreenshotUrl');

        if (preg_match('/\s/', $this->url)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXContainsWhitespace', $title));
        }

        if (strpos($this->url, '//') === false) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_UrlXDoesNotLookLikeUrl', array($title, static::MAX_LENGTH)));
        }

        if (Common::mb_strlen($this->url) > static::MAX_LENGTH) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXTooLong', array($title, static::MAX_LENGTH)));
        }
    }
}
