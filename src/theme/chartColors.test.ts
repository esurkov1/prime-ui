import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { DARK_LAYERS, floatingLayer, LIGHT_LAYERS, layerLadder } from "../../tokens/layers";
import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";
import { chartColors } from "./chartColors";

const read = (file: string) =>
  readFileSync(path.resolve(process.cwd(), "src/styles", file), "utf8");

/** `{color.chart.light.orange}` → the primitive's hex. */
function primitiveColor(ref: string): string {
  const refPath = /^\{(.+)\}$/.exec(ref)?.[1];
  if (refPath === undefined) throw new Error(`not a reference: ${ref}`);
  let node: unknown = primitiveTokens;
  for (const key of refPath.split(".")) node = (node as Record<string, unknown>)[key];
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

const SERIES = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

describe("chartColors", () => {
  it("names only chart tokens that both themes declare", () => {
    const light = read("theme-light.css");
    const dark = read("theme-dark.css");
    const values = [
      ...chartColors.series,
      chartColors.other,
      chartColors.grid,
      chartColors.axis,
      ...chartColors.scale,
      chartColors.scaleFg,
    ];
    for (const value of values) {
      const name = /^var\((--prime-color-chart-[a-z0-9-]+)\)$/.exec(value)?.[1];
      expect(name, value).toBeDefined();
      expect(light, value).toContain(`${name}:`);
      expect(dark, value).toContain(`${name}:`);
    }
  });

  it("keeps eight categorical series and five sequential steps", () => {
    expect(chartColors.series).toHaveLength(8);
    expect(chartColors.scale).toHaveLength(5);
  });

  // A series is a graphical object (WCAG 1.4.11): 3:1 against every ground a chart stands on —
  // each layer of the ladder and the floating layer — in both themes.
  it("keeps every categorical series at 3:1 on every layer ground of both themes", () => {
    for (const [theme, layers, chart] of [
      ["light", LIGHT_LAYERS, semanticTokens.color.chart],
      ["dark", DARK_LAYERS, darkThemeOverrides.color.chart],
    ] as const) {
      const grounds = [...layerLadder(layers), floatingLayer(layers)].map((layer) => layer.bg);
      for (const series of SERIES) {
        const color = primitiveColor(chart[series]);
        for (const ground of grounds) {
          expect(
            contrast(color, ground),
            `${theme} chart-${series} on ${ground}`,
          ).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });
});
