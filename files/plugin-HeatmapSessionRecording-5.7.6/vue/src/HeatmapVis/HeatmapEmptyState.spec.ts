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

jest.mock('CoreHome', () => ({
  translate: (key: string) => key,
  externalRawLink: (url: string) => `${url}?campaign`,
  // no-op stand-in for the v-copy-to-clipboard directive used by the snippet
  CopyToClipboard: {},
}), { virtual: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HeatmapEmptyState = require('./HeatmapEmptyState.vue').default;

function factory(state: string, idSiteHsr = 22) {
  return mount(HeatmapEmptyState as any, {
    props: { state, idSiteHsr },
    global: {
      // `translate` is a global property in a real Matomo Vue app.
      mocks: { translate: (key: string) => key },
    },
  });
}

describe('HeatmapSessionRecording/HeatmapEmptyState', () => {
  it('shows the database icon and "no interactions" copy, with the summary-card context', () => {
    const wrapper = factory('noInteractions');

    expect(wrapper.find('img').attributes('src')).toContain('no-interactions.svg');
    expect(wrapper.find('.icon-delete').exists()).toBe(false);
    expect(wrapper.find('.heatmapEmptyStateTitle').text())
      .toBe('HeatmapSessionRecording_EmptyStateNoInteractionsTitle');
    expect(wrapper.find('.heatmapEmptyStateSubtitle').text())
      .toBe('HeatmapSessionRecording_EmptyStateNoInteractionsSubtitle');
    // no manual-retake snippet in this state
    expect(wrapper.find('.heatmapEmptyStateCode').exists()).toBe(false);
  });

  it('uses the trash icon and "snapshot deleted" title for every deleted state', () => {
    ['deletedAuto', 'deletedManual', 'deletedPaused', 'deletedNoRetake'].forEach((state) => {
      const wrapper = factory(state);
      expect(wrapper.find('.icon-delete').exists()).toBe(true);
      expect(wrapper.find('img').exists()).toBe(false);
      expect(wrapper.find('.heatmapEmptyStateTitle').text())
        .toBe('HeatmapSessionRecording_EmptyStateSnapshotDeletedTitle');
    });
  });

  it('shows the matching subtitle for each deleted state', () => {
    const subtitles: Record<string, string> = {
      deletedAuto: 'HeatmapSessionRecording_EmptyStateSnapshotDeletedAutoSubtitle',
      deletedManual: 'HeatmapSessionRecording_EmptyStateSnapshotDeletedManualSubtitle',
      deletedPaused: 'HeatmapSessionRecording_EmptyStateSnapshotDeletedPausedSubtitle',
      deletedNoRetake: 'HeatmapSessionRecording_EmptyStateSnapshotDeletedEndedSubtitle',
    };

    Object.entries(subtitles).forEach(([state, key]) => {
      expect(factory(state).find('.heatmapEmptyStateSubtitle').text()).toBe(key);
    });
  });

  it('shows the capture snippet (with the real id) and a campaign guide link only for manual', () => {
    const manual = factory('deletedManual', 22);
    expect(manual.find('.heatmapEmptyStateCode').text())
      .toContain("_paq.push(['HeatmapSessionRecording::captureInitialDom', 22])");
    const guide = manual.find('.heatmapEmptyStateGuide');
    expect(guide.exists()).toBe(true);
    // externalRawLink adds the matomo.org campaign parameters to the FAQ URL
    expect(guide.attributes('href')).toContain('campaign');

    // the automatic state offers neither the snippet nor the guide link
    const auto = factory('deletedAuto');
    expect(auto.find('.heatmapEmptyStateCode').exists()).toBe(false);
    expect(auto.find('.heatmapEmptyStateGuide').exists()).toBe(false);
  });
});
