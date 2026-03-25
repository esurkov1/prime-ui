import { describe, expect, it } from "vitest";

import { getRootFontSizePx, remToPx } from "./layoutPxFromPrimitives";

describe("layoutPxFromPrimitives", () => {
  it("remToPx uses current root font size", () => {
    const rootPx = getRootFontSizePx();
    expect(remToPx("0.5rem")).toBe(Math.round(0.5 * rootPx));
    expect(remToPx("0.25rem")).toBe(Math.round(0.25 * rootPx));
  });

  it("remToPx accepts explicit root override", () => {
    expect(remToPx("1rem", 10)).toBe(10);
  });
});
