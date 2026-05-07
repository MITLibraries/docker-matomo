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
        $this->googleSearchConsoleUrl = $this->makeSetting('searchconsoleurl', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($googleClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_GoogleSearchConsoleUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            foreach ($googleClient->getAccounts() as $id => $account) {
                if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                    $availableSites = $googleClient->getAvailableUrls($id);
                    foreach ($availableSites as $url => $accessLevel) {
                        $value = $id . '##' . $url;
                        $field->availableValues[$value] = $url;
                    }
                }
            }
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
        if (!empty($createdByUser) && !Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
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
        $this->bingSiteUrl = $this->makeSetting('bingsiteurl', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($bingClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_BingWebmasterApiUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            foreach ($bingClient->getAccounts() as $account) {
                if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                    $availableSites = $bingClient->getAvailableUrls($account['apiKey']);
                    foreach ($availableSites as $url => $isVerified) {
                        $value = $account['apiKey'] . '##' . $url;
                        $field->availableValues[$value] = $url;
                    }
                }
            }
        });
        $createdByUser = $this->bingConfigCreatedBy->getValue();
        if (!empty($createdByUser) && !Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
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
        $this->yandexAccountAndHostId = $this->makeSetting('yandexAccountAndHostId', '0', FieldConfig::TYPE_STRING, function (FieldConfig $field) use ($yandexClient) {
            $field->title = Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrl');
            $field->description = Piwik::translate('SearchEngineKeywordsPerformance_YandexWebmasterApiUrlDescription');
            $field->uiControl = FieldConfig::UI_CONTROL_SINGLE_SELECT;
            $field->availableValues = ['0' => Piwik::translate('SearchEngineKeywordsPerformance_NotAvailable')];
            foreach ($yandexClient->getAccounts() as $id => $account) {
                if (Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'])) {
                    $availableSites = $yandexClient->getAvailableUrls($id);
                    foreach ($availableSites as $url => $hostData) {
                        $value = $id . '##' . $hostData['host_id'];
                        $field->availableValues[$value] = $url;
                    }
                }
            }
        });
        $createdByUser = $this->yandexConfigCreatedBy->getValue();
        if (!empty($createdByUser) && !Piwik::hasUserSuperUserAccessOrIsTheUser($createdByUser)) {
            $this->yandexAccountAndHostId->setIsWritableByCurrentUser(\false);
        }
    }
}
