import { describe, expect, it } from "vitest";

import { type ComputeFloatingOptions, computeFloatingPosition } from "./usePosition";

const anchor = (left: number, width: number) =>
  ({ left, right: left + width, top: 100, bottom: 140, width, height: 40 }) as DOMRectReadOnly;

const opts = {
  side: "bottom" as const,
  offset: 4,
  viewportPad: 8,
  flip: true,
  matchAnchorWidth: false,
};

describe("computeFloatingPosition", () => {
  it("align=end that overflows on the left aligns to the anchor's left edge", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 900, 400, 1400, 900, {
      ...opts,
      align: "end",
    });
    expect(pos.left).toBe(300);
  });

  it("align=start that overflows on the right aligns to the anchor's right edge", () => {
    const pos = computeFloatingPosition(anchor(1100, 200), 900, 400, 1400, 900, {
      ...opts,
      align: "start",
    });
    expect(pos.left).toBe(400);
  });

  it("without flip stays pinned to the viewport edge", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 900, 400, 1400, 900, {
      ...opts,
      flip: false,
      align: "end",
    });
    expect(pos.left).toBe(8);
  });

  it("keeps the requested top side when it fits, even if the bottom fits too", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 200, 50, 1400, 900, {
      ...opts,
      side: "top",
      align: "start",
    });
    expect(pos.side).toBe("top");
    expect(pos.top).toBe(100 - 4 - 50);
  });

  it("flips to the side with room when the requested one is too small", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 200, 300, 1400, 900, {
      ...opts,
      side: "top",
      align: "start",
    });
    expect(pos.side).toBe("bottom");
    expect(pos.top).toBe(144);
  });
});

describe("computeFloatingPosition — narrow viewport", () => {
  it("a panel wider than the screen is capped by the viewport minus gutters", () => {
    const pos = computeFloatingPosition(anchor(16, 120), 400, 200, 320, 640, {
      ...opts,
      align: "start",
    });
    expect(pos.maxWidth).toBe(304);
    expect(pos.left).toBe(8);
  });

  it("minWidth from the anchor never exceeds maxWidth", () => {
    const pos = computeFloatingPosition(anchor(0, 400), 0, 0, 320, 640, {
      ...opts,
      align: "start",
      matchAnchorWidth: true,
    });
    expect(pos.minWidth).toBe(304);
  });
});

describe("computeFloatingPosition — sides and arrow", () => {
  const base: ComputeFloatingOptions = {
    side: "top",
    align: "center",
    offset: 8,
    viewportPad: 8,
    flip: true,
    matchAnchorWidth: false,
    arrowInset: 11,
  };
  const trigger = { top: 300, bottom: 332, left: 200, right: 232, width: 32, height: 32 };

  it("centres above the anchor with the arrow at the anchor's centre", () => {
    const p = computeFloatingPosition(trigger, 100, 24, 800, 600, base);
    expect(p).toMatchObject({ side: "top", top: 268, left: 166, arrow: 50 });
  });

  it("flips to the opposite side when there is no room", () => {
    const p = computeFloatingPosition({ ...trigger, top: 4, bottom: 36 }, 100, 24, 800, 600, base);
    expect(p.side).toBe("bottom");
    expect(p.top).toBe(44);
  });

  it("shifts inside the viewport and keeps the arrow on the anchor", () => {
    const p = computeFloatingPosition({ ...trigger, left: 0, right: 32 }, 100, 24, 800, 600, base);
    expect(p.left).toBe(8);
    expect(p.arrow).toBe(11);
  });

  it("aligns to the anchor's start and end", () => {
    expect(
      computeFloatingPosition(trigger, 100, 24, 800, 600, { ...base, align: "start" }).left,
    ).toBe(200);
    expect(
      computeFloatingPosition(trigger, 100, 24, 800, 600, { ...base, align: "end" }).left,
    ).toBe(132);
  });

  it("places left / right along the vertical axis", () => {
    const right = computeFloatingPosition(trigger, 100, 24, 800, 600, { ...base, side: "right" });
    expect(right).toMatchObject({ side: "right", top: 304, left: 240, arrow: 12 });
    const left = computeFloatingPosition(trigger, 100, 24, 800, 600, { ...base, side: "left" });
    expect(left).toMatchObject({ side: "left", top: 304, left: 92 });
  });

  it("flips left to right when the left side has no room", () => {
    const p = computeFloatingPosition({ ...trigger, left: 20, right: 52 }, 100, 24, 800, 600, {
      ...base,
      side: "left",
    });
    expect(p.side).toBe("right");
    expect(p.left).toBe(60);
  });
});
