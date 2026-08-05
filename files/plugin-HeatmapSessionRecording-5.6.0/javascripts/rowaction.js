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
 * This file registers the Overlay row action on the pages report.
 */

(function () {

    var actionNameProfile = 'HsrVisitorProfile';
    var actionNamePlay = 'HsrPlayRecording';
    var actionNameDelete = 'HsrDeleteRecording';

    function getMetadataFromRow(tr)
    {
        if (tr) {
            return JSON.parse($(tr).attr('data-row-metadata') || '{}');
        }
    }

    function DataTable_RowActions_HsrVisitorProfile(dataTable) {
        this.dataTable = dataTable;
        this.actionName = actionNameProfile;
    }

    DataTable_RowActions_HsrVisitorProfile.prototype = new DataTable_RowAction();

    DataTable_RowActions_HsrVisitorProfile.prototype.trigger = function (tr, e, subTableLabel) {
        var metadata = getMetadataFromRow(tr);
        broadcast.propagateNewPopoverParameter('visitorProfile', metadata.idvisitor);
    };

    function DataTable_RowActions_HsrPlayRecording(dataTable) {
        this.dataTable = dataTable;
        this.actionName = actionNamePlay;
    }

    DataTable_RowActions_HsrPlayRecording.prototype = new DataTable_RowAction();

    DataTable_RowActions_HsrPlayRecording.prototype.trigger = function (tr, e, subTableLabel) {
        var metadata = getMetadataFromRow(tr);
        var idsite = parseInt(this.dataTable.param.idSite, 10);
        var idLogHsr = parseInt(metadata.idloghsr, 10);
        var idSiteHsr = parseInt(metadata.idsitehsr, 10);
        window.open('?module=HeatmapSessionRecording&action=replayRecording&idSite=' + idsite + '&idLogHsr=' + idLogHsr + '&idSiteHsr=' + idSiteHsr);
    };

    function DataTable_RowActions_HsrDeleteRecording(dataTable) {
        this.dataTable = dataTable;
        this.actionName = actionNameDelete;
    }

    DataTable_RowActions_HsrDeleteRecording.prototype = new DataTable_RowAction();

    DataTable_RowActions_HsrDeleteRecording.prototype.trigger = function (tr, e, subTableLabel) {
        var metadata = getMetadataFromRow(tr);

        var idloghsr = metadata.idloghsr;
        var idsitehsr = metadata.idsitehsr;

        var params = {
            module: 'API',
            method: 'HeatmapSessionRecording.deleteRecordedPageview',
            idLogHsr: idloghsr,
            idSiteHsr: idsitehsr,
            format: 'json'
        };

        if (metadata.idvisit) {
            params.method = 'HeatmapSessionRecording.deleteRecordedSession';
            params.idVisit = metadata.idvisit;
        }

        var ajaxRequest = new ajaxHelper();
        ajaxRequest.withTokenInUrl();
        ajaxRequest.addParams(params, 'get');
        ajaxRequest.setCallback(function (id) { });
        ajaxRequest.send();

        // we directly remove the node for better UX and assume the removal works
        $(tr).remove();
    };

    DataTable_RowActions_Registry.register({
        name: actionNameProfile,

        dataTableIcon: 'icon-visitor-profile',

        order: 53,

        dataTableIconTooltip: [
            _pk_translate('Live_ViewVisitorProfile'),
            ''
        ],

        isAvailableOnReport: function (dataTableParams, undefined) {
            return dataTableParams && dataTableParams.module === 'HeatmapSessionRecording' && dataTableParams.action === 'getRecordedSessions' && piwik.visitorProfileEnabled;
        },

        isAvailableOnRow: function (dataTableParams, tr) {
            return true;
        },

        createInstance: function (dataTable, param) {
            if (dataTable !== null && typeof dataTable.hsrVisitorProfileInstance !== 'undefined') {
                return dataTable.hsrVisitorProfileInstance;
            }

            var instance = new DataTable_RowActions_HsrVisitorProfile(dataTable);
            if (dataTable !== null) {
                dataTable.hsrVisitorProfileInstance = instance;
            }

            return instance;
        }
    });


    DataTable_RowActions_Registry.register({
        name: actionNamePlay,

        dataTableIcon: 'icon-play',

        order: 51,

        dataTableIconTooltip: [
            _pk_translate('HeatmapSessionRecording_PlayRecordedSession'),
            ''
        ],

        isAvailableOnReport: function (dataTableParams, undefined) {
            return dataTableParams && dataTableParams.module === 'HeatmapSessionRecording' && dataTableParams.action === 'getRecordedSessions';
        },

        isAvailableOnRow: function (dataTableParams, tr) {
            return true;
        },

        createInstance: function (dataTable, param) {
            if (dataTable !== null && typeof dataTable.hsrPlayRecordingInstance !== 'undefined') {
                return dataTable.hsrPlayRecordingInstance;
            }

            var instance = new DataTable_RowActions_HsrPlayRecording(dataTable);
            if (dataTable !== null) {
                dataTable.hsrPlayRecordingInstance = instance;
            }

            return instance;
        }
    });


    DataTable_RowActions_Registry.register({
        name: actionNameDelete,

        dataTableIcon: 'icon-delete',

        order: 55,

        dataTableIconTooltip: [
            _pk_translate('HeatmapSessionRecording_DeleteRecordedSession'),
            ''
        ],

        isAvailableOnReport: function (dataTableParams, undefined) {
            if (!dataTableParams || !dataTableParams.writeAccess) {
                return false;
            }

            return dataTableParams && dataTableParams.module === 'HeatmapSessionRecording' && dataTableParams.action === 'getRecordedSessions';
        },

        isAvailableOnRow: function (dataTableParams, tr) {
            var metadata = getMetadataFromRow(tr);

            if (metadata.idvisit) {
                this.dataTableIconTooltip[0] = _pk_translate('HeatmapSessionRecording_DeleteRecordedSession');
            } else {
                this.dataTableIconTooltip[0] = _pk_translate('HeatmapSessionRecording_DeleteRecordedPageview');
            }

            return true;
        },

        createInstance: function (dataTable, param) {
            if (dataTable !== null && typeof dataTable.hsrDeleteRecordingInstance !== 'undefined') {
                return dataTable.hsrDeleteRecordingInstance;
            }

            var instance = new DataTable_RowActions_HsrDeleteRecording(dataTable);
            if (dataTable !== null) {
                dataTable.hsrDeleteRecordingInstance = instance;
            }

            return instance;
        }
    });

})();
