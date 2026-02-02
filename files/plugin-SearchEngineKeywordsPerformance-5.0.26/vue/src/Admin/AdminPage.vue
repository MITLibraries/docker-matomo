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
  <ContentBlock
    :content-title="translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')"
  >
    <p>{{ translate('SearchEngineKeywordsPerformance_ConfigurationDescription') }}</p>

    <p>{{ translate('SearchEngineKeywordsPerformance_ProviderListDescription') }}</p>

    <div class="keywordproviders">
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

export default defineComponent({
  props: {
    providers: {
      type: Array,
      required: true,
    },
  },
  components: {
    ContentBlock,
    Provider,
  },
});
</script>
