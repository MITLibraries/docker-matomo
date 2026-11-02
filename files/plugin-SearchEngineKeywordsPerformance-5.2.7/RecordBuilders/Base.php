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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\RecordBuilders;

use Piwik\ArchiveProcessor\RecordBuilder;
use Piwik\Config as PiwikConfig;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Metrics;

abstract class Base extends RecordBuilder
{
    public function __construct()
    {
        parent::__construct();
        $this->maxRowsInTable = PiwikConfig::getInstance()->General['datatable_archiving_maximum_rows_referrers'];
        $this->columnToSortByBeforeTruncation = Metrics::NB_CLICKS;
        $this->columnAggregationOps = Metrics::getColumnsAggregationOperations();
    }
}
