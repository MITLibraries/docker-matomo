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
      <div
        v-if="!isClientConfigured && isClientConfigurable && !userIsSuperUser"
      >
        <div class="alert alert-warning">
          {{ translate('SearchEngineKeywordsPerformance_GooglePendingConfigurationErrorMessage') }}
        </div>
      </div>

      <div
        v-if="isClientConfigured && isOAuthConfigured"
      >
          <h3>{{ translate('SearchEngineKeywordsPerformance_ConfigureMeasurables') }}</h3>
          <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow') }}</p>

          <div class="ui-confirm" id="confirmRemoveAccountConfig" ref="confirmRemoveAccountConfig">
            <h2>{{ translate(
              'SearchEngineKeywordsPerformance_ConfigRemovalConfirm',
              removeAccountConfigName,
            ) }}</h2>
            <input role="yes" type="button" :value="translate('General_Yes')"/>
            <input role="no" type="button" :value="translate('General_No')"/>
          </div>

          <table v-content-table class="measurableList">
            <thead>
            <tr>
              <th>{{ translate('General_Measurable') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_EnabledSearchTypes') }}</th>
              <th>{{ translate('Mobile_Account') }}</th>
              <th>{{ translate('Goals_URL') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_LastImport') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_CreatedBy') }}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="Object.keys(configuredMeasurablesToDisplay).length === 0">
              <td colspan="7">
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
              <td v-html="$sanitize(sitesInfos[siteId].name)"></td>
              <td>
                {{ config.googleWebKeywords
                  ? translate('SearchEngineKeywordsPerformance_KeywordTypeWeb')
                  : '' }}
                {{ config.googleImageKeywords
                  ? translate('SearchEngineKeywordsPerformance_KeywordTypeImage')
                  : '' }}
                {{ config.googleVideoKeywords
                  ? translate('SearchEngineKeywordsPerformance_KeywordTypeVideo')
                  : '' }}
                {{ config.googleNewsKeywords
                  ? translate('SearchEngineKeywordsPerformance_KeywordTypeNews')
                  : '' }}
              </td>
              <td>
                <span class="icon-error" v-if="!sitesInfos[siteId].accountValid"></span>
                {{ accounts[config.account].name }}
              </td>
              <td>
                <span class="icon-error" v-if="!sitesInfos[siteId].urlValid"></span>
                {{ config.url.replaceAll('sc-domain:', '') }} <br />
                <span
                  v-if="/^sc-domain:/.test(config.url)"
                  class="property-type"
                  :title="translate('SearchEngineKeywordsPerformance_DomainPropertyInfo')"
                >
                  <span class="icon-info"></span>
                  ({{ translate('SearchEngineKeywordsPerformance_DomainProperty') }})
                </span>
                <span
                  v-else-if="/^http/.test(config.url)"
                  class="property-type"
                  :title="translate('SearchEngineKeywordsPerformance_URLPrefixPropertyInfo')"
                >
                  <span class="icon-info"></span>
                  ({{ translate('SearchEngineKeywordsPerformance_URLPrefixProperty') }})
                </span>
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
                         :value="removeGoogleSiteConfigNonce">
                  <button
                    type="submit"
                    class="btn-flat icon-delete"
                    :title="translate('General_Delete')"
                    v-if="config.isDeletionAllowed"
                  ></button>
                </form>
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
              <td>
                <Field
                  uicontrol="checkbox"
                  v-model="googleTypesToAdd"
                  var-type="array"
                  title="keyword types to fetch"
                  :full-width="true"
                  :options="googleTypeOptions"
                />
              </td>
              <td>
                <div class="account-select">
                  <Field
                    uicontrol="select"
                    v-model="googleAccountAndUrlToAdd"
                    :title="translate('SearchEngineKeywordsPerformance_UrlOfAccount')"
                    :full-width="true"
                    :options="urlOptions"
                  />
                </div>
              </td>
              <td colspan="4">
                <form action="" method="post">
                  <input type="hidden" name="googleSiteId" :value="currentSiteToAdd.id"/>
                  <input type="hidden" name="addSiteConfigNonce" :value="addGoogleSiteConfigNonce"/>
                  <input type="hidden" name="googleAccountAndUrl" :value="googleAccountAndUrlToAdd">
                  <input
                    type="hidden"
                    name="googleTypes"
                    :value="googleTypesToAdd.length ? googleTypesToAdd : 'web'"
                  />
                  <input type="submit" class="btn" :value="translate('General_Save')" />
                </form>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-show="!isAddingMeasurable" v-if="countOfAccountsWithAccess">
          <button
            id="addWebsiteBtn"
            class="btn"
            @click="isAddingMeasurable = true"
          >
            {{ translate('SearchEngineKeywordsPerformance_AddConfiguration') }}
          </button>
        </div>
      </div>

      <div
        v-if="isClientConfigured"
        class="oauthconfiguration"
      >
        <h3 class="section-heading">{{ translate(
          'SearchEngineKeywordsPerformance_ConnectGoogleAccounts') }}</h3>

        <div class="ui-confirm" id="confirmDeleteAccount" ref="confirmDeleteAccount">
          <h2>{{ translate(
            'SearchEngineKeywordsPerformance_AccountRemovalConfirm',
            removeAccountName,
          ) }}</h2>
          <input role="yes" type="button" :value="translate('General_Yes')"/>
          <input role="no" type="button" :value="translate('General_No')"/>
        </div>

        <div class="oauthconfigoptions">

          <p v-if="isOAuthConfigured">
            {{ translate(
              'SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts',
              countOfAccountsWithAccess,
            ) }}
          </p>
          <p v-else>{{ translate('SearchEngineKeywordsPerformance_ConnectFirstAccount') }}</p>

          <p v-if="hasOAuthError">
            <Notification context="error" type="transient">
              {{ translate('SearchEngineKeywordsPerformance_OAuthError') }}
              <span v-if="hasOAuthError.length > 5">
                <br />
                {{ hasOAuthError }}
              </span>
            </Notification>
          </p>

          <div class="accounts">
            <div
              v-for="(account, accountId) in accountsToDisplay"
              :key="accountId"
              class="account"
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
                  ) }}
                  {{ account.hasError }}
                </p>

                <p>
                  {{ translate('SearchEngineKeywordsPerformance_ReAddAccountIfPermanentError') }}
                </p>
              </div>
              <div v-else>
                <div v-if="Object.keys(account.urls).length === 0">
                  <p class="accounterror">
                    <span class="icon-warning"></span>
                    {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
                  </p>
                </div>
                <div v-else>
                  <div v-if="accountHasAvailableSites(account)">
                    <p>{{ translate('SearchEngineKeywordsPerformance_AvailableSites') }}</p>

                    <ul class="websites-list">
                      <li
                        v-for="([url], index) in Object.entries(account.urls).filter(
                          ([, level]) => level !== 'siteUnverifiedUser',
                        )"
                        :key="index"
                      >
                        <span class="icon-success"></span> {{ url.replaceAll('sc-domain:', '') }}
                      </li>
                    </ul>
                  </div>
                  <p class="accounterror" v-else>
                    <span class="icon-warning"></span>
                    {{ translate('SearchEngineKeywordsPerformance_AccountNoAccess') }}
                  </p>
                  <div v-if="Object.values(account.urls).indexOf('siteUnverifiedUser') !== -1">
                    <p>{{ translate('SearchEngineKeywordsPerformance_UnverifiedSites') }}</p>

                    <ul class="websites-list">
                      <li
                        v-for="([url], index) in Object.entries(account.urls).filter(
                          ([, accessLevel]) => accessLevel === 'siteUnverifiedUser',
                        )"
                        :key="index"
                      >
                        <span class="icon-error"></span> {{ url.replaceAll('sc-domain:', '') }}
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
                  <input type="hidden" name="remove" :value="accountId">
                  <input type="hidden" name="removeAccountNonce" :value="removeGoogleAccountNonce">
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
                  'Google',
                ) }}
              </p>

              <p>{{ translate('SearchEngineKeywordsPerformance_RequiredAccessTypes') }}</p>

              <ul>
                <li v-html="$sanitize(
                  translate(
                    'SearchEngineKeywordsPerformance_GoogleAccountAccessTypeSearchConsoleData',
                  ))"
                ></li>
                <li v-html="$sanitize(
                  translate('SearchEngineKeywordsPerformance_GoogleAccountAccessTypeProfileInfo')
                )"></li>
                <li v-html="$sanitize(
                  translate(
                    'SearchEngineKeywordsPerformance_GoogleAccountAccessTypeOfflineAccess'
                    ))"></li>
              </ul>

              <div class="cta">
                <form
                  method="post"
                  :action="forwardToAuthUrl"
                  id="clientauthform"
                >
                  <input type="hidden" name="auth_nonce" :value="authNonce" />
                  <button type="submit" class="btn">
                    {{ translate('SearchEngineKeywordsPerformance_StartOAuth') }}
                  </button>
                </form>
              </div>
            </div>

            <div class="clear"></div>
          </div>

        </div>
      </div>

      <div
        class="clientconfiguration"
        v-if="isClientConfigurable && isClientConfigured && userIsSuperUser"
      >
        <h3 class="section-heading">{{
            translate('SearchEngineKeywordsPerformance_OAuthClientConfig') }}</h3>
        <p>
          <strong>{{ translate('SearchEngineKeywordsPerformance_ClientId') }}:</strong>
          {{ clientId }}
        </p>
        <p>
          <strong>{{ translate('SearchEngineKeywordsPerformance_ClientSecret') }}:</strong>
          {{ clientSecret }}
        </p>
        <br />
        <form :action="removeConfigUrl" method="POST"
              enctype="multipart/form-data" id="removeConfigForm">
          <p>{{ translate('SearchEngineKeywordsPerformance_DeleteUploadedClientConfig') }}:</p>

          <input type="hidden" name="config_nonce" :value="formNonce" />

          <button type="submit" class="btn">{{ translate('General_Remove') }}</button>
        </form>
      </div>
      <div
        v-if="userIsSuperUser"
      >
        <div v-for="(refComponent, index) in componentExtensions" :key="index">
          <component
            :is="refComponent"
            :manual-config-nonce="configConnectProps.manualConfigNonce"
            :base-domain="configConnectProps.baseDomain"
            :base-url="configConnectProps.baseUrl"
            :manual-action-url="configConnectProps.manualActionUrl"
            :primary-text="configConnectProps.primaryText"
            :radio-options="configConnectProps.radioOptions"
            :manual-config-text="configConnectProps.manualConfigText"
            :connect-accounts-url="configConnectProps.connectAccountsUrl"
            :connect-accounts-btn-text="configConnectProps.connectAccountsBtnText"
            :auth-url="configConnectProps.authUrl"
            :unlink-url="configConnectProps.unlinkUrl"
            :strategy="configConnectProps.strategy"
            :connected-with="configConnectProps.connectedWith"/>
        </div>
      </div>
    </ContentBlock>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  markRaw,
} from 'vue';
import {
  ContentBlock,
  ContentTable,
  Matomo,
  SiteRef,
  translate,
  Notification,
  MatomoUrl,
  Site,
  useExternalPluginComponent,
  externalRawLink,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';

interface GoogleConfigState {
  removeAccountConfigName: string;
  removeAccountName: string;
  isAddingMeasurable: boolean;
  currentSiteToAdd: SiteRef;
  googleAccountAndUrlToAdd: string|null;
  googleTypesToAdd: string[];
  clientFile: unknown;
  clientText: string;
}

interface GoogleAccount {
  name: string;
  apiKey: string;
  urls: Record<string, string>;
}

interface ConfiguredGoogleInfo {
  googleSearchConsoleUrl: string;
}

interface ComponentExtension {
  plugin: string;
  component: string;
}

interface ConfigureConnectionRadioOption {
  connectAccounts: string;
  manual: string;
}

interface ConfigureConnectionProps {
  baseDomain: string;
  baseUrl: string;
  manualConfigNonce: string;
  manualActionUrl: string;
  primaryText: string;
  radioOptions: ConfigureConnectionRadioOption[];
  manualConfigText: string;
  connectAccountsUrl: string;
  connectAccountsBtnText: string;
  authUrl: string;
  unlinkUrl: string;
  strategy: string;
  connectedWith: string;
}

export default defineComponent({
  props: {
    configuredMeasurables: {
      type: Object,
      required: true,
    },
    isClientConfigured: Boolean,
    isClientConfigurable: Boolean,
    isOAuthConfigured: Boolean,
    clientId: String,
    clientSecret: String,
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
    hasOAuthError: [String, Boolean],
    authNonce: {
      type: String,
      required: true,
    },
    formNonce: String,
    addGoogleSiteConfigNonce: String,
    removeGoogleSiteConfigNonce: String,
    removeGoogleAccountNonce: String,
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String,
    extensions: Array,
    removeConfigUrl: String,
    configureConnectionProps: {
      type: Object,
      required: true,
    },
  },
  components: {
    ContentBlock,
    Field,
    Notification,
  },
  directives: {
    ContentTable,
  },
  data(): GoogleConfigState {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite as SiteRef,
      googleAccountAndUrlToAdd: null,
      googleTypesToAdd: ['web'],
      clientFile: null,
      clientText: '',
    };
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
    removeAccount(account: GoogleAccount, event: Event) {
      this.removeAccountName = account.name;

      Matomo.helper.modalConfirm(
        this.$refs.confirmDeleteAccount as HTMLElement,
        {
          yes() {
            (event.target as HTMLFormElement).submit();
          },
        },
      );
    },
    accountHasAvailableSites(account: GoogleAccount) {
      const siteAccessLevels = ['siteOwner', 'siteFullUser', 'siteRestrictedUser'];
      return Object.values(account.urls).some(
        (siteAccess) => siteAccessLevels.indexOf(siteAccess) !== -1,
      );
    },
  },
  computed: {
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(
        this.configuredMeasurables as Record<string | number, ConfiguredGoogleInfo>,
      );

      return Object.fromEntries(
        entries.filter(([, config]) => {
          const [account] = config.googleSearchConsoleUrl.split('##');
          return !!this.accounts[account];
        }).map(([siteId, config]) => {
          const [account, url] = config.googleSearchConsoleUrl.split('##');
          const { apiKey } = this.accounts[account];

          return [
            siteId,
            {
              ...config,
              account,
              url,
              apiKeyDisplay: getDisplayApiKey(apiKey),
            },
          ];
        }),
      );
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);

      return Object.fromEntries(filtered);
    },
    googleTypeOptions() {
      return {
        web: translate('SearchEngineKeywordsPerformance_KeywordTypeWeb'),
        image: translate('SearchEngineKeywordsPerformance_KeywordTypeImage'),
        video: translate('SearchEngineKeywordsPerformance_KeywordTypeVideo'),
        news: translate('SearchEngineKeywordsPerformance_KeywordTypeNews'),
      };
    },
    forwardToAuthUrl() {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        action: 'forwardToAuth',
      })}`;
    },
    visitOAuthHowTo() {
      const link = externalRawLink('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-oauth-client-config');
      return translate(
        'SearchEngineKeywordsPerformance_VisitOAuthHowTo',
        `<a target="_blank" href="${link}" rel="noreferrer noopener">`,
        '</a>',
        'Google',
      );
    },
    componentExtensions() {
      const entries = this.extensions as Array<ComponentExtension>;

      return markRaw(entries.map((ref) => useExternalPluginComponent(ref.plugin,
        ref.component)));
    },
    configConnectProps() {
      return this.configureConnectionProps as ConfigureConnectionProps;
    },
  },
});
</script>
