<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance;

use Piwik\Url;

require \dirname(\dirname(__FILE__)) . '/vendor/autoload.php';

// Composer keys its file-autoloading by a hash of the package and path, which is identical in every plugin that
// scopes the same package. Whichever plugin loads first marks that hash as done, so the prefixed copies belonging to
// the others are silently skipped and their functions never get defined. psr7 calls trigger_deprecation()
// unconditionally, so load our own copy directly if that happened.
if (!function_exists('Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\trigger_deprecation')) {
    require_once __DIR__ . '/../vendor/prefixed/symfony/deprecation-contracts/function.php';
}

// Same collision applies to the php80 polyfill, which supplies get_debug_type() and preg_last_error_msg() globally.
// psr7 calls both unconditionally, so on PHP 7 losing that race is fatal.
if (PHP_VERSION_ID < 80000 && !function_exists('get_debug_type')) {
    require_once __DIR__ . '/../vendor/prefixed/symfony/polyfill-php80/bootstrap.php';
}
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
