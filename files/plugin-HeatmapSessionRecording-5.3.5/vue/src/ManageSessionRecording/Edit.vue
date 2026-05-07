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
            :inline-help="translate('HeatmapSessionRecording_SessionNameHelp')"
          >
          </Field>
        </div>
        <div name="sampleLimit">
          <Field
            uicontrol="select"
            name="sampleLimit"
            :model-value="siteHsr.sample_limit"
            @update:model-value="siteHsr.sample_limit = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_SessionSampleLimit')"
            :options="sampleLimits"
            :inline-help="translate('HeatmapSessionRecording_SessionSampleLimitHelp')"
          >
          </Field>
        </div>
        <div class="form-group row">
          <div class="col s12">
            <h3>{{ translate('HeatmapSessionRecording_TargetPages') }}:</h3>
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
                  :allow-any="true"
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
                {{ translate('HeatmapSessionRecording_FieldIncludedTargetsHelpSessions') }}
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
            :inline-help="translate('HeatmapSessionRecording_SessionSampleRateHelp')"
          >
          </Field>
        </div>
        <div name="minSessionTime">
          <Field
            uicontrol="select"
            name="minSessionTime"
            :model-value="siteHsr.min_session_time"
            @update:model-value="siteHsr.min_session_time = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_MinSessionTime')"
            :options="minSessionTimes"
            :inline-help="translate('HeatmapSessionRecording_MinSessionTimeHelp')"
          >
          </Field>
        </div>
        <div name="requiresActivity">
          <Field
            uicontrol="checkbox"
            name="requiresActivity"
            :model-value="siteHsr.requires_activity"
            @update:model-value="siteHsr.requires_activity = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_RequiresActivity')"
            :inline-help="translate('HeatmapSessionRecording_RequiresActivityHelp')"
          >
          </Field>
        </div>
        <div>
          <Field
            uicontrol="checkbox"
            name="captureKeystrokes"
            :model-value="siteHsr.capture_keystrokes"
            @update:model-value="siteHsr.capture_keystrokes = $event; setValueHasChanged()"
            :title="translate('HeatmapSessionRecording_CaptureKeystrokes')"
          >
            <template v-slot:inline-help>
              <div class="inline-help-node">
                <span v-html="$sanitize(captureKeystrokesHelp)"/>
              </div>
            </template>
          </Field>
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
  AjaxHelper,
  ContentBlock,
  NotificationsStore,
  NotificationType,
  clone,
  MatomoUrl,
} from 'CoreHome';
import { Field, SaveButton } from 'CorePluginsAdmin';
import HsrUrlTarget from '../HsrUrlTarget/HsrUrlTarget.vue';
import HsrTargetTest from '../HsrTargetTest/HsrTargetTest.vue';
import { MatchPageRule, SessionRecording } from '../types';
import { HeatmapStore, SessionRecordingStore } from '../HsrStore/HsrStore.store';

interface Option {
  key: string;
  value: unknown;
}

interface SessionRecordingEditState {
  isDirty: boolean;
  showAdvancedView: boolean;
  sampleLimits: Option[];
  siteHsr: SessionRecording;
}

const notificationId = 'hsrmanagement';

export default defineComponent({
  props: {
    idSiteHsr: Number,
  },
  components: {
    ContentBlock,
    Field,
    HsrUrlTarget,
    HsrTargetTest,
    SaveButton,
  },
  data(): SessionRecordingEditState {
    return {
      isDirty: false,
      showAdvancedView: false,
      sampleLimits: [],
      siteHsr: {} as unknown as SessionRecording,
    };
  },
  created() {
    AjaxHelper.fetch<(string|number)[]>({
      method: 'HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits',
    }).then((sampleLimits) => {
      this.sampleLimits = (sampleLimits || []).map((l) => ({
        key: `${l}`,
        value: l,
      }));
    });

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

      this.siteHsr = {} as unknown as SessionRecording;
      this.showAdvancedView = false;
      Matomo.helper.lazyScrollToContent();

      if (this.edit && idSiteHsr) {
        SessionRecordingStore.findHsr(idSiteHsr).then((siteHsr) => {
          if (!siteHsr) {
            return;
          }

          this.siteHsr = clone(siteHsr) as unknown as SessionRecording;
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
          sample_limit: 250,
          min_session_time: 0,
          requires_activity: true,
          capture_keystrokes: false,
        } as unknown as SessionRecording;

        this.addInitialMatchPageRule();
        this.isDirty = false;
      }
    },
    addInitialMatchPageRule() {
      if (!this.siteHsr) {
        return;
      }

      if (this.siteHsr.match_page_rules?.length) {
        return;
      }

      this.siteHsr.match_page_rules = [{
        attribute: 'url',
        type: 'any',
        value: '',
        inverted: 0,
      }];
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

      SessionRecordingStore.createOrUpdateHsr(
        this.siteHsr,
        'HeatmapSessionRecording.addSessionRecording',
      ).then((response) => {
        if (!response || response.type === 'error' || !response.response) {
          return;
        }

        this.isDirty = false;
        const idSiteHsr = response.response.value;
        SessionRecordingStore.reload().then(() => {
          if (Matomo.helper.isReportingPage()) {
            Matomo.postEvent('updateReportingMenu');
          }

          MatomoUrl.updateHash({
            ...MatomoUrl.hashParsed.value,
            idSiteHsr,
          });

          setTimeout(() => {
            this.showNotification(
              translate('HeatmapSessionRecording_SessionRecordingCreated'),
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

      SessionRecordingStore.createOrUpdateHsr(
        this.siteHsr,
        'HeatmapSessionRecording.updateSessionRecording',
      ).then((response) => {
        if (response.type === 'error') {
          return;
        }

        this.isDirty = false;
        this.siteHsr = {} as unknown as SessionRecording;

        SessionRecordingStore.reload().then(() => {
          this.init();
        });
        this.showNotification(
          translate('HeatmapSessionRecording_SessionRecordingUpdated'),
          response.type as NotificationType['context'],
        );
      });
    },
    checkRequiredFieldsAreSet() {
      if (!this.siteHsr.name) {
        const title = this.translate('General_Name');
        this.showErrorFieldNotProvidedNotification(title);
        return false;
      }

      if (!this.siteHsr.match_page_rules?.length
        || !SessionRecordingStore.filterRules(this.siteHsr.match_page_rules).length
      ) {
        const title = this.translate('HeatmapSessionRecording_ErrorPageRuleRequired');
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
    minSessionTimes() {
      return [0, 5, 10, 15, 20, 30, 45, 60, 90, 120].map((v) => ({
        key: `${v}`,
        value: `${v} seconds`,
      }));
    },
    sampleRates() {
      const rates = [0.1, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      return rates.map((v) => ({
        key: `${v.toFixed(1)}`,
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
        ? 'HeatmapSessionRecording_CreateNewSessionRecording'
        : 'HeatmapSessionRecording_EditSessionRecordingX';
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
    captureKeystrokesHelp() {
      const link = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-keystrokes-in-form-fields';
      return translate(
        'HeatmapSessionRecording_CaptureKeystrokesHelp',
        `<a href="${link}" target="_blank" rel="noopener noreferrer">`,
        '</a>',
      );
    },
    personalInformationNote() {
      const link = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return translate(
        'HeatmapSessionRecording_PersonalInformationNote',
        translate('HeatmapSessionRecording_SessionRecording'),
        '<code>',
        '</code>',
        `<a href="${link}" target="_blank" rel="noreferrer noopener">`,
        '</a>',
      );
    },
    saveButtonText() {
      return this.edit
        ? translate('CoreUpdater_UpdateTitle')
        : translate('HeatmapSessionRecording_CreateNewSessionRecording');
    },
  },
});
</script>
