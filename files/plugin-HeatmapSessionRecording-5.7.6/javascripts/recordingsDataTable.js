/*!
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

/**
 * This file adds an always visible play button to the label column of the recorded sessions report.
 */

(function ($, require) {

    var exports = require('piwik/UI'),
        DataTable = exports.DataTable,
        DataTablePrototype = DataTable.prototype;

    function getMetadataFromRow(tr)
    {
        var metadata = $(tr).attr('data-row-metadata');

        if (!metadata) {
            return null;
        }

        try {
            return JSON.parse(metadata);
        } catch (e) {
            return null;
        }
    }

    exports.HsrRecordingsDataTable = function (element) {
        DataTable.call(this, element);
    };

    $.extend(exports.HsrRecordingsDataTable.prototype, DataTablePrototype, {
        preBindEventsAndApplyStyleHook: function (domElem) {
            var idSite = parseInt(this.param.idSite, 10) || parseInt(piwik.idSite, 10);

            $('table > tbody > tr', domElem).each(function () {
                var tr = $(this);

                if (tr.is('.comparisonRow, .comparePeriod, .totalsRow, .summaryRow, .nodata')) {
                    return;
                }

                var td = tr.children('td.label').first();

                if (!td.length || td.children('a.hsrPlayRecording').length) {
                    return;
                }

                var metadata = getMetadataFromRow(tr);

                if (!metadata) {
                    return;
                }

                var idLogHsr = parseInt(metadata.idloghsr, 10);
                var idSiteHsr = parseInt(metadata.idsitehsr, 10);

                if (!idLogHsr || !idSiteHsr) {
                    return;
                }

                var title = metadata.idvisit
                    ? _pk_translate('HeatmapSessionRecording_PlayRecordedSession')
                    : _pk_translate('HeatmapSessionRecording_PlayRecordedPageview');

                var link = $('<a></a>').attr({
                    'class': 'hsrPlayRecording',
                    'href': '?module=HeatmapSessionRecording&action=replayRecording&idSite=' + idSite + '&idLogHsr=' + idLogHsr + '&idSiteHsr=' + idSiteHsr,
                    'target': '_blank',
                    'rel': 'noreferrer noopener',
                    'title': title,
                    'aria-label': title
                });

                link.append($('<span></span>').attr({ 'class': 'icon-play', 'aria-hidden': 'true' }));

                link.on('click', function (e) {
                    e.stopPropagation();
                });

                var insertBefore = td.children('a, span.cell-tooltip, span.label').first();

                if (insertBefore.length) {
                    insertBefore.before(link);
                } else {
                    td.prepend(link);
                }
            });
        }
    });

})(jQuery, require);
