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
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Bing;
use Piwik\Site;
use Piwik\Translation\Translator;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Bing as ProviderBing;

/**
 * Check the used bing accounts.
 */
class BingAccountDiagnostic implements Diagnostic
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
        $client = ProviderBing::getInstance()->getClient();
        try {
            $accounts = $client->getAccounts();
        } catch (SecretConfigurationException $e) {
            // Without this the whole system check page would fail to render once the encryption key
            // is lost, which is the moment it is most needed
            $result = new DiagnosticResult(Bing::getInstance()->getName() . ' - ' . $this->translator->translate('SearchEngineKeywordsPerformance_ConfiguredAccounts'));
            $result->addItem(new DiagnosticResultItem(DiagnosticResult::STATUS_ERROR, $e->getMessage()));
            return [$result];
        }
        if (empty($accounts)) {
            return [];
            // skip if no accounts configured
        }
        $errors = ProviderBing::getInstance()->getConfigurationProblems();
        $resultAccounts = new DiagnosticResult(Bing::getInstance()->getName() . ' - ' . $this->translator->translate('SearchEngineKeywordsPerformance_ConfiguredAccounts'));
        foreach ($accounts as $account) {
            // getAccountErrors() keys the errors by the obfuscated API key, so the same value has to be
            // built here. Looking up the plain key would never match and would report every failing
            // account as OK.
            $obfuscatedApiKey = ProviderBing::getInstance()->obfuscateApiKey($account['apiKey']);
            if (array_key_exists($obfuscatedApiKey, $errors['accounts'])) {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_ERROR, $obfuscatedApiKey . ': ' . $errors['accounts'][$obfuscatedApiKey]);
            } else {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_OK, $obfuscatedApiKey . ': ' . $this->translator->translate('SearchEngineKeywordsPerformance_BingAccountOk'));
            }
            $resultAccounts->addItem($item);
        }
        $resultMeasurables = new DiagnosticResult(Bing::getInstance()->getName() . ' - ' . $this->translator->translate('SearchEngineKeywordsPerformance_MeasurableConfig'));
        $configuredSiteIds = ProviderBing::getInstance()->getConfiguredSiteIds();
        foreach ($configuredSiteIds as $configuredSiteId => $config) {
            if (array_key_exists($configuredSiteId, $errors['sites'])) {
                // an API we could not reach is a transient condition, not a broken configuration, so
                // it must not paint the system check red alongside a genuinely missing property
                $status = ProviderBing::getInstance()->isConfiguredUrlVerifiable($config['bingSiteUrl'])
                    ? DiagnosticResult::STATUS_ERROR
                    : DiagnosticResult::STATUS_WARNING;
                $item = new DiagnosticResultItem($status, Site::getNameFor($configuredSiteId) . ' (' . Site::getMainUrlFor($configuredSiteId) . ')' . ': ' . $errors['sites'][$configuredSiteId]);
            } else {
                $item = new DiagnosticResultItem(DiagnosticResult::STATUS_OK, Site::getNameFor($configuredSiteId) . ' (' . Site::getMainUrlFor($configuredSiteId) . ')');
            }
            $resultMeasurables->addItem($item);
        }
        return [$resultAccounts, $resultMeasurables];
    }
}
