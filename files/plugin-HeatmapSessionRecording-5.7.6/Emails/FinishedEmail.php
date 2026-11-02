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

namespace Piwik\Plugins\HeatmapSessionRecording\Emails;

use Piwik\Common;
use Piwik\Mail;
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Unsubscribe;
use Piwik\SettingsPiwik;
use Piwik\View;

abstract class FinishedEmail extends Mail
{
    /**
     * @var string
     */
    protected $toEmail;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var int
     */
    protected $idSite;

    /**
     * @var int
     */
    protected $idSiteHsr;

    /**
     * @var string
     */
    protected $login;

    public function __construct(string $toEmail, string $name, int $idSite, int $idSiteHsr, string $login)
    {
        parent::__construct();

        $this->toEmail   = $toEmail;
        $this->name      = $name;
        $this->idSite    = $idSite;
        $this->idSiteHsr = $idSiteHsr;
        $this->login     = $login;

        $this->setUpEmail();
    }

    private function setUpEmail()
    {
        $this->setDefaultFromPiwik();
        $this->addTo($this->toEmail);
        $this->setSubject($this->getEmailSubject());
        $this->addReplyTo($this->getFrom(), $this->getFromName());
        $this->setWrappedHtmlBody($this->getBodyView());
    }

    protected function getBodyView()
    {
        $view = new View('@HeatmapSessionRecording/_finishedEmail.twig');
        $view->bodyText = $this->getEmailBodyText();
        $view->greeting = Piwik::translate('HeatmapSessionRecording_EmailFinishedGreeting');
        $view->regards = Piwik::translate('HeatmapSessionRecording_EmailFinishedRegards');
        $view->team = Piwik::translate('HeatmapSessionRecording_EmailFinishedTeam');
        $view->unsubscribeText = $this->getUnsubscribeText();

        return $view;
    }

    protected function buildReportUrl(): string
    {
        $baseUrl = rtrim(SettingsPiwik::getPiwikUrl(), '/') . '/';

        $idSite = (int) $this->idSite;
        $idSiteHsr = (int) $this->idSiteHsr;
        $recordType = (int) $this->getRecordType();

        // Route through the goToReport action so the id can be validated server-side before the
        // reporting SPA loads. If the heatmap/session recording was deleted after the email was
        // sent, the action redirects to the Manage page with a "no longer exists" notice instead
        // of silently falling back to another available report.
        return $baseUrl
            . 'index.php?module=HeatmapSessionRecording&action=goToReport'
            . '&idSite=' . $idSite
            . '&idSiteHsr=' . $idSiteHsr
            . '&recordType=' . $recordType;
    }

    protected function getEmailBodyText(): string
    {
        // Escape both the link and the (user-controlled) name so they are safe under {{ bodyText|raw }}.
        $safeUrl = Common::sanitizeInputValue($this->buildReportUrl());
        $linkText = Common::sanitizeInputValue(Piwik::translate('HeatmapSessionRecording_EmailViewResultsLink'));
        $link = '<a href="' . $safeUrl . '">' . $linkText . '</a>';
        $safeName = Common::sanitizeInputValue(Common::unsanitizeInputValue($this->name));

        return Piwik::translate($this->getBodyTranslationKey(), array($safeName, $link));
    }

    protected function getUnsubscribeText(): string
    {
        // Escape the link so it is safe under {{ unsubscribeText|raw }}.
        $safeUrl = Common::sanitizeInputValue(Unsubscribe::buildUrl($this->login, $this->toEmail));
        $linkText = Common::sanitizeInputValue(Piwik::translate('HeatmapSessionRecording_Unsubscribe'));
        $link = '<a href="' . $safeUrl . '">' . $linkText . '</a>';

        return Piwik::translate('HeatmapSessionRecording_EmailUnsubscribeText', array($link));
    }

    abstract protected function getEmailSubject(): string;

    abstract protected function getBodyTranslationKey(): string;

    abstract protected function getRecordType(): int;
}
