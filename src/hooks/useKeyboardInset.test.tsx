import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useKeyboardInset } from "./useKeyboardInset";

/** A visual viewport the test moves: the keyboard shrinks it, iOS scrolls it. */
class FakeViewport extends EventTarget {
  height = 800;
  offsetTop = 0;
  scale = 1;

  move(next: Partial<Pick<FakeViewport, "height" | "offsetTop" | "scale">>) {
    Object.assign(this, next);
    this.dispatchEvent(new Event("resize"));
  }
}

let viewport: FakeViewport;

beforeEach(() => {
  viewport = new FakeViewport();
  vi.stubGlobal("visualViewport", viewport);
  vi.stubGlobal("innerHeight", 800);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function Panel() {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  useKeyboardInset(node);
  return (
    <div data-testid="panel" ref={setNode}>
      <div data-testid="scroller" style={{ overflowY: "auto" }}>
        <input aria-label="Пароль сети" />
      </div>
    </div>
  );
}

const insets = (panel: HTMLElement) => ({
  top: panel.style.getPropertyValue("--visual-inset-top"),
  bottom: panel.style.getPropertyValue("--visual-inset-bottom"),
});

describe("useKeyboardInset", () => {
  it("rests at the layout viewport's edges with no keyboard", () => {
    render(<Panel />);
    const panel = screen.getByTestId("panel");
    expect(insets(panel)).toEqual({ top: "0px", bottom: "0px" });
    expect(panel).not.toHaveAttribute("data-keyboard");
  });

  it("stands on the keyboard: the bottom inset is what the visual viewport lost", () => {
    render(<Panel />);
    const panel = screen.getByTestId("panel");
    act(() => viewport.move({ height: 460 }));
    expect(insets(panel)).toEqual({ top: "0px", bottom: "340px" });
    expect(panel).toHaveAttribute("data-keyboard");
    // iOS scrolls the visual viewport down to the field: the panel follows its top and bottom.
    act(() => viewport.move({ offsetTop: 100 }));
    expect(insets(panel)).toEqual({ top: "100px", bottom: "240px" });
    act(() => viewport.move({ height: 800, offsetTop: 0 }));
    expect(insets(panel)).toEqual({ top: "0px", bottom: "0px" });
    expect(panel).not.toHaveAttribute("data-keyboard");
  });

  it("follows the visual viewport's scroll as well as its resize", () => {
    render(<Panel />);
    const panel = screen.getByTestId("panel");
    act(() => {
      viewport.height = 450;
      viewport.dispatchEvent(new Event("scroll"));
    });
    expect(insets(panel).bottom).toBe("350px");
  });

  it("leaves browser chrome and a pinch zoom alone", () => {
    render(<Panel />);
    const panel = screen.getByTestId("panel");
    // A toolbar that collapses or the drift iOS leaves after the keyboard: not a keyboard.
    act(() => viewport.move({ height: 760 }));
    expect(insets(panel).bottom).toBe("0px");
    expect(panel).not.toHaveAttribute("data-keyboard");
    // A zoomed page: the visual viewport is a lens, the panel stays where it is.
    act(() => viewport.move({ height: 300, scale: 2 }));
    expect(insets(panel).bottom).toBe("0px");
  });

  it("brings the focused field into view in the panel's own scroller when the keyboard opens", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    render(<Panel />);
    const scroller = screen.getByTestId("scroller");
    const field = screen.getByLabelText("Пароль сети");
    Object.defineProperty(scroller, "scrollHeight", { configurable: true, value: 600 });
    Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 300 });
    scroller.getBoundingClientRect = () => ({ top: 0, bottom: 300 }) as DOMRect;
    field.getBoundingClientRect = () => ({ top: 380, bottom: 420 }) as DOMRect;
    field.focus();
    act(() => viewport.move({ height: 460 }));
    act(() => {
      for (const frame of frames.splice(0)) frame(0);
    });
    expect(scroller.scrollTop).toBe(120);
  });

  it("clears what it wrote when the panel goes", () => {
    const { unmount } = render(<Panel />);
    const panel = screen.getByTestId("panel");
    act(() => viewport.move({ height: 460 }));
    unmount();
    expect(insets(panel)).toEqual({ top: "", bottom: "" });
    expect(panel).not.toHaveAttribute("data-keyboard");
  });
});
