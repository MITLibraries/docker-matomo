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

const modalConfirm = jest.fn();

const mockMatomo = {
  token_auth: 'the-token-from-the-matomo-global',
  helper: { modalConfirm },
};

jest.mock('CoreHome', () => ({
  translate: (key: string) => key,
  externalRawLink: (url: string) => url,
  Matomo: mockMatomo,
  MatomoUrl: { stringify: () => '', urlParsed: { value: {} } },
  ContentBlock: {
    name: 'ContentBlock',
    template: '<div class="contentBlock"><slot /></div>',
  },
  Notification: {
    name: 'Notification',
    template: '<div class="notification"><slot /></div>',
  },
  // registered as directives, so an object with no hooks is enough to mount
  ContentTable: {},
  Tooltips: {},
}), { virtual: true });

jest.mock('CorePluginsAdmin', () => ({
  Field: { name: 'Field', template: '<div class="field" />' },
}), { virtual: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Configuration = require('./Configuration.vue').default;

const removeClientConfigUrl = 'index.php?module=SearchEngineKeywordsPerformance'
  + '&action=removeYandexClientConfig';

function factory(props: Record<string, unknown> = {}) {
  return mount(Configuration as any, {
    props: {
      isClientConfigured: true,
      isClientConfigurable: true,
      isOAuthConfigured: false,
      clientId: 'the-client-id',
      clientSecret: 'the-client-secret',
      configuredMeasurables: {},
      sitesInfos: {},
      currentSite: { id: 1, name: 'Site 1' },
      urlOptions: {},
      accounts: {},
      auth_nonce: 'the-auth-nonce',
      formNonce: 'the-form-nonce',
      addYandexSiteConfigNonce: 'the-add-site-nonce',
      removeYandexSiteConfigNonce: 'the-remove-site-nonce',
      removeYandexAccountNonce: 'the-remove-account-nonce',
      userIsSuperUser: '1',
      removeClientConfigUrl,
      ...props,
    },
    global: {
      // `translate` and `$sanitize` are global properties in a real Matomo Vue
      // app, so the template references them without importing them.
      mocks: {
        translate: (key: string) => key,
        $sanitize: (value: string) => value,
      },
    },
  });
}

// jsdom has no real form submission, so the native call has to be observable.
function stubSubmit(form: HTMLFormElement) {
  const submit = jest.fn();
  form.submit = submit;
  return submit;
}

describe('SearchEngineKeywordsPerformance/Yandex/Configuration', () => {
  beforeEach(() => {
    modalConfirm.mockReset();
  });

  it('posts the removal with the nonce and the token read from the Matomo global', () => {
    const wrapper = factory();

    const form = wrapper.find('#removeConfigForm');
    expect(form.exists()).toBe(true);
    expect(form.attributes('method')).toBe('POST');
    expect(form.attributes('action')).toBe(removeClientConfigUrl);
    expect(form.find('input[name="config_nonce"]').attributes('value')).toBe('the-form-nonce');
    expect(form.find('input[name="token_auth"]').attributes('value'))
      .toBe('the-token-from-the-matomo-global');
    expect(form.find('input[name="force_api_session"]').attributes('value')).toBe('1');
  });

  it('asks for confirmation instead of removing the configuration straight away', async () => {
    const wrapper = factory();
    const form = wrapper.find('#removeConfigForm');
    const submit = stubSubmit(form.element as HTMLFormElement);

    await form.trigger('submit');

    expect(modalConfirm).toHaveBeenCalledTimes(1);
    expect(modalConfirm.mock.calls[0][0])
      .toBe(wrapper.find('#confirmRemoveClientConfig').element);
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits the form once the removal is confirmed', async () => {
    const wrapper = factory();
    const form = wrapper.find('#removeConfigForm');
    const submit = stubSubmit(form.element as HTMLFormElement);

    await form.trigger('submit');
    modalConfirm.mock.calls[0][1].yes();

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('keeps the configuration when the confirmation is dismissed', async () => {
    const wrapper = factory();
    const form = wrapper.find('#removeConfigForm');
    const submit = stubSubmit(form.element as HTMLFormElement);

    await form.trigger('submit');

    // no `no` handler is passed, so dismissing is core's plain modal close and
    // nothing can reach the server
    expect(modalConfirm.mock.calls[0][1].no).toBeUndefined();
    expect(wrapper.find('#confirmRemoveClientConfig input[role="no"]').exists()).toBe(true);
    expect(submit).not.toHaveBeenCalled();
  });

  it('offers removal only to super users with a stored client configuration', () => {
    expect(factory({ userIsSuperUser: '' }).find('#removeConfigForm').exists()).toBe(false);
    expect(factory({ isClientConfigured: false }).find('#removeConfigForm').exists()).toBe(false);
  });
});
