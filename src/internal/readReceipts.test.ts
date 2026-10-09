import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createReadReceipts } from "./readReceipts";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback = () => {};
const observed = new Set<Element>();

class FakeObserver {
  constructor(cb: Callback) {
    callback = cb;
  }
  observe(element: Element) {
    observed.add(element);
  }
  unobserve(element: Element) {
    observed.delete(element);
  }
  disconnect() {
    observed.clear();
  }
}

const entry = (target: Element, ratio: number, height = 40, view = 400) => ({
  target,
  isIntersecting: ratio > 0,
  intersectionRatio: ratio,
  intersectionRect: { height: height * ratio } as DOMRectReadOnly,
  rootBounds: { height: view } as DOMRectReadOnly,
});

let hidden = false;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  hidden = false;
  vi.spyOn(document, "visibilityState", "get").mockImplementation(() =>
    hidden ? "hidden" : "visible",
  );
  observed.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createReadReceipts", () => {
  it("reports what is half visible, batched per frame, each value once", () => {
    const onRead = vi.fn();
    const receipts = createReadReceipts(onRead);
    const a = document.createElement("div");
    const b = document.createElement("div");
    const c = document.createElement("div");
    receipts.observe(a, "a");
    receipts.observe(b, "b");
    receipts.observe(c, "c");
    callback([entry(a, 1), entry(b, 0.6), entry(c, 0.2)]);
    expect(onRead).not.toHaveBeenCalled();
    vi.advanceTimersToNextFrame();
    expect(onRead).toHaveBeenCalledWith(["a", "b"]);
    callback([entry(a, 1), entry(c, 0.8)]);
    vi.advanceTimersToNextFrame();
    expect(onRead).toHaveBeenLastCalledWith(["c"]);
    expect(onRead).toHaveBeenCalledTimes(2);
    receipts.disconnect();
  });

  it("a message taller than the view counts once it fills half the view", () => {
    const onRead = vi.fn();
    const receipts = createReadReceipts(onRead);
    const tall = document.createElement("div");
    receipts.observe(tall, "tall");
    callback([entry(tall, 0.3, 1000, 400)]);
    vi.advanceTimersToNextFrame();
    expect(onRead).toHaveBeenCalledWith(["tall"]);
    receipts.disconnect();
  });

  it("waits while the page is hidden", () => {
    const onRead = vi.fn();
    const receipts = createReadReceipts(onRead);
    const a = document.createElement("div");
    receipts.observe(a, "a");
    hidden = true;
    callback([entry(a, 1)]);
    vi.advanceTimersToNextFrame();
    expect(onRead).not.toHaveBeenCalled();
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersToNextFrame();
    expect(onRead).toHaveBeenCalledWith(["a"]);
    receipts.disconnect();
  });
});
