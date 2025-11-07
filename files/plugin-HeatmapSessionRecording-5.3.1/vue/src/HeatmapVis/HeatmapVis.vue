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
  <div class="heatmapVis">
    <p
      v-if="!!actualNumSamples.nb_samples_device_all"
      v-html="$sanitize(recordedSamplesSince)"
    >
    </p>

    <div class="heatmapSelection">
      <h4 style="display: inline;margin-right: 13.5px;">
        {{ translate('HeatmapSessionRecording_Action') }}
      </h4>
      <span
        class="btn-flat"
        :class="{
          'visActive': theHeatmapType.key === heatmapType,
          [`heatmapType${theHeatmapType.key}`]: true,
        }"
        @click="changeHeatmapType(theHeatmapType.key)"
        v-for="theHeatmapType in heatmapTypes"
        :key="theHeatmapType.key"
      >{{ theHeatmapType.name }}</span>
      <h4 style="display: inline;margin-left: 3rem;margin-right: 13.5px;">
        {{ translate('HeatmapSessionRecording_DeviceType') }}
      </h4>
      <span
        class="btn-flat"
        :class="{
          'visActive': theDeviceType.key === deviceType,
          [`deviceType${theDeviceType.key}`]: true,
        }"
        :title="theDeviceType.tooltip"
        @click="changeDeviceType(theDeviceType.key)"
        v-for="theDeviceType in deviceTypesWithSamples"
        :key="theDeviceType.key"
      >
        <img
          height="15"
          :src="theDeviceType.logo"
          :alt="`${translate('DevicesDetection_Device')} ${theDeviceType.name}`"
        /> <span class="numSamples">{{ theDeviceType.numSamples }}</span>
      </span>
      <div class="legendOuter">
        <h4>{{ translate('Installation_Legend') }}</h4>
        <div class="legend-area">
          <span class="min">0</span>
          <img
            class="gradient"
            alt="gradient"
            :src="gradientImgData"
          />
          <span class="max">0</span>
        </div>
      </div>
      <div class="customIframeWidth">
        <span
          style="margin-left: 2.5rem;margin-right: 13.5px;"
          v-text="translate('HeatmapSessionRecording_Width')"></span>
        <Field
          uicontrol="select"
          name="iframewidth"
          :model-value="customIframeWidth"
          @update:model-value="customIframeWidth = $event;
            changeIframeWidth(customIframeWidth, true)"
          :options="iframeWidthOptions"
        >
        </Field>
      </div>
    </div>
    <div class="iframeRecordingContainer" ref="iframeRecordingContainer">
      <div class="heatmapWrapper">
        <div id="heatmapContainer" ref="heatmapContainer" />
        <div id="highlightDiv"></div>
      </div>
      <div
        class="hsrLoadingOuter"
        style="height: 400px;"
        v-show="isLoading"
        :style="{width: iframeWidth + 'px'}"
      >
        <div class="loadingUnderlay" />
        <div class="valign-wrapper loadingInner">
          <div class="loadingContent">{{ translate('General_Loading') }}</div>
        </div>
      </div>
      <div
        class="aboveFoldLine"
        :title="translate('HeatmapSessionRecording_AvgAboveFoldDescription')"
        v-show="avgFold"
        :style="{width: iframeWidth + 'px', top: avgFold + 'px'}"
      >
        <div>{{ translate('HeatmapSessionRecording_AvgAboveFoldTitle', avgFold) }}</div>
      </div>
      <iframe
        id="recordingPlayer"
        ref="recordingPlayer"
        sandbox="allow-scripts allow-same-origin"
        referrerpolicy="no-referrer"
        @load="onLoaded()"
        height="400"
        :src="embedUrl"
        v-if="embedUrl"
        :width="iframeWidth"
      />
    </div>
    <div v-show="showDeleteScreenshot" style="margin-top: 2rem;">
      <SaveButton
        style="display: block !important;"
        :loading="isLoading"
        @click="deleteScreenshot()"
        :value="translate('HeatmapSessionRecording_DeleteScreenshot')"
      />
    </div>
    <div
      class="ui-confirm"
      id="confirmDeleteHeatmapScreenshot"
      ref="confirmDeleteHeatmapScreenshot"
    >
      <h2>{{ translate('HeatmapSessionRecording_DeleteHeatmapScreenshotConfirm') }} </h2>
      <input
        role="yes"
        type="button"
        :value="translate('General_Yes')"
      />
      <input
        role="no"
        type="button"
        :value="translate('General_No')"
      />
    </div>
    <Tooltip
      ref="tooltip"
      :click-count="clickCount"
      :click-rate="clickRate"
      :is-moves="heatmapType === 1"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import h337, { HeatmapConfiguration } from 'heatmap.js';
import {
  translate,
  Matomo,
  AjaxHelper,
  MatomoUrl,
  externalLink,
} from 'CoreHome';
import { Field, SaveButton } from 'CorePluginsAdmin';
import { DeviceType, HeatmapMetadata, HeatmapType } from '../types';
import getIframeWindow from '../getIframeWindow';
import oneAtATime from '../oneAtATime';
import Tooltip from '../Tooltip/Tooltip.vue';

const { $ } = window;

const deviceDesktop = 1;
const deviceTablet = 2;
const deviceMobile = 3;

let heightPerHeatmap = 32000;

const userAgent = String(window.navigator.userAgent).toLowerCase();
if (userAgent.match(/(iPod|iPhone|iPad|Android|IEMobile|Windows Phone)/i)) {
  heightPerHeatmap = 2000;
} else if (userAgent.indexOf('msie ') > 0
  || userAgent.indexOf('trident/') > 0
  || userAgent.indexOf('edge') > 0
) {
  heightPerHeatmap = 8000;
}

interface ScrollReach {
  label: string;
  value: string;
  offset_x: number;
  offset_y: number;
  selector?: string;
}

interface DataPoint {
  x: number;
  y: number;
  value: string;
}

interface DataPoints {
  min: number;
  max: number;
  data: DataPoint[];
  gradient?: Record<string, string>;
}

interface HeatmapVisState {
  isLoading: boolean;
  iframeWidth: number;
  customIframeWidth: number;
  avgFold: number;
  heatmapType: number;
  deviceType: number;
  iframeResolutions: number[];
  actualNumSamples: HeatmapMetadata;
  dataCoordinates: DataPoint[];
  currentElement: HTMLElement|null;
  totalClicks: number;
  tooltipShowTimeoutId: number|null;
  clickCount: number;
  clickRate: number;
}

function initHeatmap(
  recordingPlayer: HTMLElement,
  heatmapContainer: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordingIframe: any,
) {
  const $iframe = $(recordingPlayer);

  // we first set the iframe to the initial 400px again so we can for sure detect the current
  // height of the inner iframe body correctly
  $iframe.css('height', '400px');

  const documentHeight: number = recordingIframe.getIframeHeight();
  $iframe.css('height', `${documentHeight}px`);

  $(heatmapContainer)
    .css('height', `${documentHeight}px`)
    .css('width', `${$iframe.width()}px`)
    .empty();

  const numHeatmaps = Math.ceil(documentHeight / heightPerHeatmap);

  for (let i = 1; i <= numHeatmaps; i += 1) {
    let height = heightPerHeatmap;
    if (i === numHeatmaps) {
      height = documentHeight % heightPerHeatmap;
    }
    $(heatmapContainer).append(`<div id="heatmap${i}" class="heatmapTile"></div>`);
    $(heatmapContainer).find(`#heatmap${i}`).css({ height: `${height}px` });
  }

  return numHeatmaps;
}

interface Bucket {
  percentageValue: number;
  position: number;
  percent: string;
}

function scrollHeatmap(
  iframeRecordingContainer: HTMLElement,
  recordingPlayer: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordingIframe: any,
  scrollReaches: ScrollReach[],
) {
  const $iframe = $(recordingPlayer);

  // we first set the iframe to the initial 400px again so we can for sure detect the current
  // height of the inner iframe body correctly
  $iframe.css('height', '400px');

  const documentHeight = recordingIframe.getIframeHeight();
  $iframe.css('height', `${documentHeight}px`);

  const numIntervals = 1000;
  const heightToIntervalRatio = documentHeight / numIntervals;

  const numViewersTotal = scrollReaches.reduce((pv, cv) => pv + parseInt(cv.value, 10), 0);

  const buckets: Bucket[] = [];

  let num_viewers = 0;
  let lastBucket: Bucket | null = null;
  let percentage = 100;
  let reachScrolledFromPosition = 0;

  // reachScrolledFromPosition we start from 0, and then always paint to the next bucket. eg when
  // scrollReach is 27 and scrollDepth is 35, then we know that 27 people have scrolled down to
  // 3.5% of the page.
  scrollReaches.forEach((scrollReachObj) => {
    // the number of people that reached this point
    const scrollReach = parseInt(scrollReachObj.value, 10);

    // how far down they scrolled
    const scrollDepth = parseInt(scrollReachObj.label, 10);

    const reachScrolledToPosition = Math.round(scrollDepth * heightToIntervalRatio);

    if (lastBucket && lastBucket.position === reachScrolledToPosition) {
      // when page is < 1000 we need to aggregate buckets
      num_viewers += scrollReach;
    } else {
      if (numViewersTotal !== 0) {
        percentage = ((numViewersTotal - num_viewers) / numViewersTotal) * 100;
      }
      num_viewers += scrollReach;
      // percentage.toFixed(1) * 10 => convert eg 99.8 => 998
      lastBucket = {
        percentageValue: parseFloat(percentage.toFixed(1)) * 10,
        position: reachScrolledFromPosition,
        percent: percentage.toFixed(1),
      };
      buckets.push(lastBucket);
    }

    reachScrolledFromPosition = reachScrolledToPosition;
  });

  function map(value: number, istart: number, istop: number, ostart: number, ostop: number) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

  function mapColorIntensity(intensity: number, min: number, max: number) {
    if (min === max || (!min && !max)) {
      return [255, 255, 0];
    }

    const cint = map(intensity, min, max, 0, 255);
    const step = (max - min) / 5;

    if (cint > 204) {
      return [255, map(intensity, max - step, max, 255, 0), 0];
    }

    if (cint > 153) {
      return [map(intensity, max - 2 * step, max - step, 0, 255), 255, 0];
    }

    if (cint > 102) {
      return [0, 255, map(intensity, max - 3 * step, max - 2 * step, 255, 0)];
    }

    if (cint > 51) {
      return [0, map(intensity, max - 4 * step, max - 3 * step, 0, 255), 255];
    }

    return [map(intensity, min, max - 4 * step, 255, 0), 0, 255];
  }

  if (buckets.length) {
    // we need to make sure to draw scroll heatmap over full page
    const found = buckets.some((b) => b.position === 0);
    if (!found) {
      buckets.unshift({ percent: '100.0', percentageValue: 1000, position: 0 });
    }
  } else {
    // we'll show full page as not scrolled
    buckets.push({ percent: '0', percentageValue: 0, position: 0 });
  }

  let minValue = 0;
  const maxValue = 1000; // max value is always 1000 (=100%)

  if (buckets && buckets.length && buckets[0]) {
    minValue = buckets[buckets.length - 1].percentageValue;
  }

  const iframeWidth = $iframe.width();
  let nextBucket: { position: number }|null = null;
  for (let index = 0; index < buckets.length; index += 1) {
    const bucket = buckets[index];
    if (buckets[index + 1]) {
      nextBucket = buckets[index + 1];
    } else {
      nextBucket = { position: documentHeight };
    }

    const top = bucket.position;
    let height = nextBucket.position - bucket.position;

    if (height === 0) {
      height = 1; // make sure to draw at least one px
    }

    const percent = `${bucket.percent} percent reached this point`;

    const colorValues = mapColorIntensity(bucket.percentageValue, minValue, maxValue);
    const color = `rgb(${colorValues.join(',')})`;

    $(iframeRecordingContainer).append(
      `<div class="scrollHeatmapLeaf" title="${percent}" style="width: ${iframeWidth}px;height:`
        + ` ${height}px;left: 0;top: ${top}px; background-color: ${color};"></div>`,
    );
  }

  $('.scrollHeatmapLeaf', iframeRecordingContainer).tooltip({
    track: true,
    items: '*',
    tooltipClass: 'heatmapTooltip',
    show: false,
    hide: false,
  });

  $('.legend-area .min').text(`${(minValue / 10).toFixed(1)}%`);
  $('.legend-area .max').text(`${(maxValue / 10).toFixed(1)}%`);
}

function actualRenderHeatmap(
  recordingPlayer: HTMLElement,
  heatmapContainer: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordingIframe: any,
  dataPoints: DataPoints,
) {
  const numHeatmaps = initHeatmap(recordingPlayer, heatmapContainer, recordingIframe);

  const legendCanvas = document.createElement('canvas');
  legendCanvas.width = 100;
  legendCanvas.height = 10;

  const min = document.querySelector('.legend-area .min')!;
  const max = document.querySelector('.legend-area .max')!;

  const gradientImg = document.querySelector('.legend-area .gradient') as HTMLImageElement;
  const legendCtx = legendCanvas.getContext('2d')!;

  let gradientCfg: Record<string, string> = {};
  function updateLegend(data: DataPoints) {
    // the onExtremaChange callback gives us min, max, and the gradientConfig
    // so we can update the legend
    min.innerHTML = `${data.min}`;
    max.innerHTML = `${data.max}`;

    // regenerate gradient image
    if (data.gradient && data.gradient !== gradientCfg) {
      gradientCfg = data.gradient;

      const gradient = legendCtx.createLinearGradient(0, 0, 100, 1);
      Object.keys(gradientCfg).forEach((key) => {
        gradient.addColorStop(parseFloat(key), gradientCfg[key]);
      });
      legendCtx.fillStyle = gradient;
      legendCtx.fillRect(0, 0, 100, 10);
      gradientImg.src = legendCanvas.toDataURL();
    }
  }

  const heatmapInstances: ReturnType<typeof h337.create>[] = [];
  for (let i = 1; i <= numHeatmaps; i += 1) {
    const dpoints: DataPoints = { min: dataPoints.min, max: dataPoints.max, data: [] };

    const config: HeatmapConfiguration = {
      container: document.getElementById(`heatmap${i}`)!,
      radius: 10,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75,
    };

    if (i === 1) {
      config.onExtremaChange = updateLegend as unknown as () => void; // typing is wrong here
    }

    if (dataPoints && dataPoints.data && dataPoints.data.length >= 20000) {
      config.radius = 8;
    } else if (dataPoints && dataPoints.data && dataPoints.data.length >= 2000) {
      config.radius = 9;
    }

    if (numHeatmaps === 1) {
      dpoints.data = dataPoints.data;
    } else {
      const lowerLimit = (i - 1) * heightPerHeatmap;
      const upperLimit = lowerLimit + heightPerHeatmap - 1;

      dataPoints.data.forEach((dp) => {
        if (dp.y >= lowerLimit && dp.y <= upperLimit) {
          const thePoint = {
            ...dp,
            y: dp.y - lowerLimit,
          };
          dpoints.data.push(thePoint);
        }
      });
    }

    const heatmapInstance = h337.create(config);
    // heatmap type requires value to be number, but matomo sets it as string
    heatmapInstance.setData(dpoints as unknown as Parameters<typeof heatmapInstance.setData>[0]);
    heatmapInstances.push(heatmapInstance);
  }

  return heatmapInstances;
}

export default defineComponent({
  props: {
    idSiteHsr: {
      type: Number,
      required: true,
    },
    deviceTypes: {
      type: Array,
      required: true,
    },
    heatmapTypes: {
      type: Array,
      required: true,
    },
    breakpointMobile: {
      type: Number,
      required: true,
    },
    breakpointTablet: {
      type: Number,
      required: true,
    },
    offsetAccuracy: {
      type: Number,
      required: true,
    },
    heatmapPeriod: {
      type: String,
      required: true,
    },
    heatmapDate: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isActive: Boolean,
    numSamples: {
      type: Object,
      required: true,
    },
    excludedElements: {
      type: String,
      required: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
    desktopPreviewSize: {
      type: Number,
      required: true,
    },
    iframeResolutionsValues: {
      type: Object,
      required: true,
    },
  },
  components: {
    Field,
    SaveButton,
    Tooltip,
  },
  data(): HeatmapVisState {
    return {
      isLoading: false,
      iframeWidth: this.desktopPreviewSize,
      customIframeWidth: this.desktopPreviewSize,
      avgFold: 0,
      heatmapType: (this.heatmapTypes as HeatmapType[])[0].key,
      deviceType: (this.deviceTypes as DeviceType[])[0].key,
      iframeResolutions: (this.iframeResolutionsValues as number[]),
      actualNumSamples: this.numSamples,
      dataCoordinates: [],
      currentElement: null,
      totalClicks: 0,
      tooltipShowTimeoutId: null,
      clickCount: 0,
      clickRate: 0,
    };
  },
  setup(props) {
    const tooltip = ref<InstanceType<typeof Tooltip> | null>(null);
    let iframeLoadedResolve: ((arg: unknown) => void)|null = null;
    const iframeLoadedPromise = new Promise((resolve) => {
      iframeLoadedResolve = resolve;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recordingIframe: any|null = null;
    const getRecordingIframe = (recordingPlayer: HTMLIFrameElement) => {
      if (!recordingIframe) {
        recordingIframe = getIframeWindow(recordingPlayer).recordingFrame;
        recordingIframe.excludeElements(props.excludedElements);
        recordingIframe.addClass('html', 'piwikHeatmap');
        recordingIframe.addClass('html', 'matomoHeatmap');
        recordingIframe.addWorkaroundForSharepointHeatmaps();
      }
      return recordingIframe;
    };

    const heatmapInstances = ref<ReturnType<typeof actualRenderHeatmap>|null>(null);
    const renderHeatmap = (
      recordingPlayer: HTMLElement,
      heatmapContainer: HTMLElement,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      theRecordingIframe: any,
      dataPoints: DataPoints,
    ) => {
      heatmapInstances.value = actualRenderHeatmap(
        recordingPlayer,
        heatmapContainer,
        theRecordingIframe,
        dataPoints,
      );
    };

    return {
      iframeLoadedPromise,
      onLoaded: iframeLoadedResolve,
      getRecordedHeatmap: oneAtATime<ScrollReach[]>(
        'HeatmapSessionRecording.getRecordedHeatmap',
      ),
      getRecordedHeatmapMetadata: oneAtATime<HeatmapMetadata>(
        'HeatmapSessionRecording.getRecordedHeatmapMetadata',
      ),
      getRecordingIframe,
      heatmapInstances,
      renderHeatmap,
      tooltip,
    };
  },
  created() {
    if (this.iframeResolutions.indexOf(this.breakpointMobile) === -1) {
      this.iframeResolutions.push(this.breakpointMobile);
    }

    if (this.iframeResolutions.indexOf(this.breakpointTablet) === -1) {
      this.iframeResolutions.push(this.breakpointTablet);
    }

    this.iframeResolutions = this.iframeResolutions.sort((a, b) => a - b);

    this.fetchHeatmap();

    // Hide the period selector since we don't filter the heatmap by period
    Matomo.postEvent('hidePeriodSelector');
  },
  watch: {
    isLoading() {
      if (this.isLoading === true) {
        return;
      }

      const heatmapContainer = window.document.getElementById('heatmapContainer');
      if (!heatmapContainer) {
        return;
      }
      heatmapContainer.addEventListener('mouseleave', (event) => {
        // Stop processing tooltip when moving mouse out of parent element
        if (this.tooltipShowTimeoutId) {
          clearTimeout(this.tooltipShowTimeoutId);
          this.tooltipShowTimeoutId = null;
        }
        // Reset the highlight and tooltip when leaving the container
        this.currentElement = null;
        this.handleTooltip(event, 0, 0, 'hide');
        const highlightDiv = window.document.getElementById('highlightDiv');
        if (!highlightDiv) {
          return;
        }
        highlightDiv.hidden = true;
      });
      heatmapContainer.addEventListener('mousemove', (e) => {
        this.handleMouseMove(e);
      });
    },
  },
  beforeUnmount() {
    this.removeScrollHeatmap();
  },
  methods: {
    removeScrollHeatmap() {
      const element = this.$refs.iframeRecordingContainer as HTMLElement;
      $(element).find('.scrollHeatmapLeaf').remove();
    },
    deleteScreenshot() {
      Matomo.helper.modalConfirm(this.$refs.confirmDeleteHeatmapScreenshot as HTMLElement, {
        yes: () => {
          this.isLoading = true;
          AjaxHelper.fetch({
            method: 'HeatmapSessionRecording.deleteHeatmapScreenshot',
            idSiteHsr: this.idSiteHsr,
          }).then(() => {
            this.isLoading = false;
            window.location.reload();
          });
        },
      });
    },
    fetchHeatmap() {
      this.removeScrollHeatmap();

      if (this.heatmapInstances) {
        const instances = this.heatmapInstances as ReturnType<typeof actualRenderHeatmap>;
        instances.forEach((heatmapInstance) => {
          heatmapInstance.setData({
            max: 1,
            min: 0,
            data: [],
          });
        });
      }

      this.isLoading = true;
      this.avgFold = 0;

      const segment = MatomoUrl.parsed.value.segment
        ? decodeURIComponent(MatomoUrl.parsed.value.segment as string)
        : undefined;

      const requestParams: QueryParameters = {
        idSiteHsr: this.idSiteHsr,
        heatmapType: this.heatmapType,
        deviceType: this.deviceType,
        period: this.heatmapPeriod,
        date: this.heatmapDate,
        filter_limit: -1,
        segment,
      };

      const heatmapDataPromise = this.getRecordedHeatmap(requestParams);
      const heatmapMetaDataPromise = this.getRecordedHeatmapMetadata(requestParams);

      Promise.all([
        heatmapDataPromise,
        heatmapMetaDataPromise,
        this.iframeLoadedPromise,
      ]).then((response) => {
        const iframeElement = this.$refs.recordingPlayer as HTMLIFrameElement;

        const recordingIframe = this.getRecordingIframe(iframeElement);

        initHeatmap(
          this.$refs.recordingPlayer as HTMLElement,
          this.$refs.heatmapContainer as HTMLElement,
          recordingIframe,
        );
        this.removeScrollHeatmap();

        const rows = response[0];
        const numSamples = response[1];

        if (Array.isArray(numSamples) && numSamples[0]) {
          [this.actualNumSamples] = numSamples as unknown as HeatmapMetadata[];
        } else {
          this.actualNumSamples = numSamples as unknown as HeatmapMetadata;
        }

        this.isLoading = false;

        if (this.isScrollHeatmapType) {
          scrollHeatmap(
            this.$refs.iframeRecordingContainer as HTMLElement,
            iframeElement,
            recordingIframe,
            rows as ScrollReach[],
          );
        } else {
          const dataPoints: DataPoints = {
            min: 0,
            max: 0,
            data: [],
          };

          for (let i = 0; i < rows.length; i += 1) {
            const row = rows[i];

            if (row.selector) {
              const dataPoint = recordingIframe.getCoordinatesInFrame(
                row.selector,
                row.offset_x,
                row.offset_y,
                this.offsetAccuracy,
                true,
              ) as DataPoint;

              if (dataPoint) {
                dataPoint.value = row.value;
                dataPoints.data.push(dataPoint);
                this.dataCoordinates.push(dataPoint);
                this.totalClicks += parseInt(row.value, 10);
              }
            }
          }

          if (this.heatmapType === 2) {
            // click
            let numEntriesHigherThan1 = 0;

            dataPoints.data.forEach((dp) => {
              if (dp?.value && parseInt(dp.value, 10) > 1) {
                numEntriesHigherThan1 += 1;
              }
            });

            if (numEntriesHigherThan1 / dataPoints.data.length >= 0.10
              && dataPoints.data.length > 120
            ) {
              // if at least 10% have .value >= 2, then we set max to 2 to differntiate better
              // between 1 and 2 clicks but only if we also have more than 80 data points
              // ("randomly" chosen that threshold)
              dataPoints.max = 2;
            } else {
              dataPoints.max = 1;
            }
          } else {
            const LIMIT_MAX_DATA_POINT = 10;
            const values: Record<string, number> = {};

            dataPoints.data.forEach((dp) => {
              if (!dp || !dp.value) {
                return;
              }

              let value = parseInt(dp.value, 10);

              if (value > dataPoints.max) {
                dataPoints.max = value;
              }

              if (value > LIMIT_MAX_DATA_POINT) {
                value = LIMIT_MAX_DATA_POINT;
              }

              const valueStr = `${value}`;
              if (valueStr in values) {
                values[valueStr] += 1;
              } else {
                values[valueStr] = 0;
              }
            });

            if (dataPoints.max > LIMIT_MAX_DATA_POINT) {
              // we limit it to 10 otherwise many single points are not visible etc
              // if there is no single entry having value 10, we set it to 9, 8 or 7
              // to make sure there is actually a dataPoint for this max value.
              let sumValuesAboveThreshold = 0;

              for (let k = LIMIT_MAX_DATA_POINT; k > 1; k -= 1) {
                const kStr = `${k}`;
                if (kStr in values) {
                  // we need to aggregate the value
                  sumValuesAboveThreshold += values[kStr];
                }

                if (sumValuesAboveThreshold / dataPoints.data.length >= 0.2) {
                  // we make sure to have at least 20% of entries in that max value
                  dataPoints.max = k;
                  break;
                }

                // todo ideally in this case also require that akk 2 - (k-1) have a distribution
                // of 0.2 to make sure we have enough values in between, and if not select k-1 or
                // so. Otherwise we have maybe 75% with value 1, 20% with value 10, and only 5% in
                // between... which would be barely visible those 75% maybe
              }

              if (dataPoints.max > LIMIT_MAX_DATA_POINT) {
                // when no entry has more than 15% distribution, we set a default of 5
                dataPoints.max = 5;

                for (let k = 5; k > 0; k -= 1) {
                  const kStr = `${k}`;
                  if (kStr in values) {
                    // we limit it to 10 otherwise many single points are not visible etc
                    // also if there is no single entry having value 10, we set it to 9, 8 or 7
                    // to make sure there is actually a dataPoint for this max value.
                    dataPoints.max = k;
                    break;
                  }
                }
              }
            }
          }

          this.renderHeatmap(
            this.$refs.recordingPlayer as HTMLElement,
            this.$refs.heatmapContainer as HTMLElement,
            recordingIframe,
            dataPoints,
          );

          if (this.actualNumSamples?.[`avg_fold_device_${this.deviceType}`]) {
            const avgFoldPercent = this.actualNumSamples[`avg_fold_device_${this.deviceType}`];
            const height = recordingIframe.getIframeHeight() as number;

            if (height) {
              this.avgFold = parseInt(`${(avgFoldPercent / 100) * height}`, 10);
            }
          }
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    changeDeviceType(deviceType: number) {
      this.deviceType = deviceType;

      if (this.deviceType === deviceDesktop) {
        this.changeIframeWidth(this.desktopPreviewSize, false);
      } else if (this.deviceType === deviceTablet) {
        this.changeIframeWidth(this.breakpointTablet || 960, false);
      } else if (this.deviceType === deviceMobile) {
        this.changeIframeWidth(this.breakpointMobile || 600, false);
      }
    },
    changeIframeWidth(iframeWidth: number, scrollToTop?: boolean) {
      this.iframeWidth = iframeWidth;
      this.customIframeWidth = this.iframeWidth;
      this.totalClicks = 0;
      this.dataCoordinates = [];
      this.fetchHeatmap();

      if (scrollToTop) {
        Matomo.helper.lazyScrollToContent();
      }
    },
    changeHeatmapType(heatmapType: number) {
      this.heatmapType = heatmapType;
      this.totalClicks = 0;
      this.clickCount = 0;
      this.clickRate = 0;
      this.dataCoordinates = [];
      this.fetchHeatmap();
    },
    handleMouseMove(event: MouseEvent) {
      const highlightDiv = window.document.getElementById('highlightDiv');
      if (!highlightDiv) {
        return;
      }

      // Keep the tooltip from showing until the cursor has stopped moving
      if (this.tooltipShowTimeoutId) {
        clearTimeout(this.tooltipShowTimeoutId);
        this.tooltipShowTimeoutId = null;
        this.currentElement = null;
      }

      // If the highlight is visible, move the tooltip around with the cursor
      if (!highlightDiv.hidden) {
        this.handleTooltip(event, 0, 0, 'move');
      }

      const element = this.lookUpRecordedElementAtEventLocation(event);
      // If there's no element, don't do anything else
      // If the element hasn't changed, there's no need to do anything else
      if (!element || element === this.currentElement) {
        return;
      }
      this.handleTooltip(event, 0, 0, 'hide');
      highlightDiv.hidden = true;
      const elementRect = element.getBoundingClientRect();
      let elementClicks = 0;
      this.dataCoordinates.forEach((dataPoint) => {
        // Return if the dataPoint isn't within the element
        if (dataPoint.y < elementRect.top || dataPoint.y > elementRect.bottom
          || dataPoint.x < elementRect.left || dataPoint.x > elementRect.right) {
          return;
        }
        elementClicks += parseInt(dataPoint.value, 10);
      });

      // Have a slight delay so that it's not jarring when it displays
      this.tooltipShowTimeoutId = setTimeout(
        () => {
          this.currentElement = element;
          highlightDiv.hidden = false;
          // Multiplying by 10000 and then dividing by 100 to get 2 decimal points of precision
          const clickRate = this.totalClicks
            ? Math.round((elementClicks / this.totalClicks) * 10000) / 100 : 0;
          const rect = element.getBoundingClientRect();
          highlightDiv.style.top = `${rect.top}px`;
          highlightDiv.style.left = `${rect.left}px`;
          highlightDiv.style.width = `${rect.width}px`;
          highlightDiv.style.height = `${rect.height}px`;
          this.handleTooltip(event, elementClicks, clickRate, 'show');
          this.tooltipShowTimeoutId = null;
        },
        100,
      );
    },
    lookUpRecordedElementAtEventLocation(event: MouseEvent): HTMLElement|null {
      const targetElement = event.target as HTMLElement;
      if (!targetElement) {
        return null;
      }
      const frameElement = window.document.getElementById('recordingPlayer') as HTMLObjectElement;
      if (!frameElement) {
        return null;
      }
      const frameRef = frameElement.contentWindow
        ? frameElement.contentWindow.document
        : frameElement.contentDocument;
      if (!frameRef) {
        return null;
      }
      const rect = targetElement.getBoundingClientRect();
      return frameRef.elementFromPoint(
        event.clientX - rect.left,
        event.clientY - rect.top,
      ) as HTMLElement|null;
    },
    handleTooltip(event: MouseEvent, clickCount: number, clickRate: number, action: 'show' | 'move' | 'hide') {
      if (this.tooltip) {
        if (action === 'show') {
          this.clickCount = clickCount;
          this.clickRate = clickRate;
          this.tooltip.show(event);
        } else if (action === 'move') {
          this.tooltip.show(event);
        } else {
          this.tooltip.hide();
        }
      }
    },
  },
  computed: {
    isScrollHeatmapType() {
      return this.heatmapType === 3;
    },
    tokenAuth() {
      return MatomoUrl.parsed.value.token_auth as string;
    },
    embedUrl() {
      return `?${MatomoUrl.stringify({
        module: 'HeatmapSessionRecording',
        action: 'embedPage',
        idSite: Matomo.idSite,
        idSiteHsr: this.idSiteHsr,
        token_auth: this.tokenAuth || undefined,
      })}`;
    },
    iframeWidthOptions() {
      return this.iframeResolutions.map((width) => ({
        key: width,
        value: `${width}px`,
      }));
    },
    recordedSamplesSince() {
      const string1 = translate(
        'HeatmapSessionRecording_HeatmapXRecordedSamplesSince',
        `<span class="deviceAllCountSamples">${this.actualNumSamples.nb_samples_device_all}</span>`,
        this.createdDate,
      );
      const linkString = externalLink('https://matomo.org/faq/heatmap-session-recording/troubleshooting-heatmaps/');
      const string2 = translate(
        'HeatmapSessionRecording_HeatmapTroubleshoot',
        linkString,
        '</a>',
      );

      return `${string1} ${string2}`;
    },
    deviceTypesWithSamples() {
      return (this.deviceTypes as DeviceType[]).map((deviceType) => {
        let numSamples: number;
        if (this.actualNumSamples[`nb_samples_device_${deviceType.key}`]) {
          numSamples = this.actualNumSamples[`nb_samples_device_${deviceType.key}`];
        } else {
          numSamples = 0;
        }

        const tooltip = translate('HeatmapSessionRecording_XSamples', `${deviceType.name} - ${numSamples}`);

        return {
          ...deviceType,
          numSamples,
          tooltip,
        };
      });
    },
    hasWriteAccess() {
      return !!Matomo?.heatmapWriteAccess;
    },
    showDeleteScreenshot() {
      return this.isActive && this.hasWriteAccess;
    },
    gradientImgData() {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAKCAYAAABCHPt+AAAAnklEQVRYR+2WQQq'
        + 'DQBAES5wB/f8/Y05RcMWwSu6JIT0Dm4WlH1DUdHew7/z6WYFhhnGRpnlhAEaQpi/ADbh/np0MiBhGhW+2ymFU+DZ'
        + 'fg1EhaoB4jCFuMYYcQKZrXwPEVvm5Og0pcYakBvI35G1jNIZ4jCHexxjSpz9ZFUjAynLbpOvqteaODkm9sloz5JF'
        + '+ZTVmSAWSu9Qb65AvgDwBQoLgVDlWfAQAAAAASUVORK5CYII=';
    },
  },
});
</script>
