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

import { mount } from '@vue/test-utils';

// The shared ambient `CoreHome` declaration (CoreVue/types/plugin-modules.d.ts)
// only covers a couple of members, so type-checking the production source this
// spec pulls in (oneAtATime.ts) fails. Augment it locally with the externals
// that source touches; the real implementations are replaced by jest.mock below.
declare module 'CoreHome' {
  export const AjaxHelper: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post<T = any>(params: unknown, postParams?: unknown, options?: unknown): Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch<T = any>(params: unknown, options?: unknown): Promise<T>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AjaxOptions = any;
}

// Keep the component's `created()` hook inert: it kicks off `fetchHeatmap()`,
// which goes through AjaxHelper.post(). Returning a never-settling promise means
// the Promise.all() in fetchHeatmap never resolves, so none of the iframe-driven
// code runs and the tests stay deterministic.
// `mock`-prefixed so babel-plugin-jest-hoist allows the jest.mock factory below to reference it.
const mockPending = () => new Promise(() => { /* never settles, keeps fetchHeatmap pending */ });

jest.mock('CoreHome', () => ({
  translate: (key: string, ...args: string[]) => {
    const words: Record<string, string> = {
      HeatmapSessionRecording_ElementTypeLink: 'link',
      HeatmapSessionRecording_ElementTypeButton: 'button',
      HeatmapSessionRecording_ElementTypeHeading: 'heading',
      HeatmapSessionRecording_ElementTypeImage: 'image',
      HeatmapSessionRecording_ElementTypeField: 'field',
      HeatmapSessionRecording_ElementTypeNavigation: 'navigation',
      HeatmapSessionRecording_ElementTypeList: 'list',
      HeatmapSessionRecording_ElementTypeForm: 'form',
      HeatmapSessionRecording_ElementTypeHeader: 'header',
      HeatmapSessionRecording_ElementTypeFooter: 'footer',
      HeatmapSessionRecording_ElementTypeMainContent: 'main content',
      HeatmapSessionRecording_ElementTypeSidebar: 'sidebar',
      HeatmapSessionRecording_ElementTypeSection: 'section',
      HeatmapSessionRecording_ElementTypeArticle: 'article',
      General_Table: 'table',
    };
    if (key === 'HeatmapSessionRecording_TopClickedElementLabel') {
      return `'${args[0]}' ${args[1]}`;
    }
    return words[key] || key;
  },
  Matomo: { idSite: 1, postEvent: jest.fn() },
  AjaxHelper: { post: jest.fn(mockPending), fetch: jest.fn(mockPending) },
  MatomoUrl: {
    parsed: { value: {} },
    stringify: (params: Record<string, unknown>) => Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&'),
  },
  externalLink: (url: string) => url,
  externalRawLink: (url: string) => url,
  NumberFormatter: {
    formatPercent: (value: number) => `${value}%`,
  },
  // no-op stand-in for the v-copy-to-clipboard directive used by the empty state
  CopyToClipboard: {},
}), { virtual: true });

jest.mock('CorePluginsAdmin', () => ({ Field: {}, SaveButton: {} }), { virtual: true });

jest.mock('heatmap.js', () => ({ __esModule: true, default: { create: jest.fn() } }), { virtual: true });

// vue-jest downlevels the compiled component to ES5 and emits tslib's
// `__spreadArray` for array spreads, but (a) the tslib hoisted in node_modules
// predates that helper and (b) the downlevel has no iterator support, so it
// hands raw iterables (e.g. `Map.values()`) straight to the helper. Provide a
// shim that also coerces iterables to arrays, so spread-using methods behave as
// they do in the production esnext build (which keeps native spread).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tslib = require('tslib');
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
tslib.__spreadArray = function spreadArray(to: any[], from: any, pack?: boolean) {
  const source = from && typeof from.length !== 'number' && typeof from[Symbol.iterator] === 'function'
    ? Array.from(from)
    : from;
  let ar: any[] | undefined;
  // eslint-disable-next-line prefer-rest-params
  if (pack || arguments.length === 2) {
    for (let i = 0, l = source.length; i < l; i += 1) {
      if (ar || !(i in source)) {
        if (!ar) ar = Array.prototype.slice.call(source, 0, i);
        ar[i] = source[i];
      }
    }
  }
  return to.concat(ar || Array.prototype.slice.call(source));
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HeatmapVis = require('./HeatmapVis.vue').default;

function factory(props: Record<string, unknown> = {}) {
  return mount(HeatmapVis as any, {
    props: {
      idSiteHsr: 1,
      deviceTypes: [{ key: 1, name: 'Desktop' }],
      heatmapTypes: [{ key: 1, name: 'Click' }],
      breakpointMobile: 320,
      breakpointTablet: 768,
      offsetAccuracy: 1,
      heatmapPeriod: 'range',
      heatmapDate: '2024-01-01,2024-01-31',
      url: 'https://example.com',
      isActive: true,
      numSamples: { nb_samples_device_1: 42 },
      excludedElements: '',
      createdDate: '2024-01-01',
      desktopPreviewSize: 1280,
      iframeResolutionsValues: [320, 768, 1280],
      ...props,
    },
    global: {
      // `translate` is a global property in a real Matomo Vue app, so the
      // template references it without importing it.
      mocks: { translate: (key: string) => key },
      stubs: { Field: true, SaveButton: true, Tooltip: true },
    },
  });
}

// Builds an element detached from the document, with a stubbed bounding box so
// the rectangle hit-testing in getTopClickedElements is deterministic under jsdom
// (jsdom otherwise reports an all-zero rectangle for every element).
function elementAt(markup: string, rect: Partial<DOMRect>): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = markup.trim();
  const element = container.firstElementChild as HTMLElement;
  element.getBoundingClientRect = () => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);
  return element;
}

describe('HeatmapSessionRecording/HeatmapVis', () => {
  describe('summary card rendering', () => {
    it('shows the recordings total and a ranked bar for each clicked element', async () => {
      const wrapper = factory();
      await wrapper.setData({
        actualNumSamples: { nb_samples_device_1: 42 },
        topClickedElements: [
          {
            key: 'a', label: "'Sign up' link", count: 6, percent: 60, percentLabel: '60%',
          },
          {
            key: 'b', label: "'Logo' link", count: 4, percent: 40, percentLabel: '40%',
          },
        ],
      });

      expect(wrapper.find('.recordingsValue').text()).toBe('42');

      const labels = wrapper.findAll('.topClickedElementLabel');
      expect(labels.map((node) => node.text())).toEqual(["'Sign up' link", "'Logo' link"]);

      const fills = wrapper.findAll('.topClickedElementBarFill');
      expect(fills[0].attributes('style')).toContain('width: 60%');
      expect(fills[1].attributes('style')).toContain('width: 40%');

      expect(wrapper.findAll('.topClickedElementPercent').map((n) => n.text()))
        .toEqual(['60%', '40%']);
      expect(wrapper.text()).not.toContain('HeatmapSessionRecording_NoClickedElements');
    });

    it('shows the empty state and a zero total when there are no clicked elements', async () => {
      const wrapper = factory({ numSamples: {} });
      await wrapper.setData({ actualNumSamples: {}, topClickedElements: [] });

      expect(wrapper.find('.recordingsValue').text()).toBe('0');
      expect(wrapper.findAll('.topClickedElementBarFill')).toHaveLength(0);
      expect(wrapper.text()).toContain('HeatmapSessionRecording_NoClickedElements');
    });
  });

  describe('device breakdown', () => {
    const allDeviceTypes = [
      { key: 1, name: 'Desktop' },
      { key: 2, name: 'Tablet' },
      { key: 3, name: 'Mobile' },
    ];

    it('renders a bar segment and legend entry per device with its sample share', async () => {
      const wrapper = factory({ deviceTypes: allDeviceTypes });
      await wrapper.setData({
        actualNumSamples: {
          nb_samples_device_1: 49,
          nb_samples_device_2: 17,
          nb_samples_device_3: 34,
        },
      });

      const segments = wrapper.findAll('.deviceBreakdownSegment');
      expect(segments).toHaveLength(3);
      expect(segments[0].attributes('style')).toContain('width: 49%');
      expect(segments[1].attributes('style')).toContain('width: 17%');
      expect(segments[2].attributes('style')).toContain('width: 34%');
      // The per-device color class is what links a segment to its legend swatch.
      expect(segments[0].classes()).toContain('deviceBreakdownDevice1');
      expect(segments[1].classes()).toContain('deviceBreakdownDevice2');
      expect(segments[2].classes()).toContain('deviceBreakdownDevice3');

      const swatches = wrapper.findAll('.deviceBreakdownSwatch');
      expect(swatches[0].classes()).toContain('deviceBreakdownDevice1');
      expect(swatches[1].classes()).toContain('deviceBreakdownDevice2');
      expect(swatches[2].classes()).toContain('deviceBreakdownDevice3');

      expect(wrapper.findAll('.deviceBreakdownLegendItem').map((node) => node.text()))
        .toEqual(['Desktop49%', 'Tablet17%', 'Mobile34%']);
    });

    it('keeps a zero-sample device in the legend with a zero-width segment', async () => {
      const wrapper = factory({ deviceTypes: allDeviceTypes });
      await wrapper.setData({
        actualNumSamples: { nb_samples_device_1: 3, nb_samples_device_3: 1 },
      });

      const segments = wrapper.findAll('.deviceBreakdownSegment');
      expect(segments).toHaveLength(3);
      expect(segments[0].attributes('style')).toContain('width: 75%');
      expect(segments[1].attributes('style')).toContain('width: 0%');
      expect(segments[2].attributes('style')).toContain('width: 25%');

      expect(wrapper.findAll('.deviceBreakdownLegendItem').map((node) => node.text()))
        .toEqual(['Desktop75%', 'Tablet0%', 'Mobile25%']);
    });

    it('replaces the breakdown with the waiting state when nothing has been '
      + 'recorded yet', async () => {
      const wrapper = factory({ deviceTypes: allDeviceTypes, numSamples: {} });
      await wrapper.setData({ actualNumSamples: {} });

      expect(wrapper.find('.deviceBreakdown').exists()).toBe(false);
      expect(wrapper.find('.recordingsEmpty').exists()).toBe(true);
    });

    it('computes shares numerically when the API returns counts as strings', async () => {
      // Regression: the metadata endpoint returns counts as strings; summing
      // them without coercion concatenates ("0" + "2" + "0" + "0" -> "0200"),
      // which showed as Desktop 1% / Tablet 0% / Mobile 0% instead of 100/0/0.
      const wrapper = factory({ deviceTypes: allDeviceTypes });
      await wrapper.setData({
        actualNumSamples: {
          nb_samples_device_1: '2',
          nb_samples_device_2: '0',
          nb_samples_device_3: '0',
        },
      });

      const segments = wrapper.findAll('.deviceBreakdownSegment');
      expect(segments[0].attributes('style')).toContain('width: 100%');
      expect(wrapper.findAll('.deviceBreakdownLegendItem').map((node) => node.text()))
        .toEqual(['Desktop100%', 'Tablet0%', 'Mobile0%']);
    });

    it('keeps the breakdown when only the selected device has no recordings', async () => {
      // The selected device (desktop by default) has no recordings, so the KPI
      // shows 0, but the all-device split still renders; the waiting state is
      // reserved for no recordings on any device.
      const wrapper = factory({ deviceTypes: allDeviceTypes, numSamples: {} });
      await wrapper.setData({
        actualNumSamples: { nb_samples_device_2: 5, nb_samples_device_3: '3' },
      });

      expect(wrapper.find('.recordingsValue').text()).toBe('0');
      expect(wrapper.find('.recordingsEmpty').exists()).toBe(false);
      expect(wrapper.find('.deviceBreakdown').exists()).toBe(true);
    });

    it('shows the selected device type next to the recordings title', async () => {
      const wrapper = factory({ deviceTypes: allDeviceTypes });

      expect(wrapper.find('.recordingsDeviceType').text()).toBe('Desktop');

      await wrapper.setData({ deviceType: 3 });

      expect(wrapper.find('.recordingsDeviceType').text()).toBe('Mobile');
    });
  });

  describe('heatmap viewport', () => {
    it('sizes the recording container to the device preview width inside the '
      + 'scroll area', async () => {
      // The scroll area flexes to the space next to the summary card; the
      // container must carry the device width itself so a wide preview scrolls
      // within the area and a narrow one centers, instead of pushing the card
      // off-screen.
      const wrapper = factory();

      const container = wrapper.find('.heatmapScrollArea .iframeRecordingContainer');
      expect(container.attributes('style')).toContain('width: 1280px');

      await wrapper.setData({ iframeWidth: 390 });

      expect(container.attributes('style')).toContain('width: 390px');
    });

    it('caps the scroll area so the report card ends at the window bottom', async () => {
      const wrapper = factory();

      // jsdom: every rect is 0 and innerHeight is 768, so the cap resolves to
      // innerHeight - 16; what matters is that the measured value is applied
      // as an inline max-height on the scroll area.
      (wrapper.vm as any).updateScrollAreaMaxHeight();
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).scrollAreaMaxHeight).toBe(window.innerHeight - 16);
      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .toContain(`max-height: ${window.innerHeight - 16}px`);
    });

    it('keeps the frame height at the unscaled recording height under the cap', async () => {
      // The frame must not shrink when the preview scales down: its height
      // follows the recording's unscaled height (window-width independent),
      // not the scaled content height.
      const wrapper = factory();
      await wrapper.setData({ scrollAreaMaxHeight: 700, recordingHeight: 600, previewScale: 0.5 });

      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .toContain('height: 600px');

      await wrapper.setData({ recordingHeight: 2000 });

      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .toContain('height: 700px');
    });

    it('never renders the frame shorter than the summary card beside it', async () => {
      // Once the frame is shorter than the card, shrinking further cannot
      // raise the report's bottom edge; the frame stops at the card's height
      // so both bottoms align above the delete button.
      const wrapper = factory();
      // updated() re-measures the card on every render, so stub the card's
      // rect instead of injecting state that the measurement would overwrite.
      wrapper.find('.heatmapSummaryCard').element.getBoundingClientRect = () => ({
        left: 0, right: 310, top: 0, bottom: 510, width: 310, height: 510, x: 0, y: 0, toJSON: () => ({}),
      } as DOMRect);
      await wrapper.setData({ scrollAreaMaxHeight: 400, recordingHeight: 2000 });

      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .toContain('height: 510px');
    });

    // The scale derives from the layout row's width (the frame hugs the
    // scaled snapshot, so its own width can't drive the computation); in
    // jsdom the summary card's rect and the frame chrome measure 0, so the
    // full row width is available to the preview.
    function withAreaWidth(wrapper: ReturnType<typeof factory>, clientWidth: number) {
      Object.defineProperty(
        (wrapper.vm.$refs.heatmapScrollArea as HTMLElement).parentElement as HTMLElement,
        'clientWidth',
        { value: clientWidth, configurable: true },
      );
    }

    it('scales a preview wider than the viewing area down to fit', async () => {
      const wrapper = factory();
      withAreaWidth(wrapper, 900);
      await wrapper.setData({ recordingHeight: 2000 });

      (wrapper.vm as any).updatePreviewScale();
      await wrapper.vm.$nextTick();

      // 900 / 1280, rounded to 4 decimals like the replay player (jsdom's
      // scrollbar probe measures 0, like overlay/hidden-scrollbar browsers,
      // so no gutter allowance is subtracted)
      expect((wrapper.vm as any).previewScale).toBe(0.7031);

      const container = wrapper.find('.iframeRecordingContainer');
      expect(container.attributes('style')).toContain('transform: scale(0.7031)');
      // layout box reserves the scaled footprint so nothing scrolls or wraps
      const box = wrapper.find('.heatmapScaleBox');
      expect(box.attributes('style')).toContain('width: 900px');
      expect(box.attributes('style')).toContain('height: 1406px');
    });

    it('keeps previews narrower than the viewing area at full size', async () => {
      const wrapper = factory();
      withAreaWidth(wrapper, 900);
      await wrapper.setData({ iframeWidth: 600 });

      (wrapper.vm as any).updatePreviewScale();
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).previewScale).toBe(1);
      expect(wrapper.find('.iframeRecordingContainer').attributes('style'))
        .not.toContain('transform');
      expect(wrapper.find('.heatmapScaleBox').attributes('style'))
        .toContain('width: 600px');
    });

    it('reserves the scrollbar gutter only when the preview overflows the frame', async () => {
      const wrapper = factory();
      withAreaWidth(wrapper, 900);
      // classic-scrollbar environment: the bar consumes 10px of layout
      jest.spyOn(wrapper.vm as any, 'getScrollbarGutterWidth').mockReturnValue(10);
      await wrapper.setData({ scrollAreaMaxHeight: 700, recordingHeight: 2000 });

      (wrapper.vm as any).updatePreviewScale();
      await wrapper.vm.$nextTick();

      // 0.7031 * 2000 exceeds the 700px frame: scrollbar needed, so the
      // scale accounts for its 10px gutter ((900 - 10) / 1280)
      expect((wrapper.vm as any).previewScale).toBe(0.6953);
      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .not.toContain('overflow-y');
    });

    it('drops the scrollbar when the scaled preview fits the frame', async () => {
      const wrapper = factory();
      withAreaWidth(wrapper, 900);
      await wrapper.setData({ scrollAreaMaxHeight: 700, recordingHeight: 900 });

      (wrapper.vm as any).updatePreviewScale();
      await wrapper.vm.$nextTick();

      // 0.7031 * 900 fits within the 700px frame: no vertical scrolling is
      // possible, so no gutter is reserved and overflow-y is hidden
      expect((wrapper.vm as any).previewScale).toBe(0.7031);
      expect(wrapper.find('.heatmapScrollArea').attributes('style'))
        .toContain('overflow-y: hidden');
    });
  });

  describe('getTopClickedElements', () => {
    const fullRect = {
      left: 0, right: 100, top: 0, bottom: 100,
    };

    function dataPoints(data: Array<Record<string, unknown>>) {
      return { min: 0, max: 0, data };
    }

    it('aggregates clicks inside an element and computes its share', () => {
      const link = elementAt('<a href="#">Sign up</a>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [link]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([
          {
            x: 10, y: 10, value: '3', selector: '.cta',
          },
          {
            x: 20, y: 20, value: '2', selector: '.cta',
          },
        ]),
        recordingIframe,
        5,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'Sign up' link");
      expect(result[0].count).toBe(5);
      expect(result[0].percent).toBe(100);
      expect(result[0].percentLabel).toBe('100%');
    });

    it('attributes clicks on a nested child to its interactive ancestor', () => {
      // Regression: a recorded click selector can resolve to a non-interactive
      // child (e.g. the <span> inside a link). It must roll up to the link, not
      // be reported as its own element or dropped.
      const link = elementAt('<a href="#">Buy now <span class="inner">!</span></a>', fullRect);
      const child = link.querySelector('.inner') as HTMLElement;
      const recordingIframe = { findElement: jest.fn(() => [child]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '4', selector: '.cta .inner',
        }]),
        recordingIframe,
        4,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'Buy now !' link");
      expect(result[0].count).toBe(4);
    });

    it('credits an image wrapper to the link it wraps, labelled as an image', () => {
      // A thumbnail card wraps a single <a><img></a>; the recorded click lands on
      // the wrapper div, which has no text or attributes of its own. It should
      // roll up to the link, take the image's title as its label, and be typed as
      // an image (not a link) since the visitor clicked the picture.
      const card = elementAt(
        '<div class="visual"><a href="/km-black-manta"><img title="KM Black Manta"></a></div>',
        fullRect,
      );
      const link = card.querySelector('a') as HTMLElement;
      link.getBoundingClientRect = card.getBoundingClientRect;
      const recordingIframe = { findElement: jest.fn(() => [card]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10,
          y: 10,
          value: '5',
          selector: 'article#post-10 > div > div:nth-child(62) > div.visual',
        }]),
        recordingIframe,
        5,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'KM Black Manta' image");
      expect(result[0].count).toBe(5);
    });

    it('labels an element by its descendant text when the text is wrapped in a child', () => {
      const link = elementAt('<a href="#"><span>Buy now</span></a>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [link]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '2', selector: '.cta',
        }]),
        recordingIframe,
        2,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'Buy now' link");
    });

    it('merges clicks on the same element hit via different child selectors', () => {
      // Regression: a link/button without an id or name is often recorded under
      // different selectors depending on which child node was hit. Those clicks
      // must roll up to one ranked entry keyed by the resolved element, not be
      // split into duplicates keyed by the raw click selector.
      const link = elementAt(
        '<a href="#">Buy <span class="label">now</span><svg class="icon"></svg></a>',
        fullRect,
      );
      const label = link.querySelector('.label') as HTMLElement;
      const icon = link.querySelector('.icon') as HTMLElement;
      const recordingIframe = {
        findElement: jest.fn(
          (selector: string) => (selector === '.cta .icon' ? [icon] : [label]),
        ),
      };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([
          {
            x: 10, y: 10, value: '3', selector: '.cta .label',
          },
          {
            x: 20, y: 20, value: '2', selector: '.cta .icon',
          },
        ]),
        recordingIframe,
        5,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'Buy now' link");
      expect(result[0].count).toBe(5);
    });

    it('ignores data points without a selector or without clicks', () => {
      const recordingIframe = { findElement: jest.fn(() => null) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([
          {
            x: 1, y: 1, value: '0', selector: '.a',
          },
          {
            x: 1, y: 1, value: '5', selector: '',
          },
        ]),
        recordingIframe,
        5,
      );

      expect(result).toHaveLength(0);
      expect(recordingIframe.findElement).not.toHaveBeenCalled();
    });

    it('keeps only the five most clicked elements', () => {
      // Siblings in one tree (as they would be in the recording iframe), so each
      // resolves to a distinct element rather than colliding on an identical path.
      const container = document.createElement('div');
      const elements: Record<string, HTMLElement> = {};
      const data: Array<Record<string, unknown>> = [];
      'abcdefg'.split('').forEach((char, index) => {
        const left = index * 100;
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.textContent = char;
        anchor.getBoundingClientRect = () => ({
          left,
          right: left + 50,
          top: 0,
          bottom: 50,
          width: 50,
          height: 50,
          x: left,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);
        container.appendChild(anchor);
        elements[`.${char}`] = anchor;
        // Higher index => more clicks, so g/f/e/d/c should win over b/a.
        data.push({
          x: left + 10, y: 10, value: String(index + 1), selector: `.${char}`,
        });
      });
      const recordingIframe = { findElement: jest.fn((selector: string) => [elements[selector]]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints(data), recordingIframe, 28,
      );

      expect(result).toHaveLength(5);
      expect(result.map((r: any) => r.label))
        .toEqual(["'g' link", "'f' link", "'e' link", "'d' link", "'c' link"]);
    });

    it('reports a zero share when there are no recordings to divide by', () => {
      const link = elementAt('<a href="#">Sign up</a>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [link]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '3', selector: '.cta',
        }]),
        recordingIframe,
        0,
      );

      expect(result[0].percent).toBe(0);
      expect(result[0].percentLabel).toBe('0%');
    });

    it('keeps a clicked element via its selector count when its click falls outside its box', () => {
      // The recorded offset lands outside the element's (small) box, so the
      // geometric pass attributes nothing; the selector-based count must keep the
      // genuinely clicked element from being dropped.
      const offscreen = elementAt('<a href="#">Newsletter</a>', {
        left: 1000, right: 1100, top: 1000, bottom: 1100,
      });
      const recordingIframe = { findElement: jest.fn(() => [offscreen]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '3', selector: '.cta',
        }]),
        recordingIframe,
        3,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'Newsletter' link");
      expect(result[0].count).toBe(3);
    });

    it('falls back to container elements when fewer than five interactive ones are found', () => {
      // A generic container with children is normally excluded, but when the
      // strict (interactive-only) pass leaves the card sparse it is included so
      // the summary is not left mostly empty.
      const container = elementAt('<div>Hero banner <span>x</span></div>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [container]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '7', selector: '.hero',
        }]),
        recordingIframe,
        7,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Hero banner');
      expect(result[0].count).toBe(7);
    });

    it('attributes a click only to the innermost candidate when candidates nest', () => {
      // Fallback mode keeps both a container and the link inside it. A click on
      // the link must count for the link alone, not also inflate the container;
      // clicks on the container outside the link stay with the container.
      const nav = elementAt('<nav id="menu"><a href="#">Home</a></nav>', fullRect);
      const link = nav.querySelector('a') as HTMLElement;
      link.getBoundingClientRect = () => ({
        left: 0,
        right: 40,
        top: 0,
        bottom: 20,
        width: 40,
        height: 20,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);
      const recordingIframe = {
        findElement: jest.fn((selector: string) => (selector === '.nav a' ? [link] : [nav])),
      };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([
          {
            x: 10, y: 10, value: '3', selector: '.nav a',
          },
          {
            x: 90, y: 90, value: '2', selector: '.nav',
          },
        ]),
        recordingIframe,
        5,
      );

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe("'Home' link");
      expect(result[0].count).toBe(3);
      expect(result[0].percent).toBe(60);
      expect(result[1].label).toBe("'menu' navigation");
      expect(result[1].count).toBe(2);
      expect(result[1].percent).toBe(40);
    });

    it('treats structural containers like aside as fallback-only, never preferred', () => {
      // Regression: aside/table were missing from the generic-container list, so
      // a clickable sidebar counted as a preferred element and could displace
      // genuine links from the interactive-only ranking.
      const container = document.createElement('div');
      const elements: Record<string, HTMLElement> = {};
      const data: Array<Record<string, unknown>> = [];
      'abcde'.split('').forEach((char, index) => {
        const left = index * 100;
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.textContent = char;
        anchor.getBoundingClientRect = () => ({
          left,
          right: left + 50,
          top: 0,
          bottom: 50,
          width: 50,
          height: 50,
          x: left,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);
        container.appendChild(anchor);
        elements[`.${char}`] = anchor;
        data.push({
          x: left + 10, y: 10, value: String(index + 1), selector: `.${char}`,
        });
      });
      // The sidebar receives by far the most clicks, but with five interactive
      // elements available it must not enter the ranking at all.
      const aside = elementAt('<aside id="related"><p>Related</p></aside>', {
        left: 1000, right: 1200, top: 0, bottom: 400,
      });
      elements['.related'] = aside;
      data.push({
        x: 1010, y: 10, value: '99', selector: '.related',
      });
      const recordingIframe = { findElement: jest.fn((selector: string) => [elements[selector]]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints(data), recordingIframe, 114,
      );

      expect(result).toHaveLength(5);
      expect(result.map((r: any) => r.label))
        .toEqual(["'e' link", "'d' link", "'c' link", "'b' link", "'a' link"]);
    });

    it('surfaces an aside via the container fallback with its semantic type', () => {
      const aside = elementAt('<aside id="related"><p>Related</p></aside>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [aside]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '3', selector: '.related',
        }]),
        recordingIframe,
        3,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'related' sidebar");
    });

    it('labels structural container elements with their semantic type', () => {
      const nav = elementAt('<nav id="menu"><a href="#">Home</a></nav>', fullRect);
      const recordingIframe = { findElement: jest.fn(() => [nav]) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getTopClickedElements(
        dataPoints([{
          x: 10, y: 10, value: '4', selector: '.nav',
        }]),
        recordingIframe,
        4,
      );

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("'menu' navigation");
    });
  });

  describe('getHeatmapDataPoints', () => {
    it('maps resolvable rows to data points and aggregates the totals', () => {
      const recordingIframe = {
        getCoordinatesInFrame: jest.fn(() => ({ x: 1, y: 2, value: '' })),
      };
      const wrapper = factory();

      const result = (wrapper.vm as any).getHeatmapDataPoints(
        [
          {
            selector: '.a', value: '5', offset_x: 0, offset_y: 0,
          },
          {
            selector: '.b', value: '1', offset_x: 0, offset_y: 0,
          },
          {
            selector: '', value: '9', offset_x: 0, offset_y: 0,
          },
        ],
        recordingIframe,
      );

      expect(result.dataPoints.data).toHaveLength(2);
      expect(result.totalValue).toBe(6);
      expect(result.numEntriesHigherThan1).toBe(1);
      expect(result.dataPoints.data[0].selector).toBe('.a');
    });

    it('skips rows whose coordinates cannot be resolved', () => {
      const recordingIframe = { getCoordinatesInFrame: jest.fn(() => null) };
      const wrapper = factory();

      const result = (wrapper.vm as any).getHeatmapDataPoints(
        [{
          selector: '.a', value: '5', offset_x: 0, offset_y: 0,
        }],
        recordingIframe,
      );

      expect(result.dataPoints.data).toHaveLength(0);
      expect(result.totalValue).toBe(0);
    });
  });

  describe('getScrollReach', () => {
    const rows = [
      { label: '0', value: '10' },
      { label: '250', value: '30' },
      { label: '500', value: '20' },
      { label: '750', value: '15' },
      { label: '1000', value: '25' },
    ];

    it('returns cumulative reach at each mark (Top counts every visit)', () => {
      const wrapper = factory();

      const result = (wrapper.vm as any).getScrollReach(rows);

      expect(result.map((b: any) => b.key)).toEqual(['top', 'q25', 'q50', 'q75', 'bottom']);
      // total 100: reached >=0 = 100, >=250 = 90, >=500 = 60, >=750 = 40, >=1000 = 25
      expect(result.map((b: any) => b.percent)).toEqual([100, 90, 60, 40, 25]);
      expect(result[0].percentLabel).toBe('100%');
      expect(result[1].label).toBe('25%');
    });

    it('counts a visit whose max scroll lands exactly on a mark as having reached it', () => {
      const wrapper = factory();

      const result = (wrapper.vm as any).getScrollReach([{ label: '250', value: '1' }]);

      expect(result.map((b: any) => b.percent)).toEqual([100, 100, 0, 0, 0]);
    });

    it('returns no bands when there is no scroll data', () => {
      const wrapper = factory();

      expect((wrapper.vm as any).getScrollReach([])).toEqual([]);
    });

    it('counts a near-1000 depth as having reached the bottom', () => {
      // A page fully visible in the visitor's viewport tracks a depth just
      // short of 1000‰ (the tracker's document height is padded by body
      // margins/scrollbars) — e.g. a single visit at 991 must not report
      // "Bottom 0%" while the visualization paints the whole page as seen.
      const wrapper = factory();

      const result = (wrapper.vm as any).getScrollReach([{ label: '991', value: '1' }]);

      expect(result.map((b: any) => b.percent)).toEqual([100, 100, 100, 100, 100]);
    });

    it('does not count a mid-page depth as having reached the bottom', () => {
      const wrapper = factory();

      const result = (wrapper.vm as any).getScrollReach([{ label: '631', value: '1' }]);

      expect(result.map((b: any) => b.percent)).toEqual([100, 100, 100, 0, 0]);
    });
  });

  describe('applyScrollReach (stale-fetch guard)', () => {
    // total 20: reached >=0 = 20, >=250 = 10, >=500 = 10, >=750 = 0, >=1000 = 0
    const rows = [
      { label: '0', value: '10' },
      { label: '500', value: '10' },
    ];

    it('applies the scroll reach when it belongs to the current fetch', () => {
      const wrapper = factory();
      (wrapper.vm as any).fetchGeneration = 3;

      (wrapper.vm as any).applyScrollReach(rows, 3);
      (wrapper.vm as any).applyScrollReach(rows, 3);

      expect((wrapper.vm as any).scrollReach.map((b: any) => b.percent))
        .toEqual([100, 50, 50, 0, 0]);
    });

    it('ignores a superseded response so a stale fetch cannot overwrite the card', () => {
      const wrapper = factory();
      (wrapper.vm as any).scrollReach = [];
      // A newer fetch has already started (generation moved on) while an older
      // request is still in flight.
      (wrapper.vm as any).fetchGeneration = 4;

      (wrapper.vm as any).applyScrollReach(rows, 3);

      expect((wrapper.vm as any).scrollReach).toEqual([]);
    });
  });

  describe('empty state', () => {
    it('shows the "no interactions" state (with the summary card) when nothing was '
      + 'recorded', () => {
      const wrapper = factory({ hasSnapshot: false, snapshotDeleted: false });

      expect((wrapper.vm as any).emptyStateKey).toBe('noInteractions');
      expect(wrapper.find('.heatmapEmptyState').exists()).toBe(true);
      // the "waiting for first recording" card still shows in this state
      expect(wrapper.find('.heatmapSummaryCard').exists()).toBe(true);
    });

    it('shows the automatic-retake deleted state with a recordings-only summary card', () => {
      const wrapper = factory({
        hasSnapshot: false, snapshotDeleted: true, isActive: true, captureManually: false,
      });

      expect((wrapper.vm as any).emptyStateKey).toBe('deletedAuto');
      expect(wrapper.find('.heatmapEmptyState').exists()).toBe(true);
      // Product wants the recordings summary shown, but clicks/scroll need the DOM,
      // so those sections are hidden while there is no snapshot.
      expect(wrapper.find('.heatmapSummaryCard').exists()).toBe(true);
      expect(wrapper.find('.scrollReachHeader').exists()).toBe(false);
    });

    it('shows the manual-retake deleted state with the capture snippet', () => {
      const wrapper = factory({
        hasSnapshot: false, snapshotDeleted: true, isActive: true, captureManually: true,
      });

      expect((wrapper.vm as any).emptyStateKey).toBe('deletedManual');
      expect(wrapper.find('.heatmapEmptyStateCode').text())
        .toContain("_paq.push(['HeatmapSessionRecording::captureInitialDom', 1])");
    });

    it('shows the no-retake deleted state for a heatmap that finished recording', () => {
      const wrapper = factory({
        hasSnapshot: false, snapshotDeleted: true, isActive: false,
      });

      expect((wrapper.vm as any).emptyStateKey).toBe('deletedNoRetake');
      expect(wrapper.find('.heatmapEmptyStateCode').exists()).toBe(false);
    });

    it('shows the paused deleted state (resumable) rather than the ended one', () => {
      const wrapper = factory({
        hasSnapshot: false, snapshotDeleted: true, isActive: false, isPaused: true,
      });

      expect((wrapper.vm as any).emptyStateKey).toBe('deletedPaused');
      expect(wrapper.find('.heatmapEmptyStateCode').exists()).toBe(false);
    });
  });
});
