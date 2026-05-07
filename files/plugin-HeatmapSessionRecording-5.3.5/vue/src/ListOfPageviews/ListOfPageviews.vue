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
  <div class="ui-confirm" id="listOfPageviews">
    <h2>{{ translate('HeatmapSessionRecording_PageviewsInVisit') }}</h2>
    <br />
    <br />
    <table v-content-table>
      <thead>
      <tr>
        <th>{{ translate('HeatmapSessionRecording_ColumnTime') }}</th>
        <th>{{ translate('General_TimeOnPage') }}</th>
        <th>{{ translate('Goals_URL') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="pageview in pageviews"
        :key="pageview.idloghsr"
        :class="{ inactive: pageview.idloghsr !== idLogHsr }"
        @click="onClickPageView(pageview)"
      >
        <td>{{ pageview.server_time_pretty }}</td>
        <td>{{ pageview.time_on_page_pretty }}</td>
        <td :title="pageview.label">{{ (pageview.label || '').substr(0, 50) }}</td>
      </tr>
      </tbody>
    </table>

    <input role="close" type="button" :value="translate('General_Close')"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ContentTable, MatomoUrl } from 'CoreHome';
import { PageviewInSession } from '../types';

export default defineComponent({
  props: {
    pageviews: {
      type: Array,
      required: true,
    },
    idLogHsr: {
      type: Number,
      required: true,
    },
  },
  directives: {
    ContentTable,
  },
  methods: {
    onClickPageView(pageview: PageviewInSession) {
      if (pageview.idloghsr === this.idLogHsr) {
        return;
      }

      MatomoUrl.updateUrl(
        {
          ...MatomoUrl.urlParsed.value,
          idLogHsr: pageview.idloghsr,
        },
        MatomoUrl.hashParsed.value.length ? {
          ...MatomoUrl.hashParsed.value,
          idLogHsr: pageview.idloghsr,
        } : undefined,
      );
    },
  },
});
</script>
