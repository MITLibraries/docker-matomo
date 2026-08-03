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
  <div class="heatmapEmptyState">
    <div class="heatmapEmptyStateIcon">
      <img
        v-if="state === 'noInteractions'"
        src="plugins/HeatmapSessionRecording/images/no-interactions.svg"
        width="34"
        height="38"
        alt=""
      />
      <span v-else class="icon-delete"></span>
    </div>
    <h3 class="heatmapEmptyStateTitle">{{ title }}</h3>
    <p class="heatmapEmptyStateSubtitle">{{ subtitle }}</p>
    <template v-if="state === 'deletedManual'">
      <div class="heatmapEmptyStateCodeWrapper">
        <pre
          class="heatmapEmptyStateCode"
          v-copy-to-clipboard="{}"
          v-text="captureCommand"
        ></pre>
      </div>
      <a
        class="heatmapEmptyStateGuide btn"
        target="_blank"
        rel="noreferrer noopener"
        :href="guideUrl"
      >
        {{ translate('HeatmapSessionRecording_ReadTheGuide') }}
      </a>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { translate, externalRawLink, CopyToClipboard } from 'CoreHome';

const GUIDE_URL = 'https://matomo.org/faq/heatmap-session-recording/how-to-capture-the-initial-heatmap-snapshot-manually/';

export default defineComponent({
  directives: {
    CopyToClipboard,
  },
  props: {
    // one of: noInteractions, deletedAuto, deletedManual, deletedPaused, deletedNoRetake
    state: {
      type: String,
      required: true,
    },
    idSiteHsr: {
      type: Number,
      required: true,
    },
  },
  computed: {
    title() {
      if (this.state === 'noInteractions') {
        return translate('HeatmapSessionRecording_EmptyStateNoInteractionsTitle');
      }

      return translate('HeatmapSessionRecording_EmptyStateSnapshotDeletedTitle');
    },
    subtitle() {
      switch (this.state) {
        case 'noInteractions':
          return translate('HeatmapSessionRecording_EmptyStateNoInteractionsSubtitle');
        case 'deletedManual':
          return translate('HeatmapSessionRecording_EmptyStateSnapshotDeletedManualSubtitle');
        case 'deletedPaused':
          return translate('HeatmapSessionRecording_EmptyStateSnapshotDeletedPausedSubtitle');
        case 'deletedNoRetake':
          return translate('HeatmapSessionRecording_EmptyStateSnapshotDeletedEndedSubtitle');
        default:
          return translate('HeatmapSessionRecording_EmptyStateSnapshotDeletedAutoSubtitle');
      }
    },
    captureCommand() {
      return `_paq.push(['HeatmapSessionRecording::captureInitialDom', ${this.idSiteHsr}])`;
    },
    guideUrl() {
      // externalRawLink adds the matomo.org campaign parameters to the FAQ URL.
      return externalRawLink(GUIDE_URL);
    },
  },
});
</script>
