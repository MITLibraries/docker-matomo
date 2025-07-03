/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

import {
  reactive,
  computed,
  readonly,
  DeepReadonly,
} from 'vue';
import { AjaxHelper, translate, clone } from 'CoreHome';
import { Heatmap, MatchPageRule, SessionRecording } from '../types';

interface HsrStoreState {
  allHsrs: (Heatmap|SessionRecording)[];
  isLoading: boolean;
  isUpdating: boolean;
  filterStatus: string;
}

class HsrStore<T extends Heatmap|SessionRecording> {
  private privateState = reactive<HsrStoreState>({
    allHsrs: [],
    isLoading: false,
    isUpdating: false,
    filterStatus: '',
  });

  readonly state = computed(() => readonly(this.privateState));

  readonly hsrs = computed(() => {
    if (!this.privateState.filterStatus) {
      return this.state.value.allHsrs;
    }

    return this.state.value.allHsrs.filter((hsr) => hsr.status === this.privateState.filterStatus);
  });

  // used just for the adapter
  readonly hsrsCloned = computed(() => clone(this.hsrs.value) as T[]);

  readonly statusOptions = readonly([
    { key: '', value: translate('General_All') },
    { key: 'active', value: translate('HeatmapSessionRecording_StatusActive') },
    { key: 'ended', value: translate('HeatmapSessionRecording_StatusEnded') },
    { key: 'paused', value: translate('HeatmapSessionRecording_StatusPaused') },
  ]);

  private fetchPromises: Record<string, Promise<(Heatmap|SessionRecording)[]>> = {};

  constructor(private context: string) {}

  setFilterStatus(status: string) {
    this.privateState.filterStatus = status;
  }

  reload(): ReturnType<HsrStore<T>['fetchHsrs']> {
    this.privateState.allHsrs = [];
    this.fetchPromises = {};
    return this.fetchHsrs();
  }

  filterRules(rules: MatchPageRule[]): MatchPageRule[] {
    return rules.filter((target) => !!target && (target.value || target.type === 'any'));
  }

  private getApiMethodInContext(apiMethod: string) {
    return `${apiMethod}${this.context}`;
  }

  fetchHsrs(): Promise<DeepReadonly<T[]>> {
    let method = 'HeatmapSessionRecording.getHeatmaps';
    if (this.context === 'SessionRecording') {
      method = 'HeatmapSessionRecording.getSessionRecordings';
    }

    const params = {
      method,
      filter_limit: '-1',
    };

    if (!this.fetchPromises[method]) {
      this.fetchPromises[method] = AjaxHelper.fetch<T[]>(params);
    }

    this.privateState.isLoading = true;
    this.privateState.allHsrs = [];

    return this.fetchPromises[method].then((hsrs) => {
      this.privateState.allHsrs = hsrs;
      return this.state.value.allHsrs as DeepReadonly<T[]>;
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }

  findHsr(idSiteHsr: number): Promise<DeepReadonly<T>> {
    // before going through an API request we first try to find it in loaded hsrs
    const found = this.state.value.allHsrs.find((hsr) => hsr.idsitehsr === idSiteHsr);
    if (found) {
      return Promise.resolve(found as DeepReadonly<T>);
    }

    // otherwise we fetch it via API
    this.privateState.isLoading = true;
    return AjaxHelper.fetch({
      idSiteHsr,
      method: this.getApiMethodInContext('HeatmapSessionRecording.get'),
      filter_limit: '-1',
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }

  deleteHsr(idSiteHsr: number) {
    this.privateState.isUpdating = true;
    this.privateState.allHsrs = [];

    return AjaxHelper.fetch(
      {
        idSiteHsr,
        method: this.getApiMethodInContext('HeatmapSessionRecording.delete'),
      },
      {
        withTokenInUrl: true,
      },
    ).then(() => ({
      type: 'success',
    })).catch((error) => ({
      type: 'error',
      message: error.message || error,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }

  completeHsr(idSiteHsr: number): Promise<{ type: string, message?: string }> {
    this.privateState.isUpdating = true;
    this.privateState.allHsrs = [];

    return AjaxHelper.fetch(
      {
        idSiteHsr,
        method: this.getApiMethodInContext('HeatmapSessionRecording.end'),
      },
      {
        withTokenInUrl: true,
      },
    ).then(() => ({
      type: 'success',
    })).catch((error) => ({
      type: 'error',
      message: error.message || error as unknown as string,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }

  createOrUpdateHsr(hsr: Heatmap|SessionRecording, method: string): Promise<{
    type: string,
    message?: string,
    response?: { value: number },
  }> {
    const params = {
      idSiteHsr: hsr.idsitehsr,
      sampleLimit: hsr.sample_limit,
      sampleRate: hsr.sample_rate,
      excludedElements: (hsr as Heatmap).excluded_elements
        ? (hsr as Heatmap).excluded_elements.trim()
        : undefined,
      screenshotUrl: (hsr as Heatmap).screenshot_url
        ? (hsr as Heatmap).screenshot_url.trim()
        : undefined,
      breakpointMobile: (hsr as Heatmap).breakpoint_mobile,
      breakpointTablet: (hsr as Heatmap).breakpoint_tablet,
      minSessionTime: (hsr as SessionRecording).min_session_time,
      requiresActivity: (hsr as SessionRecording).requires_activity ? 1 : 0,
      captureKeystrokes: (hsr as SessionRecording).capture_keystrokes ? 1 : 0,
      captureDomManually: (hsr as Heatmap).capture_manually ? 1 : 0,
      method,
      name: hsr.name.trim(),
    };

    const postParams = {
      matchPageRules: this.filterRules(hsr.match_page_rules),
    };

    this.privateState.isUpdating = true;
    return AjaxHelper.post(params, postParams, { withTokenInUrl: true }).then((response) => ({
      type: 'success',
      response,
    })).catch((error) => ({
      type: 'error',
      message: error.message || error,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }
}

export const HeatmapStore = new HsrStore<Heatmap>('Heatmap');
export const SessionRecordingStore = new HsrStore<SessionRecording>('SessionRecording');
