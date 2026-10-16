import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { MorphText } from "./MorphText";

describe("MorphText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("morphs only the changed part: the shared start and end stay still", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { container, rerender } = render(<MorphText>{"Искать «фыв»"}</MorphText>);
    rerender(<MorphText>{"Искать «фывф»"}</MorphText>);
    const root = container.firstElementChild as HTMLElement;
    const [prefix, segment, suffix] = Array.from(root.children) as HTMLElement[];
    expect(prefix.textContent).toBe("Искать «фыв");
    expect(suffix.textContent).toBe("»");
    const layers = Array.from(segment.children).slice(1);
    expect(layers.map((layer) => layer.textContent)).toEqual(["", "ф"]);
    expect(root).toHaveTextContent("Искать «фывф»");
  });

  it("an interrupted change glides on from the width on screen, not from the last target", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { container, rerender } = render(<MorphText>{"Пригласить сотрудника"}</MorphText>);
    const root = container.firstElementChild as HTMLElement;
    const widths = { root: 217, segment: 217, sizer: 131 };
    const isSegment = (el: Element) => el.parentElement === root && el.children.length >= 3;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      let width = 0;
      if (this === root) width = widths.root;
      else if (isSegment(this)) width = widths.segment;
      else if (this.parentElement && isSegment(this.parentElement)) {
        width = this === this.parentElement.firstElementChild ? widths.sizer : 0;
      }
      return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0 } as DOMRect;
    });
    rerender(<MorphText>{"Новая роль"}</MorphText>);
    const segment = root.children[1] as HTMLElement;
    expect(segment.style.width).toBe("131px");

    // Mid-glide: the segment stands at 180px on its way down; going back targets 217px.
    widths.root = 180;
    widths.segment = 180;
    widths.sizer = 217;
    const observer = new MutationObserver(() => {});
    observer.observe(segment, { attributes: true, attributeOldValue: true });
    rerender(<MorphText>{"Пригласить сотрудника"}</MorphText>);
    const styles = observer.takeRecords().map((record) => record.oldValue ?? "");
    observer.disconnect();
    expect(root.children[1]).toBe(segment);
    // The glide restarts at the on-screen 180px with the old glide dropped, then runs to 217px.
    expect(
      styles.some((style) => /width: 180px/.test(style) && /transition: none/.test(style)),
    ).toBe(true);
    expect(segment.style.width).toBe("217px");
    expect(segment.style.transition).toBe("");
  });

  it("a change back during a change starts each letter from its pose on screen", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { container, rerender } = render(<MorphText>{"Новая роль"}</MorphText>);
    rerender(<MorphText>{"Пригласить сотрудника"}</MorphText>);
    const computed = window.getComputedStyle;
    vi.stubGlobal("getComputedStyle", (el: Element) => {
      const style = computed(el);
      return el.className.includes("letter")
        ? ({ ...style, opacity: "0.4", transform: "none" } as CSSStyleDeclaration)
        : style;
    });
    rerender(<MorphText>{"Новая роль"}</MorphText>);
    const root = container.firstElementChild as HTMLElement;
    const [, outLayer, inLayer] = Array.from(root.children[1].children) as HTMLElement[];
    const pose = (letter: Element) =>
      (letter as HTMLElement).style.getPropertyValue("--morph-opacity");
    expect(outLayer.textContent).toBe("Пригласить сотрудника");
    expect(Array.from(outLayer.children).map(pose)).toEqual(Array(21).fill("0.4"));
    expect(inLayer.textContent).toBe("Новая роль");
    expect(Array.from(inLayer.children).map(pose)).toEqual(Array(10).fill("0.4"));
  });

  it("never paints a leaving word past its own box sideways", () => {
    const root = cssRule("src/internal/MorphText.module.css", ".root");
    expect(cssValue(root, "overflow-x")).toBe("clip");
  });
});
