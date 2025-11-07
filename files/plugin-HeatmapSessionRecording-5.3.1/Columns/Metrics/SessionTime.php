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

namespace Piwik\Plugins\HeatmapSessionRecording\Columns\Metrics;

use Piwik\Archive\DataTableFactory;
use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\DataTable;
use Piwik\DataTable\Row;
use Piwik\Date;
use Piwik\Metrics\Formatter;
use Piwik\Piwik;
use Piwik\Site;

class SessionTime extends BaseMetric
{
    /**
     * @var int
     */
    private $idSite;

    /**
     * @var string
     */
    private $timezone;

    private $dateFormat;

    public function __construct($dateFormat)
    {
        $this->dateFormat = $dateFormat;
    }

    public function getName()
    {
        return 'server_time';
    }

    public function getTranslatedName()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnTime');
    }

    public function getDocumentation()
    {
        return Piwik::translate('HeatmapSessionRecording_ColumnTimeDocumentation');
    }

    public function compute(Row $row)
    {
        return $this->getMetric($row, 'server_time');
    }

    public function getDependentMetrics()
    {
        return array($this->getName());
    }

    public function format($value, Formatter $formatter)
    {
        $date = Date::factory($value, $this->timezone);

        $dateTimeFormatProvider = StaticContainer::get('Piwik\Intl\Data\Provider\DateTimeFormatProvider');

        $template = $dateTimeFormatProvider->getFormatPattern($this->dateFormat);
        $template = str_replace(array(' y ', '.y '), ' ', $template);

        return $date->getLocalized($template);
    }

    public function beforeFormat($report, DataTable $table)
    {
        $this->idSite = DataTableFactory::getSiteIdFromMetadata($table);
        if (empty($this->idSite)) {
            $this->idSite = Common::getRequestVar('idSite', 0, 'int');
        }
        if (!empty($this->idSite)) {
            $this->timezone = Site::getTimezoneFor($this->idSite);
            return true;
        }
        return false; // skip formatting if there is no site to get currency info from
    }
}
