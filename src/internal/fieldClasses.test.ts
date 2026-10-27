// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { fieldCodeCellClass, fieldTierClass, fieldTriggerClass } from "./fieldClasses";
import { touchTargetBlockClass } from "./touchTarget";

const TIER = "src/internal/fieldTier.module.css";

describe("field classes", () => {
  it("a field trigger joins the tier, the press and the touch block (no cross-file composes)", () => {
    const classes = fieldTriggerClass.split(" ");
    expect(classes).toContain(fieldTierClass);
    expect(classes).toContain(touchTargetBlockClass);
    expect(classes).toHaveLength(5);
  });

  it("the tier table maps every tier variable for every size", () => {
    const base = cssRule(TIER, ".tier");
    const vars = base.decls.map((d) => d.prop).filter((prop) => prop.startsWith("--field-"));
    for (const name of [
      "label-size",
      "label-lh",
      "label-gap",
      "hint-size",
      "hint-lh",
      "hint-gap",
    ]) {
      expect(vars).toContain(`--field-${name}`);
    }
    for (const size of ["xs", "s", "l", "xl"]) {
      const row = cssRule(TIER, `.tier[data-size="${size}"]`);
      expect(cssValue(row, "--field-label-size")).toBe(`var(--prime-control-${size}-label-size)`);
      expect(cssValue(row, "--field-hint-lh")).toBe(
        `var(--prime-control-${size}-hint-line-height)`,
      );
      expect(cssValue(row, "--field-choice")).toBe(`var(--prime-control-${size}-choice)`);
    }
  });

  it("the text classes read the tier: label, support row and control text", () => {
    expect(cssValue(cssRule(TIER, ".labelText"), "font-size")).toBe("var(--field-label-size)");
    expect(cssValue(cssRule(TIER, ".hintText"), "line-height")).toBe("var(--field-hint-lh)");
    expect(cssValue(cssRule(TIER, ".controlText"), "font-size")).toBe("var(--field-text)");
  });

  it("a code cell is two steps above the control height: m 48, then l 56 and xl 64", () => {
    expect(fieldCodeCellClass).toBeTruthy();
    const code = (selector: string) => cssValue(cssRule(TIER, selector), "--field-code");
    expect(code(".tier")).toBe("var(--prime-control-xl-height)");
    expect(code('.tier[data-size="xs"]')).toBe("var(--prime-control-m-height)");
    expect(code('.tier[data-size="s"]')).toBe("var(--prime-control-l-height)");
    expect(code('.tier[data-size="l"]')).toBe("var(--prime-space-14)");
    expect(code('.tier[data-size="xl"]')).toBe("var(--prime-space-16)");
    const cell = cssRule(TIER, ".codeCell");
    expect(cssValue(cell, "width")).toBe("var(--code-cell)");
    expect(cssValue(cssRule(TIER, ".codeCell", ["@media (pointer: coarse)"]), "--code-cell")).toBe(
      "max(var(--field-code), var(--prime-control-touch-target))",
    );
    expect(cssValue(cell, "border-radius")).toBe("var(--field-code-radius)");
  });
});
