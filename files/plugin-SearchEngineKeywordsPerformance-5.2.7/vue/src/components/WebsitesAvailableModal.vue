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
  <span v-if="websites.length > 1">
    <a
      href="#"
      class="websites-available-modal-link"
      @click.prevent="openModal"
    >{{ linkLabel }}</a>
    <div class="ui-confirm websites-available-modal" ref="websitesAvailableModal">
        <span class="btn-close modal-close">
          <i class="icon-close"></i>
        </span>
      <div class="websites-available-modal-header">
        <h2>{{ actualModalTitle }}</h2>
      </div>
      <div class="websites-available-modal-list">
        <table>
          <tbody>
            <tr
              v-for="website in sortedWebsites"
              :key="website"
            >
              <td>{{ website }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Matomo,
  translate,
} from 'CoreHome';

export default defineComponent({
  props: {
    websites: {
      type: Array,
      required: true,
    },
    linkLabel: {
      type: String,
      required: true,
    },
    modalTitle: String,
  },
  methods: {
    openModal() {
      Matomo.helper.modalConfirm(
        this.$refs.websitesAvailableModal as HTMLElement,
        {},
        {
          classes: 'websites-available-modal-dialog',
        } as unknown as Parameters<typeof Matomo.helper.modalConfirm>[2],
      );
    },
  },
  computed: {
    actualModalTitle(): string {
      return this.modalTitle
        || translate('SearchEngineKeywordsPerformance_AvailableWebsitesForImport');
    },
    sortedWebsites(): string[] {
      return [...this.websites as string[]].sort((first, second) => (
        first.localeCompare(second, undefined, { sensitivity: 'base' })
      ));
    },
  },
});
</script>

<style scoped>
.websites-available-modal {
  display: none;
}

.websites-available-modal-link {
  margin-left: 4px;
}

.websites-available-modal-header {
  position: relative;
}

.websites-available-modal .btn-close {
  color: #9e9e9e;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  right: 15px;
  top: 15px;
}

.websites-available-modal-header h2 {
  color: var(--theme-color-text, #333);
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin: 0 0 24px;
  padding-right: 32px;
}

.websites-available-modal-list {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 12px;
}

.websites-available-modal-list table {
  border-collapse: collapse;
  margin-bottom: 0;
  table-layout: fixed;
  width: 100%;
}

.websites-available-modal-list td {
  border-bottom: 1px solid #e0e0e0;
  font-size: 13px;
  line-height: 16px;
  font-weight: 400;
  overflow: hidden;
  padding: 8px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.websites-available-modal-dialog) {
  border-radius: 8px;
  max-width: 90vw;
  width: 760px;
}

:global(.websites-available-modal-dialog .modal-content) {
  padding: 20px;
  background: var(--theme-color-background-contrast);
}
</style>
