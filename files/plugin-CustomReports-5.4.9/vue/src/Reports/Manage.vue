<!--
  Copyright (C) InnoCraft Ltd - All rights reserved.

  NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
  The intellectual and technical concepts contained herein are protected by trade secret
  or copyright law. Redistribution of this information or reproduction of this material is
  strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.

  You shall use this code only in accordance with the license agreement obtained from
  InnoCraft Ltd.

  @link https://www.innocraft.com/
  @license For license details see https://www.innocraft.com/license
-->

<template>
  <div class="manageReports">
    <div v-if="!editMode">
      <CustomReportsList />
    </div>
    <div v-if="editMode">
      <CustomReportsEdit
        :id-custom-report="idCustomReport"
        :browser-archiving-disabled="browserArchivingDisabled"
        :re-archive-last-n="reArchiveLastN"
        :max-dimensions="maxDimensions"
        :is-cloud="isCloud"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { Matomo, MatomoUrl, NotificationsStore } from 'CoreHome';
import CustomReportsList from './List.vue';
import CustomReportsEdit from './Edit.vue';

interface ReportsManageState {
  editMode: boolean;
  idCustomReport: null|number;
}

export default defineComponent({
  props: {
    browserArchivingDisabled: Boolean,
    reArchiveLastN: Number,
    maxDimensions: Number,
    isCloud: Boolean,
  },
  components: {
    CustomReportsList,
    CustomReportsEdit,
  },
  data(): ReportsManageState {
    return {
      editMode: false,
      idCustomReport: null,
    };
  },
  watch: {
    editMode() {
      // when changing edit modes, the tooltip can sometimes get stuck on the screen
      $('.ui-tooltip').remove();
    },
  },
  created() {
    // doing this in a watch because we don't want to post an event in a computed property
    watch(() => MatomoUrl.hashParsed.value.idCustomReport as string, (idCustomReport) => {
      this.initState(idCustomReport);
    });

    this.initState(MatomoUrl.hashParsed.value.idCustomReport as string);
  },
  methods: {
    removeAnyReportNotification(shouldHideProductMetricNotification = true) {
      NotificationsStore.remove('reportsmanagement');
      if (shouldHideProductMetricNotification) {
        NotificationsStore.remove('reportsmanagementProductMetric');
      }
    },
    initState(idCustomReport?: string) {
      if (idCustomReport) {
        if (idCustomReport === '0') {
          const parameters = {
            isAllowed: true,
          };
          Matomo.postEvent('CustomReports.initAddReport', parameters);

          if (parameters && !parameters.isAllowed) {
            this.editMode = false;
            this.idCustomReport = null;
            return;
          }
        }

        this.editMode = true;
        this.idCustomReport = parseInt(idCustomReport, 10);
      } else {
        this.editMode = false;
        this.idCustomReport = null;
      }

      this.removeAnyReportNotification(!idCustomReport);
    },
  },
});
</script>
