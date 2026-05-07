<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance;

use Piwik\Url;

require \dirname(\dirname(__FILE__)) . '/vendor/autoload.php';
return [
    'SearchEngineKeywordsPerformance.Google.isClientConfigurable' => \true,
    'Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Client\\Google' => \Piwik\DI::autowire(),
    'diagnostics.optional' => \Piwik\DI::add([
        \Piwik\DI::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Diagnostic\\BingAccountDiagnostic'),
        \Piwik\DI::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Diagnostic\\GoogleAccountDiagnostic'),
        \Piwik\DI::get('Piwik\\Plugins\\SearchEngineKeywordsPerformance\\Diagnostic\\YandexAccountDiagnostic')
    ]),
    // defines the number of days the plugin will try to import Google keywords for
    // Google API itself currently supports up to 500 days in the past
    'SearchEngineKeywordsPerformance.Google.ImportLastDaysMax' => 365,
    'SearchEngineKeywordsPerformance.Google.googleClient' => function (\Piwik\Container\Container $c) {
        $googleClient = new \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Client();
        $googleClient->addScope(\Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\SearchConsole::WEBMASTERS_READONLY);
        $googleClient->addScope(\Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\Oauth2::USERINFO_PROFILE);
        $googleClient->setAccessType('offline');
        $googleClient->setApprovalPrompt('force');
        $redirectUrl = Url::getCurrentUrlWithoutQueryString() . '?module=SearchEngineKeywordsPerformance&action=processAuthCode';
        $googleClient->setRedirectUri($redirectUrl);
        return $googleClient;
    },
];
