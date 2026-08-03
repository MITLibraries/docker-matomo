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
use Piwik\Plugins\HeatmapSessionRecording\Tracker;

class PageRule
{
    /**
     * @var array
     */
    private $target;

    /**
     * @var string
     */
    private $parameterName;

    /**
     * @var int
     */
    private $index;

    public function __construct($targets, $parameterName, $index)
    {
        $this->target = $targets;
        $this->parameterName = $parameterName;
        $this->index = $index;
    }

    public function check()
    {
        $titleSingular = 'HeatmapSessionRecording_PageRule';

        if (!is_array($this->target)) {
            $titleSingular = Piwik::translate($titleSingular);
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorInnerIsNotAnArray', array($titleSingular, $this->parameterName)));
        }

        if (empty($this->target['attribute'])) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorArrayMissingKey', array('attribute', $this->parameterName, $this->index)));
        }

        if (empty($this->target['type'])) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorArrayMissingKey', array('type', $this->parameterName, $this->index)));
        }

        if (!array_key_exists('inverted', $this->target)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorArrayMissingKey', array('inverted', $this->parameterName, $this->index)));
        }

        if (empty($this->target['value']) && Tracker\PageRuleMatcher::doesTargetTypeRequireValue($this->target['type'])) {
            // any is the only target type that may have an empty value
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorArrayMissingValue', array('value', $this->parameterName, $this->index)));
        }

        if ($this->target['type'] === Tracker\PageRuleMatcher::TYPE_REGEXP && isset($this->target['value'])) {
            $pattern = Tracker\PageRuleMatcher::completeRegexpPattern($this->target['value']);
            if (@preg_match($pattern, '') === false) {
                throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorInvalidRegExp', array($this->target['value'])));
            }
        }
    }
}
