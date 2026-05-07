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
  <div class="sessionRecordingPlayer">
    <div class="controls">
      <span class="playerActions">
        <span
          class="playerAction icon-skip-previous"
          :title="skipPreviousButtonTitle"
          v-show="previousRecordingId"
          @click="loadNewRecording(previousRecordingId)"
        />
        <span
          class="playerAction icon-fast-rewind"
          :title="translate('HeatmapSessionRecording_PlayerRewindFast', 10, 'J')"
          @click="jumpRelative(10, false)"
        />
        <span
          class="playerAction icon-play"
          :title="translate('HeatmapSessionRecording_PlayerPlay', 'K')"
          v-show="!isPlaying && !isFinished"
          @click="play()"
        />
        <span
          class="playerAction icon-replay"
          :title="translate('HeatmapSessionRecording_PlayerReplay', 'K')"
          v-show="!isPlaying && isFinished"
          @click="replay()"
        />
        <span
          class="playerAction icon-pause"
          :title="translate('HeatmapSessionRecording_PlayerPause', 'K')"
          v-show="isPlaying"
          @click="pause()"
        />
        <span
          class="playerAction icon-fast-forward"
          :title="translate('HeatmapSessionRecording_PlayerForwardFast', 10, 'L')"
          @click="jumpRelative(10, true)"
        />
        <span
          class="playerAction icon-skip-next"
          :title="translate('HeatmapSessionRecording_PlayerPageViewNext', nextRecordingInfo, 'N')"
          v-show="nextRecordingId"
          @click="loadNewRecording(nextRecordingId)"
        />
        <span
          class="changeReplaySpeed"
          :title="translate('HeatmapSessionRecording_ChangeReplaySpeed', 'S')"
          @click="increaseReplaySpeed()"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 768 768"
            v-show="actualReplaySpeed === 4"
          >
            <path
              d="M480 576.5v-321h-64.5v129h-63v-129h-64.5v192h127.5v129h64.5zM607.5 127.999c34.5 0
              64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5
              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447z"
            />
          </svg>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 768 768"
            v-show="actualReplaySpeed === 1"
          >
            <path
              d="M448.5 576.5v-321h-129v64.5h64.5v256.5h64.5zM607.5 127.999c34.5 0 64.5 30 64.5
              64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5 0-64.5-30-64.5-64.5v-447c0-34.5
              30-64.5 64.5-64.5h447z"
            />
          </svg>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 768 768"
            v-show="actualReplaySpeed === 2"
          >
            <path
              d="M480 384.5v-64.5c0-36-30-64.5-64.5-64.5h-127.5v64.5h127.5v64.5h-63c-34.5 0-64.5
              27-64.5 63v129h192v-64.5h-127.5v-64.5h63c34.5 0 64.5-27 64.5-63zM607.5 127.999c34.5
              0 64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5
              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447z"
            />
          </svg>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 768 768"
            v-show="actualReplaySpeed === 6"
          >
            <path
              d="M480 320v-64.5h-127.5c-34.5 0-64.5 28.5-64.5 64.5v192c0 36 30 64.5 64.5
              64.5h63c34.5 0 64.5-28.5 64.5-64.5v-64.5c0-36-30-63-64.5-63h-63v-64.5h127.5zM607.5
              127.999c34.5 0 64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5
              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447zM352.5 512v-64.5h63v64.5h-63z"
            />
          </svg>
        </span>
        <span
          class="toggleSkipPause"
          :title="translate(
            'HeatmapSessionRecording_ClickToSkipPauses', skipPausesEnabledText, 'B')"
          @click="toggleSkipPauses()"
          :class="{'active': actualSkipPausesEnabled}"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 768 768"
          >
            <path
              d="M223.5 415.5h111l-64.5-63h-46.5v63zM72 72l624 624-42 40.5-88.5-90c-51 36-114
              57-181.5 57-177 0-319.5-142.5-319.5-319.5 0-67.5 21-130.5 57-181.5l-90-88.5zM544.5
              352.5h-111l-231-231c51-36 114-57 181.5-57 177 0 319.5 142.5 319.5 319.5 0 67.5-21
              130.5-57 181.5l-148.5-150h46.5v-63z"
            />
          </svg>
        </span>
        <span
          class="toggleAutoPlay"
          :title="translate(
            'HeatmapSessionRecording_AutoPlayNextPageview', autoplayEnabledText, 'A')"
          @click="toggleAutoPlay()"
          :class="{'active': actualAutoPlayEnabled}"
        ><svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 768 768"
          >
            <path
              d="M544.5 609v-129h63v192h-384v96l-127.5-127.5 127.5-127.5v96h321zM223.5
              288v129h-63v-192h384v-96l127.5 127.5-127.5 127.5v-96h-321z"
            />
          </svg></span>
        <span class="duration">
          {{ translate(
            'HeatmapSessionRecording_PlayerDurationXofY', positionPretty, durationPretty) }}
        </span>
      </span>
      <div class="playerHelp">
        <ul>
          <li>
            <span class="clickEvent" /> {{ translate('HeatmapSessionRecording_ActivityClick') }}
          </li>
          <li>
            <span class="moveEvent" /> {{ translate('HeatmapSessionRecording_ActivityMove') }}
          </li>
          <li>
            <span class="scrollEvent" />
            {{ translate('HeatmapSessionRecording_ActivityScroll') }}
          </li>
          <li>
            <span class="resizeEvent" />
            {{ translate('HeatmapSessionRecording_ActivityResize') }}
          </li>
          <li>
            <span class="formChange" />
            {{ translate('HeatmapSessionRecording_ActivityFormChange') }}
          </li>
          <li>
            <span class="mutationEvent" />
            {{ translate('HeatmapSessionRecording_ActivityPageChange') }}
          </li>
        </ul>
      </div>
      <br style="clear: right;" />
    </div>
    <div
      class="timelineOuter"
      @click="seekEvent($event)"
      :style="{width: `${replayWidth}px`}"
    >
      <div
        class="timelineInner"
        :style="{width: `${progress}%`}"
      />
      <div
        :title="clue.title"
        :class="clue.type"
        :style="{left: `${clue.left}%`}"
        v-for="(clue, index) in clues"
        :key="index"
      />
    </div>
    <br />
    <div
      class="hsrLoadingOuter"
      v-show="isLoading"
      :style="{width: `${replayWidth}px`, height: `${replayHeight}px`}"
    >
      <div class="loadingUnderlay" />
      <div class="valign-wrapper loadingInner">
        <div class="loadingContent">{{ translate('General_Loading') }}</div>
      </div>
    </div>
    <div
      class="replayContainerOuter"
      @click="togglePlay()"
      :style="{height: `${replayHeight}px`, width: `${replayWidth}px`}"
    >
      <div
        class="replayContainerInner"
        style="transform-origin: 0 0;"
        :style="{transform: `scale(${replayScale})`, 'margin-left': `${replayMarginLeft}px`}"
      >
        <iframe
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  translate,
  AjaxHelper,
  MatomoUrl,
} from 'CoreHome';
import { SessionRecordingData, SessionRecordingEvent } from '../types';
import getIframeWindow from '../getIframeWindow';

const FRAME_STEP = 20;
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
  [EVENT_TYPE_CLICK]: 'clickEvent',
  [EVENT_TYPE_MOVEMENT]: 'moveEvent',
  [EVENT_TYPE_SCROLL]: 'scrollEvent',
  [EVENT_TYPE_SCROLL_ELEMENT]: 'scrollEvent',
  [EVENT_TYPE_RESIZE]: 'resizeEvent',
  [EVENT_TYPE_FORM_TEXT]: 'formChange',
  [EVENT_TYPE_FORM_VALUE]: 'formChange',
  [EVENT_TYPE_INITIAL_DOM]: 'mutationEvent',
  [EVENT_TYPE_MUTATION]: 'mutationEvent',
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
}

const { $, Mousetrap } = window;

function intVal(v: string|number) {
  return typeof v === 'number' ? v : parseInt(v, 10);
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
    Mousetrap.bind(['space', 'k'], () => {
      this.togglePlay();
    });

    Mousetrap.bind('0', () => {
      if (this.isFinished) {
        this.replay();
      }
    });

    Mousetrap.bind('p', () => {
      this.loadNewRecording(this.previousRecordingId);
    });

    Mousetrap.bind('n', () => {
      this.loadNewRecording(this.nextRecordingId);
    });

    Mousetrap.bind('s', () => {
      this.increaseReplaySpeed();
    });

    Mousetrap.bind('a', () => {
      this.toggleAutoPlay();
    });

    Mousetrap.bind('b', () => {
      this.toggleSkipPauses();
    });

    Mousetrap.bind('left', () => {
      const numSeconds = 5;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });

    Mousetrap.bind('right', () => {
      const numSeconds = 5;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });

    Mousetrap.bind('j', () => {
      const numSeconds = 10;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });

    Mousetrap.bind('l', () => {
      const numSeconds = 10;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });

    this.initViewport();
    $(window).on('resize', () => this.initViewport());

    this.iframeLoadedPromise.then(() => {
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
  methods: {
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
    initViewport() {
      this.replayHeight = $(window).height()! - 48
        - $('.sessionRecording .sessionRecordingHead').outerHeight(true)!
        - $('.sessionRecordingPlayer .controls').outerHeight(true)!;

      this.replayWidth = $(window).width()! - 48;

      const viewportwpx = intVal(this.recording.viewport_w_px);
      const viewporthpx = intVal(this.recording.viewport_h_px);

      const minReplayWidth = 400;
      if (this.replayWidth < minReplayWidth && viewportwpx > minReplayWidth) {
        this.replayWidth = minReplayWidth;
      }

      const minReplayHeight = 400;
      if (this.replayHeight < minReplayHeight && viewporthpx > minReplayHeight) {
        this.replayHeight = minReplayHeight;
      }

      let widthScale = 1;
      let heightScale = 1;

      if (viewportwpx > this.replayWidth) {
        widthScale = parseFloat(
          parseFloat(`${this.replayWidth / viewportwpx}`).toFixed(4),
        );
      }

      if (viewporthpx > this.replayHeight) {
        heightScale = parseFloat(
          parseFloat(`${this.replayHeight / viewporthpx}`).toFixed(4),
        );
      }

      this.replayScale = Math.min(widthScale, heightScale);
      this.replayMarginLeft = (this.replayWidth - (this.replayScale * viewportwpx)) / 2;
    },
    setViewportResolution(widthPx: string|number, heightPx: string|number) {
      this.recording.viewport_w_px = parseInt(`${widthPx}`, 10);
      this.recording.viewport_h_px = parseInt(`${heightPx}`, 10);

      $('.recordingWidth').text(widthPx);
      $('.recordingHeight').text(heightPx);

      this.initViewport();
    },
    increaseReplaySpeed() {
      if (this.actualReplaySpeed === 1) {
        this.actualReplaySpeed = 2;
      } else if (this.actualReplaySpeed === 2) {
        this.actualReplaySpeed = 4;
      } else if (this.actualReplaySpeed === 4) {
        this.actualReplaySpeed = 6;
      } else {
        this.actualReplaySpeed = 1;
      }

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
      const offset = $(event.currentTarget as HTMLElement).offset()!;
      const selectedPosition = event.pageX - offset.left;
      const fullWidth = this.replayWidth;

      const seekPercentage = selectedPosition / fullWidth;
      const seekPositionTime = intVal(this.recording.duration) * seekPercentage;
      this.seek(seekPositionTime);
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
      return translate(
        'HeatmapSessionRecording_PlayerPageViewPrevious',
        this.previousRecordingInfo || '',
        'P',
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
            && eventType === 'moveEvent'
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
