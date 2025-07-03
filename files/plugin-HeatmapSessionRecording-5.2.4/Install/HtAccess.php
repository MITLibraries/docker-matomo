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

namespace Piwik\Plugins\HeatmapSessionRecording\Install;

use Piwik\Filesystem;
use Piwik\Plugin;

class HtAccess
{
    private function getPluginDir()
    {
        return Plugin\Manager::getPluginsDirectory() . 'HeatmapSessionRecording';
    }

    private function getTargetPath()
    {
        return $this->getPluginDir() . '/.htaccess';
    }

    private function getSourcePath()
    {
        return $this->getPluginDir() . '/Install/htaccessTemplate';
    }

    private function exists()
    {
        $path = $this->getTargetPath();
        return file_exists($path);
    }

    private function canCreate()
    {
        return is_writable($this->getPluginDir());
    }

    private function isContentDifferent()
    {
        $templateContent = trim(file_get_contents($this->getSourcePath()));
        $fileContent = trim(file_get_contents($this->getTargetPath()));

        return $templateContent !== $fileContent;
    }

    public function install()
    {
        if (
            $this->canCreate() && (!$this->exists() || (is_readable($this->getTargetPath()) && $this->isContentDifferent()))
        ) {
            Filesystem::copy($this->getSourcePath(), $this->getTargetPath());
        }
    }
}
