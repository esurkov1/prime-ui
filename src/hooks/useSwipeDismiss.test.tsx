import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { swipe } from "@/test/mobile";

import { useSwipeDismiss } from "./useSwipeDismiss";

function Panel({
  onDismiss,
  enabled = true,
  guard = null,
}: {
  onDismiss: () => void;
  enabled?: boolean;
  guard?: "busy" | "dirty" | null;
}) {
  const scrimRef = React.useRef<HTMLDivElement>(null);
  const gesture = useSwipeDismiss({ enabled, guard, onDismiss, scrimRef });
  return (
    <>
      <div data-testid="scrim" ref={scrimRef} />
      <div
        data-testid="panel"
        ref={(node) => {
          if (!node) return;
          Object.defineProperty(node, "offsetHeight", { configurable: true, value: 400 });
          Object.defineProperty(node, "offsetWidth", { configurable: true, value: 300 });
        }}
        onPointerDown={gesture.onPointerDown}
        {...gesture.panelProps}
      >
        {gesture.enabled ? <div data-testid="handle" data-swipe-handle="" /> : null}
        <header data-testid="header">Заказ</header>
        <div data-testid="body">
          <input aria-label="Поле" />
        </div>
      </div>
    </>
  );
}

const origin = { x: 100, y: 100 };

describe("useSwipeDismiss", () => {
  it("closes past 30% of the panel height when dragged down from the handle", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 260 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    // It glides on out from the release point: the whole height, keyframe exit switched off on
    // the panel and on the scrim that follows it.
    const panel = screen.getByTestId("panel");
    expect(panel).toHaveAttribute("data-swipe-dismissed");
    expect(screen.getByTestId("scrim")).toHaveAttribute("data-swipe-dismissed");
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
    expect(screen.getByTestId("scrim")).not.toHaveAttribute("data-swiping");
  });

  it("fades the scrim with the drag: how far out the panel is, then 1 when it leaves or 0 back", () => {
    render(<Panel onDismiss={() => {}} />);
    const scrim = screen.getByTestId("scrim");
    const progress = () => scrim.style.getPropertyValue("--swipe-progress");
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 140 });
    expect(progress()).toBe("0");
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 300 }, { steps: 4 });
    expect(progress()).toBe("1");
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

  it("starts from the handle or the header under it, by touch or by mouse", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByTestId("body"), origin, { x: 100, y: 300 });
    expect(onDismiss).not.toHaveBeenCalled();
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 300 }, { pointerType: "mouse" });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    swipe(screen.getByTestId("header"), origin, { x: 100, y: 300 });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("never starts on a text field", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    swipe(screen.getByRole("textbox"), origin, { x: 100, y: 400 });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("has no handle and no gesture while off", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} enabled={false} />);
    expect(screen.queryByTestId("handle")).toBeNull();
    swipe(screen.getByTestId("header"), origin, { x: 100, y: 400 });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("holds a busy panel: the handle stays, no drag starts, the panel is marked", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} guard="busy" />);
    expect(screen.getByTestId("panel")).toHaveAttribute("data-swipe-disabled");
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 400 });
    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.getByTestId("panel").style.getPropertyValue("--swipe-offset")).toBe("");
  });

  it("glides a dirty panel back and asks through onDismiss instead of leaving", () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} guard="dirty" />);
    swipe(screen.getByTestId("handle"), origin, { x: 100, y: 300 });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    const panel = screen.getByTestId("panel");
    expect(panel).not.toHaveAttribute("data-swipe-dismissed");
    expect(panel.style.getPropertyValue("--swipe-offset")).toBe("0px");
  });
});
