import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";
import { LAYER_STEP, lightness, surfaceLadder } from "../test/layers";
import { HUE_CHART } from "./palette";
import { paletteColors } from "./states";

const css = readFileSync(path.resolve(process.cwd(), "src/internal/palette.module.css"), "utf8");

/** `--hue-chart` of a hue's rule block; gray is the base `.hue` rule. */
function cssHueChart(color: string): string | undefined {
  const selector = color === "gray" ? ".hue {" : `.hue[data-color="${color}"] {`;
  const start = css.indexOf(selector);
  if (start < 0) return undefined;
  const block = css.slice(start, css.indexOf("}", start));
  return /--hue-chart:\s*([^;]+);/.exec(block)?.[1]?.trim();
}

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
      expect(cssHueChart(color), color).toBe(HUE_CHART[color]);
    }
  });

  // Gray soft is a wash of the text ink over the chip's own ground, so a gray Badge steps off
  // every surface it can stand on: each layer, the field / track fill on it and the thumb.
  it("keeps a gray chip apart from every ground of both themes", () => {
    const base = css.slice(css.indexOf(".hue {"), css.indexOf("}", css.indexOf(".hue {")));
    const soft = base.slice(
      base.indexOf("--hue-soft:"),
      base.indexOf(";", base.indexOf("--hue-soft:")),
    );
    expect(soft.split(/\s+/).join(" ")).toBe(
      "--hue-soft: color-mix( in srgb, var(--prime-color-text-primary) var(--prime-tint-soft), transparent )",
    );
    const alpha = Number.parseFloat(semanticTokens.tint.soft) / 100;
    for (const [theme, ink] of [
      ["light", semanticTokens.color.text.primary],
      ["dark", darkThemeOverrides.color.text.primary],
    ] as const) {
      for (const layer of surfaceLadder(theme)) {
        for (const ground of [layer.bg, layer.fill, layer.fillHover, layer.selected]) {
          const chip = wash(primitiveColor(ink), alpha, ground);
          const gap = Math.abs(lightness(chip) - lightness(ground));
          expect(gap, `${theme} gray soft on ${ground}`).toBeGreaterThan(LAYER_STEP);
        }
      }
    }
  });
});
