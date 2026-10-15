import { describe, expect, it } from "vitest";

import { type BarWidths, planBar } from "./barPlan";

// Actions: full 120 + 100 + 140 + 2 gaps = 376; secondary icons 32 + 32 + 140 + 16 = 220;
// all icons 3 × 32 + 16 = 112; folded: primary icon + «⋯» = 32 + 32 + 8 = 72.
const WIDTHS: BarWidths = {
  heading: 300,
  tools: 400,
  actions: [
    { role: "secondary", full: 120, icon: 32 },
    { role: "secondary", full: 100, icon: 32 },
    { role: "primary", full: 140, icon: 32 },
  ],
  more: 32,
  gap: 16,
  actionGap: 8,
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
    // Nothing can give: the actions keep 50 + 8 + 140 at every step.
    expect(planBar(widths, 300 + 16 + 198)).toBe("one");
    expect(planBar(widths, 300 + 16 + 197)).toBe("fold");
  });

  it("counts no gap for a missing part", () => {
    const bare: BarWidths = { ...WIDTHS, heading: 0, tools: 0 };
    expect(planBar(bare, 376)).toBe("one");
  });
});
