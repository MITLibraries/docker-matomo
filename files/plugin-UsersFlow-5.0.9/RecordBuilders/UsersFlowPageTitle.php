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

namespace Piwik\Plugins\UsersFlow\RecordBuilders;

use Piwik\Container\StaticContainer;
use Piwik\Plugins\UsersFlow\Archiver;
use Piwik\Plugins\UsersFlow\Archiver\DataSources;
use Piwik\Plugins\UsersFlow\Configuration;

class UsersFlowPageTitle extends GenericUsersFlow
{
    public function __construct()
    {
        $configuration = StaticContainer::get(Configuration::class);
        $maxSteps = $configuration->getMaxSteps();

        parent::__construct(DataSources::DATA_SOURCE_PAGE_TITLE, $maxSteps, $configuration, Archiver::USERSFLOW_PAGE_TITLE_ARCHIVE_RECORD);
    }
}
