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
    <SearchEngineNavigation current-tab="google" />
    <ContentBlock
      v-if="(isClientConfigured && isOAuthConfigured) || !userIsSuperUser"
      :content-title="translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')"
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
          <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow') }}</p>

          <div class="ui-confirm" id="confirmRemoveAccountConfig" ref="confirmRemoveAccountConfig">
            <h2>{{ translate(
              'SearchEngineKeywordsPerformance_ConfigRemovalConfirm',
              removeAccountConfigName,
            ) }}</h2>
            <input role="yes" type="button" :value="translate('General_Yes')"/>
            <input role="no" type="button" :value="translate('General_No')"/>
          </div>

          <div class="measurable-list-scroller">
          <table v-content-table class="measurableList" v-tooltips>
            <thead>
            <tr>
              <th>{{ translate('General_Measurable') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_EnabledSearchTypes') }}</th>
              <th>{{ translate('Mobile_Account') }}</th>
              <th>{{ translate('Goals_URL') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_LastImport') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_CreatedBy') }}</th>
              <th>{{ translate('SearchEngineKeywordsPerformance_Status') }}</th>
              <th>{{ translate('General_Action') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="Object.keys(configuredMeasurablesToDisplay).length === 0">
              <td colspan="8">
                <strong>
                  {{ translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured') }}
                </strong>
              </td>
            </tr>
            <tr
              v-for="(config, siteId, index) in configuredMeasurablesToDisplay"
              :key="index"
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
                {{ accounts[config.account].name }}
              </td>
              <td>
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
              <td colspan="5">
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
          </div>
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
    </ContentBlock>
    <ContentBlock
        v-if="isClientConfigured"
        :content-title="translate('SearchEngineKeywordsPerformance_ConnectGoogleAccountsText')">
      <div
          v-if="isClientConfigured"
          class="oauthconfiguration"
      >

        <div class="ui-confirm" id="confirmDeleteAccount" ref="confirmDeleteAccount">
          <h2>{{ translate(
              'SearchEngineKeywordsPerformance_AccountRemovalConfirm',
              removeAccountName,
          ) }}</h2>
          <input role="yes" type="button" :value="translate('General_Yes')"/>
          <input role="no" type="button" :value="translate('General_No')"/>
        </div>

        <div class="oauthconfigoptions">

          <p v-if="isOAuthConfigured" class="secondary-text">
            {{ translate(
              'SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts',
              countOfAccountsWithAccess,
          ) }}
          </p>
          <p v-else>{{ translate('SearchEngineKeywordsPerformance_ConnectFirstAccount') }}</p>

          <p v-if="hasOAuthError">
            <Notification context="error" type="transient">
              {{ translate('SearchEngineKeywordsPerformance_OAuthErrorNew') }}
              <span v-if="hasOAuthError.length > 5">
                <br />
                {{ hasOAuthError }}
              </span>
            </Notification>
          </p>

          <div class="google-accounts">
            <div class="accounts-table-scroller">
            <table
                class="accounts-table entityTable"
                v-if="Object.keys(accounts).length"
                v-tooltips
            >
              <thead>
                <tr>
                  <th>{{ translate('SearchEngineKeywordsPerformance_GoogleAccount') }}</th>
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
                    <div v-if="Object.values(account.urls).indexOf('siteUnverifiedUser') !== -1">
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
                        v-else>
                      <span class="icon-warning"></span>
                      {{ translate('SearchEngineKeywordsPerformance_NoWebsiteAccess') }}
                    </span>
                  </td>
                  <td>
                    <span class="cta cta-inline">
                      <form
                          method="post"
                          :action="forwardToAuthUrl"
                      >
                        <input type="hidden" name="auth_nonce" :value="authNonce" />
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
                               :value="removeGoogleAccountNonce">
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
                  :action="forwardToAuthUrl"
              >
                <input type="hidden" name="auth_nonce" :value="authNonce" />
                <button type="submit" class="btn">
                  {{ translate('SearchEngineKeywordsPerformance_ConnectAccount') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </ContentBlock>
    <ContentBlock
        v-if="hasSetupCard"
        :content-title="setupCardTitle"
        class="oauth-setup-card"
    >
      <div
          class="clientconfiguration"
          v-if="showClientConfiguration"
      >
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
          v-if="showSetupExtensions"
      >
        <div v-for="(entry, index) in resolvedComponentExtensions" :key="index">
          <template
              v-if="entry.plugin === 'ConnectAccounts'
                && entry.component === 'PluginConnectedNotice'"
          >
            <p class="connected-notice-text">
              {{ connectedWithBody }}
              {{ translate('ConnectAccounts_ConnectedWithBody[beforeLink]') }}
              <a id="unlinkCloudGoogleConfig" :href="configConnectProps.unlinkUrl">
                {{ translate('ConnectAccounts_ConnectedWithBody[linkText]') }}
              </a>
            </p>
            <p class="connected-notice-text">{{ reAuthorizeBody }}</p>
            <div class="connected-notice-actions">
              <a class="googleSignInButton" :href="configConnectProps.authUrl">
                {{ reAuthorizeBtnText }}
              </a>
            </div>
          </template>
          <component
              v-else
              :is="entry.resolvedComponent"
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
              :connected-with="configConnectProps.connectedWith"
              :authorized-js-origin="configConnectProps.authorizedJsOrigin"
              :authorized-redirect-url="configConnectProps.authorizedRedirectUrl"
              :faq-url="configConnectProps.faqUrl"/>
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
  Tooltips,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { getDisplayApiKey } from '../utilities';
import SearchEngineNavigation from '../Navigation/Navigation.vue';
import WebsitesAvailableModal from '../components/WebsitesAvailableModal.vue';

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

interface ComponentExtensionWithResolvedComponent extends ComponentExtension {
  resolvedComponent: unknown;
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
  authorizedJsOrigin: string;
  authorizedRedirectUrl: string;
  faqUrl: string;
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
    SearchEngineNavigation,
    WebsitesAvailableModal,
  },
  directives: {
    ContentTable,
    Tooltips,
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
    getAvailableWebsites(account: GoogleAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, level]) => level !== 'siteUnverifiedUser')
        .map(([url]) => url.replaceAll('sc-domain:', ''))
        .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
    },
    getUnverifiedWebsites(account: GoogleAccount): string[] {
      return Object.entries(account.urls)
        .filter(([, accessLevel]) => accessLevel === 'siteUnverifiedUser')
        .map(([url]) => url.replaceAll('sc-domain:', ''))
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
    extensionEntries() {
      return this.extensions as Array<ComponentExtension>;
    },
    resolvedComponentExtensions() {
      const entries = this.extensionEntries as Array<ComponentExtension>;

      return markRaw(entries.map((entry) => ({
        ...entry,
        resolvedComponent: useExternalPluginComponent(entry.plugin, entry.component),
      }))) as Array<ComponentExtensionWithResolvedComponent>;
    },
    isCloudAppSetupCard() {
      return this.extensionEntries.some((entry) => entry.plugin === 'ConnectAccounts');
    },
    showClientConfiguration() {
      return !!this.userIsSuperUser
        && !!this.isClientConfigured
        && !!this.isClientConfigurable
        && (!!this.clientId || !!this.clientSecret);
    },
    showSetupExtensions() {
      return this.userIsSuperUser;
    },
    hasSetupCard() {
      return this.showClientConfiguration
        || (this.showSetupExtensions && this.extensionEntries.length > 0);
    },
    setupCardTitle() {
      if (this.isCloudAppSetupCard) {
        return this.extensionEntries.some((entry) => entry.plugin === 'ConnectAccounts'
          && entry.component === 'PluginConnectedNotice')
          ? translate('ConnectAccounts_ConnectedWithHeader')
          : translate('SearchEngineKeywordsPerformance_ConnectUsingMatomoCloudApp');
      }

      if (this.showClientConfiguration) {
        return translate('SearchEngineKeywordsPerformance_OAuthClientConfig');
      }

      return translate('SearchEngineKeywordsPerformance_GoogleConfigurationTitle');
    },
    connectedWithBody() {
      return translate('ConnectAccounts_ConnectedWithBody', [this.configConnectProps.connectedWith]);
    },
    reAuthorizeBody() {
      return translate('ConnectAccounts_ReAuthorizeBody', [this.configConnectProps.connectedWith]);
    },
    reAuthorizeBtnText() {
      return translate('ConnectAccounts_ReAuthorizeBtnText', [this.configConnectProps.connectedWith]);
    },
    configConnectProps() {
      return this.configureConnectionProps as ConfigureConnectionProps;
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

.account-info {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: -0.6rem;
}

.cta-inline form {
  display: inline-block;
}

.cta-inline button {
  margin-top: -1rem;
  padding: 0.5rem;
}

.cta-start-oauth {
  margin-top: 1rem !important;
}

.oauth-setup-card :deep(.section-heading) {
  display: none;
}

.connected-notice-text {
  margin-top: 0;
  margin-bottom: 1rem;
}

.connected-notice-actions {
  margin-top: 0.5rem;
}

.status-active {
  color: var(--theme-color-brand);
}

.status-error {
  color: var(--theme-color-base-series);
}
</style>
