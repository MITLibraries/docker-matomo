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
 * @link    https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Monolog\Handler;

/**
 * A class to use the SyslogHandler instead of including the dependency directly
 */

// Need to do this, so that we don't have to increase Matomo min version to 5.1.0 atleast

if (class_exists('Piwik\Plugins\Monolog\Handler\SyslogHandler')) {
    class SEKPSystemLogHandler extends \Piwik\Plugins\Monolog\Handler\SyslogHandler
    {
    }
} else {
    class SEKPSystemLogHandler extends \Monolog\Handler\SyslogHandler
    {
    }
}
