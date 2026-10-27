// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cssRule, cssRules, cssValue } from "@/test/css";

import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "./surfaceFrame";
import textRole from "./textRole.module.css";

const CSS = "src/internal/surfaceFrame.module.css";

describe("surfaceFrame", () => {
  it("gives the title and the description a role per step", () => {
    expect(FRAME_TITLE).toEqual({
      xs: textRole.titleXs,
      s: textRole.titleXs,
      m: textRole.titleS,
      l: textRole.titleM,
      xl: textRole.titleL,
    });
    expect(FRAME_DESCRIPTION).toEqual({
      xs: textRole.caption,
      s: textRole.caption,
      m: textRole.bodyS,
      l: textRole.bodyM,
      xl: textRole.bodyM,
    });
  });

  it("sets the metrics of each step as --frame-* variables", () => {
    expect(surfaceFrameClass).toBeTruthy();
    const m = cssRule(CSS, ".frame");
    const xs = cssRule(CSS, '.frame[data-frame="xs"]');
    const s = cssRule(CSS, '.frame[data-frame="s"]');
    const l = cssRule(CSS, '.frame[data-frame="l"]');
    const xl = cssRule(CSS, '.frame[data-frame="xl"]');
    expect(cssValue(xs, "--frame-pad")).toBe("var(--prime-space-3)");
    expect(cssValue(s, "--frame-pad")).toBe("var(--prime-card-padding-s)");
    expect(cssValue(m, "--frame-pad")).toBe("var(--prime-card-padding-m)");
    expect(cssValue(l, "--frame-pad")).toBe("var(--prime-card-padding-l)");
    expect(cssValue(xl, "--frame-pad")).toBe("var(--prime-space-7)");
    expect(cssValue(xs, "--frame-radius")).toBe("var(--prime-radius-l)");
    expect(cssValue(s, "--frame-radius")).toBe("var(--prime-card-radius)");
    expect(cssValue(m, "--frame-radius")).toBe("var(--prime-radius-xl)");
    expect(cssValue(xs, "--frame-gap")).toBe("var(--prime-space-2)");
    expect(cssValue(s, "--frame-gap")).toBe("var(--prime-space-3)");
    expect(cssValue(m, "--frame-gap")).toBe("var(--prime-space-4)");
    expect(cssValue(l, "--frame-gap")).toBe("var(--prime-space-5)");
    expect(cssValue(xl, "--frame-gap")).toBe("var(--prime-space-6)");
    expect(cssValue(xs, "--frame-mark")).toBe("var(--prime-space-8)");
    expect(cssValue(s, "--frame-mark")).toBe("var(--prime-space-8)");
    expect(cssValue(m, "--frame-mark")).toBe("var(--prime-space-10)");
    expect(cssValue(l, "--frame-mark")).toBe("var(--prime-space-12)");
    expect(cssValue(xl, "--frame-mark")).toBe("var(--prime-space-14)");
    expect(cssValue(m, "--frame-lines-gap")).toBe("var(--prime-space-0)");
    expect(cssValue(l, "--frame-lines-gap")).toBe("var(--prime-space-1)");
    expect(cssValue(xl, "--frame-lines-gap")).toBe("var(--prime-space-1)");
  });

  it("in a compact container (under 30rem) pads 12 · 16 · 16 · 20 · 24 — never under s", () => {
    const compact = ["@container (width < 30rem)"];
    expect(cssValue(cssRule(CSS, ".frame", compact), "--frame-pad")).toBe(
      "var(--prime-card-padding-s)",
    );
    expect(cssValue(cssRule(CSS, '.frame[data-frame="l"]', compact), "--frame-pad")).toBe(
      "var(--prime-card-padding-m)",
    );
    expect(cssValue(cssRule(CSS, '.frame[data-frame="xl"]', compact), "--frame-pad")).toBe(
      "var(--prime-card-padding-l)",
    );
    // xs and s keep their padding (their own rules outrank the compact `.frame`); only the
    // padding steps — the radius, the zone gap and the mark stay.
    const decls = cssRules(CSS)
      .filter((rule) => rule.parents.some((parent) => parent.startsWith("@container")))
      .flatMap((rule) => rule.decls.map((decl) => decl.prop));
    expect(new Set(decls)).toEqual(new Set(["--frame-pad"]));
    expect(
      cssRules(CSS).some(
        (rule) =>
          rule.parents.length > 0 &&
          (rule.selector.includes('"xs"') || rule.selector.includes('"s"')),
      ),
    ).toBe(false);
  });
});
