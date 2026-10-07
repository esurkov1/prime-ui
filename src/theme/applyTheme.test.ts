import { afterEach, describe, expect, it, vi } from "vitest";

import { applyTheme, THEME_SWITCHING_ATTRIBUTE } from "./applyTheme";

describe("applyTheme", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute("data-theme");
  });

  it("sets the theme with transitions suspended, then re-enables them", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });
    const root = document.documentElement;

    applyTheme("dark");

    expect(root.dataset.theme).toBe("dark");
    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
  });

  it("does nothing when the theme is already applied", () => {
    const el = document.createElement("div");
    el.setAttribute("data-theme", "light");

    applyTheme("light", el);

    expect(el.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
  });
});
