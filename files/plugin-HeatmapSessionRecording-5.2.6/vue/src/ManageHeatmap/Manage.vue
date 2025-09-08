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
  <MatomoJsNotWritableAlert
    v-if="!editMode"
    :is-matomo-js-writable="isMatomoJsWritable"
    :recording-type="translate('HeatmapSessionRecording_Heatmaps')"
  />
  <div class="manageHsr" ref="root">
    <div v-if="!editMode">
      <HeatmapList
        :pause-reason="pauseReason"
      />
    </div>
    <div v-if="editMode">
      <HeatmapEdit
        :breakpoint-mobile="breakpointMobile"
        :breakpoint-tablet="breakpointTablet"
        :id-site-hsr="idSiteHsr"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import {
  Matomo,
  MatomoUrl,
  NotificationsStore,
} from 'CoreHome';
import HeatmapList from './List.vue';
import HeatmapEdit from './Edit.vue';
import MatomoJsNotWritableAlert from '../MatomoJsNotWritable/MatomoJsNotWritableAlert.vue';

interface HeatmapManageState {
  editMode: boolean;
  idSiteHsr: number|null;
}

const { $ } = window;

export default defineComponent({
  props: {
    breakpointMobile: Number,
    breakpointTablet: Number,
    pauseReason: String,
    isMatomoJsWritable: {
      type: Boolean,
      required: true,
    },
  },
  data(): HeatmapManageState {
    return {
      editMode: false,
      idSiteHsr: null,
    };
  },
  components: {
    MatomoJsNotWritableAlert,
    HeatmapList,
    HeatmapEdit,
  },
  watch: {
    editMode() {
      // when changing edit modes, the tooltip can sometimes get stuck on the screen
      $('.ui-tooltip').remove();
    },
  },
  created() {
    // doing this in a watch because we don't want to post an event in a computed property
    watch(() => MatomoUrl.hashParsed.value.idSiteHsr as string, (idSiteHsr) => {
      this.initState(idSiteHsr);
    });

    this.initState(MatomoUrl.hashParsed.value.idSiteHsr as string);
  },
  methods: {
    removeAnyHsrNotification() {
      NotificationsStore.remove('hsrmanagement');
    },
    initState(idSiteHsr?: string) {
      if (idSiteHsr) {
        if (idSiteHsr === '0') {
          const parameters = {
            isAllowed: true,
          };
          Matomo.postEvent('HeatmapSessionRecording.initAddHeatmap', parameters);

          if (parameters && !parameters.isAllowed) {
            this.editMode = false;
            this.idSiteHsr = null;
            return;
          }
        }

        this.editMode = true;
        this.idSiteHsr = parseInt(idSiteHsr, 10);
      } else {
        this.editMode = false;
        this.idSiteHsr = null;
      }

      this.removeAnyHsrNotification();
    },
  },
});
</script>
