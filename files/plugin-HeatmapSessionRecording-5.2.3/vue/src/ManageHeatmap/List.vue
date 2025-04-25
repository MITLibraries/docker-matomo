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
  <div class="heatmapList">
    <ContentBlock :content-title="translate('HeatmapSessionRecording_ManageHeatmaps')">
      <p>{{ translate('HeatmapSessionRecording_HeatmapUsageBenefits') }}</p>
      <div>
        <div class="filterStatus">
          <Field
            uicontrol="select"
            name="filterStatus"
            :model-value="filterStatus"
            @update:model-value="setFilterStatus($event);"
            :title="translate('HeatmapSessionRecording_Filter')"
            :full-width="true"
            :options="statusOptions"
          >
          </Field>
        </div>
        <div class="hsrSearchFilter" style="margin-left:3.5px">
          <Field
            uicontrol="text"
            name="hsrSearch"
            :title="translate('General_Search')"
            v-show="hsrs.length > 0"
            v-model="searchFilter"
            :full-width="true"
          >
          </Field>
        </div>
      </div>
      <table v-content-table>
        <thead>
          <tr>
            <th class="index">{{ translate('General_Id') }}</th>
            <th class="name">{{ translate('General_Name') }}</th>
            <th class="creationDate">{{ translate('HeatmapSessionRecording_CreationDate') }}</th>
            <th class="sampleLimit">{{ translate('HeatmapSessionRecording_SampleLimit') }}</th>
            <th class="status">{{ translate('CorePluginsAdmin_Status') }}</th>
            <th class="action">{{ translate('General_Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-show="isLoading || isUpdating">
            <td colspan="7">
              <span class="loadingPiwik"><img src="plugins/Morpheus/images/loading-blue.gif" />
                {{ translate('General_LoadingData') }}</span>
            </td>
          </tr>
          <tr v-show="!isLoading && hsrs.length === 0">
            <td colspan="7">
              {{ translate('HeatmapSessionRecording_NoHeatmapsFound') }}
            </td>
          </tr>
          <tr
            :id="`hsr${hsr.idsitehsr}`"
            class="hsrs"
            v-for="hsr in sortedHsrs"
            :key="hsr.idsitehsr"
          >
            <td class="index">{{ hsr.idsitehsr }}</td>
            <td class="name">{{ hsr.name }}</td>
            <td class="creationDate">{{ hsr.created_date_pretty }}</td>
            <td class="sampleLimit">{{ hsr.sample_limit }}</td>
            <td class="status status-paused" v-if="hsr.status === 'paused'">
              {{ ucfirst(hsr.status) }} <span class="icon icon-help" :title="pauseReason"></span>
            </td>
            <td class="status" v-else>{{ ucfirst(hsr.status) }}</td>
            <td class="action">
              <a
                class="table-action icon-edit"
                :title="translate(
                  'HeatmapSessionRecording_EditX',
                  translate('HeatmapSessionRecording_Heatmap'),
                )"
                @click="editHsr(hsr.idsitehsr)"
              />
              <a
                a
                class="table-action stopRecording icon-drop-crossed"
                :title="translate(
                  'HeatmapSessionRecording_StopX',
                  translate('HeatmapSessionRecording_Heatmap'),
                )"
                v-show="hsr.status !== 'ended'"
                @click="completeHsr(hsr)"
              ></a>
              <a
                target="_blank"
                class="table-action icon-show"
                :title="translate('HeatmapSessionRecording_ViewReport')"
                :href="getViewReportLink(hsr)"
              />
              <a
                class="table-action icon-delete"
                :title="translate(
                  'HeatmapSessionRecording_DeleteX',
                  translate('HeatmapSessionRecording_Heatmap'),
                )"
                @click="deleteHsr(hsr)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tableActionBar">
        <a
          class="createNewHsr"
          value
          @click="createHsr()"
        ><span class="icon-add" /> {{ translate('HeatmapSessionRecording_CreateNewHeatmap') }}</a>
      </div>
    </ContentBlock>
    <div
      class="ui-confirm"
      id="confirmDeleteHeatmap"
      ref="confirmDeleteHeatmap"
    >
      <h2>{{ translate('HeatmapSessionRecording_DeleteHeatmapConfirm') }} </h2>
      <input
        role="yes"
        type="button"
        :value="translate('General_Yes')"
      />
      <input
        role="no"
        type="button"
        :value="translate('General_No')"
      />
    </div>
    <div
      class="ui-confirm"
      id="confirmEndHeatmap"
      ref="confirmEndHeatmap"
    >
      <h2>{{ translate('HeatmapSessionRecording_EndHeatmapConfirm') }} </h2>
      <input
        role="yes"
        type="button"
        :value="translate('General_Yes')"
      />
      <input
        role="no"
        type="button"
        :value="translate('General_No')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { DeepReadonly, defineComponent } from 'vue';
import {
  Matomo,
  ContentBlock,
  ContentTable,
  MatomoUrl,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { HeatmapStore } from '../HsrStore/HsrStore.store';
import { Heatmap } from '../types';

interface Option {
  key: string;
  value: string;
}

interface ListHeatmapsState {
  searchFilter: string;
}

export default defineComponent({
  props: {
    pauseReason: String,
  },
  components: {
    ContentBlock,
    Field,
  },
  directives: {
    ContentTable,
  },
  data(): ListHeatmapsState {
    return {
      searchFilter: '',
    };
  },
  created() {
    HeatmapStore.setFilterStatus('');
    HeatmapStore.fetchHsrs();
  },
  methods: {
    createHsr() {
      this.editHsr(0);
    },
    editHsr(idSiteHsr: number) {
      MatomoUrl.updateHash({
        ...MatomoUrl.hashParsed.value,
        idSiteHsr,
      });
    },
    deleteHsr(hsr: Heatmap) {
      Matomo.helper.modalConfirm(this.$refs.confirmDeleteHeatmap as HTMLElement, {
        yes: () => {
          HeatmapStore.deleteHsr(hsr.idsitehsr).then(() => {
            HeatmapStore.reload();

            Matomo.postEvent('updateReportingMenu');
          });
        },
      });
    },
    completeHsr(hsr: Heatmap) {
      Matomo.helper.modalConfirm(this.$refs.confirmEndHeatmap as HTMLElement, {
        yes: () => {
          HeatmapStore.completeHsr(hsr.idsitehsr).then(() => {
            HeatmapStore.reload();
          });
        },
      });
    },
    setFilterStatus(filter: string) {
      HeatmapStore.setFilterStatus(filter);
    },
    ucfirst(s: string) {
      return `${s[0].toUpperCase()}${s.substr(1)}`;
    },
    getViewReportLink(hsr: Heatmap) {
      return `?${MatomoUrl.stringify({
        module: 'Widgetize',
        action: 'iframe',
        moduleToWidgetize: 'HeatmapSessionRecording',
        actionToWidgetize: 'showHeatmap',
        idSiteHsr: hsr.idsitehsr,
        idSite: hsr.idsite,
        period: 'day',
        date: 'yesterday',
      })}`;
    },
  },
  computed: {
    filterStatus(): string {
      return HeatmapStore.state.value.filterStatus;
    },
    statusOptions(): DeepReadonly<Option[]> {
      return HeatmapStore.statusOptions;
    },
    hsrs(): DeepReadonly<Heatmap[]> {
      return HeatmapStore.hsrs.value as DeepReadonly<Heatmap[]>;
    },
    isLoading(): boolean {
      return HeatmapStore.state.value.isLoading;
    },
    isUpdating(): boolean {
      return HeatmapStore.state.value.isUpdating;
    },
    sortedHsrs(): DeepReadonly<Heatmap[]> {
      // look through string properties of heatmaps for values that have searchFilter in them
      // (mimics angularjs filter() filter)
      const result = [...this.hsrs].filter((h) => Object.keys(h).some((propName) => {
        const entity = h as unknown as Record<string, unknown>;
        return typeof entity[propName] === 'string'
          && (entity[propName] as string).indexOf(this.searchFilter) !== -1;
      }));
      result.sort((lhs, rhs) => rhs.idsitehsr - lhs.idsitehsr);
      return result;
    },
  },
});
</script>
