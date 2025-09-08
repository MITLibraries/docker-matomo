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

namespace Piwik\Plugins\CustomReports;

class Archiver extends \Piwik\Plugin\Archiver
{
    public const RECORDNAME_PREFIX = "CustomReports_customreport_";

    public const LABEL_NOT_DEFINED = 'CustomReports_LabelNotDefined';

    public static function makeRecordName($idCustomReport, $revision)
    {
        return self::RECORDNAME_PREFIX . (int) $idCustomReport . '_' . (int) $revision;
    }

    public static function makeEvolutionRecordNamePrefix($idCustomReport, $revision)
    {
        return self::makeRecordName($idCustomReport, $revision) . '_';
    }

    public static function makeEvolutionRecordName($idCustomReport, $revision, $metricName)
    {
        return self::makeEvolutionRecordNamePrefix($idCustomReport, $revision) . $metricName;
    }
}
