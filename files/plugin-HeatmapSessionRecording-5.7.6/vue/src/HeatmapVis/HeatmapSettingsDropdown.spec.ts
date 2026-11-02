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

const mockMatomo: { heatmapWriteAccess: boolean; heatmapAdminAccess: boolean } = {
  heatmapWriteAccess: true,
  heatmapAdminAccess: true,
};

jest.mock('CoreHome', () => ({
  translate: (key: string) => key,
  Matomo: mockMatomo,
  // Render the slotted items so their v-if visibility can be asserted.
  MenuItemsDropdown: {
    name: 'MenuItemsDropdown',
    template: '<div class="menuDropdown"><slot /></div>',
  },
}), { virtual: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HeatmapSettingsDropdown = require('./HeatmapSettingsDropdown.vue').default;

function factory(props: Record<string, unknown> = {}) {
  return mount(HeatmapSettingsDropdown as any, {
    props: {
      editUrl: 'index.php?module=HeatmapSessionRecording&action=manageHeatmap',
      hasSnapshot: true,
      isExporting: false,
      ...props,
    },
    global: {
      // `translate` is a global property in a real Matomo Vue app, so the
      // template references it without importing it.
      mocks: { translate: (key: string) => key },
    },
  });
}

describe('HeatmapSessionRecording/HeatmapSettingsDropdown', () => {
  beforeEach(() => {
    mockMatomo.heatmapWriteAccess = true;
    mockMatomo.heatmapAdminAccess = true;
  });

  it('is not rendered for users without write access', () => {
    mockMatomo.heatmapWriteAccess = false;
    const wrapper = factory();

    expect(wrapper.find('.heatmapSettingsDropdown').exists()).toBe(false);
  });

  it('always offers the edit link pointing at the edit screen', () => {
    const wrapper = factory();

    const edit = wrapper.find('a.item');
    expect(edit.exists()).toBe(true);
    expect(edit.attributes('href')).toContain('action=manageHeatmap');
  });

  it('shows export (admin only) and delete when a snapshot exists', () => {
    const wrapper = factory();

    const actions = wrapper.findAll('.item[data-action]').map((n) => n.attributes('data-action'));
    expect(actions).toEqual(['export', 'delete']);
  });

  it('hides the export item for non-admin users', () => {
    mockMatomo.heatmapAdminAccess = false;
    const wrapper = factory();

    const actions = wrapper.findAll('.item[data-action]').map((n) => n.attributes('data-action'));
    expect(actions).toEqual(['delete']);
  });

  it('hides export and delete when there is no snapshot', () => {
    const wrapper = factory({ hasSnapshot: false });

    expect(wrapper.findAll('.item[data-action]')).toHaveLength(0);
    expect(wrapper.find('a.item').exists()).toBe(true);
  });

  it('emits export and delete when the matching item is selected', () => {
    const wrapper = factory();

    const exportItem = wrapper.find('.item[data-action="export"]').element as HTMLElement;
    (wrapper.vm as any).onSelect(exportItem);
    const deleteItem = wrapper.find('.item[data-action="delete"]').element as HTMLElement;
    (wrapper.vm as any).onSelect(deleteItem);

    expect(wrapper.emitted('export')).toHaveLength(1);
    expect(wrapper.emitted('delete')).toHaveLength(1);
  });

  it('says "retake" only when the heatmap can still retake', () => {
    expect(factory({ isActive: true }).find('.item[data-action="delete"]').text())
      .toBe('HeatmapSessionRecording_DeleteRetakeSnapshot');

    // ended/paused heatmaps cannot retake, so the item is a plain delete
    expect(factory({ isActive: false }).find('.item[data-action="delete"]').text())
      .toBe('HeatmapSessionRecording_DeleteSnapshotConfirm');
  });

  it('does not emit export while an export is already in progress', () => {
    const wrapper = factory({ isExporting: true });

    const exportItem = wrapper.find('.item[data-action="export"]').element as HTMLElement;
    (wrapper.vm as any).onSelect(exportItem);

    expect(wrapper.emitted('export')).toBeUndefined();
  });

  it('turns the trigger into a spinner + progress message while exporting', () => {
    const idle = factory();
    expect((idle.vm as any).menuTitle).toContain('icon-configure');
    expect(idle.classes()).not.toContain('is-exporting');

    const exporting = factory({ isExporting: true });
    expect((exporting.vm as any).menuTitle).toContain('heatmapSettingsSpinner');
    expect((exporting.vm as any).menuTitle).toContain('HeatmapSessionRecording_ExportImageInProgress');
    expect(exporting.classes()).toContain('is-exporting');
  });
});
