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
          <tr
            v-for="(config, siteId, index) in configuredMeasurablesToDisplay"
            :key="index"
            :class="!sitesInfos[siteId].accountValid || !sitesInfos[siteId].urlValid ? 'error' : ''"
          >
            <td v-html="$sanitize(sitesInfos[siteId].name)"></td>

            <td>
              <span class="icon-error" v-if="!sitesInfos[siteId].accountValid"></span>
              {{ accounts[config.account].name }}
            </td>
            <td>
              <span class="icon-error" v-if="!sitesInfos[siteId].urlValid"></span>
              {{ config.hostUrl || config.host }}
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
            <td colspan="6" align="right">
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
            <td colspan="3">
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
      </ContentBlock>
    </div>

    <div
      v-if="isClientConfigured"
      :class="`oauthconfiguration ${isOAuthConfigured ? 'configured' : ''} yandex`"
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
              {{ translate('SearchEngineKeywordsPerformance_OAuthError') }}
              <span v-if="typeof hasOAuthError === 'string'">
                <br />
                {{ hasOAuthError }}
              </span>
            </Notification>
          </p>

          <div class="accounts">
            <div
              v-for="(account, accountId) in accountsToDisplay"
              :key="accountId"
              :class="`account ${Object.keys(account.urls).length === 0
                || typeof account.hasError === 'string' ? 'invalid' : ''}`"
            >

              <div class="logo">
                <img :src="account.picture">
              </div>

              <h3>{{ account.name }}</h3>

              <p v-html="$sanitize(translate(
                'SearchEngineKeywordsPerformance_AccountAddedBy',
                account.username,
                account.created_formatted,
              ))"/>

              <div v-if="typeof account.hasError === 'string'">
                <p class="accounterror">
                  <span class="icon-warning"></span>
                  {{ translate(
                    'SearchEngineKeywordsPerformance_AccountConnectionValidationError',
                  ) }} {{ account.hasError }}
                </p>

                <p>
                  {{ translate('SearchEngineKeywordsPerformance_ReAuthenticateIfPermanentError') }}
                </p>
              </div>
              <div v-else>
                <p class="accounterror" v-if="Object.keys(account.urls).length === 0">
                  <span class="icon-warning"></span>
                  {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
                </p>
                <div v-else>
                  <div v-if="Object.values(account.urls).some((hostdata) => hostdata.verified)">
                    <p>{{ translate('SearchEngineKeywordsPerformance_AvailableSites') }}</p>

                    <ul class="websites-list">
                      <li
                        v-for="([url], index) in Object.entries(account.urls).filter(
                          ([, hostdata]) => hostdata.verified,
                        )"
                        :key="index"
                      >
                        <span class="icon-success"></span> {{ url }}
                      </li>
                    </ul>
                  </div>
                  <p class="accounterror" v-else>
                    <span class="icon-warning"></span>
                    {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
                  </p>
                  <div v-if="Object.values(account.urls).some((hostdata) => !hostdata.verified)">
                    <p>{{ translate('SearchEngineKeywordsPerformance_UnverifiedSites') }}</p>

                    <ul class="websites-list">
                      <li
                        v-for="([url], index) in Object.entries(account.urls).filter(
                          ([, hostdata]) => !hostdata.verified,
                        )"
                        :key="index"
                      >
                        <span class="icon-error"></span> {{ url }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <p class="accounterror" v-if="account.authDaysAgo >= 180">
                <span class="icon-warning"></span>
                {{ translate('SearchEngineKeywordsPerformance_OAuthAccessTimedOut') }}
              </p>
              <p class="accounterror" v-else-if="account.authDaysAgo >= 150">
                <span class="icon-warning"></span>
                <span v-html="$sanitize(translate(
                  'SearchEngineKeywordsPerformance_OAuthAccessWillTimeOutSoon',
                  180 - account.authDaysAgo,
                ))"/>
              </p>
              <p v-else v-html="$sanitize(translate(
                'SearchEngineKeywordsPerformance_OAuthAccessWillTimeOut',
                180,
                180 - account.authDaysAgo,
              ))"/>

              <div class="cta">
                <form method="post" :action="forwardToYandexAuthUrl">
                  <input type="hidden" name="auth_nonce" :value="auth_nonce" />
                  <button type="submit" class="btn">
                    {{ translate('SearchEngineKeywordsPerformance_Reauthenticate') }}
                  </button>
                </form>
                <form
                  method="POST"
                  action=""
                  @submit.prevent="removeAccount(account, $event)"
                >
                  <input type="hidden" name="remove" :value="accountId">
                  <input type="hidden" name="removeAccountNonce" :value="removeYandexAccountNonce">
                  <button type="submit" class="btn">{{ translate('General_Remove') }}</button>
                </form>
              </div>
            </div>

            <div class="account add">
              <div class="icon-add logo"></div>

              <h3>{{ translate('SearchEngineKeywordsPerformance_ConnectAccount') }}</h3>

              <p>
                {{ translate(
                  'SearchEngineKeywordsPerformance_ConnectAccountDescription',
                  'Yandex',
                ) }}
              </p>

              <p>{{ translate('SearchEngineKeywordsPerformance_ConnectAccountYandex', '180') }}</p>

              <div class="cta">
                <form method="post" :action="forwardToYandexAuthUrl" id="clientauthform">
                  <input type="hidden" name="auth_nonce" :value="auth_nonce" />
                  <button type="submit" class="btn">
                    {{ translate('SearchEngineKeywordsPerformance_StartOAuth') }}
                  </button>
                </form>
              </div>
            </div>

            <div class="clear"></div>
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
      v-if="userIsSuperUser"
      class="clientconfighelp">
      <ContentBlock
        :content-title="translate('SearchEngineKeywordsPerformance_HowToGetOAuthClientConfig')"
      >
        <p v-html="visitOAuthHowTo"></p>
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
      v-if="userIsSuperUser"
      :class="!isClientConfigured ? 'clientconfiguration' : ''">
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
          />

          <Field
            uicontrol="text"
            name="clientsecret"
            v-model="clientSecretToUse"
            :title="translate('SearchEngineKeywordsPerformance_ClientSecret')"
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
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';

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
  urls: Record<string, { host_id: string }>;
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
    ContentBlock,
    Field,
    Notification,
  },
  directives: {
    ContentTable,
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
