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
    <SearchEngineNavigation current-tab="yandex" />
    <ContentBlock>
      <h2>{{ translate('SearchEngineKeywordsPerformance_YandexConfigurationTitle') }}</h2>

      {{ translate('SearchEngineKeywordsPerformance_YandexConfigurationDescription') }}
    </ContentBlock>

    <div
      v-if="isClientConfigured && isOAuthConfigured"
      :class="Object.keys(configuredMeasurables).length ? 'configured' : ''"
    >
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')"
      >
        <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow') }}</p>

        <div class="ui-confirm" id="confirmRemoveAccountConfig" ref="confirmRemoveAccountConfig">
          <h2>
            {{ translate(
              'SearchEngineKeywordsPerformance_ConfigRemovalConfirm',
              removeAccountConfigName,
            ) }}
          </h2>
          <input role="yes" type="button" :value="translate('General_Yes')"/>
          <input role="no" type="button" :value="translate('General_No')"/>
        </div>

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
          <tr
            v-for="(config, siteId, index) in configuredMeasurablesToDisplay"
            :key="index"
          >
            <td v-html="$sanitize(sitesInfos[siteId].name)"></td>

            <td>
              {{ accounts[config.account].name }}
            </td>
            <td>
              {{ config.hostUrl || config.host }}
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
                       :value="removeYandexSiteConfigNonce">
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
                @click="isAddingMeasurable = true"
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
                :full-width="true"
                v-model="currentSiteToAdd"
                :title="translate('CoreHome_ChooseX', translate('General_Measurable'))"
              />
            </td>
            <td colspan="2">
              <div class="account-select">
                <Field
                  uicontrol="select"
                  v-model="yandexAccountAndHostIdToAdd"
                  :title="translate('SearchEngineKeywordsPerformance_UrlOfAccount')"
                  :full-width="true"
                  :options="urlOptions"
                />
              </div>
            </td>
            <td colspan="4">
              <form action="" method="post">
                <input type="hidden" name="yandexSiteId" :value="currentSiteToAdd?.id"/>
                <input type="hidden" name="addSiteConfigNonce" :value="addYandexSiteConfigNonce"/>
                <input
                  type="hidden"
                  name="yandexAccountAndHostId"
                  :value="yandexAccountAndHostIdToAdd"
                />
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
      v-if="isClientConfigured"
      class="yandex"
    >
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_ConnectYandexAccounts')"
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

          <p v-if="isOAuthConfigured">
            {{ translate(
              'SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts',
               countOfAccountsWithAccess,
            ) }}</p>
          <p v-else>{{ translate('SearchEngineKeywordsPerformance_ConnectFirstAccount') }}</p>

          <p v-if="hasOAuthError">
            <Notification context="error">
              {{ translate('SearchEngineKeywordsPerformance_OAuthErrorNew') }}
              <span v-if="typeof hasOAuthError === 'string'">
                <br />
                {{ hasOAuthError }}
              </span>
            </Notification>
          </p>

          <div class="yandex-accounts">
            <div class="accounts-table-scroller">
            <table
              class="accounts-table entityTable"
              v-if="Object.keys(accounts).length"
              v-tooltips
            >
              <thead>
              <tr>
                <th>{{ translate('SearchEngineKeywordsPerformance_YandexAccount') }}</th>
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
                <td>
                  <div class="account-info">
                    <img
                      v-if="account.picture"
                      :src="account.picture"
                      alt="avatar"
                      class="avatar"
                    />
                    <div
                      v-else
                      class="avatar placeholder"
                    >
                      {{ account.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="name">{{ account.name }}</div>
                    </div>
                  </div>
                </td>
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
                    v-if="Object.values(account.urls).some((siteAccess) => !siteAccess.verified)"
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
                  <div class="status-cell">
                    <span
                      v-if="account.authDaysAgo >= 180"
                      class="status-warning"
                      :title="translate('SearchEngineKeywordsPerformance_OAuthAccessTimedOutNew')"
                    >
                      <span class="icon-warning"></span> {{ translate('General_Warning') }}
                    </span>
                    <span v-else-if="typeof account.hasError === 'string'">
                      <span class="status-error" :title="$sanitize(account.hasError)">
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
                    <span
                      v-if="account.authDaysAgo >= 150 && account.authDaysAgo < 180"
                      class="status-warning"
                      :title="translate(
                        'SearchEngineKeywordsPerformance_OAuthAccessWillTimeOutSoonNew',
                        180 - account.authDaysAgo,
                      )"
                    >
                      <span class="icon-warning"></span> {{ translate('General_Warning') }}
                    </span>
                  </div>
                </td>
                <td>
                    <span class="cta cta-inline">
                      <form
                        method="post"
                        :action="forwardToYandexAuthUrl"
                      >
                        <input type="hidden" name="auth_nonce" :value="auth_nonce" />
                        <button
                          type="submit"
                          class="btn-flat icon-refresh"
                          :title="translate('General_Refresh')"
                        ></button>
                      </form>
                      <form
                        method="POST"
                        action=""
                        @submit.prevent="removeAccount(account, $event)"
                      >
                        <input type="hidden" name="remove" :value="accountId">
                        <input type="hidden" name="removeAccountNonce"
                               :value="removeYandexAccountNonce">
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
            <div class="cta cta-start-oauth">
              <form
                method="post"
                :action="forwardToYandexAuthUrl"
              >
                <input type="hidden" name="auth_nonce" :value="auth_nonce" />
                <button type="submit" class="btn">
                  {{ translate('SearchEngineKeywordsPerformance_ConnectAccount') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </ContentBlock>
    </div>

    <div
      v-if="isClientConfigured && userIsSuperUser"
      :class="`clientconfiguration ${isClientConfigured ? 'configured' : ''}`"
    >
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_OAuthClientConfig')"
      >
        <p>
          <strong>{{ translate('SearchEngineKeywordsPerformance_ClientId') }}:</strong>
          {{ clientId }}
        </p>
        <p>
          <strong>{{ translate('SearchEngineKeywordsPerformance_ClientSecret') }}:</strong>
          {{ clientSecret }}
        </p>
      </ContentBlock>
    </div>

    <div
      v-if="userIsSuperUser && !isClientConfigured"
      class="clientconfighelp">
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_HowToGetOAuthClientConfig')"
      >
        <p v-html="$sanitize(visitOAuthHowTo)"></p>
        <p>
          {{ translate('SearchEngineKeywordsPerformance_OAuthExampleText') }} <br>
          <strong>{{
              translate('SearchEngineKeywordsPerformance_YandexFieldUrlToAppSite')
            }}:</strong> {{ baseDomain }} <br>
          <strong>{{
              translate('SearchEngineKeywordsPerformance_YandexFieldCallbackUri')
            }}:</strong>
          {{ baseDomainUrl }}?module=SearchEngineKeywordsPerformance&action=processYandexAuthCode
        </p>
      </ContentBlock>
    </div>

    <div
      v-if="userIsSuperUser && !isClientConfigured"
      class="clientconfiguration">
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_SetUpOAuthClientConfig')"
      >
        <form method="post" action="" id="clientconfigform">
          <p>{{ translate('SearchEngineKeywordsPerformance_ProvideYandexClientConfig') }}</p>

          <Field
            uicontrol="text"
            name="clientid"
            v-model="clientIdToUse"
            :title="translate('SearchEngineKeywordsPerformance_ClientId')"
            autocomplete="off"
          />

          <Field
            uicontrol="text"
            name="clientsecret"
            v-model="clientSecretToUse"
            :title="translate('SearchEngineKeywordsPerformance_ClientSecret')"
            autocomplete="off"
          />

          <input type="hidden" name="config_nonce" :value="formNonce" />

          <button type="submit" class="btn">{{ translate('General_Save') }}</button>
        </form>
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
  Notification,
  MatomoUrl,
  translate,
  Site,
  externalRawLink,
  Tooltips,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';
import SearchEngineNavigation from '../Navigation/Navigation.vue';
import WebsitesAvailableModal from '../components/WebsitesAvailableModal.vue';

interface YandexConfigState {
  removeAccountConfigName: string;
  removeAccountName: string;
  isAddingMeasurable: boolean;
  currentSiteToAdd: SiteRef;
  yandexAccountAndHostIdToAdd: string|null;
  clientIdToUse: string;
  clientSecretToUse: string;
}

interface YandexAccount {
  name: string;
  apiKey: string;
  urls: Record<string, { host_id: string; verified: boolean }>;
}

interface ConfiguredYandexInfo {
  yandexAccountAndHostId: string;
}

export default defineComponent({
  props: {
    isClientConfigured: Boolean,
    isClientConfigurable: Boolean,
    isOAuthConfigured: Boolean,
    clientId: String,
    clientSecret: String,
    configuredMeasurables: {
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
    hasOAuthError: [String, Boolean],
    accounts: {
      type: Object,
      required: true,
    },
    auth_nonce: {
      type: String,
      required: true,
    },
    formNonce: {
      type: String,
      required: true,
    },
    addYandexSiteConfigNonce: {
      type: String,
      required: true,
    },
    removeYandexSiteConfigNonce: {
      type: String,
      required: true,
    },
    removeYandexAccountNonce: {
      type: String,
      required: true,
    },
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String,
    baseDomain: String,
    baseDomainUrl: String,
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
  data(): YandexConfigState {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite as SiteRef,
      yandexAccountAndHostIdToAdd: null,
      clientIdToUse: '',
      clientSecretToUse: '',
    };
  },
  methods: {
    accountHasAvailableSites(account: YandexAccount) {
      return Object.values(account.urls).some(
        (siteAccess) => siteAccess.verified,
      );
    },
    getAvailableWebsites(account: YandexAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, siteAccess]) => siteAccess.verified)
        .map(([url]) => url.replaceAll('sc-domain:', ''))
        .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
    },
    getUnverifiedWebsites(account: YandexAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, siteAccess]) => !siteAccess.verified)
        .map(([url]) => url.replaceAll('sc-domain:', ''))
        .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
    },
    getAdditionalWebsitesLinkLabel(websites: string[]): string {
      return `+${websites.length - 1}`;
    },
    removeAccountConfig(siteId: string|number, event: Event) {
      const siteInfos = this.sitesInfos as Record<string|number, Site>;
      this.removeAccountConfigName = siteInfos[siteId].name;

      Matomo.helper.modalConfirm(
        this.$refs.confirmRemoveAccountConfig as HTMLElement,
        {
          yes() {
            (event.target as HTMLFormElement).submit();
          },
        },
      );
    },
    removeAccount(account: YandexAccount, event: Event) {
      this.removeAccountName = account.name;

      Matomo.helper.modalConfirm(this.$refs.confirmDeleteAccount as HTMLElement, {
        yes() {
          (event.target as HTMLFormElement).submit();
        },
      });
    },
  },
  computed: {
    unverifiedWebsitesModalTitle() {
      return translate('SearchEngineKeywordsPerformance_UnverifiedWebsites');
    },
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(
        this.configuredMeasurables as Record<string | number, ConfiguredYandexInfo>,
      );

      return Object.fromEntries(
        entries.filter(([, config]) => {
          const [account] = config.yandexAccountAndHostId.split('##');
          return !!this.accounts[account];
        }).map(([siteId, config]) => {
          const [account, host] = config.yandexAccountAndHostId.split('##');
          const accountInfo = this.accounts[account] as YandexAccount;
          const { apiKey } = accountInfo;

          const hostUrlPair = Object.entries(accountInfo.urls).find(
            ([, data]) => data.host_id === host,
          );
          const hostUrl = hostUrlPair?.[0];

          return [
            siteId,
            {
              ...config,
              account,
              host,
              hostUrl,
              apiKeyDisplay: getDisplayApiKey(apiKey),
            },
          ];
        }),
      );
    },
    forwardToYandexAuthUrl() {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        action: 'forwardToYandexAuth',
      })}`;
    },
    visitOAuthHowTo() {
      const link = externalRawLink('https://matomo.org/faq/reports/import-yandex-search-keywords-into-matomo/');
      return translate(
        'SearchEngineKeywordsPerformance_VisitOAuthHowTo',
        `<a target="_blank" href="${link}" rel="noreferrer noopener">`,
        '</a>',
        'Yandex',
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

</style>
