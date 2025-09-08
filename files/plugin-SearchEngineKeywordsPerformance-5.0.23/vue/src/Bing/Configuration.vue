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
  <div>
    <ContentBlock
      :content-title="translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')"
    >
      <h2>{{ translate('SearchEngineKeywordsPerformance_BingConfigurationTitle') }}</h2>

      {{ translate('SearchEngineKeywordsPerformance_BingConfigurationDescription') }}
    </ContentBlock>

    <div
      v-if="Object.keys(accounts).length > 0"
      :class="`websiteconfiguration ${Object.keys(configuredMeasurables).length
          ? 'configured' : ''}`"
    >
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')"
      >
        <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow') }}</p>

        <div class="ui-confirm" id="confirmRemoveAccountConfig" ref="confirmRemoveAccountConfig">
          <h2>{{ translate(
            'SearchEngineKeywordsPerformance_ConfigRemovalConfirm',
            removeAccountConfigName,
          ) }}</h2>
          <input role="yes" type="button" :value="translate('General_Yes')"/>
          <input role="no" type="button" :value="translate('General_No')"/>
        </div>

        <div>
          <table v-content-table class="measurableList">
            <thead>
            <tr>
              <th>{{ translate('General_Measurable') }}</th>
              <th>{{ translate('Mobile_Account') }}</th>
              <th>{{ translate('Goals_URL') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_LastImport') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_CreatedBy') }}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!Object.keys(configuredMeasurables).length">
              <td colspan="6">
                <strong>
                  {{ translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured') }}
                </strong>
              </td>
            </tr>
            <tr
              v-for="(config, siteId, index) in configuredMeasurablesToDisplay"
              :key="index"
              :class="!sitesInfos[siteId].accountValid || !sitesInfos[siteId].urlValid
                ? 'error' : ''"
            >
              <td>
                {{ sitesInfos[siteId].name }} <span>({{ sitesInfos[siteId].main_url }})</span>
              </td>

              <td>
                <span class="icon-error" v-if="!sitesInfos[siteId].accountValid"></span>
                {{ config.apiKeyDisplay }}
              </td>
              <td>
                <span class="icon-error" v-if="!sitesInfos[siteId].urlValid"></span>{{ config.url }}
              </td>
              <td>{{ sitesInfos[siteId].lastRun }}</td>
              <td>{{ config.createdByUser }}</td>
              <td>
                <form
                  method="POST"
                  action=""
                  @submit.prevent="removeAccountConfig(siteId, $event)"
                >
                  <input type="hidden" name="removeConfig" :value="siteId">
                  <input type="hidden" name="removeSiteConfigNonce"
                         :value="removeBingSiteConfigNonce">
                  <button
                    type="submit"
                    class="btn-flat icon-delete"
                    :title="translate('General_Delete')"
                    v-if="config.isDeletionAllowed"
                  ></button>
                </form>
              </td>
            </tr>
            <tr v-show="!isAddingMeasurable" v-if="countOfAccountsWithAccess">
              <td colspan="6" align="right">
                <button
                  class="btn"
                  @click.prevent="isAddingMeasurable = true"
                >
                  {{ translate('SearchEngineKeywordsPerformance_AddConfiguration') }}
                </button>
              </td>
            </tr>
            <tr class="configureMeasurableForm"
                v-show="isAddingMeasurable" v-if="countOfAccountsWithAccess">
              <td>
                <Field
                  uicontrol="site"
                  v-model="currentSiteToAdd"
                  :title="translate('CoreHome_ChooseX', translate('General_Measurable'))"
                />
              </td>
              <td colspan="2">
                <div class="bingAccountAndUrlToAdd">
                  <Field
                    uicontrol="select"
                    v-model="bingAccountAndUrlToAdd"
                    :title="translate('SearchEngineKeywordsPerformance_UrlOfAccount')"
                    :options="urlOptions"
                  />
                </div>
              </td>
              <td colspan="3">
                <form action="" method="post">
                  <input type="hidden" name="bingSiteId" :value="currentSiteToAdd.id">
                  <input type="hidden" name="addSiteConfigNonce" :value="addBingSiteConfigNonce">
                  <input type="hidden" name="bingAccountAndUrl" :value="bingAccountAndUrlToAdd">
                  <input type="submit" class="btn" :value="translate('General_Save')" />
                </form>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </ContentBlock>
    </div>

    <div
      :class="`accountconfiguration ${Object.keys(accounts).length > 0 ? 'configured' : ''}`"
    >
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_ManageAPIKeys')"
      >
        <div class="ui-confirm" id="confirmDeleteAccount" ref="confirmDeleteAccount">
          <h2>
            {{ translate(
              'SearchEngineKeywordsPerformance_AccountRemovalConfirm',
              removeAccountName,
            ) }}
          </h2>
          <input role="yes" type="button" :value="translate('General_Yes')"/>
          <input role="no" type="button" :value="translate('General_No')"/>
        </div>

        <div class="accounts">
          <div
            v-for="account in accountsToDisplay"
            :key="account.username"
            :class="`account ${Object.keys(account.urls).length === 0
              || typeof account.hasError === 'string' ? 'invalid' : ''}`"
          >
            <div
              :class="`icon-${Object.keys(account.urls).length === 0
                || typeof account.hasError === 'string' ? 'warning' : 'success'} logo`"
            ></div>

            <h3>{{ getDisplayApiKey(account.apiKey) }}</h3>

            <p v-html="$sanitize(translate(
              'SearchEngineKeywordsPerformance_AccountAddedBy',
              account.username,
              account.created_formatted,
            ))"></p>

            <p class="accounterror" v-if="typeof account.hasError === 'string'">
              <span class="icon-warning"></span>
              {{ translate('SearchEngineKeywordsPerformance_BingAccountError', account.hasError) }}
            </p>
            <div v-else>
              <p class="accounterror" v-if="Object.keys(account.urls).length === 0">
                <span class="icon-warning"></span>
                {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
              </p>
              <div v-else>
                <div v-if="Object.values(account.urls).some((isVerified) => isVerified)">
                  <p>{{ translate('SearchEngineKeywordsPerformance_AvailableSites') }}</p>

                  <ul class="websites-list">
                    <li
                      v-for="([url], index) in Object.entries(account.urls).filter(
                        ([, isVerified]) => isVerified,
                      )"
                      :key="index"
                    >
                      <span class="icon-success"></span> {{ url }}
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <p class="accounterror">
                    <span class="icon-warning"></span>
                    {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
                  </p>
                </div>

                <div v-if="Object.values(account.urls).some((isVerified) => !isVerified)">
                  <p>{{ translate('SearchEngineKeywordsPerformance_UnverifiedSites') }}</p>

                  <ul class="websites-list">
                    <li
                      v-for="([url], index) in Object.entries(account.urls).filter(
                        ([, isVerified]) => !isVerified,
                      )"
                      :key="index"
                    >
                      <span class="icon-error"></span> {{ url }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="cta">
              <form
                method="POST"
                action=""
                @submit.prevent="removeAccount(account, $event)"
              >
                <input type="hidden" name="remove" :value="account.apiKey">
                <input type="hidden" name="removeAccountNonce" :value="removeBingAccountNonce">
                <button type="submit" class="btn">{{ translate('General_Remove') }}</button>
              </form>
            </div>
          </div>

          <div :class="`account add ${hasApiKeyError ? 'invalid' : ''}`">
            <form method="POST" action="">
              <div class="icon-add logo"></div>

              <h3>{{ translate('SearchEngineKeywordsPerformance_AddAPIKey') }}</h3>

              <span v-html="$sanitize(bingApiKeyInstructionText)"></span>

              <p class="accounterror" v-if="hasApiKeyError">
                <br />
                <span class="icon-warning"></span>
                {{ translate('SearchEngineKeywordsPerformance_BingAccountError', error) }}
              </p>

              <Field
                uicontrol="text"
                :full-width="true"
                name="apikey"
                v-model="apiKeyToAdd"
                :title="translate('SearchEngineKeywordsPerformance_APIKey')"
                autocomplete="off"
              />

              <input type="hidden" name="config_nonce" :value="formNonce" />

              <div class="cta">
                <button type="submit" class="btn">
                  {{ translate('SearchEngineKeywordsPerformance_AddAPIKey') }}
                </button>
              </div>
            </form>
          </div>

          <div class="clear"></div>
        </div>
      </ContentBlock>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Matomo,
  ContentBlock,
  ContentTable,
  SiteRef,
  translate,
  Site,
  externalRawLink,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';

interface BingConfigState {
  removeAccountConfigName: string;
  removeAccountName: string;
  isAddingMeasurable: boolean;
  currentSiteToAdd: SiteRef;
  bingAccountAndUrlToAdd: string|null;
  apiKeyToAdd: string;
}

interface BingAccount {
  name: string;
  apiKey: string;
}

interface ConfiguredBingInfo {
  bingSiteUrl: string;
}

export default defineComponent({
  props: {
    configuredMeasurables: {
      type: Object,
      required: true,
    },
    accounts: {
      type: Object,
      required: true,
    },
    sitesInfos: {
      type: Object,
      required: true,
    },
    currentSite: {
      type: Object,
      required: true,
    },
    urlOptions: {
      type: [Object, Array],
      required: true,
    },
    error: String,
    apikey: String,
    formNonce: String,
    addBingSiteConfigNonce: String,
    removeBingSiteConfigNonce: String,
    removeBingAccountNonce: String,
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String,
  },
  data(): BingConfigState {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite as SiteRef,
      bingAccountAndUrlToAdd: null,
      apiKeyToAdd: this.apikey || '',
    };
  },
  components: {
    ContentBlock,
    Field,
  },
  directives: {
    ContentTable,
  },
  methods: {
    removeAccountConfig(siteId: string|number, event: Event) {
      const siteInfos = this.sitesInfos as Record<string|number, Site>;
      this.removeAccountConfigName = siteInfos[siteId].name;

      Matomo.helper.modalConfirm(this.$refs.confirmRemoveAccountConfig as HTMLElement, {
        yes() {
          (event.target as HTMLFormElement).submit();
        },
      });
    },
    getDisplayApiKey,
    removeAccount(account: BingAccount, event: Event) {
      this.removeAccountName = this.getDisplayApiKey(account.apiKey);
      Matomo.helper.modalConfirm(this.$refs.confirmDeleteAccount as HTMLElement, {
        yes() {
          (event.target as HTMLFormElement).submit();
        },
      });
    },
  },
  computed: {
    hasApiKeyError() {
      return typeof this.error !== 'undefined' && this.error !== null;
    },
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(
        this.configuredMeasurables as Record<string | number, ConfiguredBingInfo>,
      );

      return Object.fromEntries(
        entries.filter(([, config]) => {
          const [account] = config.bingSiteUrl.split('##');
          return !!this.accounts[account];
        }).map(([siteId, config]) => {
          const [account, url] = config.bingSiteUrl.split('##');
          const { apiKey } = this.accounts[account];

          return [
            siteId,
            {
              ...config,
              account,
              url,
              apiKeyDisplay: this.getDisplayApiKey(apiKey),
            },
          ];
        }),
      );
    },
    bingApiKeyInstructionText() {
      const url = externalRawLink('https://matomo.org/faq/reports/import-bing-and-yahoo-search-keywords-into-matomo/');
      return translate(
        'SearchEngineKeywordsPerformance_BingAPIKeyInstruction',
        '<a href="https://www.bing.com/webmasters" target="_new" rel="noreferrer noopener">',
        '</a>',
        `<a href="${url}" target="_blank" rel="noreferrer noopener">`,
        '</a>',
      );
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);

      return Object.fromEntries(filtered);
    },
  },
});
</script>
