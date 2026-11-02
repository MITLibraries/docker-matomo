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
  <div class="sessionRecordingVis">
    <div class="sessionRecordingVis__main" ref="playerMain">
      <div class="sessionRecordingVis__controls" ref="playerControls">
        <div class="sessionRecordingVis__transport">
          <div class="sessionRecordingVis__transportPlayback">
            <button
              type="button"
              class="sessionRecordingVis__action sessionRecordingVis__action--skipPrevious"
              :disabled="!previousRecordingId"
              :title="skipPreviousButtonTitle"
              :aria-label="skipPreviousButtonTitle"
              @click="loadNewRecording(previousRecordingId)"
            >
              <svg
                class="sessionRecordingVis__actionIcon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 6h2v12H6zm12 0v12L9.5 12z" />
              </svg>
            </button>
            <button
              type="button"
              class="sessionRecordingVis__action"
              :title="rewindFastTitle"
              :aria-label="rewindFastTitle"
              @click="jumpRelative(10, false)"
            >
              <svg
                class="sessionRecordingVis__actionIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M11 8 7 12l4 4" />
                <path d="M17 8l-4 4 4 4" />
              </svg>
            </button>
            <button
              type="button"
              class="sessionRecordingVis__action sessionRecordingVis__action--primary"
              :title="playPauseTitle"
              :aria-label="playPauseTitle"
              @click="togglePlay()"
            >
              <svg
                class="sessionRecordingVis__actionIcon sessionRecordingVis__actionIcon--small"
                v-if="playPauseIcon === 'replay'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <svg
                class="sessionRecordingVis__actionIcon sessionRecordingVis__actionIcon--small"
                v-else-if="playPauseIcon === 'pause'"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
              <svg
                class="sessionRecordingVis__actionIcon sessionRecordingVis__actionIcon--small"
                v-else
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              type="button"
              class="sessionRecordingVis__action"
              :title="forwardFastTitle"
              :aria-label="forwardFastTitle"
              @click="jumpRelative(10, true)"
            >
              <svg
                class="sessionRecordingVis__actionIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M13 8l4 4-4 4" />
                <path d="M7 8l4 4-4 4" />
              </svg>
            </button>
            <button
              type="button"
              class="sessionRecordingVis__action sessionRecordingVis__action--skipNext"
              :disabled="!nextRecordingId"
              :title="skipNextButtonTitle"
              :aria-label="skipNextButtonTitle"
              @click="loadNewRecording(nextRecordingId)"
            >
              <svg
                class="sessionRecordingVis__actionIcon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16 6h2v12h-2zM6 6v12l8.5-6z" />
              </svg>
            </button>
            <span class="sessionRecordingVis__duration">
              {{ translate(
                'HeatmapSessionRecording_PlayerDurationXofY', positionPretty, durationPretty) }}
            </span>
          </div>
          <div class="sessionRecordingVis__transportOptions">
            <button
              type="button"
              class="sessionRecordingVis__toggle"
              :class="{'sessionRecordingVis__toggle--active': actualSkipPausesEnabled}"
              :aria-pressed="actualSkipPausesEnabled ? 'true' : 'false'"
              :title="skipPausesTitle"
              :aria-label="skipPausesTitle"
              @click="toggleSkipPauses()"
            >
              <span
                class="sessionRecordingVis__toggleSwitch"
                :class="{'sessionRecordingVis__toggleSwitch--on': actualSkipPausesEnabled}"
                aria-hidden="true"
              />
              <span class="sessionRecordingVis__toggleLabel">{{
                translate('HeatmapSessionRecording_PlayerSkipPausesLabel') }}</span>
            </button>
            <button
              type="button"
              class="sessionRecordingVis__toggle"
              :class="{'sessionRecordingVis__toggle--active': actualAutoPlayEnabled}"
              :aria-pressed="actualAutoPlayEnabled ? 'true' : 'false'"
              :title="autoPlayTitle"
              :aria-label="autoPlayTitle"
              @click="toggleAutoPlay()"
            >
              <span
                class="sessionRecordingVis__toggleSwitch"
                :class="{'sessionRecordingVis__toggleSwitch--on': actualAutoPlayEnabled}"
                aria-hidden="true"
              />
              <span class="sessionRecordingVis__toggleLabel">{{
                translate('HeatmapSessionRecording_PlayerAutoPlayLabel') }}</span>
            </button>
            <!-- No dynamic :class on this element: v-expand-on-click adds `expanded` to it
                 directly, and a Vue class patch here would drop it again. -->
            <span
              class="sessionRecordingVis__speed"
              ref="playerSpeed"
              v-expand-on-click="{
                expander: 'playerSpeedExpander',
                onExpand: () => { isSpeedMenuOpen = true; },
                onClosed: () => { isSpeedMenuOpen = false; },
              }"
            >
              <button
                ref="playerSpeedExpander"
                type="button"
                class="sessionRecordingVis__speedButton"
                aria-haspopup="true"
                :aria-expanded="isSpeedMenuOpen ? 'true' : 'false'"
                :title="changeReplaySpeedTitle"
                :aria-label="changeReplaySpeedTitle"
              >
                {{ replaySpeedLabel }}
                <svg
                  class="sessionRecordingVis__speedChevron"
                  :class="{'sessionRecordingVis__speedChevron--expanded': isSpeedMenuOpen}"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <ul
                class="sessionRecordingVis__speedMenu"
                :class="{'sessionRecordingVis__speedMenu--expanded': isSpeedMenuOpen}"
              >
                <li
                  class="sessionRecordingVis__speedItem"
                  v-for="speed in replaySpeedOptions"
                  :key="speed"
                >
                  <button
                    type="button"
                    class="sessionRecordingVis__speedOption"
                    :class="{
                      'sessionRecordingVis__speedOption--active': speed === actualReplaySpeed,
                    }"
                    :aria-pressed="speed === actualReplaySpeed ? 'true' : 'false'"
                    @click="selectReplaySpeed(speed)"
                  >{{ translate('HeatmapSessionRecording_PlayerSpeedX', `${speed}`) }}</button>
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div class="sessionRecordingVis__progress">
          <div
            class="sessionRecordingVis__timeline"
            @click="seekEvent($event)"
          >
            <div class="sessionRecordingVis__timelineTrack">
              <div
                class="sessionRecordingVis__timelineFill"
                :style="{width: `${progress}%`}"
              />
              <div
                :title="clue.title"
                :class="[
                  'sessionRecordingVis__marker',
                  `sessionRecordingVis__marker--${clue.type}`,
                ]"
                :style="{left: `${clue.left}%`}"
                v-for="(clue, index) in clues"
                :key="index"
              />
            </div>
          </div>
          <ul class="sessionRecordingVis__legend">
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--click" />
              {{ translate('HeatmapSessionRecording_ActivityClick') }}
            </li>
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--move" />
              {{ translate('HeatmapSessionRecording_ActivityMove') }}
            </li>
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--scroll" />
              {{ translate('HeatmapSessionRecording_ActivityScroll') }}
            </li>
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--resize" />
              {{ translate('HeatmapSessionRecording_ActivityResize') }}
            </li>
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--form" />
              {{ translate('HeatmapSessionRecording_ActivityFormChange') }}
            </li>
            <li class="sessionRecordingVis__legendItem">
              <span class="sessionRecordingVis__swatch sessionRecordingVis__swatch--mutation" />
              {{ translate('HeatmapSessionRecording_ActivityPageChange') }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="sessionRecordingVis__stage"
        ref="replayStage"
        @click="togglePlay()"
        :style="{height: `${replayHeight}px`}"
      >
        <div
          class="sessionRecordingVis__stageInner"
          style="transform-origin: 0 0;"
          :style="{transform: `scale(${replayScale})`, 'margin-left': `${replayMarginLeft}px`}"
        >
          <iframe
            class="sessionRecordingVis__frame"
            id="recordingPlayer"
            ref="recordingPlayer"
            @load="onLoaded()"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
            referrerpolicy="no-referrer"
            :src="embedUrl"
            v-if="embedUrl"
            :width="recording.viewport_w_px"
            :height="recording.viewport_h_px"
          />
        </div>
        <div
          class="sessionRecordingVis__loading"
          v-show="isLoading"
        >
          <div
            class="hsrLoadingOuter"
            style="width: 100%; height: 100%;"
          >
            <div class="loadingUnderlay" />
            <div class="valign-wrapper loadingInner">
              <div class="loadingContent">{{ translate('General_Loading') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sessionRecordingVis__meta">
      <RecordingMetadata
        :recording="recording"
        :visitor-profile-enabled="!!recording.visitorProfileEnabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  translate,
  AjaxHelper,
  MatomoUrl,
  ExpandOnClick,
} from 'CoreHome';
import { SessionRecordingData, SessionRecordingEvent } from '../types';
import getIframeWindow from '../getIframeWindow';
import { seekPercentage } from './seekPosition';
import RecordingMetadata from './RecordingMetadata.vue';

const FRAME_STEP = 20;
const REPLAY_SPEEDS = [1, 2, 4, 6];
// Mirrors .sessionRecording's padding in stylesheets/recordings.less.
const PAGE_PADDING = 16;
const EVENT_TYPE_MOVEMENT = 1;
const EVENT_TYPE_CLICK = 2;
const EVENT_TYPE_SCROLL = 3;
const EVENT_TYPE_RESIZE = 4;
const EVENT_TYPE_INITIAL_DOM = 5;
const EVENT_TYPE_MUTATION = 6;
const EVENT_TYPE_FORM_TEXT = 9;
const EVENT_TYPE_FORM_VALUE = 10;
const EVENT_TYPE_SCROLL_ELEMENT = 12;

const EVENT_TYPE_TO_NAME: Record<number, string> = {
  [EVENT_TYPE_CLICK]: 'click',
  [EVENT_TYPE_MOVEMENT]: 'move',
  [EVENT_TYPE_SCROLL]: 'scroll',
  [EVENT_TYPE_SCROLL_ELEMENT]: 'scroll',
  [EVENT_TYPE_RESIZE]: 'resize',
  [EVENT_TYPE_FORM_TEXT]: 'form',
  [EVENT_TYPE_FORM_VALUE]: 'form',
  [EVENT_TYPE_INITIAL_DOM]: 'mutation',
  [EVENT_TYPE_MUTATION]: 'mutation',
};

const EVENT_TYPE_TO_TITLE: Record<number, string> = {
  [EVENT_TYPE_CLICK]: translate('HeatmapSessionRecording_ActivityClick'),
  [EVENT_TYPE_MOVEMENT]: translate('HeatmapSessionRecording_ActivityMove'),
  [EVENT_TYPE_SCROLL]: translate('HeatmapSessionRecording_ActivityScroll'),
  [EVENT_TYPE_SCROLL_ELEMENT]: translate('HeatmapSessionRecording_ActivityScroll'),
  [EVENT_TYPE_RESIZE]: translate('HeatmapSessionRecording_ActivityResize'),
  [EVENT_TYPE_FORM_TEXT]: translate('HeatmapSessionRecording_ActivityFormChange'),
  [EVENT_TYPE_FORM_VALUE]: translate('HeatmapSessionRecording_ActivityFormChange'),
  [EVENT_TYPE_INITIAL_DOM]: translate('HeatmapSessionRecording_ActivityPageChange'),
  [EVENT_TYPE_MUTATION]: translate('HeatmapSessionRecording_ActivityPageChange'),
};

const MOUSE_POINTER_HTML = `
<div class="mousePointer" style="width: 16px;height: 16px;position: absolute;z-index: 99999999;">
    <svg enable-background="new 0 0 24 24" fill="black" stroke="white" version="1.0"
        viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2"/>
    </svg>
</div>
`;

interface RecordingClue {
  left: string;
  type: string;
  title: string;
}

interface Point {
  x: number;
  y: number;
}

interface SessionRecordingVisState {
  isPlaying: boolean;
  progress: number;
  isFinished: boolean;
  isLoading: boolean;
  seekTimeout: number|null;
  lastFramePainted: number;
  recording: SessionRecordingData;
  positionPretty: string;
  previousRecordingId: null|string|number;
  previousRecordingInfo: string|null;
  nextRecordingId: string|number|null;
  nextRecordingInfo: string|null;
  frame: number;
  hasFoundPrevious: boolean;
  hasFoundNext: boolean;
  videoPlayerInterval: null|number;
  lastCanvasCoordinates: false|Point;
  actualAutoPlayEnabled: boolean;
  replayWidth: number;
  replayHeight: number;
  replayScale: number;
  replayMarginLeft: number;
  seek: (seekToFrame: number) => void;
  actualSkipPausesEnabled: boolean;
  actualReplaySpeed: number;
  isSpeedMenuOpen: boolean;
  resizeObserver: ResizeObserver|null;
  resizeRafHandle: number|null;
}

const { $, piwikHelper } = window;

function intVal(v: string|number) {
  return typeof v === 'number' ? v : parseInt(v, 10);
}

function isButtonTarget(target: EventTarget|null): boolean {
  return (target as HTMLElement|null)?.tagName === 'BUTTON';
}

function getEventTypeId(event?: SessionRecordingEvent): number|undefined {
  if (!event?.event_type) {
    return undefined;
  }

  return intVal(event.event_type);
}

function toPrettyTimeFormat(milliseconds: number): string {
  const durationSeconds = Math.floor(milliseconds / 1000);
  let minutes: number|string = Math.floor(durationSeconds / 60);
  let secondsLeft: number|string = durationSeconds % 60;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (secondsLeft < 10) {
    secondsLeft = `0${secondsLeft}`;
  }

  return `${minutes}:${secondsLeft}`;
}

// TODO use something like command pattern and redo actions for each action maybe for more effecient
// and better looking eeking to an earlier position in the video etc: Problem mutations can likely
// not be "undone"
export default defineComponent({
  components: {
    RecordingMetadata,
  },
  directives: {
    ExpandOnClick,
  },
  props: {
    offsetAccuracy: {
      type: Number,
      required: true,
    },
    scrollAccuracy: {
      type: Number,
      required: true,
    },
    autoPlayEnabled: Boolean,
    skipPausesEnabled: Boolean,
    replaySpeed: {
      type: Number,
      default: 1,
    },
  },
  data(): SessionRecordingVisState {
    return {
      isPlaying: false,
      progress: 0,
      isFinished: false,
      isLoading: true,
      seekTimeout: null,
      lastFramePainted: 0,
      recording: JSON.parse(JSON.stringify(window.sessionRecordingData)),
      positionPretty: '00:00',
      previousRecordingId: null,
      previousRecordingInfo: null,
      nextRecordingId: null,
      nextRecordingInfo: null,
      frame: 0,
      hasFoundPrevious: false,
      hasFoundNext: false,
      videoPlayerInterval: null,
      lastCanvasCoordinates: false,
      actualAutoPlayEnabled: !!this.autoPlayEnabled,
      replayWidth: 0,
      replayHeight: 0,
      replayScale: 0,
      replayMarginLeft: 0,
      seek: (seekToFrame: number) => seekToFrame,
      actualSkipPausesEnabled: !!this.skipPausesEnabled,
      actualReplaySpeed: this.replaySpeed,
      isSpeedMenuOpen: false,
      resizeObserver: null,
      resizeRafHandle: null,
    };
  },
  setup() {
    const iframeLoaded = ref(false);
    let iframeLoadedResolve: ((arg: unknown) => void)|null = null;
    const iframeLoadedPromise = new Promise((resolve) => {
      iframeLoadedResolve = resolve;
      iframeLoaded.value = true;
    });

    const onLoaded = () => {
      setTimeout(() => {
        // just to be sure we wait for another 500ms
        iframeLoadedResolve!('loaded');
      }, 500);
    };

    return {
      iframeLoadedPromise,
      onLoaded,
      iframeLoaded,
    };
  },
  created() {
    this.recording.duration = intVal(this.recording.duration);

    this.recording.pageviews.forEach((pageview) => {
      if (!pageview || !pageview.idloghsr) {
        return;
      }

      if (`${pageview.idloghsr}` === `${this.recording.idLogHsr}`) {
        this.hasFoundPrevious = true;
      } else if (!this.hasFoundPrevious) {
        this.previousRecordingId = pageview.idloghsr;
        this.previousRecordingInfo = [
          pageview.label,
          pageview.server_time_pretty,
          pageview.time_on_page_pretty,
        ].join(' - ');
      } else if (!this.hasFoundNext) {
        this.hasFoundNext = true;
        this.nextRecordingId = pageview.idloghsr;
        this.nextRecordingInfo = [
          pageview.label,
          pageview.server_time_pretty,
          pageview.time_on_page_pretty,
        ].join(' - ');
      }
    });
  },
  mounted() {
    // registerShortcut() binds the key and lists it in core's shortcut help modal (the one the
    // "?" key opens), which is what the keyboard shortcuts button reuses.
    const registerShortcut = piwikHelper.registerShortcut.bind(piwikHelper);

    registerShortcut('k', translate('HeatmapSessionRecording_ShortcutPlayPause'), () => {
      this.togglePlay();
    });

    registerShortcut('space', translate('HeatmapSessionRecording_ShortcutPlayPause'), (event) => {
      // Space would otherwise both activate the focused control and toggle playback.
      if (isButtonTarget(event.target)) {
        return;
      }

      this.togglePlay();
    });

    registerShortcut('0', translate('HeatmapSessionRecording_ShortcutReplayFromStart'), () => {
      if (this.isFinished) {
        this.replay();
      }
    });

    registerShortcut('p', translate('HeatmapSessionRecording_ShortcutPreviousPageview'), () => {
      this.loadNewRecording(this.previousRecordingId);
    });

    registerShortcut('n', translate('HeatmapSessionRecording_ShortcutNextPageview'), () => {
      this.loadNewRecording(this.nextRecordingId);
    });

    registerShortcut('s', translate('HeatmapSessionRecording_ShortcutReplaySpeed'), () => {
      this.increaseReplaySpeed();
    });

    registerShortcut('a', translate('HeatmapSessionRecording_ShortcutAutoPlay'), () => {
      this.toggleAutoPlay();
    });

    registerShortcut('b', translate('HeatmapSessionRecording_ShortcutSkipPauses'), () => {
      this.toggleSkipPauses();
    });

    registerShortcut('left', translate('HeatmapSessionRecording_ShortcutRewindShort'), () => {
      const numSeconds = 5;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });

    registerShortcut('right', translate('HeatmapSessionRecording_ShortcutForwardShort'), () => {
      const numSeconds = 5;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });

    registerShortcut('j', translate('HeatmapSessionRecording_ShortcutRewindLong'), () => {
      const numSeconds = 10;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });

    registerShortcut('l', translate('HeatmapSessionRecording_ShortcutForwardLong'), () => {
      const numSeconds = 10;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });

    this.$nextTick(() => {
      this.initViewport();
      this.observePlayerSize();
    });

    $(window).on('resize', () => this.initViewport());

    this.iframeLoadedPromise.then(() => {
      this.updatePageTitleFromIframe();
      this.initPlayer();
    });

    window.addEventListener('beforeunload', () => {
      // should improve reload / go to next page performance
      this.isPlaying = false;

      if (this.videoPlayerInterval) {
        clearInterval(this.videoPlayerInterval);
        this.videoPlayerInterval = null;
      }
    });
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.resizeRafHandle !== null) {
      window.cancelAnimationFrame(this.resizeRafHandle);
      this.resizeRafHandle = null;
    }

    if (this.videoPlayerInterval) {
      clearInterval(this.videoPlayerInterval);
      this.videoPlayerInterval = null;
    }
  },
  methods: {
    updatePageTitleFromIframe() {
      const iframeElement = this.$refs.recordingPlayer as HTMLIFrameElement|undefined;

      if (!iframeElement) {
        return;
      }

      const iframeWindow = getIframeWindow(iframeElement);
      const pageTitle = `${iframeWindow?.document?.title || ''}`.trim();

      this.recording.page_title = pageTitle || null;
    },
    initPlayer() {
      const iframeElement = this.$refs.recordingPlayer as HTMLIFrameElement;
      const recordingIframe = getIframeWindow(iframeElement).recordingFrame;

      if (!recordingIframe || !recordingIframe.isSupportedBrowser()) {
        return;
      }

      recordingIframe.addClass('html', 'piwikSessionRecording');
      recordingIframe.addClass('html', 'matomoSessionRecording');

      let $mousePointerNode: JQuery|null = null;

      const drawMouseLine = (coordinates: Point, color: string) => {
        if ($mousePointerNode) {
          $mousePointerNode.css({
            left: `${coordinates.x - 8}px`,
            top: `${coordinates.y - 8}px`,
          });
        }

        if (!this.lastCanvasCoordinates) {
          return;
        }

        recordingIframe.drawLine(
          this.lastCanvasCoordinates.x,
          this.lastCanvasCoordinates.y,
          coordinates.x,
          coordinates.y,
          color,
        );

        this.lastCanvasCoordinates = coordinates;
      };

      const scrollFrameTo = (xPos: number, yPos: number) => {
        if (!this.lastCanvasCoordinates || !$mousePointerNode) {
          // we cannot move the mouse pointer since we do not have the initial mouse position yet
          // only perform scroll action instead
          recordingIframe.scrollTo(xPos, yPos);
          return;
        }

        // we only move the mouse pointer but not draw a line for the mouse movement eg when user
        // scrolls we also make sure that when the next time the user moves the mouse the mouse
        // move line will be drawn from this new position

        const currentScrollTop = recordingIframe.getScrollTop();
        const currentScrollLeft = recordingIframe.getScrollLeft();
        recordingIframe.scrollTo(xPos, yPos);

        // we detect how far down or up user scrolled (or to the left or right)
        const diffScrollTop = yPos - currentScrollTop;
        const diffScrollLeft = xPos - currentScrollLeft;

        // if user scrolled eg 100px down, we also need to move the cursor down
        let newMousePointerPosLeft = diffScrollLeft + this.lastCanvasCoordinates.x;
        let newMousePointerPosTop = diffScrollTop + this.lastCanvasCoordinates.y;

        if (newMousePointerPosLeft <= 0) {
          newMousePointerPosLeft = 0;
        }

        if (newMousePointerPosTop <= 0) {
          newMousePointerPosTop = 0;
        }

        // we make sure to draw the next mouse move line  from this position. we use a blue line
        // to indicate the mouse was moved by a scroll
        drawMouseLine({
          x: newMousePointerPosLeft,
          y: newMousePointerPosTop,
        }, 'blue');
      };

      const scrollElementTo = (element: HTMLElement, xPos: number, yPos: number) => {
        if (element?.scrollTo) {
          element.scrollTo(xPos, yPos);
        } else {
          element.scrollLeft = xPos;
          element.scrollTop = yPos;
        }
      };

      let moveMouseTo: null|((coordinates: Point) => void) = null;

      const replayEvent = (event: SessionRecordingEvent) => {
        // fixes some concurrency problems etc by not continueing in the player until the current
        // action is drawn
        const { isPlaying } = this;
        this.isPlaying = false;

        const eventType = getEventTypeId(event);

        let offset: Point|null = null;
        if (eventType === EVENT_TYPE_MOVEMENT) {
          if (event.selector) {
            offset = recordingIframe.getCoordinatesInFrame(
              event.selector,
              event.x,
              event.y,
              this.offsetAccuracy,
              false,
            );

            if (offset) {
              moveMouseTo!(offset);
            }
          }
        } else if (eventType === EVENT_TYPE_CLICK) {
          if (event.selector) {
            offset = recordingIframe.getCoordinatesInFrame(
              event.selector,
              event.x,
              event.y,
              this.offsetAccuracy,
              false,
            );

            if (offset) {
              moveMouseTo!(offset);
              recordingIframe.drawCircle(offset.x, offset.y, '#ff9407');
            }
          }
        } else if (eventType === EVENT_TYPE_MUTATION) {
          if (event.text) {
            recordingIframe.applyMutation(event.text);
          }
        } else if (eventType === EVENT_TYPE_SCROLL) {
          const docHeight = recordingIframe.getIframeHeight() as number;
          const docWidth = recordingIframe.getIframeWidth() as number;
          const yPos = parseInt(`${(docHeight / this.scrollAccuracy) * intVal(event.y)}`, 10);
          const xPos = parseInt(`${(docWidth / this.scrollAccuracy) * intVal(event.x)}`, 10);
          scrollFrameTo(xPos, yPos);
        } else if (eventType === EVENT_TYPE_SCROLL_ELEMENT) {
          if (event.selector) {
            const element = recordingIframe.findElement(event.selector);

            if (element && element.length && element[0]) {
              const eleHeight = Math.max(
                element[0].scrollHeight,
                element[0].offsetHeight,
                element.height(),
                0,
              );

              const eleWidth = Math.max(
                element[0].scrollWidth,
                element[0].offsetWidth,
                element.width(),
                0,
              );

              if (eleHeight && eleWidth) {
                const yPos = parseInt(`${(eleHeight / this.scrollAccuracy) * intVal(event.y)}`, 10);
                const xPos = parseInt(`${(eleWidth / this.scrollAccuracy) * intVal(event.x)}`, 10);
                scrollElementTo(element[0], xPos, yPos);
              }
            }
          }
        } else if (eventType === EVENT_TYPE_RESIZE) {
          this.setViewportResolution(event.x, event.y);
        } else if (eventType === EVENT_TYPE_FORM_TEXT) {
          if (event.selector) {
            const formElement = recordingIframe.findElement(event.selector);

            if (formElement.length) {
              const formAttrType = formElement.attr('type');

              if (formAttrType && `${formAttrType}`.toLowerCase() === 'file') {
                // cannot be changed to local file, would result in error
              } else {
                formElement.val(event.text).change();
              }
            }
          }
        } else if (eventType === EVENT_TYPE_FORM_VALUE) {
          if (event.selector) {
            const $field = recordingIframe.findElement(event.selector);
            if ($field.is('input')) {
              $field.prop('checked', event.text === 1 || event.text === '1');
            } else if ($field.is('select')) {
              $field.val(event.text).change();
            }
          }
        }

        this.isPlaying = isPlaying;
      };

      moveMouseTo = (coordinates: Point) => {
        const resizeStage = () => {
          const stageWidth = recordingIframe.getIframeWidth();
          const stageHeight = recordingIframe.getIframeHeight();
          recordingIframe.makeSvg(stageWidth, stageHeight);

          for (let crtFrame = 0; crtFrame <= this.frame; crtFrame += FRAME_STEP) {
            if (!this.timeFrameBuckets[crtFrame]) {
              return;
            }

            this.timeFrameBuckets[crtFrame].forEach((event) => {
              const eventType = getEventTypeId(event);

              if (eventType === EVENT_TYPE_MOVEMENT
                || eventType === EVENT_TYPE_SCROLL
                || eventType === EVENT_TYPE_SCROLL_ELEMENT
                || eventType === EVENT_TYPE_CLICK
              ) {
                this.lastFramePainted = crtFrame;
                replayEvent(event);
              }
            });
          }
        };

        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        const iframeWindow = recordingIframe.getIframeWindow();

        if (!this.lastCanvasCoordinates) {
          const stageHeight = recordingIframe.getIframeHeight();
          const stageWidth = recordingIframe.getIframeWidth();

          recordingIframe.appendContent(MOUSE_POINTER_HTML);

          $mousePointerNode = recordingIframe.findElement('.mousePointer');
          recordingIframe.makeSvg(stageWidth, stageHeight);

          iframeWindow.removeEventListener('resize', resizeStage, false);
          iframeWindow.addEventListener('resize', resizeStage, false);

          this.lastCanvasCoordinates = coordinates;
          $mousePointerNode!.css({
            left: `${coordinates.x - 8}px`,
            top: `${coordinates.y - 8}px`,
          });

          return;
        }

        let scrollTop = recordingIframe.getScrollTop();
        const scrollLeft = recordingIframe.getScrollLeft();

        if (coordinates.y > scrollTop + intVal(this.recording.viewport_h_px)) {
          recordingIframe.scrollTo(scrollLeft, coordinates.y - 10);
        } else if (coordinates.y < scrollTop) {
          recordingIframe.scrollTo(scrollLeft, coordinates.y - 10);
        }

        scrollTop = recordingIframe.getScrollTop();

        if (coordinates.x > scrollLeft + intVal(this.recording.viewport_w_px)) {
          recordingIframe.scrollTo(coordinates.x - 10, scrollTop);
        } else if (coordinates.x < scrollLeft) {
          recordingIframe.scrollTo(coordinates.x - 10, scrollTop);
        }

        drawMouseLine(coordinates, '#ff9407');
      };

      this.seek = (seekToFrame: number) => {
        if (!this.iframeLoaded) {
          return;
        }

        // this operation may take a while so we want to stop any interval and further action
        // until this is completed
        this.isLoading = true;

        let previousFrame = this.frame;

        const executeSeek = (thePreviousFrame: number) => {
          for (let crtFrame = thePreviousFrame; crtFrame <= this.frame; crtFrame += FRAME_STEP) {
            (this.timeFrameBuckets[crtFrame] || []).forEach((event) => {
              this.lastFramePainted = crtFrame;
              replayEvent(event);
            });
          }
        };

        this.isFinished = false;
        this.frame = seekToFrame - (seekToFrame % FRAME_STEP);
        this.progress = parseFloat(
          parseFloat(`${(this.frame / intVal(this.recording.duration)) * 100}`).toFixed(2),
        );
        this.positionPretty = toPrettyTimeFormat(this.frame);

        if (previousFrame > this.frame) {
          // we start replaying the video from the beginning
          previousFrame = 0;
          this.lastCanvasCoordinates = false;

          if (this.initialMutation) {
            recordingIframe.initialMutation(this.initialMutation.text!);
          }
          recordingIframe.scrollTo(0, 0);

          this.setViewportResolution(
            window.sessionRecordingData.viewport_w_px,
            window.sessionRecordingData.viewport_h_px,
          );

          if (this.seekTimeout) {
            clearTimeout(this.seekTimeout);
            this.seekTimeout = null;
            // make sure when user goes to previous position and we have a timeout to not execute
            // it multiple times
          }

          ((thePreviousFrame) => {
            this.seekTimeout = setTimeout(() => {
              executeSeek(thePreviousFrame);
              this.isLoading = false;
            }, 1050);
          })(previousFrame);
        } else {
          // otherwise we instead play fast forward all new actions for faster performance and
          // smoother visualization etc
          if (this.seekTimeout) {
            clearTimeout(this.seekTimeout);
            this.seekTimeout = null;
          }

          executeSeek(previousFrame);
          this.isLoading = false;
        }
      };

      this.isLoading = false;
      this.isPlaying = true;

      let updateTimeCounter = 0;
      const drawFrames = () => {
        if (this.isPlaying && !this.isLoading) {
          updateTimeCounter += 1;

          const duration = intVal(this.recording.duration);

          if (this.frame >= duration) {
            this.isPlaying = false;
            this.progress = 100;
            this.isFinished = true;
            this.positionPretty = this.durationPretty;

            if (this.actualAutoPlayEnabled && this.nextRecordingId) {
              this.loadNewRecording(this.nextRecordingId);
            }
          } else {
            this.progress = parseFloat(
              parseFloat(`${(this.frame / duration) * 100}`).toFixed(2),
            );

            if (updateTimeCounter === 20) {
              updateTimeCounter = 0;
              this.positionPretty = toPrettyTimeFormat(this.frame);
            }
          }

          (this.timeFrameBuckets[this.frame] || []).forEach((event) => {
            // remember when we last painted a frame
            this.lastFramePainted = this.frame;
            replayEvent(event);
          });

          if (this.actualSkipPausesEnabled && this.frame - this.lastFramePainted > 1800) {
            // after 1.8 seconds of not painting anything, move forward to next action
            let keys = Object.keys(this.timeFrameBuckets).map((k) => parseInt(k, 10));
            keys = keys.sort((a, b) => a - b);

            const nextFrameKey = keys.find((key) => key > this.frame);

            const hasNextFrame = !!nextFrameKey;

            if (nextFrameKey) {
              const isMoreThan1SecInFuture = (nextFrameKey - this.frame) > 1000;
              if (isMoreThan1SecInFuture) {
                // we set the pointer foward to the next frame printable
                // we only move forward if we can save at least one second.
                // we set the cursor to shortly before the next action.
                this.frame = nextFrameKey - (20 * FRAME_STEP);
              }
            }

            // if no frame found, skip to the end of the recording
            if (!hasNextFrame) {
              const isMoreThan1SecInFuture = (duration - this.frame) > 1000;

              if (isMoreThan1SecInFuture) {
                // we don't set it to very end to still have something to play
                this.frame = duration - (20 * FRAME_STEP);
              }
            }
          }

          this.frame += FRAME_STEP;
        }
      };

      this.videoPlayerInterval = setInterval(() => {
        for (let k = 1; k <= this.actualReplaySpeed; k += 1) {
          drawFrames();
        }
      }, FRAME_STEP);
    },
    observePlayerSize() {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const main = this.$refs.playerMain as HTMLElement|undefined;
      const controls = this.$refs.playerControls as HTMLElement|undefined;

      if (!main) {
        return;
      }

      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeRafHandle !== null) {
          return;
        }

        this.resizeRafHandle = window.requestAnimationFrame(() => {
          this.resizeRafHandle = null;
          this.initViewport();
        });
      });

      this.resizeObserver.observe(main);

      if (controls) {
        this.resizeObserver.observe(controls);
      }
    },
    initViewport() {
      const main = this.$refs.playerMain as HTMLElement|undefined;
      const stage = this.$refs.replayStage as HTMLElement|undefined;

      if (!main || !stage) {
        return;
      }

      // Measured on the stage, not on playerMain: clientWidth includes the card padding, and it
      // excludes the stage's own border, which is what bounds the scaled iframe.
      const nextWidth = stage.clientWidth;

      // playerMain is a padded card, so the stage's bottom edge is inset from the column's.
      // Read it off the card rather than mirroring the LESS value, and floor the result: the
      // early return below compares floats exactly, and that is what stops the
      // ResizeObserver -> height -> ResizeObserver loop.
      const mainStyle = window.getComputedStyle(main);
      const stageBottomInset = parseFloat(mainStyle.paddingBottom)
        + parseFloat(mainStyle.borderBottomWidth);
      const nextHeight = Math.floor(
        window.innerHeight - $(stage).offset()!.top - stageBottomInset - PAGE_PADDING,
      );

      if (nextWidth <= 0 || !Number.isFinite(nextHeight)) {
        return;
      }

      const viewportwpx = intVal(this.recording.viewport_w_px);
      const viewporthpx = intVal(this.recording.viewport_h_px);

      let replayWidth = nextWidth;
      let replayHeight = nextHeight;

      const minReplayWidth = 400;
      if (replayWidth < minReplayWidth && viewportwpx > minReplayWidth) {
        replayWidth = minReplayWidth;
      }

      const minReplayHeight = 400;
      if (replayHeight < minReplayHeight && viewporthpx > minReplayHeight) {
        replayHeight = minReplayHeight;
      }

      let widthScale = 1;
      let heightScale = 1;

      if (viewportwpx > replayWidth) {
        widthScale = parseFloat(
          parseFloat(`${replayWidth / viewportwpx}`).toFixed(4),
        );
      }

      if (viewporthpx > replayHeight) {
        heightScale = parseFloat(
          parseFloat(`${replayHeight / viewporthpx}`).toFixed(4),
        );
      }

      const replayScale = Math.min(widthScale, heightScale);
      const replayMarginLeft = (replayWidth - (replayScale * viewportwpx)) / 2;

      if (replayWidth === this.replayWidth
        && replayHeight === this.replayHeight
        && replayScale === this.replayScale
        && replayMarginLeft === this.replayMarginLeft
      ) {
        return;
      }

      this.replayWidth = replayWidth;
      this.replayHeight = replayHeight;
      this.replayScale = replayScale;
      this.replayMarginLeft = replayMarginLeft;
    },
    setViewportResolution(widthPx: string|number, heightPx: string|number) {
      this.recording.viewport_w_px = parseInt(`${widthPx}`, 10);
      this.recording.viewport_h_px = parseInt(`${heightPx}`, 10);

      this.initViewport();
    },
    increaseReplaySpeed() {
      // A stored speed that is no longer offered resolves to indexOf -1, so it steps back to the
      // first entry rather than sticking.
      const next = (REPLAY_SPEEDS.indexOf(this.actualReplaySpeed) + 1) % REPLAY_SPEEDS.length;
      this.actualReplaySpeed = REPLAY_SPEEDS[next];

      this.updateSettings();
    },
    selectReplaySpeed(speed: number) {
      this.actualReplaySpeed = speed;

      // ExpandOnClick tracks open state as a class on the host, so closing means clearing it.
      // That bypasses the directive's own close(), hence resetting the flag by hand as well.
      const speedMenu = this.$refs.playerSpeed as HTMLElement|undefined;
      if (speedMenu) {
        speedMenu.classList.remove('expanded');
      }
      this.isSpeedMenuOpen = false;

      this.updateSettings();
    },
    updateSettings() {
      AjaxHelper.fetch(
        {
          module: 'HeatmapSessionRecording',
          action: 'saveSessionRecordingSettings',
          autoplay: this.actualAutoPlayEnabled ? 1 : 0,
          skippauses: this.actualSkipPausesEnabled ? 1 : 0,
          replayspeed: this.actualReplaySpeed,
        },
        {
          format: 'html',
          withTokenInUrl: true,
        },
      );
    },
    toggleAutoPlay() {
      this.actualAutoPlayEnabled = !this.actualAutoPlayEnabled;
      this.updateSettings();
    },
    toggleSkipPauses() {
      this.actualSkipPausesEnabled = !this.actualSkipPausesEnabled;
      this.updateSettings();
    },
    loadNewRecording(idLogHsr: string|number|null) {
      if (idLogHsr) {
        this.isPlaying = false;
        MatomoUrl.updateUrl({
          ...MatomoUrl.urlParsed.value,
          idLogHsr: parseInt(`${idLogHsr}`, 10),
          updated: MatomoUrl.urlParsed.value.updated
            ? (parseInt(MatomoUrl.urlParsed.value.updated as string, 10) + 1)
            : 1,
        });
      }
    },
    jumpRelative(numberSeconds: number, forward: boolean) {
      const framesToJump = numberSeconds * 1000;

      let newPosition;
      if (forward) {
        newPosition = this.frame + framesToJump;

        if (newPosition > this.recording.duration) {
          newPosition = intVal(this.recording.duration) - FRAME_STEP;
        }
      } else {
        newPosition = this.frame - framesToJump;

        if (newPosition < 0) {
          newPosition = 0;
        }
      }

      this.seek(newPosition);
    },
    replay() {
      this.isFinished = false;
      this.lastFramePainted = 0;
      this.seek(0);
      this.play();
    },
    pause() {
      this.isPlaying = false;
    },
    togglePlay() {
      if (this.isFinished) {
        this.replay();
      } else if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    seekEvent(event: MouseEvent) {
      const element = event.currentTarget as HTMLElement;
      const fullWidth = element.getBoundingClientRect().width;

      if (!fullWidth) {
        return;
      }

      const percentage = seekPercentage(event.pageX, $(element).offset()!.left, fullWidth);
      this.seek(intVal(this.recording.duration) * percentage);
    },
    play() {
      this.isPlaying = true;
    },
  },
  computed: {
    durationPretty(): string {
      return toPrettyTimeFormat(intVal(this.recording.duration));
    },
    embedUrl(): string {
      return `?${MatomoUrl.stringify({
        module: 'HeatmapSessionRecording',
        action: 'embedPage',
        idSite: this.recording.idSite,
        idLogHsr: this.recording.idLogHsr,
        idSiteHsr: this.recording.idSiteHsr,
        // NOTE: important to get the token_auth from the URL directly, since if there is no
        // token_auth there, we should send nothing. In this case, Matomo.token_auth will still
        // be set, so we can't check that variable here.
        token_auth: MatomoUrl.urlParsed.value.token_auth as string || undefined,
      })}`;
    },
    skipPreviousButtonTitle(): string {
      if (!this.previousRecordingId) {
        return translate('HeatmapSessionRecording_PlayerPageViewPreviousNone');
      }

      return translate(
        'HeatmapSessionRecording_PlayerPageViewPrevious',
        this.previousRecordingInfo || '',
        'P',
      );
    },
    skipNextButtonTitle(): string {
      if (!this.nextRecordingId) {
        return translate('HeatmapSessionRecording_PlayerPageViewNextNone');
      }

      return translate(
        'HeatmapSessionRecording_PlayerPageViewNext',
        this.nextRecordingInfo || '',
        'N',
      );
    },
    rewindFastTitle(): string {
      return translate('HeatmapSessionRecording_PlayerRewindFast', '10', 'J');
    },
    forwardFastTitle(): string {
      return translate('HeatmapSessionRecording_PlayerForwardFast', '10', 'L');
    },
    playPauseIcon(): string {
      if (this.isFinished) {
        return 'replay';
      }

      if (this.isPlaying) {
        return 'pause';
      }

      return 'play';
    },
    playPauseTitle(): string {
      if (this.isFinished) {
        return translate('HeatmapSessionRecording_PlayerReplay', 'K');
      }

      if (this.isPlaying) {
        return translate('HeatmapSessionRecording_PlayerPause', 'K');
      }

      return translate('HeatmapSessionRecording_PlayerPlay', 'K');
    },
    changeReplaySpeedTitle(): string {
      return translate('HeatmapSessionRecording_ChangeReplaySpeed', 'S');
    },
    replaySpeedOptions(): number[] {
      return REPLAY_SPEEDS;
    },
    replaySpeedLabel(): string {
      return translate('HeatmapSessionRecording_PlayerSpeedX', `${this.actualReplaySpeed}`);
    },
    skipPausesTitle(): string {
      return translate(
        'HeatmapSessionRecording_ClickToSkipPauses',
        this.skipPausesEnabledText,
        'B',
      );
    },
    autoPlayTitle(): string {
      return translate(
        'HeatmapSessionRecording_AutoPlayNextPageview',
        this.autoplayEnabledText,
        'A',
      );
    },
    skipPausesEnabledText(): string {
      if (this.actualSkipPausesEnabled) {
        return translate('HeatmapSessionRecording_disable');
      }

      return translate('HeatmapSessionRecording_enable');
    },
    autoplayEnabledText(): string {
      if (this.actualAutoPlayEnabled) {
        return translate('HeatmapSessionRecording_disable');
      }

      return translate('HeatmapSessionRecording_enable');
    },
    recordingEvents(): SessionRecordingEvent[] {
      if (!this.recording) {
        return [];
      }

      return this.recording.events.map((theEvent) => {
        const eventType = getEventTypeId(theEvent)!;

        let { text } = theEvent;
        if ((eventType === EVENT_TYPE_INITIAL_DOM
            || eventType === EVENT_TYPE_MUTATION)
          && typeof text === 'string'
        ) {
          text = JSON.parse(text);
        }

        return {
          ...theEvent,
          text,
        };
      });
    },
    initialMutation(): SessionRecordingEvent|undefined {
      const initialEvent = this.recordingEvents.find((e) => {
        const eventType = getEventTypeId(e)!;

        const isMutation = eventType === EVENT_TYPE_INITIAL_DOM
          || eventType === EVENT_TYPE_MUTATION;
        const isInitialMutation = isMutation
          && (eventType === EVENT_TYPE_INITIAL_DOM
            || !e.time_since_load
            || e.time_since_load === '0');
        return isInitialMutation;
      });
      return initialEvent;
    },
    timeFrameBuckets(): Record<number, SessionRecordingEvent[]> {
      const result: Record<number, SessionRecordingEvent[]> = {};
      this.recordingEvents.forEach((event) => {
        if (event === this.initialMutation) {
          return;
        }

        const bucket = Math.round(intVal(event.time_since_load) / FRAME_STEP) * FRAME_STEP;
        result[bucket] = result[bucket] || [];
        result[bucket].push(event);
      });
      return result;
    },
    clues(): RecordingClue[] {
      const result: RecordingClue[] = [];

      this.recordingEvents.forEach((event) => {
        if (event === this.initialMutation) {
          return;
        }

        const eventTypeId = getEventTypeId(event)!;

        const eventType = EVENT_TYPE_TO_NAME[eventTypeId] || '';
        const eventTitle = EVENT_TYPE_TO_TITLE[eventTypeId] || '';

        if (eventType) {
          if ((event.time_since_load === 0 || event.time_since_load === '0')
            && eventType === 'move'
          ) {
            // this is the initial mouse position and we ignore it in the clues since we cannot
            // draw a line to it
            return;
          }

          result.push({
            left: parseFloat(
              `${(intVal(event.time_since_load) / intVal(this.recording.duration)) * 100}`,
            ).toFixed(2),
            type: eventType,
            title: eventTitle,
          });
        }
      });

      return result;
    },
  },
});
</script>
