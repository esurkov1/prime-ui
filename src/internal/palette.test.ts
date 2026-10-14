import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import {
  DARK_LAYERS,
  floatingLayer,
  LAYER_STEP,
  LIGHT_LAYERS,
  layerLadder,
  lightnessOf,
} from "../../tokens/layers";
import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";
import { HUE_CHART } from "./palette";
import { paletteColors } from "./states";

const PALETTE_CSS = "src/internal/palette.module.css";

/** The rule of a hue; gray is the base `.hue` rule. */
const hueRule = (color: string) =>
  cssRule(PALETTE_CSS, color === "gray" ? ".hue" : `.hue[data-color="${color}"]`);

/** `{color.gray.925}` → the primitive's hex. */
function primitiveColor(ref: string): string {
  const refPath = /^\{(.+)\}$/.exec(ref)?.[1];
  if (refPath === undefined) throw new Error(`not a reference: ${ref}`);
  let node: unknown = primitiveTokens;
  for (const key of refPath.split(".")) node = (node as Record<string, unknown>)[key];
  if (typeof node !== "string") throw new Error(`not a primitive color: ${ref}`);
  return node;
}

/** `ink` at `alpha` over the opaque `ground`, as hex: what `color-mix(… ink a%, transparent)` paints. */
function wash(ink: string, alpha: number, ground: string): string {
  const channel = (hex: string, i: number) => Number.parseInt(hex.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map((i) => Math.round(channel(ink, i) * alpha + channel(ground, i) * (1 - alpha)))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

describe("palette", () => {
  it("HUE_CHART and --hue-chart in palette.module.css are one mapping", () => {
    for (const color of paletteColors) {
      expect(cssValue(hueRule(color), "--hue-chart"), color).toBe(HUE_CHART[color]);
    }
  });

  // Gray soft is a wash of the text ink over the chip's own ground, so a gray Badge steps off
  // every surface it can stand on: each layer, the field / track fill on it and the thumb.
  it("keeps a gray chip apart from every ground of both themes", () => {
    const soft = cssValue(hueRule("gray"), "--hue-soft");
    expect(soft.split(/\s+/).join(" ")).toBe(
      "color-mix( in srgb, var(--prime-color-text-primary) var(--prime-tint-soft), transparent )",
    );
    const alpha = Number.parseFloat(semanticTokens.tint.soft) / 100;
    for (const [theme, layers, ink] of [
      ["light", LIGHT_LAYERS, semanticTokens.color.text.primary],
      ["dark", DARK_LAYERS, darkThemeOverrides.color.text.primary],
    ] as const) {
      for (const layer of [...layerLadder(layers), floatingLayer(layers)]) {
        for (const ground of [layer.bg, layer.fill, layer.fillHover, layer.selected]) {
          const chip = wash(primitiveColor(ink), alpha, ground);
          const gap = Math.abs(lightnessOf(chip) - lightnessOf(ground));
          expect(gap, `${theme} gray soft on ${ground}`).toBeGreaterThan(LAYER_STEP);
        }
      }
    }
  });
});
