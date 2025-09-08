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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Client;

use Piwik\Common;
use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\Date;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration\Google as Configuration;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidCredentialsException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingOAuthConfigException;
use Piwik\Log;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\UnknownAPIException;
use Piwik\SettingsPiwik;
use Piwik\Url;
use Piwik\ArchiveProcessor\PluginsArchiver;

class Google
{
    /**
     * @var \Google\Client
     */
    protected $googleClient = null;
    /**
     * @var Configuration
     */
    protected $configuration = null;
    /**
     * Google constructor.
     *
     * @param Configuration  $configuration
     */
    public function __construct(Configuration $configuration)
    {
        $this->configuration = $configuration;
    }
    /**
     * @return \Google\Client
     */
    protected function getGoogleClient()
    {
        $googleClient = StaticContainer::get('SearchEngineKeywordsPerformance.Google.googleClient');
        $proxyHost = Config::getInstance()->proxy['host'];
        if ($proxyHost) {
            $proxyPort = Config::getInstance()->proxy['port'];
            $proxyUser = Config::getInstance()->proxy['username'];
            $proxyPassword = Config::getInstance()->proxy['password'];
            if ($proxyUser) {
                $proxy = sprintf('http://%s:%s@%s:%s', $proxyUser, $proxyPassword, $proxyHost, $proxyPort);
            } else {
                $proxy = sprintf('http://%s:%s', $proxyHost, $proxyPort);
            }
            $httpClient = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\GuzzleHttp\Client(['proxy' => $proxy, 'exceptions' => \false, 'base_uri' => \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Client::API_BASE_PATH]);
            $googleClient->setHttpClient($httpClient);
        }
        return $googleClient;
    }
    /**
     * Passes through a direct call to the \Google\Client class
     *
     * @param string $method
     * @param array  $params
     * @return mixed
     * @throws MissingClientConfigException
     * @throws MissingOAuthConfigException
     */
    public function __call($method, $params = [])
    {
        return call_user_func_array([$this->getConfiguredClient('', \true), $method], $params);
    }
    /**
     * Process the given auth code to gain access and refresh token from google api
     *
     * @param string $authCode
     * @throws MissingClientConfigException
     */
    public function processAuthCode(
        #[\SensitiveParameter]
        $authCode
    ) {
        try {
            $client = $this->getConfiguredClient('');
        } catch (MissingOAuthConfigException $e) {
            // ignore missing oauth config
        }
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
        $userInfo = $this->getUserInfoByAccessToken($accessToken);
        $id = $userInfo->getId();
        $this->addAccount($id, $accessToken, Piwik::getCurrentUserLogin());
        Piwik::postEvent('SearchEngineKeywordsPerformance.AccountAdded', [['provider' => \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Google::getInstance()->getName(), 'account' => $userInfo->getName()]]);
    }
    /**
     * Sets the client configuration
     *
     * @param $config
     * @return boolean
     */
    public function setClientConfig($config)
    {
        try {
            $client = $this->getGoogleClient();
            $configArray = @json_decode($config, \true);
            $this->configureClient($client, $configArray);
        } catch (\Exception $e) {
            return \false;
        }
        $this->configuration->setClientConfig($config);
        Piwik::postEvent('SearchEngineKeywordsPerformance.GoogleClientConfigChanged');
        return \true;
    }
    /**
     * Delete the Google client config option so that the customer will be prompted to upload a new one or use the Cloud
     * config.
     *
     * @return void
     */
    public function deleteClientConfig(): void
    {
        $this->configuration->deleteClientConfig();
        Piwik::postEvent('SearchEngineKeywordsPerformance.GoogleClientConfigChanged');
    }
    /**
     * @param \Google\Client $client
     * @param array          $config
     *
     * @throws MissingClientConfigException
     */
    protected function configureClient($client, $config)
    {
        try {
            @$client->setAuthConfig($config);
        } catch (\Exception $e) {
            throw new MissingClientConfigException();
        }
        // no client config available
        if (!$client->getClientId() || !$client->getClientSecret()) {
            throw new MissingClientConfigException();
        }
    }
    /**
     * Returns configured client api keys
     *
     * @return array
     */
    public function getAccounts()
    {
        return $this->configuration->getAccounts();
    }
    /**
     * Removes client api key
     *
     * @param $id
     * @return bool
     */
    public function removeAccount($id)
    {
        $userInfo = $this->getUserInfo($id);
        $this->configuration->removeAccount($id);
        Piwik::postEvent('SearchEngineKeywordsPerformance.AccountRemoved', [['provider' => \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Google::getInstance()->getName(), 'account' => $userInfo['name']]]);
        return \true;
    }
    /**
     * Adds a client api key
     *
     * @param $id
     * @param $config
     * @param $username
     * @return boolean
     */
    public function addAccount(
        $id,
        #[\SensitiveParameter]
        $accessToken,
        $username
    ) {
        $userInfo = $this->getUserInfoByAccessToken($accessToken);
        $config = ['userInfo' => ['picture' => $userInfo->picture, 'name' => $userInfo->name], 'accessToken' => $accessToken];
        $this->configuration->addAccount($id, $config, $username);
        return \true;
    }
    /**
     * Returns if client is configured
     *
     * @return bool
     */
    public function isConfigured()
    {
        return $this->configuration->getClientConfig() && count($this->configuration->getAccounts()) > 0;
    }
    /**
     * Returns configured \Google\Client object
     *
     * @param string $accessToken
     * @param bool   $ignoreMissingConfigs
     * @return \Google\Client
     * @throws MissingClientConfigException
     * @throws MissingOAuthConfigException
     */
    public function getConfiguredClient(
        #[\SensitiveParameter]
        $accessToken,
        $ignoreMissingConfigs = \false
    ) {
        $client = $this->getGoogleClient();
        try {
            $this->configure($client, $accessToken);
        } catch (\Exception $e) {
            if (!$ignoreMissingConfigs) {
                throw $e;
            }
        }
        return $client;
    }
    /**
     * Returns the Auth Url (including the given state param)
     *
     * @param $state
     * @return string
     * @throws MissingClientConfigException
     * @throws MissingOAuthConfigException
     */
    public function createAuthUrl($state)
    {
        $client = $this->getConfiguredClient('', \true);
        $client->setState($state);
        $client->setPrompt('consent');
        return $client->createAuthUrl();
    }
    /**
     * Loads configuration and sets common configuration for \Google\Client
     *
     * @param \Google\Client $client
     * @param string         $accessToken
     * @throws MissingOAuthConfigException
     * @throws MissingClientConfigException
     */
    protected function configure(
        $client,
        #[\SensitiveParameter]
        $accessToken
    ) {
        // import shipped client config if available
        if (!$this->configuration->getClientConfig()) {
            $this->configuration->importShippedClientConfigIfAvailable();
        }
        $clientConfig = $this->configuration->getClientConfig();
        $this->configureClient($client, $clientConfig);
        // Copied this bit about the redirect_uris from the GA Importer Authorization class
        //since there ie no host defined when running via console it results in error, but we don't need to set any URI when running console commands so can be ignored
        $expectedUri = Url::getCurrentUrlWithoutQueryString() . '?module=SearchEngineKeywordsPerformance&action=processAuthCode';
        if (
            !empty($clientConfig['web']['redirect_uris']) &&
            !Common::isRunningConsoleCommand() &&
            !PluginsArchiver::isArchivingProcessActive() &&
            !$this->isMiscCron() &&
            stripos($expectedUri, 'unknown/_/console?') === false // To handle case where we are unable to determine the correct URI
        ) {
            $uri = $this->getValidUri($clientConfig['web']['redirect_uris']);
            if (empty($uri)) {
                throw new \Exception(Piwik::translate('SearchEngineKeywordsPerformance_InvalidRedirectUriInClientConfiguration', [$expectedUri]));
            }
            $client->setRedirectUri($uri);
        }
        try {
            $client->setAccessToken($accessToken);
        } catch (\Exception $e) {
            throw new MissingOAuthConfigException($e->getMessage());
        }
    }
    public function getUserInfo($accountId)
    {
        return $this->configuration->getUserInfo($accountId);
    }
    protected function getUserInfoByAccessToken(
        #[\SensitiveParameter]
        $accessToken
    ) {
        $service = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\Oauth2($this->getConfiguredClient($accessToken));
        return $service->userinfo->get();
    }
    /**
     * Checks if account can be used to query the API
     *
     * @param string $accountId
     * @return bool
     * @throws \Exception
     */
    public function testConfiguration($accountId)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        try {
            $service = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole($this->getConfiguredClient($accessToken));
            $service->sites->listSites();
        } catch (\Exception $e) {
            $this->handleServiceException($e);
            throw $e;
        }
        return \true;
    }
    /**
     * Returns the urls keyword data is available for (in connected google account)
     *
     * @param string $accountId
     * @param bool   $removeUrlsWithoutAccess wether to return unverified urls
     * @return array
     */
    public function getAvailableUrls($accountId, $removeUrlsWithoutAccess = \true)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $sites = [];
        try {
            $service = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole($this->getConfiguredClient($accessToken));
            $service->getClient()->getCache()->clear();
            //After Guzzle upgrade this seems to fetch same token for all the accounts, to solve that we are clearing the caache explicitly
            $response = $service->sites->listSites();
        } catch (\Exception $e) {
            return $sites;
        }
        foreach ($response as $site) {
            if (!$removeUrlsWithoutAccess || $site['permissionLevel'] != 'siteUnverifiedUser') {
                $sites[$site['siteUrl']] = $site['permissionLevel'];
            }
        }
        return $sites;
    }
    /**
     * Returns the search analytics data from google search console for the given parameters
     *
     * @param string $accountId
     * @param string $url   url, eg. http://matomo.org
     * @param string $date  day string, eg. 2016-12-24
     * @param string $type  'web', 'image', 'video' or 'news'
     * @param int    $limit maximum of rows to fetch
     * @return \Google\Service\SearchConsole\SearchAnalyticsQueryResponse
     * @throws InvalidClientConfigException
     * @throws InvalidCredentialsException
     * @throws MissingOAuthConfigException
     * @throws MissingClientConfigException
     * @throws UnknownAPIException
     */
    public function getSearchAnalyticsData($accountId, $url, $date, $type = 'web', $limit = 500)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        if (empty($accessToken)) {
            throw new MissingOAuthConfigException();
        }
        $limit = min($limit, 5000);
        // maximum allowed by API is 5.000
        // Google API is only able to handle dates up to ~490 days old
        $threeMonthBefore = Date::now()->subDay(500);
        $archivedDate = Date::factory($date);
        if ($archivedDate->isEarlier($threeMonthBefore) || $archivedDate->isToday()) {
            Log::debug("[SearchEngineKeywordsPerformance] Skip fetching keywords from Search Console for today and dates more than 500 days in the past");
            return null;
        }
        $service = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole($this->getConfiguredClient($accessToken));
        $request = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole\SearchAnalyticsQueryRequest();
        $request->setStartDate($date);
        $request->setEndDate($date);
        $request->setDimensions(['query']);
        $request->setRowLimit($limit);
        $request->setSearchType($type);
        $request->setDataState('all');
        $retries = 0;
        while ($retries < 5) {
            try {
                $response = $service->searchanalytics->query($url, $request);
                return $response;
            } catch (\Exception $e) {
                $this->handleServiceException($e, $retries < 4);
                usleep(500 * $retries);
                $retries++;
            }
        }
        return null;
    }
    /**
     * Returns an array of dates where search analytics data is availabe for on search console
     *
     * @param string $accountId
     * @param string $url url, eg. http://matomo.org
     * @param boolean $onlyFinalized
     * @return array
     * @throws MissingClientConfigException
     * @throws MissingOAuthConfigException
     * @throws InvalidClientConfigException
     * @throws InvalidCredentialsException
     * @throws UnknownAPIException
     */
    public function getDatesWithSearchAnalyticsData($accountId, $url, $onlyFinalized = \true)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $service = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole($this->getConfiguredClient($accessToken));
        $request = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole\SearchAnalyticsQueryRequest();
        $request->setStartDate(Date::now()->subDay(StaticContainer::get('SearchEngineKeywordsPerformance.Google.ImportLastDaysMax'))->toString());
        $request->setEndDate(Date::now()->toString());
        $request->setDimensions(['date']);
        if ($onlyFinalized === \false) {
            $request->setDataState('all');
        }
        $retries = 0;
        while ($retries < 5) {
            try {
                $entries = $service->searchanalytics->query($url, $request);
                if (empty($entries) || !($rows = $entries->getRows())) {
                    return [];
                }
                $days = [];
                foreach ($rows as $row) {
                    /** @var \Google\Service\SearchConsole\ApiDataRow $row */
                    $keys = $keys = $row->getKeys();
                    $days[] = array_shift($keys);
                }
                return array_unique($days);
            } catch (\Exception $e) {
                $this->handleServiceException($e, $retries < 4);
                $retries++;
                usleep(500 * $retries);
            }
        }
        return [];
    }
    /**
     * @param \Exception $e
     * @param bool $ignoreUnknowns
     * @throws InvalidClientConfigException
     * @throws InvalidCredentialsException
     * @throws UnknownAPIException
     */
    protected function handleServiceException($e, $ignoreUnknowns = \false)
    {
        if (!$e instanceof \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\Exception) {
            if (!PluginsArchiver::isArchivingProcessActive()) {
                Log::debug('Exception: ' . $e->getMessage());
            }
            return;
        }
        $error = json_decode($e->getMessage(), \true);
        if (!empty($error['error']) && $error['error'] == 'invalid_client') {
            // invalid credentials
            throw new InvalidClientConfigException($error['error_description']);
        } elseif (!empty($error['error']['code']) && $error['error']['code'] == 401) {
            // invalid credentials
            throw new InvalidCredentialsException($error['error']['message'], $error['error']['code']);
        } elseif (!empty($error['error']['code']) && $error['error']['code'] == 403) {
            // no access for given resource (website / app)
            throw new InvalidCredentialsException($error['error']['message'], $error['error']['code']);
        } elseif (!empty($error['error']['code']) && in_array($error['error']['code'], [500, 503]) && !$ignoreUnknowns) {
            // backend or api server error
            throw new UnknownAPIException($error['error']['message'], $error['error']['code']);
        } else {
            if (!PluginsArchiver::isArchivingProcessActive()) {
                Log::debug('Exception: ' . $e->getMessage());
            }
        }
    }
    /**
     * Returns a valid uri. Copied from GA Importer Authorization class.
     *
     * @param array $uris
     * @return string
     */
    private function getValidUri(array $uris): string
    {
        $validUri = Url::getCurrentUrlWithoutQueryString() . '?module=SearchEngineKeywordsPerformance&action=processAuthCode';
        $settingURL = SettingsPiwik::getPiwikUrl();
        if (stripos($settingURL, 'index.php') === false) {
            $settingURL .= 'index.php';
        }
        // Some MWP installs was not working as expected when using Url::getCurrentUrlWithoutQueryString()
        $validUriFallback = $settingURL . '?module=SearchEngineKeywordsPerformance&action=processAuthCode';
        foreach ($uris as $uri) {
            if (stripos($uri, $validUri) !== \false || stripos($uri, $validUriFallback) !== \false) {
                return $uri;
            }
        }
        return '';
    }

    private function isMiscCron()
    {
        $currentURL = Url::getCurrentUrlWithoutQueryString();

        return (stripos($currentURL, 'misc/cron/archive.php') !== false);
    }
}
