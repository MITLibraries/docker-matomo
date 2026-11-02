/*!
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
jest.mock('CoreHome', () => ({
  Matomo: { helper: {} },
  translate: (key: string) => key,
  ContentBlock: {},
  SiteSelector: {},
  NotificationsStore: {},
  clone: (value: unknown) => JSON.parse(JSON.stringify(value)),
  MatomoUrl: { hashParsed: { value: {} } },
  externalLink: () => '',
  AjaxHelper: {},
}), { virtual: true });

jest.mock('CorePluginsAdmin', () => ({
  Field: {},
  SaveButton: {},
}), { virtual: true });

jest.mock('SegmentEditor', () => ({
  SegmentGenerator: {},
}), { virtual: true });

// keep the store out of the spec compile: as a .ts dependency it would be fully
// type-checked, and its CoreHome imports are not part of the ambient module
// declarations specs compile against
jest.mock('../CustomReports.store', () => ({}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Edit = require('./Edit.vue').default;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { methods } = Edit as any;

function createEvent(targetMatchesField = true) {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { closest: () => (targetMatchesField ? {} : null) },
  };
}

describe('CustomReports/Edit methods', () => {
  describe('reorderFieldValues', () => {
    it('should reorder values by the emitted source indices', () => {
      expect(methods.reorderFieldValues(['a', 'b', 'c'], ['2', '0', '1'])).toEqual(['c', 'a', 'b']);
    });

    it('should reject an order referencing unknown indices', () => {
      expect(methods.reorderFieldValues(['a', 'b'], ['5', '0'])).toBeNull();
    });

    it('should reject an order of a different length', () => {
      expect(methods.reorderFieldValues(['a', 'b', 'c'], ['1', '0'])).toBeNull();
    });
  });

  describe('onDimensionsReorder', () => {
    function createContext(dimensions: string[]) {
      return {
        report: { dimensions },
        reorderFieldValues: methods.reorderFieldValues,
        setValueHasChanged: jest.fn(),
      };
    }

    it('should apply a valid reorder and mark the form dirty', () => {
      const context = createContext(['a', 'b']);

      methods.onDimensionsReorder.call(context, ['1', '0']);

      expect(context.report.dimensions).toEqual(['b', 'a']);
      expect(context.setValueHasChanged).toHaveBeenCalled();
    });

    it('should ignore an invalid reorder', () => {
      const context = createContext(['a', 'b']);

      methods.onDimensionsReorder.call(context, ['5', '0']);

      expect(context.report.dimensions).toEqual(['a', 'b']);
      expect(context.setValueHasChanged).not.toHaveBeenCalled();
    });
  });

  describe('clampOpenFieldList', () => {
    function mockRect(element: Element, top: number) {
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top, bottom: top, left: 0, right: 0, width: 0, height: 0,
        }),
      });
    }

    function createGroup(listTop: number, dropdownTop: number, wrapperTop: number) {
      const group = document.createElement('div');
      group.innerHTML = '<div class="expandableSelector">'
        + '<div class="select-wrapper"></div>'
        + '<div class="expandableList"><ul class="firstLevel"></ul></div>'
        + '</div>';

      mockRect(group.querySelector('.firstLevel') as Element, listTop);
      mockRect(group.querySelector('.expandableList') as Element, dropdownTop);
      mockRect(group.querySelector('.select-wrapper') as Element, wrapperTop);

      return group;
    }

    function setInnerHeight(value: number) {
      Object.defineProperty(window, 'innerHeight', { value, configurable: true });
    }

    it('should clamp the list to the space below when enough remains', () => {
      setInnerHeight(800);
      const group = createGroup(300, 250, 242);

      methods.clampOpenFieldList.call({}, group);

      const list = group.querySelector('.expandableList') as HTMLElement;
      expect(list.classList.contains('expandableSelector__list--above')).toBe(false);
      expect((group.querySelector('.firstLevel') as HTMLElement).style.maxHeight).toBe('484px');
    });

    it('should open above the field when the space below is too small', () => {
      setInnerHeight(400);
      const group = createGroup(350, 300, 292);

      methods.clampOpenFieldList.call({}, group);

      const list = group.querySelector('.expandableList') as HTMLElement;
      expect(list.classList.contains('expandableSelector__list--above')).toBe(true);
      expect((group.querySelector('.firstLevel') as HTMLElement).style.maxHeight).toBe('218px');
    });

    it('should keep a usable minimum below when neither side has room', () => {
      setInnerHeight(400);
      const group = createGroup(350, 300, 60);

      methods.clampOpenFieldList.call({}, group);

      const list = group.querySelector('.expandableList') as HTMLElement;
      expect(list.classList.contains('expandableSelector__list--above')).toBe(false);
      expect((group.querySelector('.firstLevel') as HTMLElement).style.maxHeight).toBe('150px');
    });
  });

  describe('locked report interception', () => {
    function createContext(isLocked: boolean) {
      return {
        isLocked,
        confirmReportIsLocked: jest.fn(),
        closeHandleTooltips: jest.fn(),
        clampOpenFieldList: jest.fn(),
      };
    }

    it('should block clicks and offer to unlock while locked', () => {
      const context = createContext(true);
      const event = createEvent();

      methods.onFieldsClick.call(context, event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(context.confirmReportIsLocked).toHaveBeenCalled();
    });

    it('should ignore clicks on the empty space around the fields while locked', () => {
      const context = createContext(true);
      const event = createEvent(false);

      methods.onFieldsClick.call(context, event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(context.confirmReportIsLocked).not.toHaveBeenCalled();
    });

    it('should not interfere with clicks while unlocked', () => {
      const context = createContext(false);
      const event = createEvent();

      methods.onFieldsClick.call(context, event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(context.confirmReportIsLocked).not.toHaveBeenCalled();
    });

    it('should cancel drags and offer to unlock while locked', () => {
      const context = createContext(true);
      const event = createEvent();

      methods.onFieldsDragStart.call(context, event);

      expect(context.closeHandleTooltips).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(context.confirmReportIsLocked).toHaveBeenCalled();
    });

    it('should only clean up tooltips on drag start while unlocked', () => {
      const context = createContext(false);
      const event = createEvent();

      methods.onFieldsDragStart.call(context, event);

      expect(context.closeHandleTooltips).toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(context.confirmReportIsLocked).not.toHaveBeenCalled();
    });
  });
});
