import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { chartColors } from "./chartColors";

const read = (file: string) =>
  readFileSync(path.resolve(process.cwd(), "src/styles", file), "utf8");

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
});
