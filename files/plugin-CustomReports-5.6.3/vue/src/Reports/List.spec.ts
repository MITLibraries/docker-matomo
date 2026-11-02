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

// this repo resolves tslib 1.14.1, which predates __spreadArray, while tsconfig sets
// importHelpers — so the array spread in the component under test calls a helper that does not
// exist here. Dense arrays are all this spec feeds it, so concat is a faithful stand-in.
jest.mock('tslib', () => ({
  ...jest.requireActual('tslib'),
  __spreadArray: (to: unknown[], from: unknown[]) => to.concat(Array.prototype.slice.call(from)),
}));

jest.mock('CoreHome', () => ({
  Matomo: {
    helper: { htmlEntities: (v: string) => v },
    hasSuperUserAccess: true,
    postEvent: () => undefined,
    on: () => undefined,
    off: () => undefined,
  },
  ContentBlock: { template: '<div><slot /></div>' },
  ContentTable: {},
  MatomoUrl: { stringify: () => '', parsed: { value: {} }, urlParsed: { value: {} } },
  NotificationType: {},
  NotificationsStore: { remove: () => undefined },
  externalRawLink: (url: string) => url,
  useExternalPluginComponent: () => ({ template: '<div />' }),
  importPluginUmd: () => Promise.resolve({}),
}), { virtual: true });

jest.mock('CorePluginsAdmin', () => ({ Field: {} }), { virtual: true });

const storeState = {
  reports: [] as unknown[],
  reportTypesReadable: { table: 'Table' },
  isLoading: false,
  isUpdating: false,
};

jest.mock('../CustomReports.store', () => ({
  __esModule: true,
  default: {
    state: { value: storeState },
    fetchReports: () => Promise.resolve(),
    getAvailableReportTypes: () => Promise.resolve([]),
    reload: () => Promise.resolve(),
    deleteReport: () => Promise.resolve(),
    pauseReport: () => Promise.resolve(),
    resumeReport: () => Promise.resolve(),
  },
}), { virtual: true });

import { mount } from '@vue/test-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const List = require('./List.vue').default;

interface SearchContext {
  reports: unknown[];
  searchFilter: string;
  translate: (key: string) => string;
}

function report(overrides: Record<string, unknown>) {
  return {
    idcustomreport: 1,
    name: 'A report',
    description: '',
    report_type: 'table',
    category: { id: 'CustomReports_CustomReports', name: 'Custom Reports' },
    subcategory: null,
    idsite: 1,
    linkIdSite: 1,
    subcategoryLink: '1',
    multiple_idsites: null,
    allowedToEdit: true,
    status: 'active',
    created_by: 'alice',
    updated_by: 'alice',
    created_date_pretty: 'Jan 2, 2016',
    updated_date_pretty: 'Jan 2, 2016',
    ...overrides,
  };
}

// sortedReports only reads these three off the instance, so calling it with a stand-in context
// exercises the filter without mounting the whole management screen
function search(reports: unknown[], searchFilter: string) {
  const context: SearchContext = {
    reports,
    searchFilter,
    translate: (key: string) => (key === 'General_Unknown' ? 'Unknown' : key),
  };

  return List.computed.sortedReports.call(context)
    .map((r: { idcustomreport: number }) => r.idcustomreport);
}

describe('CustomReports/List search filter', () => {
  it('matches a report by the login that created it', () => {
    const reports = [
      report({ idcustomreport: 1, created_by: 'alice' }),
      report({ idcustomreport: 2, created_by: 'bob', updated_by: 'bob' }),
    ];

    expect(search(reports, 'bob')).toEqual([2]);
  });

  it('matches reports with no creator by searching for "Unknown"', () => {
    const reports = [
      report({ idcustomreport: 1, created_by: 'alice', updated_by: 'alice' }),
      report({ idcustomreport: 2, created_by: null, updated_by: 'alice' }),
      report({ idcustomreport: 3, created_by: 'alice', updated_by: null }),
    ];

    // the word stands in for both missing creators and missing last updaters, because that is
    // what the table displays in either case
    expect(search(reports, 'unknown')).toEqual([2, 3]);
  });

  it('does not match a stored login against the word shown for a missing one', () => {
    const reports = [report({ idcustomreport: 1, created_by: 'alice', updated_by: 'alice' })];

    expect(search(reports, 'unknown')).toEqual([]);
  });

  it('returns matches ordered by report id', () => {
    const reports = [
      report({ idcustomreport: 30, created_by: 'alice' }),
      report({ idcustomreport: 4, created_by: 'alice' }),
      report({ idcustomreport: 100, created_by: 'alice' }),
    ];

    expect(search(reports, 'alice')).toEqual([4, 30, 100]);
  });
});

describe('CustomReports/List creator and date columns', () => {
  function mountList(reports: unknown[]) {
    storeState.reports = reports;

    return mount(List, {
      global: {
        mocks: { translate: (key: string) => (key === 'General_Unknown' ? 'Unknown' : key) },
        stubs: { Field: true, EntityDuplicatorModal: true, EntityDuplicatorAction: true },
        directives: { ContentTable: {} },
      },
    });
  }

  it('shows the stored login and formatted date in each cell', () => {
    const wrapper = mountList([report({
      created_by: 'alice',
      updated_by: 'bob',
      created_date_pretty: 'Jan 2, 2016',
      updated_date_pretty: 'Mar 4, 2016',
    })]);

    expect(wrapper.find('td.manageReports__createdBy').text()).toBe('alice');
    expect(wrapper.find('td.manageReports__updatedBy').text()).toBe('bob');
    expect(wrapper.find('td.manageReports__createdDate').text()).toBe('Jan 2, 2016');
    expect(wrapper.find('td.manageReports__lastUpdated').text()).toBe('Mar 4, 2016');
  });

  it('shows "Unknown" with a help link when no login is stored', () => {
    const wrapper = mountList([report({ created_by: null, updated_by: null })]);
    const createdBy = wrapper.find('td.manageReports__createdBy');

    expect(createdBy.text()).toContain('Unknown');

    const help = createdBy.find('a.manageReports__unknownUserHelp');
    expect(help.exists()).toBe(true);
    expect(help.attributes('href'))
      .toContain('why-the-created-by-field-shows-unknown-for-some-custom-reports');
    // the link leaves Matomo, so it must not hand the target window an opener
    expect(help.attributes('target')).toBe('_blank');
    expect(help.attributes('rel')).toContain('noopener');
  });

  it('does not render a help link when the login is known', () => {
    const wrapper = mountList([report({ created_by: 'alice', updated_by: 'alice' })]);

    expect(wrapper.find('a.manageReports__unknownUserHelp').exists()).toBe(false);
  });
});
