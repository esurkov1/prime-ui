import { describe, expect, it } from "vitest";

import {
  clampView,
  clampZoom,
  glideView,
  leavesScene,
  panBy,
  panTo,
  presetNear,
  sceneFor,
  shiftPx,
  snapStart,
  type TimeBounds,
  toPx,
  zoomAt,
  zoomTo,
} from "./timeCore";

/** A quarter (92 days) across 400 px: the whole axis fits at 400 / 92 px a day. */
const BOUNDS: TimeBounds = { days: 92, widthPx: 400, maxDayPx: 96 };
const FIT = 400 / 92;

/** The day `px` from the start edge of a view. */
const dayAt = (view: { dayPx: number; start: number }, px: number) => view.start + px / view.dayPx;

describe("time camera", () => {
  it("holds the day under the anchor exactly while it zooms, in and out", () => {
    let view = { dayPx: 40, start: 15 };
    const anchor = dayAt(view, 137);
    for (const factor of [1.3, 0.7, 0.91, 1.07, 2, 0.5]) {
      view = zoomAt(view, factor, 137, BOUNDS);
      expect(dayAt(view, 137)).toBeCloseTo(anchor, 9);
    }
  });

  it("zooms by factors that compound: out and back lands where it began", () => {
    const start = { dayPx: 40, start: 15 };
    let view = start;
    for (let step = 0; step < 20; step++) view = zoomAt(view, 0.97, 200, BOUNDS);
    for (let step = 0; step < 20; step++) view = zoomAt(view, 1 / 0.97, 200, BOUNDS);
    expect(view.dayPx).toBeCloseTo(40, 9);
    expect(view.start).toBeCloseTo(15, 9);
  });

  it("stops at the top step and at the whole axis in view; the anchor holds for what was taken", () => {
    const view = { dayPx: 40, start: 15 };
    expect(zoomAt(view, 10, 200, BOUNDS).dayPx).toBe(96);
    const out = zoomAt(view, 0.01, 200, BOUNDS);
    expect(out.dayPx).toBe(FIT);
    expect(out.start).toBe(0);
    // A zoom that cannot move hands back the same view.
    expect(zoomAt({ dayPx: 96, start: 0 }, 2, 0, BOUNDS)).toEqual({ dayPx: 96, start: 0 });
    expect(clampZoom(1, BOUNDS)).toBe(FIT);
    // Unmeasured, only the top stop holds.
    expect(clampZoom(1, { ...BOUNDS, widthPx: 0 })).toBe(1);
  });

  it("clamps on the read and never on the write: an intent the stops hold comes back", () => {
    // The intent zooms out past the whole axis about the middle: drawn from day 0 at the fit…
    const intent = zoomTo({ dayPx: 40, start: 15 }, 4, 200);
    expect(intent.start).toBeLessThan(0);
    expect(clampView(intent, BOUNDS)).toEqual({ dayPx: FIT, start: 0 });
    // …and zoomed back in about the middle, it is where it was.
    const back = zoomTo(intent, 40, 200);
    expect(back.start).toBeCloseTo(15, 9);
  });

  it("pans by px at the zoom it stands at, inside the axis", () => {
    const view = { dayPx: 40, start: 15 };
    expect(panBy(view, 80, BOUNDS).start).toBe(17);
    expect(panBy(view, -10_000, BOUNDS).start).toBe(0);
    // The end stop: the last day at the end edge.
    expect(panBy(view, 10_000, BOUNDS).start).toBe(92 - 400 / 40);
    // Today a third into the view.
    expect(panTo(view, 30, 1 / 3, BOUNDS).start).toBeCloseTo(30 - 400 / 3 / 40, 9);
  });

  it("rests on a preset within 8 %", () => {
    const presets = { day: 40, week: 16, month: 4 };
    expect(presetNear(16 * 1.07, presets)).toBe("week");
    expect(presetNear(16 / 1.07, presets)).toBe("week");
    expect(presetNear(16 * 1.1, presets)).toBeNull();
  });

  it("glides a zoom in log space about its anchor, a pan in a straight line", () => {
    const from = { dayPx: 10, start: 20 };
    const to = zoomTo(from, 40, 100);
    const half = glideView(from, to, 100, 0.5);
    expect(half.dayPx).toBeCloseTo(20, 9);
    expect(dayAt(half, 100)).toBeCloseTo(dayAt(from, 100), 9);
    const slide = glideView(from, { dayPx: 10, start: 40 }, 0, 0.25);
    expect(slide).toEqual({ dayPx: 10, start: 25 });
    expect(glideView(from, to, 100, 1)).toBe(to);
  });
});

describe("time scene", () => {
  it("lays five screens out, two behind, a whole number of device pixels behind the start", () => {
    const scene = sceneFor({ dayPx: 13.7, start: 40.123 }, 400, "wide", 365, 2);
    expect(scene.widthPx).toBe(2000);
    expect(shiftPx(40.123, scene)).toBeCloseTo(-800, 9);
    expect(scene.to - scene.from).toBeCloseTo(2000 / 13.7, 9);
    // The window of a zoom: one and a half screens, a quarter behind.
    const window = sceneFor({ dayPx: 13.7, start: 40.123 }, 400, "window", 365, 2);
    expect(window.widthPx).toBe(600);
    expect(shiftPx(40.123, window)).toBeCloseTo(-100, 9);
  });

  it("places every part on a whole device pixel through one function", () => {
    const scene = sceneFor({ dayPx: 13.37, start: 5.5 }, 400, "wide", 365, 2);
    for (const day of [6, 7.5, 31, 100]) {
      const px = toPx(day, scene);
      expect(px * 2).toBe(Math.round(px * 2));
      expect(Math.abs(px - (day - scene.origin) * scene.dayPx)).toBeLessThanOrEqual(0.25);
    }
  });

  it("is laid out again when the view nears an edge of it, and any slide leaves a zoom's window", () => {
    const scene = sceneFor({ dayPx: 10, start: 100 }, 400, "wide", 365, 1);
    expect(leavesScene(100, scene, 400)).toBe(false);
    // Two screens ahead of the view and two behind, half a screen of guard each way.
    expect(leavesScene(100 + 1.4 * 40, scene, 400)).toBe(false);
    expect(leavesScene(100 + 1.6 * 40, scene, 400)).toBe(true);
    expect(leavesScene(100 - 1.4 * 40, scene, 400)).toBe(false);
    expect(leavesScene(100 - 1.6 * 40, scene, 400)).toBe(true);
    const window = sceneFor({ dayPx: 10, start: 100 }, 400, "window", 365, 1);
    expect(leavesScene(100, window, 400)).toBe(true);
    // Unmeasured: the whole axis is laid out, nothing leaves it.
    const whole = sceneFor({ dayPx: 10, start: 0 }, 0, "wide", 365, 1);
    expect([whole.from, whole.to, whole.widthPx]).toEqual([0, 365, 3650]);
    expect(leavesScene(300, whole, 0)).toBe(false);
  });

  it("moves a view at rest under half a device pixel onto a whole one", () => {
    const scene = sceneFor({ dayPx: 13.37, start: 5.5 }, 400, "wide", 365, 2);
    const start = snapStart(5.5 + 0.0371, scene);
    expect(Math.abs(start - 5.5371) * 13.37 * 2).toBeLessThanOrEqual(0.5);
    const shift = shiftPx(start, scene) * 2;
    expect(Math.abs(shift - Math.round(shift))).toBeLessThan(1e-9);
  });
});
