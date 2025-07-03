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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Diagnostic;

use Piwik\Plugins\Diagnostics\Diagnostic\Diagnostic;
use Piwik\Plugins\Diagnostics\Diagnostic\DiagnosticResult;
use Piwik\Plugins\Diagnostics\Diagnostic\DiagnosticResultItem;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex;
use Piwik\Site;
use Piwik\Translation\Translator;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex as ProviderYandex;

/**
 * Check the used yandex accounts.
 */
class YandexAccountDiagnostic implements Diagnostic
{
    /**
     * @var Translator
     */
    private $translator;
    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }
    public function execute()
    {
        $client = ProviderYandex::getInstance()->getClient();
        $accounts = $client->getAccounts();
        if (empty($accounts)) {
            return [];
            // skip if no accounts configured
        }
        $errors = ProviderYandex::getInstance()->getConfigurationProblems();
        $resultAccounts = new DiagnosticResult(Yandex::getInstance()->getName() . ' - ' . $this->translator->translate('SearchEngineKeywordsPerformance_ConfiguredAccounts'));
        foreach ($accounts as $id => $account) {
            $userInfo = $client->getUserInfo($id);
            $oauthDaysAgo = floor((time() - $account['created']) / (3600 * 24));
            if (array_key_exists($id, $errors['accounts'])) {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_ERROR, $userInfo['name'] . ': ' . $errors['accounts'][$id]);
            } else {
                if ($oauthDaysAgo >= 150) {
                    $item = new DiagnosticResultItem(DiagnosticResult::STATUS_WARNING, $userInfo['name'] . ': ' . $this->translator->translate('SearchEngineKeywordsPerformance_OAuthAccessWillTimeOutSoon', 180 - $oauthDaysAgo));
                } else {
                    $item = new DiagnosticResultItem(DiagnosticResult::STATUS_OK, $userInfo['name'] . ': ' . $this->translator->translate('SearchEngineKeywordsPerformance_YandexAccountOk'));
                }
            }
            $resultAccounts->addItem($item);
        }
        $resultMeasurables = new DiagnosticResult(Yandex::getInstance()->getName() . ' - ' . $this->translator->translate('SearchEngineKeywordsPerformance_MeasurableConfig'));
        $configuredSiteIds = ProviderYandex::getInstance()->getConfiguredSiteIds();
        foreach ($configuredSiteIds as $configuredSiteId => $config) {
            if (array_key_exists($configuredSiteId, $errors['sites'])) {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_ERROR, Site::getNameFor($configuredSiteId) . ' (' . Site::getMainUrlFor($configuredSiteId) . ')' . ': ' . $errors['sites'][$configuredSiteId]);
            } else {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_OK, Site::getNameFor($configuredSiteId) . ' (' . Site::getMainUrlFor($configuredSiteId) . ')');
            }
            $resultMeasurables->addItem($item);
        }
        return [$resultAccounts, $resultMeasurables];
    }
}
