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

namespace Piwik\Plugins\HeatmapSessionRecording\Widgets;

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Widget\Widget;
use Piwik\Widget\WidgetConfig;

class GettingStartedSessions extends Widget
{
    public static function configure(WidgetConfig $config)
    {
        parent::configure($config);

        $config->setIsNotWidgetizable();
        $config->setCategoryId('HeatmapSessionRecording_SessionRecordings');
        $config->setName('HeatmapSessionRecording_GettingStarted');
        $config->setOrder(5);

        $idSite = Common::getRequestVar('idSite', 0, 'int');

        if (self::shouldEnable($idSite) && !self::getAccessValidator()->isSessionRecordingDisabled()) {
            $config->enable();
            $hsrs = StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel');
            $hsrs = $hsrs->hasSessionRecordings($idSite);
            if (empty($hsrs)) {
                // we only make it visible in the UI when there are no hsrs. We cannot disable/enable it
                // as we otherwise would show an error message "not allowed to view widget" when suddenly
                // hsrs are configured
                $config->setSubcategoryId('HeatmapSessionRecording_GettingStarted');
            }
        } else {
            $config->disable();
        }
    }

    private static function getAccessValidator()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
    }

    private static function shouldEnable($idSite)
    {
        $validator = self::getAccessValidator();
        // only for VIEW users, not for anonymous and not for admin users
        return !empty($idSite) && $validator->canViewSessionReport($idSite) && !$validator->canWrite($idSite);
    }

    public function render()
    {
        $idSite = Common::getRequestVar('idSite', null, 'int');
        self::getAccessValidator()->checkSessionReportViewPermission($idSite);

        if (self::shouldEnable($idSite)) {
            return $this->renderTemplate('gettingStartedSessions');
        }

        return '';
    }
}
