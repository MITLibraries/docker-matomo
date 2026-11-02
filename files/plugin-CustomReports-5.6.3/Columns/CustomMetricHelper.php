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

namespace Piwik\Plugins\CustomReports\Columns;

use Piwik\Columns\Dimension;
use Piwik\Columns\DimensionMetricFactory;
use Piwik\Columns\MetricsList;
use Piwik\Piwik;
use Piwik\Plugin\ArchivedMetric;
use Piwik\Plugin\ComputedMetric;
use Piwik\Plugin\Manager;
use Piwik\Plugin\Metric;
use Piwik\Plugins\CustomReports\Archiver\AttributesHitsToPage;
use Piwik\Tracker\Action;

class CustomMetricHelper
{
    public function customizeMetricForCustomReports(Metric $metric): void
    {
        if (!method_exists($metric, 'setTranslatedName')) {
            return;
        }

        if ($metric->getName() === 'sum_events_totalevents') {
            $metric->setTranslatedName('CustomReports_TotalEventsLegacy');
        } elseif ($metric->getName() === 'nb_events') {
            $metric->setTranslatedName('CustomReports_NbEventsMetric');
        }
    }

    public function getAllMetrics(): MetricsList
    {
        $metrics = MetricsList::get();
        $this->addCustomMetricsToList($metrics);

        return $metrics;
    }

    public function addCustomMetricsToList(MetricsList $metricsList)
    {
        if (Manager::getInstance()->isPluginActivated('Actions')) {
            $dimensionMetricFactory = new DimensionMetricFactory(new \Piwik\Plugins\Actions\Columns\ClickedUrl());
            $metric1 = $dimensionMetricFactory->createMetric(ArchivedMetric::AGGREGATION_COUNT);
            $metricsList->addMetric($metric1);
        }

        if (Manager::getInstance()->isPluginActivated('Contents')) {
            $contentInteractionDimension = new \Piwik\Plugins\Contents\Columns\ContentInteraction();
            $dimensionMetricFactory = new DimensionMetricFactory($contentInteractionDimension);
            $metric2 = $dimensionMetricFactory->createMetric(ArchivedMetric::AGGREGATION_COUNT);
            $metricsList->addMetric($metric2);

            // This is necessary to make sure that the result set isn't restricted to only rows with a value
            // This also makes sure that the metric name is correct
            $impressionDimension = new class () extends \Piwik\Plugins\Contents\Columns\ContentInteraction {
                protected $nameSingular = 'Contents_ContentImpression';
                protected $namePlural = 'CustomReports_ContentImpressions';

                public function getDbDiscriminator()
                {
                    return null;
                }
            };
            $dimensionMetricFactory = new DimensionMetricFactory($impressionDimension);
            $contentImporessionsTranslation = Piwik::translate('CustomReports_ContentImpressions');
            $metric3 = $dimensionMetricFactory->createCustomMetric('nb_content_impressions', $contentImporessionsTranslation, 'sum(case when %s IS NOT NULL then 0 else 1 end)');
            $metric3->setDocumentation(Piwik::translate('General_ComputedMetricCountDocumentation', $contentImporessionsTranslation));
            $metricsList->addMetric($metric3);

            $dimensionMetricFactory = new DimensionMetricFactory($contentInteractionDimension);
            $metric4 = $dimensionMetricFactory->createComputedMetric($metric2->getName(), $metric3->getName(), ComputedMetric::AGGREGATION_RATE);
            $metric4->setName($contentInteractionDimension->getMetricId() . '_' . ComputedMetric::AGGREGATION_RATE);
            $metric4->setTranslatedName(Piwik::translate('General_ComputedMetricRate', $contentInteractionDimension->getName()));
            $metricsList->addMetric($metric4);
        }

        if (Manager::getInstance()->isPluginActivated('Events')) {
            // Counts hits the same way the "hits" metric does, but only those that are an event. A hit
            // is identified as an event by its event category, which is set for every event, and not by
            // its action type: the action type is only reachable through the url action, so events that
            // were tracked without a url would not be counted at all.
            // The dimension must not be a class within this directory as every dimension in here is
            // registered automatically, which would replace the "hits" metric it inherits.
            $eventHitsDimension = new class () extends \Piwik\Plugins\CoreHome\Columns\LinkVisitActionId implements AttributesHitsToPage {
                public function getHitActionType(): int
                {
                    return Action::TYPE_EVENT;
                }
            };
            $dimensionMetricFactory = new DimensionMetricFactory($eventHitsDimension);
            $metric5 = $dimensionMetricFactory->createCustomMetric(
                'nb_events',
                // the name is translated when it is read, the documentation is not
                'CustomReports_NbEventsMetric',
                'count(distinct case when log_link_visit_action.idaction_event_category IS NOT NULL then %s end)',
                Piwik::translate('CustomReports_NbEventsMetricDocumentation'),
                Dimension::TYPE_NUMBER
            );
            $metric5->setCategory('Events_Events');
            $metricsList->addMetric($metric5);
        }

        if (!Manager::getInstance()->isPluginActivated('Ecommerce')) {
            return;
        }

        $this->buildProductDimensionMetrics($metricsList, new \Piwik\Plugins\Ecommerce\Columns\ProductPrice(), 'General_Price');
        $this->buildProductDimensionMetrics($metricsList, new \Piwik\Plugins\Ecommerce\Columns\ProductQuantity(), 'General_Quantity');
    }

    protected function buildProductDimensionMetrics(MetricsList $metricsList, Dimension $dimension, string $baseProductSingular)
    {
        $dimensionMetricFactory = new DimensionMetricFactory($dimension);

        $metric1 = $dimensionMetricFactory->createMetric(ArchivedMetric::AGGREGATION_COUNT_WITH_NUMERIC_VALUE);
        $metric1->setName('conversion_items_with_' . $dimension->getMetricId());
        $metric1->setTranslatedName(Piwik::translate('CustomReports_ProductsWithX', Piwik::translate($baseProductSingular)));
        $metricsList->addMetric($metric1);

        $metric2 = $dimensionMetricFactory->createComputedMetric('sum_' . $dimension->getMetricId(), $metric1->getName(), ComputedMetric::AGGREGATION_AVG);
        $metric2->setName(ComputedMetric::AGGREGATION_AVG . '_' . $dimension->getMetricId());
        $metric2->setTranslatedName(Piwik::translate('General_AverageX', $dimension->getName()));
        $metricsList->addMetric($metric2);

        if ($dimension->getMetricId() === 'ecommerce_productprice') {
            $productRevenueTranslation = Piwik::translate('General_ProductRevenue');
            $translatedName = Piwik::translate('General_ComputedMetricSum', $productRevenueTranslation);
            $metric3 = $dimensionMetricFactory->createCustomMetric('sum_product_revenue', $translatedName, 'sum(case when %s > 0 then `price` * `quantity` else 0 end)');
            $metric3->setDocumentation(Piwik::translate('General_ComputedMetricSumDocumentation', $productRevenueTranslation));
            $metricsList->addMetric($metric3);

            $metric4 = $dimensionMetricFactory->createComputedMetric($metric3->getName(), 'conversion_items_with_ecommerce_productprice', ComputedMetric::AGGREGATION_AVG);
            $metric4->setName('avg_product_revenue');
            $metric4->setTranslatedName(Piwik::translate('General_AverageX', $productRevenueTranslation));
            $productWithPriceTranslation = Piwik::translate('CustomReports_ProductsWithX', Piwik::translate('General_Price'));
            $metric4->setDocumentation(Piwik::translate('General_ComputedMetricAverageDocumentation', [$productRevenueTranslation, $productWithPriceTranslation]));
            $metricsList->addMetric($metric4);
        }
    }
}
