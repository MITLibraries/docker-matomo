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
use Piwik\SettingsPiwik;

class Unsubscribe
{
    /**
     * Generates a signed token that authenticates an unsubscribe request without requiring the user
     * to be logged in. The token is derived from the recipient's login and email plus the instance
     * salt, so it cannot be forged for another user and it does not need to be stored server side.
     */
    public static function generateToken(string $login, string $email): string
    {
        return Common::hash($login . $email . SettingsPiwik::getSalt());
    }

    /**
     * Builds the absolute URL that unsubscribes the given user from "finished" email notifications.
     */
    public static function buildUrl(string $login, string $email): string
    {
        $baseUrl = rtrim(SettingsPiwik::getPiwikUrl(), '/') . '/';

        return $baseUrl
            . 'index.php?module=HeatmapSessionRecording&action=unsubscribe'
            . '&login=' . urlencode($login)
            . '&token=' . self::generateToken($login, $email);
    }
}
