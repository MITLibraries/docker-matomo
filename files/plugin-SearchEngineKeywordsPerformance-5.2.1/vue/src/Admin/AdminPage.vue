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
  <SearchEngineNavigation current-tab="setup" />
  <ContentBlock
  >
    <div class="intro">
      <p>{{ translate('SearchEngineKeywordsPerformance_ConfigurationDescriptionLine1New') }}</p>
      <p>{{ translate('SearchEngineKeywordsPerformance_ConfigurationDescriptionLine2New') }}</p>
    </div>

    <div class="provider-list">
      <Provider
        v-for="provider in providers"
        :key="provider.id"
        :provider="provider"
      >
      </Provider>

      <div class="clear"></div>
    </div>
  </ContentBlock>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ContentBlock } from 'CoreHome';
import Provider from './Provider.vue';
import SearchEngineNavigation from '../Navigation/Navigation.vue';

export default defineComponent({
  props: {
    providers: {
      type: Array,
      required: true,
    },
  },
  components: {
    SearchEngineNavigation,
    ContentBlock,
    Provider,
  },
});
</script>

<style scoped>
.intro {
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0;

  p {
    color: var(--theme-color-text-lighter, #646464) !important;
  }
}
</style>
