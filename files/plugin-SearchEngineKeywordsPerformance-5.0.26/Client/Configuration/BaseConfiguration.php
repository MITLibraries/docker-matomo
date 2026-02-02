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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration;

use Piwik\NoAccessException;
use Piwik\Piwik;

class BaseConfiguration
{
    /**
     * Check whether the currently logged-in user has permission to remove the account. If they are a superuser or the
     * user which created the account, they have permission. Otherwise, an exception will be thrown.
     *
     * @param string $accountKey The account ID or API key which identifies the account
     * @param array $accounts The list of accounts retrieved by the client
     * @return void
     * @throws NoAccessException Indicates that the user isn't the one that created the account and isn't a superuser
     */
    public function checkPermissionToRemoveAccount(string $accountKey, array $accounts): void
    {
        if (Piwik::hasUserSuperUserAccess()) {
            return;
        }

        $account = $accounts[$accountKey] ?? [];
        $username = $account['username'] ?? '';

        if ($username === Piwik::getCurrentUserLogin()) {
            return;
        }

        // Since the username doesn't match the current user, throw an exception because they're not a superuser
        throw new NoAccessException(Piwik::translate('General_ExceptionCheckUserHasSuperUserAccessOrIsTheUser', [$username]));
    }
}
