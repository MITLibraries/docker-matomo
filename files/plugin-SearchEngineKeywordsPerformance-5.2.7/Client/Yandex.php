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

use Piwik\Date;
use Piwik\Http;
use Piwik\Log;
use Piwik\Piwik;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration\Yandex as Configuration;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\InvalidCredentialsException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\RateLimitApiException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\UnknownAPIException;

/**
 * Class Yandex
 *
 * @package Piwik\Plugins\SearchEngineKeywordsPerformance\Client
 *
 * @see     https://yandex.com/dev/webmaster/doc/dg/reference/host-search-queries-popular.html
 */
class Yandex
{
    /**
     * @var Configuration
     */
    protected $configuration = null;
    /**
     * Base URL of Yandex API v4
     *
     * @var string
     */
    protected $baseAPIUrl = 'https://api.webmaster.yandex.net/v4/';
    /**
     * Account ids whose last url enumeration could not reach the API, as opposed to reaching it and
     * finding nothing. Both leave getAvailableUrls() returning [], and a caller that cannot tell the
     * two apart reports a working configuration as invalid whenever the API is briefly unreachable.
     *
     * @var array<string, true>
     */
    protected $urlEnumerationFailures = [];
    /**
     * Accounts whose credential the provider rejected, as opposed to an API we could not reach.
     *
     * @var array<string, true>
     */
    protected $credentialRejections = [];
    /**
     * Yandex constructor.
     *
     * @param Configuration $configuration
     */
    public function __construct(Configuration $configuration)
    {
        $this->configuration = $configuration;
    }
    /**
     * Returns if client is configured
     *
     * @return bool
     */
    public function isConfigured()
    {
        try {
            return $this->isClientConfigured() && count($this->configuration->getAccounts()) > 0;
        } catch (SecretConfigurationException $e) {
            return false;
        }
    }
    /**
     * Returns if oauth client config is available
     */
    public function isClientConfigured()
    {
        try {
            return \true && $this->getClientConfig();
        } catch (SecretConfigurationException $e) {
            return false;
        }
    }
    /**
     * Returns the client config
     *
     * @return mixed|null
     */
    public function getClientConfig()
    {
        return $this->configuration->getClientConfig();
    }
    /**
     * Returns whether credentials are stored that can no longer be decrypted, because the
     * [SearchEngineKeywordsPerformance] encryption_key was changed or lost.
     */
    public function hasUnreadableCredentials(): bool
    {
        return $this->configuration->hasUnreadableCredentials();
    }
    /**
     * Returns whether the stored accounts specifically can no longer be decrypted, leaving a
     * separately stored client config that may still be readable.
     */
    public function hasUnreadableAccounts(): bool
    {
        return $this->configuration->hasUnreadableAccounts();
    }
    /**
     * Returns whether the stored client config specifically can no longer be decrypted.
     */
    public function hasUnreadableClientConfig(): bool
    {
        return $this->configuration->hasUnreadableClientConfig();
    }
    /**
     * Removes the stored client config and connected accounts without decrypting them, so an admin
     * can reconnect after the encryption key was lost.
     */
    public function deleteStoredCredentials(): void
    {
        $this->configuration->deleteStoredCredentials();
        Piwik::postEvent('SearchEngineKeywordsPerformance.YandexClientConfigChanged');
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
        // the account id is the Yandex user id, so pass it to avoid an extra "user" API call
        $this->getHosts($accessToken, $accountId);
        return \true;
    }
    /**
     * Updates the client config
     *
     * @param string $clientId     new client id
     * @param string $clientSecret new client secret
     */
    public function setClientConfig($clientId, $clientSecret)
    {
        $this->configuration->setClientConfig($clientId, $clientSecret);
        /**
         * Triggered whenever the stored Yandex OAuth client configuration changes: when a new client
         * id and secret are saved, when the configuration is removed, and when unreadable
         * credentials are cleared.
         *
         * Carries no parameters; listeners that cache anything derived from the client config should
         * discard it and read the configuration again.
         *
         * **Example**
         *
         *     Piwik::addAction('SearchEngineKeywordsPerformance.YandexClientConfigChanged', function () {
         *         MyCache::invalidate('yandex-webmaster');
         *     });
         */
        Piwik::postEvent('SearchEngineKeywordsPerformance.YandexClientConfigChanged');
    }
    /**
     * Removes the stored client config, so a new one can be set up when the configured OAuth
     * application is no longer usable.
     */
    public function deleteClientConfig(): void
    {
        $this->configuration->deleteClientConfig();
        Piwik::postEvent('SearchEngineKeywordsPerformance.YandexClientConfigChanged');
    }
    /**
     * Returns the urls keyword data is available for (in connected yandex account)
     *
     * @param string $accountId
     * @param bool   $removeUrlsWithoutAccess whether to return unverified urls
     * @return array
     */
    public function getAvailableUrls($accountId, $removeUrlsWithoutAccess = \true)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $sites = [];
        try {
            // the account id is the Yandex user id, so pass it to avoid an extra "user" API call
            $availableSites = $this->getHosts($accessToken, $accountId);
        } catch (InvalidCredentialsException $e) {
            // a rejected credential is a definite fault: retrying will not fix it, and calling it a
            // temporary outage would send the user away to wait instead of reconnecting
            $this->credentialRejections[$accountId] = \true;
            return $sites;
        } catch (\Exception $e) {
            $this->urlEnumerationFailures[$accountId] = \true;
            return $sites;
        }
        // an unusable payload is no more evidence of "this account has no hosts" than the throw
        // above is. The is_object() half also matters on its own: sendApiRequest() decodes with
        // $assoc = false, so a bare JSON list arrives as an array, and property_exists() fatals on
        // one under PHP 8 rather than raising anything the callers catch.
        if (!is_object($availableSites) || !isset($availableSites->hosts) || !is_iterable($availableSites->hosts)) {
            $this->urlEnumerationFailures[$accountId] = \true;
            return $sites;
        }
        unset($this->urlEnumerationFailures[$accountId], $this->credentialRejections[$accountId]);
        foreach ($availableSites->hosts as $availableSite) {
            if (!$removeUrlsWithoutAccess || $availableSite->verified) {
                $sites[$availableSite->unicode_host_url] = ['verified' => $availableSite->verified, 'host_id' => $availableSite->host_id];
            }
        }
        return $sites;
    }
    /**
     * Whether the last getAvailableUrls() call for this account could not reach the API.
     *
     * @param string $accountId
     * @return bool
     */
    public function hasUrlEnumerationFailed($accountId)
    {
        return !empty($this->urlEnumerationFailures[$accountId]);
    }
    public function hasCredentialBeenRejected($accountId)
    {
        return !empty($this->credentialRejections[$accountId]);
    }
    /**
     * Returns popular search queries from Yandex Webmaster API
     *
     * @param string $accountId
     * @param string $hostId
     * @param string $date
     * @return ?array
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    public function getSearchAnalyticsData($accountId, $hostId, $date)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $archivedDate = Date::factory($date);
        if ($archivedDate->isToday()) {
            Log::debug("[SearchEngineKeywordsPerformance] Skip fetching keywords from Yandex Webmaster for today.");
            return null;
        }
        $date = strtotime($date);
        $searchQueries = $this->retryApiMethod(function () use ($accessToken, $hostId, $date) {
            return $this->getPopularQueries($accessToken, $hostId, $date);
        });
        if (empty($searchQueries) || empty($searchQueries->queries)) {
            return null;
        }
        $keywords = [];
        foreach ($searchQueries->queries as $query) {
            $keywords[] = ['keyword' => $query->query_text, 'clicks' => $query->indicators->TOTAL_CLICKS, 'impressions' => $query->indicators->TOTAL_SHOWS, 'position' => $query->indicators->AVG_SHOW_POSITION];
        }
        return $keywords;
    }
    /**
     * Returns crawl statistics from Yandex Webmaster API
     *
     * @param string $accountId
     * @param string $hostId
     * @return array
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    public function getCrawlStats($accountId, $hostId, $date)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $archivedDate = Date::factory($date);
        if ($archivedDate->isToday()) {
            Log::debug("[SearchEngineKeywordsPerformance] Skip fetching crawl stats from Yandex Webmaster for today.");
            return null;
        }
        $dateTs = strtotime($date);
        $crawlStatsByDate = [];
        $crawlStats = $this->retryApiMethod(function () use ($accessToken, $hostId, $dateTs) {
            return $this->getIndexingHistory($accessToken, $hostId, $dateTs);
        });
        if (!empty($crawlStats) && !empty($crawlStats->indicators)) {
            $indicators = (array) $crawlStats->indicators;
            foreach ($indicators as $indicator => $indicatorByDate) {
                foreach ($indicatorByDate as $dateItem) {
                    if (strpos($dateItem->date, $date) === 0) {
                        $crawlStatsByDate[$indicator] = (int) $dateItem->value;
                    }
                }
            }
        }
        $pagesInIndex = $this->retryApiMethod(function () use ($accessToken, $hostId, $dateTs) {
            return $this->getPagesInIndex($accessToken, $hostId, $dateTs);
        });
        if (!empty($pagesInIndex) && !empty($pagesInIndex->history)) {
            $history = (array) $pagesInIndex->history;
            foreach ($history as $entry) {
                // Look for matching date
                if (strpos($entry->date, $date) === 0) {
                    $crawlStatsByDate['SEARCHABLE'] = (int) $entry->value;
                }
            }
        }
        $pageChanges = $this->retryApiMethod(function () use ($accessToken, $hostId, $dateTs) {
            return $this->getPageChangesInSearch($accessToken, $hostId, $dateTs);
        });
        if (!empty($pageChanges) && !empty($pageChanges->indicators)) {
            $indicators = (array) $pageChanges->indicators;
            foreach ($indicators as $indicator => $indicatorByDate) {
                foreach ($indicatorByDate as $dateItem) {
                    // Look for matching date
                    if (strpos($dateItem->date, $date) === 0) {
                        $crawlStatsByDate[$indicator] = (int) $dateItem->value;
                    }
                }
            }
        }
        return $crawlStatsByDate;
    }
    /**
     * @param callback $method
     * @return mixed
     * @throws \Exception
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function retryApiMethod($method)
    {
        $retries = 0;
        while ($retries < 5) {
            try {
                return $method();
            } catch (InvalidCredentialsException $e) {
                throw $e;
            } catch (\Exception $e) {
                if ($retries >= 4) {
                    throw $e;
                }
                usleep(500);
                $retries++;
            }
        }
    }
    /**
     * Process the given auth code to gain access and refresh token from yandex api
     *
     * @param string $authCode
     * @throws InvalidCredentialsException
     * @throws MissingClientConfigException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    public function processAuthCode($authCode)
    {
        if (!$this->isClientConfigured()) {
            throw new MissingClientConfigException();
        }
        $accessToken = $this->fetchAccessTokenWithAuthCode($authCode);
        $userId = $this->getYandexUserId($accessToken);
        $this->addAccount($userId, $accessToken, Piwik::getCurrentUserLogin());
        $userInfo = $this->getUserInfo($userId);
        Piwik::postEvent('SearchEngineKeywordsPerformance.AccountAdded', [['provider' => \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex::getInstance()->getName(), 'account' => $userInfo['name']]]);
    }
    /**
     * Returns user information for given account id
     *
     * @param $accountId
     * @return array|null
     */
    public function getUserInfo($accountId)
    {
        return $this->configuration->getUserInfo($accountId);
    }
    /**
     * Fetches an access token from Yandex OAuth with the given auth code
     *
     * @param string $authCode
     * @return string
     * @throws \Exception
     */
    protected function fetchAccessTokenWithAuthCode($authCode)
    {
        $clientConfig = $this->getClientConfig();
        $response = Http::sendHttpRequestBy(
            Http::getTransportMethod(),
            'https://oauth.yandex.com/token',
            2000,
            null,
            null,
            null,
            0,
            \false,
            \false,
            \false,
            \false,
            'POST',
            $clientConfig['id'],
            $clientConfig['secret'],
            'grant_type=authorization_code&code=' . $authCode
        );
        $result = json_decode($response, \true);
        if (isset($result['error'])) {
            throw new \Exception($result['error_description']);
        }
        if (isset($result['access_token'])) {
            return $result['access_token'];
        }
        throw new \Exception(Piwik::translate('SearchEngineKeywordsPerformance_UnknownApiError'));
    }
    /**
     * Returns Yandex OAuth url
     *
     * @param string $state opaque value returned by Yandex, used to tie the response to this request
     * @return string
     */
    public function createAuthUrl($state)
    {
        $clientConfig = $this->getClientConfig();
        return 'https://oauth.yandex.com/authorize?response_type=code&client_id=' . $clientConfig['id']
            . '&state=' . urlencode($state);
    }
    /**
     * Returns connected oauth accounts
     *
     * @return array
     */
    public function getAccounts()
    {
        return $this->configuration->getAccounts();
    }
    /**
     * Removes oauth account
     *
     * @param string $id
     * @return boolean
     */
    public function removeAccount($id)
    {
        $userInfo = $this->getUserInfo($id);
        $this->configuration->removeAccount($id);
        Piwik::postEvent('SearchEngineKeywordsPerformance.AccountRemoved', [['provider' => \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex::getInstance()->getName(), 'account' => $userInfo['name']]]);
        return \true;
    }
    /**
     * Adds a oauth account
     *
     * @param string $id
     * @param string $config
     * @param string $username
     * @return boolean
     */
    public function addAccount(
        $id,
        #[\SensitiveParameter]
        $accessToken,
        $username
    ) {
        $userInfo = $this->getUserInfoByAccessToken($accessToken);
        $config = ['userInfo' => ['picture' => 'https://avatars.yandex.net/get-yapic/' . $userInfo['default_avatar_id'] . '/islands-retina-50', 'name' => $userInfo['display_name']], 'accessToken' => $accessToken];
        $this->configuration->addAccount($id, $config, $username);
        return \true;
    }
    /**
     * Fetches user info from Yandex Passport API
     *
     * @param string $accessToken
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws UnknownAPIException
     */
    protected function getUserInfoByAccessToken(
        #[\SensitiveParameter]
        $accessToken
    ) {
        $url = 'https://login.yandex.ru/info';
        $response = Http::sendHttpRequestBy(Http::getTransportMethod(), $url, 2000, null, null, null, 0, \false, \false, \false, \false, 'GET', null, null, null, ['Authorization: OAuth ' . $accessToken]);
        $result = json_decode($response, \true);
        if (isset($result['error'])) {
            throw new InvalidCredentialsException($result['error_description'], $result['error']);
        }
        if (empty($result) || !is_array($result) || !isset($result['display_name'])) {
            throw new UnknownAPIException(Piwik::translate('SearchEngineKeywordsPerformance_UnableToReceiveUserInformation'));
        }
        return $result;
    }
    /**
     * @param string $accessToken
     * @param string $hostId
     * @param string $date
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getPopularQueries(
        #[\SensitiveParameter]
        $accessToken,
        $hostId,
        $date
    ) {
        return $this->sendApiRequest(
            $accessToken,
            'user/' . $this->getYandexUserId($accessToken) . '/hosts/' . $hostId . '/search-queries/popular/',
            ['date_from' => date(\DATE_ATOM, $date), 'date_to' => date(\DATE_ATOM, $date + 24 * 3600 - 1), 'order_by' => 'TOTAL_CLICKS', 'query_indicator' => ['TOTAL_CLICKS', 'TOTAL_SHOWS', 'AVG_SHOW_POSITION', 'AVG_CLICK_POSITION'], 'limit' => 500]
        );
    }
    /**
     * @param string $accessToken
     * @param string $hostId
     * @param string $date
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getIndexingHistory(
        #[\SensitiveParameter]
        $accessToken,
        $hostId,
        $date
    ) {
        // note we query a weeks data as otherwise the results might not contain the date we actually want to look at
        return $this->sendApiRequest(
            $accessToken,
            'user/' . $this->getYandexUserId($accessToken) . '/hosts/' . $hostId . '/indexing/history/',
            array('date_from' => date(\DATE_ATOM, $date - 7 * 24 * 3600), 'date_to' => date(\DATE_ATOM, $date + 24 * 3600 - 1))
        );
    }
    /**
     * @param string $accessToken
     * @param string $hostId
     * @param string $date
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getPagesInIndex(
        #[\SensitiveParameter]
        $accessToken,
        $hostId,
        $date
    ) {
        // note we query a weeks data as otherwise the results might not contain the date we actually want to look at
        return $this->sendApiRequest(
            $accessToken,
            'user/' . $this->getYandexUserId($accessToken) . '/hosts/' . $hostId . '/search-urls/in-search/history/',
            array('date_from' => date(\DATE_ATOM, $date - 7 * 24 * 3600), 'date_to' => date(\DATE_ATOM, $date + 24 * 3600 - 1))
        );
    }
    /**
     * @param string $accessToken
     * @param string $hostId
     * @param string $date
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getPageChangesInSearch(
        #[\SensitiveParameter]
        $accessToken,
        $hostId,
        $date
    ) {
        // note we query a weeks data as otherwise the results might not contain the date we actually want to look at
        return $this->sendApiRequest(
            $accessToken,
            'user/' . $this->getYandexUserId($accessToken) . '/hosts/' . $hostId . '/search-urls/events/history/',
            array('date_from' => date(\DATE_ATOM, $date - 7 * 24 * 3600), 'date_to' => date(\DATE_ATOM, $date + 24 * 3600 - 1))
        );
    }
    /**
     * Returns the available hosts for the given access token.
     *
     * The Yandex user id is required to build the request URL. It is added as the account id
     * when the account is connected (see processAuthCode()/addAccount()), so callers that have
     * the account id can pass it here to skip the extra "user" API round-trip; otherwise it is
     * resolved from the access token.
     *
     * @param string $accessToken
     * @param string $userId Yandex user id (== the account id); resolved via the API when null
     * @return object
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getHosts(
        #[\SensitiveParameter]
        $accessToken,
        $userId = null
    ) {
        // Request-scoped cache: both testConfiguration() and getAvailableUrls() funnel through
        // here, so memoizing the response (or the exception it threw) per token collapses the
        // duplicate calls within a single request.
        $key = sha1(serialize($accessToken));
        if (array_key_exists($key, $this->hostsCache)) {
            if ($this->hostsCache[$key] instanceof \Exception) {
                throw $this->hostsCache[$key];
            }
            return $this->hostsCache[$key];
        }
        try {
            if ($userId === null) {
                $userId = $this->getYandexUserId($accessToken);
            }
            $hosts = $this->sendApiRequest($accessToken, 'user/' . $userId . '/hosts');
        } catch (\Exception $e) {
            $this->hostsCache[$key] = $e;
            throw $e;
        }
        $this->hostsCache[$key] = $hosts;
        return $hosts;
    }
    /**
     * Request-scoped cache of the raw hosts response (or the exception it threw),
     * keyed by a hash of the access token.
     *
     * @var array
     */
    private $hostsCache = [];
    /**
     * Returns the Yandex User ID for the given access token
     * @param string $accessToken
     * @return string
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getYandexUserId(
        #[\SensitiveParameter]
        $accessToken
    ) {
        static $userIdByToken = [];
        if (!empty($userIdByToken[$accessToken])) {
            return $userIdByToken[$accessToken];
        }
        $result = $this->sendApiRequest($accessToken, 'user');
        if (!empty($result->user_id)) {
            $userIdByToken[$accessToken] = $result->user_id;
            return $userIdByToken[$accessToken];
        }
        throw new InvalidCredentialsException(Piwik::translate('SearchEngineKeywordsPerformance_UnableToFindUserId'));
    }
    /**
     * @param string $accessToken
     * @param string $method
     * @param array $params
     * @return mixed
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function sendApiRequest(
        #[\SensitiveParameter]
        $accessToken,
        $method,
        $params = []
    ) {
        $urlParams = [];
        foreach ($params as $name => $value) {
            if (is_array($value)) {
                foreach ($value as $val) {
                    $urlParams[] = $name . '=' . urlencode($val);
                }
                continue;
            }
            $urlParams[] = $name . '=' . urlencode($value);
        }
        $url = $this->baseAPIUrl . $method . '?' . implode('&', $urlParams);
        $additionalHeaders = ['Authorization: OAuth ' . $accessToken, 'Accept: application/json', 'Content-type: application/json'];
        $response = Http::sendHttpRequestBy(
            Http::getTransportMethod(),
            $url,
            $timeout = 60,
            $userAgent = null,
            $destinationPath = null,
            $file = null,
            $followDepth = 0,
            $acceptLanguage = \false,
            $acceptInvalidSslCertificate = \false,
            $byteRange = \false,
            $getExtendedInfo = \true,
            $httpMethod = 'GET',
            $httpUsername = '',
            $httpPassword = '',
            $requestBody = null,
            $additionalHeaders
        );
        if (empty($response['data'])) {
            Log::debug('[SearchEngineKeywordsPerformance] Yandex API returned no data: ' . var_export($response, \true));
            throw new \Exception(Piwik::translate('SearchEngineKeywordsPerformance_UnknownApiError'));
        }
        $data = json_decode($response['data'], \false, 512, \JSON_BIGINT_AS_STRING);
        if (!empty($data->error_code)) {
            switch ($data->error_code) {
                case 'INVALID_OAUTH_TOKEN':
                case 'INVALID_USER_ID':
                    throw new InvalidCredentialsException($data->error_message, (int) $data->error_code);
                case 'QUOTA_EXCEEDED':
                case 'TOO_MANY_REQUESTS_ERROR':
                    throw new RateLimitApiException($data->error_message, (int) $data->error_code);
            }
            throw new UnknownAPIException($data->error_message, (int) $data->error_code);
        }
        return $data;
    }
}
