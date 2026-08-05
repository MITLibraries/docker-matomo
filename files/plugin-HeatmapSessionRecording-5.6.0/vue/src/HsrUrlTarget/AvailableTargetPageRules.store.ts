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
  computed,
  reactive,
  readonly,
  DeepReadonly,
} from 'vue';
import { AjaxHelper } from 'CoreHome';
import { AvailableTargetPageRule } from '../types';

interface AvailableTargetPageRulesStoreState {
  rules: AvailableTargetPageRule[];
}

class AvailableTargetPageRulesStore {
  private privateState = reactive<AvailableTargetPageRulesStoreState>({
    rules: [],
  });

  readonly state = computed(() => readonly(this.privateState));

  readonly rules = computed(() => this.state.value.rules);

  private initPromise: Promise<DeepReadonly<AvailableTargetPageRule[]>>|null = null;

  init() {
    if (this.initPromise) {
      return this.initPromise!;
    }

    this.initPromise = AjaxHelper.fetch<AvailableTargetPageRule[]>({
      method: 'HeatmapSessionRecording.getAvailableTargetPageRules',
      filter_limit: '-1',
    }).then((response) => {
      this.privateState.rules = response;
      return this.rules.value;
    });

    return this.initPromise!;
  }
}

export default new AvailableTargetPageRulesStore();
