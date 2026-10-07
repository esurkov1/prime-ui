import { describe, expect, it } from "vitest";

import { computeFloatingPosition } from "./usePosition";

const anchor = (left: number, width: number) =>
  ({ left, right: left + width, top: 100, bottom: 140, width, height: 40 }) as DOMRectReadOnly;

const opts = {
  preferredSide: "bottom" as const,
  offset: 4,
  viewportPad: 8,
  flip: true,
  matchTriggerMinWidth: false,
};

describe("computeFloatingPosition", () => {
  it("align=end не влезает слева — выравнивает по левому краю якоря", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 900, 400, 1400, 900, {
      ...opts,
      align: "end",
    });
    expect(pos.left).toBe(300);
  });

  it("align=start не влезает справа — выравнивает по правому краю якоря", () => {
    const pos = computeFloatingPosition(anchor(1100, 200), 900, 400, 1400, 900, {
      ...opts,
      align: "start",
    });
    expect(pos.left).toBe(400);
  });

  it("без flip остаётся прижатым к краю вьюпорта", () => {
    const pos = computeFloatingPosition(anchor(300, 200), 900, 400, 1400, 900, {
      ...opts,
      flip: false,
      align: "end",
    });
    expect(pos.left).toBe(8);
  });
});

describe("computeFloatingPosition — narrow viewport", () => {
  it("панель шире экрана ограничивается шириной вьюпорта минус поля", () => {
    const pos = computeFloatingPosition(anchor(16, 120), 400, 200, 320, 640, {
      ...opts,
      align: "start",
    });
    expect(pos.maxWidth).toBe(304);
    expect(pos.left).toBe(8);
  });

  it("minWidth по триггеру не превышает maxWidth", () => {
    const pos = computeFloatingPosition(anchor(0, 400), 0, 0, 320, 640, {
      ...opts,
      align: "start",
      matchTriggerMinWidth: true,
    });
    expect(pos.minWidth).toBe(304);
  });
});
