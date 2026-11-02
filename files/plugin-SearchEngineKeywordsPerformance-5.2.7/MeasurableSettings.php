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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance;

use Piwik\Piwik;
use Piwik\Plugins\WebsiteMeasurable\Type as WebsiteMeasurableType;
use Piwik\Settings\Setting;
use Piwik\Settings\FieldConfig;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Google as ProviderGoogle;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Bing as ProviderBing;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex as ProviderYandex;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\ProviderAbstract;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Settings\EncryptedBingSiteSetting;

class MeasurableSettings extends \Piwik\Settings\Measurable\MeasurableSettings
{
    /** @var Setting */
    public $googleSearchConsoleUrl;
    /** @var Setting */
    public $googleWebKeywords;
    /** @var Setting */
    public $googleImageKeywords;
    /** @var Setting */
    public $googleVideoKeywords;
    /** @var Setting */
    public $googleNewsKeywords;
    /** @var Setting */
    public $googleConfigCreatedBy;
    /** @var Setting */
    public $bingSiteUrl;
    /** @var Setting */
    public $bingConfigCreatedBy;
    /** @var Setting */
    public $yandexAccountAndHostId;
    /** @var Setting */
    public $yandexConfigCreatedBy;
    protected function init()
    {
        $this->configureGoogleSettings();
        $this->configureBingSettings();
        $this->configureYandexSettings();
    }
    /**
     * Configures Settings used for Google Search Console Import
     */
    protected function configureGoogleSettings()
    {
        $googleClient = ProviderGoogle::getInstance()->getClient();
        // check if google search console is configured and available for website type
        if (!\Piwik\Plugins\SearchEngineKeywordsPerformance\SearchEngineKeywordsPerformance::isGoogleForceEnabled($this->idSite) && (!$this->hasMeasurableType(WebsiteMeasurableType::ID) || !$googleClient->isConfigured())) {
            return;
        }
        $this->googleConfigCreatedBy = $this->makeSetting('googleconfigcreatedby', '', FieldConfig::TYPE_STRING, function (FieldConfig $field) {
            $field->uiControl = FieldConfig::UI_CONTROL_HIDDEN;
        });
        // The marker decides who is allowed to read and write the credential configured below, so it
        // must not be settable through the settings API. FieldConfig::UI_CONTROL_HIDDEN only hides the
        // field in the UI and carries no write permission of its own.
        $this->googleConfigCreatedBy->setIsWritableByCurrentUser(false);
        $this->googleSearchConsoleUrl = $this->makeSetting('searchconsoleurl', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($googleClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            try {
                foreach ($googleClient->getAccounts() as $id => $account) {
                    if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                        $availableSites = $googleClient->getAvailableUrls($id);
                        foreach ($availableSites as $url => $accessLevel) {
                            $value = $id . '##' . $url;
                            $field->availableValues[$value] = $url;
                        }
                    }
                }
            } catch (\Exception $e) {
            }
            $this->explainUnusableUrl($field, ProviderGoogle::getInstance(), 'searchconsoleurl');
        });
        $this->googleWebKeywords = $this->makeSetting('googlewebkeywords', \true, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_FetchWebKeyword');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_FetchWebKeywordDesc');
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->condition = 'searchconsoleurl';
        });
        $this->googleImageKeywords = $this->makeSetting('googleimagekeywords', \false, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_FetchImageKeyword');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_FetchImageKeywordDesc');
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->condition = 'searchconsoleurl && searchconsoleurl.indexOf(\'android-app\') == -1';
        });
        $this->googleVideoKeywords = $this->makeSetting('googlevideokeywords', \false, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_FetchVideoKeyword');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_FetchVideoKeywordDesc');
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->condition = 'searchconsoleurl && searchconsoleurl.indexOf(\'android-app\') == -1';
        });
        $this->googleNewsKeywords = $this->makeSetting('googlenewskeywords', \false, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_FetchNewsKeyword');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_FetchNewsKeywordDesc');
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->condition = 'searchconsoleurl && searchconsoleurl.indexOf(\'android-app\') == -1';
        });
        $createdByUser = $this->googleConfigCreatedBy->getValue();
        // An empty marker means the configuration predates the ownership marker, so the creator is
        // unknown. Fall back to super user access rather than leaving the credential open to every
        // admin of the site.
        if (!Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
            $this->googleSearchConsoleUrl->setIsWritableByCurrentUser(\false);
            $this->googleWebKeywords->setIsWritableByCurrentUser(\false);
            $this->googleImageKeywords->setIsWritableByCurrentUser(\false);
            $this->googleVideoKeywords->setIsWritableByCurrentUser(\false);
            $this->googleNewsKeywords->setIsWritableByCurrentUser(\false);
        }
    }
    /**
     * Configures Settings used for Bing Webmaster API Import
     */
    protected function configureBingSettings()
    {
        $bingClient = ProviderBing::getInstance()->getClient();
        // check if Bing Webmaster API is configured and available for website type
        if (!\Piwik\Plugins\SearchEngineKeywordsPerformance\SearchEngineKeywordsPerformance::isBingForceEnabled($this->idSite) && (!$this->hasMeasurableType(WebsiteMeasurableType::ID) || !$bingClient->isConfigured())) {
            return;
        }
        $this->bingConfigCreatedBy = $this->makeSetting('bingconfigcreatedby', '', FieldConfig::TYPE_STRING, function (FieldConfig $field) {
            $field->uiControl = FieldConfig::UI_CONTROL_HIDDEN;
        });
        // The marker decides who is allowed to read and write the credential configured below, so it
        // must not be settable through the settings API. FieldConfig::UI_CONTROL_HIDDEN only hides the
        // field in the UI and carries no write permission of its own.
        $this->bingConfigCreatedBy->setIsWritableByCurrentUser(false);
        $this->bingSiteUrl = $this->makeEncryptedBingSiteSetting('bingsiteurl', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($bingClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            try {
                foreach ($bingClient->getAccounts() as $account) {
                    if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                        $availableSites = $bingClient->getAvailableUrls($account['apiKey']);
                        foreach ($availableSites as $url => $isVerified) {
                            $value = $account['apiKey'] . '##' . $url;
                            $field->availableValues[$value] = $url;
                        }
                    }
                }
            } catch (\Exception $e) {
            }
            $this->explainUnusableUrl($field, ProviderBing::getInstance(), 'bingsiteurl');
        });
        $createdByUser = $this->bingConfigCreatedBy->getValue();
        // An empty marker means the configuration predates the ownership marker, so the creator is
        // unknown. Fall back to super user access rather than leaving the credential open to every
        // admin of the site.
        if (!Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
            $this->bingSiteUrl->setIsWritableByCurrentUser(\false);
        }
    }
    /**
     * Configures Settings used for Yandex Webmaster API Import
     */
    protected function configureYandexSettings()
    {
        $yandexClient = ProviderYandex::getInstance()->getClient();
        // check if Yandex Webmaster API is configured and available for website type
        if (!$this->hasMeasurableType(WebsiteMeasurableType::ID) || !$yandexClient->isConfigured()) {
            return;
        }
        $this->yandexConfigCreatedBy = $this->makeSetting('yandexconfigcreatedby', '', FieldConfig::TYPE_STRING, function (FieldConfig $field) {
            $field->uiControl = FieldConfig::UI_CONTROL_HIDDEN;
        });
        // The marker decides who is allowed to read and write the credential configured below, so it
        // must not be settable through the settings API. FieldConfig::UI_CONTROL_HIDDEN only hides the
        // field in the UI and carries no write permission of its own.
        $this->yandexConfigCreatedBy->setIsWritableByCurrentUser(false);
        $this->yandexAccountAndHostId = $this->makeSetting('yandexAccountAndHostId', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($yandexClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            try {
                foreach ($yandexClient->getAccounts() as $id => $account) {
                    if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                        $availableSites = $yandexClient->getAvailableUrls($id);
                        foreach ($availableSites as $url => $hostData) {
                            $value = $id . '##' . $hostData['host_id'];
                            $field->availableValues[$value] = $url;
                        }
                    }
                }
            } catch (\Exception $e) {
            }
            $this->explainUnusableUrl($field, ProviderYandex::getInstance(), 'yandexAccountAndHostId');
        });
        $createdByUser = $this->yandexConfigCreatedBy->getValue();
        // An empty marker means the configuration predates the ownership marker, so the creator is
        // unknown. Fall back to super user access rather than leaving the credential open to every
        // admin of the site.
        if (!Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
            $this->yandexAccountAndHostId->setIsWritableByCurrentUser(\false);
        }
    }

    /**
     * Replaces core's generic "value is not allowed" for a provider's site mapping with the reason
     * the provider gives, both in the field's help text as the page renders and in the error raised
     * when the value is posted back. The save is still refused, and that still blocks the
     * measurable's other settings; what changes is that the user is told which cause they are
     * looking at and what to do about it.
     */
    private function explainUnusableUrl(FieldConfig $field, ProviderAbstract $provider, string $settingName): void
    {
        // Every client call above sits in a catch for the same reason: this callback runs while
        // SitesManager renders *every* plugin's measurable settings, so anything escaping here takes
        // out the whole panel — on precisely the unreachable-API paths this method exists for. The
        // providers disagree on which exceptions they swallow, so own the boundary here.
        // Throwable, not Exception: getSetting() returns null for an unknown name, so a drifted
        // setting-name literal raises Error — the very case this guard is here for.
        try {
            $this->describeUnusableUrl($field, $provider, $settingName);
        } catch (\Throwable $e) {
        }
    }

    private function describeUnusableUrl(FieldConfig $field, ProviderAbstract $provider, string $settingName): void
    {
        $isAvailable = static function ($value) use ($field) {
            // an array key can only be a scalar, and a posted array would otherwise raise a TypeError
            // here rather than reaching the provider's own guard
            return is_scalar($value) && array_key_exists($value, $field->availableValues);
        };

        // makeSetting() registers the setting before this callback is ever evaluated, so the stored
        // value is readable here even though the property is only assigned once makeSetting() returns.
        $configuredValue = $this->getSetting($settingName)->getValue();

        if (!$isAvailable($configuredValue)) {
            // null means the provider is content with the value; keep the normal help text then
            $field->description = $provider->getConfiguredUrlError($configuredValue) ?? $field->description;

            // Not reaching the API is not proof the mapping is gone, so keep it in the list: left out,
            // the select silently falls back to "Not available" while the help text says the setting
            // was kept, and the only option the user can then pick discards the mapping for good.
            if (!$provider->isConfiguredUrlVerifiable($configuredValue) && is_string($configuredValue)) {
                $field->availableValues[$configuredValue] = $provider->describeConfiguredSite($configuredValue);
            }
        }

        // setting a validator skips core's own availableValues check, so go through the same predicate
        $pluginName = $this->pluginName;
        $field->validate = function ($value) use ($field, $isAvailable, $provider, $pluginName) {
            if ($isAvailable($value)) {
                return;
            }

            // the provider having nothing to say means the value is only unavailable to this user,
            // so fall back to the message core would have raised rather than inventing a cause.
            // Mirrors core/Settings/Setting.php::validateValue() — keep the arguments in step with it.
            throw new \Exception(
                $provider->getConfiguredUrlError($value)
                    ?? Piwik::translate('CoreAdminHome_PluginSettingsValueNotAllowed', [strip_tags($field->title), $pluginName])
            );
        };
    }

    protected function makeEncryptedBingSiteSetting($name, $defaultValue, $type, $fieldConfigCallback)
    {
        $setting = new EncryptedBingSiteSetting($name, $defaultValue, $type, $this->pluginName, $this->idSite);
        $setting->setConfigureCallback($fieldConfigCallback);

        $this->addSetting($setting);

        return $setting;
    }
}
