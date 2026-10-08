import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useScrollLock } from "./useScrollLock";

describe("useScrollLock", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
  });

  it("adds the scrollbar width to the body's own padding and restores it", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: window.innerWidth - 15,
    });
    document.body.style.paddingRight = "10px";
    const { rerender, unmount } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: true },
    });
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("25px");
    rerender({ on: false });
    expect(document.body.style.paddingRight).toBe("10px");
    expect(document.body.style.overflow).toBe("");
    unmount();
    // Drop the own-property override; the prototype getter takes over again.
    delete (document.documentElement as { clientWidth?: number }).clientWidth;
  });
});
