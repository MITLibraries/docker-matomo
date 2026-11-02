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
use Piwik\Option;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Encryption;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;

class BaseConfiguration
{
    /**
     * @var Encryption
     */
    private $encryption;

    public function __construct(?Encryption $encryption = null)
    {
        $this->encryption = $encryption ?: new Encryption();
    }

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

    /**
     * Returns whether credentials are stored but can no longer be decrypted, which happens when the
     * [SearchEngineKeywordsPerformance] encryption_key was changed or lost.
     */
    public function hasUnreadableCredentials(): bool
    {
        foreach ($this->getCredentialOptionNames() as $optionName) {
            if ($this->isUnreadable($optionName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Removes the stored credentials of this provider that can no longer be decrypted, leaving any
     * that are still readable alone. A provider keeps its accounts and its client configuration in
     * separate options, so one of them can be re-saved under the current key while the other stays
     * unreadable, and that re-saved one must survive the reset.
     */
    public function deleteStoredCredentials(): void
    {
        foreach ($this->getCredentialOptionNames() as $optionName) {
            if ($this->isUnreadable($optionName)) {
                Option::delete($optionName);
            }
        }

        $this->resetCredentialCache();
    }

    /**
     * A value that is absent, or stored before encryption was introduced, is readable as-is.
     */
    protected function isUnreadable(string $optionName): bool
    {
        $value = Option::get($optionName);

        if (!is_string($value) || !$this->getEncryption()->isEncrypted($value)) {
            return false;
        }

        try {
            $this->getEncryption()->decryptString($value);
        } catch (SecretConfigurationException $e) {
            return true;
        }

        return false;
    }

    /**
     * Names of the option entries this provider stores its credentials in.
     *
     * @return string[]
     */
    protected function getCredentialOptionNames(): array
    {
        return [];
    }

    /**
     * Drops whatever the provider cached in memory after the stored credentials were deleted.
     */
    protected function resetCredentialCache(): void
    {
    }

    protected function getEncryption(): Encryption
    {
        // Tests build these classes with createPartialMock(), which skips the constructor
        if (!$this->encryption) {
            $this->encryption = new Encryption();
        }

        return $this->encryption;
    }
}
