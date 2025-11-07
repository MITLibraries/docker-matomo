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

class PageRules
{
    /**
     * @var array
     */
    private $targets;

    /**
     * @var string
     */
    private $parameterName;

    /**
     * @var bool
     */
    private $needsAtLeastOneEntry;

    public function __construct($targets, $parameterName, $needsAtLeastOneEntry)
    {
        $this->targets = $targets;
        $this->parameterName = $parameterName;
        $this->needsAtLeastOneEntry = $needsAtLeastOneEntry;
    }

    public function check()
    {
        if ($this->needsAtLeastOneEntry && empty($this->targets)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorXNotProvided', $this->parameterName));
        }

        if (!is_array($this->targets)) {
            throw new Exception(Piwik::translate('HeatmapSessionRecording_ErrorNotAnArray', $this->parameterName));
        }

        foreach ($this->targets as $index => $target) {
            $target = new PageRule($target, $this->parameterName, $index);
            $target->check();
        }
    }
}
