import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import {
  endIndicatorGlide,
  placeIndicator,
  revealInScroller,
  selectionIndicatorClass,
  setFlag,
} from "./selectionIndicator";

const CSS = "src/internal/selectionIndicator.module.css";

/** An element with a fixed offset box (jsdom has no layout). */
function box(left: number, width: number, top = 0, height = 32): HTMLElement {
  const element = document.createElement("div");
  Object.defineProperties(element, {
    offsetLeft: { value: left },
    offsetTop: { value: top },
    offsetWidth: { value: width },
    offsetHeight: { value: height },
  });
  return element;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("setFlag", () => {
  it("writes a data flag only when it changes", () => {
    const element = document.createElement("div");
    const set = vi.spyOn(element, "setAttribute");
    setFlag(element, "data-visible", true);
    setFlag(element, "data-visible", true);
    expect(set).toHaveBeenCalledTimes(1);
    expect(element).toHaveAttribute("data-visible", "true");
    setFlag(element, "data-visible", false);
    expect(element).not.toHaveAttribute("data-visible");
  });
});

describe("placeIndicator", () => {
  it("covers the target's offset box and shows; without a target it fades out", () => {
    const indicator = document.createElement("div");
    placeIndicator(indicator, box(80, 60, 4, 28), false);
    expect(indicator.style.left).toBe("80px");
    expect(indicator.style.top).toBe("4px");
    expect(indicator.style.width).toBe("60px");
    expect(indicator.style.height).toBe("28px");
    expect(indicator).toHaveAttribute("data-visible", "true");
    placeIndicator(indicator, null, true);
    expect(indicator).not.toHaveAttribute("data-visible");
    expect(indicator).not.toHaveAttribute("data-animate");
  });

  it("glides only a visible indicator that moves for a person's choice", () => {
    const indicator = document.createElement("div");
    // The first placement appears where it is: no glide from nowhere.
    placeIndicator(indicator, box(0, 60), true);
    expect(indicator).not.toHaveAttribute("data-animate");
    placeIndicator(indicator, box(80, 60), true);
    expect(indicator).toHaveAttribute("data-animate", "true");
    // The fade of a part inside, or of the opacity, is not the glide.
    const end = (target: HTMLElement, propertyName: string) =>
      endIndicatorGlide({ target, currentTarget: indicator, propertyName });
    end(document.createElement("span"), "left");
    end(indicator, "opacity");
    expect(indicator).toHaveAttribute("data-animate", "true");
    // The glide ends: the next layout change snaps.
    end(indicator, "width");
    expect(indicator).not.toHaveAttribute("data-animate");
    placeIndicator(indicator, box(160, 60), false);
    expect(indicator).not.toHaveAttribute("data-animate");
  });

  it("shows at once on its first placement; fades only to show or clear a person's choice", () => {
    const indicator = document.createElement("div");
    const target = box(20, 106, 4, 36);
    // Offsets in the shared parent: an open motion transforming an ancestor (a Drawer sliding
    // in) cannot misplace it.
    const rect = vi.spyOn(target, "getBoundingClientRect");
    placeIndicator(indicator, target, false);
    expect(rect).not.toHaveBeenCalled();
    expect(indicator).toHaveAttribute("data-visible", "true");
    expect(indicator).not.toHaveAttribute("data-fade");
    expect(indicator).not.toHaveAttribute("data-animate");
    // A person clears the choice: it fades out; picks again: it fades in where it lands.
    placeIndicator(indicator, null, true);
    expect(indicator).toHaveAttribute("data-fade", "true");
    expect(indicator).not.toHaveAttribute("data-visible");
    placeIndicator(indicator, box(140, 80), true);
    expect(indicator).toHaveAttribute("data-fade", "true");
    expect(indicator).not.toHaveAttribute("data-animate");
    endIndicatorGlide({ target: indicator, currentTarget: indicator, propertyName: "opacity" });
    expect(indicator).not.toHaveAttribute("data-fade");
    // Cleared by the data, not a person: it leaves at once.
    placeIndicator(indicator, null, false);
    expect(indicator).not.toHaveAttribute("data-fade");
  });

  it("never transitions its opacity outside a fade or a glide", () => {
    expect(() => cssValue(cssRule(CSS, ".indicator"), "transition")).toThrow(/sets no transition/);
    expect(cssValue(cssRule(CSS, '.indicator[data-fade="true"]'), "transition")).toContain(
      "opacity var(--prime-motion-fade-fast)",
    );
  });

  it("moves on left / top / width / height, never as a transform, and only under data-animate", () => {
    expect(selectionIndicatorClass).toBeTruthy();
    const glide = cssValue(cssRule(CSS, '.indicator[data-animate="true"]'), "transition");
    for (const prop of ["left", "top", "width", "height"]) {
      expect(glide).toContain(`${prop} var(--prime-motion-duration-base)`);
    }
    expect(glide).not.toContain("transform");
  });
});

describe("revealInScroller", () => {
  function scroller(scrollLeft: number) {
    const element = document.createElement("div");
    const scrollTo = vi.fn();
    Object.defineProperties(element, {
      scrollWidth: { value: 400 },
      clientWidth: { value: 200 },
      scrollLeft: { value: scrollLeft },
      scrollTo: { value: scrollTo },
    });
    element.style.setProperty("--scroll-fade-depth", "32px");
    document.body.append(element);
    return { element, scrollTo };
  }

  it("scrolls the scroller (never the page) to bring the item clear of the edge fade", () => {
    const pageScroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { element, scrollTo } = scroller(0);
    expect(revealInScroller(element, box(220, 60), true)).toBe(112);
    expect(scrollTo).toHaveBeenCalledWith({ left: 112, behavior: "smooth" });
    expect(pageScroll).not.toHaveBeenCalled();
    element.remove();
  });

  it("goes all the way near an end and does nothing for an item already in view", () => {
    const { element, scrollTo } = scroller(100);
    expect(revealInScroller(element, box(340, 60), false)).toBe(200);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 200, behavior: "auto" });
    scrollTo.mockClear();
    expect(revealInScroller(element, box(150, 60), false)).toBeNull();
    expect(revealInScroller(element, box(10, 60), false)).toBe(0);
    element.remove();
  });
});
