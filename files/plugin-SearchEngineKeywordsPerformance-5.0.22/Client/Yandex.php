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
        return $this->isClientConfigured() && count($this->configuration->getAccounts()) > 0;
    }
    /**
     * Returns if oauth client config is available
     */
    public function isClientConfigured()
    {
        return \true && $this->getClientConfig();
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
     * Checks if account can be used to query the API
     *
     * @param string $accountId
     * @return bool
     * @throws \Exception
     */
    public function testConfiguration($accountId)
    {
        $accessToken = $this->configuration->getAccessToken($accountId);
        $this->getHosts($accessToken);
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
        Piwik::postEvent('SearchEngineKeywordsPerformance.GoogleClientConfigChanged');
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
            $availableSites = $this->getHosts($accessToken);
        } catch (\Exception $e) {
            return $sites;
        }
        if (property_exists($availableSites, 'hosts')) {
            foreach ($availableSites->hosts as $availableSite) {
                if (!$removeUrlsWithoutAccess || $availableSite->verified) {
                    $sites[$availableSite->unicode_host_url] = ['verified' => $availableSite->verified, 'host_id' => $availableSite->host_id];
                }
            }
        }
        return $sites;
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
        throw new \Exception('Unknown Error');
    }
    /**
     * Returns Yandex OAuth url
     *
     * @return string
     */
    public function createAuthUrl()
    {
        $clientConfig = $this->getClientConfig();
        return 'https://oauth.yandex.com/authorize?response_type=code&client_id=' . $clientConfig['id'];
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
    public function addAccount($id, $accessToken, $username)
    {
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
    protected function getUserInfoByAccessToken($accessToken)
    {
        $url = 'https://login.yandex.ru/info';
        $response = Http::sendHttpRequestBy(Http::getTransportMethod(), $url, 2000, null, null, null, 0, \false, \false, \false, \false, 'GET', null, null, null, ['Authorization: OAuth ' . $accessToken]);
        $result = json_decode($response, \true);
        if (isset($result['error'])) {
            throw new InvalidCredentialsException($result['error_description'], $result['error']);
        }
        if (empty($result) || !is_array($result) || !isset($result['display_name'])) {
            throw new UnknownAPIException('Unable to receive user information');
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
    protected function getPopularQueries($accessToken, $hostId, $date)
    {
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
    protected function getIndexingHistory($accessToken, $hostId, $date)
    {
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
    protected function getPagesInIndex($accessToken, $hostId, $date)
    {
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
    protected function getPageChangesInSearch($accessToken, $hostId, $date)
    {
        // note we query a weeks data as otherwise the results might not contain the date we actually want to look at
        return $this->sendApiRequest(
            $accessToken,
            'user/' . $this->getYandexUserId($accessToken) . '/hosts/' . $hostId . '/search-urls/events/history/',
            array('date_from' => date(\DATE_ATOM, $date - 7 * 24 * 3600), 'date_to' => date(\DATE_ATOM, $date + 24 * 3600 - 1))
        );
    }
    /**
     * Returns the available hosts for the given access token
     * @param string $accessToken
     * @return object
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getHosts($accessToken)
    {
        return $this->sendApiRequest($accessToken, 'user/' . $this->getYandexUserId($accessToken) . '/hosts');
    }
    /**
     * Returns the Yandex User ID for the given access token
     * @param string $accessToken
     * @return string
     * @throws InvalidCredentialsException
     * @throws RateLimitApiException
     * @throws UnknownAPIException
     */
    protected function getYandexUserId($accessToken)
    {
        static $userIdByToken = [];
        if (!empty($userIdByToken[$accessToken])) {
            return $userIdByToken[$accessToken];
        }
        $result = $this->sendApiRequest($accessToken, 'user');
        if (!empty($result->user_id)) {
            $userIdByToken[$accessToken] = $result->user_id;
            return $userIdByToken[$accessToken];
        }
        throw new InvalidCredentialsException('Unable to find user ID');
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
    protected function sendApiRequest($accessToken, $method, $params = [])
    {
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
            throw new \Exception('Yandex API returned no data: ' . var_export($response, \true));
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
