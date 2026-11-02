<template>
  <div v-show="visible" ref="tooltipRef" class="tooltip" :style="tooltipStyle">
    <div class="tooltip-item">
      <span class="tooltip-label">{{ getClickCountTranslation }}</span>
      <span class="tooltip-value">{{ getClickCount }}</span>
    </div>
    <div class="tooltip-item">
      <span class="tooltip-label">{{ getClickRateTranslation }}</span>
      <span class="tooltip-value">{{ getClickRate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed, CSSProperties, nextTick, ref,
} from 'vue';
import { translate, NumberFormatter } from 'CoreHome';

export default defineComponent({
  props: {
    clickCount: {
      type: Number,
      required: true,
    },
    clickRate: {
      type: Number,
      required: true,
    },
    isMoves: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const state = reactive({
      visible: false,
      position: { top: 0, left: 0 },
    });

    const tooltipRef = ref<HTMLElement | null>(null);

    // The tooltip follows the cursor, so it is positioned in viewport
    // coordinates via position: fixed. It must not be position: absolute:
    // that would resolve the coordinates against the nearest positioned
    // ancestor (the report card, as .card is position: relative), shifting
    // the tooltip away from the cursor by that ancestor's page offset.
    const tooltipStyle = computed<CSSProperties>(() => ({
      top: `${state.position.top}px`,
      left: `${state.position.left}px`,
      position: 'fixed',
      zIndex: 1000,
    }));

    function show(event: MouseEvent) {
      state.position.top = event.clientY + 10;
      state.position.left = event.clientX + 10;
      state.visible = true;

      nextTick(() => {
        const tooltipElement = tooltipRef.value;
        if (tooltipElement) {
          const { innerWidth, innerHeight } = window;
          const tooltipRect = tooltipElement.getBoundingClientRect();

          if (tooltipRect.right > innerWidth) {
            state.position.left = event.clientX - tooltipRect.width - 10;
          }
          if (tooltipRect.bottom > innerHeight) {
            state.position.top = event.clientY - tooltipRect.height - 10;
          }

          const adjustedTooltipRect = tooltipElement.getBoundingClientRect();
          if (adjustedTooltipRect.left < 0) {
            state.position.left = 10;
          }
          if (adjustedTooltipRect.top < 0) {
            state.position.top = 10;
          }
        }
      });
    }

    function hide() {
      state.visible = false;
    }

    return {
      ...toRefs(state),
      tooltipRef,
      show,
      hide,
      tooltipStyle,
      translate,
    };
  },
  computed: {
    getClickCount() {
      return NumberFormatter.formatNumber(this.clickCount);
    },
    getClickRate() {
      return NumberFormatter.formatPercent(this.clickRate);
    },
    getClickCountTranslation() {
      const translation = this.isMoves ? 'HeatmapSessionRecording_Moves' : 'HeatmapSessionRecording_Clicks';
      return translate(translation);
    },
    getClickRateTranslation() {
      const translation = this.isMoves ? 'HeatmapSessionRecording_MoveRate' : 'HeatmapSessionRecording_ClickRate';
      return translate(translation);
    },
  },
});
</script>
