import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useScrollLock, useViewportFrame } from "./useScrollLock";

/** A touch gesture from (0, 0) to (dx, dy) on `target`; whether its move was cancelled. */
function swipe(target: Element, dx: number, dy: number): boolean {
  const touch = (x: number, y: number) => ({ clientX: x, clientY: y, target }) as unknown as Touch;
  target.dispatchEvent(
    new TouchEvent("touchstart", { bubbles: true, touches: [touch(0, 0)], cancelable: true }),
  );
  const move = new TouchEvent("touchmove", {
    bubbles: true,
    cancelable: true,
    touches: [touch(dx, dy)],
  });
  target.dispatchEvent(move);
  target.dispatchEvent(new TouchEvent("touchend", { bubbles: true }));
  return move.defaultPrevented;
}

/** A vertical scroller with 100 px of room, scrolled to `top`. */
function scroller(top: number, overscroll = "auto"): HTMLDivElement {
  const el = document.createElement("div");
  el.style.overflowY = "auto";
  el.style.overscrollBehaviorY = overscroll;
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: 300 });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: 200 });
  el.scrollTop = top;
  document.body.append(el);
  return el;
}

describe("useScrollLock", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
    document.body.replaceChildren();
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

  it("on touch, cancels only a vertical gesture that would reach the document", () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    const plain = document.createElement("div");
    document.body.append(plain);
    const middle = scroller(50);
    const top = scroller(0);
    const held = scroller(0, "contain");

    expect(swipe(plain, 0, 40)).toBe(true);
    // Sideways gestures belong to strips and sliders.
    expect(swipe(plain, 40, 5)).toBe(false);
    expect(swipe(middle, 0, 40)).toBe(false);
    expect(swipe(middle, 0, -40)).toBe(false);
    // At its start a plain scroller would hand the pull on to the document…
    expect(swipe(top, 0, 40)).toBe(true);
    expect(swipe(top, 0, -40)).toBe(false);
    // …one that holds its overscroll bounces by itself.
    expect(swipe(held, 0, 40)).toBe(false);

    unmount();
    expect(swipe(plain, 0, 40)).toBe(false);
  });
});

describe("useViewportFrame", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("marks <html> while the frame is on, reference-counted", () => {
    const first = renderHook(() => useViewportFrame(true));
    const second = renderHook(() => useViewportFrame(true));
    expect(document.documentElement).toHaveAttribute("data-prime-frame");
    first.unmount();
    expect(document.documentElement).toHaveAttribute("data-prime-frame");
    second.unmount();
    expect(document.documentElement).not.toHaveAttribute("data-prime-frame");
  });

  it("returns a document iOS panned away to its origin, but not while a field is focused", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { unmount } = renderHook(() => useViewportFrame(true));
    const input = document.createElement("input");
    document.body.append(input);

    vi.spyOn(window, "scrollY", "get").mockReturnValue(120);
    input.focus();
    window.dispatchEvent(new Event("scroll"));
    expect(scrollTo).not.toHaveBeenCalled();

    input.blur();
    window.dispatchEvent(new Event("scroll"));
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    unmount();
    input.remove();
  });
});
