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
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;

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
    public function getLogoUrl()
    {
        return 'plugins/SearchEngineKeywordsPerformance/images/YandexLogo.png';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrls()
    {
        return ['plugins/SearchEngineKeywordsPerformance/images/Yandex.png'];
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
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderYandexNoteNew');
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
                // Kept in sync with the ownership check in MeasurableSettings: an unknown creator falls
                // back to super user access. This flag also decides whether the credential is redacted
                // for the current user in Controller::redactMeasurableDataIfRequired().
                $siteConfig['isDeletionAllowed'] = Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser);
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
        $this->logUnreadableCredentials($errors);
        return $errors;
    }
    /**
     * Explains why the stored "<accountId>##<hostId>" value of a measurable's Yandex setting cannot
     * be used, or null when it can. The site editor and the configuration problem list both go
     * through this, so a given cause is named the same way wherever the user meets it.
     *
     * @param mixed $configuredValue
     * @return string|null
     */
    public function getConfiguredUrlError($configuredValue)
    {
        $client = $this->getClient();
        try {
            $accounts = $client->getAccounts();
        } catch (SecretConfigurationException $e) {
            return $e->getMessage();
        }
        // the setting also takes arbitrary posted values, which never carry the separator
        if (!is_string($configuredValue) || strpos($configuredValue, '##') === false) {
            return Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrlNoLongerValid');
        }
        list($accountId, $hostId) = explode('##', $configuredValue, 2);
        if (!key_exists($accountId, $accounts)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_AccountDoesNotExistNew', ['']);
        }
        $hostIds = [];
        $enumerationFailed = \false;
        try {
            foreach ($client->getAvailableUrls($accountId) as $item) {
                $hostIds[] = $item['host_id'];
            }
            $enumerationFailed = $client->hasUrlEnumerationFailed($accountId);
        } catch (\Exception $e) {
            $enumerationFailed = \true;
        }
        // Checked before the enumeration flag: a rejected credential is a definite fault, so it must
        // not be reported as a transient outage the user should wait out.
        if ($client->hasCredentialBeenRejected($accountId)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrlAuthenticationFailed');
        }
        // an unreachable API enumerates nothing, exactly as a removed host does; saying the url is
        // gone would have the user discard a mapping that is fine
        if ($enumerationFailed) {
            $this->recordConfiguredUrlNotVerifiable($configuredValue);
            return Piwik::translate('SearchEngineKeywordsPerformance_ConfiguredUrlNotVerifiable', [$this->getName()]);
        }
        if (!in_array($hostId, $hostIds, true)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrlNoLongerValid');
        }
        return null;
    }
    /**
     * Yandex stores a host id ("https:example.com:443"), not a url, so the raw value would show in
     * the url column where every other row shows "https://example.com".
     *
     * @param mixed $configuredValue
     * @return string
     */
    public function describeConfiguredSite($configuredValue): string
    {
        $hostId = parent::describeConfiguredSite($configuredValue);

        if (!preg_match('~^(https?):(.+):([0-9]+)$~', $hostId, $parts)) {
            return $hostId;
        }

        $isDefaultPort = ($parts[1] === 'http' && $parts[3] === '80')
            || ($parts[1] === 'https' && $parts[3] === '443');

        return $parts[1] . '://' . $parts[2] . ($isDefaultPort ? '' : ':' . $parts[3]);
    }
    protected function getSiteErrors()
    {
        $errors = [];
        // probed once up front purely to report unreadable credentials under the 'credentials' key,
        // which the per-site classification below cannot express. getAccounts() is memoised, so the
        // repeat inside getConfiguredUrlError() costs nothing.
        try {
            $this->getClient()->getAccounts();
        } catch (SecretConfigurationException $e) {
            $errors['credentials'] = $e->getMessage();
            return $errors;
        }
        foreach ($this->getConfiguredSiteIds() as $configuredSiteId => $config) {
            $error = $this->getConfiguredUrlError($config['yandexAccountAndHostId']);
            if (null !== $error) {
                $errors[$configuredSiteId] = $error;
            }
        }
        return $errors;
    }
    protected function getAccountErrors()
    {
        $errors = [];
        $client = $this->getClient();
        try {
            $accounts = $client->getAccounts();
        } catch (SecretConfigurationException $e) {
            $errors['credentials'] = $e->getMessage();
            return $errors;
        }
        if (empty($accounts)) {
            return [];
        }
        foreach ($accounts as $id => $account) {
            try {
                $client->testConfiguration($id);
            } catch (\Exception $e) {
                $errors[$id] = Piwik::translate('SearchEngineKeywordsPerformance_YandexAccountConnectionError', [$e->getMessage()]);
            }
        }
        return $errors;
    }
}
