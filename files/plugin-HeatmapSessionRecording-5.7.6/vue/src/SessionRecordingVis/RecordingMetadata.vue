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
  <div class="recordingMetadata">
    <h3 class="recordingMetadata__title">{{
      translate('HeatmapSessionRecording_SessionDetails') }}</h3>
    <dl class="recordingMetadata__list">
      <template v-if="recording.page_title">
        <dt class="recordingMetadata__label">{{ translate('Goals_PageTitle') }}</dt>
        <dd
          class="recordingMetadata__value recordingMetadata__value--truncated"
          :title="recording.page_title"
        >{{ recording.page_title }}</dd>
      </template>
      <template v-if="pageviewLabel">
        <dt class="recordingMetadata__label">{{ translate('General_ColumnPageviews') }}</dt>
        <dd class="recordingMetadata__value">
          <button
            type="button"
            class="recordingMetadata__pageviews"
            @click="showPageviews()"
          >{{ pageviewLabel }}</button>
        </dd>
      </template>
      <template v-if="recording.url">
        <dt class="recordingMetadata__label">{{ translate('Actions_ColumnPageURL') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--truncated">
          <a
            :title="recording.url"
            :href="`https://${recording.url}`"
            target="_blank"
            rel="noreferrer noopener"
          >{{ recording.url }}</a>
        </dd>
      </template>
      <template v-if="recording.server_time_pretty">
        <dt class="recordingMetadata__label">{{ translate('General_Date') }}</dt>
        <dd class="recordingMetadata__value">{{ recording.server_time_pretty }}</dd>
      </template>
      <template v-if="recording.time_on_page_pretty">
        <dt class="recordingMetadata__label">{{ translate('General_TimeOnPage') }}</dt>
        <dd class="recordingMetadata__value">{{ recording.time_on_page_pretty }}</dd>
      </template>
      <template v-if="viewportResolution">
        <dt
          class="recordingMetadata__label"
          :title="translate('HeatmapSessionRecording_ViewportResolution')"
        >{{ translate('HeatmapSessionRecording_ViewportLabel') }}</dt>
        <dd class="recordingMetadata__value">{{ viewportResolution }}</dd>
      </template>
      <template v-if="recording.location_name || recording.location_logo">
        <dt class="recordingMetadata__label">{{ translate('UserCountry_Country') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--wrapped">
          <img
            class="recordingMetadata__logo recordingMetadata__logo--framed"
            v-if="recording.location_logo"
            :src="recording.location_logo"
            alt=""
          >{{ recording.location_name }}</dd>
      </template>
      <template v-if="recording.device_name || recording.device_logo">
        <dt class="recordingMetadata__label">{{ translate('DevicesDetection_Device') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--wrapped">
          <img
            class="recordingMetadata__logo"
            v-if="recording.device_logo"
            :src="recording.device_logo"
            alt=""
          >{{ recording.device_name }}</dd>
      </template>
      <template v-if="recording.os_name || recording.os_logo">
        <dt
          class="recordingMetadata__label"
          :title="translate('DevicesDetection_ColumnOperatingSystem')"
        >{{ translate('HeatmapSessionRecording_OperatingSystemShort') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--wrapped">
          <img
            class="recordingMetadata__logo"
            v-if="recording.os_logo"
            :src="recording.os_logo"
            alt=""
          >{{ recording.os_name }}</dd>
      </template>
      <template v-if="recording.browser_name || recording.browser_logo">
        <dt class="recordingMetadata__label">{{
          translate('DevicesDetection_ColumnBrowser') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--wrapped">
          <img
            class="recordingMetadata__logo"
            v-if="recording.browser_logo"
            :src="recording.browser_logo"
            alt=""
          >{{ recording.browser_name }}</dd>
      </template>
      <template v-if="recording.idvisit">
        <dt class="recordingMetadata__label">{{ translate('General_VisitId') }}</dt>
        <dd class="recordingMetadata__value">{{ recording.idvisit }}</dd>
      </template>
      <template v-if="recording.idvisitor">
        <dt class="recordingMetadata__label">{{ translate('General_VisitorID') }}</dt>
        <dd class="recordingMetadata__value recordingMetadata__value--inline">
          <span
            class="recordingMetadata__visitorId"
            :title="recording.idvisitor"
          >{{ recording.idvisitor }}</span>
          <button
            type="button"
            class="recordingMetadata__profileButton icon-visitor-profile"
            v-if="visitorProfileEnabled"
            :title="translate('Live_ViewVisitorProfile')"
            :aria-label="translate('Live_ViewVisitorProfile')"
            @click="openVisitorProfile()"
          />
        </dd>
      </template>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  translate,
  Matomo,
} from 'CoreHome';
import { SessionRecordingData } from '../types';

export default defineComponent({
  props: {
    recording: {
      type: Object as PropType<SessionRecordingData>,
      required: true,
    },
    visitorProfileEnabled: Boolean,
  },
  methods: {
    showPageviews() {
      Matomo.helper.modalConfirm('#listOfPageviews', {});
    },
    openVisitorProfile() {
      if (!this.recording.idvisitor) {
        return;
      }

      window.broadcast.propagateNewPopoverParameter(
        'visitorProfile',
        `${this.recording.idvisitor}`,
      );
    },
  },
  computed: {
    pageviewLabel(): string {
      const numPageviews = parseInt(`${this.recording.numPageviews}`, 10);

      if (!numPageviews) {
        return '';
      }

      if (numPageviews === 1) {
        return translate('HeatmapSessionRecording_OnePageview');
      }

      return translate(
        'HeatmapSessionRecording_PageviewXofY',
        `${this.recording.currentPage || ''}`,
        `${numPageviews}`,
      );
    },
    viewportResolution(): string {
      const width = this.recording.viewport_w_px;
      const height = this.recording.viewport_h_px;

      if (!width || !height) {
        return '';
      }

      return `${width}x${height}`;
    },
  },
});
</script>
