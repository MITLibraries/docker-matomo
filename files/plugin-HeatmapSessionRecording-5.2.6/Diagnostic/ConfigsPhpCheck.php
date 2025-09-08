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

namespace Piwik\Plugins\HeatmapSessionRecording\Diagnostic;

use Piwik\Common;
use Piwik\Http;
use Piwik\Plugins\Diagnostics\Diagnostic\Diagnostic;
use Piwik\Plugins\Diagnostics\Diagnostic\DiagnosticResult;
use Piwik\Plugins\HeatmapSessionRecording\HeatmapSessionRecording;
use Piwik\Plugins\SitesManager\Model;
use Piwik\SettingsPiwik;
use Piwik\Translation\Translator;

/**
 * Check configs.php can be accessed from outside
 */
class ConfigsPhpCheck implements Diagnostic
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
        $label = $this->translator->translate('Heatmap & Session Recording Tracking');

        $site = new Model();
        $idSites = $site->getSitesId();
        $idSite = array_shift($idSites);

        $baseUrl = SettingsPiwik::getPiwikUrl();
        if (!Common::stringEndsWith($baseUrl, '/')) {
            $baseUrl .= '/';
        }

        $baseUrl .= HeatmapSessionRecording::getPathPrefix() . '/';
        $baseUrl .= 'HeatmapSessionRecording/configs.php';
        $testUrl  = $baseUrl . '?idsite=' . (int) $idSite . '&trackerid=5lX6EM&url=http%3A%2F%2Ftest.test%2F';

        $error = null;
        $response = null;

        $errorResult = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpErrorResult');
        $manualCheck = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpManualCheck');

        if (method_exists('\Piwik\SettingsPiwik', 'isInternetEnabled')) {
            $isInternetEnabled = SettingsPiwik::isInternetEnabled();
            if (!$isInternetEnabled) {
                $unknown = $this->translator->translate('HeatmapSessionRecording_ConfigsInternetDisabled', $testUrl) . ' ' . $manualCheck;
                return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_WARNING, $unknown));
            }
        }

        try {
            $response = Http::sendHttpRequest($testUrl, $timeout = 2);
        } catch (\Exception $e) {
            $error = $e->getMessage();
        }

        if (!empty($response)) {
            $response = Common::mb_strtolower($response);
            if (strpos($response, 'piwik.heatmapsessionrecording') !== false) {
                $message = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpSuccess', $baseUrl);
                return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_OK, $message));
            } elseif (strpos($response, 'forbidden') !== false || strpos($response, ' forbidden') !== false || strpos($response, ' denied ') !== false || strpos($response, '403 ') !== false || strpos($response, '404 ') !== false) {
                // Likely the server returned eg a 403 HTML
                $message = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpNotAccessible', array($testUrl)) . ' ' . $errorResult;
                return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_ERROR, $message));
            }
        }

        if (!empty($error)) {
            $error = Common::mb_strtolower($error);

            if (strpos($error, 'forbidden ') !== false || strpos($error, ' forbidden') !== false || strpos($error, 'denied ') !== false  || strpos($error, '403 ') !== false || strpos($error, '404 ') !== false) {
                $message = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpNotAccessible', array($testUrl)) . ' ' . $errorResult;
                return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_ERROR, $message));
            }

            if (strpos($error, 'ssl ') !== false || strpos($error, ' ssl') !== false || strpos($error, 'self signed') !== false || strpos($error, 'certificate ') !== false) {
                $message = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpSelfSignedError', array($testUrl)) . ' ' . $manualCheck;
                return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_WARNING, $message));
            }

            $unknownError = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpUnknownError', array($testUrl, $error)) . ' ' . $errorResult;
            return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_WARNING, $unknownError));
        }

        $unknown = $this->translator->translate('HeatmapSessionRecording_ConfigsPhpUnknown', $testUrl) . $manualCheck;
        return array(DiagnosticResult::singleResult($label, DiagnosticResult::STATUS_WARNING, $unknown));
    }
}
