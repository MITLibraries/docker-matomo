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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Commands;

use Piwik\Plugin\ConsoleCommand;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Importer\Yandex;
use Piwik\Plugins\SearchEngineKeywordsPerformance\MeasurableSettings;

/**
 */
class ImportYandex extends ConsoleCommand
{
    protected function configure()
    {
        $this->setName('searchengines:import-yandex')->setDescription('Imports Yandex Keywords')
            ->addNoValueOption('force', 'f', 'Force reimport for data')
            ->addRequiredValueOption('idsite', '', 'Site id')
            ->addOptionalValueOption('date', 'd', 'specific date');
    }
    /**
     * @return int
     */
    protected function doExecute(): int
    {
        $input = $this->getInput();
        $output = $this->getOutput();
        $output->writeln("Starting to import Yandex Keywords");
        $start = microtime(\true);
        $idSite = $input->getOption('idsite');
        $setting = new MeasurableSettings($idSite);
        $yandexSiteUrl = $setting->yandexAccountAndHostId;
        if (!$yandexSiteUrl || !$yandexSiteUrl->getValue()) {
            $output->writeln("Site with ID {$idSite} not configured for Yandex Import");
        }
        $importer = new Yandex($idSite, $input->hasOption('force'));
        $date = $input->hasOption('date') ? $input->getOption('date') : 100;
        $importer->importAllAvailableData($date);
        $output->writeln("Finished in " . round(microtime(\true) - $start, 3) . "s");
        return self::SUCCESS;
    }
}
