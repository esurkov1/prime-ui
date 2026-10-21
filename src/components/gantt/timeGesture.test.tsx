import { act, fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dragZoomFactor, type TimeSurface, useTimeGestures, wheelZoomFactor } from "./timeGesture";

function setup(overrides: Partial<TimeSurface> = {}) {
  const surface = {
    zoom: vi.fn<TimeSurface["zoom"]>(),
    pan: vi.fn<TimeSurface["pan"]>(),
    settle: vi.fn<TimeSurface["settle"]>(),
    claimed: overrides.claimed ?? (() => false),
    dir: overrides.dir ?? ((): 1 | -1 => 1),
  };
  function Surface() {
    const ref = React.useRef<HTMLDivElement>(null);
    useTimeGestures(ref, surface, "[data-head]");
    return (
      <div ref={ref} data-testid="surface">
        <div data-head="" data-testid="head" />
        <div data-testid="body" />
      </div>
    );
  }
  const view = render(<Surface />);
  return { surface, node: view.getByTestId("surface"), head: view.getByTestId("head") };
}

const wheel = (node: Element, init: WheelEventInit) => {
  const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
  act(() => {
    node.dispatchEvent(event);
  });
  return event;
};
const frame = () => act(() => vi.advanceTimersToNextFrame());

describe("time gestures", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("reads a pinch far more sensitively than a mouse notch, out and back the same", () => {
    expect(wheelZoomFactor(-10, true)).toBeCloseTo(Math.exp(0.39));
    expect(wheelZoomFactor(10, true) * wheelZoomFactor(-10, true)).toBeCloseTo(1);
    expect(Math.log(wheelZoomFactor(-10, true))).toBeGreaterThan(
      5 * Math.log(wheelZoomFactor(-10, false)),
    );
    expect(dragZoomFactor(100) * dragZoomFactor(-100)).toBeCloseTo(1);
  });

  it("gathers a zoom wheel once a frame, about the pointer, and settles when it goes still", () => {
    const { surface, node } = setup();
    expect(wheel(node, { ctrlKey: true, deltaY: 4, clientX: 300 }).defaultPrevented).toBe(true);
    wheel(node, { ctrlKey: true, deltaY: 6, clientX: 310 });
    expect(surface.zoom).not.toHaveBeenCalled();
    frame();
    expect(surface.zoom).toHaveBeenCalledTimes(1);
    const [factor, clientX] = surface.zoom.mock.calls[0];
    expect(factor).toBeCloseTo(Math.exp(-10 * 0.039));
    expect(clientX).toBe(310);
    // A pause shorter than the idle keeps one gesture; the rest settles it once.
    act(() => vi.advanceTimersByTime(100));
    wheel(node, { ctrlKey: true, deltaY: 2, clientX: 310 });
    act(() => vi.advanceTimersByTime(100));
    expect(surface.settle).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(200));
    expect(surface.zoom).toHaveBeenCalledTimes(2);
    expect(surface.settle).toHaveBeenCalledTimes(1);
  });

  it("reads ⌘ with a mouse notch at the wheel's rate", () => {
    const { surface, node } = setup();
    wheel(node, { metaKey: true, deltaY: 100, clientX: 0 });
    frame();
    expect(surface.zoom.mock.calls[0][0]).toBeCloseTo(Math.exp(-100 * 0.005));
  });

  it("slides from the event itself; a sideways swipe is the chart's, a vertical one the page's", () => {
    const { surface, node } = setup();
    // A sideways swipe: every event of it is taken, its vertical travel scrolls the rows here.
    const first = wheel(node, { deltaX: 30, deltaY: 4 });
    expect(first.defaultPrevented).toBe(true);
    expect(surface.pan).toHaveBeenLastCalledWith(30);
    expect(node.scrollTop).toBe(4);
    const next = wheel(node, { deltaX: 2, deltaY: 20 });
    expect(next.defaultPrevented).toBe(true);
    expect(surface.zoom).not.toHaveBeenCalled();
    // A vertical swipe stays the browser's from its first event on; its sideways part still slides.
    act(() => vi.advanceTimersByTime(200));
    const vertical = wheel(node, { deltaY: 40, timeStamp: 0 } as WheelEventInit);
    expect(vertical.defaultPrevented).toBe(false);
    wheel(node, { deltaX: 5, deltaY: 30 });
    expect(surface.pan).toHaveBeenLastCalledWith(5);
    // Shift turns a mouse wheel sideways.
    act(() => vi.advanceTimersByTime(200));
    const shifted = wheel(node, { shiftKey: true, deltaY: 50 });
    expect(shifted.defaultPrevented).toBe(true);
    expect(surface.pan).toHaveBeenLastCalledWith(50);
  });

  it("slides against the screen in a right-to-left chart", () => {
    const { surface, node } = setup({ dir: () => -1 });
    wheel(node, { deltaX: 30 });
    expect(surface.pan).toHaveBeenLastCalledWith(-30);
  });

  it("slides with one finger, sideways only, unless a bar or a drawing holds it", () => {
    const claimed = new Set<number>();
    const { surface, node } = setup({ claimed: (id) => claimed.has(id) });
    const touch = (pointerId: number, clientX: number, clientY = 100) => ({
      pointerId,
      pointerType: "touch",
      clientX,
      clientY,
    });
    fireEvent.pointerDown(node, touch(1, 300));
    fireEvent.pointerMove(node, touch(1, 297));
    expect(surface.pan).not.toHaveBeenCalled();
    fireEvent.pointerMove(node, touch(1, 280));
    fireEvent.pointerMove(node, touch(1, 250));
    expect(surface.pan.mock.calls.map(([px]) => px)).toEqual([20, 30]);
    const move = new Event("touchmove", { bubbles: true, cancelable: true });
    node.dispatchEvent(move);
    expect(move.defaultPrevented).toBe(true);
    fireEvent.pointerUp(node, touch(1, 250));
    // Mostly up and down: the browser scrolls the rows.
    surface.pan.mockClear();
    fireEvent.pointerDown(node, touch(2, 300, 100));
    fireEvent.pointerMove(node, touch(2, 292, 60));
    expect(surface.pan).not.toHaveBeenCalled();
    fireEvent.pointerUp(node, touch(2, 292, 60));
    // A finger a bar picked up is the bar's.
    claimed.add(3);
    fireEvent.pointerDown(node, touch(3, 300));
    fireEvent.pointerMove(node, touch(3, 200));
    expect(surface.pan).not.toHaveBeenCalled();
  });

  it("pinches with two fingers about their middle, cancels what a finger began, settles on lift", () => {
    const { surface, node } = setup();
    const target = document.createElement("span");
    node.append(target);
    const cancelled = vi.fn();
    target.addEventListener("pointercancel", cancelled);
    const touch = (pointerId: number, clientX: number) => ({
      pointerId,
      pointerType: "touch",
      clientX,
      clientY: 100,
    });
    fireEvent.pointerDown(target, touch(1, 350));
    fireEvent.pointerDown(node, touch(2, 450));
    expect(cancelled).toHaveBeenCalledTimes(1);
    fireEvent.pointerMove(node, touch(1, 380));
    fireEvent.pointerMove(node, touch(2, 420));
    frame();
    // 100 → 40 px apart about a middle that went 15 px along and came back.
    expect(surface.zoom).toHaveBeenCalledTimes(1);
    expect(surface.zoom.mock.calls[0][0]).toBeCloseTo(0.4);
    expect(surface.zoom.mock.calls[0][1]).toBe(400);
    expect(surface.pan.mock.calls.reduce((sum, [px]) => sum + px, 0)).toBeCloseTo(0);
    fireEvent.pointerUp(node, touch(2, 420));
    expect(surface.settle).toHaveBeenCalledTimes(1);
  });

  it("zooms by a drag along the head — down closer, sideways along — and eats its click", () => {
    const { surface, head } = setup();
    const mouse = (clientX: number, clientY: number) => ({
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX,
      clientY,
    });
    fireEvent.pointerDown(head, mouse(400, 20));
    fireEvent.pointerMove(head, mouse(400, 22));
    expect(surface.zoom).not.toHaveBeenCalled();
    fireEvent.pointerMove(head, mouse(400, 120));
    fireEvent.pointerMove(head, mouse(450, 120));
    frame();
    expect(surface.zoom.mock.calls[0][0]).toBeCloseTo(Math.exp(0.6));
    expect(surface.zoom.mock.calls[0][1]).toBe(450);
    expect(surface.pan).toHaveBeenLastCalledWith(-50);
    fireEvent.pointerUp(head, mouse(450, 120));
    expect(surface.settle).toHaveBeenCalledTimes(1);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    head.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    // A press left in place is a click like any other.
    fireEvent.pointerDown(head, mouse(400, 20));
    fireEvent.pointerUp(head, mouse(400, 20));
    const plain = new MouseEvent("click", { bubbles: true, cancelable: true });
    head.dispatchEvent(plain);
    expect(plain.defaultPrevented).toBe(false);
  });

  it("takes Safari's trackpad pinch and keeps the page from zooming", () => {
    const { surface, node } = setup();
    const gesture = (type: string, scale: number) => {
      const event = Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
        scale,
        clientX: 200,
      });
      act(() => {
        node.dispatchEvent(event);
      });
      return event;
    };
    expect(gesture("gesturestart", 1).defaultPrevented).toBe(true);
    gesture("gesturechange", 1.5);
    gesture("gesturechange", 2);
    // Its wheel twin, if the engine sends one, is not read twice.
    wheel(node, { ctrlKey: true, deltaY: -10, clientX: 200 });
    frame();
    expect(surface.zoom).toHaveBeenCalledTimes(1);
    expect(surface.zoom.mock.calls[0][0]).toBeCloseTo(2);
    gesture("gestureend", 2);
    expect(surface.settle).toHaveBeenCalledTimes(1);
  });
});
