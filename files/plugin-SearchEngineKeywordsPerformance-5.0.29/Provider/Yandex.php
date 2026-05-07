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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Provider;

use Piwik\Container\StaticContainer;
use Piwik\Piwik;

class Yandex extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\ProviderAbstract
{
    /**
     * @inheritdoc
     */
    public const ID = 'Yandex';
    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'Yandex Webmaster API';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrls()
    {
        return ['./plugins/SearchEngineKeywordsPerformance/images/Yandex.png'];
    }
    /**
     * @inheritdoc
     */
    public function isExperimental()
    {
        return \false;
    }
    /**
     * @inheritdoc
     */
    public function getDescription()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderYandexDescription');
    }
    /**
     * @inheritdoc
     */
    public function getNote()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderYandexNote');
    }
    /**
     * @inheritdoc
     */
    public function getClient()
    {
        return StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Yandex');
    }
    /**
     * @inheritdoc
     */
    public function isConfigured()
    {
        return $this->getClient()->isConfigured();
    }
    /**
     * @inheritdoc
     */
    public function getConfiguredSiteIds()
    {
        $configuredSites = [];
        foreach ($this->getMeasurableHelper()->getAllSiteSettings() as $siteId => $settings) {
            $siteConfig = [];
            $createdByUser = !is_null($settings->yandexConfigCreatedBy) ? $settings->yandexConfigCreatedBy->getValue() : '';
            if ($settings->yandexAccountAndHostId && $settings->yandexAccountAndHostId->getValue()) {
                $siteConfig['yandexAccountAndHostId'] = $settings->yandexAccountAndHostId->getValue();
                $siteConfig['createdByUser'] = $createdByUser;
                $siteConfig['isDeletionAllowed'] = empty($createdByUser) || Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser);
            }
            if (!empty($siteConfig)) {
                $configuredSites[$siteId] = $siteConfig;
            }
        }
        return $configuredSites;
    }
    public function getConfigurationProblems()
    {
        $errors = ['sites' => $this->getSiteErrors(), 'accounts' => $this->getAccountErrors()];
        return $errors;
    }
    protected function getSiteErrors()
    {
        $errors = [];
        $client = $this->getClient();
        $accounts = $client->getAccounts();
        $configuredSiteIds = $this->getConfiguredSiteIds();
        foreach ($configuredSiteIds as $configuredSiteId => $config) {
            $yandexSiteUrl = $config['yandexAccountAndHostId'];
            list($accountId, $url) = explode('##', $yandexSiteUrl);
            if (!key_exists($accountId, $accounts)) {
                $errors[$configuredSiteId] = Piwik::translate('SearchEngineKeywordsPerformance_AccountDoesNotExist', ['']);
                continue;
            }
            $urls = [];
            try {
                $urlArray = $client->getAvailableUrls($accountId);
                foreach ($urlArray as $item) {
                    $urls[] = $item['host_id'];
                }
            } catch (\Exception $e) {
            }
            if (!in_array($url, $urls)) {
                $errors[$configuredSiteId] = Piwik::translate('SearchEngineKeywordsPerformance_ConfiguredUrlNotAvailable');
                continue;
            }
        }
        return $errors;
    }
    protected function getAccountErrors()
    {
        $errors = [];
        $client = $this->getClient();
        $accounts = $client->getAccounts();
        if (empty($accounts)) {
            return [];
        }
        foreach ($accounts as $id => $account) {
            try {
                $client->testConfiguration($id);
            } catch (\Exception $e) {
                $errors[$id] = $e->getMessage();
            }
        }
        return $errors;
    }
}
