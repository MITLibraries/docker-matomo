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

    const tooltipStyle = computed<CSSProperties>(() => ({
      top: `${state.position.top}px`,
      left: `${state.position.left}px`,
      position: 'absolute',
      zIndex: 1000,
    }));

    function show(event: MouseEvent) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      state.position.top = event.clientY + scrollTop + 10;
      state.position.left = event.clientX + scrollLeft + 10;
      state.visible = true;

      nextTick(() => {
        const tooltipElement = tooltipRef.value;
        if (tooltipElement) {
          const { innerWidth, innerHeight } = window;
          const tooltipRect = tooltipElement.getBoundingClientRect();

          if (tooltipRect.right > innerWidth) {
            state.position.left = event.clientX + scrollLeft - tooltipRect.width - 10;
          }
          if (tooltipRect.bottom > innerHeight) {
            state.position.top = event.clientY + scrollTop - tooltipRect.height - 10;
          }

          const adjustedTooltipRect = tooltipElement.getBoundingClientRect();
          if (adjustedTooltipRect.left < 0) {
            state.position.left = scrollLeft + 10;
          }
          if (adjustedTooltipRect.top < 0) {
            state.position.top = scrollTop + 10;
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
