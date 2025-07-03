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

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\Common;
use Piwik\Menu\MenuAdmin;
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Input\Validator;

class Menu extends \Piwik\Plugin\Menu
{
    /**
     * @var Validator
     */
    private $validator;

    public function __construct(Validator $validator)
    {
        parent::__construct();
        $this->validator = $validator;
    }

    public function configureAdminMenu(MenuAdmin $menu)
    {
        $idSite = Common::getRequestVar('idSite', 0, 'int');

        if (!empty($idSite) && !Piwik::isUserIsAnonymous() && $this->validator->canWrite($idSite)) {
            if (!$this->validator->isHeatmapRecordingDisabled()) {
                $menu->addMeasurableItem('HeatmapSessionRecording_Heatmaps', $this->urlForAction('manageHeatmap'), $orderId = 30);
            }
            if (!$this->validator->isSessionRecordingDisabled()) {
                $menu->addMeasurableItem('HeatmapSessionRecording_SessionRecordings', $this->urlForAction('manageSessions'), $orderId = 30);
            }
        }
    }
}
