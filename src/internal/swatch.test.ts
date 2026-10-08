import { describe, expect, it } from "vitest";

import { colorToRgb, markContrast } from "./swatch";

describe("colorToRgb", () => {
  it("reads short and long hex, with or without alpha", () => {
    expect(colorToRgb("#fff")).toEqual([255, 255, 255]);
    expect(colorToRgb("#5068F5")).toEqual([80, 104, 245]);
    expect(colorToRgb("#000a")).toEqual([0, 0, 0]);
    expect(colorToRgb("#22c55e80")).toEqual([34, 197, 94]);
  });

  it("reads rgb() and hsl() in comma and space syntax", () => {
    expect(colorToRgb("rgb(10, 20, 30)")).toEqual([10, 20, 30]);
    expect(colorToRgb("rgba(10 20 30 / 0.5)")).toEqual([10, 20, 30]);
    expect(colorToRgb("hsl(0, 100%, 50%)")?.map(Math.round)).toEqual([255, 0, 0]);
    expect(colorToRgb("hsl(120 100% 25%)")?.map(Math.round)).toEqual([0, 128, 0]);
  });

  it("returns null for what it cannot read", () => {
    expect(colorToRgb("red")).toBeNull();
    expect(colorToRgb("#12")).toBeNull();
    expect(colorToRgb("oklch(0.7 0.1 200)")).toBeNull();
  });
});

describe("markContrast", () => {
  it("puts a dark mark on light colors and a light mark on dark ones", () => {
    expect(markContrast("#eab308")).toBe("dark");
    expect(markContrast("#ffffff")).toBe("dark");
    expect(markContrast("#2f4ae0")).toBe("light");
    expect(markContrast("#000")).toBe("light");
  });

  it("falls back to a dark mark for unreadable colors", () => {
    expect(markContrast("transparent")).toBe("dark");
  });
});
