// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssRules, cssValue } from "@/test/css";

const CSS = "src/internal/press.module.css";

/** States that never give under a press: on the element, or on a host around it. */
const SELF = [
  ":disabled",
  '[aria-disabled="true"]',
  '[data-disabled="true"]',
  '[data-readonly="true"]',
  '[aria-readonly="true"]',
  '[data-loading="true"]',
  '[aria-busy="true"]',
];
const HOST =
  ':is(:disabled, [aria-disabled="true"], [data-disabled="true"], [data-readonly="true"]) *';

const pressRules = () => cssRules(CSS).filter((rule) => rule.decls.some((d) => d.prop === "scale"));

describe("press", () => {
  it("each pressable scales by the press token, the compact ones by the compact token", () => {
    const scales = Object.fromEntries(
      pressRules().map((rule) => [rule.selector.split(":active")[0], cssValue(rule, "scale")]),
    );
    expect(scales).toEqual({
      ".press": "var(--prime-motion-press-scale)",
      ".pressCompact": "var(--prime-motion-press-scale-compact)",
      ".pressHost": expect.any(String),
    });
    const parts = pressRules().filter((rule) => rule.selector.startsWith(".pressHost"));
    expect(
      parts.map((rule) => [rule.selector.split(") ").at(-1), cssValue(rule, "scale")]),
    ).toEqual([
      [".pressPart", "var(--prime-motion-press-scale)"],
      [".pressPartCompact", "var(--prime-motion-press-scale-compact)"],
    ]);
  });

  it("only on :active, and never disabled, read-only, loading, busy or inside a disabled host", () => {
    for (const rule of pressRules()) {
      expect(rule.selector).toContain(":active:not(");
      for (const state of [...SELF, HOST]) expect(rule.selector).toContain(state);
    }
  });

  it("the scale goes and returns on the fast clock", () => {
    const base = cssRules(CSS).find((rule) => rule.selector.startsWith(".press,"));
    expect(base && cssValue(base, "transition")).toBe(
      "scale var(--prime-motion-duration-fast) var(--prime-motion-easing-standard)",
    );
  });
});
