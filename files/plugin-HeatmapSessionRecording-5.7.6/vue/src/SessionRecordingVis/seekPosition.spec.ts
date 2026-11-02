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

import { seekPercentage } from './seekPosition';

describe('seekPosition', () => {
  describe('seekPercentage', () => {
    it('returns the relative position for a click in the middle of the track', () => {
      expect(seekPercentage(500, 100, 800)).toBe(0.5);
    });

    it('returns 0 for a click on the very start of the track', () => {
      expect(seekPercentage(100, 100, 800)).toBe(0);
    });

    it('returns 1 for a click on the very end of the track', () => {
      expect(seekPercentage(900, 100, 800)).toBe(1);
    });

    it('clamps to 0 for a click before the left edge', () => {
      expect(seekPercentage(20, 100, 800)).toBe(0);
      expect(seekPercentage(-500, 100, 800)).toBe(0);
    });

    it('clamps to 1 for a click beyond the right edge', () => {
      expect(seekPercentage(1200, 100, 800)).toBe(1);
      expect(seekPercentage(99999, 100, 800)).toBe(1);
    });

    it('returns 0 for a zero width element instead of a division by zero', () => {
      expect(seekPercentage(500, 100, 0)).toBe(0);
    });

    it('returns 0 for a non finite width', () => {
      expect(seekPercentage(500, 100, NaN)).toBe(0);
      expect(seekPercentage(500, 100, Infinity)).toBe(0);
    });

    it('supports a track that starts at the document origin', () => {
      expect(seekPercentage(250, 0, 1000)).toBe(0.25);
    });

    it('never returns a value outside 0..1 for fractional widths', () => {
      const result = seekPercentage(133.7, 12.5, 250.75);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});
