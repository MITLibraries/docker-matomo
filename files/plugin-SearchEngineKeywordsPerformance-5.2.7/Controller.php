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

use Piwik\API\Request;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Date;
use Piwik\Http;
use Piwik\Log\LoggerInterface;
use Piwik\Nonce;
use Piwik\Notification;
use Piwik\Option;
use Piwik\Piwik;
use Piwik\Plugin\Manager;
use Piwik\Plugins\ConnectAccounts\ConnectAccounts;
use Piwik\Plugins\ConnectAccounts\helpers\ConnectHelper;
use Piwik\Plugins\ConnectAccounts\Strategy\Google\GoogleSearchConnect;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingClientConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\MissingOAuthConfigException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\RateLimitApiException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\UnknownAPIException;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Google as ProviderGoogle;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Bing as ProviderBing;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Yandex as ProviderYandex;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\ProviderAbstract;
use Piwik\Plugins\WebsiteMeasurable\Type as WebsiteMeasurableType;
use Piwik\Session\SessionNamespace;
use Piwik\SettingsPiwik;
use Piwik\Site;
use Piwik\Url;

class Controller extends \Piwik\Plugin\ControllerAdmin
{
    public const OAUTH_STATE_NONCE_NAME = 'SearchEngineKeywordsPerformance.oauthStateNonce';
    public const YANDEX_OAUTH_STATE_NONCE_NAME = 'SearchEngineKeywordsPerformance.yandexOauthStateNonce';
    private const YANDEX_OAUTH_REFERRER_HOSTS = ['yandex.com', 'yandex.ru', 'yandex.com.tr', 'yandex.by', 'yandex.kz', 'yandex.uz'];
    public const GOOGLE_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.google.add.site_config';
    public const GOOGLE_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.google.remove.site_config';
    public const GOOGLE_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.google.remove.account';
    public const BING_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.bing.add.site_config';
    public const BING_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.bing.remove.site_config';
    public const BING_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.bing.remove.account';
    public const YANDEX_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.yandex.add.site_config';
    public const YANDEX_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.yandex.remove.site_config';
    public const YANDEX_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.yandex.remove.account';

    /**
     * @var bool whether a decryption failure was already reported during this request
     */
    private $secretConfigurationErrorReported = false;

    public const REDACT_MAPPING_PROVIDE_WISE = [
        'Google' => ['key' => 'googleSearchConsoleUrl', 'length' => 2],
        'Bing' => ['key' => 'bingSiteUrl', 'length' => 5],
        'Yandex' => ['key' => 'yandexAccountAndHostId', 'length' => 2],
    ];

    public function index()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $viewVariables              = [];
        $viewVariables['providers'] = [
            ProviderGoogle::getInstance(),
            ProviderBing::getInstance(),
            ProviderYandex::getInstance(),
        ];

        $viewVariables['providers'] = array_map(function (ProviderAbstract $provider) {
            return $this->toProviderArray($provider);
        }, $viewVariables['providers']);

        return $this->renderTemplate('index', $viewVariables);
    }

    private function toProviderArray(ProviderAbstract $provider)
    {
        $mappingToPick = self::REDACT_MAPPING_PROVIDE_WISE[$provider->getId()];
        $configuredSiteIds = $provider->getConfiguredSiteIds();
        $problems = $provider->getConfigurationProblems();
        return [
            'id' => $provider->getId(),
            'is_configured' => $provider->isConfigured(),
            'configured_site_ids' => $this->redactMeasurableDataIfRequired($mappingToPick['key'], $configuredSiteIds, $mappingToPick['length']),
            'problems' => $problems,
            'is_experimental' => $provider->isExperimental(),
            'logos' => $provider->getLogoUrls(),
            'logo' => $provider->getLogoUrl(),
            'name' => $provider->getName(),
            'description' => $provider->getDescription(),
            'note' => $provider->getNote(),
            'hasWarning' => $this->isAnyWarningForProvider($provider, $problems, $configuredSiteIds),
        ];
    }

    private function isAnyWarningForProvider(ProviderAbstract $provider, array $problems, array $configuredSiteIds): bool
    {
        if (!$provider->isConfigured()) {
            return false;
        }

        // A mapping we could not check is not a problem to go and fix; counting it here would put
        // "Configuration problem detected" on the landing page while every other surface says the
        // opposite, and this is the first page a user lands on.
        $siteProblems = array_filter(
            $problems['sites'],
            function ($siteId) use ($provider, $configuredSiteIds) {
                $key = self::REDACT_MAPPING_PROVIDE_WISE[$provider->getId()]['key'];

                return !isset($configuredSiteIds[$siteId][$key])
                    || $provider->isConfiguredUrlVerifiable($configuredSiteIds[$siteId][$key]);
            },
            ARRAY_FILTER_USE_KEY
        );

        if (count($configuredSiteIds) == 0 || count($siteProblems) || count($problems['accounts'])) {
            return true;
        }

        if ($provider->hasApiErrorWithinWeek() && !empty($provider->getRecentApiErrorMessage())) {
            return true;
        }

        return false;
    }

    private function getCurrentSite()
    {
        if ($this->site instanceof Site) {
            return ['id' => $this->site->getId(), 'name' => $this->site->getName()];
        }

        $sites = Request::processRequest('SitesManager.getSitesWithAdminAccess', [], []);

        if (!empty($sites[0])) {
            return ['id' => $sites[0]['idsite'], 'name' => $sites[0]['name']];
        }

        return [];
    }

    /*****************************************************************************************
     * Configuration actions for Google provider
     */

    /**
     * Show Google configuration page
     *
     * @param bool $hasOAuthError indicates if a oAuth access error occurred
     * @return string
     */
    public function configureGoogle($hasOAuthError = false)
    {
        Piwik::checkUserHasSomeAdminAccess();

        $configSaved = $this->configureGoogleClientIfProvided();
        if (false === $configSaved) {
            $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigSaveErrorNew'));
            $notification->context = Notification::CONTEXT_ERROR;
            Notification\Manager::notify('clientConfigSaved', $notification);
        }

        $errorMessage = Common::getRequestVar('error', '');
        if (!empty($errorMessage)) {
            if ($errorMessage === 'access_denied') {
                $errorMessage = Piwik::translate('SearchEngineKeywordsPerformance_OauthFailedMessage');
            } elseif ($errorMessage === 'jwt_validation_error') {
                $errorMessage = Piwik::translate('General_ExceptionSecurityCheckFailed');
            }
            $notification = new Notification($errorMessage);
            $notification->context = Notification::CONTEXT_ERROR;
            $notification->type = Notification::TYPE_TRANSIENT;
            Notification\Manager::notify('configureerror', $notification);
        }

        $googleClient = ProviderGoogle::getInstance()->getClient();
        $clientConfigured = true;
        $hasUnreadableAccounts = $googleClient->hasUnreadableAccounts();
        $hasUnreadableClientConfig = $googleClient->hasUnreadableClientConfig();
        $hasCredentialsError = $hasUnreadableAccounts || $hasUnreadableClientConfig;

        try {
            $googleClient->getConfiguredClient('');
        } catch (SecretConfigurationException $e) {
            $clientConfigured = false;
            Notification\Manager::cancel('clientConfigSaved');
            $this->notifySecretConfigurationError($e, 'configureerror');
        } catch (MissingClientConfigException $e) {
            $clientConfigured = false;
        } catch (MissingOAuthConfigException $e) {
            // ignore missing accounts
        } catch (\Exception $e) {
            // Only report the error and mark the client as not configured. The stored client
            // configuration stays unchanged; a super user can replace it with the upload form, which
            // is shown while the client is not configured.
            Notification\Manager::cancel('clientConfigSaved');

            $clientConfigured = false;
            $notification = new Notification($e->getMessage());
            $notification->context = Notification::CONTEXT_ERROR;
            $notification->type = Notification::TYPE_TRANSIENT;
            Notification\Manager::notify('configureerror', $notification);
        }

        // These all read the stored accounts before they write, so they would throw rather than do
        // anything useful while the accounts cannot be decrypted
        if (!$hasUnreadableAccounts) {
            $this->addGoogleSiteConfigIfProvided();
            $this->removeGoogleSiteConfigIfProvided();
            $this->removeGoogleAccountIfProvided();
        }

        $urlOptions = [];
        $accounts   = [];
        try {
            $accounts = $googleClient->getAccounts();
        } catch (SecretConfigurationException $e) {
            // only the accounts are unreadable here; whether the client config is usable was already
            // decided by getConfiguredClient() above
            $this->notifySecretConfigurationError($e, 'googleSecretConfigError');
        }

        // Whether an account is connected at all decides whether the measurable configuration is
        // shown, and a site can be mapped to an account owned by somebody else, so this counts every
        // stored account - unlike the account records, which are limited to their owner below.
        $hasAnyAccount             = count($accounts) > 0;
        $allAccounts               = $accounts;
        $accounts                  = $this->removeAccountsNotOwnedByCurrentUser($accounts);
        $countOfAccountsWithAccess = count($accounts);

        foreach ($accounts as $id => &$account) {
            $userInfo                     = $googleClient->getUserInfo($id);
            $urls                         = $googleClient->getAvailableUrls($id, false);
            $account['picture']           = $userInfo['picture'];
            $account['name']              = $userInfo['name'];
            $account['urls']              = $urls;
            $account['hasAccess']         = true;
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            try {
                $googleClient->testConfiguration($id);
            } catch (\Exception $e) {
                $account['hasError'] = Piwik::translate('SearchEngineKeywordsPerformance_AccountConnectionValidationErrorNew');
            }

            foreach ($googleClient->getAvailableUrls($id) as $url => $status) {
                $urlOptions[$id . '##' . $url] = $url . ' (' . $account['name'] . ')';
            }
        }
        unset($account);

        $accounts += $this->buildPlaceholdersForAccountsNotOwned(
            $allAccounts,
            $accounts,
            ProviderGoogle::getInstance()->getConfiguredSiteIds(),
            'googleSearchConsoleUrl',
            self::REDACT_MAPPING_PROVIDE_WISE['Google']['length']
        );

        $isClientConfigurable = StaticContainer::get('SearchEngineKeywordsPerformance.Google.isClientConfigurable');

        // Both read the stored client config, which cannot be decrypted and has nothing to show
        $clientId     = $hasUnreadableClientConfig ? '' : $googleClient->getClientId();
        $clientSecret = $hasUnreadableClientConfig ? '' : $googleClient->getClientSecret();

        $viewVariables                          = [];
        $viewVariables['isConfigured']          = $googleClient->isConfigured();
        $viewVariables['clientId']              = $clientId;
        $viewVariables['auth_nonce']            = Nonce::getNonce('SEKP.google.auth');
        $viewVariables['clientSecret']          = preg_replace('/\w/', '*', $clientSecret ?? '');
        $viewVariables['isClientConfigured']    = $clientConfigured;
        $viewVariables['isClientConfigurable']  = $isClientConfigurable;
        $viewVariables['isOAuthConfigured']     = $hasAnyAccount;
        $viewVariables['accounts']              = $accounts;
        $viewVariables['urlOptions']            = $urlOptions;
        $viewVariables['hasOAuthError']         = $hasOAuthError;
        $viewVariables['configuredMeasurables'] = ProviderGoogle::getInstance()->getConfiguredSiteIds();
        $viewVariables['nonce']                 = Nonce::getNonce('SEKP.google.config');
        $viewVariables['sitesInfos']            = [];
        $viewVariables['currentSite']           = $this->getCurrentSite();
        $viewVariables['countOfAccountsWithAccess'] = $countOfAccountsWithAccess;
        $viewVariables['addGoogleSiteConfigNonce'] = Nonce::getNonce(self::GOOGLE_ADD_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeGoogleSiteConfigNonce'] = Nonce::getNonce(self::GOOGLE_REMOVE_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeGoogleAccountNonce'] = Nonce::getNonce(self::GOOGLE_REMOVE_ACCOUNT_NONCE_KEY);
        $viewVariables['hasCredentialsError']   = $hasCredentialsError;
        $viewVariables['resetCredentialsUrl']   = Url::getCurrentQueryStringWithParametersModified(['action' => 'resetGoogleCredentials']);

        // A site can still be mapped when the provider is force-enabled, and validating it reads the
        // access token, which is stored with the accounts
        $siteIds = $hasUnreadableAccounts ? [] : $viewVariables['configuredMeasurables'];

        foreach ($siteIds as $siteId => $config) {
            $googleSiteUrl                        = $config['googleSearchConsoleUrl'];
            $viewVariables['sitesInfos'][$siteId] = Site::getSite($siteId);
            $lastRun                              = Option::get('GoogleImporterTask_LastRun_' . $siteId);

            if ($lastRun) {
                $lastRun = date('Y-m-d H:i', $lastRun) . ' UTC';
            } else {
                $lastRun = Piwik::translate('General_Never');
            }

            $viewVariables['sitesInfos'][$siteId]['lastRun'] = $lastRun;

            [$accountId, $url] = explode('##', $googleSiteUrl, 2);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $googleClient->testConfiguration($accountId);
            } catch (UnknownAPIException | RateLimitApiException $e) {
                // Only the two explicitly retryable failures mean "we could not check". Everything
                // else -- a rejected key, an unparseable body, an error code we do not classify --
                // stays an authentication failure, which is what it has always reported.
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = true;
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            $urls = $googleClient->getAvailableUrls($accountId);

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = key_exists($url, $urls);
            // Rendered ahead of urlValid so an API we could not reach is never reported as either a
            // bad url or a healthy one.
            $viewVariables['sitesInfos'][$siteId]['urlNotVerifiable'] =
                !ProviderGoogle::getInstance()->isConfiguredUrlVerifiable($googleSiteUrl);
        }
        $viewVariables['providerName'] = ProviderGoogle::getInstance()->getName();

        if (!empty($this->securityPolicy)) {
            $this->securityPolicy->addPolicy('img-src', '*.googleusercontent.com');
        }

        $configureConnectionProps = [];
        $configureConnectionProps['baseUrl'] = Url::getCurrentUrlWithoutQueryString();
        $configureConnectionProps['baseDomain'] = Url::getCurrentScheme() . '://' . Url::getCurrentHost();
        $configureConnectionProps['manualConfigNonce'] = $viewVariables['nonce'];
        $configureConnectionProps['primaryText'] = Piwik::translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel1');

        // There are certain cases where index.php isn't part of the baseUrl when it should be. Append it if missing.
        if (stripos($configureConnectionProps['baseUrl'], 'index.php') === false) {
            $configureConnectionProps['baseUrl'] .= 'index.php';
        }

        $isConnectAccountsActivated = Manager::getInstance()->isPluginActivated('ConnectAccounts');
        $authBaseUrl = $isConnectAccountsActivated ? "https://" . StaticContainer::get('CloudAccountsInstanceId') . '/index.php?' : '';
        $jwt = Common::getRequestVar('state', '', 'string');
        if (empty($jwt) && Piwik::hasUserSuperUserAccess() && $isConnectAccountsActivated) {
            // verify an existing user by supplying a jwt too
            $jwt = ConnectHelper::buildOAuthStateJwt(
                SettingsPiwik::getPiwikInstanceId(),
                ConnectAccounts::INITIATED_BY_SEK
            );
        }
        $googleAuthUrl = '';
        if ($isConnectAccountsActivated) {
            $strategyName = GoogleSearchConnect::getStrategyName();
            $googleAuthUrl = $authBaseUrl . Http::buildQuery([
                    'module' => 'ConnectAccounts',
                    'action' => 'initiateOauth',
                    'state' => $jwt,
                    'strategy' => $strategyName
                ]);
            $configureConnectionProps['strategy'] = $strategyName;
            $configureConnectionProps['connectedWith'] = 'Google';
            $configureConnectionProps['unlinkUrl'] = Url::getCurrentUrlWithoutQueryString() . '?' . Http::buildQuery([
                    'module' => 'ConnectAccounts',
                    'action' => 'unlink',
                    'nonce' => ConnectHelper::getUnlinkNonce(),
                    'strategy' => $strategyName
                ]);
            $configureConnectionProps['authUrl'] = $googleAuthUrl;
            $configureConnectionProps['connectAccountsUrl'] = $googleAuthUrl;
            $configureConnectionProps['connectAccountsBtnText'] = Piwik::translate('ConnectAccounts_ConnectWithGoogleText');
        }

        $configureConnectionProps['isConnectAccountsActivated'] = $isConnectAccountsActivated;
        if ($isConnectAccountsActivated) {
            $configureConnectionProps['radioOptions'] = [
                'connectAccounts' => Piwik::translate('SearchEngineKeywordsPerformance_OptionQuickConnectWithGoogle'),
                'manual' => Piwik::translate('ConnectAccounts_OptionAdvancedConnectWithGa'),
            ];
        }
        $configureConnectionProps['googleAuthUrl'] = $googleAuthUrl;
        $faqUrl = Url::addCampaignParametersToMatomoLink('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-search-console-and-verify-your-website');
        $faqAnchorOpen = "<a href=\"{$faqUrl}\" rel=\"noreferrer noopener\" target=\"_blank\">";
        $configureConnectionProps['manualConfigText'] = Piwik::translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel2')
            . '<br />' . Piwik::translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel3', [
                $faqAnchorOpen,
                '</a>',
        ]) . '<br /><br />' . Piwik::translate('SearchEngineKeywordsPerformance_OAuthExampleText')
            . '<br /><strong>' . Piwik::translate('SearchEngineKeywordsPerformance_GoogleAuthorizedJavaScriptOrigin')
            . ":</strong> {$configureConnectionProps['baseDomain']}<br /><span style=\"word-break: break-all;\"><strong>"
            . Piwik::translate('SearchEngineKeywordsPerformance_GoogleAuthorizedRedirectUri')
            . ":</strong> {$configureConnectionProps['baseUrl']}?module=SearchEngineKeywordsPerformance&action=processAuthCode<span />";

        $configureConnectionProps['faqUrl'] = $faqUrl;
        $configureConnectionProps['authorizedJsOrigin'] = $configureConnectionProps['baseDomain'];
        $configureConnectionProps['authorizedRedirectUrl'] = $configureConnectionProps['baseUrl']
            . '?module=SearchEngineKeywordsPerformance&action=processAuthCode';

        $viewVariables['configureConnectionProps'] = $configureConnectionProps;
        $viewVariables['extensions'] = self::getComponentExtensions();
        $viewVariables['removeConfigUrl'] = Url::getCurrentQueryStringWithParametersModified([ 'action' => 'removeGoogleClientConfig' ]);
        $mappingToPick = self::REDACT_MAPPING_PROVIDE_WISE['Google'];
        $viewVariables['configuredMeasurables'] = $this->redactMeasurableDataIfRequired($mappingToPick['key'], $viewVariables['configuredMeasurables'], $mappingToPick['length']);

        return $this->renderTemplate('google\configuration', $viewVariables);
    }

    /**
     * Save Google client configuration if set in request
     *
     * @return bool|null  bool on success or failure, null if not data present in request
     */
    protected function configureGoogleClientIfProvided()
    {
        $googleClient = ProviderGoogle::getInstance()->getClient();

        $config = Common::getRequestVar('client', '');

        if (empty($config) && !empty($_FILES['clientfile'])) {
            if (!empty($_FILES['clientfile']['error'])) {
                return false;
            }

            $file = $_FILES['clientfile']['tmp_name'];
            if (!file_exists($file)) {
                return false;
            }

            $config = file_get_contents($_FILES['clientfile']['tmp_name']);
        }

        if (!empty($config)) {
            Piwik::checkUserHasSuperUserAccess();
            Nonce::checkNonce('SEKP.google.config', Common::getRequestVar('config_nonce'));
            try {
                $config = Common::unsanitizeInputValue($config);
                $saveResult = $googleClient->setClientConfig($config);
                if (!$saveResult) {
                    return false;
                }

                // Show success notification
                $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigImported'));
                $notification->context = Notification::CONTEXT_SUCCESS;
                Notification\Manager::notify('clientConfigSaved', $notification);

                // Redirect so that it's the correct URL and doesn't try to resubmit the form if the customer refreshes
                Url::redirectToUrl(Url::getCurrentUrlWithoutQueryString() . Url::getCurrentQueryStringWithParametersModified([
                        'action' => 'configureGoogle',
                        'code'   => null,
                        'scope'   => null,
                        'state'   => null,
                        'error'   => null,
                    ]));
            } catch (\Exception $e) {
                return false;
            }
        }

        return null;
    }

    /**
     * Save google configuration for a site if given in request
     */
    protected function addGoogleSiteConfigIfProvided()
    {
        $googleSiteId        = Common::getRequestVar('googleSiteId', '');
        $googleAccountAndUrl = Common::getRequestVar('googleAccountAndUrl', '');
        $googleTypes         = explode(',', Common::getRequestVar('googleTypes', ''));

        if (!empty($googleSiteId) && !empty($googleAccountAndUrl)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::GOOGLE_ADD_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('addSiteConfigNonce', ''));
            // The site id is read as a string, and the check below resolves it differently than the
            // writes further down would. Resolve it once so both act on the same site.
            $googleSiteId = (int) $googleSiteId;
            // The site id comes from the request and the writes below raise the write permission on
            // the settings explicitly, so nothing else in this path checks that the current user may
            // configure this particular site.
            Piwik::checkUserHasAdminAccess($googleSiteId);
            // Do not allow to configure websites with unsupported type or force enabled config
            if (SearchEngineKeywordsPerformance::isGoogleForceEnabled($googleSiteId) || WebsiteMeasurableType::ID !== Site::getTypeFor($googleSiteId)) {
                $notification          = new Notification(
                    Piwik::translate('SearchEngineKeywordsPerformance_WebsiteTypeUnsupported', [
                        Site::getNameFor($googleSiteId)
                    ])
                );

                if (class_exists('\Piwik\Plugins\RollUpReporting\Type') && \Piwik\Plugins\RollUpReporting\Type::ID === Site::getTypeFor($googleSiteId)) {
                    $notification->message .= '<br />' . Piwik::translate('SearchEngineKeywordsPerformance_WebsiteTypeUnsupportedRollUp');
                }

                $notification->context = Notification::CONTEXT_ERROR;
                $notification->raw     = true;
                $notification->flags   = Notification::FLAG_CLEAR;
                Notification\Manager::notify('websiteNotConfigurable', $notification);

                return;
            }

            $measurableSettings = new MeasurableSettings($googleSiteId);
            // The marker is not writable through the settings API, so this path raises the permission
            // explicitly before recording the current user as the owner of the configuration.
            $measurableSettings->googleConfigCreatedBy->setIsWritableByCurrentUser(true);
            $measurableSettings->googleConfigCreatedBy->setValue(Piwik::getCurrentUserLogin());

            //Need to explicitly setIsWritableByCurrentUser=true, since it can be set as false when we  instantiate MeasurableSettings object due to previously added by another user
            $measurableSettings->googleSearchConsoleUrl->setIsWritableByCurrentUser(true);
            $measurableSettings->googleWebKeywords->setIsWritableByCurrentUser(true);
            $measurableSettings->googleImageKeywords->setIsWritableByCurrentUser(true);
            $measurableSettings->googleNewsKeywords->setIsWritableByCurrentUser(true);
            $measurableSettings->googleVideoKeywords->setIsWritableByCurrentUser(true);

            $measurableSettings->googleSearchConsoleUrl->setValue($googleAccountAndUrl);
            $measurableSettings->googleWebKeywords->setValue(in_array('web', $googleTypes));
            $measurableSettings->googleImageKeywords->setValue(in_array('image', $googleTypes));
            $measurableSettings->googleNewsKeywords->setValue(in_array('news', $googleTypes));
            $measurableSettings->googleVideoKeywords->setValue(in_array('video', $googleTypes));
            $measurableSettings->save();

            $notification          = new Notification(
                Piwik::translate('SearchEngineKeywordsPerformance_WebsiteSuccessfulConfigured', [
                    Site::getNameFor($googleSiteId),
                    '<a href="' . Url::addCampaignParametersToMatomoLink('https://matomo.org/guide/installation-maintenance/import-search-keywords/') . '">',
                    '</a>'
                ])
            );
            $notification->context = Notification::CONTEXT_SUCCESS;
            $notification->raw     = true;
            $notification->flags   = Notification::FLAG_CLEAR;
            Notification\Manager::notify('websiteConfigured', $notification);
        }
    }

    /**
     * Removes a Google account if `remove` param is given in request
     */
    protected function removeGoogleAccountIfProvided()
    {
        $remove = Common::getRequestVar('remove', '');

        if (!empty($remove)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::GOOGLE_REMOVE_ACCOUNT_NONCE_KEY, $request->getStringParameter('removeAccountNonce', ''));
            ProviderGoogle::getInstance()->getClient()->removeAccount($remove);

            $sitesWithConfig = ProviderGoogle::getInstance()->getConfiguredSiteIds();
            foreach ($sitesWithConfig as $siteId => $siteConfig) {
                $googleSetting = explode('##', $siteConfig['googleSearchConsoleUrl'], 2);
                if (!empty($googleSetting[0]) && $googleSetting[0] == $remove) {
                    $config = new MeasurableSettings($siteId);
                    $config->googleSearchConsoleUrl->setValue('0');
                    $config->save();
                }
            }
        }
    }

    /**
     * Removes a Google site config if `removeConfig` param is given in request
     */
    protected function removeGoogleSiteConfigIfProvided()
    {
        $removeConfig = Common::getRequestVar('removeConfig', '');

        if (!empty($removeConfig)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::GOOGLE_REMOVE_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('removeSiteConfigNonce', ''));
            $measurableSettings = new MeasurableSettings($removeConfig);
            $measurableSettings->googleSearchConsoleUrl->setValue('0');
            $measurableSettings->save();
        }
    }

    /**
     * Delete the Google client config option so that the customer will be prompted to upload a new one or use the Cloud
     * config. Then refresh the page so show the change.
     */
    public function removeGoogleClientConfig()
    {
        Piwik::checkUserHasSuperUserAccess();

        Nonce::checkNonce('SEKP.google.config', Common::getRequestVar('config_nonce'));

        ProviderGoogle::getInstance()->getClient()->deleteClientConfig();

        $this->redirectToConfigureAction('configureGoogle');
    }

    /**
     * Deletes the Google credentials that can no longer be decrypted, so the customer can connect an
     * account again without deleting rows from the option table by hand.
     */
    public function resetGoogleCredentials()
    {
        Piwik::checkUserHasSuperUserAccess();
        $this->checkTokenInUrl();

        // read from the POST body only, so a nonce that leaked into a URL cannot delete anything
        Nonce::checkNonce('SEKP.google.config', \Piwik\Request::fromPost()->getStringParameter('config_nonce', ''));

        $client = ProviderGoogle::getInstance()->getClient();

        // Only unreadable credentials may be wiped this way, so a replayed or stale request cannot
        // disconnect a working account
        if ($client->hasUnreadableCredentials()) {
            $client->deleteStoredCredentials();
        }

        $this->redirectToConfigureAction('configureGoogle');
    }

    public function forwardToAuth()
    {
        Piwik::checkUserHasSomeAdminAccess();

        Nonce::checkNonce('SEKP.google.auth', Common::getRequestVar('auth_nonce'));

        $client = ProviderGoogle::getInstance()->getClient();
        $state = Nonce::getNonce(self::OAUTH_STATE_NONCE_NAME, 900);

        Url::redirectToUrl($client->createAuthUrl($state));
    }

    protected function getSession()
    {
        return new SessionNamespace('searchperformance');
    }

    /**
     * Processes the response from google oauth service
     *
     * @return string
     * @throws \Exception
     */
    public function processAuthCode()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $error     = Common::getRequestVar('error', '');
        $oauthCode = Common::getRequestVar('code', '');

        if (!$error) {
            $state = Common::getRequestVar('state');
            if ($state && !empty($_SERVER['HTTP_REFERER']) && stripos($_SERVER['HTTP_REFERER'], 'https://accounts.google.') === 0) {
                //We need tp update this, else it will fail for referer like https://accounts.google.co.in
                $_SERVER['HTTP_REFERER'] = 'https://accounts.google.com';
            }
            try {
                Nonce::checkNonce(static::OAUTH_STATE_NONCE_NAME, $state, defined('PIWIK_TEST_MODE') ? null : 'google.com');
            } catch (\Exception $ex) {
                $error = $ex->getMessage();
            }
        }

        if ($error) {
            return $this->configureGoogle(true);
        }

        try {
            ProviderGoogle::getInstance()->getClient()->processAuthCode($oauthCode);
        } catch (\Exception $e) {
            return $this->configureGoogle($e->getMessage());
        }

        // we need idSite in the url to display all the menus like Conversion Import after redirect
        $siteInfo = $this->getCurrentSite();
        // reload index action to prove everything is configured
        Url::redirectToUrl(Url::getCurrentUrlWithoutQueryString() . Url::getCurrentQueryStringWithParametersModified([
                'action' => 'configureGoogle',
                'idSite' => (isset($siteInfo['id']) ? $siteInfo['id'] : 0),
                'code'   => null,
                'scope'   => null,
                'state'   => null
            ]));
    }
    /******************************************************************************************
     *****************************************************************************************/

    /*****************************************************************************************
     *****************************************************************************************
     * Configuration actions for Bing provider
     */

    /**
     * Show configuration page for Bing
     *
     * @return string
     */
    public function configureBing()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $viewVariables           = [];
        $viewVariables['apikey'] = '';
        $bingClient              = ProviderBing::getInstance()->getClient();

        $apiKey = Common::getRequestVar('apikey', '');

        if (!empty($apiKey)) {
            Nonce::checkNonce('SEKP.bing.config', Common::getRequestVar('config_nonce'));
            try {
                $bingClient->testConfiguration($apiKey);
                $bingClient->addAccount($apiKey, Piwik::getCurrentUserLogin());

                $notification          = new Notification(
                    Piwik::translate('SearchEngineKeywordsPerformance_BingAccountConnected')
                );
                $notification->context = Notification::CONTEXT_SUCCESS;
                Notification\Manager::notify('bingAccountAdded', $notification);
            } catch (\Exception $e) {
                $viewVariables['error'] = $e->getMessage();
                $viewVariables['apikey'] = $apiKey;
            }
        }

        $hasCredentialsError = $bingClient->hasUnreadableCredentials();

        // These all read the stored accounts before they write, so they would throw rather than do
        // anything useful while the credentials cannot be decrypted
        if (!$hasCredentialsError) {
            $this->addBingSiteConfigIfProvided();
            $this->removeBingSiteConfigIfProvided();
            $this->removeBingAccountIfProvided();
        }

        $urlOptions = [];
        $accounts   = [];
        try {
            $accounts = $bingClient->getAccounts();
        } catch (SecretConfigurationException $e) {
            $this->notifySecretConfigurationError($e, 'bingSecretConfigError');
        }

        $allAccounts               = $accounts;
        $accounts                  = $this->removeAccountsNotOwnedByCurrentUser($accounts);
        $countOfAccountsWithAccess = count($accounts);

        foreach ($accounts as &$account) {
            $account['urls']              = [];
            $account['hasAccess']         = true;
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            try {
                $bingClient->testConfiguration($account['apiKey']);
            } catch (\Exception $e) {
                $account['hasError'] = Piwik::translate('SearchEngineKeywordsPerformance_BingAccountConnectionError');
                continue;
            }

            $account['urls'] = $bingClient->getAvailableUrls($account['apiKey'], false);

            foreach ($bingClient->getAvailableUrls($account['apiKey']) as $url => $status) {
                $urlOptions[$account['apiKey'] . '##' . $url] = $url . ' (' . $this->redactKey($account['apiKey']) . ')';
            }
        }
        unset($account);

        $accounts += $this->buildPlaceholdersForAccountsNotOwned(
            $allAccounts,
            $accounts,
            ProviderBing::getInstance()->getConfiguredSiteIds(),
            'bingSiteUrl',
            self::REDACT_MAPPING_PROVIDE_WISE['Bing']['length']
        );

        $viewVariables['nonce']                 = Nonce::getNonce('SEKP.bing.config');
        $viewVariables['accounts']              = $accounts;
        $viewVariables['urlOptions']            = $urlOptions;
        $viewVariables['configuredMeasurables'] = ProviderBing::getInstance()->getConfiguredSiteIds();
        $viewVariables['sitesInfos']            = [];
        $viewVariables['currentSite']           = $this->getCurrentSite();
        $viewVariables['countOfAccountsWithAccess'] = $countOfAccountsWithAccess;
        $viewVariables['addBingSiteConfigNonce'] = Nonce::getNonce(self::BING_ADD_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeBingSiteConfigNonce'] = Nonce::getNonce(self::BING_REMOVE_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeBingAccountNonce'] = Nonce::getNonce(self::BING_REMOVE_ACCOUNT_NONCE_KEY);
        $viewVariables['hasCredentialsError']   = $hasCredentialsError;
        $viewVariables['resetCredentialsUrl']   = Url::getCurrentQueryStringWithParametersModified(['action' => 'resetBingCredentials']);

        // A site can still be mapped when the provider is force-enabled, and validating it reads the
        // access token, which cannot be decrypted either
        $siteIds = $hasCredentialsError ? [] : $viewVariables['configuredMeasurables'];

        foreach ($siteIds as $siteId => $config) {
            $viewVariables['sitesInfos'][$siteId] = Site::getSite($siteId);
            $lastRun                              = Option::get('BingImporterTask_LastRun_' . $siteId);

            if ($lastRun) {
                $lastRun = date('Y-m-d H:i', $lastRun) . ' UTC';
            } else {
                $lastRun = Piwik::translate('General_Never');
            }

            $viewVariables['sitesInfos'][$siteId]['lastRun'] = $lastRun;

            $bingSiteUrl = $config['bingSiteUrl'];
            [$apiKey, $url] = explode('##', $bingSiteUrl, 2);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $bingClient->testConfiguration($apiKey);
            } catch (UnknownAPIException | RateLimitApiException $e) {
                // Only the two explicitly retryable failures mean "we could not check". Everything
                // else -- a rejected key, an unparseable body, an error code we do not classify --
                // stays an authentication failure, which is what it has always reported.
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = true;
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            $urls = $bingClient->getAvailableUrls($apiKey);

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = key_exists($url, $urls);
            // Bing can reach this while accountValid stays true: testConfiguration() only rejects an
            // empty payload, not a malformed one. Rendered ahead of urlValid so an API we could not
            // reach is never reported as either a bad url or a healthy one.
            $viewVariables['sitesInfos'][$siteId]['urlNotVerifiable'] =
                !ProviderBing::getInstance()->isConfiguredUrlVerifiable($bingSiteUrl);
        }
        $viewVariables['providerName'] = ProviderBing::getInstance()->getName();
        $mappingToPick = self::REDACT_MAPPING_PROVIDE_WISE['Bing'];
        $viewVariables['configuredMeasurables'] = $this->redactMeasurableDataIfRequired($mappingToPick['key'], $viewVariables['configuredMeasurables'], $mappingToPick['length']);

        return $this->renderTemplate('bing\configuration', $viewVariables);
    }

    /**
     * Save Bing configuration for a site if given in request
     */
    protected function addBingSiteConfigIfProvided()
    {
        $bingSiteId        = Common::getRequestVar('bingSiteId', '');
        $bingAccountAndUrl = Common::getRequestVar('bingAccountAndUrl', '');

        if (!empty($bingSiteId) && !empty($bingAccountAndUrl)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::BING_ADD_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('addSiteConfigNonce', ''));
            // The site id is read as a string, and the check below resolves it differently than the
            // writes further down would. Resolve it once so both act on the same site.
            $bingSiteId = (int) $bingSiteId;
            // The site id comes from the request and the writes below raise the write permission on
            // the settings explicitly, so nothing else in this path checks that the current user may
            // configure this particular site.
            Piwik::checkUserHasAdminAccess($bingSiteId);
            // Do not allow to configure websites with unsupported type or force enabled config
            if (SearchEngineKeywordsPerformance::isBingForceEnabled($bingSiteId) || WebsiteMeasurableType::ID !== Site::getTypeFor($bingSiteId)) {
                $notification          = new Notification(
                    Piwik::translate('SearchEngineKeywordsPerformance_WebsiteTypeUnsupported', [
                        Site::getNameFor($bingSiteId)
                    ])
                );

                if (class_exists('\Piwik\Plugins\RollUpReporting\Type') && \Piwik\Plugins\RollUpReporting\Type::ID === Site::getTypeFor($bingSiteId)) {
                    $notification->message .= '<br />' . Piwik::translate('SearchEngineKeywordsPerformance_WebsiteTypeUnsupportedRollUp');
                }

                $notification->context = Notification::CONTEXT_ERROR;
                $notification->raw     = true;
                $notification->flags   = Notification::FLAG_CLEAR;
                Notification\Manager::notify('websiteNotConfigurable', $notification);

                return;
            }

            $measurableSettings = new MeasurableSettings($bingSiteId);
            // The marker is not writable through the settings API, so this path raises the permission
            // explicitly before recording the current user as the owner of the configuration.
            $measurableSettings->bingConfigCreatedBy->setIsWritableByCurrentUser(true);
            $measurableSettings->bingConfigCreatedBy->setValue(Piwik::getCurrentUserLogin());

            //Need to explicitly setIsWritableByCurrentUser=true, since it can be set as false when we  instantiate MeasurableSettings object due to previously added by another user
            $measurableSettings->bingSiteUrl->setIsWritableByCurrentUser(true);

            $measurableSettings->bingSiteUrl->setValue($bingAccountAndUrl);
            $measurableSettings->save();

            $notification          = new Notification(
                Piwik::translate('SearchEngineKeywordsPerformance_WebsiteSuccessfulConfigured', [
                    Site::getNameFor($bingSiteId),
                    '<a href="' . Url::addCampaignParametersToMatomoLink('https://matomo.org/guide/installation-maintenance/import-search-keywords/') . '">',
                    '</a>'
                ])
            );
            $notification->context = Notification::CONTEXT_SUCCESS;
            $notification->raw     = true;
            $notification->flags   = Notification::FLAG_CLEAR;
            Notification\Manager::notify('websiteConfigured', $notification);
        }
    }

    /**
     * Removes a Bing account if `remove` param is given in request
     */
    protected function removeBingAccountIfProvided()
    {
        $remove = Common::getRequestVar('remove', '');

        if (!empty($remove)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::BING_REMOVE_ACCOUNT_NONCE_KEY, $request->getStringParameter('removeAccountNonce', ''));
            ProviderBing::getInstance()->getClient()->removeAccount($remove);

            $sitesWithConfig = ProviderBing::getInstance()->getConfiguredSiteIds();
            foreach ($sitesWithConfig as $siteId => $siteConfig) {
                $bingSetting = explode('##', $siteConfig['bingSiteUrl'], 2);
                if (!empty($bingSetting[0]) && $bingSetting[0] == $remove) {
                    $config = new MeasurableSettings($siteId);
                    $config->bingSiteUrl->setValue('0');
                    $config->save();
                }
            }
        }
    }

    /**
     * Deletes the Bing credentials that can no longer be decrypted, so the customer can connect an
     * account again without deleting rows from the option table by hand.
     */
    public function resetBingCredentials()
    {
        Piwik::checkUserHasSuperUserAccess();
        $this->checkTokenInUrl();

        // read from the POST body only, so a nonce that leaked into a URL cannot delete anything
        Nonce::checkNonce('SEKP.bing.config', \Piwik\Request::fromPost()->getStringParameter('config_nonce', ''));

        $client = ProviderBing::getInstance()->getClient();

        // Only unreadable credentials may be wiped this way, so a replayed or stale request cannot
        // disconnect a working account
        if ($client->hasUnreadableCredentials()) {
            $client->deleteStoredCredentials();
        }

        $this->redirectToConfigureAction('configureBing');
    }

    /**
     * Removes a Bing site config if `removeConfig` param is given in request
     */
    protected function removeBingSiteConfigIfProvided()
    {
        $removeConfig = Common::getRequestVar('removeConfig', '');

        if (!empty($removeConfig)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::BING_REMOVE_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('removeSiteConfigNonce', ''));
            $measurableSettings = new MeasurableSettings($removeConfig);
            $measurableSettings->bingSiteUrl->setValue('0');
            $measurableSettings->save();
        }
    }
    /******************************************************************************************
     *****************************************************************************************/


    /*****************************************************************************************
     *****************************************************************************************
     * Configuration actions for Yandex provider
     */

    /**
     * Show Yandex configuration page
     *
     * @param bool $hasOAuthError indicates if a oAuth access error occurred
     * @return string
     */
    public function configureYandex($hasOAuthError = false)
    {
        Piwik::checkUserHasSomeAdminAccess();

        $configSaved = $this->configureYandexClientIfProvided();

        if (true === $configSaved) {
            $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigImported'));
            $notification->context = Notification::CONTEXT_SUCCESS;
            Notification\Manager::notify('clientConfigSaved', $notification);
        } elseif (false === $configSaved) {
            $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigSaveErrorNew'));
            $notification->context = Notification::CONTEXT_ERROR;
            Notification\Manager::notify('clientConfigSaved', $notification);
        }

        $yandexClient     = ProviderYandex::getInstance()->getClient();
        $clientConfigured = $yandexClient->isClientConfigured();

        $hasUnreadableAccounts = $yandexClient->hasUnreadableAccounts();
        $hasCredentialsError = $hasUnreadableAccounts || $yandexClient->hasUnreadableClientConfig();

        // These all read the stored accounts before they write, so they would throw rather than do
        // anything useful while the accounts cannot be decrypted
        if (!$hasUnreadableAccounts) {
            $this->addYandexSiteConfigIfProvided();
            $this->removeYandexSiteConfigIfProvided();
            $this->removeYandexAccountIfProvided();
        }

        $urlOptions = [];
        $accounts   = [];
        try {
            $accounts = $yandexClient->getAccounts();
        } catch (SecretConfigurationException $e) {
            // only the accounts are unreadable here; the client config is read separately below
            $this->notifySecretConfigurationError($e, 'yandexSecretConfigError');
        }

        // Whether an account is connected at all decides whether the measurable configuration is
        // shown, and a site can be mapped to an account owned by somebody else, so this counts every
        // stored account - unlike the account records, which are limited to their owner below.
        $hasAnyAccount             = count($accounts) > 0;
        $allAccounts               = $accounts;
        $accounts                  = $this->removeAccountsNotOwnedByCurrentUser($accounts);
        $countOfAccountsWithAccess = count($accounts);

        foreach ($accounts as $id => &$account) {
            $userInfo                     = $yandexClient->getUserInfo($id);
            $account['urls']              = [];
            $account['picture']           = $userInfo['picture'];
            $account['name']              = $userInfo['name'];
            $account['hasAccess']         = true;
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            $account['authDaysAgo']       = floor((time() - $account['created']) / (3600 * 24));

            try {
                $yandexClient->testConfiguration($id);
            } catch (\Exception $e) {
                $account['hasError'] = Piwik::translate('SearchEngineKeywordsPerformance_YandexAccountConnectionError', [$e->getMessage()]);
                continue;
            }

            $account['urls'] = $yandexClient->getAvailableUrls($id, false);

            foreach ($yandexClient->getAvailableUrls($id) as $url => $hostData) {
                $urlOptions[$id . '##' . $hostData['host_id']] = $url . ' (' . $account['name'] . ')';
            }
        }
        unset($account);

        $accounts += $this->buildPlaceholdersForAccountsNotOwned(
            $allAccounts,
            $accounts,
            ProviderYandex::getInstance()->getConfiguredSiteIds(),
            'yandexAccountAndHostId',
            self::REDACT_MAPPING_PROVIDE_WISE['Yandex']['length']
        );

        $clientConfig                           = [];
        try {
            $clientConfig = $yandexClient->getClientConfig() ?: [];
        } catch (SecretConfigurationException $e) {
            $clientConfigured = false;
            $this->notifySecretConfigurationError($e, 'yandexSecretClientError');
        }
        $viewVariables                          = [];
        $viewVariables['isConfigured']          = $yandexClient->isConfigured();
        $viewVariables['auth_nonce']            = Nonce::getNonce('SEKP.yandex.auth');
        $viewVariables['clientId']              = isset($clientConfig['id']) ? $clientConfig['id'] : '';
        $viewVariables['clientSecret']          = preg_replace('/\w/', '*', isset($clientConfig['secret']) ? $clientConfig['secret'] : '');
        $viewVariables['isClientConfigured']    = $clientConfigured;
        $viewVariables['isOAuthConfigured']     = $hasAnyAccount;
        $viewVariables['accounts']              = $accounts;
        $viewVariables['urlOptions']            = $urlOptions;
        $viewVariables['hasOAuthError']         = $hasOAuthError;
        $viewVariables['configuredMeasurables'] = ProviderYandex::getInstance()->getConfiguredSiteIds();
        $viewVariables['nonce']                 = Nonce::getNonce('SEKP.yandex.config');
        $viewVariables['addYandexSiteConfigNonce'] = Nonce::getNonce(self::YANDEX_ADD_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeYandexSiteConfigNonce'] = Nonce::getNonce(self::YANDEX_REMOVE_SITE_CONFIG_NONCE_KEY);
        $viewVariables['removeYandexAccountNonce'] = Nonce::getNonce(self::YANDEX_REMOVE_ACCOUNT_NONCE_KEY);
        $viewVariables['sitesInfos']            = [];
        $viewVariables['currentSite']           = $this->getCurrentSite();
        $viewVariables['countOfAccountsWithAccess'] = $countOfAccountsWithAccess;
        $viewVariables['hasCredentialsError']   = $hasCredentialsError;
        $viewVariables['resetCredentialsUrl']   = Url::getCurrentQueryStringWithParametersModified(['action' => 'resetYandexCredentials']);
        $viewVariables['removeClientConfigUrl'] = Url::getCurrentQueryStringWithParametersModified(['action' => 'removeYandexClientConfig']);

        // A site can still be mapped when the provider is force-enabled, and validating it reads the
        // access token, which is stored with the accounts
        $siteIds = $hasUnreadableAccounts ? [] : $viewVariables['configuredMeasurables'];

        foreach ($siteIds as $siteId => $config) {
            $viewVariables['sitesInfos'][$siteId] = Site::getSite($siteId);
            $lastRun                              = Option::get('YandexImporterTask_LastRun_' . $siteId);

            if ($lastRun) {
                $lastRun = date('Y-m-d H:i', $lastRun) . ' UTC';
            } else {
                $lastRun = Piwik::translate('General_Never');
            }

            $viewVariables['sitesInfos'][$siteId]['lastRun'] = $lastRun;

            $yandexAccountAndHostId = $config['yandexAccountAndHostId'];
            [$accountId, $url] = explode('##', $yandexAccountAndHostId, 2);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $yandexClient->testConfiguration($accountId);
            } catch (UnknownAPIException | RateLimitApiException $e) {
                // Only the two explicitly retryable failures mean "we could not check". Everything
                // else -- a rejected key, an unparseable body, an error code we do not classify --
                // stays an authentication failure, which is what it has always reported.
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = true;
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            try {
                $urls = $yandexClient->getAvailableUrls($accountId);
            } catch (\Exception $e) {
                $urls = [];
            }

            $urlValid = false;

            foreach ($urls as $data) {
                if ($data['host_id'] == $url) {
                    $urlValid = true;
                }
            }

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = $urlValid;
            // testConfiguration() returns true for any payload getHosts() does not throw on, so a
            // response carrying no host list leaves the account looking healthy while the
            // enumeration is flagged. Rendered ahead of urlValid, as for Bing.
            $viewVariables['sitesInfos'][$siteId]['urlNotVerifiable'] =
                !ProviderYandex::getInstance()->isConfiguredUrlVerifiable($yandexAccountAndHostId);
        }

        if (!empty($this->securityPolicy)) {
            $this->securityPolicy->addPolicy('img-src', 'avatars.yandex.net');
        }

        $viewVariables['baseUrl'] = Url::getCurrentUrlWithoutQueryString();
        $viewVariables['baseDomain'] = Url::getCurrentScheme() . '://' . Url::getCurrentHost();
        $viewVariables['providerName'] = ProviderYandex::getInstance()->getName();
        $mappingToPick = self::REDACT_MAPPING_PROVIDE_WISE['Yandex'];
        $viewVariables['configuredMeasurables'] = $this->redactMeasurableDataIfRequired($mappingToPick['key'], $viewVariables['configuredMeasurables'], $mappingToPick['length']);

        return $this->renderTemplate('yandex\configuration', $viewVariables);
    }

    /**
     * Save Yandex configuration if set in request
     *
     * @return bool|null  bool on success or failure, null if not data present in request
     */
    protected function configureYandexClientIfProvided()
    {
        $clientId     = Common::getRequestVar('clientid', '');
        $clientSecret = Common::getRequestVar('clientsecret', '');

        if (!empty($clientSecret) || !empty($clientId)) {
            // The client configuration is stored once for the whole instance, so it is a super user
            // setting, the same as the Google client configuration handled above
            Piwik::checkUserHasSuperUserAccess();
            Nonce::checkNonce('SEKP.yandex.config', Common::getRequestVar('config_nonce'));

            $clientUpdated = false;

            if (!empty($clientSecret) && !empty($clientId)) {
                $yandexClient = ProviderYandex::getInstance()->getClient();

                // The form is only offered while no client is configured, and that condition has to
                // hold on the server as well. A stored client is replaced through the removal action
                if ($yandexClient->isClientConfigured()) {
                    $notification          = new Notification(
                        Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigAlreadyExists')
                    );
                    $notification->context = Notification::CONTEXT_ERROR;
                    Notification\Manager::notify('clientConfigSaved', $notification);

                    return null;
                }

                $yandexClient->setClientConfig($clientId, $clientSecret);
                $clientUpdated = true;
            }

            return $clientUpdated;
        }

        return null;
    }

    /**
     * Save yandex configuration for a site if given in request
     */
    protected function addYandexSiteConfigIfProvided()
    {
        $yandexSiteId           = Common::getRequestVar('yandexSiteId', '');
        $yandexAccountAndHostId = Common::getRequestVar('yandexAccountAndHostId', '');

        if (!empty($yandexSiteId) && !empty($yandexAccountAndHostId)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::YANDEX_ADD_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('addSiteConfigNonce', ''));
            // The site id is read as a string, and the check below resolves it differently than the
            // writes further down would. Resolve it once so both act on the same site.
            $yandexSiteId = (int) $yandexSiteId;
            // The site id comes from the request and the writes below raise the write permission on
            // the settings explicitly, so nothing else in this path checks that the current user may
            // configure this particular site.
            Piwik::checkUserHasAdminAccess($yandexSiteId);
            $measurableSettings = new MeasurableSettings($yandexSiteId);
            // The marker is not writable through the settings API, so this path raises the permission
            // explicitly before recording the current user as the owner of the configuration.
            $measurableSettings->yandexConfigCreatedBy->setIsWritableByCurrentUser(true);
            $measurableSettings->yandexConfigCreatedBy->setValue(Piwik::getCurrentUserLogin());

            //Need to explicitly setIsWritableByCurrentUser=true, since it can be set as false when we  instantiate MeasurableSettings object due to previously added by another user
            $measurableSettings->yandexAccountAndHostId->setIsWritableByCurrentUser(true);

            $measurableSettings->yandexAccountAndHostId->setValue($yandexAccountAndHostId);

            $measurableSettings->save();

            $notification          = new Notification(
                Piwik::translate('SearchEngineKeywordsPerformance_WebsiteSuccessfulConfigured', [
                    Site::getNameFor($yandexSiteId),
                    '<a href="' . Url::addCampaignParametersToMatomoLink('https://matomo.org/guide/installation-maintenance/import-search-keywords/') . '">',
                    '</a>'
                ])
            );
            $notification->context = Notification::CONTEXT_SUCCESS;
            $notification->raw     = true;
            $notification->flags   = Notification::FLAG_CLEAR;
            Notification\Manager::notify('websiteConfigured', $notification);
        }
    }

    /**
     * Removes a Yandex account if `remove` param is given in request
     */
    protected function removeYandexAccountIfProvided()
    {
        $remove = Common::getRequestVar('remove', '');

        if (!empty($remove)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::YANDEX_REMOVE_ACCOUNT_NONCE_KEY, $request->getStringParameter('removeAccountNonce', ''));
            ProviderYandex::getInstance()->getClient()->removeAccount($remove);

            $sitesWithConfig = ProviderYandex::getInstance()->getConfiguredSiteIds();
            foreach ($sitesWithConfig as $siteId => $siteConfig) {
                $yandexSetting = explode('##', $siteConfig['yandexAccountAndHostId'], 2);
                if (!empty($yandexSetting[0]) && $yandexSetting[0] == $remove) {
                    $config = new MeasurableSettings($siteId);
                    $config->yandexAccountAndHostId->setValue('0');
                    $config->save();
                }
            }
        }
    }

    /**
     * Deletes the stored Yandex client config, so the customer can set up a different OAuth
     * application when the configured one no longer works.
     */
    public function removeYandexClientConfig()
    {
        Piwik::checkUserHasSuperUserAccess();
        $this->checkTokenInUrl();

        // read from the POST body only, so a nonce that leaked into a URL cannot delete anything
        Nonce::checkNonce('SEKP.yandex.config', \Piwik\Request::fromPost()->getStringParameter('config_nonce', ''));

        ProviderYandex::getInstance()->getClient()->deleteClientConfig();

        $this->redirectToConfigureAction('configureYandex');
    }

    /**
     * Deletes the Yandex credentials that can no longer be decrypted, so the customer can connect an
     * account again without deleting rows from the option table by hand.
     */
    public function resetYandexCredentials()
    {
        Piwik::checkUserHasSuperUserAccess();
        $this->checkTokenInUrl();

        // read from the POST body only, so a nonce that leaked into a URL cannot delete anything
        Nonce::checkNonce('SEKP.yandex.config', \Piwik\Request::fromPost()->getStringParameter('config_nonce', ''));

        $client = ProviderYandex::getInstance()->getClient();

        // Only unreadable credentials may be wiped this way, so a replayed or stale request cannot
        // disconnect a working account
        if ($client->hasUnreadableCredentials()) {
            $client->deleteStoredCredentials();
        }

        $this->redirectToConfigureAction('configureYandex');
    }

    /**
     * Removes a Yandex site config if `removeConfig` param is given in request
     */
    protected function removeYandexSiteConfigIfProvided()
    {
        $removeConfig = Common::getRequestVar('removeConfig', '');

        if (!empty($removeConfig)) {
            $request = \Piwik\Request::fromRequest();
            Nonce::checkNonce(self::YANDEX_REMOVE_SITE_CONFIG_NONCE_KEY, $request->getStringParameter('removeSiteConfigNonce', ''));
            $measurableSettings = new MeasurableSettings($removeConfig);
            $measurableSettings->yandexAccountAndHostId->setValue('0');
            $measurableSettings->save();
        }
    }


    public function forwardToYandexAuth()
    {
        Piwik::checkUserHasSomeAdminAccess();

        Nonce::checkNonce('SEKP.yandex.auth', Common::getRequestVar('auth_nonce'));

        $session = $this->getSession();
        $session->yandexauthtime = time() + 60 * 15;

        $state = Nonce::getNonce(self::YANDEX_OAUTH_STATE_NONCE_NAME, 900);

        Url::redirectToUrl(ProviderYandex::getInstance()->getClient()->createAuthUrl($state));
    }

    /**
     * Returns the Yandex OAuth domain the current request was referred from, or null if it was not
     * referred from one of them.
     */
    private function getYandexReferrerHost(): ?string
    {
        $referrer = Url::getReferrer();

        foreach (self::YANDEX_OAUTH_REFERRER_HOSTS as $host) {
            if (Nonce::isReferrerHostValid($referrer, $host)) {
                return $host;
            }
        }

        return null;
    }

    /**
     * Processes an auth code given by Yandex
     */
    public function processYandexAuthCode()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $error     = Common::getRequestVar('error', '');
        $oauthCode = Common::getRequestVar('code', '');
        $session   = $this->getSession();
        $timeLimit = $session->yandexauthtime;

        // The window is only good for the response it was opened for
        unset($session->yandexauthtime);

        // if the auth wasn't triggered within the allowed time frame
        if (!$timeLimit || time() > $timeLimit) {
            $error = true;
        }

        if (!$error) {
            try {
                // Ties the response to the request this Matomo sent. Nonce::checkNonce() rejects any
                // referrer that is not local unless a host is allowed explicitly, and the callback
                // arrives from one of Yandex's regional OAuth domains. See the Google callback above,
                // which names the host it expects for the same reason.
                Nonce::checkNonce(
                    self::YANDEX_OAUTH_STATE_NONCE_NAME,
                    Common::getRequestVar('state', ''),
                    $this->getYandexReferrerHost()
                );
            } catch (\Exception $e) {
                $error = $e->getMessage();
            }
        }

        if ($error) {
            return $this->configureYandex(true);
        }

        try {
            ProviderYandex::getInstance()->getClient()->processAuthCode($oauthCode);
        } catch (\Exception $e) {
            return $this->configureYandex($e->getMessage());
        }

        $notification          = new Notification(
            Piwik::translate('SearchEngineKeywordsPerformance_YandexAccountOk')
        );
        $notification->context = Notification::CONTEXT_SUCCESS;
        Notification\Manager::notify('yandexAccountConnected', $notification);

        // we need idSite in the url to display all the menus like Conversion Import after redirect
        $siteInfo = $this->getCurrentSite();

        // reload index action to prove everything is configured
        Url::redirectToUrl(Url::getCurrentUrlWithoutQueryString() . Url::getCurrentQueryStringWithParametersModified([
                'action' => 'configureYandex',
                'idSite' => (isset($siteInfo['id']) ? $siteInfo['id'] : 0),
                'code'   => null
            ]));
    }

    /**
     * Get the map of component extensions to be passed into the Vue template. This allows other plugins to provide
     * content to display in the template. In this case this plugin will display one component, but that can be
     * overridden by the ConnectAccounts plugin to display a somewhat different component. This is doing something
     * similar to what we use {{ postEvent('MyPlugin.MyEventInATemplate) }} for in Twig templates.
     *
     * @return array Map of component extensions. Like [ 'plugin' => 'PluginName', 'component' => 'ComponentName' ]
     * See {@link https://developer.matomo.org/guides/in-depth-vue#allowing-plugins-to-add-content-to-your-vue-components the developer documentation} for more information.
     */
    public static function getComponentExtensions(): array
    {
        $componentExtensions = [];
        Piwik::postEvent('SearchEngineKeywordsPerformance.getGoogleConfigComponentExtensions', [
            &$componentExtensions
        ]);
        return $componentExtensions;
    }

    /**
     * Removes the accounts the current user is not entitled to from the given account map
     *
     * A provider account belongs to the single user who connected it, but the configuration pages
     * are open to every user with admin access to at least one site, and they render the whole
     * account map into the page. Redacting the credential and keeping the rest of the record still
     * discloses the owner's login and the property inventory fetched with their access token, and
     * such a list has to be revisited every time a field is added, so a record the current user
     * does not own is dropped in full instead.
     *
     * @param array $accounts account map as stored by the provider client, keyed by account
     *                        identifier and each holding at least a `username`
     * @return array the accounts owned by the current user, or all of them for a super user
     */
    private function removeAccountsNotOwnedByCurrentUser(array $accounts): array
    {
        foreach ($accounts as $id => $account) {
            // accounts stored without an owner are nobody's, so they stay limited to super users
            if (!Piwik::hasUserSuperUserAccessOrIsTheUser($account['username'] ?? '')) {
                unset($accounts[$id]);
            }
        }

        return $accounts;
    }

    /**
     * Returns stand-in records for the accounts the current user is not entitled to
     *
     * A configured measurable references the account it is mapped to, and the settings page resolves
     * that reference against the account map to render the site's row. A site the current user
     * administers has to keep showing its configuration even when somebody else connected the
     * account, so a stand-in takes the place of the record, keyed by the same redacted identifier
     * that redactMeasurableDataIfRequired() writes into the measurable data.
     *
     * The stand-in carries only the fields that row reads, all of them empty: the owner's login,
     * their provider profile and their property inventory stay with the record that was dropped.
     *
     * Only the accounts a visible measurable actually maps to get one. getConfiguredSiteIds() covers
     * the sites the current user administers, so an account nothing they administer is mapped to
     * stays absent entirely rather than being announced through a redacted identifier.
     *
     * @param array $allAccounts every stored account
     * @param array $ownedAccounts the accounts the current user is entitled to
     * @param array $configuredMeasurables getConfiguredSiteIds() for this provider
     * @param string $mappingKey the measurable setting holding `accountIdentifier##url`
     * @param int $redactLength has to match the length used for this provider's measurable data,
     *                          otherwise the reference no longer resolves
     * @return array stand-ins keyed by the redacted account identifier
     */
    private function buildPlaceholdersForAccountsNotOwned(
        array $allAccounts,
        array $ownedAccounts,
        array $configuredMeasurables,
        string $mappingKey,
        int $redactLength
    ): array {
        $mappedAccountIds = [];
        foreach ($configuredMeasurables as $measurable) {
            if (empty($measurable[$mappingKey])) {
                continue;
            }
            [$mappedAccountIds[]] = explode('##', (string) $measurable[$mappingKey], 2);
        }

        $placeholders = [];

        foreach ($allAccounts as $id => $account) {
            if (array_key_exists($id, $ownedAccounts) || !in_array((string) $id, $mappedAccountIds, true)) {
                continue;
            }

            $redactedId = $this->redactKey((string) $id, $redactLength);
            $placeholders[$redactedId] = [
                'apiKey'    => $redactedId,
                'name'      => '',
                'urls'      => [],
                'hasAccess' => false,
            ];
        }

        return $placeholders;
    }

    /**
     * @param string $apiKey
     * @return string
     */
    private function redactKey(
        #[\SensitiveParameter]
        string $apiKey,
        int $length = 5
    ) {
        return substr($apiKey, 0, $length) . '*****' . substr($apiKey, ($length * -1), $length);
    }

    /**
     * @param string $key
     * @param array $measurableInfo
     * @return array
     */
    private function redactMeasurableDataIfRequired(string $key, array $measurableInfo, int $redactLength = 5)
    {
        if (!empty($measurableInfo)) {
            foreach ($measurableInfo as &$value) {
                if (!empty($value['isDeletionAllowed'])) {
                    continue;
                }
                // The creator is a login and therefore identifies a user account, so it only goes to
                // those entitled to the mapping. For everybody else the row reads as having an unknown
                // creator, the same as a mapping written before the marker existed.
                $value['createdByUser'] = '';
                if ($value[$key]) {
                    list($apiKey, $url) = explode('##', $value[$key], 2);
                    $value[$key] = $this->redactKey($apiKey, $redactLength) . '##' . $url;
                }
            }
        }
        return $measurableInfo;
    }

    /**
     * Logs a decryption failure and shows it on the settings page. Without the log entry the only
     * trace of a lost encryption key is a transient notification the customer has to catch.
     *
     * A settings page reads the credentials more than once, and the default log_writers includes
     * "screen", so reporting every catch would stack several copies of the same banner.
     */
    private function notifySecretConfigurationError(SecretConfigurationException $e, string $notificationId): void
    {
        if ($this->secretConfigurationErrorReported) {
            return;
        }

        $this->secretConfigurationErrorReported = true;

        // ignoreInScreenWriter keeps the default screen log writer from rendering the message as a
        // second banner next to the notification below
        StaticContainer::get(LoggerInterface::class)->error('[SearchEngineKeywordsPerformance] {message}', [
            'message'              => $e->getMessage(),
            'ignoreInScreenWriter' => true,
        ]);

        $notification          = new Notification($e->getMessage());
        $notification->context = Notification::CONTEXT_ERROR;
        $notification->type    = Notification::TYPE_TRANSIENT;
        Notification\Manager::notify($notificationId, $notification);
    }

    private function redirectToConfigureAction(string $action): void
    {
        Url::redirectToUrl(Url::getCurrentUrlWithoutQueryString() . Url::getCurrentQueryStringWithParametersModified([
            'action' => $action,
            'code'   => null,
            'scope'  => null,
            'state'  => null,
            'error'  => null,
        ]));
    }
}
