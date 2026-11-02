<!--
  Matomo - free/libre analytics platform
  @link https://matomo.org
  @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <div class="oauthAdvancedConfig">
    <div class="form-group row">
      <div class="col s12">
        <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel1') }}</p>
      </div>
    </div>

    <div class="oauth-step-card">
      <div class="oauth-step-number">1</div>
      <div class="oauth-step-body">
        <h4 class="oauth-step-title">
          {{ translate('SearchEngineKeywordsPerformance_AdvancedStep1Title') }}
        </h4>
        <p>{{ translate('SearchEngineKeywordsPerformance_OAuthExampleText') }}</p>

        <div class="oauth-config-values">
          <div class="oauth-config-row">
            <span class="oauth-config-label">
              {{ translate('SearchEngineKeywordsPerformance_GoogleAuthorizedJavaScriptOrigin') }}
            </span>
            <pre v-copy-to-clipboard="{}" class="oauth-config-value">{{ baseDomain }}</pre>
          </div>
          <div class="oauth-config-row">
            <span class="oauth-config-label">
              {{ translate('SearchEngineKeywordsPerformance_GoogleAuthorizedRedirectUri') }}
            </span>
            <pre
              v-copy-to-clipboard="{}"
              class="oauth-config-value"
            >{{ baseUrl }}{{ redirectUri }}</pre>
          </div>
        </div>

        <a class="btn" :href="faqUrl" target="_blank" rel="noreferrer noopener">
          {{ translate('SearchEngineKeywordsPerformance_StepByStepInstructions') }}
        </a>
      </div>
    </div>

    <div class="oauth-step-card">
      <div class="oauth-step-number">2</div>
      <div class="oauth-step-body">
        <h4 class="oauth-step-title">
          {{ translate('SearchEngineKeywordsPerformance_AdvancedStep2Title') }}
        </h4>
        <p v-html="$sanitize(advancedStep2Desc)"></p>
      </div>
    </div>

    <div class="oauth-step-card">
      <div class="oauth-step-number">3</div>
      <div class="oauth-step-body">
        <h4 class="oauth-step-title">
          {{ translate('SearchEngineKeywordsPerformance_AdvancedStep3Title') }}
        </h4>
        <p>{{ translate('SearchEngineKeywordsPerformance_AdvancedStep3Desc') }}</p>

        <form id="configFileUploadForm" action="" method="POST"
              enctype="multipart/form-data">
          <input type="file" id="clientfile" name="clientfile" accept=".json"
                 v-on:change="processFileChange" style="display:none"/>

          <input type="hidden" id="client" name="client" />

          <input type="hidden" name="config_nonce" :value="manualConfigNonce" />

          <button type="button" class="btn" @click="selectConfigFile()"
                  :disabled="isUploadButtonDisabled">
            <span v-show="!isUploadButtonDisabled">
              <span class="icon-upload"></span> {{ translate('General_Upload') }}</span>
            <span v-show="isUploadButtonDisabled">
              <span class="icon-upload"/>
              {{ translate('SearchEngineKeywordsPerformance_Uploading') }}
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  translate,
  externalRawLink,
  CopyToClipboard,
} from 'CoreHome';

export default defineComponent({
  directives: {
    CopyToClipboard,
  },
  data() {
    return {
      redirectUri: '?module=SearchEngineKeywordsPerformance&action=processAuthCode',
      isSelectingFile: false,
      isUploading: false,
    };
  },
  props: {
    manualConfigNonce: {
      type: String,
      required: true,
    },
    baseDomain: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectConfigFile() {
      this.isSelectingFile = true;
      const fileInput = document.getElementById('clientfile');
      if (fileInput) {
        fileInput.click();
      }
    },
    processFileChange() {
      const fileInput = document.getElementById('clientfile') as HTMLInputElement;
      const configFileUploadForm = document.getElementById('configFileUploadForm') as HTMLFormElement;
      if (fileInput && fileInput.value && configFileUploadForm) {
        this.isUploading = true;
        configFileUploadForm.submit();
      }
    },
    checkForCancel() {
      // If we're not in currently selecting a file or if we're uploading, there's no point checking
      if (!this.isSelectingFile || this.isUploading) {
        return;
      }

      // Check if the file is empty and change back from selecting status
      const fileInput = document.getElementById('clientfile') as HTMLInputElement;
      if (fileInput && !fileInput.value) {
        this.isSelectingFile = false;
      }
    },
  },
  computed: {
    faqUrl() {
      return externalRawLink('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-search-console-and-verify-your-website');
    },
    advancedStep2Desc() {
      return translate(
        'SearchEngineKeywordsPerformance_AdvancedStep2Desc',
        '<strong>',
        '</strong>',
      );
    },
    isUploadButtonDisabled() {
      return this.isSelectingFile || this.isUploading;
    },
  },
  mounted() {
    document.body.onfocus = this.checkForCancel;
  },
});
</script>
