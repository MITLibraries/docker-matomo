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
      <div class="hsrToggle heatmapTypePills">
        <button
          type="button"
          class="hsrToggleBtn"
          :class="[`heatmapType${theHeatmapType.key}`,
            { active: theHeatmapType.key === heatmapType }]"
          @click="changeHeatmapType(theHeatmapType.key)"
          v-for="theHeatmapType in heatmapTypes"
          :key="theHeatmapType.key"
        >{{ theHeatmapType.name }}</button>
      </div>
      <div class="hsrToggle deviceTypePills">
        <button
          type="button"
          class="hsrToggleBtn"
          :class="[`deviceType${theDeviceType.key}`,
            { active: theDeviceType.key === deviceType }]"
          @click="changeDeviceType(theDeviceType.key)"
          v-for="theDeviceType in deviceTypesWithResolution"
          :key="theDeviceType.key"
        >
          <img
            height="15"
            :src="theDeviceType.logo"
            :alt="`${translate('DevicesDetection_Device')} ${theDeviceType.name}`"
          />
          <span class="deviceName">{{ theDeviceType.name }}</span>
          <span class="deviceResolution">{{ theDeviceType.resolution }}px</span>
        </button>
      </div>
      <div class="customIframeWidth">
        <span
          class="customIframeWidthLabel"
          v-text="translate('HeatmapSessionRecording_CustomWidth')"></span>
        <Field
          uicontrol="select"
          name="iframewidth"
          :model-value="customIframeWidth"
          @update:model-value="customIframeWidth = $event;
            changeIframeWidth(customIframeWidth, true)"
          :options="iframeWidthOptions"
          :full-width="true"
        >
        </Field>
      </div>
      <div class="legendOuter">
        <span class="legendLabel">{{ translate('HeatmapSessionRecording_LegendLow') }}</span>
        <div class="legend-area">
          <img
            class="gradient"
            alt="gradient"
            :src="gradientImgData"
          />
        </div>
        <span class="legendLabel">{{ translate('HeatmapSessionRecording_LegendHigh') }}</span>
      </div>
    </div>
    <div class="heatmapReportLayout">
      <div
        class="heatmapScrollArea"
        :class="{ heatmapScrollAreaEmpty: !hasSnapshot }"
        ref="heatmapScrollArea"
        :style="scrollAreaStyle"
      >
        <div class="heatmapScaleBox" v-if="hasSnapshot" :style="scaleBoxStyle">
          <div
            class="iframeRecordingContainer"
            ref="iframeRecordingContainer"
            :style="containerStyle"
          >
            <div class="heatmapWrapper">
              <div id="heatmapContainer" ref="heatmapContainer" />
              <div id="highlightDiv"></div>
            </div>
            <div
              class="aboveFoldLine"
              ref="aboveFoldLine"
              :title="translate('HeatmapSessionRecording_AvgAboveFoldDescription')"
              v-show="avgFold"
              :style="{width: iframeWidth + 'px', top: avgFold + 'px'}"
            >
              <div>{{ translate('HeatmapSessionRecording_AvgFold', avgFold) }}</div>
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
        </div>
        <HeatmapEmptyState
          v-else
          :state="emptyStateKey"
          :id-site-hsr="idSiteHsr"
        />
        <div class="heatmapLoadingOverlay" v-show="isLoading">
          <div class="heatmapLoadingSpinner"></div>
          <div class="heatmapLoadingTitle">
            {{ translate('HeatmapSessionRecording_LoadingHeatmap') }}
          </div>
        </div>
      </div>
      <div class="card heatmapSummaryCard" v-if="showSummaryCard">
        <div class="card-content">
          <div class="recordingsHeader">
            <span class="card-title">
              {{ translate('HeatmapSessionRecording_Recordings') }}
            </span>
            <span class="recordingsDeviceType">{{ selectedDeviceTypeName }}</span>
          </div>
          <h2 class="recordingsValue">{{ totalRecordings }}</h2>
          <div v-if="!deviceBreakdown.length" class="recordingsEmpty">
            {{ translate('HeatmapSessionRecording_WaitingForFirstRecording') }}
          </div>
          <div v-else class="deviceBreakdown">
            <div class="deviceBreakdownBar">
              <div
                class="deviceBreakdownSegment"
                :class="`deviceBreakdownDevice${device.key}`"
                v-for="device in deviceBreakdown"
                :key="device.key"
                :style="{ width: `${device.percent}%` }"
                :title="`${device.name} ${device.percentLabel}`"
              />
            </div>
            <div class="deviceBreakdownLegend">
              <div
                class="deviceBreakdownLegendItem"
                v-for="device in deviceBreakdown"
                :key="device.key"
              >
                <span
                  class="deviceBreakdownSwatch"
                  :class="`deviceBreakdownDevice${device.key}`"
                ></span>
                <span class="deviceBreakdownLegendLabel">
                  {{ device.name }}
                </span>
                <span class="deviceBreakdownLegendPercentLabel">
                  {{ device.percentLabel }}
                </span>
              </div>
            </div>
          </div>
          <!-- Clicks and scroll reach need the recorded DOM, so they only show when
               a snapshot exists; empty states keep just the recordings summary above. -->
          <template v-if="hasSnapshot">
            <div class="divider"></div>
            <div class="card-title">
              {{ translate('HeatmapSessionRecording_TopClickedElements') }}
            </div>
            <div v-if="topClickedElements.length">
              <div
                class="topClickedElementRow"
                v-for="element in topClickedElements"
                :key="element.key"
              >
                <div class="topClickedElementContent">
                  <div class="topClickedElementLabel" :title="element.label">
                    {{ element.label }}
                  </div>
                  <div class="topClickedElementBarRow">
                    <div class="topClickedElementBar">
                      <div
                        class="topClickedElementBarFill"
                        :style="{ width: `${element.percent}%` }"
                      />
                    </div>
                  </div>
                </div>
                <span class="topClickedElementPercent">{{ element.percentLabel }}</span>
              </div>
            </div>
            <div v-else>
              {{ translate('HeatmapSessionRecording_NoClickedElements') }}
            </div>
            <div class="divider"></div>
            <div class="scrollReachHeader">
              <span class="card-title">
                {{ translate('HeatmapSessionRecording_ScrollReach') }}
              </span>
              <span
                v-if="summaryAvgFold"
                class="scrollReachAvgFold"
              >{{ translate('HeatmapSessionRecording_AvgFold', summaryAvgFold) }}</span>
            </div>
            <div v-if="scrollReach.length">
              <div
                class="scrollReachRow"
                v-for="band in scrollReach"
                :key="band.key"
              >
                <span class="scrollReachLabel">{{ band.label }}</span>
                <div class="topClickedElementBar">
                  <div
                    class="topClickedElementBarFill"
                    :style="{ width: `${band.percent}%` }"
                  />
                </div>
                <span class="scrollReachPercent">{{ band.percentLabel }}</span>
              </div>
            </div>
            <div v-else>
              {{ translate('HeatmapSessionRecording_NoScrollData') }}
            </div>
          </template>
        </div>
      </div>
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
import { toPng } from 'html-to-image';
import {
  translate,
  Matomo,
  MatomoUrl,
  NotificationsStore,
  externalLink,
  NumberFormatter,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import { DeviceType, HeatmapMetadata, HeatmapType } from '../types';
import {
  toHeatmapJsGradient,
  interpolateGradientColor,
  generateGradientImgData,
} from './heatmapGradient';
import getIframeWindow from '../getIframeWindow';
import oneAtATime from '../oneAtATime';
import Tooltip from '../Tooltip/Tooltip.vue';
import HeatmapEmptyState from './HeatmapEmptyState.vue';

const { $ } = window;

const deviceDesktop = 1;
const deviceTablet = 2;
const deviceMobile = 3;

// Summary card ranking thresholds: how many candidate elements we track before
// re-aggregating clicks by bounding box, how many we ultimately display, and the
// maximum length of an element label before it is truncated.
const MAX_TRACKED_CLICK_ELEMENTS = 15;
const MAX_TOP_CLICKED_ELEMENTS = 5;
const MAX_CLICKED_ELEMENT_LABEL_LENGTH = 60;

// Measured space the environment's vertical scrollbar actually consumes in
// the frame (see getScrollbarGutterWidth); cached for the page's lifetime.
let measuredScrollbarGutter: number|null = null;

// Folds at/above this share of the page height don't get a fold line: they
// mean the page was (nearly) fully visible in the visitors' viewports, where
// "nearly" absorbs the tracker's document-height padding from body margins
// and scrollbars (a fully-seen page typically tracks ~99%, not 100%).
const FOLD_LINE_MAX_PERCENT = 97;

// The summary's "Bottom" band tolerates the same padding: a visitor whose
// viewport covered the whole page tracks a depth just short of 1000‰, and
// requiring exactly 1000 would report Bottom 0% for a fully-seen page.
const SCROLL_REACH_BOTTOM_MARK = FOLD_LINE_MAX_PERCENT * 10;

// Elements the summary card prefers to attribute clicks to; clicks on their
// descendants roll up to them, and their full descendant text is a safe label.
const INTERACTIVE_ELEMENTS_SELECTOR = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]';

// Structural/landmark elements only surface in the summary card through the
// container fallback and otherwise have no descriptive label, so they get a
// semantic type. The generic "table" reuses the shared core translation.
const STRUCTURAL_TYPE_KEYS: Record<string, string> = {
  nav: 'HeatmapSessionRecording_ElementTypeNavigation',
  ul: 'HeatmapSessionRecording_ElementTypeList',
  ol: 'HeatmapSessionRecording_ElementTypeList',
  form: 'HeatmapSessionRecording_ElementTypeForm',
  header: 'HeatmapSessionRecording_ElementTypeHeader',
  footer: 'HeatmapSessionRecording_ElementTypeFooter',
  main: 'HeatmapSessionRecording_ElementTypeMainContent',
  aside: 'HeatmapSessionRecording_ElementTypeSidebar',
  section: 'HeatmapSessionRecording_ElementTypeSection',
  article: 'HeatmapSessionRecording_ElementTypeArticle',
  table: 'General_Table',
};

// Container tags excluded from the preferred (interactive-only) pass when they
// have child elements: derived from the structural map above so the two can
// never drift apart, plus containers that have no semantic label of their own.
const GENERIC_CONTAINER_TAGS = Object.keys(STRUCTURAL_TYPE_KEYS)
  .concat(['div', 'li', 'td', 'th', 'tr', 'tbody', 'thead']);

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
  selector?: string;
}

interface DataPoints {
  min: number;
  max: number;
  data: DataPoint[];
  gradient?: Record<string, string>;
}

interface TopClickedElement {
  key: string;
  label: string;
  count: number;
  boundingRectangle: DOMRect;
  percent: number;
  percentLabel: string;
}

interface ScrollReachBand {
  key: string;
  label: string;
  percent: number;
  percentLabel: string;
}

interface HeatmapVisState {
  isLoading: boolean;
  isExporting: boolean;
  iframeWidth: number;
  customIframeWidth: number;
  avgFold: number;
  summaryAvgFold: number;
  heatmapType: number;
  deviceType: number;
  iframeResolutions: number[];
  actualNumSamples: HeatmapMetadata;
  dataCoordinates: DataPoint[];
  currentElement: HTMLElement|null;
  totalClicks: number;
  topClickedElements: TopClickedElement[];
  scrollReach: ScrollReachBand[];
  fetchGeneration: number;
  scrollAreaMaxHeight: number;
  previewScale: number;
  recordingHeight: number;
  summaryCardHeight: number;
  frameNeedsVScroll: boolean;
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

    const colorValues = interpolateGradientColor(bucket.percentageValue, minValue, maxValue);
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
}

function actualRenderHeatmap(
  recordingPlayer: HTMLElement,
  heatmapContainer: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordingIframe: any,
  dataPoints: DataPoints,
) {
  const numHeatmaps = initHeatmap(recordingPlayer, heatmapContainer, recordingIframe);
  const heatmapInstances: ReturnType<typeof h337.create>[] = [];
  for (let i = 1; i <= numHeatmaps; i += 1) {
    const dpoints: DataPoints = { min: dataPoints.min, max: dataPoints.max, data: [] };

    const config: HeatmapConfiguration = {
      container: document.getElementById(`heatmap${i}`)!,
      radius: 10,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75,
      gradient: toHeatmapJsGradient(),
    };

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

async function backgroundRenders(url: string, ownerDoc: Document): Promise<boolean> {
  const probe = ownerDoc.createElement('img');
  probe.src = url;
  try {
    await probe.decode();
    return true;
  } catch (e) {
    return false;
  }
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
    createdDateRaw: {
      type: String,
      required: true,
    },
    heatmapName: {
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
    imageProxyNonce: {
      type: String,
      default: '',
    },
    // Whether a snapshot (page tree mirror) exists; when false the empty state renders instead.
    hasSnapshot: {
      type: Boolean,
      default: true,
    },
    // Whether the heatmap only captures its snapshot manually (drives the empty-state text).
    captureManually: Boolean,
    // Whether a snapshot was previously deleted (tells "deleted" apart from "never captured").
    snapshotDeleted: Boolean,
    // Whether the heatmap is paused (resumable) rather than ended (permanent); the deleted
    // empty state tells the user capture resumes once the heatmap is resumed.
    isPaused: Boolean,
  },
  components: {
    Field,
    Tooltip,
    HeatmapEmptyState,
  },
  data(): HeatmapVisState {
    return {
      isLoading: false,
      isExporting: false,
      iframeWidth: this.desktopPreviewSize,
      customIframeWidth: this.desktopPreviewSize,
      avgFold: 0,
      summaryAvgFold: 0,
      heatmapType: (this.heatmapTypes as HeatmapType[])[0].key,
      deviceType: (this.deviceTypes as DeviceType[])[0].key,
      iframeResolutions: (this.iframeResolutionsValues as number[]),
      actualNumSamples: this.numSamples,
      dataCoordinates: [],
      currentElement: null,
      totalClicks: 0,
      topClickedElements: [],
      scrollReach: [],
      fetchGeneration: 0,
      scrollAreaMaxHeight: 0,
      previewScale: 1,
      recordingHeight: 0,
      summaryCardHeight: 0,
      frameNeedsVScroll: true,
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
      getRecordedClickHeatmap: oneAtATime<ScrollReach[]>(
        'HeatmapSessionRecording.getRecordedHeatmap',
      ),
      getRecordedScrollHeatmap: oneAtATime<ScrollReach[]>(
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
  mounted() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  },
  updated() {
    // The summary card grows as its async data lands; keep the frame's
    // height floor in sync (guarded internally against re-render loops).
    this.updateSummaryCardHeight();
  },
  emits: ['exporting'],
  watch: {
    isExporting() {
      // let the parent (settings dropdown) reflect the export progress
      this.$emit('exporting', this.isExporting);
    },
    isLoading() {
      if (this.isLoading === true) {
        return;
      }

      // The chrome above/below the scroll area can change once the report has
      // rendered (toolbar wrapping, the delete-screenshot button appearing).
      this.$nextTick(() => this.onWindowResize());

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
    window.removeEventListener('resize', this.onWindowResize);
    this.removeScrollHeatmap();
  },
  methods: {
    onWindowResize() {
      // Order matters: the scale (and its scrollbar decision) reads the cap
      // and the card height measured by the two calls before it.
      this.updateScrollAreaMaxHeight();
      this.updateSummaryCardHeight();
      this.updatePreviewScale();
    },
    // How much layout width the environment's vertical scrollbar takes inside
    // the frame: ~10px (the styled webkit width) with classic scrollbars,
    // 0 where scrollbars overlay or are hidden (macOS default, headless
    // screenshot runs) — subtracting a fixed allowance there left a hole to
    // the card's right. Probed once with the frame's own styling.
    getScrollbarGutterWidth(): number {
      if (measuredScrollbarGutter === null) {
        const probe = document.createElement('div');
        probe.className = 'heatmapScrollArea';
        probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;'
          + 'width:100px;height:100px;border:0;padding:0;overflow-y:scroll;';
        document.body.appendChild(probe);
        measuredScrollbarGutter = Math.max(0, probe.offsetWidth - probe.clientWidth);
        probe.remove();
      }

      return measuredScrollbarGutter;
    },
    // Height of the summary card while it sits beside the frame (row layout);
    // 0 in the stacked layout, where flooring the frame to the card would
    // only inflate it. Measured rather than computed because the card's
    // height depends on its async-loaded content; also re-measured from
    // updated() so content arriving later is picked up.
    updateSummaryCardHeight() {
      const area = this.$refs.heatmapScrollArea as HTMLElement;
      const layout = area?.parentElement;
      const card = layout?.querySelector('.heatmapSummaryCard');
      if (!layout || !card) {
        return;
      }

      const stacked = window.getComputedStyle(layout).flexDirection === 'column';
      const height = stacked ? 0 : Math.round(card.getBoundingClientRect().height);

      // Guarded assignment: this runs from updated(), so writing an unchanged
      // value would re-render in a loop.
      if (height !== this.summaryCardHeight) {
        this.summaryCardHeight = height;
      }
    },
    // Fits a preview wider than the viewing area by scaling it down: the
    // recorded page keeps its true layout width inside the iframe (so the
    // heatmap data stays aligned with the elements it was recorded against)
    // and the rendered result shrinks uniformly, like the replay player.
    // Narrower previews stay at 1:1 and are centered instead.
    updatePreviewScale() {
      const area = this.$refs.heatmapScrollArea as HTMLElement;
      const layout = area?.parentElement;
      if (!area || !layout || !layout.clientWidth || !this.iframeWidth) {
        return;
      }

      // The frame hugs the (scaled) snapshot, so its own width cannot drive
      // the scale (it *is* the scale). The available width is the layout
      // row's, minus the summary card and the row gap beside it — the frame
      // may only grow as far as the card still fits — minus the frame's
      // borders.
      const layoutStyles = window.getComputedStyle(layout);
      const areaStyles = window.getComputedStyle(area);
      const stacked = layoutStyles.flexDirection === 'column';
      const card = layout.querySelector('.heatmapSummaryCard');
      const cardSpace = !stacked && card
        ? card.getBoundingClientRect().width + (parseFloat(layoutStyles.columnGap || '0') || 0)
        : 0;
      const borders = (parseFloat(areaStyles.borderLeftWidth || '0') || 0)
        + (parseFloat(areaStyles.borderRightWidth || '0') || 0);
      const available = layout.clientWidth - cardSpace - borders;

      if (available <= 0) {
        return;
      }

      const round4 = (value: number) => Math.round(value * 10000) / 10000;

      // Two candidate scales, decided from first principles rather than live
      // scrollbar measurements (which would oscillate at the boundary: hiding
      // the scrollbar widens the area, raising the scale, which can re-need
      // the scrollbar). If the preview fits the frame's height without the
      // scrollbar's gutter, no vertical scrolling is possible and the gutter
      // is dropped entirely; otherwise the scale accounts for the gutter.
      const scaleWithoutGutter = Math.min(1, round4(available / this.iframeWidth));
      const frameHeight = this.scrollAreaMaxHeight
        ? Math.max(
          Math.min(this.scrollAreaMaxHeight, this.recordingHeight || Infinity),
          this.summaryCardHeight,
        )
        : Infinity;
      const fits = !this.recordingHeight
        || scaleWithoutGutter * this.recordingHeight <= frameHeight;

      this.frameNeedsVScroll = !fits;
      this.previewScale = fits
        ? scaleWithoutGutter
        : Math.min(1, round4((available - this.getScrollbarGutterWidth()) / this.iframeWidth));
    },
    // Caps the scroll area so the report's bottom edge lands at the bottom of
    // the window (16px gap): the recording scrolls inside the frame while the
    // content below it (e.g. the delete-screenshot button) stays visible.
    // Measured live rather than a calc(100vh - X) constant because the
    // surrounding chrome varies (toolbar wrapping, notifications, admin vs
    // widgetized page headers).
    updateScrollAreaMaxHeight() {
      const area = this.$refs.heatmapScrollArea as HTMLElement;
      const root = this.$el as HTMLElement;
      if (!area || !root?.getBoundingClientRect) {
        return;
      }

      const layout = area.parentElement;
      const areaRect = area.getBoundingClientRect();
      // Content that must stay visible below the frame (the delete-screenshot
      // block), measured from the layout row's bottom rather than the area's
      // own: the row's bottom tracks its tallest child, so this stays
      // constant — and recomputation stable — even when the summary card
      // outgrows the capped area.
      const belowChrome = layout
        ? root.getBoundingClientRect().bottom - layout.getBoundingClientRect().bottom
        : 0;
      // The area's top as if the page were scrolled to the top, so the cap is
      // stable no matter when this runs.
      const areaTop = areaRect.top + window.scrollY;

      this.scrollAreaMaxHeight = Math.max(400, window.innerHeight - areaTop - belowChrome - 16);
    },
    // The metadata endpoint returns sample counts as strings (HeatmapMetadata's
    // `number` notwithstanding), so anything doing arithmetic on them must
    // coerce first: summing raw values concatenates ("0" + "2" + "0" -> "020")
    // and silently produces absurd device shares.
    getDeviceSamples(deviceKey: number): number {
      return parseInt(String(this.actualNumSamples[`nb_samples_device_${deviceKey}`]), 10) || 0;
    },
    resolveClickedElement(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recordingIframe: any,
      selector: string,
    ) {
      const $element = recordingIframe.findElement(selector);
      const rawElement = $element && $element[0] ? $element[0] : null;
      if (!rawElement) {
        return null;
      }

      // Resolve permissively (containers allowed) but remember whether the click
      // also resolves to a preferred, non-container element, so a single pass can
      // serve both the interactive-only and the container-fallback rankings.
      const element = this.normalizeClickedElement(rawElement, true);
      if (!element) {
        return null;
      }

      return {
        key: this.getElementKey(element),
        label: this.getElementLabel(element, selector),
        boundingRectangle: element.getBoundingClientRect(),
        isPreferred: this.normalizeClickedElement(rawElement, false) !== null,
      };
    },
    normalizeClickedElement(element: HTMLElement, includeContainers: boolean): HTMLElement|null {
      const interactiveParent = element.closest(INTERACTIVE_ELEMENTS_SELECTOR);

      if (interactiveParent) {
        return interactiveParent as HTMLElement;
      }

      const wrapped = this.getWrappedInteractiveElement(element);
      if (wrapped) {
        return wrapped;
      }

      if (!this.isUsefulClickedElement(element, includeContainers)) {
        return null;
      }

      return element;
    },
    // A presentational wrapper around exactly one interactive element (an image
    // inside a link, a button padded by a div) credits that element - the mirror
    // of the ancestor roll-up above. Landmark containers (nav, section, aside...)
    // keep their own identity, and a wrapper with its own text is more than a
    // pass-through, so both are left alone.
    getWrappedInteractiveElement(element: HTMLElement): HTMLElement|null {
      const tagName = element.tagName.toLowerCase();
      if (STRUCTURAL_TYPE_KEYS[tagName] || this.getElementText(element)) {
        return null;
      }

      const interactive = element.querySelectorAll<HTMLElement>(INTERACTIVE_ELEMENTS_SELECTOR);
      return interactive.length === 1 ? interactive[0] : null;
    },
    isUsefulClickedElement(element: HTMLElement, includeContainers: boolean) {
      const tagName = element.tagName.toLowerCase();

      if (['html', 'body'].indexOf(tagName) !== -1) {
        return false;
      }

      if (/^h[1-6]$/.test(tagName)) {
        return true;
      }

      // When too few interactive elements were found, generic containers are
      // allowed as a fallback so the summary card is not left mostly empty.
      if (includeContainers) {
        return true;
      }

      return !(GENERIC_CONTAINER_TAGS.indexOf(tagName) !== -1 && element.children.length);
    },
    getElementKey(element: HTMLElement) {
      const id = element.getAttribute('id');
      if (id) {
        return `${element.tagName.toLowerCase()}#${id}`;
      }

      const name = element.getAttribute('name');
      if (name) {
        return `${element.tagName.toLowerCase()}[name="${name}"]`;
      }

      // No stable attribute: derive a deterministic path from the resolved element
      // itself. The recorded click selector varies by which child node was hit, so
      // keying on it would split repeated clicks on the same element into separate
      // entries; a path built from the element merges them.
      return this.getElementPath(element);
    },
    getElementPath(element: HTMLElement): string {
      const segments: string[] = [];
      let current: HTMLElement|null = element;

      while (current) {
        const tagName = current.tagName.toLowerCase();
        if (tagName === 'body' || tagName === 'html') {
          break;
        }

        const id = current.getAttribute('id');
        if (id) {
          segments.unshift(`${tagName}#${id}`);
          break;
        }

        const parent: HTMLElement|null = current.parentElement;
        if (!parent) {
          segments.unshift(tagName);
          break;
        }

        const sameTag = current.tagName;
        const index = Array.from(parent.children)
          .filter((child: Element) => child.tagName === sameTag)
          .indexOf(current) + 1;
        segments.unshift(`${tagName}:nth-of-type(${index})`);
        current = parent;
      }

      return segments.join('>') || element.tagName.toLowerCase();
    },
    getElementLabel(element: HTMLElement, selector: string) {
      const tagName = element.tagName.toLowerCase();
      const htmlElementType = element.getAttribute('type');
      const rawLabel = [
        this.getElementText(element),
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.getAttribute('alt'),
        element.getAttribute('placeholder'),
        element.getAttribute('name'),
        element.getAttribute('id'),
        htmlElementType === 'button' ? element.getAttribute('value') || '' : '',
        this.getDescendantImageLabel(element),
        selector,
        tagName,
      ].map((value) => (value || '').replace(/\s+/g, ' ').trim())
        .find((value) => !!value) || tagName;
      const label = rawLabel.length > MAX_CLICKED_ELEMENT_LABEL_LENGTH
        ? `${rawLabel.slice(0, MAX_CLICKED_ELEMENT_LABEL_LENGTH - 3)}...`
        : rawLabel;
      const type = this.getElementTypeLabel(element);

      return type
        ? translate('HeatmapSessionRecording_TopClickedElementLabel', label, type)
        : label;
    },
    getElementText(element: HTMLElement) {
      // An interactive element owns all its descendant text (<a><span>Buy
      // now</span></a>), so the full text is its visible label. Containers and
      // headings only use direct text nodes: labelling a nav by the text of its
      // first link would be misleading.
      const text = element.matches(INTERACTIVE_ELEMENTS_SELECTOR)
        ? element.textContent || ''
        : [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent || '')
          .join(' ');

      return text.replace(/\s+/g, ' ').trim();
    },
    // An interactive element whose only content is an image (a thumbnail link,
    // an icon button) carries no text of its own, so the image's alt/title is
    // the natural label. Used as a fallback before the raw selector.
    getDescendantImageLabel(element: HTMLElement) {
      const img = element.querySelector('img');
      if (!img) {
        return '';
      }

      return (img.getAttribute('alt') || img.getAttribute('title') || '')
        .replace(/\s+/g, ' ').trim();
    },
    getElementTypeLabel(element: HTMLElement) {
      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute('role');
      const htmlElementType = element.getAttribute('type');

      // An image, or an interactive element whose only content is an image (a
      // linked thumbnail), reads to a visitor as an image. Calling it a "link"
      // would misdirect them to the separate text link that often sits beside it.
      if (tagName === 'img'
        || (element.matches(INTERACTIVE_ELEMENTS_SELECTOR)
          && !this.getElementText(element)
          && element.querySelector('img'))) {
        return translate('HeatmapSessionRecording_ElementTypeImage');
      }

      if (tagName === 'a' || role === 'link') {
        return translate('HeatmapSessionRecording_ElementTypeLink');
      }

      if (tagName === 'button' || role === 'button' || htmlElementType === 'button') {
        return translate('HeatmapSessionRecording_ElementTypeButton');
      }

      if (/^h[1-6]$/.test(tagName)) {
        return translate('HeatmapSessionRecording_ElementTypeHeading');
      }

      if (['input', 'select', 'textarea'].indexOf(tagName) !== -1) {
        return translate('HeatmapSessionRecording_ElementTypeField');
      }

      const typeKey = STRUCTURAL_TYPE_KEYS[tagName];

      return typeKey ? translate(typeKey) : '';
    },
    formatTopClickedElements(clickedElements: Map<string, TopClickedElement>, totalClicks: number) {
      return [...clickedElements.values()]
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
        .slice(0, MAX_TOP_CLICKED_ELEMENTS)
        .map((element) => {
          const percent = totalClicks
            ? Math.round((element.count / totalClicks) * 100)
            : 0;

          return {
            ...element,
            percent,
            percentLabel: NumberFormatter.formatPercent(percent),
          };
        });
    },
    getScrollReach(rows: ScrollReach[]): ScrollReachBand[] {
      const total = rows.reduce((sum, row) => sum + (parseInt(row.value, 10) || 0), 0);

      // No scroll data: return no bands so the empty state renders (rather than a
      // ladder of 0% rows).
      if (!total) {
        return [];
      }

      // Cumulative reach at 0/25/50/75/100% of the page (row.label is the max
      // scroll depth on a 0-1000 scale). "Top" counts every visit; each following
      // row counts visits that scrolled at least that far; "Bottom" is visits
      // that reached the very end of the page.
      const marks = [
        { key: 'top', mark: 0, label: translate('HeatmapSessionRecording_ScrollReachTop') },
        { key: 'q25', mark: 250, label: NumberFormatter.formatPercent(25) },
        { key: 'q50', mark: 500, label: NumberFormatter.formatPercent(50) },
        { key: 'q75', mark: 750, label: NumberFormatter.formatPercent(75) },
        {
          key: 'bottom',
          mark: SCROLL_REACH_BOTTOM_MARK,
          label: translate('HeatmapSessionRecording_ScrollReachBottom'),
        },
      ];

      return marks.map(({ key, mark, label }) => {
        const reached = rows.reduce(
          (sum, row) => ((parseInt(row.label, 10) || 0) >= mark
            ? sum + (parseInt(row.value, 10) || 0)
            : sum),
          0,
        );
        const percent = Math.round((reached / total) * 100);

        return {
          key,
          label,
          percent,
          percentLabel: NumberFormatter.formatPercent(percent),
        };
      });
    },
    // True while `generation` is still the most recent fetchHeatmap call. The
    // summary-card requests run on their own oneAtATime closures that the primary
    // heatmap request never aborts, so their callbacks use this to drop a stale
    // (superseded) response before it overwrites the card.
    isCurrentFetch(generation: number): boolean {
      return generation === this.fetchGeneration;
    },
    // Applies a background scroll-reach response, ignoring it when a newer fetch
    // has superseded it.
    applyScrollReach(rows: ScrollReach[], generation: number) {
      if (!this.isCurrentFetch(generation)) {
        return;
      }
      this.scrollReach = this.getScrollReach(rows);
    },
    getHeatmapDataPoints(
      rows: ScrollReach[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recordingIframe: any,
    ) {
      const dataPoints: DataPoints = {
        min: 0,
        max: 0,
        data: [],
      };
      let totalValue = 0;
      let numEntriesHigherThan1 = 0;

      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];

        if (row.selector) {
          const value = parseInt(row.value, 10) || 0;
          const dataPoint = recordingIframe.getCoordinatesInFrame(
            row.selector,
            row.offset_x,
            row.offset_y,
            this.offsetAccuracy,
            true,
          ) as DataPoint;

          if (dataPoint) {
            dataPoint.value = row.value;
            dataPoint.selector = row.selector;
            dataPoints.data.push(dataPoint);
            totalValue += value;

            if (value > 1) {
              numEntriesHigherThan1 += 1;
            }
          }
        }
      }

      return {
        dataPoints,
        numEntriesHigherThan1,
        totalValue,
      };
    },
    getTopClickedElements(
      dataPoints: DataPoints,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recordingIframe: any,
      totalClicks: number,
    ) {
      const candidates = this.collectClickCandidates(dataPoints, recordingIframe);

      // Prefer interactive elements (links, buttons, fields...). Only fall back to
      // including generic containers when too few preferred elements were clicked.
      const preferred = new Map(Array.from(candidates.entries())
        .filter(([, candidate]) => candidate.isPreferred));
      const chosen = preferred.size >= MAX_TOP_CLICKED_ELEMENTS ? preferred : candidates;

      return this.rankClickedElements(chosen, dataPoints, totalClicks);
    },
    collectClickCandidates(
      dataPoints: DataPoints,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recordingIframe: any,
    ) {
      const candidates = new Map<string, TopClickedElement & { isPreferred: boolean }>();
      const resolvedCache = new Map<string,
        { key: string; label: string; boundingRectangle: DOMRect; isPreferred: boolean }|null>();

      // Single pass: resolve each clicked selector once (DOM lookups are the
      // expensive part) and tally selector-based counts per resolved element.
      dataPoints.data.forEach((dp) => {
        const value = parseInt(dp.value, 10) || 0;
        if (!dp.selector || !value) {
          return;
        }

        let resolved = resolvedCache.get(dp.selector);
        if (!resolvedCache.has(dp.selector)) {
          resolved = this.resolveClickedElement(recordingIframe, dp.selector);
          resolvedCache.set(dp.selector, resolved);
        }

        if (!resolved) {
          return;
        }

        const existing = candidates.get(resolved.key);
        if (existing) {
          existing.count += value;
        } else {
          candidates.set(resolved.key, {
            ...resolved,
            count: value,
            percent: 0,
            percentLabel: NumberFormatter.formatPercent(0),
          });
        }
      });

      return candidates;
    },
    rankClickedElements(
      clickedElements: Map<string, TopClickedElement>,
      dataPoints: DataPoints,
      totalClicks: number,
    ) {
      // Keep the top candidates. Capture their selector-based counts, then clear
      // them so the geometric pass below can re-tally clicks by bounding box (to
      // match the heatmap tooltip, which aggregates clicks landing in an element).
      const reducedClickedElements = new Map(Array.from(clickedElements.entries())
        .sort(
          (a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label),
        ).slice(0, MAX_TRACKED_CLICK_ELEMENTS));

      const selectorCounts = new Map<string, number>();
      reducedClickedElements.forEach((element, key) => {
        selectorCounts.set(key, element.count);
        element.count = 0;
      });

      // Attribute each click to exactly one candidate: the smallest one whose
      // bounding box contains it. Candidates can nest (a link inside a nav kept
      // by the container fallback), and crediting every containing box would
      // inflate a container's count with its children's clicks.
      const rankedCandidates = Array.from(reducedClickedElements.values());
      const boxArea = (element: TopClickedElement) => (
        (element.boundingRectangle.right - element.boundingRectangle.left)
        * (element.boundingRectangle.bottom - element.boundingRectangle.top)
      );
      dataPoints.data.forEach((dp) => {
        const containing = rankedCandidates.filter(
          (element) => dp?.x >= element.boundingRectangle.left
            && dp?.x <= element.boundingRectangle.right
            && dp?.y >= element.boundingRectangle.top
            && dp?.y <= element.boundingRectangle.bottom,
        );

        if (!containing.length) {
          return;
        }

        const target = containing.reduce(
          (smallest, element) => (boxArea(element) < boxArea(smallest) ? element : smallest),
        );
        target.count += parseInt(dp.value, 10) || 0;
      });

      // If the geometric pass attributed no clicks to an element (e.g. a recorded
      // offset that lands just outside a small element's box), fall back to its
      // selector-based count so a genuinely clicked element is not dropped.
      reducedClickedElements.forEach((element, key) => {
        if (!element.count) {
          element.count = selectorCounts.get(key) || 0;
        }
      });

      return this.formatTopClickedElements(
        new Map(Array.from(reducedClickedElements.entries())
          .sort(
            (a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label),
          ).slice(0, MAX_TOP_CLICKED_ELEMENTS)),
        totalClicks,
      );
    },
    removeScrollHeatmap() {
      const element = this.$refs.iframeRecordingContainer as HTMLElement;
      $(element).find('.scrollHeatmapLeaf').remove();
    },
    proxyImageUrl(originalUrl: string, nonce: string) {
      const query = MatomoUrl.stringify({
        module: 'HeatmapSessionRecording',
        action: 'getProxiedImage',
        idSite: Matomo.idSite,
        idSiteHsr: this.idSiteHsr,
        url: originalUrl,
        nonce,
      });

      // Resolve against the parent (Matomo) page so the URL is absolute and points at the Matomo
      // origin. A relative `?...` would resolve against the iframe's base (the recorded site).
      return new URL(`?${query}`, window.location.href).href;
    },
    isCrossOriginUrl(url: string) {
      if (!url || url.startsWith('data:')) {
        return false;
      }
      try {
        return new URL(url).origin !== window.location.origin;
      } catch (e) {
        return false;
      }
    },
    extractCrossOriginBackgroundUrls(background: string) {
      const urls: string[] = [];
      const regex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
      let match = regex.exec(background);
      while (match !== null) {
        if (this.isCrossOriginUrl(match[1])) {
          urls.push(match[1]);
        }
        match = regex.exec(background);
      }
      return urls;
    },
    proxyCssBackground(background: string, nonce: string, confirmedUrls: Set<string>) {
      return background.replace(
        /url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
        (match: string, url: string) => (
          this.isCrossOriginUrl(url) && confirmedUrls.has(url)
            ? `url("${this.proxyImageUrl(url, nonce)}")` : match
        ),
      );
    },
    async exportToImage() {
      if (!this.hasAdminAccess) {
        return;
      }

      this.isExporting = true;
      NotificationsStore.remove('hsrExportImage');

      const originalSrcs: { img: HTMLImageElement; src: string; srcset: string }[] = [];
      const originalBackgrounds: { el: HTMLElement; background: string }[] = [];
      const domRestores: Array<() => void> = [];
      let originalIframeCss: string | null = null;
      const heatmapContainer = this.$refs.heatmapContainer as HTMLElement;
      const previousZIndex = heatmapContainer.style.zIndex;
      const foldLine = this.$refs.aboveFoldLine as HTMLElement;
      const previousFoldZIndex = foldLine.style.zIndex;

      try {
        const iframe = this.$refs.recordingPlayer as HTMLIFrameElement;
        const doc = iframe.contentDocument;
        if (!doc) {
          return;
        }

        const nonce = this.imageProxyNonce;

        // Keep the dot overlay, then the fold line, above the recorded page during capture.
        heatmapContainer.style.zIndex = '2147483646';
        foldLine.style.zIndex = '2147483647';

        doc.querySelectorAll('svg').forEach((svg) => {
          if (!svg.hasAttribute('xmlns:xlink')) {
            domRestores.push(() => svg.removeAttribute('xmlns:xlink'));
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
          }
        });

        // Route cross-origin <img> sources through the proxy so the capture isn't tainted, but
        // only for images that actually rendered in the iframe. naturalWidth is 0 when the image
        // was blocked by CSP, 404'd or otherwise failed, in which case there is nothing to proxy.
        doc.querySelectorAll('img').forEach((img) => {
          if (!(img.complete && img.naturalWidth > 0)) {
            return;
          }
          const rendered = img.currentSrc || img.src;
          if (this.isCrossOriginUrl(rendered)) {
            originalSrcs.push({ img, src: img.src, srcset: img.srcset });
            img.src = this.proxyImageUrl(rendered, nonce);
            img.srcset = '';
          } else if (rendered !== img.src) {
            originalSrcs.push({ img, src: img.src, srcset: img.srcset });
            img.src = rendered;
            img.srcset = '';
          }
        });

        // Same for cross-origin CSS background images, via an inline override we restore later.
        // A background has no naturalWidth to inspect, so probe each candidate url with
        // img.decode() and only proxy the ones that actually rendered. Anything we can't confirm
        // loaded is left untouched.
        const view = doc.defaultView || window;
        const backgroundCandidates: { el: HTMLElement; background: string }[] = [];
        const candidateUrls = new Set<string>();
        doc.querySelectorAll<HTMLElement>('*').forEach((el) => {
          const background = view.getComputedStyle(el).backgroundImage;
          if (!background || !background.includes('url(')) {
            return;
          }
          const urls = this.extractCrossOriginBackgroundUrls(background);
          if (!urls.length) {
            return;
          }
          backgroundCandidates.push({ el, background });
          urls.forEach((url) => candidateUrls.add(url));
        });

        const confirmedUrls = new Set<string>();
        await Promise.all([...candidateUrls].map(async (url) => {
          if (await backgroundRenders(url, doc)) {
            confirmedUrls.add(url);
          }
        }));

        backgroundCandidates.forEach(({ el, background }) => {
          const proxied = this.proxyCssBackground(background, nonce, confirmedUrls);
          if (proxied !== background) {
            originalBackgrounds.push({ el, background: el.style.backgroundImage });
            el.style.backgroundImage = proxied;
          }
        });

        // html-to-image copies the <iframe> element's own computed style onto the cloned page
        // <body>, dropping the recorded page's <html>/<body> background. Mirror the page's
        // effective background (the <html>'s, else the <body>'s, per CSS canvas propagation) onto
        // the iframe, proxying any cross-origin image, so it survives the capture.
        const htmlStyle = view.getComputedStyle(doc.documentElement);
        const bodyStyle = view.getComputedStyle(doc.body);
        const isOpaque = (color: string) => !!color && color !== 'transparent'
          && color !== 'rgba(0, 0, 0, 0)';
        const pageStyle = htmlStyle.backgroundImage !== 'none'
          || isOpaque(htmlStyle.backgroundColor)
          ? htmlStyle : bodyStyle;
        originalIframeCss = iframe.style.cssText;
        ['background-color', 'background-position', 'background-size', 'background-repeat',
          'background-origin', 'background-clip', 'background-attachment'].forEach((prop) => {
          iframe.style.setProperty(prop, pageStyle.getPropertyValue(prop));
        });
        iframe.style.backgroundImage = this.proxyCssBackground(
          pageStyle.getPropertyValue('background-image'), nonce, confirmedUrls,
        );

        const container = this.$refs.iframeRecordingContainer as HTMLElement;
        const width = iframe.offsetWidth;
        const height = container.offsetHeight;

        const bodyRect = doc.body.getBoundingClientRect();
        iframe.style.marginLeft = `${bodyRect.left + view.scrollX
          + parseFloat(bodyStyle.borderLeftWidth) + parseFloat(bodyStyle.paddingLeft)}px`;
        iframe.style.marginTop = `${bodyRect.top + view.scrollY
          + parseFloat(bodyStyle.borderTopWidth) + parseFloat(bodyStyle.paddingTop)}px`;

        const dataUrl = await toPng(container, {
          width,
          height,
          backgroundColor: isOpaque(pageStyle.backgroundColor)
            ? pageStyle.backgroundColor : '#ffffff',
          pixelRatio: 1,
          cacheBust: true,
          includeQueryParams: true,
          onImageErrorHandler: () => undefined,
          style: { transform: 'none' },
        });

        const heatmapTypeName = (this.heatmapTypes as HeatmapType[])
          .find((type) => type.key === this.heatmapType)?.name || '';
        const deviceTypeName = (this.deviceTypes as DeviceType[])
          .find((device) => device.key === this.deviceType)?.name || '';
        const fileName = [
          this.createdDateRaw.slice(0, 10),
          'Heatmap',
          this.heatmapName,
          heatmapTypeName,
          deviceTypeName,
          `${this.iframeWidth}px`,
        ]
          .join(' ')
          .replace(/[\\/:*?"<>|]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export heatmap image', err);
        NotificationsStore.show({
          message: translate('HeatmapSessionRecording_ExportImageError'),
          context: 'error',
          id: 'hsrExportImage',
          type: 'transient',
        });
      } finally {
        // Restore the recorded page so the live view is unchanged and reruns start clean.
        originalSrcs.forEach(({ img, src, srcset }) => {
          img.src = src;
          img.srcset = srcset;
        });
        originalBackgrounds.forEach(({ el, background }) => {
          el.style.backgroundImage = background;
        });
        domRestores.forEach((restore) => restore());
        if (originalIframeCss !== null) {
          (this.$refs.recordingPlayer as HTMLIFrameElement).style.cssText = originalIframeCss;
        }
        heatmapContainer.style.zIndex = previousZIndex;
        foldLine.style.zIndex = previousFoldZIndex;
        this.isExporting = false;
      }
    },
    // Fetch only the sample metadata (recordings count + device split) for the summary
    // card in empty states, where there is no DOM to derive clicks/scroll reach from.
    fetchSummaryMetadata() {
      this.fetchGeneration += 1;
      const generation = this.fetchGeneration;

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

      this.getRecordedHeatmapMetadata(requestParams).then((numSamples) => {
        if (generation !== this.fetchGeneration) {
          return;
        }

        if (Array.isArray(numSamples) && numSamples[0]) {
          [this.actualNumSamples] = numSamples as unknown as HeatmapMetadata[];
        } else {
          this.actualNumSamples = numSamples as unknown as HeatmapMetadata;
        }
      });
    },
    fetchHeatmap() {
      // No snapshot means there is no iframe to load; skip the main fetch (which awaits the
      // iframe load event) so the report doesn't hang on the loading state. The summary card's
      // recordings count/device split still come from sample metadata, so fetch just that.
      if (!this.hasSnapshot) {
        this.isLoading = false;
        this.fetchSummaryMetadata();
        return;
      }

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
      this.summaryAvgFold = 0;
      this.dataCoordinates = [];
      this.totalClicks = 0;
      this.topClickedElements = [];
      this.scrollReach = [];

      // Each fetch gets a monotonic id. The primary heatmap request is abort-managed
      // by its oneAtATime closure, but the summary-card requests below run on
      // separate closures that the primary path never aborts, so a slow request from
      // a previous view/device/period can resolve late. Guarding every async
      // assignment on this id ensures only the latest fetch's results are applied.
      this.fetchGeneration += 1;
      const generation = this.fetchGeneration;

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
          // scroll; the primary data already contains the scroll reaches, so the
          // summary card can be populated without an extra request.
          this.scrollReach = this.getScrollReach(rows as ScrollReach[]);
          scrollHeatmap(
            this.$refs.iframeRecordingContainer as HTMLElement,
            iframeElement,
            recordingIframe,
            rows as ScrollReach[],
          );
        } else {
          const heatmapData = this.getHeatmapDataPoints(rows, recordingIframe);
          const { dataPoints } = heatmapData;

          this.dataCoordinates = dataPoints.data;
          this.totalClicks = heatmapData.totalValue;

          if (this.heatmapType === 2) {
            // click; the primary data already contains the clicks, so the
            // summary card can be populated without an extra request.
            this.topClickedElements = this.getTopClickedElements(
              heatmapData.dataPoints,
              recordingIframe,
              heatmapData.totalValue,
            );

            if (heatmapData.numEntriesHigherThan1 / dataPoints.data.length >= 0.10
              && dataPoints.data.length > 120
            ) {
              // if at least 10% have .value >= 2, then we set max to 2 to differentiate better
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
        }

        // The iframe has been resized to the recorded page's full height by
        // now; the scale box needs it to reserve the scaled layout footprint.
        this.recordingHeight = (recordingIframe.getIframeHeight() as number) || 0;

        // Average fold applies to every heatmap type (including scroll), so the
        // summary-card value is computed after the type-specific rendering above.
        let foldLinePosition = 0;
        if (this.actualNumSamples?.[`avg_fold_device_${this.deviceType}`]) {
          const avgFoldPercent = this.actualNumSamples[`avg_fold_device_${this.deviceType}`];
          const height = recordingIframe.getIframeHeight() as number;

          if (height) {
            this.summaryAvgFold = parseInt(`${(avgFoldPercent / 100) * height}`, 10);

            // Only draw the line when the fold is meaningfully above the page
            // end. Pages fully visible in the visitor's viewport track a fold
            // just short of 100% (the tracker's document height is padded by
            // body margins/scrollbars), and a line hugging the bottom edge
            // marks nothing. The summary card keeps the px value regardless.
            if (avgFoldPercent < FOLD_LINE_MAX_PERCENT) {
              foldLinePosition = this.summaryAvgFold;
            }
          }
        }

        // The fold line is drawn over the click and move heatmap overlays (as
        // before), but not the scroll view, where the scroll visualization already
        // conveys reach. summaryAvgFold is computed for every type above so the
        // summary card's "Avg. fold" label can still show on the scroll view.
        this.avgFold = this.isScrollHeatmapType ? 0 : foldLinePosition;
      }).finally(() => {
        this.isLoading = false;
      });

      if (this.heatmapType !== 2) {
        // For non-click heatmaps the summary card needs a separate click dataset.
        // Fetch it independently of the primary render so a slow or failed request
        // never delays or blocks the main visualization; on failure the card just
        // stays empty.
        Promise.all([
          this.getRecordedClickHeatmap({
            ...requestParams,
            heatmapType: 2,
          }),
          this.iframeLoadedPromise,
        ]).then((response) => {
          if (!this.isCurrentFetch(generation)) {
            // A newer fetch superseded this one; ignore its stale click data.
            return;
          }
          const recordingIframe = this.getRecordingIframe(
            this.$refs.recordingPlayer as HTMLIFrameElement,
          );
          const clickHeatmapData = this.getHeatmapDataPoints(
            response[0] as ScrollReach[],
            recordingIframe,
          );
          this.topClickedElements = this.getTopClickedElements(
            clickHeatmapData.dataPoints,
            recordingIframe,
            clickHeatmapData.totalValue,
          );
        }).catch(() => {
          if (this.isCurrentFetch(generation)) {
            this.topClickedElements = [];
          }
        });
      }

      if (this.heatmapType !== 3) {
        // For non-scroll heatmaps the summary card needs a separate scroll
        // dataset. Fetch it independently (pure aggregation, no iframe needed) so
        // a slow or failed request never blocks the main visualization; on failure
        // the scroll-reach section just stays empty.
        this.getRecordedScrollHeatmap({
          ...requestParams,
          heatmapType: 3,
        }).then((rows) => {
          this.applyScrollReach(rows as ScrollReach[], generation);
        }).catch(() => {
          if (this.isCurrentFetch(generation)) {
            this.scrollReach = [];
          }
        });
      }
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
      this.updatePreviewScale();
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
      // Client rects are in scaled (on-screen) pixels while the iframe's
      // document works in its own unscaled coordinates, so the offset must be
      // divided back up by the preview scale.
      const rect = targetElement.getBoundingClientRect();
      return frameRef.elementFromPoint(
        (event.clientX - rect.left) / this.previewScale,
        (event.clientY - rect.top) / this.previewScale,
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
    totalRecordings() {
      return this.getDeviceSamples(this.deviceType);
    },
    selectedDeviceTypeName() {
      const selected = (this.deviceTypes as DeviceType[])
        .find((device) => device.key === this.deviceType);

      return selected ? selected.name : '';
    },
    // The frame's height must not follow the preview's scale (Product: the
    // card shrinking as the window narrows or a large width is selected is
    // wrong; only the content inside should scale). It tracks the recording's
    // *unscaled* height — which is independent of the window width — capped
    // by the viewport fit; a scaled preview shorter than the frame letterboxes
    // at the bottom instead of collapsing the frame.
    scrollAreaStyle(): Record<string, string> | undefined {
      if (!this.scrollAreaMaxHeight) {
        return undefined;
      }

      if (this.recordingHeight) {
        // Floored at the summary card's height: once the frame is shorter
        // than the card beside it, shrinking further cannot raise the
        // report's bottom edge (the row is already card-tall) and only opens
        // a gap between the frame and the content below the row.
        const height = Math.max(
          Math.min(this.scrollAreaMaxHeight, this.recordingHeight),
          this.summaryCardHeight,
        );

        const style: Record<string, string> = { height: `${height}px` };

        if (!this.frameNeedsVScroll) {
          // The scaled preview fits the frame: vertical scrolling is
          // impossible, so drop the scrollbar and its reserved gutter
          // entirely (updatePreviewScale owns this decision).
          style['overflow-y'] = 'hidden';
        }

        return style;
      }

      // Recording height unknown (still loading): cap only.
      return { maxHeight: `${this.scrollAreaMaxHeight}px` };
    },
    // Outer box reserving the preview's *scaled* layout footprint (transforms
    // don't affect layout), so a fitted preview neither shows a horizontal
    // scrollbar nor leaves blank scroll space below itself. Mirrors the
    // replay player's sized-box + scaled-inner pattern.
    scaleBoxStyle(): Record<string, string> {
      const style: Record<string, string> = {
        width: `${Math.round(this.previewScale * this.iframeWidth)}px`,
      };

      if (this.previewScale < 1 && this.recordingHeight) {
        style.height = `${Math.round(this.previewScale * this.recordingHeight)}px`;
      }

      return style;
    },
    containerStyle(): Record<string, string> {
      const style: Record<string, string> = {
        width: `${this.iframeWidth}px`,
        // Read by the fold pill's counter-scale so its label stays readable.
        '--preview-scale': `${this.previewScale}`,
      };

      if (this.previewScale < 1) {
        style.transform = `scale(${this.previewScale})`;
        style['transform-origin'] = '0 0';
      }

      return style;
    },
    // Share of all recorded samples per device type, for the stacked bar and its
    // legend. Empty only when nothing was recorded on any device, which is also
    // what switches the template to the "waiting for first recording" state
    // (the split still shows when only the selected device has no recordings).
    // Devices with zero samples keep their legend entry (with 0%); their bar
    // segment just has no width. Bar widths use the exact share so the segments
    // always fill the bar; only the legend label is rounded.
    deviceBreakdown() {
      const devices = this.deviceTypes as DeviceType[];
      const counts = devices.map((device) => this.getDeviceSamples(device.key));
      const total = counts.reduce((sum, count) => sum + count, 0);

      if (!total) {
        return [];
      }

      return devices.map((device, index) => {
        const percent = (counts[index] / total) * 100;

        return {
          key: device.key,
          name: device.name,
          percent,
          percentLabel: NumberFormatter.formatPercent(Math.round(percent)),
        };
      });
    },
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
    deviceTypesWithResolution() {
      const resolutions: Record<number, number> = {
        [deviceDesktop]: this.desktopPreviewSize,
        [deviceTablet]: this.breakpointTablet || 960,
        [deviceMobile]: this.breakpointMobile || 600,
      };

      return (this.deviceTypes as DeviceType[]).map((deviceType) => ({
        ...deviceType,
        resolution: resolutions[deviceType.key],
      }));
    },
    hasAdminAccess() {
      return !!Matomo?.heatmapAdminAccess;
    },
    // Which empty state to render when no snapshot exists. A deleted snapshot (tracked via
    // screenshot_deleted_date) is distinguished from one that was never captured; once deleted,
    // the retake instructions depend on whether the heatmap still records and on its capture mode.
    emptyStateKey() {
      if (!this.snapshotDeleted) {
        return 'noInteractions';
      }

      if (!this.isActive) {
        // Paused heatmaps can be resumed (capture continues then); ended ones cannot.
        return this.isPaused ? 'deletedPaused' : 'deletedNoRetake';
      }

      return this.captureManually ? 'deletedManual' : 'deletedAuto';
    },
    showSummaryCard() {
      // Always show the recordings summary (count + device split); it comes from
      // sample metadata, which exists even in empty/deleted states without a DOM.
      return true;
    },
    gradientImgData() {
      return generateGradientImgData();
    },
  },
});
</script>
