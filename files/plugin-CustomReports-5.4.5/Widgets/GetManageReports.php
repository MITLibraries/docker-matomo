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

namespace Piwik\Plugins\CustomReports\Widgets;

use Piwik\ArchiveProcessor\Rules;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Plugins\CustomReports\Configuration;
use Piwik\Plugins\CustomReports\Dao\CustomReportsDao;
use Piwik\Widget\Widget;
use Piwik\Widget\WidgetConfig;

class GetManageReports extends Widget
{
    public static function configure(WidgetConfig $config)
    {
        $config->setCategoryId(CustomReportsDao::DEFAULT_CATEGORY);
        $config->setSubcategoryId('CustomReports_ManageReports');
        $config->setName('CustomReports_ManageReports');
        $config->setParameters(array('showtitle' => 0));
        $config->setOrder(99);
        $config->setIsNotWidgetizable();

        $idSite = Common::getRequestVar('idSite', 0, 'int');
        if (self::getAccessValidator()->canWrite($idSite)) {
            $config->enable();
        } else {
            $config->disable();
        }
    }

    private static function getAccessValidator()
    {
        return StaticContainer::get('Piwik\Plugins\CustomReports\Input\Validator');
    }

    public function render()
    {
        $idSite = Common::getRequestVar('idSite', null, 'int');
        self::getAccessValidator()->checkWritePermission($idSite);

        $browserArchivingDisabled = !Rules::isBrowserTriggerEnabled();
        $browserArchivingDisabled = json_encode($browserArchivingDisabled);

        $configuration =  StaticContainer::get(Configuration::class);
        $reArchiveLastN = $configuration->getReArchiveReportsInPastLastNMonths();
        $reArchiveLastN = json_encode($reArchiveLastN);
        $maxDimensions = $configuration->getMaxDimensions();
        $maxDimensions = json_encode($maxDimensions);
        $isCloud = \Piwik\Plugin\Manager::getInstance()->isPluginLoaded('Cloud');
        $isCloud = json_encode($isCloud);

        return "<div vue-entry=\"CustomReports.ReportsManage\"
            browser-archiving-disabled=\"$browserArchivingDisabled\"
            re-archive-last-n=\"$reArchiveLastN\"
            max-dimensions=\"$maxDimensions\"
            is-cloud=\"$isCloud\"
        ></div>";
    }
}
