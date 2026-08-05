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

namespace Piwik\Plugins\HeatmapSessionRecording\DataTable\Filter;

use Piwik\DataTable;
use Piwik\Piwik;

class EnrichRecordedSessions extends DataTable\BaseFilter
{
    public static function shortUrl($label)
    {
        $potentialUrl = $label;
        if (strpos($label, '//') === 0) {
            $potentialUrl = 'http:' . $label;
        } elseif (strpos($label, '://') === false) {
            $potentialUrl = 'http://' . $label;
        }

        $path = @parse_url($potentialUrl, PHP_URL_PATH);

        if (!empty($path)) {
            return $path;
        } else {
            $query = @parse_url($potentialUrl, PHP_URL_QUERY);
            if (!empty($query)) {
                return '?' . $query;
            }
        }

        return $label;
    }

    public static function getBlockedFields()
    {
        // userId and locationIp is currently not fetched but adding it already now to make sure we won't
        // leak such information in case it gets added in future
        return array('idvisitor', 'user_id', 'location_ip', 'config_id');
    }

    /**
     * @param DataTable $table
     */
    public function filter($table)
    {
        $isAnonymous = Piwik::isUserIsAnonymous();

        foreach ($table->getRowsWithoutSummaryRow() as $row) {
            if ($isAnonymous) {
                foreach (self::getBlockedFields() as $blockedField) {
                    if ($row->getColumn($blockedField) !== false) {
                        $row->setColumn($blockedField, false);
                    }
                }
            } else {
                $row->setColumn('idvisitor', bin2hex($row->getColumn('idvisitor')));
            }
        }
    }
}
