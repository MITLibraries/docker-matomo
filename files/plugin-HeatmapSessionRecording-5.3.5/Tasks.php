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

use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsr;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrBlob;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;

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

    public function schedule()
    {
        $this->daily('removeDeletedRecordings');

        // we are doing this rarely to avoid removing actions that might be used eg a day later or so again
        $this->monthly('removeUnusedHsrBlobs');
    }

    public function __construct(LogHsr $logHsr, LogHsrSite $logHsrSite, LogHsrBlob $logHsrBlob)
    {
        $this->logHsr = $logHsr;
        $this->logHsrSite = $logHsrSite;
        $this->logHsrBlob = $logHsrBlob;
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
}
