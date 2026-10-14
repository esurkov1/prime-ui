import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

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

describe("palette", () => {
  it("HUE_CHART and --hue-chart in palette.module.css are one mapping", () => {
    for (const color of paletteColors) {
      expect(cssHueChart(color), color).toBe(HUE_CHART[color]);
    }
  });
});
