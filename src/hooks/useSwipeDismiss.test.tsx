import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { swipe } from "@/test/mobile";

import { type SwipeDirection, useSwipeDismiss } from "./useSwipeDismiss";

function Panel({
  onDismiss,
  onProgress,
  direction = "down",
  enabled = true,
  touchAnywhere = false,
}: {
  onDismiss: () => void;
  onProgress?: (progress: number) => void;
  direction?: SwipeDirection;
  enabled?: boolean;
  touchAnywhere?: boolean;
}) {
  const swipeProps = useSwipeDismiss({
    enabled,
    direction,
    onDismiss,
    onProgress,
    handle: "[data-swipe-handle]",
    touchAnywhere,
  });
  return (
    <div
      data-testid="panel"
      ref={(node) => {
        if (!node) return;
        Object.defineProperty(node, "offsetHeight", { configurable: true, value: 400 });
        Object.defineProperty(node, "offsetWidth", { configurable: true, value: 300 });
      }}
      {...swipeProps}
    >
      <div data-testid="handle" data-swipe-handle="" />
      <div data-testid="body">
        <input aria-label="Поле" />
      </div>
    </div>
  );
}

const origin = { x: 100, y: 100 };

describe("useSwipeDismiss", () => {
  it("closes past 30% of the panel height when dragged down from the handle", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 260 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    // It glides on out from the release point: the whole height, keyframe exit switched off.
    const panel = screen.getByTestId("panel");
    expect(panel).toHaveAttribute("data-swipe-dismissed");
    expect(panel.style.getPropertyValue("--swipe-offset")).toBe("400px");
  });

  it("glides back after a short slow drag and clears the drag state", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 140 });
    expect(onDismiss).not.toHaveBeenCalled();
    const panel = screen.getByTestId("panel");
    expect(panel.style.getPropertyValue("--swipe-offset")).toBe("0px");
    expect(panel).not.toHaveAttribute("data-swiping");
  });

  it("reports how far out the panel is: along the drag, then 1 when it leaves or 0 back", () => {
    const onProgress = vi.fn();
    render(<Panel onDismiss={() => {}} onProgress={onProgress} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 300 }, { steps: 4 });
    const values = onProgress.mock.calls.map(([progress]) => progress);
    // 400px panel: moves of 50 · 100 · 150 · 200 (the first one is past the slop) → 0.125 … 0.5.
    expect(values.slice(0, 4)).toEqual([0.125, 0.25, 0.375, 0.5]);
    expect(values.at(-1)).toBe(1);

    onProgress.mockClear();
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 140 });
    expect(onProgress.mock.calls.at(-1)?.[0]).toBe(0);
  });

  it("closes on a quick flick from any distance past the slop", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 150 }, { timeStep: 5 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not close when dragged away from the edge", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: -200 }, { timeStep: 5 });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("leaves a drag across the axis to scrolling", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 400, y: 180 });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("starts only from the handle unless a touch may start anywhere", () => {
    const onDismiss = vi.fn();
    const { unmount } = render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("body"), origin, { x: 100, y: 300 });
    expect(onDismiss).not.toHaveBeenCalled();
    unmount();

    render(<Panel onDismiss={onDismiss} direction="right" touchAnywhere />);
    swipe(screen.getByTestId("body"), origin, { x: 100, y: 300 }, { pointerType: "mouse" });
    expect(onDismiss).not.toHaveBeenCalled();
    swipe(screen.getByTestId("body"), origin, { x: 250, y: 100 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("closes a left panel with a drag to the left", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} direction="left" />);
    swipe(screen.getByTestId("handle"), origin, { x: 300, y: 100 });
    expect(onDismiss).not.toHaveBeenCalled();
    swipe(screen.getByTestId("handle"), { x: 300, y: 100 }, { x: 100, y: 100 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("never starts on a text field or while disabled", () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Panel onDismiss={onDismiss} touchAnywhere direction="right" />);
    swipe(screen.getByRole("textbox"), origin, { x: 300, y: 100 });
    expect(onDismiss).not.toHaveBeenCalled();
    rerender(<Panel onDismiss={onDismiss} enabled={false} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 400 });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
