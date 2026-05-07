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

namespace Piwik\Plugins\CustomReports\Commands;

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Date;
use Piwik\Log\LoggerInterface;
use Piwik\Period;
use Piwik\Plugin\ConsoleCommand;
use Piwik\Plugins\CustomReports\Model\CustomReportsModel;
use Piwik\Plugins\CustomReports\RecordBuilders\CustomReport;
use Piwik\Plugins\SegmentEditor\API;
use Piwik\Version;
use Piwik\ArchiveProcessor;
use Piwik\ArchiveProcessor\Parameters;
use Piwik\DataAccess\ArchiveSelector;
use Piwik\DataAccess\ArchiveWriter;
use Piwik\DataAccess\LogAggregator;
use Piwik\DataTable\Manager as DataTableManager;
use Piwik\Period\Day;
use Piwik\Segment;
use Piwik\Site;

class ArchiveReports extends ConsoleCommand
{
    private $segmentsBySite = [];

    protected function configure()
    {
        $this->setName('customreports:archive');
        $this->setDescription('Let\'s you trigger custom reports archiving for given site and date range');
        $this->addRequiredValueOption('idsites', null, 'The ids of the sites you want to archive custom reports for', 'all');
        $this->addRequiredValueOption('date', null, 'The date or date range you want to archive custom reports for');
        $this->addRequiredValueOption('idreport', null, 'If set, only a specific report will be archived');
        $this->addNoValueOption('disable-segments', null, 'Disables archiving of pre-archived segments');
        $this->addRequiredValueOption('periods', null, 'Specify which periods should be archived. A comma separated list will archive multiple periods', 'all');
        $this->addRequiredValueOption(
            'segment',
            null,
            'List of segments to invalidate report data for. This can be the segment string itself, the segment name from the UI or the ID of the segment.'
            . ' If specifying the segment definition, make sure it is encoded properly (it should be the same as the segment parameter in the URL.',
            null
        );
    }

    public function isEnabled()
    {
        // Archives can't be overwritten in Matomo before 3.0.3
        return version_compare(Version::VERSION, '3.0.3', '>=');
    }

    /**
     * @return int
     */
    protected function doExecute(): int
    {
        $input = $this->getInput();
        $output = $this->getOutput();
        $idSites = Site::getIdSitesFromIdSitesString($input->getOption('idsites'));
        $date = $input->getOption('date');
        $idReport = $input->getOption('idreport');
        $segmentOption = $input->getOption('segment');
        if (!is_array($segmentOption) && !empty($segmentOption)) {
            $segmentOption = explode(',', $segmentOption);
        }
        $segmentOptionValues = !$segmentOption ? [] : array_map('trim', $segmentOption);
        $segmentOptionValues = array_unique($segmentOptionValues);

        Period::checkDateFormat($date);

        if (Period::isMultiplePeriod($date, 'day')) {
            $period = Period\Factory::build('range', $date);
            $datesToComplete = $this->getDaysFromPeriod($period);
        } else {
            $datesToComplete = [$date];
        }

        $periods = $this->getPeriodsToArchive($datesToComplete, $input->getOption('periods'));

        foreach ($idSites as $idSite) {
            $siteName = Site::getNameFor($idSite);
            $output->writeln('Starting to archive custom reports for Site ' . $siteName);

            // Check if the report even exists for the site
            $reports = StaticContainer::get(CustomReportsModel::class)->getAllCustomReportsForSite($idSite);
            $reportIds = count($reports) ? array_column($reports, 'idcustomreport') : [];
            if (!empty($idReport) && !in_array($idReport, $reportIds)) {
                $output->writeln("Report {$idReport} not found for Site {$siteName}");
                continue;
            }

            if ($input->getOption('disable-segments')) {
                $segments = ['']; // Only archive data without segments
            } elseif (count($segmentOptionValues)) {
                $segments = $this->getSegmentsToProcess([$idSite], $segmentOptionValues); // Only archive the specified segments
            } else {
                $segments = ArchiveProcessor\Rules::getSegmentsToProcess([$idSite]);
                array_unshift($segments, ''); // Archive data without segment as well as all segments
            }

            foreach ($segments as $segment) {
                if ('' !== $segment) {
                    $output->writeln('Archiving segment ' . $segment);
                }

                // Check if the segment is valid before progressing any further
                try {
                    StaticContainer::getContainer()->make(Segment::class, ['segmentCondition' => $segment, 'idSites' => [$idSite]]);
                } catch (\Exception $e) {
                    $errorMsg = $e->getMessage();
                    if (strpos($errorMsg, 'is not a supported segment') !== false || preg_match('/The segment condition \'.*\' is not valid\./', $errorMsg)) {
                        // eg a plugin was uninstalled etc
                        $output->writeln('The segment is not supported. The associated plugin was likely disabled.');
                        continue;
                    }
                    throw $e;
                }

                $this->initProgressBar(count($periods));

                $periodsNotArchived = [];
                foreach ($periods as $period) {
                    if (!$this->archiveCustomReports($idSite, $period, $reports, $segment, $idReport)) {
                        $periodsNotArchived[] = $period instanceof Day ? $period->toString() : $period->getRangeString();
                    }
                    $this->advanceProgressBar();
                }

                $this->finishProgressBar();
                $output->writeln('');

                if (!empty($periodsNotArchived)) {
                    $output->writeln('Archiving has been skipped for following periods, as a full archiving has not yet been done: "' . implode('", "', $periodsNotArchived) . '"');
                }
            }
        }

        return self::SUCCESS;
    }

    /**
     * @param Period $period
     * @return array
     */
    protected function getDaysFromPeriod(Period $period)
    {
        $dates = [];

        if ($period instanceof Day) {
            return [$period->getDateStart()->toString()];
        }

        $subperiods = $period->getSubperiods();

        foreach ($subperiods as $subperiod) {
            if ($subperiod instanceof Day) {
                if ($subperiod->getDateStart()->isLater(Date::today())) {
                    continue; // discard days in the future
                }
                $dates[] = $subperiod->getDateStart()->toString();
            } else {
                $dates = array_merge($dates, $this->getDaysFromPeriod($subperiod));
            }
        }

        return $dates;
    }

    /**
     * @param array $dates
     * @return Period[]
     */
    protected function getPeriodsToArchive($dates, $periods)
    {
        $days = $weeks = $months = $years = [];

        sort($dates);

        if (empty($periods) || $periods === 'all') {
            $periods = array('day', 'week', 'month', 'year');
        } else {
            $periods = Common::mb_strtolower($periods);
            $periods = explode(',', $periods);
        }

        foreach ($dates as $date) {
            $date = Date::factory($date);
            if (in_array('day', $periods)) {
                $day = new Day($date);
                $days[$day->toString()] = $day;
            }
            if (in_array('week', $periods)) {
                $week                             = new Period\Week($date);
                $weeks[$week->getRangeString()]   = $week;
            }
            if (in_array('month', $periods)) {
                $month                            = new Period\Month($date);
                $months[$month->getRangeString()] = $month;
            }
            if (in_array('year', $periods)) {
                $year                             = new Period\Year($date);
                $years[$year->getRangeString()]   = $year;
            }
        }

        return $days + $weeks + $months + $years;
    }

    /**
     * Runs the Archiving for CustomReports plugin if an archive for the given period already exists
     *
     * @param int           $idSite
     * @param \Piwik\Period $period
     * @return bool
     * @throws \Piwik\Exception\UnexpectedWebsiteFoundException
     */
    protected function archiveCustomReports($idSite, $period, array $reports, $segmentCondition = '', $idReport = null)
    {
        $_GET['idSite'] = $idSite;

        $parameters = new Parameters(new Site($idSite), $period, new Segment($segmentCondition, [$idSite]));
        $parameters->setRequestedPlugin('CustomReports');

        $result    = ArchiveSelector::getArchiveIdAndVisits($parameters, $period->getDateStart()->getDateStartUTC(), false);
        $idArchive = $result ? array_shift($result) : null;

        if (empty($idArchive)) {
            return false; // ignore periods if full archiving hadn't run before
        }

        if (is_array($idArchive)) {
            // there might now be multiple archives
            $idArchive = array_shift($idArchive);
        }

        $archiveWriter            = new ArchiveWriter($parameters);
        $archiveWriter->idArchive = $idArchive;

        $logAggregator = new LogAggregator($parameters);
        if (method_exists($logAggregator, 'allowUsageSegmentCache')) {
            $logAggregator->allowUsageSegmentCache();
        }
        $archiveProcessor = new ArchiveProcessor($parameters, $archiveWriter, $logAggregator);

        $archiveProcessor->setNumberOfVisits(1, 1);

        foreach ($reports as $report) {
            if ($idReport && isset($report['idcustomreport']) && $report['idcustomreport'] != $idReport) {
                continue;
            }

            $recordBuilder = StaticContainer::getContainer()->make(CustomReport::class, ['report' => $report]);

            if ($period instanceof Day) {
                $recordBuilder->buildFromLogs($archiveProcessor);
            } else {
                $recordBuilder->buildForNonDayPeriod($archiveProcessor);
            }

            $recordBuilder->finalize($archiveProcessor);

            DataTableManager::getInstance()->deleteAll();
        }

        return true;
    }

    /**
     * @param array<int> $idSites
     * @param array<string> $segmentOptionValues
     *
     * @return array<Segment>
     */
    protected function getSegmentsToProcess(array $idSites, array $segmentOptionValues): array
    {
        $result = [];

        foreach ($segmentOptionValues as $segmentOptionValue) {
            $segmentDefinition = $this->findSegment($segmentOptionValue, $idSites);

            if (empty($segmentDefinition)) {
                continue;
            }

            $result[] = $segmentDefinition;
        }

        return $result;
    }

    /**
     * Find a segment based on ID, name, or definition.
     *
     * This method was copied from plugins/CoreAdminHome/Commands/InvalidateReportData.php
     *
     * @param array<int> $idSites
     */
    private function findSegment(string $segmentOptionValue, array $idSites)
    {
        $logger = StaticContainer::get(LoggerInterface::class);
        $allSegments = $this->getAllSegments($idSites);

        foreach ($allSegments as $segment) {
            if (
                !empty($segment['enable_only_idsite'])
                && !in_array($segment['enable_only_idsite'], $idSites)
            ) {
                continue;
            }

            if ($segmentOptionValue == $segment['idsegment']) {
                $logger->debug("Matching '$segmentOptionValue' by idsegment with segment {segment}.", ['segment' => json_encode($segment)]);
                return $segment['definition'];
            }

            if (strtolower($segmentOptionValue) == strtolower($segment['name'])) {
                $logger->debug("Matching '$segmentOptionValue' by name with segment {segment}.", ['segment' => json_encode($segment)]);
                return $segment['definition'];
            }

            if (
                $segment['definition'] == $segmentOptionValue
                || $segment['definition'] == urldecode($segmentOptionValue)
            ) {
                $logger->debug("Matching '{value}' by definition with segment {segment}.", ['value' => $segmentOptionValue, 'segment' => json_encode($segment)]);
                return $segment['definition'];
            }
        }

        $logger->warning("'$segmentOptionValue' did not match any stored segment, but invalidating it anyway.");
        return $segmentOptionValue;
    }

    /**
     * Get all the segments applicable to a specific collection of sites.
     *
     * This method was copied from plugins/CoreAdminHome/Commands/InvalidateReportData.php
     *
     * @param array<int> $idSites
     *
     * @return array<Segment>
     */
    private function getAllSegments(array $idSites): array
    {
        $segmentsByDefinition = [];

        if ([] === $idSites) {
            $idSites = [false];
        }

        foreach ($idSites as $idSite) {
            // Check if we've looked up the segments for this site before making the API call.
            $siteSegments = $this->segmentsBySite[$idSite] ?? [];
            if (empty($siteSegments)) {
                $siteSegments = API::getInstance()->getAll($idSite);
                $this->segmentsBySite[$idSite] = $siteSegments;
            }

            $siteSegmentsByDefinition = array_combine(
                array_column($siteSegments, 'definition'),
                $siteSegments
            );

            $segmentsByDefinition = array_merge(
                $segmentsByDefinition,
                $siteSegmentsByDefinition
            );
        }

        return array_values($segmentsByDefinition);
    }
}
