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
  <div class="alert alert-warning" v-html="getJsNotWritableErrorMessage()"
       v-if="!isMatomoJsWritable">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { translate } from 'CoreHome';

export default defineComponent({
  props: {
    recordingType: {
      type: String,
      required: true,
    },
    isMatomoJsWritable: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    getJsNotWritableErrorMessage() {
      return translate(
        'HeatmapSessionRecording_MatomoJSNotWritableErrorMessage',
        this.recordingType,
        '<a href="https://developer.matomo.org/guides/heatmap-session-recording/setup#when-the-matomojs-in-your-piwik-directory-file-is-not-writable" target="_blank" rel="noreferrer noopener">',
        '</a>',
      );
    },
  },
});
</script>
