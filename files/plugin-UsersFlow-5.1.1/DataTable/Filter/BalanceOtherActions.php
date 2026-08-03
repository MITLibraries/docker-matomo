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
 *
 */

namespace Piwik\Plugins\UsersFlow\DataTable\Filter;

use Piwik\DataTable;
use Piwik\DataTable\Row;
use Piwik\DataTable\BaseFilter;
use Piwik\Plugins\UsersFlow\Metrics;

class BalanceOtherActions extends BaseFilter
{
    /**
     * See {@link Limit}.
     *
     * @param DataTable $table
     */
    public function filter($table)
    {
        // Due to ranking query too many rows gets classified into others sometimes and due to that we do not show correct no of incoming links to a node
        // This filter aims to balance the links from other nodes, so that correct no of incoming links is shown
        foreach ($table->getRowsWithoutSummaryRow() as $stepRow) {
            $step = $stepRow->getColumn('label');
            $nextRow = $table->getRowFromLabel($step + 1);

            // No need to go ahead if nextRow is empty as there is no row to balance the count
            if (empty($nextRow)) {
                continue;
            }

            $nextSubtable = $nextRow->getSubtable();

            if (empty($nextSubtable)) {
                continue;
            }

            // Get the labels of next row and its visits, E.g ['label1' => 5, 'label2' => 17, -1 => '35]
            $labelsInNextRow = [];
            foreach ($nextSubtable->getRows() as $nextSubtableRow) {
                $labelsInNextRow[$nextSubtableRow->getColumn('label')] = $nextSubtableRow->getColumn(Metrics::NB_VISITS);
            }

            if (!$labelsInNextRow) {
                continue;
            }

            $subtable = $stepRow->getSubtable();

            if (!$subtable) {
                continue;
            }

            $summaryRow = $subtable->getSummaryRow();
            if (!$summaryRow) {
                continue;
            }
            $summaryRowSubTable = $summaryRow->getSubtable();
            if (!$summaryRowSubTable) {
                continue;
            }
            // Now check if all the labels in next row has incoming links and deduct the visits count
            // $labelsInNextRow = ['label1' => 5, 'label2' => 17, -1 => '35];
            // E.g if label 1 is part of subtable with 4 visits, this would change the $labelsInNextRow to ['label1' => 1, 'label2' => 17, -1 => '35]
            // Run the same iteration with summary row and calculate the sum for further check
            $this->reduceLabelsInNextRow($subtable, $labelsInNextRow);
            $summaryRowSubTableSum = 0;
            $this->reduceLabelsInNextRow($summaryRowSubTable, $labelsInNextRow, $summaryRowSubTableSum);

            // Sum the next label to determine if there is any label left to balance
            $nextLabelSum = array_sum($labelsInNextRow);
            // nb_proceeded is a calculated field, so we determine it manually here to match the counts
            $othersProceeded = $summaryRow->getColumn(Metrics::NB_VISITS) - $summaryRow->getColumn(Metrics::NB_EXITS);
            // We balance only when the counts are equal
            if (($othersProceeded - ($nextLabelSum + $summaryRowSubTableSum)) !== 0) {
                continue;
            }
            foreach ($labelsInNextRow as $label => $nbVisits) {
                // Balance only when any visits left and no corresponding inflow node is found
                if ($nbVisits > 0) {
                    $existingRow = $summaryRowSubTable->getRowFromLabel($label);
                    if ($existingRow) {
                        $existingRow->setColumn(Metrics::NB_VISITS, $existingRow->getColumn(Metrics::NB_VISITS) + $nbVisits);
                    } else {
                        $summaryRowSubTable->addRow(new Row(array(Row::COLUMNS => array(
                            'label' => $label,
                            Metrics::NB_VISITS => $nbVisits,
                        ))));
                    }
                }
            }
            $summaryRowSubTable->filter('Sort', array(Metrics::NB_VISITS));
        }
    }

    private function reduceLabelsInNextRow(DataTable $table, array &$labelsInNextRow, int &$sum = 0): void
    {
        foreach ($table->getRows() as $subtableRow) {
            $subtableRowSubTable = $subtableRow->getSubtable();
            $sum = $sum + $subtableRow->getColumn(Metrics::NB_VISITS);
            if ($subtableRowSubTable) {
                foreach ($subtableRowSubTable->getRows() as $subtableRowSubTableRow) {
                    $label = $subtableRowSubTableRow->getColumn('label');
                    if (isset($labelsInNextRow[$label])) {
                        $labelsInNextRow[$label] = $labelsInNextRow[$label] - $subtableRowSubTableRow->getColumn(Metrics::NB_VISITS);
                    }
                }
            }
        }
    }
}
