import { describe, expect, it } from "vitest";

import {
  DARK_LAYERS,
  floatingLayer,
  LAYER_STEP,
  LIGHT_LAYERS,
  layerLadder,
  lightnessOf,
} from "../../tokens/layers";

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const gap = (a: string, b: string) => Math.abs(lightnessOf(a) - lightnessOf(b));

describe("surface ladder", () => {
  it("light: the card snaps to white, deeper layers alternate with the page tone", () => {
    const ladder = layerLadder(LIGHT_LAYERS);
    expect(ladder.map((l) => l.bg)).toEqual([
      LIGHT_LAYERS.page,
      "#ffffff",
      ladder[2].bg,
      "#ffffff",
      ladder[2].bg,
    ]);
    expect(lightnessOf(ladder[2].bg)).toBeLessThan(1);
    // Floating layers over a white card stay white; the shadow carries their depth.
    expect(floatingLayer(LIGHT_LAYERS).bg).toBe("#ffffff");
  });

  it("dark: every nested layer is one step lighter, starting from near black", () => {
    const ladder = layerLadder(DARK_LAYERS);
    for (let d = 1; d < ladder.length; d++) {
      const step = lightnessOf(ladder[d].bg) - lightnessOf(ladder[d - 1].bg);
      expect(step).toBeCloseTo(LAYER_STEP, 2);
    }
  });

  // A snap to the edge shortens a step, never below half of it (with less room the step reflects).
  it("keeps neighbours apart: layers, fills on them, the selected thumb on the track", () => {
    for (const theme of [LIGHT_LAYERS, DARK_LAYERS]) {
      const ladder = [...layerLadder(theme), floatingLayer(theme)];
      for (let d = 1; d < 5; d++) {
        expect(gap(ladder[d - 1].bg, ladder[d].bg)).toBeGreaterThan(LAYER_STEP / 2);
      }
      for (const layer of ladder) {
        expect(gap(layer.bg, layer.fill)).toBeGreaterThan(LAYER_STEP / 2);
        expect(gap(layer.fill, layer.selected)).toBeGreaterThan(LAYER_STEP / 2);
      }
    }
  });

  it("keeps muted text at AA on every layer and every fill", () => {
    const muted = { light: "#575e6d", dark: "#949bab" };
    for (const [theme, text] of [
      [LIGHT_LAYERS, muted.light],
      [DARK_LAYERS, muted.dark],
    ] as const) {
      for (const layer of [...layerLadder(theme), floatingLayer(theme)]) {
        expect(contrast(text, layer.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(text, layer.fill)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
