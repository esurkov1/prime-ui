import { describe, expect, it } from "vitest";

import { LIGHT_LAYERS } from "../../tokens/layers";
import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";
import { LAYER_STEP, lightness, surfaceLadder } from "../test/layers";

/** `{color.gray.600}` → the primitive's hex. */
function primitiveColor(ref: string): string {
  const path = /^\{(.+)\}$/.exec(ref)?.[1];
  if (path === undefined) throw new Error(`not a reference: ${ref}`);
  let node: unknown = primitiveTokens;
  for (const key of path.split(".")) node = (node as Record<string, unknown>)[key];
  if (typeof node !== "string") throw new Error(`not a primitive color: ${ref}`);
  return node;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const gap = (a: string, b: string) => Math.abs(lightness(a) - lightness(b));

describe("surface ladder", () => {
  it("light: the card snaps to white, deeper layers alternate with the page tone", () => {
    const ladder = surfaceLadder("light");
    expect(ladder.slice(0, 5).map((l) => l.bg)).toEqual([
      LIGHT_LAYERS.page,
      "#ffffff",
      ladder[2].bg,
      "#ffffff",
      ladder[2].bg,
    ]);
    expect(lightness(ladder[2].bg)).toBeLessThan(1);
    // Floating layers over a white card stay white; the shadow carries their depth.
    expect(ladder[5].bg).toBe("#ffffff");
  });

  it("dark: every nested layer is one step lighter, starting from near black", () => {
    const ladder = surfaceLadder("dark").slice(0, 5);
    for (let d = 1; d < ladder.length; d++) {
      const step = lightness(ladder[d].bg) - lightness(ladder[d - 1].bg);
      expect(step).toBeCloseTo(LAYER_STEP, 2);
    }
  });

  // A snap to the edge shortens a step, never below half of it (with less room the step reflects).
  it("keeps neighbours apart: layers, fills on them, the selected thumb on the track", () => {
    for (const theme of ["light", "dark"] as const) {
      const ladder = surfaceLadder(theme);
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
    for (const [theme, text] of [
      ["light", primitiveColor(semanticTokens.color.text.muted)],
      ["dark", primitiveColor(darkThemeOverrides.color.text.muted)],
    ] as const) {
      for (const layer of surfaceLadder(theme)) {
        expect(contrast(text, layer.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(text, layer.fill)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
