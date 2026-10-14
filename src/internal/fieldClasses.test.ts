// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssRule, cssRules, cssValue } from "@/test/css";

import { fieldTierClass, fieldTriggerClass } from "./fieldClasses";
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

  it("the text classes read the tier: label, support row and an editable value", () => {
    expect(cssValue(cssRule(TIER, ".labelText"), "font-size")).toBe("var(--field-label-size)");
    expect(cssValue(cssRule(TIER, ".hintText"), "line-height")).toBe("var(--field-hint-lh)");
    expect(cssValue(cssRule(TIER, ".inputText"), "font-size")).toBe("var(--field-input-text)");
    // The 16px touch floor of an editable value lives in the tier, once.
    expect(
      cssRules(TIER).some((rule) =>
        rule.decls.some((d) => d.value.includes("var(--prime-control-touch-text-size)")),
      ),
    ).toBe(true);
  });
});
