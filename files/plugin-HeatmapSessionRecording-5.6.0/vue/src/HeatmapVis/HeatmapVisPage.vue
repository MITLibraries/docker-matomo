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
  <div class="heatmapVisPage">
    <div class="heatmapReportHeader">
      <h2 class="heatmap-vis-title">
        <EnrichedHeadline
          :edit-url="editUrl"
          :inline-help="inlineHelp"
        >
          {{ translate('HeatmapSessionRecording_HeatmapX', `"${heatmap.name}"`) }}
        </EnrichedHeadline>
      </h2>

      <HeatmapSettingsDropdown
        :edit-url="editUrl"
        :has-snapshot="!!heatmap.page_treemirror"
        :is-active="isActive"
        :is-exporting="isExporting"
        @export="onExport"
        @delete="onDelete"
      />
    </div>

    <MatomoJsNotWritableAlert
      :is-matomo-js-writable="isMatomoJsWritable"
      :recording-type="translate('HeatmapSessionRecording_Heatmaps')"
    />

    <div class="alert alert-info heatmap-country-alert" v-if="includedCountries">
      {{ translate('HeatmapSessionRecording_HeatmapInfoTrackVisitsFromCountries',
      includedCountries) }}
    </div>

    <div class="alert alert-info" v-if="isOnHold">
      {{ onHoldMessage }}
    </div>

    <HeatmapVis
      v-else
      ref="heatmapVis"
      :created-date="createdDate"
      :created-date-raw="heatmap.created_date"
      :heatmap-name="heatmap.name"
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
      :image-proxy-nonce="imageProxyNonce"
      :has-snapshot="!!heatmap.page_treemirror"
      :capture-manually="!!heatmap.capture_manually"
      :snapshot-deleted="!!heatmap.screenshot_deleted_date"
      :is-paused="heatmap.status === 'paused'"
      @exporting="isExporting = $event"
    ></HeatmapVis>

    <!-- Active heatmap: delete the snapshot and pick how it is retaken. -->
    <div class="ui-confirm" ref="deleteRetakeModal">
      <h2>{{ translate('HeatmapSessionRecording_DeleteRetakeSnapshotTitle') }}</h2>
      <p>{{ translate('HeatmapSessionRecording_DeleteRetakeSnapshotDescription') }}</p>
      <input
        role="deleteManual"
        type="button"
        :value="translate('HeatmapSessionRecording_DeleteRetakeManually')"
      />
      <input
        role="validation"
        type="button"
        :value="translate('HeatmapSessionRecording_DeleteRetakeAutomatically')"
      />
    </div>

    <!-- Ended or paused heatmap: it no longer records, so only a plain delete is offered. -->
    <div class="ui-confirm" ref="deleteModal">
      <h2>{{ translate('HeatmapSessionRecording_DeleteSnapshotTitle') }}</h2>
      <p>{{ translate('HeatmapSessionRecording_DeleteSnapshotDescription') }}</p>
      <input
        role="validation"
        type="button"
        :value="translate('HeatmapSessionRecording_DeleteSnapshotConfirm')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  EnrichedHeadline,
  Matomo,
  AjaxHelper,
  translate,
} from 'CoreHome';
import HeatmapVis from './HeatmapVis.vue';
import HeatmapSettingsDropdown from './HeatmapSettingsDropdown.vue';
import { Heatmap } from '../types';
import MatomoJsNotWritableAlert from '../MatomoJsNotWritable/MatomoJsNotWritableAlert.vue';

interface HeatmapVisPageState {
  isExporting: boolean;
}

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
    imageProxyNonce: {
      type: String,
      default: '',
    },
  },
  components: {
    MatomoJsNotWritableAlert,
    HeatmapVis,
    HeatmapSettingsDropdown,
    EnrichedHeadline,
  },
  data(): HeatmapVisPageState {
    return {
      isExporting: false,
    };
  },
  computed: {
    isOnHold() {
      return (this.heatmap as Heatmap).status === 'onhold';
    },
    onHoldMessage() {
      const scheduledDate = (this.heatmap as Heatmap).scheduled_date_pretty;

      if (!scheduledDate) {
        return translate('HeatmapSessionRecording_RecordedHeatmapDocStatusOnHold');
      }

      return translate(
        'HeatmapSessionRecording_RecordedHeatmapDocStatusOnHoldWithDate',
        scheduledDate,
      );
    },
  },
  created() {
    // We want the selector hidden for heatmaps.
    Matomo.postEvent('hidePeriodSelector');
  },
  methods: {
    onExport() {
      (this.$refs.heatmapVis as InstanceType<typeof HeatmapVis>).exportToImage();
    },
    onDelete() {
      // Active heatmaps still record, so they may retake the snapshot; ended/paused ones cannot,
      // so they only get a plain delete (their tracker configs no longer capture any DOM).
      // modalConfirm supports a `classes` option at runtime; the core ModalConfirmOptions type
      // omits it, so cast through unknown rather than editing the core type definition.
      const options = { classes: 'heatmapDeleteModal' } as unknown as ModalConfirmOptions;

      if (this.isActive) {
        Matomo.helper.modalConfirm(this.$refs.deleteRetakeModal as HTMLElement, {
          deleteManual: () => this.deleteSnapshot(true),
          validation: () => this.deleteSnapshot(false),
        }, options);
      } else {
        Matomo.helper.modalConfirm(this.$refs.deleteModal as HTMLElement, {
          validation: () => this.deleteSnapshot(false),
        }, options);
      }
    },
    deleteSnapshot(captureManually: boolean) {
      AjaxHelper.fetch({
        method: 'HeatmapSessionRecording.deleteHeatmapScreenshot',
        idSiteHsr: this.idSiteHsr,
        captureManually: captureManually ? 1 : 0,
      }).then(() => {
        // reload so the report picks up the server-decided empty state
        window.location.reload();
      });
    },
  },
});
</script>
