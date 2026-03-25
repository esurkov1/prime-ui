import { describe, expect, it } from "vitest";

import { DROPDOWN_MIN_MAX_HEIGHT, getDropdownMaxHeightForAnchorSide } from "./dropdownGeometry";

const PANEL_OFFSET_PX = 8;
const VIEWPORT_PAD_PX = 8;

function r(partial: Record<string, number>): DOMRectReadOnly {
  const base = { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  return { ...base, ...partial, toJSON: () => ({}) } as DOMRectReadOnly;
}

describe("getDropdownMaxHeightForAnchorSide", () => {
  it("when side is bottom, caps by space below anchor (gap + pad)", () => {
    const anchor = r({ top: 40, bottom: 72 });
    const vh = 600;
    const expected = Math.floor(
      Math.max(DROPDOWN_MIN_MAX_HEIGHT, vh - anchor.bottom - PANEL_OFFSET_PX - VIEWPORT_PAD_PX),
    );
    expect(
      getDropdownMaxHeightForAnchorSide(anchor, "bottom", vh, PANEL_OFFSET_PX, VIEWPORT_PAD_PX),
    ).toBe(expected);
  });

  it("when side is top, caps by space above anchor", () => {
    const anchor = r({ top: 400, bottom: 432 });
    const vh = 800;
    const expected = Math.floor(
      Math.max(DROPDOWN_MIN_MAX_HEIGHT, anchor.top - PANEL_OFFSET_PX - VIEWPORT_PAD_PX),
    );
    expect(
      getDropdownMaxHeightForAnchorSide(anchor, "top", vh, PANEL_OFFSET_PX, VIEWPORT_PAD_PX),
    ).toBe(expected);
  });
});
