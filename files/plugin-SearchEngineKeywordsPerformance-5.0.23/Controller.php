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
    public const GOOGLE_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.google.add.site_config';
    public const GOOGLE_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.google.remove.site_config';
    public const GOOGLE_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.google.remove.account';
    public const BING_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.bing.add.site_config';
    public const BING_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.bing.remove.site_config';
    public const BING_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.bing.remove.account';
    public const YANDEX_ADD_SITE_CONFIG_NONCE_KEY = 'SEKP.yandex.add.site_config';
    public const YANDEX_REMOVE_SITE_CONFIG_NONCE_KEY = 'SEKP.yandex.remove.site_config';
    public const YANDEX_REMOVE_ACCOUNT_NONCE_KEY = 'SEKP.yandex.remove.account';

    public function index()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $viewVariables              = [];
        $viewVariables['providers'] = [
            ProviderGoogle::getInstance(),
            ProviderBing::getInstance(),
            ProviderYandex::getInstance(),
        ];

        foreach ($viewVariables['providers'] as $provider) {
            $this->showNotificationIfNoWebsiteConfigured($provider);
        }
        SearchEngineKeywordsPerformance::displayNotificationIfRecentApiErrorsExist($viewVariables['providers']);

        $viewVariables['providers'] = array_map(function (ProviderAbstract $provider) {
            return $this->toProviderArray($provider);
        }, $viewVariables['providers']);

        return $this->renderTemplate('index', $viewVariables);
    }

    private function toProviderArray(ProviderAbstract $provider)
    {
        return [
            'id' => $provider->getId(),
            'is_configured' => $provider->isConfigured(),
            'configured_site_ids' => $provider->getConfiguredSiteIds(),
            'problems' => $provider->getConfigurationProblems(),
            'is_experimental' => $provider->isExperimental(),
            'logos' => $provider->getLogoUrls(),
            'name' => $provider->getName(),
            'description' => $provider->getDescription(),
            'note' => $provider->getNote(),
        ];
    }

    private function showNotificationIfNoWebsiteConfigured(ProviderAbstract $provider)
    {
        if (!$provider->isConfigured()) {
            return;
        }

        if (count($provider->getConfiguredSiteIds()) == 0) {
            $notification          = new Notification(Piwik::translate(
                'SearchEngineKeywordsPerformance_NoWebsiteConfiguredWarning',
                $provider->getName()
            ));
            $notification->context = Notification::CONTEXT_WARNING;
            Notification\Manager::notify($provider->getId() . 'nowebsites', $notification);
        }

        $errors = $provider->getConfigurationProblems();

        if (count($errors['sites'])) {
            $notification          = new Notification(Piwik::translate(
                'SearchEngineKeywordsPerformance_ProviderXSitesWarning',
                [$provider->getName()]
            ));
            $notification->context = Notification::CONTEXT_WARNING;
            $notification->raw     = true;
            Notification\Manager::notify($provider->getId() . 'siteswarning', $notification);
        }

        if (count($errors['accounts'])) {
            $notification          = new Notification(Piwik::translate(
                'SearchEngineKeywordsPerformance_ProviderXAccountWarning',
                [$provider->getName()]
            ));
            $notification->context = Notification::CONTEXT_WARNING;
            $notification->raw     = true;
            Notification\Manager::notify($provider->getId() . 'accountwarning', $notification);
        }
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
            $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigSaveError'));
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

        try {
            $googleClient->getConfiguredClient('');
        } catch (MissingClientConfigException $e) {
            $clientConfigured = false;
        } catch (MissingOAuthConfigException $e) {
            // ignore missing accounts
        } catch (\Exception $e) {
            // Catch any general exceptions because they likely won't be recoverable. Delete the config so that they can try again
            // If we don't delete the config, the customer won't have any way to fix the issue
            $googleClient->deleteClientConfig();

            // Make sure we cancel the success notification because that could confuse the customer since things failed
            Notification\Manager::cancel('clientConfigSaved');

            // Mark the client as not configured and notify the user that something is wrong with the configuration
            $clientConfigured = false;
            $notification = new Notification($e->getMessage());
            $notification->context = Notification::CONTEXT_ERROR;
            $notification->type = Notification::TYPE_TRANSIENT;
            Notification\Manager::notify('configureerror', $notification);
        }

        $this->addGoogleSiteConfigIfProvided();
        $this->removeGoogleSiteConfigIfProvided();
        $this->removeGoogleAccountIfProvided();

        $urlOptions = [];
        $accounts   = $googleClient->getAccounts();
        $countOfAccountsWithAccess = 0;

        foreach ($accounts as $id => &$account) {
            $userInfo                     = $googleClient->getUserInfo($id);
            $urls                         = $googleClient->getAvailableUrls($id, false);
            $account['picture']           = $userInfo['picture'];
            $account['name']              = $userInfo['name'];
            $account['urls']              = $urls;
            $account['hasAccess'] = Piwik::hasUserSuperUserAccessOrIsTheUser($account['username']);
            if ($account['hasAccess']) {
                ++$countOfAccountsWithAccess;
            }
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            try {
                $googleClient->testConfiguration($id);
            } catch (\Exception $e) {
                $account['hasError'] = $e->getMessage();
            }

            if ($account['hasAccess']) {
                foreach ($googleClient->getAvailableUrls($id) as $url => $status) {
                    $urlOptions[$id . '##' . $url] = $url . ' (' . $account['name'] . ')';
                }
            }
        }

        $isClientConfigurable = StaticContainer::get('SearchEngineKeywordsPerformance.Google.isClientConfigurable');

        $viewVariables                          = [];
        $viewVariables['isConfigured']          = $googleClient->isConfigured();
        $viewVariables['clientId']              = $googleClient->getClientId();
        $viewVariables['auth_nonce']            = Nonce::getNonce('SEKP.google.auth');
        $viewVariables['clientSecret']          = preg_replace('/\w/', '*', $googleClient->getClientSecret() ?? '');
        $viewVariables['isClientConfigured']    = $clientConfigured;
        $viewVariables['isClientConfigurable']  = $isClientConfigurable;
        $viewVariables['isOAuthConfigured']     = count($accounts) > 0;
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

        $siteIds = $viewVariables['configuredMeasurables'];

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

            [$accountId, $url] = explode('##', $googleSiteUrl);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $googleClient->testConfiguration($accountId);
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            $urls = $googleClient->getAvailableUrls($accountId);

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = key_exists($url, $urls);
        }

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

        $viewVariables['configureConnectionProps'] = $configureConnectionProps;
        $viewVariables['extensions'] = self::getComponentExtensions();
        $viewVariables['removeConfigUrl'] = Url::getCurrentQueryStringWithParametersModified([ 'action' => 'removeGoogleClientConfig' ]);

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
                $googleSetting = explode('##', $siteConfig['googleSearchConsoleUrl']);
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

        Url::redirectToUrl(Url::getCurrentUrlWithoutQueryString() . Url::getCurrentQueryStringWithParametersModified([
                'action' => 'configureGoogle',
                'code'   => null,
                'scope'   => null,
                'state'   => null,
                'error'   => null,
            ]));
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
            } catch (\Exception $e) {
                $viewVariables['error'] = $e->getMessage();
                $viewVariables['apikey'] = $apiKey;
            }
        }

        $this->addBingSiteConfigIfProvided();
        $this->removeBingSiteConfigIfProvided();
        $this->removeBingAccountIfProvided();

        $urlOptions = [];
        $accounts   = $bingClient->getAccounts();
        $countOfAccountsWithAccess = 0;
        foreach ($accounts as &$account) {
            $account['urls']              = [];
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            $account['hasAccess'] = Piwik::hasUserSuperUserAccessOrIsTheUser($account['username']);
            if ($account['hasAccess']) {
                ++$countOfAccountsWithAccess;
            }
            try {
                $bingClient->testConfiguration($account['apiKey']);
            } catch (\Exception $e) {
                $account['hasError'] = $e->getMessage();
                continue;
            }

            $account['urls'] = $bingClient->getAvailableUrls($account['apiKey'], false);

            if ($account['hasAccess']) {
                foreach ($bingClient->getAvailableUrls($account['apiKey']) as $url => $status) {
                    $urlOptions[$account['apiKey'] . '##' . $url] = $url . ' (' . substr(
                        $account['apiKey'],
                        0,
                        5
                    ) . '*****' . substr($account['apiKey'], -5, 5) . ')';
                }
            }
        }

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

        $siteIds = $viewVariables['configuredMeasurables'];

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
            [$apiKey, $url] = explode('##', $bingSiteUrl);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $bingClient->testConfiguration($apiKey);
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            $urls = $bingClient->getAvailableUrls($apiKey);

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = key_exists($url, $urls);
        }

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
                $bingSetting = explode('##', $siteConfig['bingSiteUrl']);
                if (!empty($bingSetting[0]) && $bingSetting[0] == $remove) {
                    $config = new MeasurableSettings($siteId);
                    $config->bingSiteUrl->setValue('0');
                    $config->save();
                }
            }
        }
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
            $notification          = new Notification(Piwik::translate('SearchEngineKeywordsPerformance_ClientConfigSaveError'));
            $notification->context = Notification::CONTEXT_ERROR;
            Notification\Manager::notify('clientConfigSaved', $notification);
        }

        $yandexClient     = ProviderYandex::getInstance()->getClient();
        $clientConfigured = $yandexClient->isClientConfigured();

        $this->addYandexSiteConfigIfProvided();
        $this->removeYandexSiteConfigIfProvided();
        $this->removeYandexAccountIfProvided();

        $urlOptions = [];
        $accounts   = $yandexClient->getAccounts();
        $countOfAccountsWithAccess = 0;

        foreach ($accounts as $id => &$account) {
            $userInfo                     = $yandexClient->getUserInfo($id);
            $account['urls']              = [];
            $account['picture']           = $userInfo['picture'];
            $account['name']              = $userInfo['name'];
            $account['created_formatted'] = Date::factory(date(
                'Y-m-d',
                $account['created']
            ))->getLocalized(Date::DATE_FORMAT_LONG);
            $account['authDaysAgo']       = floor((time() - $account['created']) / (3600 * 24));
            $account['hasAccess'] = Piwik::hasUserSuperUserAccessOrIsTheUser($account['username']);
            if ($account['hasAccess']) {
                ++$countOfAccountsWithAccess;
            }

            try {
                $yandexClient->testConfiguration($id);
            } catch (\Exception $e) {
                $account['hasError'] = $e->getMessage();
                continue;
            }

            $account['urls'] = $yandexClient->getAvailableUrls($id, false);

            if ($account['hasAccess']) {
                foreach ($yandexClient->getAvailableUrls($id) as $url => $hostData) {
                    $urlOptions[$id . '##' . $hostData['host_id']] = $url . ' (' . $account['name'] . ')';
                }
            }
        }

        $clientConfig                           = $yandexClient->getClientConfig();
        $viewVariables                          = [];
        $viewVariables['isConfigured']          = $yandexClient->isConfigured();
        $viewVariables['auth_nonce']            = Nonce::getNonce('SEKP.yandex.auth');
        $viewVariables['clientId']              = isset($clientConfig['id']) ? $clientConfig['id'] : '';
        $viewVariables['clientSecret']          = preg_replace('/\w/', '*', isset($clientConfig['secret']) ? $clientConfig['secret'] : '');
        $viewVariables['isClientConfigured']    = $clientConfigured;
        $viewVariables['isOAuthConfigured']     = count($accounts) > 0;
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
        $viewVariables['currentSite']           = $this->getCurrentSite();
        $viewVariables['countOfAccountsWithAccess'] = $countOfAccountsWithAccess;

        $siteIds = $viewVariables['configuredMeasurables'];

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
            [$accountId, $url] = explode('##', $yandexAccountAndHostId);

            try {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = $yandexClient->testConfiguration($accountId);
            } catch (\Exception $e) {
                $viewVariables['sitesInfos'][$siteId]['accountValid'] = false;
            }

            try {
                $urls = $yandexClient->getAvailableUrls($accountId);
            } catch (\Exception $e) {
                $urls = [];
            }

            $viewVariables['sitesInfos'][$siteId]['urlValid'] = false;

            foreach ($urls as $data) {
                if ($data['host_id'] == $url) {
                    $viewVariables['sitesInfos'][$siteId]['urlValid'] = true;
                }
            }
        }

        if (!empty($this->securityPolicy)) {
            $this->securityPolicy->addPolicy('img-src', 'avatars.yandex.net');
        }

        $viewVariables['baseUrl'] = Url::getCurrentUrlWithoutQueryString();
        $viewVariables['baseDomain'] = Url::getCurrentScheme() . '://' . Url::getCurrentHost();

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
            Nonce::checkNonce('SEKP.yandex.config', Common::getRequestVar('config_nonce'));

            $clientUpdated = false;

            if (!empty($clientSecret) && !empty($clientId)) {
                $yandexClient = ProviderYandex::getInstance()->getClient();
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
            $measurableSettings = new MeasurableSettings($yandexSiteId);
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
                $yandexSetting = explode('##', $siteConfig['yandexAccountAndHostId']);
                if (!empty($yandexSetting[0]) && $yandexSetting[0] == $remove) {
                    $config = new MeasurableSettings($siteId);
                    $config->yandexAccountAndHostId->setValue('0');
                    $config->save();
                }
            }
        }
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

        Url::redirectToUrl(ProviderYandex::getInstance()->getClient()->createAuthUrl());
    }

    /**
     * Processes an auth code given by Yandex
     */
    public function processYandexAuthCode()
    {
        Piwik::checkUserHasSomeAdminAccess();

        $error     = Common::getRequestVar('error', '');
        $oauthCode = Common::getRequestVar('code', '');
        $timeLimit = $this->getSession()->yandexauthtime;

        // if the auth wasn't triggered within the allowed time frame
        if (!$timeLimit || time() > $timeLimit) {
            $error = true;
        }

        if ($error) {
            return $this->configureYandex(true);
        }

        try {
            ProviderYandex::getInstance()->getClient()->processAuthCode($oauthCode);
        } catch (\Exception $e) {
            return $this->configureYandex($e->getMessage());
        }

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
}
