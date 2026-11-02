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
use Piwik\Plugins\SearchEngineKeywordsPerformance\PeriodHelper;

class Bing extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\ProviderAbstract
{
    /**
     * @inheritdoc
     */
    public const ID = 'Bing';
    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'Bing & Yahoo Webmaster API';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrl()
    {
        return 'plugins/SearchEngineKeywordsPerformance/images/BingLogo.png';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrls()
    {
        return ['plugins/SearchEngineKeywordsPerformance/images/Bing.png', 'plugins/SearchEngineKeywordsPerformance/images/Yahoo.png'];
    }
    /**
     * @inheritdoc
     */
    public function getDescription()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderBingDescription');
    }
    /**
     * @inheritdoc
     */
    public function getNote()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderBingNoteNew');
    }
    /**
     * @inheritdoc
     */
    public function getClient()
    {
        return StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Bing');
    }
    /**
     * @inheritdoc
     */
    public function isConfigured()
    {
        return $this->getClient()->isConfigured();
    }
    /**
     * @param string $date A date or date range to check.
     * @param string $period The period to check.
     * @param string $timezone The timezone used to resolve relative dates. Defaults to UTC for
     *                         callers that omit it.
     * @return bool
     */
    public function isSupportedPeriod($date, $period, $timezone = 'UTC')
    {
        // disabled for date ranges that need days for processing
        if ($period == 'range') {
            $periodObject = PeriodHelper::makePeriod($timezone, $period, $date);
            if ($periodObject->getLabel() == 'day') {
                return \false;
            }
            $subPeriods = $periodObject->getSubperiods();
            foreach ($subPeriods as $subPeriod) {
                if ($subPeriod->getLabel() == 'day') {
                    return \false;
                }
            }
        }
        // bing statistics are not available for single days
        if ($period == 'day') {
            return \false;
        }
        return \true;
    }
    /**
     * @inheritdoc
     */
    public function getConfiguredSiteIds()
    {
        $configuredSites = [];
        foreach ($this->getMeasurableHelper()->getAllSiteSettings() as $siteId => $settings) {
            $createdByUser = !is_null($settings->bingConfigCreatedBy) ? $settings->bingConfigCreatedBy->getValue() : '';
            $siteConfig = [];
            if ($settings->bingSiteUrl && $settings->bingSiteUrl->getValue()) {
                $siteConfig['bingSiteUrl'] = $settings->bingSiteUrl->getValue();
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
     * Explains why the stored "<apiKey>##<url>" value of a measurable's Bing setting cannot be used,
     * or null when it can. The site editor and the configuration problem list both go through this,
     * so a given cause is named the same way wherever the user meets it.
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
            return Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrlNoLongerValid');
        }
        list($apiKey, $url) = explode('##', $configuredValue, 2);
        if (!key_exists($apiKey, $accounts)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_AccountDoesNotExistNew', [$this->obfuscateApiKey($apiKey)]);
        }
        $urls = $client->getAvailableUrls($apiKey);
        // Checked before the enumeration flag: a rejected credential is a definite fault, so it must
        // not be reported as a transient outage the user should wait out.
        if ($client->hasCredentialBeenRejected($apiKey)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrlAuthenticationFailed');
        }
        // an unreachable API enumerates nothing, exactly as a removed site does; saying the url is
        // gone would have the user discard a mapping that is fine
        if ($client->hasUrlEnumerationFailed($apiKey)) {
            $this->recordConfiguredUrlNotVerifiable($configuredValue);
            return Piwik::translate('SearchEngineKeywordsPerformance_ConfiguredUrlNotVerifiable', [$this->getName()]);
        }
        if (!key_exists($url, $urls)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrlNoLongerValid');
        }
        return null;
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
            $error = $this->getConfiguredUrlError($config['bingSiteUrl']);
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
                $client->testConfiguration($account['apiKey']);
            } catch (\Exception $e) {
                // The account map is keyed by the API key itself, so the raw $id must not be used as
                // the error key. These errors are rendered on the settings page and are not limited
                // to the owner of the account.
                $errors[$this->obfuscateApiKey($id)] = Piwik::translate('SearchEngineKeywordsPerformance_BingAccountErrorNew', $e->getMessage());
            }
        }
        return $errors;
    }
    /**
     * Shortens an API key so it can be shown or used as an array key without disclosing the secret.
     *
     * Public because the account errors returned by getConfigurationProblems() are keyed by the
     * obfuscated key, so every consumer has to build the same value to look an error up.
     */
    public function obfuscateApiKey(
        #[\SensitiveParameter]
        $apiKey
    ) {
        return substr($apiKey, 0, 5) . '*****' . substr($apiKey, -5, 5);
    }
}
