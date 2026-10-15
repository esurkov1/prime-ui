// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssAtRules, cssRule, cssValue } from "@/test/css";

const CSS = "src/internal/statusLoop.module.css";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

describe("statusLoop", () => {
  it("holds the keyframes of every status loop and of the blink", () => {
    const keyframes = cssAtRules(CSS)
      .filter((at) => at.name === "keyframes")
      .map((at) => at.params);
    expect(keyframes).toEqual([
      "statusBreathe",
      "statusPulse",
      "statusWave",
      "statusBlinkA",
      "statusBlinkB",
      "statusGlint",
    ]);
  });

  it("glints on a movement clock, so reduced motion stills it", () => {
    expect(cssValue(cssRule(CSS, ".glint"), "animation")).toContain("--prime-motion-duration-slow");
  });

  it("breathes on the slow clock, so reduced motion stills it", () => {
    expect(cssValue(cssRule(CSS, ".breathe"), "animation")).toContain(
      "var(--prime-motion-duration-slow)",
    );
  });

  it("pulses a ring of the element's own fill and shape, none under reduced motion", () => {
    const ring = cssRule(CSS, ".pulse::after");
    expect(cssValue(ring, "background")).toBe("inherit");
    expect(cssValue(ring, "border-radius")).toBe("inherit");
    expect(cssValue(cssRule(CSS, ".pulse::after", [REDUCED]), "animation")).toBe("none");
  });

  it("waves the dots of a row a third of a loop apart", () => {
    expect(cssValue(cssRule(CSS, ".wave:nth-child(2)"), "animation-delay")).toBe(
      "calc(var(--prime-motion-loop) / 3)",
    );
    expect(cssValue(cssRule(CSS, ".wave:nth-child(3)"), "animation-delay")).toBe(
      "calc(var(--prime-motion-loop) * 2 / 3)",
    );
  });

  it("blinks from its parent's a / b flag, never while the parent enters", () => {
    for (const flag of ["a", "b"]) {
      const rule = cssRule(CSS, `[data-blink="${flag}"]:not([data-enter]) > .blink`);
      expect(cssValue(rule, "animation")).toMatch(
        new RegExp(
          `^statusBlink${flag.toUpperCase()} calc\\(var\\(--prime-motion-duration-base\\) \\* 3\\)`,
        ),
      );
    }
  });
});
