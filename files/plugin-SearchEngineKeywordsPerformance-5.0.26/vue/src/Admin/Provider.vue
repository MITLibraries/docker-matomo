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
    :class="{
      keywordprovider: true,
      warning: hasWarning,
      configured: !hasWarning && provider.is_configured,
    }"
  >
    <div
      v-for="(logo, index) in provider.logos"
      :key="index"
      :class="`logo ${provider.logos.length > 1 ? 'double' : ''}`"
      :title="logoTooltip"
    >
      <img :src="logo" :alt="provider.name">
    </div>
    <h3>{{ provider.name }}</h3>
    <p v-html="$sanitize(provider.description)"></p>
    <p><em v-html="$sanitize(provider.note)"></em></p>

    <p class="experimental" v-if="provider.is_experimental">experimental</p>

    <a :href="configureUrl" class="cta">
      <button class="btn" v-if="provider.is_configured">
        {{ translate('SearchEngineKeywordsPerformance_ChangeConfiguration') }}
      </button>
      <button class="btn" v-else>
        {{ translate('SearchEngineKeywordsPerformance_SetupConfiguration') }}
      </button>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { translate, MatomoUrl } from 'CoreHome';

interface Provider {
  id: string;
  is_configured: boolean;
  configured_site_ids: (string|number)[];
  problems: {
    sites: unknown[];
    accounts: [];
  };
  is_experimental: boolean;
  logos: string[];
}

export default defineComponent({
  props: {
    provider: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasWarning() {
      const provider = this.provider as Provider;
      return provider.is_configured
        && (Object.keys(provider.configured_site_ids).length === 0
          || Object.keys(provider.problems.sites).length
          || Object.keys(provider.problems.accounts).length);
    },
    logoTooltip() {
      const provider = this.provider as Provider;
      const isConfiguredWithoutSite = provider.is_configured
        && Object.keys(provider.configured_site_ids).length === 0;

      if (isConfiguredWithoutSite) {
        return translate('SearchEngineKeywordsPerformance_ConfigAvailableNoWebsiteConfigured');
      }

      if (provider.is_configured) {
        return translate('SearchEngineKeywordsPerformance_IntegrationConfigured');
      }

      return translate('SearchEngineKeywordsPerformance_IntegrationNotConfigured');
    },
    configureUrl() {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        action: `configure${this.provider.id}`,
      })}`;
    },
  },
});
</script>
