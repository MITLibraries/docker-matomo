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

class LimitProceededToActions extends BaseFilter
{
    /**
     * See {@link Limit}.
     *
     * @param DataTable $table
     */
    public function filter($table)
    {
        foreach ($table->getRowsWithoutSummaryRow() as $stepRow) {
            $step = $stepRow->getColumn('label');
            $nextRow = $table->getRowFromLabel($step + 1);

            if (empty($nextRow)) {
                // we need to remove all links to next interaction depth because there are is no next step
                $this->removeAllLinksToNextInteraction($stepRow);
                continue;
            }

            $nextSubtable = $nextRow->getSubtable();

            if (empty($nextSubtable)) {
                // we need to remove all links to next interaction depth because there is a next step but there were
                // no interactions for that step
                $this->removeAllLinksToNextInteraction($stepRow);
                continue;
            }

            $labelsInNextRow = $nextSubtable->getColumn('label');

            // now we keep in this subtable only labels that are used in the next step, we are only interested in
            // links between for action urls that move from step X to step X +1
            $subtable = $stepRow->getSubtable();

            if (!$subtable) {
                continue;
            }

            foreach ($subtable->getRows() as $actionRow) {
                $actionSubtable = $actionRow->getSubtable();

                if (!$actionSubtable) {
                    continue;
                }

                $deleteIds = array();
                $deleteRows = [];
                $removedVisitsSum = 0;
                foreach ($actionSubtable->getRows() as $index => $actionLinkRow) {
                    if (!in_array($actionLinkRow->getColumn('label'), $labelsInNextRow, $strict = true)) {
                        $deleteIds[] = $index;
                        $deleteRows[] = $actionLinkRow;
                        $removedVisitsSum += $actionLinkRow->getColumn(Metrics::NB_VISITS);
                    }
                }

                if ($removedVisitsSum) {
                    $this->addDeletedRowsAsSummaryRow($actionSubtable, $removedVisitsSum, $deleteRows);
                }
                $actionSubtable->deleteRows($deleteIds);
            }
        }
    }

    private function removeAllLinksToNextInteraction(Row $row)
    {
        $subtable = $row->getSubtable();

        if (!empty($subtable)) {
            foreach ($subtable->getRows() as $actionRow) {
                $actionRow->removeSubtable();
            }
        }
    }

    private function addDeletedRowsAsSummaryRow(DataTable $table, int $removedVisitsSum, array $deletedRows): void
    {
        $subtableSummaryRow = $table->getSummaryRow();
        if ($subtableSummaryRow) {
            $subtableSummaryRow->setColumn(Metrics::NB_VISITS, $subtableSummaryRow->getColumn(Metrics::NB_VISITS) + $removedVisitsSum);
        } else {
            $subtableSummaryRow = $table->addSummaryRow(new Row(array(Row::COLUMNS => array(
                'label' => DataTable::LABEL_SUMMARY_ROW,
                Metrics::NB_VISITS => $removedVisitsSum,
            ))));
        }
        if (!$subtableSummaryRow->getSubtable()) {
            $subtableSummaryRow->setSubtable(new DataTable());
        }
        $subtableSummaryRow->getSubtable()->addRowsFromArray($deletedRows);
    }
}
