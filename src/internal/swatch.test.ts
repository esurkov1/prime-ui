import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { balancedColumns, colorToRgb, markContrast, useSwatchOptions } from "./swatch";

describe("useSwatchOptions", () => {
  it("gives the «no color» option a theme-following mark, the colors one by luminance", () => {
    const presets = [
      { value: "#ffffff", label: "Белый" },
      { value: "#000000", label: "Чёрный" },
    ];
    const { result } = renderHook(() => useSwatchOptions(presets, true, "Без цвета"));
    expect(result.current.map((option) => option.contrast)).toEqual(["dark", "light", "surface"]);
    expect(result.current[2]).toMatchObject({ value: null, label: "Без цвета" });
  });
});

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

describe("balancedColumns", () => {
  it("keeps one row while every swatch fits", () => {
    expect(balancedColumns(16, 1000, 28, 8)).toBe(16);
  });

  it("splits a wrap evenly over the rows", () => {
    // 14 fit in 520: two rows of 8, not 14 + 2.
    expect(balancedColumns(16, 520, 28, 8)).toBe(8);
    // 9 fit: still two rows of 8; 5 fit: four rows of 4.
    expect(balancedColumns(16, 320, 28, 8)).toBe(8);
    expect(balancedColumns(16, 176, 28, 8)).toBe(4);
    // 17 swatches, 8 fit: three rows of 6 · 6 · 5.
    expect(balancedColumns(17, 284, 28, 8)).toBe(6);
  });

  it("falls back to one row before a measure", () => {
    expect(balancedColumns(5, 0, 28, 8)).toBe(5);
  });
});
