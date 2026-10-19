import { render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GIVE_WAY_ANIMATION } from "@/internal/messageList";

import { useRowGlide } from "./rowGlide";

type Entry = { target: Element; contentRect: { height: number } };

let observers: ((entries: Entry[]) => void)[] = [];

class FakeResizeObserver {
  callback: (entries: Entry[]) => void;
  constructor(callback: (entries: Entry[]) => void) {
    this.callback = callback;
    observers.push(callback);
  }
  observe() {}
  disconnect() {}
}

const tops = new Map<Element, () => number>();
const rect = (top: number) => ({ top, left: 0, width: 300, height: 0 }) as DOMRect;

function List() {
  const ref = React.useRef<HTMLDivElement>(null);
  useRowGlide(ref);
  return (
    <div data-testid="scroller">
      <div ref={ref}>
        <div data-testid="date" />
        <div data-testid="above" data-message-row="" />
        <div data-testid="grown" data-message-row="" />
        <div data-testid="below" data-message-row="" />
      </div>
    </div>
  );
}

afterEach(() => {
  observers = [];
  tops.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useRowGlide", () => {
  it("a row that grows by itself: what moved glides once from where it was, a stuck date stays", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element,
    ) {
      return rect(tops.get(this)?.() ?? 0);
    });
    const animate = vi.fn(
      (_keyframes: Keyframe[], _options?: KeyframeAnimationOptions) =>
        ({ id: "" }) as unknown as Animation,
    );
    Object.assign(HTMLElement.prototype, { animate, getAnimations: () => [] });
    document.documentElement.style.setProperty("--prime-message-morph-duration", "300ms");
    const { getByTestId } = render(<List />);
    let lift = 0;
    tops.set(getByTestId("date"), () => 8);
    tops.set(getByTestId("above"), () => 100 - lift);
    tops.set(getByTestId("grown"), () => 200 - lift);
    tops.set(getByTestId("below"), () => 320);
    const observer = observers[0] as (entries: Entry[]) => void;
    const grown = getByTestId("grown");
    // Seen at its first size, then the picture in it loads: a short list moves the rows above up.
    observer([{ target: grown, contentRect: { height: 60 } }]);
    lift = 56;
    observer([{ target: grown, contentRect: { height: 116 } }]);
    const calls = animate.mock.contexts as Element[];
    expect(calls).toEqual([getByTestId("above")]);
    expect(animate.mock.calls[0]?.[0]).toEqual([
      { transform: "translate(0px, 56px)" },
      { transform: "translate(0px, 0px)" },
    ]);
    expect((animate.mock.results[0]?.value as Animation).id).toBe(GIVE_WAY_ANIMATION);
    document.documentElement.style.removeProperty("--prime-message-morph-duration");
    Reflect.deleteProperty(HTMLElement.prototype, "animate");
    Reflect.deleteProperty(HTMLElement.prototype, "getAnimations");
  });
});
