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
import { nextTick } from 'vue';

jest.mock('CoreHome', () => ({
  translate: (key: string) => key,
  NumberFormatter: {
    formatNumber: (value: number) => `${value}`,
    formatPercent: (value: number) => `${value}%`,
  },
}), { virtual: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Tooltip = require('./Tooltip.vue').default;

function factory() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mount(Tooltip as any, {
    props: { clickCount: 3, clickRate: 50 },
  });
}

function rect(overrides: Partial<DOMRect>): () => DOMRect {
  return () => ({
    left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}),
    ...overrides,
  } as DOMRect);
}

describe('HeatmapSessionRecording/Tooltip', () => {
  it('positions itself at the cursor in viewport coordinates', async () => {
    const wrapper = factory();
    // Page scroll must not shift the tooltip: it is position: fixed, so the
    // cursor's client coordinates apply directly. Adding the scroll offset
    // (document coordinates) is what used to misplace the tooltip, since the
    // positioned report card resolved those against its own origin instead
    // of the document's.
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollX', { value: 200, configurable: true });

    (wrapper.vm as any).show({ clientX: 100, clientY: 40 } as unknown as MouseEvent);
    await nextTick();

    expect(wrapper.element.style.position).toBe('fixed');
    expect(wrapper.element.style.left).toBe('110px');
    expect(wrapper.element.style.top).toBe('50px');
  });

  it('flips to the other side of the cursor at the viewport edges', async () => {
    const wrapper = factory();
    // jsdom viewport is 1024x768; simulate a tooltip that would overflow both
    // the right and bottom edges from the given cursor position.
    ((wrapper.vm as any).tooltipRef as HTMLElement).getBoundingClientRect = rect({
      left: 1010, top: 710, right: 1160, bottom: 790, width: 150, height: 80,
    });

    (wrapper.vm as any).show({ clientX: 1000, clientY: 700 } as unknown as MouseEvent);
    await nextTick();
    await nextTick();

    expect(wrapper.element.style.left).toBe(`${1000 - 150 - 10}px`);
    expect(wrapper.element.style.top).toBe(`${700 - 80 - 10}px`);
  });
});
