import { act, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useElementSize, useResizeEffect } from "./useElementSize";

type Observed = { callback: ResizeObserverCallback; targets: Set<Element>; observer: unknown };

const observers: Observed[] = [];

class FakeResizeObserver {
  record: Observed;
  constructor(callback: ResizeObserverCallback) {
    this.record = { callback, targets: new Set(), observer: this };
    observers.push(this.record);
  }
  observe(target: Element) {
    this.record.targets.add(target);
  }
  unobserve(target: Element) {
    this.record.targets.delete(target);
  }
  disconnect() {
    this.record.targets.clear();
  }
}

const resize = (target: Element, width = 0, height = 0) => {
  for (const { callback, targets, observer } of observers) {
    if (!targets.has(target)) continue;
    const entry: Pick<ResizeObserverEntry, "target" | "contentRect"> = {
      target,
      contentRect: rect(width, height),
    };
    callback([entry as ResizeObserverEntry], observer as ResizeObserver);
  }
};

const rect = (width: number, height: number) =>
  ({ width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 }) as DOMRect;

afterEach(() => {
  observers.length = 0;
});

describe("useElementSize", () => {
  it("measures before paint, follows resizes and rounds", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(120.4, 40.6));
    const seen: ReturnType<typeof useElementSize>[] = [];
    function Probe() {
      const ref = React.useRef<HTMLDivElement>(null);
      seen.push(useElementSize(ref));
      return <div ref={ref} />;
    }
    const { container } = render(<Probe />);
    expect(seen.at(-1)).toEqual({ width: 120, height: 41 });
    act(() => resize(container.firstElementChild as Element, 200, 41));
    expect(seen.at(-1)).toEqual({ width: 200, height: 41 });
    // The same size again keeps the state object.
    const last = seen.at(-1);
    act(() => resize(container.firstElementChild as Element, 200, 41));
    expect(seen.at(-1)).toBe(last);
  });

  it("follows an element that mounts later and is null without one", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(64, 32));
    const seen: ReturnType<typeof useElementSize>[] = [];
    function Probe({ shown }: { shown: boolean }) {
      const ref = React.useRef<HTMLDivElement>(null);
      seen.push(useElementSize(ref));
      return shown ? <div ref={ref} /> : null;
    }
    const { rerender } = render(<Probe shown={false} />);
    expect(seen.at(-1)).toBeNull();
    rerender(<Probe shown />);
    expect(seen.at(-1)).toEqual({ width: 64, height: 32 });
    rerender(<Probe shown={false} />);
    expect(seen.at(-1)).toBeNull();
  });

  it("observes nothing while disabled", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const seen: ReturnType<typeof useElementSize>[] = [];
    function Probe() {
      const ref = React.useRef<HTMLDivElement>(null);
      seen.push(useElementSize(ref, { enabled: false }));
      return <div ref={ref} />;
    }
    render(<Probe />);
    expect(seen.at(-1)).toBeNull();
    expect(observers).toHaveLength(0);
  });
});

describe("useResizeEffect", () => {
  it("calls back on a resize of the element and of its children, also ones added later", async () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const onResize = vi.fn();
    function Probe({ count }: { count: number }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useResizeEffect(ref, onResize, { children: true });
      return (
        <div ref={ref}>
          {["first", "second"].slice(0, count).map((key) => (
            <span key={key} />
          ))}
        </div>
      );
    }
    const { container, rerender } = render(<Probe count={1} />);
    const root = container.firstElementChild as Element;
    act(() => resize(root));
    act(() => resize(root.children[0]));
    expect(onResize).toHaveBeenCalledTimes(2);
    rerender(<Probe count={2} />);
    await act(async () => {});
    act(() => resize(root.children[1]));
    expect(onResize).toHaveBeenCalledTimes(3);
  });

  it("calls the latest callback and stops on unmount", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const first = vi.fn();
    const second = vi.fn();
    function Probe({ onResize }: { onResize: () => void }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useResizeEffect(ref, onResize);
      return <div ref={ref} />;
    }
    const { container, rerender, unmount } = render(<Probe onResize={first} />);
    const root = container.firstElementChild as Element;
    rerender(<Probe onResize={second} />);
    act(() => resize(root));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
    act(() => resize(root));
    expect(second).toHaveBeenCalledTimes(1);
  });
});
