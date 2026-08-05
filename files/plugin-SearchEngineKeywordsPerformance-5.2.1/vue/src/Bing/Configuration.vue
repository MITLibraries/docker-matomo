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
    <SearchEngineNavigation current-tab="bing" />
    <ContentBlock>
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
          <div class="measurable-list-scroller">
          <table v-content-table class="measurableList" v-tooltips>
            <thead>
            <tr>
              <th>{{ translate('General_Measurable') }}</th>
              <th>{{ translate('Mobile_Account') }}</th>
              <th>{{ translate('Goals_URL') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_LastImport') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_CreatedBy') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_Status') }}</th>
              <th>{{ translate('General_Action') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!Object.keys(configuredMeasurables).length">
              <td colspan="7">
                <strong>
                  {{ translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured') }}
                </strong>
              </td>
            </tr>
            <tr
              v-for="(config, siteId, index) in configuredMeasurablesToDisplay"
              :key="index"
            >
              <td>
                {{ sitesInfos[siteId].name }} <span>({{ sitesInfos[siteId].main_url }})</span>
              </td>

              <td>
                {{ config.apiKeyDisplay }}
              </td>
              <td>
                {{ config.url }}
              </td>
              <td>{{ sitesInfos[siteId].lastRun }}</td>
              <td>{{ config.createdByUser }}</td>
              <td>
                <span
                  class="status-error"
                  v-if="!sitesInfos[siteId].accountValid"
                  :title="translate('SearchEngineKeywordsPerformance_AuthenticationFailedTooltip')"
                >
                  {{ translate('SearchEngineKeywordsPerformance_AuthenticationFailed') }}
                </span>
                <span
                  class="status-error"
                  v-else-if="!sitesInfos[siteId].urlValid"
                  :title="translate('SearchEngineKeywordsPerformance_InvalidUrlTooltip')"
                >
                  {{ translate('SearchEngineKeywordsPerformance_InvalidUrl') }}
                </span>
                <span
                  class="status-active"
                  v-else
                  :title="translate('SearchEngineKeywordsPerformance_ActiveTooltip')"
                >
                  {{ translate('SearchEngineKeywordsPerformance_Active') }}
                </span>
              </td>
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
              <td colspan="7" align="right">
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
              <td colspan="4">
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

        <div class="oauthconfigoptions">
          <p class="secondary-text"
             v-html="$sanitize(bingApiKeyInstructionText)">
          </p>

          <p class="secondary-text" v-html="$sanitize(visitBingApiKeyHowTo)"></p>

          <p v-if="hasApiKeyError">
            <Notification context="error" type="transient">
              {{ translate('SearchEngineKeywordsPerformance_BingAccountErrorNew', error) }}
            </Notification>
          </p>

          <div class="bing-accounts">
            <div class="accounts-table-scroller">
            <table
              class="accounts-table entityTable"
              v-if="Object.keys(accountsToDisplay).length"
              v-tooltips
            >
              <thead>
                <tr>
                  <th>{{ translate('SearchEngineKeywordsPerformance_APIKey') }}</th>
                  <th>{{ translate('SearchEngineKeywordsPerformance_AddedBy') }}</th>
                  <th>{{ translate('SearchEngineKeywordsPerformance_TimeAdded') }}</th>
                  <th>
                    {{ translate('SearchEngineKeywordsPerformance_AvailableWebsitesForImport') }}
                  </th>
                  <th>{{ translate('SearchEngineKeywordsPerformance_UnverifiedWebsites') }}</th>
                  <th>{{ translate('SearchEngineKeywordsPerformance_Status') }}</th>
                  <th class="actions-column">{{ translate('General_Action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(account, accountId) in accountsToDisplay"
                  :key="accountId"
                >
                  <td>{{ getDisplayApiKey(account.apiKey) }}</td>
                  <td>{{ account.username }}</td>
                  <td>{{ account.created_formatted }}</td>
                  <td>
                    <div v-if="accountHasAvailableSites(account)">
                      {{ getAvailableWebsites(account)[0] }}
                      <WebsitesAvailableModal
                        :websites="getAvailableWebsites(account)"
                        :link-label="getAdditionalWebsitesLinkLabel(getAvailableWebsites(account))"
                      />
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <div
                      v-if="Object.values(account.urls).some((verified) => !verified)"
                    >
                      {{ getUnverifiedWebsites(account)[0] }}
                      <WebsitesAvailableModal
                        :websites="getUnverifiedWebsites(account)"
                        :link-label="getAdditionalWebsitesLinkLabel(getUnverifiedWebsites(account))"
                        :modal-title="unverifiedWebsitesModalTitle"
                      />
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span v-if="typeof account.hasError === 'string'">
                      <span
                        class="status-error"
                        :title="$sanitize(translate(
                          'SearchEngineKeywordsPerformance_BingAccountErrorNew',
                          account.hasError,
                        ))"
                      >
                        <span class="icon-warning"></span> {{ translate('General_Error') }}
                      </span>
                    </span>
                    <span
                      class="status-active"
                      v-else-if="accountHasAvailableSites(account)"
                      :title="translate('SearchEngineKeywordsPerformance_ActiveTooltip')"
                    >
                      {{ translate('SearchEngineKeywordsPerformance_Active') }}
                    </span>
                    <span
                      class="status-error"
                      :title="translate('SearchEngineKeywordsPerformance_AccountNoAccessNew')"
                      v-else
                    >
                      <span class="icon-warning"></span>
                      {{ translate('SearchEngineKeywordsPerformance_NoWebsiteAccess') }}
                    </span>
                  </td>
                  <td>
                    <span class="cta cta-inline">
                      <form
                        method="POST"
                        action=""
                        @submit.prevent="removeAccount(account, $event)"
                      >
                        <input type="hidden" name="remove" :value="account.apiKey">
                        <input type="hidden" name="removeAccountNonce"
                               :value="removeBingAccountNonce">
                        <button
                          type="submit"
                          class="btn-flat icon-delete"
                          :title="translate('General_Delete')"
                        ></button>
                      </form>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <div class="bing-account-add">

              <form method="POST" action="" class="bing-account-add-form">

                <Field
                  class="bing-account-add-form__field"
                  uicontrol="text"
                  :full-width="true"
                  name="apikey"
                  v-model="apiKeyToAdd"
                  :title="translate('SearchEngineKeywordsPerformance_APIKey')"
                  autocomplete="off"
                />

                <input type="hidden" name="config_nonce" :value="formNonce" />

                <div class="cta cta-start-oauth">
                  <button type="submit" class="btn">
                    {{ translate('SearchEngineKeywordsPerformance_AddAPIKey') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
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
  Notification,
  Tooltips,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';
import SearchEngineNavigation from '../Navigation/Navigation.vue';
import WebsitesAvailableModal from '../components/WebsitesAvailableModal.vue';

interface BingConfigState {
  removeAccountConfigName: string;
  removeAccountName: string;
  isAddingMeasurable: boolean;
  currentSiteToAdd: SiteRef;
  bingAccountAndUrlToAdd: string|null;
  apiKeyToAdd: string;
}

interface BingAccount {
  apiKey: string;
  username: string;
  created_formatted: string;
  urls: Record<string, boolean>;
  hasError?: string;
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
    SearchEngineNavigation,
    ContentBlock,
    Field,
    Notification,
    WebsitesAvailableModal,
  },
  directives: {
    ContentTable,
    Tooltips,
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
    accountHasAvailableSites(account: BingAccount) {
      return Object.values(account.urls).some((verified) => verified);
    },
    getAvailableWebsites(account: BingAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, verified]) => verified)
        .map(([url]) => url)
        .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
    },
    getUnverifiedWebsites(account: BingAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, verified]) => !verified)
        .map(([url]) => url)
        .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
    },
    getAdditionalWebsitesLinkLabel(websites: string[]): string {
      return `+${websites.length - 1}`;
    },
  },
  computed: {
    unverifiedWebsitesModalTitle() {
      return translate('SearchEngineKeywordsPerformance_UnverifiedWebsites');
    },
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
      return translate(
        'SearchEngineKeywordsPerformance_BingAPIKeyInstruction',
        '<a href="https://www.bing.com/webmasters" target="_new" rel="noreferrer noopener">',
        '</a>',
        '',
        '',
      );
    },
    visitBingApiKeyHowTo() {
      const link = externalRawLink('https://matomo.org/faq/reports/import-bing-and-yahoo-search-keywords-into-matomo/');
      return translate(
        'SearchEngineKeywordsPerformance_VisitBingApiKeyHowTo',
        `<a target="_blank" href="${link}" rel="noreferrer noopener">`,
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

<style scoped>

.secondary-text {
  color: var(--theme-color-text-lighter, #646464) !important;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.bing-account-add {
  padding: 30px 12px 20px;
}

.bing-account-add-form {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.bing-account-add-form__field {
  width: 300px;
  margin: 0;
  margin-top: -0.8rem;
  margin-left: -1rem;

  input {
    margin: 0;
  }
}

/* Wrap the add-key field and button on narrow widths instead of overflowing */
@media screen and (max-width: 600px) {
  .bing-account-add-form {
    flex-wrap: wrap;
  }

  .bing-account-add-form__field {
    width: 100%;
    max-width: 100%;
  }
}
</style>
