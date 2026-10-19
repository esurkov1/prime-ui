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
/** Whether the pane is shown: a hidden one (`display: none`) has no layout, every box is empty. */
let shown = true;
const rect = (top: number) =>
  (shown
    ? { top, left: 0, width: 300, height: 40 }
    : { top: 0, left: 0, width: 0, height: 0 }) as DOMRect;

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
  shown = true;
  observers = [];
  tops.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function setup() {
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    return rect(tops.get(this)?.() ?? 0);
  });
  const animate = vi.fn(
    (_keyframes: Keyframe[], _options?: KeyframeAnimationOptions) =>
      ({ id: "" }) as unknown as Animation,
  );
  Object.assign(HTMLElement.prototype, { animate, getAnimations: () => [] });
  document.documentElement.style.setProperty("--prime-message-morph-duration", "300ms");
  const view = render(<List />);
  return { animate, ...view };
}

function teardown() {
  document.documentElement.style.removeProperty("--prime-message-morph-duration");
  Reflect.deleteProperty(HTMLElement.prototype, "animate");
  Reflect.deleteProperty(HTMLElement.prototype, "getAnimations");
}

describe("useRowGlide", () => {
  it("a row that grows by itself: what moved glides once from where it was, a stuck date stays", () => {
    const { animate, getByTestId } = setup();
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
    teardown();
  });

  it("a pane hidden and shown again replays nothing: the date does not float in from the top", () => {
    const { animate, getByTestId } = setup();
    tops.set(getByTestId("date"), () => 8);
    tops.set(getByTestId("above"), () => 100);
    tops.set(getByTestId("grown"), () => 200);
    tops.set(getByTestId("below"), () => 320);
    const observer = observers[0] as (entries: Entry[]) => void;
    const rows = ["above", "grown", "below"].map((id) => getByTestId(id));
    const sized = (height: number) => rows.map((target) => ({ target, contentRect: { height } }));
    observer(sized(60));
    // The app's tab hides the pane: every row reads as zero high at the top.
    shown = false;
    observer(sized(0));
    // Shown again: the rows are back at their sizes and places.
    shown = true;
    observer(sized(60));
    expect(animate).not.toHaveBeenCalled();
    // Shown at another width: the rows changed meanwhile, yet nobody saw them move.
    shown = false;
    observer(sized(0));
    shown = true;
    tops.set(getByTestId("below"), () => 360);
    observer(sized(80));
    expect(animate).not.toHaveBeenCalled();
    teardown();
  });

  it("back from another browser tab: what changed meanwhile stands in place", () => {
    const { animate, getByTestId } = setup();
    let lift = 0;
    tops.set(getByTestId("date"), () => 8 - lift);
    tops.set(getByTestId("above"), () => 100 - lift);
    tops.set(getByTestId("grown"), () => 200 - lift);
    tops.set(getByTestId("below"), () => 320);
    const observer = observers[0] as (entries: Entry[]) => void;
    const grown = getByTestId("grown");
    observer([{ target: grown, contentRect: { height: 60 } }]);
    // A picture loaded while the page was hidden; the size batch comes after the page is back.
    lift = 56;
    document.dispatchEvent(new Event("visibilitychange"));
    observer([{ target: grown, contentRect: { height: 116 } }]);
    expect(animate).not.toHaveBeenCalled();
    teardown();
  });
});
