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
  <div
    class="heatmapSettingsDropdown"
    :class="{ 'is-exporting': isExporting }"
    v-if="hasWriteAccess"
  >
    <MenuItemsDropdown
      :menu-title="menuTitle"
      @after-select="onSelect($event)"
    >
      <a class="item" :href="editUrl">
        {{ translate('HeatmapSessionRecording_EditHeatmap') }}
      </a>
      <span
        v-if="hasSnapshot && hasAdminAccess"
        class="item"
        :class="{ disabled: isExporting }"
        data-action="export"
      >
        {{ translate('HeatmapSessionRecording_ExportImage') }}
      </span>
      <span
        v-if="hasSnapshot"
        class="item"
        data-action="delete"
      >
        {{ deleteLabel }}
      </span>
    </MenuItemsDropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MenuItemsDropdown, Matomo, translate } from 'CoreHome';

export default defineComponent({
  props: {
    editUrl: {
      type: String,
      required: true,
    },
    hasSnapshot: Boolean,
    isActive: Boolean,
    isExporting: Boolean,
  },
  components: {
    MenuItemsDropdown,
  },
  emits: ['export', 'delete'],
  computed: {
    menuTitle() {
      // While exporting, the trigger becomes a non-interactive progress indicator: a spinner
      // plus the same "Generating image…" message the export button used before (PG-691).
      if (this.isExporting) {
        return `<span class="heatmapSettingsSpinner"></span> ${translate('HeatmapSessionRecording_ExportImageInProgress')}`;
      }

      return `<span class="icon-configure"></span> ${translate('HeatmapSessionRecording_HeatmapSettings')}`;
    },
    // Only active heatmaps can retake a snapshot; ended/paused ones get a plain delete (their
    // delete modal has no retake option), so match the menu wording to that.
    deleteLabel() {
      return this.isActive
        ? translate('HeatmapSessionRecording_DeleteRetakeSnapshot')
        : translate('HeatmapSessionRecording_DeleteSnapshotConfirm');
    },
    hasWriteAccess() {
      return !!Matomo?.heatmapWriteAccess;
    },
    hasAdminAccess() {
      return !!Matomo?.heatmapAdminAccess;
    },
  },
  methods: {
    onSelect(selected: HTMLElement) {
      const action = selected.getAttribute('data-action');
      if (action === 'export' && !this.isExporting) {
        this.$emit('export');
      } else if (action === 'delete') {
        this.$emit('delete');
      }
    },
  },
});
</script>
