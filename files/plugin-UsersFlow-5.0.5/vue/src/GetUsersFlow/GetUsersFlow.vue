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
  <h2 v-if="showTitle">
    <EnrichedHeadline>
      {{ translate('UsersFlow_UsersFlow') }}
    </EnrichedHeadline>
  </h2>

  <p class="widgetBody usersFlowIntroduction">
    {{ translate('UsersFlow_UsersFlowVisualizationDescription1') }}
    {{ usersFlowDesc2 }}
  </p>

  <div class="card" v-if="showTitle">
    <div class="card-content">
      <Visualization
        :actions-per-step="actionsPerStep"
        :level-of-detail="levelOfDetail"
        :user-flow-source="userFlowSource"
      />
    </div>
  </div>
  <div class="widgetBody" v-else>
    <Visualization
      :actions-per-step="actionsPerStep"
      :level-of-detail="levelOfDetail"
      :user-flow-source="userFlowSource"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnrichedHeadline, translate } from 'CoreHome';
import Visualization from '../Visualization/Visualization.vue';

export default defineComponent({
  props: {
    showTitle: String,
    actionsPerStep: Number,
    levelOfDetail: Number,
    userFlowSource: String,
  },
  components: {
    EnrichedHeadline,
    Visualization,
  },
  computed: {
    usersFlowDesc2() {
      return translate(
        'UsersFlow_UsersFlowVisualizationDescription2',
        translate('General_Others'),
        translate('UsersFlow_ColumnInteraction'),
        translate('UsersFlow_ActionShowDetails'),
        translate('UsersFlow_ExploreTraffic'),
      );
    },
  },
});
</script>
