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

import {
  HEATMAP_GRADIENT_STOPS,
  toHeatmapJsGradient,
  interpolateGradientColor,
  generateGradientImgData,
} from './heatmapGradient';

describe('heatmapGradient', () => {
  const firstStop = HEATMAP_GRADIENT_STOPS[0];
  const lastStop = HEATMAP_GRADIENT_STOPS[HEATMAP_GRADIENT_STOPS.length - 1];

  describe('HEATMAP_GRADIENT_STOPS', () => {
    it('spans the full 0..1 range with ascending stops', () => {
      expect(firstStop.stop).toBe(0);
      expect(lastStop.stop).toBe(1);

      for (let i = 0; i < HEATMAP_GRADIENT_STOPS.length - 1; i += 1) {
        expect(HEATMAP_GRADIENT_STOPS[i].stop).toBeLessThan(HEATMAP_GRADIENT_STOPS[i + 1].stop);
      }
    });

    it('contains only valid rgb channel values', () => {
      for (let i = 0; i < HEATMAP_GRADIENT_STOPS.length; i += 1) {
        const { rgb } = HEATMAP_GRADIENT_STOPS[i];
        expect(rgb.length).toBe(3);
        for (let c = 0; c < 3; c += 1) {
          expect(rgb[c]).toBeGreaterThanOrEqual(0);
          expect(rgb[c]).toBeLessThanOrEqual(255);
          expect(Number.isInteger(rgb[c])).toBe(true);
        }
      }
    });
  });

  describe('toHeatmapJsGradient', () => {
    it('maps every stop to the heatmap.js gradient format', () => {
      const gradient = toHeatmapJsGradient();

      expect(Object.keys(gradient).length).toBe(HEATMAP_GRADIENT_STOPS.length);
      for (let i = 0; i < HEATMAP_GRADIENT_STOPS.length; i += 1) {
        const { stop, rgb } = HEATMAP_GRADIENT_STOPS[i];
        expect(gradient[`${stop}`]).toBe(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
      }
    });
  });

  describe('interpolateGradientColor', () => {
    it('returns the first stop color at the minimum', () => {
      expect(interpolateGradientColor(0, 0, 1000)).toEqual(firstStop.rgb);
    });

    it('returns the last stop color at the maximum', () => {
      expect(interpolateGradientColor(1000, 0, 1000)).toEqual(lastStop.rgb);
    });

    it('returns the exact stop color at each stop position', () => {
      for (let i = 0; i < HEATMAP_GRADIENT_STOPS.length; i += 1) {
        const { stop, rgb } = HEATMAP_GRADIENT_STOPS[i];
        expect(interpolateGradientColor(stop * 1000, 0, 1000)).toEqual(rgb);
      }
    });

    it('interpolates channel-wise between two stops', () => {
      // halfway between stop 0 and stop 0.2
      const lower = HEATMAP_GRADIENT_STOPS[0].rgb;
      const upper = HEATMAP_GRADIENT_STOPS[1].rgb;

      expect(interpolateGradientColor(100, 0, 1000)).toEqual([
        Math.round(lower[0] + (upper[0] - lower[0]) * 0.5),
        Math.round(lower[1] + (upper[1] - lower[1]) * 0.5),
        Math.round(lower[2] + (upper[2] - lower[2]) * 0.5),
      ]);
    });

    it('clamps intensities outside the min/max range', () => {
      expect(interpolateGradientColor(-500, 0, 1000)).toEqual(firstStop.rgb);
      expect(interpolateGradientColor(1500, 0, 1000)).toEqual(lastStop.rgb);
    });

    it('returns the last stop color when min equals max', () => {
      expect(interpolateGradientColor(1000, 1000, 1000)).toEqual(lastStop.rgb);
    });

    it('returns the last stop color when min and max are both falsy', () => {
      expect(interpolateGradientColor(0, 0, 0)).toEqual(lastStop.rgb);
    });

    it('supports non-zero minimums', () => {
      expect(interpolateGradientColor(200, 200, 1000)).toEqual(firstStop.rgb);
      expect(interpolateGradientColor(1000, 200, 1000)).toEqual(lastStop.rgb);
    });
  });

  describe('generateGradientImgData', () => {
    it('returns an empty string when no 2d canvas context is available', () => {
      // jsdom has no canvas implementation, so this exercises the guard path
      expect(generateGradientImgData()).toBe('');
    });
  });
});
