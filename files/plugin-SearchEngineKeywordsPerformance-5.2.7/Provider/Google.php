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

class Google extends \Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\ProviderAbstract
{
    /**
     * @inheritdoc
     */
    public const ID = 'Google';
    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'Google Search Console';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrl()
    {
        return 'plugins/SearchEngineKeywordsPerformance/images/GoogleLogo.png';
    }
    /**
     * @inheritdoc
     */
    public function getLogoUrls()
    {
        return ['plugins/SearchEngineKeywordsPerformance/images/Google.png'];
    }
    /**
     * @inheritdoc
     */
    public function getDescription()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderGoogleDescription');
    }
    /**
     * @inheritdoc
     */
    public function getNote()
    {
        return Piwik::translate('SearchEngineKeywordsPerformance_ProviderGoogleNoteNew');
    }
    /**
     * @inheritdoc
     */
    public function getClient()
    {
        return StaticContainer::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Google');
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
            $createdByUser = !is_null($settings->googleConfigCreatedBy) ? $settings->googleConfigCreatedBy->getValue() : '';
            $siteConfig = [];
            if ($settings->googleSearchConsoleUrl && $settings->googleSearchConsoleUrl->getValue()) {
                $siteConfig['googleSearchConsoleUrl'] = $settings->googleSearchConsoleUrl->getValue();
                $siteConfig['googleWebKeywords'] = $settings->googleWebKeywords->getValue();
                $siteConfig['googleImageKeywords'] = $settings->googleImageKeywords->getValue();
                $siteConfig['googleVideoKeywords'] = $settings->googleVideoKeywords->getValue();
                $siteConfig['googleNewsKeywords'] = $settings->googleNewsKeywords->getValue();
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
     * Explains why the stored "<accountId>##<url>" value of a measurable's Search Console setting
     * cannot be used, or null when it can. The site editor and the configuration problem list both
     * go through this, so a given cause is named the same way wherever the user meets it.
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
            return Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrlNoLongerValid');
        }
        list($accountId, $url) = explode('##', $configuredValue, 2);
        if (!key_exists($accountId, $accounts)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_AccountDoesNotExistNew', ['']);
        }
        // Property Sets and Apps are deprecated and will be removed, so warn users why it doesn't work anymore
        // @todo can be removed in august 2019
        if (strpos($url, 'sc-set:') === 0) {
            return Piwik::translate('SearchEngineKeywordsPerformance_GooglePropertySetDeprecated');
        }
        if (strpos($url, 'android-app:') === 0) {
            return Piwik::translate('SearchEngineKeywordsPerformance_GoogleAndroidAppImportDeprecated');
        }
        $urls = $client->getAvailableUrls($accountId);
        // Checked before the enumeration flag: a rejected credential is a definite fault, so it must
        // not be reported as a transient outage the user should wait out.
        if ($client->hasCredentialBeenRejected($accountId)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrlAuthenticationFailed');
        }
        // an unreachable API enumerates nothing, exactly as a deleted property does; saying the url
        // is gone would have the user discard a mapping that is fine
        if ($client->hasUrlEnumerationFailed($accountId)) {
            $this->recordConfiguredUrlNotVerifiable($configuredValue);
            return Piwik::translate('SearchEngineKeywordsPerformance_ConfiguredUrlNotVerifiable', [$this->getName()]);
        }
        if (!key_exists($url, $urls)) {
            return Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrlNoLongerValid');
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
            $error = $this->getConfiguredUrlError($config['googleSearchConsoleUrl']);
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
                $errors[$id] = Piwik::translate('SearchEngineKeywordsPerformance_GoogleAccountError', [$e->getMessage()]);
            }
        }
        return $errors;
    }
}
