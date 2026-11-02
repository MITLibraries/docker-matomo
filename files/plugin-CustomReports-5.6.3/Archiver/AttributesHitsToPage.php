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

namespace Piwik\Plugins\CustomReports\Archiver;

/**
 * Marks the dimension of a metric that counts hits of one action type only, such as event hits.
 *
 * A page url or page title dimension looks up the action a hit links to. For an event hit that action
 * is the event itself, so such a dimension would not match any row at all and the metric could not
 * report a value for it. Metrics of a dimension marked with this interface report the page a hit was
 * triggered on instead, see {@link QueryBuilder::attributeHitsToPage()}.
 *
 * Metrics of such a dimension are archived in their own query as they have a discriminator, so this
 * never affects any other metric, see {@link ExecutionPlan::getMetricsPlanForGroup()}.
 *
 * This interface must not be implemented by a class within the plugin's Columns directory, as every
 * dimension in there is registered automatically and would add unwanted metrics and dimensions.
 */
interface AttributesHitsToPage
{
    /**
     * @return int action type of the hits the metric counts, one of the Action::TYPE_* constants
     */
    public function getHitActionType(): int;
}
