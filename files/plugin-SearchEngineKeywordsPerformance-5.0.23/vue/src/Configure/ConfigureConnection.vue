<!--
  Matomo - free/libre analytics platform
  @link https://matomo.org
  @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <div class="form-group row">
    <div class="col s12">
      <p>{{ translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel1') }}</p>
      <p>
        {{ translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel2') }}<br />
        <span v-html="$sanitize(setupGoogleAnalyticsImportFaq)"></span>
      </p>
      <p>
        {{ translate('SearchEngineKeywordsPerformance_OAuthExampleText') }}<br />
        <strong>
          {{ translate('SearchEngineKeywordsPerformance_GoogleAuthorizedJavaScriptOrigin') }}:
        </strong> {{ baseDomain }}<br />
        <strong>
          {{ translate('SearchEngineKeywordsPerformance_GoogleAuthorizedRedirectUri') }}:
        </strong> {{ baseUrl }}{{ redirectUri }}<br />
      </p>
    </div>
  </div>
  <div class="form-group row">
    <div class="col s12 m6">
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
            <span class="icon-upload"/> {{ translate('SearchEngineKeywordsPerformance_Uploading') }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  translate,
  externalRawLink,
} from 'CoreHome';

export default defineComponent({
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
    setupGoogleAnalyticsImportFaq() {
      const url = externalRawLink('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-search-console-and-verify-your-website');
      return translate(
        'SearchEngineKeywordsPerformance_ConfigureTheImporterLabel3',
        `<a href="${url}" rel="noreferrer noopener" target="_blank">`,
        '</a>',
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
