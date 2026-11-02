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
use Piwik\Container\StaticContainer;
use Piwik\Db;
use Piwik\Piwik;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrBlob;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\Emails\HeatmapFinishedEmail;
use Piwik\Plugins\HeatmapSessionRecording\Emails\SessionRecordingFinishedEmail;
use Piwik\Plugins\HeatmapSessionRecording\Input\Validator;
use Piwik\Plugins\HeatmapSessionRecording\Model\SiteHsrModel;
use Piwik\Plugins\LanguagesManager\Model as LanguagesManagerModel;
use Piwik\Plugins\UsersManager\Model;
use Piwik\Settings\FieldConfig;
use Piwik\Settings\Plugin\UserSetting;
use Piwik\Translation\Translator;
use Piwik\Updater\Migration\Db as MigrationDb;

class Tasks extends \Piwik\Plugin\Tasks
{
    /**
     * @var LogHsrSite
     */
    private $logHsrSite;

    /**
     * @var LogHsr
     */
    private $logHsr;

    /**
     * @var LogHsrBlob
     */
    private $logHsrBlob;

    /**
     * @var SiteHsrDao
     */
    private $siteHsrDao;

    /**
     * @var SiteHsrModel
     */
    private $siteHsrModel;

    public function schedule()
    {
        $this->daily('removeDeletedRecordings');

        // we are doing this rarely to avoid removing actions that might be used eg a day later or so again
        $this->monthly('removeUnusedHsrBlobs');

        $this->hourly('notifyFinishedRecordings');

        $this->daily('createRepeatHeatmaps');

        $this->hourly('activateOnHoldHeatmaps');

        $this->daily('createRepeatSessionRecordings');

        $this->hourly('activateOnHoldSessionRecordings');
    }

    public function __construct(LogHsr $logHsr, LogHsrSite $logHsrSite, LogHsrBlob $logHsrBlob, SiteHsrDao $siteHsrDao, SiteHsrModel $siteHsrModel)
    {
        $this->logHsr = $logHsr;
        $this->logHsrSite = $logHsrSite;
        $this->logHsrBlob = $logHsrBlob;
        $this->siteHsrDao = $siteHsrDao;
        $this->siteHsrModel = $siteHsrModel;
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.removeDeletedRecordings"`
     *
     * @throws \Exception
     */
    public function removeDeletedRecordings()
    {
        $this->logHsrSite->deleteNoLongerNeededRecords();

        $idLogHsrsToDelete = $this->logHsr->findDeletedLogHsrIds();
        $this->logHsr->deleteIdLogHsrsFromAllTables($idLogHsrsToDelete);
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.removeDeletedHsrBlobs"`
     */
    public function removeUnusedHsrBlobs()
    {
        $this->logHsrBlob->deleteUnusedBlobEntries();
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.notifyFinishedRecordings"`
     */
    public function notifyFinishedRecordings()
    {
        Access::doAsSuperUser(function () {
            $records = $this->siteHsrDao->getFinishedRecordsPendingNotification();

            foreach ($records as $record) {
                try {
                    $this->notifyFinishedRecord($record);
                } catch (\Throwable $e) {
                    StaticContainer::get(\Piwik\Log\LoggerInterface::class)->error(
                        'Failed to send finished recording notification for idsitehsr {idsitehsr}: {message}',
                        array(
                            'idsitehsr' => isset($record['idsitehsr']) ? $record['idsitehsr'] : null,
                            'message' => $e->getMessage(),
                            'exception' => $e,
                        )
                    );
                }
            }
        });
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.createRepeatHeatmaps"`
     */
    public function createRepeatHeatmaps()
    {
        $this->createRepeatRecords(SiteHsrDao::RECORD_TYPE_HEATMAP, 'heatmap', 'HeatmapSessionRecording.createRepeatHeatmap', array($this->siteHsrModel, 'createRepeatCopy'));
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.activateOnHoldHeatmaps"`
     */
    public function activateOnHoldHeatmaps()
    {
        $this->activateOnHoldRecords(SiteHsrDao::RECORD_TYPE_HEATMAP, 'heatmap', 'HeatmapSessionRecording.activateRepeatHeatmap', array($this->siteHsrModel, 'activateOnHoldHeatmap'));
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.createRepeatSessionRecordings"`
     */
    public function createRepeatSessionRecordings()
    {
        $this->createRepeatRecords(SiteHsrDao::RECORD_TYPE_SESSION, 'session recording', 'HeatmapSessionRecording.createRepeatSessionRecording', array($this->siteHsrModel, 'createSessionRepeatCopy'));
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\HeatmapSessionRecording\Tasks.activateOnHoldSessionRecordings"`
     */
    public function activateOnHoldSessionRecordings()
    {
        $this->activateOnHoldRecords(SiteHsrDao::RECORD_TYPE_SESSION, 'session recording', 'HeatmapSessionRecording.activateRepeatSessionRecording', array($this->siteHsrModel, 'activateOnHoldSessionRecording'));
    }

    /**
     * @param int $recordType
     * @param string $label Entity wording used in the log messages, eg `heatmap`
     * @param string $eventName
     * @param callable $createCopy Receives `$idSite` and `$idSiteHsr` and returns the new idsitehsr, or null
     */
    private function createRepeatRecords($recordType, $label, $eventName, $createCopy)
    {
        Access::doAsSuperUser(function () use ($recordType, $label, $eventName, $createCopy) {
            $records = $this->siteHsrDao->getRecordsPendingRepeat($recordType);

            foreach ($records as $record) {
                $idSite = (int) $record['idsite'];
                $idSiteHsr = (int) $record['idsitehsr'];
                $name = isset($record['name']) ? $record['name'] : '';

                try {
                    $this->checkRepeatAllowed($idSite, $idSiteHsr, $recordType, $eventName);

                    if (null === $createCopy($idSite, $idSiteHsr)) {
                        StaticContainer::get(\Piwik\Log\LoggerInterface::class)->info(
                            'Skipped creating repeat ' . $label . ' copy for idsitehsr {idsitehsr} "{name}" (idsite {idsite}) as it is no longer ended or no longer set to repeat',
                            array(
                                'idsitehsr' => $idSiteHsr,
                                'idsite' => $idSite,
                                'name' => $name,
                            )
                        );
                    }
                } catch (\Throwable $e) {
                    if ($e instanceof \Exception && Db::get()->isErrNo($e, MigrationDb::ERROR_CODE_DUPLICATE_ENTRY)) {
                        // another run already created the copy for this record
                        continue;
                    }

                    StaticContainer::get(\Piwik\Log\LoggerInterface::class)->error(
                        'Failed to create repeat ' . $label . ' copy for idsitehsr {idsitehsr} "{name}" (idsite {idsite}). It will be retried on the next run: {message}',
                        array(
                            'idsitehsr' => $idSiteHsr,
                            'idsite' => $idSite,
                            'name' => $name,
                            'message' => $e->getMessage(),
                            'exception' => $e,
                        )
                    );
                }
            }
        });
    }

    /**
     * @param int $recordType
     * @param string $label Entity wording used in the log messages, eg `heatmap`
     * @param string $eventName
     * @param callable $activate Receives `$idSite` and `$idSiteHsr` and returns whether the record was activated
     */
    private function activateOnHoldRecords($recordType, $label, $eventName, $activate)
    {
        Access::doAsSuperUser(function () use ($recordType, $label, $eventName, $activate) {
            $records = $this->siteHsrDao->getOnHoldRecordsToActivate($recordType);

            foreach ($records as $record) {
                $idSite = (int) $record['idsite'];
                $idSiteHsr = (int) $record['idsitehsr'];

                try {
                    $this->checkRepeatAllowed($idSite, $idSiteHsr, $recordType, $eventName);

                    if (!$activate($idSite, $idSiteHsr)) {
                        StaticContainer::get(\Piwik\Log\LoggerInterface::class)->info(
                            'Skipped activating on-hold ' . $label . ' for idsitehsr {idsitehsr} (idsite {idsite}) as it is no longer on hold or no longer due',
                            array(
                                'idsitehsr' => $idSiteHsr,
                                'idsite' => $idSite,
                            )
                        );
                    }
                } catch (\Throwable $e) {
                    StaticContainer::get(\Piwik\Log\LoggerInterface::class)->error(
                        'Failed to activate on-hold ' . $label . ' for idsitehsr {idsitehsr} (idsite {idsite}): {message}',
                        array(
                            'idsitehsr' => $idSiteHsr,
                            'idsite' => $idSite,
                            'message' => $e->getMessage(),
                            'exception' => $e,
                        )
                    );
                }
            }
        });
    }

    /**
     * Throws when a repeat record must not be created or activated for the given site.
     *
     * The event lets other plugins apply the feature and quota checks they apply to
     * `API.HeatmapSessionRecording.addHeatmap`, which these scheduled tasks do not go through.
     * Heatmaps and session recordings post distinct events so each is checked against its own quota.
     *
     * @param int $idSite
     * @param int $idSiteHsr
     * @param int $recordType
     * @param string $eventName
     * @throws \Exception
     */
    private function checkRepeatAllowed($idSite, $idSiteHsr, $recordType, $eventName)
    {
        if ($recordType === SiteHsrDao::RECORD_TYPE_HEATMAP) {
            StaticContainer::get(Validator::class)->checkHeatmapRecordingEnabled($idSite);
        } else {
            StaticContainer::get(Validator::class)->checkSessionRecordingEnabled($idSite);
        }

        /**
         * Triggered before a scheduled task creates or activates the repeat copy of a heatmap or a session
         * recording that has automatic repeating enabled.
         *
         * Depending on which task is running, `$eventName` is one of
         * `HeatmapSessionRecording.createRepeatHeatmap`, `HeatmapSessionRecording.activateRepeatHeatmap`,
         * `HeatmapSessionRecording.createRepeatSessionRecording` or
         * `HeatmapSessionRecording.activateRepeatSessionRecording`. Heatmaps and session recordings post
         * distinct events so each can be checked against its own quota.
         *
         * These tasks do not go through `API.HeatmapSessionRecording.addHeatmap` or
         * `API.HeatmapSessionRecording.addSessionRecording`, so throwing an exception in an observer is the
         * way to apply the same feature and quota checks. When an observer throws, the copy is not created
         * or activated and the source is retried on the next run.
         *
         * **Example**
         *
         *     Piwik::addAction('HeatmapSessionRecording.createRepeatSessionRecording', function ($idSite, $idSiteHsr) {
         *         if (myQuotaIsReached($idSite)) {
         *             throw new \Exception('Session recording quota reached');
         *         }
         *     });
         *
         * @param int $idSite The ID of the site the repeating heatmap or session recording belongs to.
         * @param int $idSiteHsr The ID of the source heatmap or session recording that is repeating.
         */
        Piwik::postEvent($eventName, array($idSite, $idSiteHsr));
    }

    private function notifyFinishedRecord(array $record)
    {
        $login = $record['login'];
        $idSite = (int) $record['idsite'];
        $idSiteHsr = (int) $record['idsitehsr'];
        $recordType = (int) $record['record_type'];
        $name = $record['name'];

        // Claim immediately so the record is never reprocessed, even if we end up skipping or failing below.
        $this->siteHsrDao->markNotified($idSiteHsr);

        $userModel = new Model();
        $user = $userModel->getUser($login);

        if (empty($user) || empty($user['email'])) {
            return;
        }

        $hasAccess = !empty($user['superuser_access']);
        if (!$hasAccess) {
            $access = $userModel->getUsersAccessFromSite($idSite);
            $hasAccess = array_key_exists($login, $access);
        }

        if (!$hasAccess) {
            return;
        }

        $setting = new UserSetting('notifyFinishedRecordings', true, FieldConfig::TYPE_BOOL, 'HeatmapSessionRecording', $login);
        if (!$setting->getValue()) {
            return;
        }

        $language = (new LanguagesManagerModel())->getLanguageForUser($login);

        /** @var Translator $translator */
        $translator = StaticContainer::get('Piwik\Translation\Translator');

        if (empty($language)) {
            $language = $translator->getDefaultLanguage();
        }

        $translator->setCurrentLanguage($language);

        if ($recordType === SiteHsrDao::RECORD_TYPE_HEATMAP) {
            $mail = new HeatmapFinishedEmail($user['email'], $name, $idSite, $idSiteHsr, $login);
        } else {
            $mail = new SessionRecordingFinishedEmail($user['email'], $name, $idSite, $idSiteHsr, $login);
        }
        $mail->safeSend();
    }
}
