// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

const CSS = "src/internal/touchTarget.module.css";
const COARSE = "@media (pointer: coarse)";

describe("touch target", () => {
  it("a control or a segment grows an invisible hit area to 44px on a coarse pointer", () => {
    expect(cssValue(cssRule(CSS, ".target::after, .targetBlock::after", [COARSE]), "inset")).toBe(
      "min(0px, calc((100% - var(--prime-control-touch-target)) / 2))",
    );
    expect(cssValue(cssRule(CSS, ".targetBlock::after", [COARSE]), "inset-inline")).toBe("0");
  });

  it("a row grows itself (never a hit area over its neighbours), and only on a coarse pointer", () => {
    expect(cssValue(cssRule(CSS, ".targetRow", [COARSE]), "--touch-row-min")).toBe(
      "var(--prime-control-touch-target)",
    );
    // Zero specificity: a row with its own min-height folds `--touch-row-min` into it instead.
    expect(cssValue(cssRule(CSS, ":where(.targetRow)"), "min-height")).toBe(
      "var(--touch-row-min, auto)",
    );
  });
});
