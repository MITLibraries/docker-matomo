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
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\Access;
use Piwik\API\Request;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Nonce;
use Piwik\Period\Factory as PeriodFactory;
use Piwik\Piwik;
use Piwik\Plugin\Manager;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrEvent;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\Input\Validator;
use Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel;
use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;
use Piwik\Plugins\Live\Live;
use Piwik\Plugins\UsersManager\Model as UsersManagerModel;
use Piwik\Request as PiwikRequest;
use Piwik\Session;
use Piwik\Session\SessionInitializer;
use Piwik\Settings\FieldConfig;
use Piwik\Settings\Plugin\UserSetting;
use Piwik\SettingsPiwik;
use Piwik\Settings\Storage\Backend\PluginSettingsTable;
use Piwik\Tracker\PageUrl;
use Piwik\Url;
use Piwik\View;

class Controller extends \Piwik\Plugin\Controller
{
    public const PROXY_NONCE_ID = 'HeatmapSessionRecording.getProxiedImage';

    /**
     * @var Validator
     */
    private $validator;

    /**
     * @var SiteHsrModel
     */
    private $siteHsrModel;

    /**
     * @var SystemSettings
     */
    private $systemSettings;

    private $mutationManipulator;

    private $configuration;

    /**
     * @var ImageProxy
     */
    private $imageProxy;

    public function __construct(Validator $validator, SiteHsrModel $model, SystemSettings $settings, MutationManipulator $mutationManipulator, Configuration $configuration, ImageProxy $imageProxy)
    {
        parent::__construct();
        $this->validator = $validator;
        $this->siteHsrModel = $model;
        $this->systemSettings = $settings;
        $this->mutationManipulator = $mutationManipulator;
        $this->mutationManipulator->generateNonce();
        $this->configuration = $configuration;
        $this->imageProxy = $imageProxy;
    }

    /**
     * Proxies an external image referenced by a heatmap screenshot so it can be embedded in an exported image.
     *
     * Reached as a controller action (authenticated by the browser session), so no token_auth is placed in the
     * URL that gets injected into the recorded page. Outputs the raw image bytes and terminates the request. On
     * failure it logs a sanitized warning and returns a non-200 response so the client degrades gracefully.
     *
     * @return void
     */
    public function getProxiedImage()
    {
        if (!\Piwik\SettingsPiwik::isInternetEnabled()) {
            throw new \Exception('Internet features are disabled.');
        }

        $request = \Piwik\Request::fromRequest();
        $idSite = $request->getIntegerParameter('idSite', 0);
        $idSiteHsr = $request->getIntegerParameter('idSiteHsr', 0);
        $nonce = $request->getStringParameter('nonce', '');
        $url = Common::unsanitizeInputValue($request->getStringParameter('url', ''));

        Piwik::checkUserHasAdminAccess($idSite);
        $this->siteHsrModel->checkHeatmapExists($idSite, $idSiteHsr);

        if (!\Piwik\Nonce::verifyNonce(self::PROXY_NONCE_ID, $nonce, Url::getCurrentHost())) {
            throw new \Exception('Invalid nonce.');
        }

        $host = null;
        $tmpPath = null;

        try {
            $clean = $this->imageProxy->validateUrl($url);
            $host = parse_url($clean, PHP_URL_HOST);
            $this->imageProxy->assertHostNotInternal($host);
            $res = $this->imageProxy->fetchToFile($clean);
            $tmpPath = $res['path'];

            Common::sendHeader('Content-Type: ' . $res['mime']);
            Common::sendHeader('X-Content-Type-Options: nosniff');
            Common::sendHeader("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'");
            readfile($tmpPath);
        } catch (\Exception $e) {
            $logger = StaticContainer::get(\Psr\Log\LoggerInterface::class);
            $logger->debug('HeatmapSessionRecording: failed to proxy image for idSite {idSite} idSiteHsr {idSiteHsr} host {host}: {reason}', [
                'idSite' => $idSite,
                'idSiteHsr' => $idSiteHsr,
                'host' => $host ?: 'unknown',
                'reason' => $e->getMessage(),
            ]);

            Common::sendResponseCode(400);
        } finally {
            if ($tmpPath !== null) {
                @unlink($tmpPath);
            }
        }

        exit;
    }

    public function manageHeatmap()
    {
        $idSite = Common::getRequestVar('idSite');

        if (strtolower($idSite) === 'all') {
            // prevent fatal error... redirect to a specific site as it is not possible to manage for all sites
            $this->validator->checkHasSomeWritePermission();
            $this->redirectToIndex('HeatmapSessionRecording', 'manageHeatmap');
            exit;
        }

        $this->checkSitePermission();
        $this->validator->checkHeatmapReportWritePermission($this->idSite);

        return $this->renderTemplate('manageHeatmap', array(
            'breakpointMobile' => (int) $this->systemSettings->breakpointMobile->getValue(),
            'breakpointTablet' => (int) $this->systemSettings->breakpointTablet->getValue(),
            'pauseReason' => Piwik::translate(HeatmapSessionRecording::getTranslationKey('pause'), [Piwik::translate('HeatmapSessionRecording_Heatmap')]),
            'isMatomoJsWritable' => HeatmapSessionRecording::isMatomoJsWritable()
        ));
    }

    public function manageSessions()
    {
        $idSite = Common::getRequestVar('idSite');

        if (strtolower($idSite) === 'all') {
            // prevent fatal error... redirect to a specific site as it is not possible to manage for all sites
            $this->validator->checkHasSomeWritePermission();
            $this->redirectToIndex('HeatmapSessionRecording', 'manageSessions');
            exit;
        }

        $this->checkSitePermission();
        $this->validator->checkSessionReportWritePermission($this->idSite);

        return $this->renderTemplate('manageSessions', array(
            'pauseReason' => Piwik::translate(HeatmapSessionRecording::getTranslationKey('pause'), [Piwik::translate('HeatmapSessionRecording_SessionRecording')]),
            'isMatomoJsWritable' => HeatmapSessionRecording::isMatomoJsWritable()
        ));
    }

    /**
     * Entry point for the links embedded in "finished" notification emails. Validates that the
     * referenced heatmap/session recording still exists before handing off to the reporting SPA,
     * so a deleted item does not silently fall back to another available report. If the item is
     * gone the user is redirected to the relevant Manage page which shows a "no longer exists"
     * notification instead.
     */
    public function goToReport()
    {
        $request = PiwikRequest::fromRequest();
        $idSiteHsr = $request->getIntegerParameter('idSiteHsr', 0);
        $recordType = $request->getIntegerParameter('recordType', SiteHsrDao::RECORD_TYPE_HEATMAP);

        if ($recordType === SiteHsrDao::RECORD_TYPE_SESSION) {
            $this->validator->checkSessionReportViewPermission($this->idSite);
            $category = 'HeatmapSessionRecording_SessionRecordings';
            $manageSubcategory = 'HeatmapSessionRecording_ManageSessionRecordings';
            $exists = $this->siteHsrModel->sessionRecordingExists($this->idSite, $idSiteHsr);
        } else {
            $this->validator->checkHeatmapReportViewPermission($this->idSite);
            $category = 'HeatmapSessionRecording_Heatmaps';
            $manageSubcategory = 'HeatmapSessionRecording_ManageHeatmaps';
            $exists = $this->siteHsrModel->heatmapExists($this->idSite, $idSiteHsr);
        }

        $url = $this->buildReportRedirectUrl((int) $this->idSite, $idSiteHsr, $category, $manageSubcategory, $exists);

        Url::redirectToUrl($url);
    }

    /**
     * Builds the reporting SPA URL the "finished" email link redirects to. When the referenced
     * item still exists the URL opens its report directly; otherwise it points at the Manage page
     * with the hsrReportNotFound flag so the SPA can show the "no longer exists" notification.
     */
    protected function buildReportRedirectUrl(int $idSite, int $idSiteHsr, string $category, string $manageSubcategory, bool $exists): string
    {
        $url = rtrim(SettingsPiwik::getPiwikUrl(), '/') . '/'
            . 'index.php?module=CoreHome&action=index'
            . '&idSite=' . $idSite
            . '&period=day&date=today'
            . '#?idSite=' . $idSite
            . '&period=day&date=today'
            . '&category=' . urlencode($category);

        if ($exists) {
            $url .= '&subcategory=' . $idSiteHsr;
        } else {
            $url .= '&subcategory=' . urlencode($manageSubcategory)
                . '&hsrReportNotFound=1';
        }

        return $url;
    }

    private function checkNotInternetExplorerWhenUsingToken()
    {
        if (Common::getRequestVar('token_auth', '', 'string') && !empty($_SERVER['HTTP_USER_AGENT'])) {
            // we want to detect device type only once for faster performance
            $ddFactory = StaticContainer::get(\Piwik\DeviceDetector\DeviceDetectorFactory::class);
            $deviceDetector = $ddFactory->makeInstance($_SERVER['HTTP_USER_AGENT']);
            $client = $deviceDetector->getClient();

            if (
                (!empty($client['short_name']) && $client['short_name'] === 'IE')
                || (!empty($client['name']) && $client['name'] === 'Internet Explorer')
                || (!empty($client['name']) && $client['name'] === 'Opera Mini')
            ) {
               // see https://caniuse.com/?search=noreferrer
                // and https://caniuse.com/?search=referrerpolicy
                throw new \Exception('For security reasons this feature doesn\'t work in this browser when using authentication using token_auth. Please try a different browser or log in to view this.');
            }
        }
    }

    public function replayRecording()
    {
        $this->validator->checkSessionReportViewPermission($this->idSite);
        $this->checkNotInternetExplorerWhenUsingToken();

        $idLogHsr = Common::getRequestVar('idLogHsr', null, 'int');
        $idSiteHsr = Common::getRequestVar('idSiteHsr', null, 'int');

        $_GET['period'] = 'year'; // setting it randomly to not having to pass it in the URL
        $_GET['date'] = 'today'; // date is ignored anyway

        $recording = Request::processRequest('HeatmapSessionRecording.getRecordedSession', array(
            'idSite' => $this->idSite,
            'idLogHsr' => $idLogHsr,
            'idSiteHsr' => $idSiteHsr,
            'filter_limit' => '-1'
        ), $default = []);

        $currentPage = null;
        if (!empty($recording['pageviews']) && is_array($recording['pageviews'])) {
            $allPageviews = array_values($recording['pageviews']);
            foreach ($allPageviews as $index => $pageview) {
                if (!empty($pageview['idloghsr']) && $idLogHsr == $pageview['idloghsr']) {
                    $currentPage = $index + 1;
                    break;
                }
            }
        }

        $settings = $this->getPluginSettings();
        $settings = $settings->load();
        $skipPauses = !empty($settings['skip_pauses']);
        $autoPlayEnabled = !empty($settings['autoplay_pageviews']);
        $replaySpeed = !empty($settings['replay_speed']) ? (int) $settings['replay_speed'] : 1;
        $isVisitorProfileEnabled = Manager::getInstance()->isPluginActivated('Live') && Live::isVisitorProfileEnabled();

        if (!empty($recording['events'])) {
            foreach ($recording['events'] as $recordingEventIndex => $recordingEventValue) {
                if (
                    !empty($recordingEventValue['event_type']) &&
                    (
                        $recordingEventValue['event_type'] == RequestProcessor::EVENT_TYPE_INITIAL_DOM ||
                        $recordingEventValue['event_type'] == RequestProcessor::EVENT_TYPE_MUTATION
                    ) &&
                    !empty(
                        $recordingEventValue['text']
                    )
                ) {
                    $recording['events'][$recordingEventIndex]['text'] = $this->mutationManipulator->manipulate($recordingEventValue['text'], $idSiteHsr, $idLogHsr);
                    break;
                }
            }
        }

        return $this->renderTemplate('replayRecording', array(
            'idLogHsr' => $idLogHsr,
            'idSiteHsr' => $idSiteHsr,
            'recording' => $recording,
            'scrollAccuracy' => LogHsr::SCROLL_ACCURACY,
            'offsetAccuracy' => LogHsrEvent::OFFSET_ACCURACY,
            'autoPlayEnabled' => $autoPlayEnabled,
            'visitorProfileEnabled' => $isVisitorProfileEnabled,
            'skipPausesEnabled' => $skipPauses,
            'replaySpeed' => $replaySpeed,
            'currentPage' => $currentPage
        ));
    }

    protected function setBasicVariablesView($view)
    {
        parent::setBasicVariablesView($view);

        if (
            Common::getRequestVar('module', '', 'string') === 'Widgetize'
            && Common::getRequestVar('action', '', 'string') === 'iframe'
            && Common::getRequestVar('moduleToWidgetize', '', 'string') === 'HeatmapSessionRecording'
        ) {
            $action = Common::getRequestVar('actionToWidgetize', '', 'string');
            if (in_array($action, array('replayRecording', 'showHeatmap'), true)) {
                $view->enableFrames = true;
            }
        }
    }

    private function getPluginSettings()
    {
        $login = Piwik::getCurrentUserLogin();

        $settings = new PluginSettingsTable('HeatmapSessionRecording', $login);
        return $settings;
    }

    public function saveSessionRecordingSettings()
    {
        Piwik::checkUserHasSomeViewAccess();
        $this->validator->checkSessionRecordingEnabled();
        // there is no nonce for this action but that should also not be needed here. as it is just replay settings

        $autoPlay = Common::getRequestVar('autoplay', '0', 'int');
        $replaySpeed = Common::getRequestVar('replayspeed', '1', 'int');
        $skipPauses = Common::getRequestVar('skippauses', '0', 'int');

        $settings = $this->getPluginSettings();
        $settings->save(array('autoplay_pageviews' => $autoPlay, 'replay_speed' => $replaySpeed, 'skip_pauses' => $skipPauses));
    }

    /**
     * Public page reached from the "unsubscribe" link in a finished-recording email. It authenticates
     * the request with a signed token (no login required) and turns off future finished notifications
     * for the recipient. On GET it shows a confirmation form; on POST (confirm) it applies the change.
     */
    public function unsubscribe()
    {
        $view = new View('@HeatmapSessionRecording/unsubscribe');
        $this->setBasicVariablesView($view);
        $view->linkTitle = Piwik::getRandomTitle();

        $matomoLink = 'https://matomo.org/';
        if (method_exists(Url::class, 'addCampaignParametersToMatomoLink')) {
            $matomoLink = Url::addCampaignParametersToMatomoLink($matomoLink);
        }
        $view->matomoLink = $matomoLink;

        $token = Common::getRequestVar('token', '', 'string');
        $login = Common::getRequestVar('login', '', 'string');

        if (empty($token) || empty($login)) {
            $view->error = Piwik::translate('HeatmapSessionRecording_UnsubscribeNoTokenProvided');
            return $view->render();
        }

        $user = Access::doAsSuperUser(function () use ($login) {
            return (new UsersManagerModel())->getUser($login);
        });

        if (
            empty($user)
            || empty($user['email'])
            || !hash_equals(Unsubscribe::generateToken($login, $user['email']), $token)
        ) {
            $view->error = Piwik::translate('HeatmapSessionRecording_UnsubscribeInvalid');
            return $view->render();
        }

        $confirm = Common::getRequestVar('confirm', '', 'string');

        if (!empty($confirm)) {
            Nonce::checkNonce('HeatmapSessionRecording.Unsubscribe');

            Access::doAsSuperUser(function () use ($login) {
                $setting = new UserSetting('notifyFinishedRecordings', true, FieldConfig::TYPE_BOOL, 'HeatmapSessionRecording', $login);
                $setting->setValue(false);
                $setting->save();
            });

            $view->success = true;
        } else {
            $view->nonce = Nonce::getNonce('HeatmapSessionRecording.Unsubscribe');
        }

        return $view->render();
    }

    private function initHeatmapAuth()
    {
        // todo remove in Matomo 5 when we hopefully no longer support IE 11.
        // This is mostly there to prevent forwarding tokens through referrer to third parties
        // most browsers support this except IE11
        // we said we're technically OK with IE11 forwarding a view token in worst case but we still have this here for now
        $token_auth = Common::getRequestVar('token_auth', '', 'string');

        if (!empty($token_auth)) {
            $auth = StaticContainer::get('Piwik\Auth');
            $auth->setTokenAuth($token_auth);
            $auth->setPassword(null);
            $auth->setPasswordHash(null);
            $auth->setLogin(null);

            Session::start();
            $sessionInitializer = new SessionInitializer();
            $sessionInitializer->initSession($auth);

            $_SESSION[HeatmapSessionRecording::SESSION_TOKEN_EMBED_KEY] = true;

            $url = preg_replace('/&token_auth=[^&]{20,38}|$/i', '', Url::getCurrentUrl());
            if ($url) {
                Url::redirectToUrl($url);
                return;
            }
        }

        // if no token_auth, we just rely on an existing session auth check
    }

    protected function setBasicVariablesNoneAdminView($view)
    {
        parent::setBasicVariablesNoneAdminView($view);
        if (Piwik::getAction() === 'embedPage' && Piwik::getModule() === 'HeatmapSessionRecording') {
            $view->setXFrameOptions('allow');
        }
    }

    public function embedPage()
    {
        $this->checkNotInternetExplorerWhenUsingToken();
        $this->initHeatmapAuth();
        $nonceRandom = '';

        if (
            property_exists($this, 'securityPolicy') &&
            method_exists($this->securityPolicy, 'allowEmbedPage')
        ) {
            $toSearch = array("'unsafe-inline' ", "'unsafe-eval' ", "'unsafe-inline'", "'unsafe-eval'");
            $nonceRandom = $this->mutationManipulator->getNonce();
            $this->securityPolicy->overridePolicy('default-src', $this->securityPolicy::RULE_EMBEDDED_FRAME);
            $this->securityPolicy->overridePolicy('img-src', $this->securityPolicy::RULE_EMBEDDED_FRAME);
            $this->securityPolicy->addPolicy('script-src', str_replace($toSearch, '', $this->securityPolicy::RULE_DEFAULT) . "'nonce-$nonceRandom'");
        }

        $pathPrefix = HeatmapSessionRecording::getPathPrefix();
        $jQueryPath = 'node_modules/jquery/dist/jquery.min.js';
        if (HeatmapSessionRecording::isMatomoForWordPress()) {
            $jQueryPath = includes_url('js/jquery/jquery.js');
        }

        $idLogHsr = Common::getRequestVar('idLogHsr', 0, 'int');
        $idSiteHsr = Common::getRequestVar('idSiteHsr', null, 'int');

        $_GET['period'] = 'year'; // setting it randomly to not having to pass it in the URL
        $_GET['date'] = 'today'; // date is ignored anyway

        if (empty($idLogHsr)) {
            $this->validator->checkHeatmapReportViewPermission($this->idSite);

            $heatmap = $this->getHeatmap($this->idSite, $idSiteHsr);

            if (isset($heatmap[0])) {
                $heatmap = $heatmap[0];
            }

            $baseUrl = $heatmap['screenshot_url'];
            $initialMutation = $heatmap['page_treemirror'];
        } else {
            $this->validator->checkSessionReportViewPermission($this->idSite);
            $this->checkSessionRecordingExists($this->idSite, $idSiteHsr);

            $recording = Request::processRequest('HeatmapSessionRecording.getEmbedSessionInfo', [
                'idSite' => $this->idSite,
                'idSiteHsr' => $idSiteHsr,
                'idLogHsr' => $idLogHsr,
            ], $default = []);

            if (empty($recording)) {
                throw new \Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
            }

            $baseUrl = $recording['base_url'];
            $map = array_flip(PageUrl::$urlPrefixMap);

            if (isset($recording['url_prefix']) !== null && isset($map[$recording['url_prefix']])) {
                $baseUrl = $map[$recording['url_prefix']] . $baseUrl;
            }

            if (!empty($recording['initial_mutation'])) {
                $initialMutation = $recording['initial_mutation'];
            } else {
                $initialMutation = '';
            }
        }

        $initialMutation = $this->mutationManipulator->manipulate($initialMutation, $idSiteHsr, $idLogHsr);

        return $this->renderTemplate('embedPage', array(
            'idLogHsr' => $idLogHsr,
            'idSiteHsr' => $idSiteHsr,
            'initialMutation' => $initialMutation,
            'baseUrl' => $baseUrl,
            'pathPrefix' => $pathPrefix,
            'jQueryPath' => $jQueryPath,
            'nonceRandom' => $nonceRandom
        ));
    }

    public function showHeatmap()
    {
        $this->validator->checkHeatmapReportViewPermission($this->idSite);
        $this->checkNotInternetExplorerWhenUsingToken();

        $idSiteHsr = Common::getRequestVar('idSiteHsr', null, 'int');
        $heatmapType = Common::getRequestVar('heatmapType', RequestProcessor::EVENT_TYPE_CLICK, 'int');
        $deviceType = Common::getRequestVar('deviceType', LogHsr::DEVICE_TYPE_DESKTOP, 'int');

        $heatmap = Request::processRequest('HeatmapSessionRecording.getHeatmap', array(
            'idSite' => $this->idSite,
            'idSiteHsr' => $idSiteHsr
        ), $default = []);

        if (isset($heatmap[0])) {
            $heatmap = $heatmap[0];
        }

        $requestDate = $this->siteHsrModel->getPiwikRequestDate($heatmap);
        $period = $requestDate['period'];
        $dateRange = $requestDate['date'];

        if (
            !PeriodFactory::isPeriodEnabledForAPI($period) ||
            Common::getRequestVar('useDateUrl', 0, 'int')
        ) {
            $period = Common::getRequestVar('period', null, 'string');
            $dateRange = Common::getRequestVar('date', null, 'string');
        }

        try {
            PeriodFactory::checkPeriodIsEnabled($period);
        } catch (\Exception $e) {
            $periodEscaped = Common::sanitizeInputValue(Piwik::translate('HeatmapSessionRecording_PeriodDisabledErrorMessage', $period));
            return '<div vue-entry="CoreHome.Alert" severity="danger">' . $periodEscaped . '</div>';
        }

        $metadata = Request::processRequest('HeatmapSessionRecording.getRecordedHeatmapMetadata', array(
            'idSite' => $this->idSite,
            'idSiteHsr' => $idSiteHsr,
            'period' => $period,
            'date' => $dateRange
        ), $default = []);

        if (isset($metadata[0])) {
            $metadata = $metadata[0];
        }

        $editUrl = 'index.php' . Url::getCurrentQueryStringWithParametersModified(array(
                'module' => 'HeatmapSessionRecording',
                'action' => 'manageHeatmap'
            )) . '#?idSiteHsr=' . (int)$idSiteHsr;

        $reportDocumentation = '';
        if ($heatmap['status'] == SiteHsrDao::STATUS_ACTIVE) {
            $reportDocumentation = Piwik::translate('HeatmapSessionRecording_RecordedHeatmapDocStatusActive', array($heatmap['sample_limit'], $heatmap['sample_rate'] . '%'));
        } elseif ($heatmap['status'] == SiteHsrDao::STATUS_ENDED) {
            $reportDocumentation = Piwik::translate('HeatmapSessionRecording_RecordedHeatmapDocStatusEnded');
        } elseif ($heatmap['status'] == SiteHsrDao::STATUS_ONHOLD) {
            if (!empty($heatmap['scheduled_date_pretty'])) {
                $reportDocumentation = Piwik::translate(
                    'HeatmapSessionRecording_RecordedHeatmapDocStatusOnHoldWithDate',
                    $heatmap['scheduled_date_pretty']
                );
            } else {
                $reportDocumentation = Piwik::translate('HeatmapSessionRecording_RecordedHeatmapDocStatusOnHold');
            }
        }

        $includedCountries = $this->systemSettings->getIncludedCountries();

        return $this->renderTemplate('showHeatmap', array(
            'idSiteHsr' => $idSiteHsr,
            'editUrl' => $editUrl,
            'heatmapType' => $heatmapType,
            'deviceType' => $deviceType,
            'heatmapPeriod' => $period,
            'heatmapDate' => $dateRange,
            'heatmap' => $heatmap,
            'isActive' => $heatmap['status'] == SiteHsrDao::STATUS_ACTIVE,
            'heatmapMetadata' => $metadata,
            'reportDocumentation' => $reportDocumentation,
            'isScroll' => $heatmapType == RequestProcessor::EVENT_TYPE_SCROLL,
            'offsetAccuracy' => LogHsrEvent::OFFSET_ACCURACY,
            'heatmapTypes' => API::getInstance()->getAvailableHeatmapTypes(),
            'deviceTypes' => API::getInstance()->getAvailableDeviceTypes(),
            'includedCountries' => !empty($includedCountries) ? implode(', ', $includedCountries) : '',
            'desktopPreviewSize' => $this->configuration->getDefaultHeatmapWidth(),
            'allowedWidth' => Configuration::HEATMAP_ALLOWED_WIDTHS,
            'noDataMessageKey' => HeatmapSessionRecording::getTranslationKey('noDataHeatmap'),
            'isMatomoJsWritable' => HeatmapSessionRecording::isMatomoJsWritable(),
            'imageProxyNonce' => \Piwik\Nonce::getNonce(self::PROXY_NONCE_ID),
        ));
    }

    private function getHeatmap($idSite, $idSiteHsr)
    {
        $heatmap = Request::processRequest('HeatmapSessionRecording.getHeatmap', [
            'idSite' => $idSite,
            'idSiteHsr' => $idSiteHsr,
        ], $default = []);
        if (empty($heatmap)) {
            throw new \Exception(Piwik::translate('HeatmapSessionRecording_ErrorHeatmapDoesNotExist'));
        }
        return $heatmap;
    }

    private function checkSessionRecordingExists($idSite, $idSiteHsr)
    {
        $sessionRecording = Request::processRequest('HeatmapSessionRecording.getSessionRecording', [
            'idSite' => $idSite,
            'idSiteHsr' => $idSiteHsr,
        ], $default = []);
        if (empty($sessionRecording)) {
            throw new \Exception(Piwik::translate('HeatmapSessionRecording_ErrorSessionRecordingDoesNotExist'));
        }
    }
}
