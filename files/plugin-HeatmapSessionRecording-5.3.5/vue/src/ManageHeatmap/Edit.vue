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
  <ContentBlock
    class="editHsr"
    :content-title="contentTitle"
  >
    <p v-show="isLoading">
      <span class="loadingPiwik"><img src="plugins/Morpheus/images/loading-blue.gif" />
        {{ translate('General_LoadingData') }}</span>
    </p>
    <p v-show="isUpdating">
      <span class="loadingPiwik"><img src="plugins/Morpheus/images/loading-blue.gif" />
        {{ translate('HeatmapSessionRecording_UpdatingData') }}</span>
    </p>
    <form @submit="edit ? updateHsr() : createHsr()">
      <div>
        <div name="name">
          <Field
            uicontrol="text"
            name="name"
            :model-value="siteHsr.name"
            @update:model-value="siteHsr.name = $event; setValueHasChanged()"
            :title="translate('General_Name')"
            :maxlength="50"
            :placeholder="translate('HeatmapSessionRecording_FieldNamePlaceholder')"
            :inline-help="translate('HeatmapSessionRecording_HeatmapNameHelp')"
          >
          </Field>
        </div>
        <div name="sampleLimit">
          <Field
            uicontrol="select"
            name="sampleLimit"
            :model-value="siteHsr.sample_limit"
            @update:model-value="siteHsr.sample_limit = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_HeatmapSampleLimit')"
            :options="sampleLimits"
            :inline-help="translate('HeatmapSessionRecording_HeatmapSampleLimitHelp')"
          >
          </Field>
        </div>
        <div class="form-group row">
          <div class="col s12">
            <h3>{{ translate('HeatmapSessionRecording_TargetPage') }}:</h3>
          </div>
          <div
            class="col s12 m6"
            style="padding-left: 0;"
          >
            <div
              :class="`matchPageRules ${index} multiple`"
              v-for="(url, index) in siteHsr.match_page_rules"
              :key="index"
            >
              <div>
                <HsrUrlTarget
                  :model-value="url"
                  @update:model-value="setMatchPageRule($event, index)"
                  @add-url="addMatchPageRule()"
                  @remove-url="removeMatchPageRule(index)"
                  @any-change="setValueHasChanged()"
                  :allow-any="false"
                  :disable-if-no-value="index > 0"
                  :can-be-removed="index > 0"
                  :show-add-url="true"
                />
              </div>
              <hr />
            </div>
          </div>
          <div class="col s12 m6">
            <div class="form-help">
              <span class="inline-help">
                {{ translate('HeatmapSessionRecording_FieldIncludedTargetsHelp') }}
                <div>
                  <HsrTargetTest :included-targets="siteHsr.match_page_rules" />
                </div>
              </span>
            </div>
          </div>
        </div>
        <div name="sampleRate">
          <Field
            uicontrol="select"
            name="sampleRate"
            :model-value="siteHsr.sample_rate"
            @update:model-value="siteHsr.sample_rate = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_SampleRate')"
            :options="sampleRates"
            :introduction="translate('HeatmapSessionRecording_AdvancedOptions')"
            :inline-help="translate('HeatmapSessionRecording_HeatmapSampleRateHelp')"
          >
          </Field>
        </div>
        <div name="excludedElements">
          <Field
            uicontrol="text"
            name="excludedElements"
            :model-value="siteHsr.excluded_elements"
            @update:model-value="siteHsr.excluded_elements = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_ExcludedElements')"
            :maxlength="1000"
            :inline-help="translate('HeatmapSessionRecording_ExcludedElementsHelp')"
          >
          </Field>
        </div>
        <div name="screenshotUrl">
          <Field
            uicontrol="text"
            name="screenshotUrl"
            :model-value="siteHsr.screenshot_url"
            @update:model-value="siteHsr.screenshot_url = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_ScreenshotUrl')"
            :maxlength="300"
            :disabled="!!siteHsr.page_treemirror"
            :inline-help="translate('HeatmapSessionRecording_ScreenshotUrlHelp')"
          >
          </Field>
        </div>
        <div name="breakpointMobile">
          <Field
            uicontrol="text"
            name="breakpointMobile"
            :model-value="siteHsr.breakpoint_mobile"
            @update:model-value="siteHsr.breakpoint_mobile = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_BreakpointX', translate('General_Mobile'))"
            :maxlength="4"
            :inline-help="breakpointMobileInlineHelp"
          >
          </Field>
        </div>
        <div name="breakpointTablet">
          <Field
            uicontrol="text"
            name="breakpointTablet"
            :model-value="siteHsr.breakpoint_tablet"
            @update:model-value="siteHsr.breakpoint_tablet = $event; setValueHasChanged()"
            :title="translate(
              'HeatmapSessionRecording_BreakpointX',
              translate('DevicesDetection_Tablet'),
            )"
            :maxlength="4"
            :inline-help="breakpointGeneralHelp"
          >
          </Field>
        </div>
        <div name="trackManually">
          <Field
            uicontrol="checkbox"
            name="capture_manually"
            :title="translate(
              'HeatmapSessionRecording_CaptureDomTitle'
            )"
            :inline-help="captureDomInlineHelp"
            :model-value="siteHsr.capture_manually"
            @update:model-value="siteHsr.capture_manually = $event; setValueHasChanged()"
          />
        </div>
        <p v-html="$sanitize(personalInformationNote)" />
        <SaveButton
          class="createButton"
          @confirm="edit ? updateHsr() : createHsr()"
          :disabled="isUpdating || !isDirty"
          :saving="isUpdating"
          :value="saveButtonText"
        >
        </SaveButton>
        <div class="entityCancel">
          <a @click="cancel()">{{ translate('General_Cancel') }}</a>
        </div>
      </div>
    </form>
  </ContentBlock>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  translate,
  Matomo,
  ContentBlock,
  NotificationsStore,
  NotificationType,
  MatomoUrl, clone,
} from 'CoreHome';
import { Field, SaveButton } from 'CorePluginsAdmin';
import HsrUrlTarget from '../HsrUrlTarget/HsrUrlTarget.vue';
import HsrTargetTest from '../HsrTargetTest/HsrTargetTest.vue';
import { HeatmapStore } from '../HsrStore/HsrStore.store';
import { Heatmap, MatchPageRule } from '../types';

interface HeatmapEditState {
  isDirty: boolean;
  showAdvancedView: boolean;
  siteHsr: Heatmap;
}

const notificationId = 'hsrmanagement';

export default defineComponent({
  props: {
    idSiteHsr: Number,
    breakpointMobile: Number,
    breakpointTablet: Number,
  },
  components: {
    ContentBlock,
    Field,
    HsrUrlTarget,
    HsrTargetTest,
    SaveButton,
  },
  data(): HeatmapEditState {
    return {
      isDirty: false,
      showAdvancedView: false,
      siteHsr: {} as unknown as Heatmap,
    };
  },
  created() {
    this.init();
  },
  watch: {
    idSiteHsr(newValue) {
      if (newValue === null) {
        return;
      }

      this.init();
    },
  },
  methods: {
    removeAnyHsrNotification() {
      NotificationsStore.remove(notificationId);
      NotificationsStore.remove('ajaxHelper');
    },
    showNotification(message: string, context: NotificationType['context']) {
      const instanceId = NotificationsStore.show({
        message,
        context,
        id: notificationId,
        type: 'transient',
      });

      setTimeout(() => {
        NotificationsStore.scrollToNotification(instanceId);
      }, 200);
    },
    showErrorFieldNotProvidedNotification(title: string) {
      const message = translate('HeatmapSessionRecording_ErrorXNotProvided', [title]);
      this.showNotification(message, 'error');
    },
    init() {
      const { idSiteHsr } = this;

      this.siteHsr = {} as unknown as Heatmap;
      this.showAdvancedView = false;
      Matomo.helper.lazyScrollToContent();

      if (this.edit && idSiteHsr) {
        HeatmapStore.findHsr(idSiteHsr).then((siteHsr) => {
          if (!siteHsr) {
            return;
          }

          this.siteHsr = clone(siteHsr) as unknown as Heatmap;
          this.siteHsr.sample_rate = `${this.siteHsr.sample_rate}`;
          this.addInitialMatchPageRule();
          this.isDirty = false;
        });

        return;
      }

      if (this.create) {
        this.siteHsr = {
          idSite: Matomo.idSite,
          name: '',
          sample_rate: '10.0',
          sample_limit: 1000,
          breakpoint_mobile: this.breakpointMobile!,
          breakpoint_tablet: this.breakpointTablet!,
          capture_manually: 0,
        } as unknown as Heatmap;
        this.isDirty = false;

        const hashParams = MatomoUrl.hashParsed.value;
        if (hashParams.name) {
          this.siteHsr.name = hashParams.name as string;
          this.isDirty = true;
        }

        if (hashParams.matchPageRules) {
          try {
            this.siteHsr.match_page_rules = JSON.parse(hashParams.matchPageRules as string);
            this.isDirty = true;
          } catch (e) {
            console.log('warning: could not parse matchPageRules query param, expected JSON');
          }
        } else {
          this.addInitialMatchPageRule();
        }
      }
    },
    addInitialMatchPageRule() {
      if (!this.siteHsr) {
        return;
      }

      if (this.siteHsr.match_page_rules?.length) {
        return;
      }

      this.addMatchPageRule();
    },
    addMatchPageRule() {
      if (!this.siteHsr) {
        return;
      }

      if (!this.siteHsr.match_page_rules?.length) {
        this.siteHsr.match_page_rules = [];
      }

      this.siteHsr.match_page_rules.push({
        attribute: 'url',
        type: 'equals_simple',
        value: '',
        inverted: 0,
      });
      this.isDirty = true;
    },
    removeMatchPageRule(index: number) {
      if (this.siteHsr && index > -1) {
        this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
        this.siteHsr.match_page_rules.splice(index, 1);
        this.isDirty = true;
      }
    },
    cancel() {
      const newParams = { ...MatomoUrl.hashParsed.value };
      delete newParams.idSiteHsr;

      MatomoUrl.updateHash(newParams);
    },
    createHsr() {
      this.removeAnyHsrNotification();

      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }

      HeatmapStore.createOrUpdateHsr(
        this.siteHsr,
        'HeatmapSessionRecording.addHeatmap',
      ).then((response) => {
        if (!response || response.type === 'error' || !response.response) {
          return;
        }

        this.isDirty = false;
        const idSiteHsr = response.response.value;
        HeatmapStore.reload().then(() => {
          if (Matomo.helper.isReportingPage()) {
            Matomo.postEvent('updateReportingMenu');
          }

          MatomoUrl.updateHash({
            ...MatomoUrl.hashParsed.value,
            idSiteHsr,
          });

          setTimeout(() => {
            this.showNotification(
              translate('HeatmapSessionRecording_HeatmapCreated'),
              response.type as NotificationType['context'],
            );
          }, 200);
        });
      });
    },
    setValueHasChanged() {
      this.isDirty = true;
    },
    updateHsr() {
      this.removeAnyHsrNotification();

      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }

      HeatmapStore.createOrUpdateHsr(
        this.siteHsr,
        'HeatmapSessionRecording.updateHeatmap',
      ).then((response) => {
        if (response.type === 'error') {
          return;
        }

        this.isDirty = false;
        this.siteHsr = {} as unknown as Heatmap;

        HeatmapStore.reload().then(() => {
          this.init();
        });

        this.showNotification(
          translate('HeatmapSessionRecording_HeatmapUpdated'),
          response.type as NotificationType['context'],
        );
      });
    },
    checkRequiredFieldsAreSet() {
      if (!this.siteHsr.name) {
        const title = translate('General_Name');
        this.showErrorFieldNotProvidedNotification(title);
        return false;
      }

      if (!this.siteHsr.match_page_rules?.length
        || !HeatmapStore.filterRules(this.siteHsr.match_page_rules).length
      ) {
        const title = translate('HeatmapSessionRecording_ErrorPageRuleRequired');
        this.showNotification(title, 'error');
        return false;
      }

      return true;
    },
    setMatchPageRule(rule: MatchPageRule, index: number) {
      this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
      this.siteHsr.match_page_rules[index] = rule;
    },
  },
  computed: {
    sampleLimits() {
      return [1000, 2000, 5000].map((v) => ({
        key: `${v}`,
        value: v,
      }));
    },
    sampleRates() {
      const values = [0.1, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      return values.map((v) => ({
        key: v.toFixed(1),
        value: `${v}%`,
      }));
    },
    create() {
      return !this.idSiteHsr;
    },
    edit() {
      return !this.create;
    },
    editTitle() {
      const token = this.create
        ? 'HeatmapSessionRecording_CreateNewHeatmap'
        : 'HeatmapSessionRecording_EditHeatmapX';
      return token;
    },
    contentTitle() {
      return translate(this.editTitle, this.siteHsr.name ? `"${this.siteHsr.name}"` : '');
    },
    isLoading() {
      return HeatmapStore.state.value.isLoading;
    },
    isUpdating() {
      return HeatmapStore.state.value.isUpdating;
    },
    breakpointMobileInlineHelp() {
      const help1 = translate('HeatmapSessionRecording_BreakpointGeneralHelp');
      const help2 = translate('HeatmapSessionRecording_BreakpointGeneralHelpManage');
      return `${help1} ${help2}`;
    },
    breakpointGeneralHelp() {
      const help1 = translate('HeatmapSessionRecording_BreakpointGeneralHelp');
      const help2 = translate('HeatmapSessionRecording_BreakpointGeneralHelpManage');
      return `${help1} ${help2}`;
    },
    captureDomInlineHelp() {
      const id = this.idSiteHsr ? this.idSiteHsr : '{idHeatmap}';
      const command = `<br><br><strong>_paq.push(['HeatmapSessionRecording::captureInitialDom', ${id}])</strong>`;
      return translate(
        'HeatmapSessionRecording_CaptureDomInlineHelp',
        command,
        '<br><br><strong>',
        '</strong>',
      );
    },
    personalInformationNote() {
      const url = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return translate(
        'HeatmapSessionRecording_PersonalInformationNote',
        translate('HeatmapSessionRecording_Heatmap'),
        '<code>',
        '</code>',
        `<a href="${url}" target="_blank" rel="noreferrer noopener">`,
        '</a>',
      );
    },
    saveButtonText() {
      return this.edit
        ? translate('CoreUpdater_UpdateTitle')
        : translate('HeatmapSessionRecording_CreateNewHeatmap');
    },
  },
});
</script>
