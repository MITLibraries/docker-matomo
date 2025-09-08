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

namespace Piwik\Plugins\HeatmapSessionRecording\Commands;

use Piwik\API\Request;
use Piwik\Container\StaticContainer;
use Piwik\Filesystem;
use Piwik\Plugin;
use Piwik\Plugin\ConsoleCommand;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrSite;
use Piwik\Plugins\HeatmapSessionRecording\Dao\SiteHsrDao;
use Piwik\Plugins\HeatmapSessionRecording\HeatmapSessionRecording;

class RemoveHeatmapScreenshot extends ConsoleCommand
{
    protected function configure()
    {
        $this->setName('heatmapsessionrecording:remove-heatmap-screenshot');
        $this->setDescription('Removes a saved heatmap screenshot which can be useful if you want Matomo to re-take this screenshot. If the heatmap is currently ended, it will automatically restart it.');
        $this->addRequiredValueOption('idsite', null, 'The ID of the site the heatmap belongs to');
        $this->addRequiredValueOption('idheatmap', null, 'The ID of the heatamp');
    }

    /**
     * @return int
     */
    protected function doExecute(): int
    {
        $this->checkAllRequiredOptionsAreNotEmpty();
        $input = $this->getInput();
        $output = $this->getOutput();
        $idSite = $input->getOption('idsite');
        $idHeatmap = $input->getOption('idheatmap');

        $heatmap = Request::processRequest('HeatmapSessionRecording.getHeatmap', array(
            'idSite' => $idSite,
            'idSiteHsr' => $idHeatmap
        ));

        if ($heatmap['status'] === SiteHsrDao::STATUS_ENDED) {
            $logHsrSite = new LogHsrSite();
            $numSamplesTakenSoFar = $logHsrSite->getNumPageViews($idHeatmap);

            $currentSampleLimit = $heatmap['sample_limit'];
            $newSampleLimit     = $numSamplesTakenSoFar + 50; // 50 heatmaps should be enough to collect at least once the dom.

            $update = array('status' => SiteHsrDao::STATUS_ACTIVE);
            if ($currentSampleLimit >= $newSampleLimit) {
                $output->writeln('Sample limit remains unchanged at ' . $currentSampleLimit);
                if ($currentSampleLimit - $numSamplesTakenSoFar > 75) {
                    $output->writeln('<info>make sure to end the heatmap again as soon as a screenshot has been taken!</info>');
                }
            } else {
                $output->writeln('Going to increase sample limit from ' . $currentSampleLimit . ' to ' . $newSampleLimit . ' so a screenshot can be retaken. The heatmap will be automatically ended after about 50 new recordings have been recorded.');
                $output->writeln('Note: This means when you manage this heatmap the selected sample wont be shown correctly in the select field');
                $update['sample_limit'] = $newSampleLimit;
            }

            $output->writeln('Going to change status of heatmap from ended to active');

            $siteHsr = StaticContainer::get(SiteHsrDao::class);
            $siteHsr->updateHsrColumns($idSite, $idHeatmap, array(
                'status' => SiteHsrDao::STATUS_ACTIVE,
                'sample_limit' => $newSampleLimit
            ));
            $output->writeln('Done');
        }

        $success = Request::processRequest('HeatmapSessionRecording.deleteHeatmapScreenshot', array(
            'idSite' => $idSite,
            'idSiteHsr' => $idHeatmap
        ));

        if ($success) {
            Filesystem::deleteAllCacheOnUpdate();
            /** @var HeatmapSessionRecording $hsr */
            $hsr = Plugin\Manager::getInstance()->getLoadedPlugin('HeatmapSessionRecording');
            $hsr->updatePiwikTracker();
            $output->writeln('<info>Screenhot removed</info>');

            return self::SUCCESS;
        }

        $output->writeln('<error>Heatmap not found</error>');
        return self::FAILURE;
    }
}
