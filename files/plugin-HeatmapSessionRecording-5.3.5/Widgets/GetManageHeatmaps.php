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
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\HeatmapSessionRecording;
use Piwik\Plugins\HeatmapSessionRecording\SystemSettings;
use Piwik\Widget\Widget;
use Piwik\Widget\WidgetConfig;

class GetManageHeatmaps extends Widget
{
    /**
     * @var SystemSettings
     */
    private $settings;

    public function __construct(SystemSettings $settings)
    {
        $this->settings = $settings;
    }

    public static function configure(WidgetConfig $config)
    {
        $config->setCategoryId('HeatmapSessionRecording_Heatmaps');
        $config->setSubcategoryId('HeatmapSessionRecording_ManageHeatmaps');
        $config->setName('HeatmapSessionRecording_ManageHeatmaps');
        $config->setParameters(array('showtitle' => 0));
        $config->setOrder(99);
        $config->setIsNotWidgetizable();

        $idSite = Common::getRequestVar('idSite', 0, 'int');
        if (self::getAccessValidator()->canWrite($idSite) && !self::getAccessValidator()->isHeatmapRecordingDisabled()) {
            $config->enable();
        } else {
            $config->disable();
        }
    }

    private static function getAccessValidator()
    {
        return StaticContainer::get('Piwik\Plugins\HeatmapSessionRecording\Input\Validator');
    }

    public function render()
    {
        $idSite = Common::getRequestVar('idSite', null, 'int');
        self::getAccessValidator()->checkWritePermission($idSite);

        return sprintf(
            '<div vue-entry="HeatmapSessionRecording.HeatmapManage" breakpoint-mobile="%d" breakpoint-tablet="%d" pause-reason="%s" is-matomo-js-writable="%d"></div>',
            (int)$this->settings->breakpointMobile->getValue(),
            (int)$this->settings->breakpointTablet->getValue(),
            Piwik::translate(
                HeatmapSessionRecording::getTranslationKey('pause'),
                [Piwik::translate('HeatmapSessionRecording_Heatmap')]
            ),
            HeatmapSessionRecording::isMatomoJsWritable()
        );
    }
}
