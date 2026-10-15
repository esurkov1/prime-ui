import { renderHook } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { parseHexColor, useBalancedColumns, useSwatchOptions } from "./swatch";

/** The check-mark contrast `useSwatchOptions` picks for each color. */
function contrastOf(...values: string[]) {
  const presets = values.map((value) => ({ value, label: value }));
  const { result } = renderHook(() => useSwatchOptions(presets, false, "Без цвета"));
  return result.current.map((option) => option.contrast);
}

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

  it("puts a dark mark on light colors and a light mark on dark ones", () => {
    expect(contrastOf("#eab308", "#ffffff", "#2f4ae0", "#000")).toEqual([
      "dark",
      "dark",
      "light",
      "light",
    ]);
  });

  it("reads short and long hex, with or without alpha", () => {
    expect(contrastOf("#fff", "#000a", "#22c55e80", "#0f766e")).toEqual([
      "dark",
      "light",
      "dark",
      "light",
    ]);
  });

  it("reads rgb() and hsl() in comma and space syntax", () => {
    expect(
      contrastOf(
        "rgb(10, 20, 30)",
        "rgba(250 250 250 / 0.5)",
        "hsl(0, 100%, 50%)",
        "hsl(120 100% 25%)",
      ),
    ).toEqual(["light", "dark", "dark", "light"]);
  });

  it("falls back to a dark mark for colors it cannot read", () => {
    // Each would take a light mark if it were read as the dark color it names.
    expect(contrastOf("black", "#12", "oklch(0.2 0.1 200)", "transparent")).toEqual([
      "dark",
      "dark",
      "dark",
      "dark",
    ]);
  });
});

describe("useBalancedColumns", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Columns for `count` 28px swatches with an 8px gap in a grid `width` wide. */
  function columnsAt(count: number, width: number) {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    const grid = document.createElement("div");
    grid.style.columnGap = "8px";
    Object.defineProperty(grid, "clientWidth", { value: width });
    const cell = document.createElement("button");
    cell.setAttribute("role", "radio");
    Object.defineProperty(cell, "offsetHeight", { value: width > 0 ? 28 : 0 });
    grid.append(cell);
    const { result } = renderHook(() =>
      useBalancedColumns(React.useRef<HTMLElement | null>(grid), count, "[role='radio']"),
    );
    return result.current;
  }

  it("keeps one row while every swatch fits", () => {
    expect(columnsAt(16, 1000)).toBe(16);
  });

  it("splits a wrap evenly over the rows", () => {
    // 14 fit in 520: two rows of 8, not 14 + 2.
    expect(columnsAt(16, 520)).toBe(8);
    // 9 fit: still two rows of 8; 5 fit: four rows of 4.
    expect(columnsAt(16, 320)).toBe(8);
    expect(columnsAt(16, 176)).toBe(4);
    // 17 swatches, 8 fit: three rows of 6 · 6 · 5.
    expect(columnsAt(17, 284)).toBe(6);
  });

  it("sets no columns before a swatch is measured", () => {
    expect(columnsAt(5, 0)).toBeUndefined();
  });
});

describe("parseHexColor", () => {
  it("reads 3 and 6 digit hex with or without #, as lowercase #rrggbb", () => {
    expect(parseHexColor("#12A594")).toBe("#12a594");
    expect(parseHexColor(" 12a594 ")).toBe("#12a594");
    expect(parseHexColor("#F0a")).toBe("#ff00aa");
  });

  it("is null for anything else", () => {
    for (const text of ["", "#12a59", "red", "#12a594ff", "rgb(0 0 0)"]) {
      expect(parseHexColor(text)).toBeNull();
    }
  });
});
