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

use Piwik\Common;
use Piwik\Option;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Encryption;

class Yandex extends BaseConfiguration
{
    public const OAUTH_CONFIG_OPTION_NAME = 'SearchEngineKeywordsPerformance_Yandex_Accounts';
    public const CLIENT_CONFIG_OPTION_NAME = 'SearchEngineKeywordsPerformance_Yandex_Client';
    protected $accounts = [];
    protected $clientConfig = [];
    /**
     * @var Encryption
     */
    private $encryption;

    public function __construct(?Encryption $encryption = null)
    {
        $this->encryption = $encryption ?: new Encryption();
    }
    /**
     * Returns stored accounts
     *
     * @return array
     */
    public function getAccounts()
    {
        if (empty($this->accounts)) {
            $accounts = Option::get(self::OAUTH_CONFIG_OPTION_NAME);
            if (is_string($accounts) && $accounts !== '') {
                $accounts = $this->getEncryption()->decryptString($accounts);
            }
            $accounts = @json_decode($accounts, \true);
            if (is_array($accounts) && !empty($accounts)) {
                $this->accounts = $accounts;
            }
        }
        return $this->accounts;
    }
    /**
     * adds new account data
     *
     * @param string $id
     * @param array  $accountData
     * @param string $username
     */
    public function addAccount($id, $accountData, $username)
    {
        $currentAccounts = (array) $this->getAccounts();
        $currentAccounts[$id] = ['config' => $accountData, 'username' => $username, 'created' => time()];
        $this->setAccounts($currentAccounts);
    }
    /**
     * removes account data
     *
     * @param string $id
     */
    public function removeAccount($id)
    {
        $currentAccounts = (array) $this->getAccounts();
        $this->checkPermissionToRemoveAccount($id, $currentAccounts);
        unset($currentAccounts[$id]);
        $this->setAccounts($currentAccounts);
    }
    protected function setAccounts($newAccounts)
    {
        $accounts = $this->getEncryption()->encryptString(json_encode($newAccounts));
        Option::set(self::OAUTH_CONFIG_OPTION_NAME, $accounts);
        $this->accounts = [];
    }
    /**
     * Returns the access token for the given account id
     *
     * @param string $accountId
     * @return mixed|null
     */
    public function getAccessToken($accountId)
    {
        $accounts = $this->getAccounts();
        if (array_key_exists($accountId, $accounts)) {
            return $accounts[$accountId]['config']['accessToken'];
        }
        return null;
    }
    /**
     * Returns the user info for the given account id
     *
     * @param string $accountId
     * @return mixed|null
     */
    public function getUserInfo($accountId)
    {
        $accounts = $this->getAccounts();
        if (array_key_exists($accountId, $accounts)) {
            return $accounts[$accountId]['config']['userInfo'];
        }
        return null;
    }
    /**
     * Returns stored client config
     *
     * @return mixed|null
     */
    public function getClientConfig()
    {
        if (empty($this->clientConfig)) {
            $config = Option::get(self::CLIENT_CONFIG_OPTION_NAME);
            if (is_string($config) && $config !== '') {
                $config = $this->getEncryption()->decryptString($config);
            }
            $config = Common::unsanitizeInputValue($config);
            if (!empty($config) && ($config = @json_decode($config, \true))) {
                $this->clientConfig = $config;
            }
        }
        return $this->clientConfig;
    }
    /**
     * Sets client config to be used for querying yandex api
     *
     * NOTE: Check for valid config should be done before
     *
     * @param string $config json encoded client config
     */
    public function setClientConfig($clientId, $clientSecret)
    {
        $config = ['id' => $clientId, 'secret' => $clientSecret, 'date' => time()];
        Option::set(self::CLIENT_CONFIG_OPTION_NAME, $this->getEncryption()->encryptString(json_encode($config)));
    }

    private function getEncryption(): Encryption
    {
        if (!$this->encryption) {
            $this->encryption = new Encryption();
        }

        return $this->encryption;
    }
}
