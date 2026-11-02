<template>
  <div class="search-engine-navigation">
    <h2 class="page-title">
      {{ translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance') }}
    </h2>

    <div class="tabs">
      <a
        class="tab"
        :class="{ active: currentTab === 'setup' }"
        :href="setupUrl"
      >
        {{ translate('SearchEngineKeywordsPerformance_Setup') }}
      </a>

      <a
        class="tab"
        :class="{ active: currentTab === 'google' }"
        :href="googleUrl"
      >
        {{ translate('SearchEngineKeywordsPerformance_NavTitleGoogle') }}
      </a>

      <a
        class="tab"
        :class="{ active: currentTab === 'bing' }"
        :href="bingUrl"
      >
        {{ translate('SearchEngineKeywordsPerformance_NavTitleBing') }}
      </a>

      <a
        class="tab"
        :class="{ active: currentTab === 'yandex' }"
        :href="yandexUrl"
      >
        {{ translate('SearchEngineKeywordsPerformance_NavTitleYandex') }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MatomoUrl, translate } from 'CoreHome';

export default defineComponent({
  props: {
    currentTab: {
      type: String,
      required: true,
    },
  },

  methods: {
    getNavigationUrl(action: string) {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        module: 'SearchEngineKeywordsPerformance',
        action,
      })}`;
    },
    translate,
  },
  computed: {
    setupUrl() {
      return this.getNavigationUrl('index');
    },
    googleUrl() {
      return this.getNavigationUrl('configureGoogle');
    },
    bingUrl() {
      return this.getNavigationUrl('configureBing');
    },
    yandexUrl() {
      return this.getNavigationUrl('configureYandex');
    },
  },
});
</script>

<style scoped>
.search-engine-navigation {
  border-bottom: 1px solid var(--theme-color-border);
  background: var(--theme-color-background-base);
  margin-bottom: 1rem;
}

.page-title {
  color: var(--theme-color-text, #212121);
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.24px;
}

.tabs {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: transparent;
}

.tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border: none;
  background: transparent;
  font-family: var(--theme-fontFamily-base);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: var(--theme-color-text-lighter);
  cursor: pointer;
  text-decoration: none;
  transition: color 150ms ease;
  padding: 1rem;
  text-transform: unset;
}

.tab:hover {
  color: var(--theme-color-text);
}

.tab.active {
  color: var(--theme-color-brand);
}

.tab.active::after {
  content: '';

  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--theme-color-brand);
  border-radius: 999px;
}
</style>
