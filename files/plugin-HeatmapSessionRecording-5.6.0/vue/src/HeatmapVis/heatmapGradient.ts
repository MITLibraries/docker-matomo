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

interface GradientStop {
  stop: number;
  rgb: [number, number, number];
}

// Single source of truth for all heatmap colors (click/move overlays, scroll
// overlay and the legend gradient). Stops must be ordered ascending by `stop`.
export const HEATMAP_GRADIENT_STOPS: GradientStop[] = [
  { stop: 0.0, rgb: [43, 89, 255] }, // #2B59FF
  { stop: 0.2, rgb: [22, 184, 192] }, // #16B8C0
  { stop: 0.4, rgb: [76, 175, 80] }, // #4CAF50
  { stop: 0.6, rgb: [255, 224, 0] }, // #FFE000
  { stop: 0.8, rgb: [245, 124, 0] }, // #F57C00
  { stop: 1.0, rgb: [229, 57, 53] }, // #E53935
];

export function toHeatmapJsGradient(
  stops: GradientStop[] = HEATMAP_GRADIENT_STOPS,
): Record<string, string> {
  const gradient: Record<string, string> = {};
  for (let i = 0; i < stops.length; i += 1) {
    gradient[`${stops[i].stop}`] = `rgb(${stops[i].rgb[0]},${stops[i].rgb[1]},${stops[i].rgb[2]})`;
  }
  return gradient;
}

export function interpolateGradientColor(
  intensity: number,
  min: number,
  max: number,
  stops: GradientStop[] = HEATMAP_GRADIENT_STOPS,
): [number, number, number] {
  const lastStop = stops[stops.length - 1];

  if (min === max || (!min && !max)) {
    return [lastStop.rgb[0], lastStop.rgb[1], lastStop.rgb[2]];
  }

  let t = (intensity - min) / (max - min);
  t = Math.min(Math.max(t, 0), 1);

  let lower = stops[0];
  let upper = lastStop;
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (t >= stops[i].stop && t <= stops[i + 1].stop) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.stop - lower.stop;
  const ratio = range === 0 ? 0 : (t - lower.stop) / range;

  return [
    Math.round(lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * ratio),
    Math.round(lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * ratio),
    Math.round(lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * ratio),
  ];
}

export function generateGradientImgData(
  width = 100,
  height = 10,
  stops: GradientStop[] = HEATMAP_GRADIENT_STOPS,
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  for (let i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(
      stops[i].stop,
      `rgb(${stops[i].rgb[0]},${stops[i].rgb[1]},${stops[i].rgb[2]})`,
    );
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}
