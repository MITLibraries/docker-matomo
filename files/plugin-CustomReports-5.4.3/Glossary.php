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

use Piwik\API\Request;
use Piwik\Common;

class Glossary
{
    /**
     * @var API
     */
    private $api;

    public function __construct(API $api)
    {
        $this->api = $api;
    }

    public function getMetricsAndDimensions()
    {
        $result = [];

        $allDimensions = Request::processRequest('CustomReports.getAvailableDimensions');
        foreach ($allDimensions as $categoryId => $category) {
            foreach ($category['dimensions'] as $dimension) {
                $result[] = [
                    'name' => $dimension['name'],
                    'subtitle' => 'CustomReports_Dimension',
                    'documentation' => '',
                    'id' => $dimension['uniqueId'],
                ];
            }
        }

        $allMetrics = Request::processRequest('CustomReports.getAvailableMetrics');
        foreach ($allMetrics as $categoryId => $category) {
            foreach ($category['metrics'] as $metric) {
                $result[] = [
                    'name' => $metric['name'],
                    'subtitle' => 'General_Metric',
                    'documentation' => Common::sanitizeInputValue($metric['description']), // uses |raw in twig template
                    'id' => $metric['uniqueId'],
                    'is_metric' => true,
                ];
            }
        }

        usort($result, function ($a, $b) {
            return strcmp($this->cleanName($a['name']), $this->cleanName($b['name']));
        });

        return $result;
    }

    private function cleanName($name)
    {
        $name = preg_replace('/[\'"]/', '', $name);
        $name = strtolower($name);
        return $name;
    }
}
