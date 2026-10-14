import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { stickySurfaceClass } from "./sticky";

const CSS = "src/internal/sticky.module.css";

describe("sticky surface", () => {
  it("sticks to the start edge and covers the WebKit seam with its own fill", () => {
    expect(stickySurfaceClass).toBeTruthy();
    const surface = cssRule(CSS, ".surface");
    expect(cssValue(surface, "position")).toBe("sticky");
    expect(cssValue(surface, "top")).toBe("0");
    expect(cssValue(surface, "box-shadow")).toBe("var(--sticky-bleed)");
  });

  it("stops sticking on a short screen (foundation §9), staying positioned", () => {
    const short = cssRule(CSS, ".surface", ["@media (max-height: 479px)"]);
    expect(cssValue(short, "top")).toBe("auto");
    expect(short.decls.map((decl) => decl.prop)).not.toContain("position");
  });
});
