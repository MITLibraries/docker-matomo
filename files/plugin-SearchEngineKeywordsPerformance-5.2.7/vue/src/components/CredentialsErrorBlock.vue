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
    :content-title="translate('SearchEngineKeywordsPerformance_CredentialsUnreadable')"
  >
    <div class="ui-confirm" id="confirmResetCredentials" ref="confirmResetCredentials">
      <h2>{{ translate(
        'SearchEngineKeywordsPerformance_CredentialsUnreadableRemoveConfirm',
      ) }}</h2>
      <input role="yes" type="button" :value="translate('General_Yes')"/>
      <input role="no" type="button" :value="translate('General_No')"/>
    </div>

    <p>{{ translate('SearchEngineKeywordsPerformance_CredentialsUnreadableDescription') }}</p>

    <form
      method="POST"
      id="resetCredentialsForm"
      :action="resetUrl"
      @submit.prevent="resetCredentials($event)"
    >
      <input type="hidden" name="config_nonce" :value="formNonce" />
      <!-- checkTokenInUrl() compares these; the POST body keeps them out of the address bar -->
      <input type="hidden" name="token_auth" :value="tokenAuth" />
      <input type="hidden" name="force_api_session" value="1" />
      <button type="submit" class="btn">
        {{ translate('SearchEngineKeywordsPerformance_CredentialsUnreadableRemove') }}
      </button>
    </form>
  </ContentBlock>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ContentBlock,
  Matomo,
} from 'CoreHome';

export default defineComponent({
  props: {
    resetUrl: String,
    formNonce: String,
  },
  components: {
    ContentBlock,
  },
  computed: {
    tokenAuth() {
      // read from the global Matomo already publishes on every page, the same way AjaxHelper does,
      // rather than rendering another copy of the token into the markup
      return Matomo.token_auth;
    },
  },
  methods: {
    resetCredentials(event: Event) {
      Matomo.helper.modalConfirm(
        this.$refs.confirmResetCredentials as HTMLElement,
        {
          yes() {
            (event.target as HTMLFormElement).submit();
          },
        },
      );
    },
  },
});
</script>
