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
  <div
    class="singleMetricView customReportKpiCard"
    :class="{'loading': isLoading}"
  >
    <div class="metric-sparkline">
      <Sparkline :params="sparklineParams">
      </Sparkline>
    </div>
    <div class="metric-value">
      <span :title="metricDocumentation">
        <strong>{{ metricValue }}</strong> {{ (metricTranslation || '').toLowerCase() }}
      </span>
      <span
        class="metricEvolution"
        v-if="pastValue !== null"
        :title="translate(
          'General_EvolutionSummaryGeneric', metricValue, currentPeriod, pastValue,
          pastPeriod, metricChangePercent)"
      >
        <span :class="evolutionClass">
          {{ metricChangePercent }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
} from 'vue';
import {
  Matomo,
  AjaxHelper,
  Sparkline,
  Range,
  Periods,
  format,
} from 'CoreHome';

type MetricValues = Record<string, number|string>;

// CustomReports.getCustomReport returns a serialized DataTable for a single period. Depending
// on the response, the row may be wrapped in an array, and a table with a single column is
// collapsed into a generic 'value' key by the JSON renderer instead of using the metric name.
type MetricsResponse = MetricValues|MetricValues[]|null|undefined;

function getPastPeriodStr(): string {
  const { startDate } = Range.getLastNRange(Matomo.period!, 2, Matomo.currentDateString!);
  const dateRange = Periods.get(Matomo.period!).parse(startDate).getDateRange();
  return `${format(dateRange[0])},${format(dateRange[1])}`;
}

export default defineComponent({
  props: {
    idCustomReport: {
      type: [String, Number],
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    metricTranslation: String,
    metricDocumentation: String,
    lowerIsBetter: Boolean,
  },
  components: {
    Sparkline,
  },
  setup(props) {
    const isLoading = ref<boolean>(false);
    const responses = ref<null|MetricsResponse[]>(null);

    function getMetricFromResponse(response: MetricsResponse): number|string|null {
      if (!response) {
        return null;
      }

      const row = (Array.isArray(response) ? response[0] : response) as MetricValues|undefined;
      if (!row) {
        // a metric that has no data for the requested period is treated as 0 so an
        // evolution down to zero is still calculated
        return 0;
      }

      const value = row[props.metric] !== undefined ? row[props.metric] : row.value;
      return value || 0;
    }

    const metricValueUnformatted = computed(() => {
      if (!responses.value) {
        return null;
      }

      return getMetricFromResponse(responses.value[1]);
    });

    const pastValueUnformatted = computed(() => {
      if (!responses.value) {
        return null;
      }

      return getMetricFromResponse(responses.value[2]);
    });

    const evolutionClass = computed(() => {
      if (
        metricValueUnformatted.value === null
        || pastValueUnformatted.value === null
        || metricValueUnformatted.value === pastValueUnformatted.value
      ) {
        return [];
      }

      // arrow direction always reflects the actual value change, while the colour
      // (positive/negative) reflects whether that change is good or bad for the metric
      const increased = metricValueUnformatted.value > pastValueUnformatted.value;
      const isPositive = props.lowerIsBetter ? !increased : increased;

      return [
        increased ? 'evolution-up' : 'evolution-down',
        isPositive ? 'positive-evolution' : 'negative-evolution',
      ];
    });

    const metricChangePercent = computed(() => {
      if (
        metricValueUnformatted.value === null
        || metricValueUnformatted.value === undefined
        || pastValueUnformatted.value === null
        || pastValueUnformatted.value === undefined
      ) {
        return null;
      }

      const currentValue: number = typeof metricValueUnformatted.value === 'string'
        ? parseFloat(metricValueUnformatted.value)
        : metricValueUnformatted.value as number;

      const pastValue: number = typeof pastValueUnformatted.value === 'string'
        ? parseFloat(pastValueUnformatted.value)
        : pastValueUnformatted.value as number;

      const evolution = Matomo.helper.calculateEvolution(currentValue, pastValue);

      return `${(evolution * 100).toFixed(2)} %`;
    });

    const pastValue = computed(() => {
      if (!responses.value) {
        return null;
      }

      return getMetricFromResponse(responses.value[3]);
    });

    const metricValue = computed(() => {
      if (!responses.value) {
        return null;
      }

      return getMetricFromResponse(responses.value[0]);
    });

    const currentPeriod = computed(() => {
      if (Matomo.startDateString === Matomo.endDateString) {
        return Matomo.endDateString;
      }
      return `${Matomo.startDateString}, ${Matomo.endDateString}`;
    });

    const sparklineParams = computed<QueryParameters>(() => ({
      module: 'CustomReports',
      action: 'getCustomReport',
      idCustomReport: props.idCustomReport,
      columns: props.metric,
    }));

    const pastPeriod = computed(() => {
      if (Matomo.period === 'range') {
        return undefined;
      }

      return getPastPeriodStr();
    });

    function getLastPeriodDate(): string {
      const range = Range.getLastNRange(Matomo.period!, 2, Matomo.currentDateString!);
      return format(range.startDate);
    }

    function fetchData() {
      isLoading.value = true;

      const method = 'CustomReports.getCustomReport';
      const extraParams: QueryParameters = {
        idCustomReport: props.idCustomReport,
        columns: props.metric,
      };

      const promises = [];

      // first request for formatted data
      promises.push(AjaxHelper.fetch({
        method,
        format_metrics: 'all',
        ...extraParams,
      }));

      if (Matomo.period !== 'range') {
        // second request for unformatted data so we can calculate evolution
        promises.push(AjaxHelper.fetch({
          method,
          format_metrics: '0',
          ...extraParams,
        }));

        // third request for past data (unformatted)
        promises.push(AjaxHelper.fetch({
          method,
          date: getLastPeriodDate(),
          format_metrics: '0',
          ...extraParams,
        }));

        // fourth request for past data (formatted for tooltip display)
        promises.push(AjaxHelper.fetch({
          method,
          date: getLastPeriodDate(),
          format_metrics: 'all',
          ...extraParams,
        }));
      }

      return Promise.all(promises).then((r) => {
        responses.value = r;
        isLoading.value = false;
      });
    }

    fetchData();

    return {
      isLoading,
      metricValue,
      metricValueUnformatted,
      pastValueUnformatted,
      evolutionClass,
      metricChangePercent,
      pastValue,
      sparklineParams,
      pastPeriod,
      currentPeriod,
    };
  },
});
</script>
