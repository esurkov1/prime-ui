import { readFileSync } from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { applyTheme, suspendTransitions, THEME_SWITCHING_ATTRIBUTE } from "./applyTheme";

const globals = readFileSync(path.resolve(process.cwd(), "src/styles/globals.css"), "utf8");

describe("applyTheme", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("data-theme");
  });

  it("sets the theme while the switching attribute is on, flushes and takes it off at once", () => {
    const root = document.documentElement;
    const seen: { theme: string | undefined; switching: boolean }[] = [];
    const flush = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        seen.push({
          theme: this.dataset.theme,
          switching: this.hasAttribute(THEME_SWITCHING_ATTRIBUTE),
        });
        return 0;
      });

    applyTheme("dark");

    expect(root.dataset.theme).toBe("dark");
    expect(flush).toHaveBeenCalledTimes(1);
    expect(seen).toEqual([{ theme: "dark", switching: true }]);
    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
  });

  it("does nothing when the theme is already applied", () => {
    const el = document.createElement("div");
    el.setAttribute("data-theme", "light");
    const set = vi.spyOn(el, "setAttribute");

    applyTheme("light", el);

    expect(set).not.toHaveBeenCalled();
  });

  it("suspends around a theme a host already set", () => {
    const el = document.createElement("div");
    el.setAttribute("data-theme", "dark");

    suspendTransitions(el);

    expect(el.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
  });

  // The switch zeroes the clocks, not `transition: none !important`: nothing in the kit needs to
  // outrank component styles, and theme islands inside declare the clocks again.
  it("zeroes every motion clock under the switching attribute, theme islands included", () => {
    const selector =
      ":root[data-theme-switching],\n[data-theme-switching],\n[data-theme-switching] [data-theme] {";
    const start = globals.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const block = globals.slice(start, globals.indexOf("}", start));
    for (const clock of ["xfast", "fast", "base", "slow"]) {
      expect(block).toContain(`--prime-motion-duration-${clock}: 0ms;`);
      expect(block).toContain(`--prime-motion-fade-${clock}: 0ms;`);
    }
    expect(globals).not.toMatch(/!important/);
  });
});
