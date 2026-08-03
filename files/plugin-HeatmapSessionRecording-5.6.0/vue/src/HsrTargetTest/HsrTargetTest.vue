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
  <div class="form-group hsrTargetTest">
    <label><strong>{{ translate('HeatmapSessionRecording_TargetPageTestTitle') }}:</strong>
      {{ translate('HeatmapSessionRecording_TargetPageTestLabel') }}</label>
    <input
      type="text"
      id="urltargettest"
      placeholder="http://www.example.com/"
      v-model="url"
      :class="{'invalid': url && !matches && isValid}"
    />
    <div>
      <span
        class="testInfo"
        v-show="url && !isValid"
      >
        {{ translate('HeatmapSessionRecording_TargetPageTestErrorInvalidUrl') }}
      </span>
      <span
        class="testInfo matches"
        v-show="url && matches && isValid"
      >
        {{ translate('HeatmapSessionRecording_TargetPageTestUrlMatches') }}
      </span>
      <span
        class="testInfo notMatches"
        v-show="url && !matches && isValid"
      >
        {{ translate('HeatmapSessionRecording_TargetPageTestUrlNotMatches') }}
      </span>
      <span
        class="loadingPiwik loadingMatchingSteps"
        v-show="isLoadingTestMatchPage"
      >
        <img
          src="plugins/Morpheus/images/loading-blue.gif"
          alt
        />{{ translate('General_LoadingData') }}
      </span>
    </div>
    <div id="hsrTargetValidationError" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from 'CoreHome';
import oneAtATime from '../oneAtATime';

interface HsrTargetTestState {
  url: string;
  matches: boolean;
  isLoadingTestMatchPage: boolean;
}

interface TestUrlMatchPagesResponse {
  url: string;
  matches: boolean;
}

interface IncludedTarget {
  type?: string;
  value?: string;
}

function isValidUrl(url: string) {
  return url.indexOf('://') > 3;
}

export default defineComponent({
  props: {
    includedTargets: Array,
  },
  data(): HsrTargetTestState {
    return {
      url: '',
      matches: false,
      isLoadingTestMatchPage: false,
    };
  },
  watch: {
    isValid(newVal) {
      if (!newVal) {
        this.matches = false;
      }
    },
    includedTargets() {
      this.runTest();
    },
    url() {
      this.runTest();
    },
  },
  setup() {
    return {
      testUrlMatchPages: oneAtATime<TestUrlMatchPagesResponse>(
        'HeatmapSessionRecording.testUrlMatchPages',
        {
          errorElement: '#hsrTargetValidationError',
        },
      ),
    };
  },
  created() {
    // we wait for 200ms before actually sending a request as user might be still typing
    this.runTest = debounce(this.runTest, 200);
  },
  methods: {
    checkIsMatchingUrl() {
      if (!this.isValid) {
        return;
      }

      const url = this.targetUrl;

      const included = this.filteredIncludedTargets;
      if (!included?.length) {
        return;
      }

      this.isLoadingTestMatchPage = true;
      this.testUrlMatchPages(
        { url },
        { matchPageRules: included },
      ).then((response) => {
        if (!this.filteredIncludedTargets?.length
          || response?.url !== this.targetUrl
        ) {
          return;
        }

        this.matches = response.matches;
      }).finally(() => {
        this.isLoadingTestMatchPage = false;
      });
    },
    runTest() {
      if (!this.isValid) {
        return;
      }

      this.checkIsMatchingUrl();
    },
  },
  computed: {
    targetUrl() {
      return (this.url || '').trim();
    },
    isValid() {
      return this.targetUrl && isValidUrl(this.targetUrl);
    },
    filteredIncludedTargets() {
      if (!this.includedTargets) {
        return undefined;
      }

      return (this.includedTargets as IncludedTarget[]).filter(
        (target) => target?.value || target?.type === 'any',
      ).map((target) => ({
        ...target,
        value: target.value ? target.value.trim() : '',
      }));
    },
  },
});
</script>
