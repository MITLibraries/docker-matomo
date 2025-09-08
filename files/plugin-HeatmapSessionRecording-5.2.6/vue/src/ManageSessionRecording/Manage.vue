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
    :recording-type="translate('HeatmapSessionRecording_SessionRecordings')"
  />
  <div class="manageHsr">
    <div v-show="!editMode">
      <SessionRecordingList
        :pause-reason="pauseReason"
      />
    </div>
    <div v-show="editMode">
      <SessionRecordingEdit
        :id-site-hsr="idSiteHsr"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { Matomo, MatomoUrl, NotificationsStore } from 'CoreHome';
import SessionRecordingEdit from './Edit.vue';
import SessionRecordingList from './List.vue';
import MatomoJsNotWritableAlert from '../MatomoJsNotWritable/MatomoJsNotWritableAlert.vue';

interface SessionRecordingManageState {
  editMode: boolean;
  idSiteHsr: number|null;
}

export default defineComponent({
  props: {
    pauseReason: String,
    isMatomoJsWritable: {
      type: Boolean,
      required: true,
    },
  },
  data(): SessionRecordingManageState {
    return {
      editMode: false,
      idSiteHsr: null,
    };
  },
  components: {
    MatomoJsNotWritableAlert,
    SessionRecordingEdit,
    SessionRecordingList,
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
          Matomo.postEvent('HeatmapSessionRecording.initAddSessionRecording', parameters);

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
