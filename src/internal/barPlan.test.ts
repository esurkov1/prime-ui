import { describe, expect, it } from "vitest";

import { type BarAction, type BarWidths, planBar, stackHeading } from "./barPlan";

// Actions: full 120 + 100 + 140 + 2 gaps = 376; secondary icons 32 + 32 + 140 + 16 = 220;
// all icons 3 × 32 + 16 = 112; folded: primary icon + «⋯» = 32 + 32 + 8 = 72.
const WIDTHS: BarWidths = {
  heading: 300,
  path: false,
  tools: 400,
  actions: [
    { role: "secondary", full: 120, icon: 32 },
    { role: "secondary", full: 100, icon: 32 },
    { role: "primary", full: 140, icon: 32 },
  ],
  more: 32,
  gap: 16,
  actionGap: 8,
  margin: 0,
};

describe("planBar", () => {
  it("steps from one line to the fold as the width shrinks", () => {
    expect(planBar(WIDTHS, 300 + 16 + 400 + 16 + 376)).toBe("one");
    expect(planBar(WIDTHS, 300 + 16 + 400 + 16 + 375)).toBe("below");
    expect(planBar(WIDTHS, 300 + 16 + 376)).toBe("below");
    expect(planBar(WIDTHS, 300 + 16 + 220)).toBe("icons-secondary");
    expect(planBar(WIDTHS, 300 + 16 + 112)).toBe("icons");
    expect(planBar(WIDTHS, 300 + 16 + 72)).toBe("fold");
    expect(planBar(WIDTHS, 120)).toBe("fold");
  });

  it("lets every button step come before the heading gives", () => {
    const long = { ...WIDTHS, heading: 600 };
    expect(planBar(long, 600 + 16 + 112)).toBe("icons");
    expect(planBar(long, 600 + 16 + 72)).toBe("fold");
  });

  it("keeps the label of an action without an icon and never folds other items", () => {
    const widths: BarWidths = {
      ...WIDTHS,
      tools: 0,
      actions: [
        { role: "other", full: 50, icon: null },
        { role: "primary", full: 140, icon: null },
      ],
    };
    // Nothing can give: the actions keep 50 + 8 + 140 at every step, and nothing folds.
    expect(planBar(widths, 300 + 16 + 198)).toBe("one");
    expect(planBar(widths, 300 + 16 + 197)).toBe("icons");
  });

  it("keeps a single secondary button as its icon: «⋯» in its place saves nothing", () => {
    const widths: BarWidths = {
      ...WIDTHS,
      tools: 0,
      actions: [
        { role: "secondary", full: 120, icon: 32 },
        { role: "other", full: 72, icon: null },
      ],
    };
    // Icons: 32 + 8 + 72 = 112; folded: «⋯» + 8 + 72 = 112 — no narrower, so the icon stays.
    expect(planBar(widths, 300 + 16 + 112)).toBe("icons-secondary");
    expect(planBar(widths, 300 + 16 + 111)).toBe("icons");
    expect(planBar(widths, 200)).toBe("icons");
  });

  it("counts no gap for a missing part", () => {
    const bare: BarWidths = { ...WIDTHS, heading: 0, tools: 0 };
    expect(planBar(bare, 376)).toBe("one");
  });

  it("stacks a heading with a path only past the last step", () => {
    const withPath = { ...WIDTHS, path: true };
    // The fold leaves 72 for the actions: the heading's line fits down to 300 + 16 + 72.
    expect(stackHeading(withPath, 300 + 16 + 72, planBar(withPath, 300 + 16 + 72))).toBe(false);
    expect(stackHeading(withPath, 300 + 16 + 71, planBar(withPath, 300 + 16 + 71))).toBe(true);
    // Without a path there is nothing to stack: the heading truncates.
    expect(stackHeading(WIDTHS, 200, planBar(WIDTHS, 200))).toBe(false);
  });

  describe("margin", () => {
    const held: BarWidths = { ...WIDTHS, margin: 48 };
    const ONE = 300 + 16 + 400 + 16 + 376;

    it("the first layout takes the first plan that fits", () => {
      expect(planBar(held, ONE - 1)).toBe("below");
    });

    it("keeps its plan while the bar is short by less than the margin", () => {
      expect(planBar(held, ONE - 48, "one")).toBe("one");
      expect(planBar(held, ONE - 49, "one")).toBe("below");
    });

    it("a looser plan comes back only once it fits with the margin to spare", () => {
      expect(planBar(held, ONE, "below")).toBe("below");
      expect(planBar(held, ONE + 47, "below")).toBe("below");
      expect(planBar(held, ONE + 48, "below")).toBe("one");
    });

    it("a label 40 longer near the threshold collapses no neighbour", () => {
      // «Пауза вывода» → «Возобновить вывод»: the first secondary grows by 40 at a bar that just fit.
      const shorter: BarWidths = { ...held, tools: 0 };
      const longer: BarWidths = {
        ...shorter,
        actions: [{ ...WIDTHS.actions[0], full: 160 } as BarAction, ...WIDTHS.actions.slice(1)],
      };
      const fit = 300 + 16 + 376;
      expect(planBar(shorter, fit, "one")).toBe("one");
      expect(planBar(longer, fit, "one")).toBe("one");
      // And back: the shorter label is no reason to change either.
      expect(planBar(shorter, fit, "one")).toBe("one");
    });

    it("a short heading gives at most half of itself", () => {
      const short: BarWidths = { ...held, heading: 40, tools: 0 };
      const fit = 40 + 16 + 376;
      expect(planBar(short, fit - 20, "one")).toBe("one");
      expect(planBar(short, fit - 21, "one")).toBe("icons-secondary");
    });

    it("a kept plan never stacks the heading: only the last step does", () => {
      const withPath: BarWidths = { ...held, path: true, tools: 0 };
      const fit = 300 + 16 + 376;
      const plan = planBar(withPath, fit - 40, "one");
      expect(plan).toBe("one");
      expect(stackHeading(withPath, fit - 40, plan)).toBe(false);
    });
  });
});
