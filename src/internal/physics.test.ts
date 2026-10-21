import { describe, expect, it } from "vitest";

import {
  clampPan,
  coverScale,
  decayVelocity,
  emphasized,
  fitBox,
  panLimit,
  releaseVelocity,
  rubberBand,
  rubberClamp,
  softScale,
  springSettled,
  stepSpring,
  zoomAbout,
} from "./physics";

describe("page track physics", () => {
  it("fits a box inside the area by its ratio", () => {
    expect(fitBox(2, { width: 1000, height: 1000 })).toEqual({ width: 1000, height: 500 });
    expect(fitBox(0.5, { width: 1000, height: 1000 })).toEqual({ width: 500, height: 1000 });
    expect(fitBox(1, { width: 0, height: 100 })).toEqual({ width: 0, height: 0 });
  });

  it("rubber-bands past an edge: 1 : 1 at first, ever stiffer, never past the dimension", () => {
    expect(rubberBand(0, 400)).toBe(0);
    const small = rubberBand(10, 400);
    expect(small).toBeGreaterThan(5);
    expect(small).toBeLessThan(10);
    expect(rubberBand(10_000, 400)).toBeLessThan(400);
    expect(rubberBand(-50, 400)).toBeCloseTo(-rubberBand(50, 400));
    expect(rubberClamp(50, -100, 100, 400)).toBe(50);
    expect(rubberClamp(150, -100, 100, 400)).toBeLessThan(150);
    expect(rubberClamp(150, -100, 100, 400)).toBeGreaterThan(100);
  });

  it("keeps the point under the fingers while zooming about it", () => {
    const focus = { x: 120, y: -40 };
    const pan = zoomAbout({ x: 10, y: 20 }, 1, 3, focus);
    // The content point under `focus` before is under it after: (focus - pan) / scale is fixed.
    expect((focus.x - 10) / 1).toBeCloseTo((focus.x - pan.x) / 3);
    expect((focus.y - 20) / 1).toBeCloseTo((focus.y - pan.y) / 3);
  });

  it("lets a zoomed box pan only until its edges meet the area's", () => {
    const box = { width: 800, height: 600 };
    const area = { width: 800, height: 800 };
    expect(panLimit(box, 1, area)).toEqual({ x: 0, y: 0 });
    expect(panLimit(box, 2, area)).toEqual({ x: 400, y: 200 });
    expect(clampPan({ x: 999, y: -999 }, box, 2, area)).toEqual({ x: 400, y: -200 });
    expect(coverScale(box, area)).toBeCloseTo(800 / 600);
  });

  it("softens a pinch past its range", () => {
    expect(softScale(2, 1, 4)).toBe(2);
    expect(softScale(0.5, 1, 4)).toBeGreaterThan(0.5);
    expect(softScale(0.5, 1, 4)).toBeLessThan(1);
    expect(softScale(8, 1, 4)).toBeLessThan(8);
    expect(softScale(8, 1, 4)).toBeGreaterThan(4);
  });

  it("settles a spring on its target at any frame rate", () => {
    for (const dt of [8, 16, 33]) {
      let state = { value: 0, velocity: 2 };
      for (let t = 0; t < 2000; t += dt) state = stepSpring(state, 300, dt);
      expect(springSettled(state, 300, 0.5)).toBe(true);
    }
  });

  it("coasts with iOS momentum: a flick of 1 px/ms comes to rest about 500 px on", () => {
    expect(decayVelocity(1, 0)).toBe(1);
    expect(decayVelocity(1, 100)).toBeCloseTo(0.998 ** 100);
    // The distance a coast covers, frame by frame, until it is still.
    const coast = (start: number) => {
      let velocity = start;
      let distance = 0;
      while (Math.abs(velocity) > 1e-4) {
        velocity = decayVelocity(velocity, 1);
        distance += velocity;
      }
      return distance;
    };
    expect(coast(1)).toBeCloseTo(499, 0);
    expect(coast(-1)).toBeCloseTo(-499, 0);
  });

  it("reads the release velocity over the last stretch only", () => {
    const samples = [
      { t: 0, x: 0, y: 0 },
      { t: 200, x: 10, y: 0 },
      { t: 250, x: 60, y: 0 },
      { t: 300, x: 110, y: 0 },
    ];
    expect(releaseVelocity(samples, 300).x).toBeCloseTo(1);
    // A finger that stopped before lifting carries nothing.
    expect(releaseVelocity(samples, 500)).toEqual({ x: 0, y: 0 });
  });

  it("eases on the emphasized curve from 0 to 1", () => {
    expect(emphasized(0)).toBe(0);
    expect(emphasized(1)).toBe(1);
    expect(emphasized(0.5)).toBeGreaterThan(0.5);
  });
});
