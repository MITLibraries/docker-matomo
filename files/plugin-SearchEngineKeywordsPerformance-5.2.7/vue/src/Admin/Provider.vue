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
  <div class="search-engine-card">
    <!-- Left Section -->
    <div class="card-content">
      <!-- Logo -->
      <div class="logo-box">
        <img :src="provider.logo" :alt="provider.name">
      </div>

      <!-- Text -->
      <div class="text-content">
        <h3>{{ provider.name }}</h3>

        <p v-html="$sanitize(provider.note)"></p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="button-wrapper">
      <a :href="configureUrl" class="cta">
        <button class="btn action-button" v-if="provider.hasWarning">
          {{ translate('SearchEngineKeywordsPerformance_FixConfiguration') }}
        </button>
        <button class="btn action-button" v-else-if="provider.is_configured">
          {{ translate('SearchEngineKeywordsPerformance_ChangeConfiguration') }}
        </button>
        <button class="btn" v-else>
          {{ translate('SearchEngineKeywordsPerformance_SetupConfiguration') }}
        </button>
      </a>
    </div>

    <!-- Optional Warning -->
    <Alert
        v-if="provider.hasWarning"
        severity="warning"
        class="warning-alert"
    >
      <strong>
        {{ translate('SearchEngineKeywordsPerformance_ConfigurationProblemDetected') }}
      </strong>
      <p class="text-content">
        {{ translate('SearchEngineKeywordsPerformance_ConfigurationProblemDescription',
          provider.name)}}</p>

    </Alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MatomoUrl, Alert } from 'CoreHome';

export default defineComponent({
  components: {
    Alert,
  },
  props: {
    provider: {
      type: Object,
      required: true,
    },
  },
  computed: {
    configureUrl() {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        action: `configure${this.provider.id}`,
      })}`;
    },
  },
});
</script>

<style scoped>
.search-engine-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  border: 1px solid var(--theme-color-border);
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.card-content {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 1.5rem;
  align-items: start;
}

.logo-box img {
  width: 4rem;
  height: 4rem;
}

.text-content h3 {
  margin: 4px 0 10px;
  font-weight: 600;
  color: var(--theme-color-text);
}

.text-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--theme-color-text-lighter, #646464) !important;
}

.button-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 1rem;

  .btn {
    min-width: 15rem;
  }
}

.action-button {
  border: 1px solid var(--theme-color-brand);
  border-radius: 0.25rem;
  background: #fff;
  color: var(--theme-color-brand) !important;
  font-weight: 500;
}

.action-button:hover, .action-button:focus {
  background: var(--theme-color-menu-contrast-backgroundHover) !important;
}

.warning-alert {
  grid-column: 1 / -1;
  margin-left: 1rem;
  margin-right: 1rem;

  .text-content {
    color: var(--theme-color-text-lighter, #646464) !important;
    font-weight: 400;
    font-size: 14px !important;
  }
}

/* Stack card content and button on narrow/tablet widths to avoid overflow */
@media (max-width: 992px) {
  .search-engine-card {
    grid-template-columns: 1fr;
  }

  .button-wrapper {
    padding: 0 1rem 1rem;
  }

  .button-wrapper .btn {
    min-width: 0;
    width: 100%;
  }
}

</style>
