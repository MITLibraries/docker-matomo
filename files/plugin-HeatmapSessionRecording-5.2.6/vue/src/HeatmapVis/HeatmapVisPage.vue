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
  <div>
    <h2 class="heatmap-vis-title">
      <EnrichedHeadline
        :edit-url="editUrl"
        :inline-help="inlineHelp"
      >
        {{ translate('HeatmapSessionRecording_HeatmapX', `"${heatmap.name}"`) }}
      </EnrichedHeadline>
    </h2>

    <MatomoJsNotWritableAlert
      :is-matomo-js-writable="isMatomoJsWritable"
      :recording-type="translate('HeatmapSessionRecording_Heatmaps')"
    />

    <div class="alert alert-info heatmap-country-alert" v-if="includedCountries">
      {{ translate('HeatmapSessionRecording_HeatmapInfoTrackVisitsFromCountries',
      includedCountries) }}
    </div>

    <div v-if="heatmap.page_treemirror">
      <HeatmapVis
        :created-date="createdDate"
        :excluded-elements="heatmap.excluded_elements"
        :num-samples="heatmapMetadata"
        :url="heatmap.screenshot_url"
        :heatmap-date="heatmapDate"
        :heatmap-period="heatmapPeriod"
        :offset-accuracy="offsetAccuracy"
        :breakpoint-tablet="heatmap.breakpoint_tablet"
        :breakpoint-mobile="heatmap.breakpoint_mobile"
        :heatmap-types="heatmapTypes"
        :device-types="deviceTypes"
        :id-site-hsr="idSiteHsr"
        :is-active="isActive"
        :desktop-preview-size="desktopPreviewSize"
        :iframe-resolutions-values="iframeResolutions"
      ></HeatmapVis>
    </div>
    <div v-else-if="!heatmapMetadata?.nb_samples_device_all">
      <p v-html="$sanitize(recordedSamplesTroubleShoot)">
      </p>
      <ContentBlock>
        <div class="alert alert-info">
          {{ translate(noDataMessageKey) }}
        </div>
      </ContentBlock>
    </div>
    <div v-else>
      <ContentBlock>
        <div class="alert alert-info">
          {{ noHeatmapScreenshotRecordedYetText }}
        </div>
      </ContentBlock>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ContentBlock,
  EnrichedHeadline,
  Matomo,
  translate,
  externalLink,
} from 'CoreHome';
import HeatmapVis from './HeatmapVis.vue';
import { HeatmapMetadata } from '../types';
import MatomoJsNotWritableAlert from '../MatomoJsNotWritable/MatomoJsNotWritableAlert.vue';

export default defineComponent({
  props: {
    idSiteHsr: {
      type: Number,
      required: true,
    },
    heatmap: {
      type: Object,
      required: true,
    },
    heatmapMetadata: {
      type: Object,
      required: true,
    },
    deviceTypes: {
      type: Array,
      required: true,
    },
    heatmapTypes: {
      type: Array,
      required: true,
    },
    offsetAccuracy: {
      type: Number,
      required: true,
    },
    heatmapPeriod: {
      type: String,
      required: true,
    },
    heatmapDate: {
      type: String,
      required: true,
    },
    isActive: Boolean,
    createdDate: {
      type: String,
      required: true,
    },
    editUrl: {
      type: String,
      required: true,
    },
    inlineHelp: {
      type: String,
      required: true,
    },
    includedCountries: {
      type: String,
      required: true,
    },
    desktopPreviewSize: {
      type: Number,
      required: true,
    },
    iframeResolutions: {
      type: Object,
      required: true,
    },
    noDataMessageKey: {
      type: String,
      required: true,
    },
    isMatomoJsWritable: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    MatomoJsNotWritableAlert,
    ContentBlock,
    HeatmapVis,
    EnrichedHeadline,
  },
  computed: {
    noHeatmapScreenshotRecordedYetText() {
      return translate(
        'HeatmapSessionRecording_NoHeatmapScreenshotRecordedYet',
        (this.heatmapMetadata as HeatmapMetadata).nb_samples_device_all,
        translate('HeatmapSessionRecording_ScreenshotUrl'),
      );
    },
    recordedSamplesTroubleShoot() {
      const linkString = externalLink('https://matomo.org/faq/heatmap-session-recording/troubleshooting-heatmaps/');
      return translate(
        'HeatmapSessionRecording_HeatmapTroubleshoot',
        linkString,
        '</a>',
      );
    },
  },
  created() {
    // We want the selector hidden for heatmaps.
    Matomo.postEvent('hidePeriodSelector');
  },
});
</script>
