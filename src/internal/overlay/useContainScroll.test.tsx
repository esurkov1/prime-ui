import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { useContainScroll } from "./useContainScroll";

function Panel({ on = true }: { on?: boolean }) {
  const [panel, setPanel] = React.useState<HTMLDivElement | null>(null);
  useContainScroll(on ? panel : null);
  return (
    <div ref={setPanel} data-testid="panel">
      <div data-testid="list">Оплачен</div>
    </div>
  );
}

function wheel(target: Element, deltaY: number) {
  const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

/** Makes `el` a scroll box of `scrollHeight` with `clientHeight` 100 at `scrollTop`. */
function scrollBox(el: HTMLElement, scrollHeight: number, scrollTop: number) {
  el.style.overflowY = "auto";
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: 100 });
  el.scrollTop = scrollTop;
}

describe("useContainScroll", () => {
  it("keeps the wheel over a panel that fits from scrolling the page", () => {
    render(<Panel />);
    expect(wheel(screen.getByTestId("list"), 40).defaultPrevented).toBe(true);
  });

  it("lets a scroll area inside the panel scroll", () => {
    render(<Panel />);
    const list = screen.getByTestId("list");
    scrollBox(list, 400, 0);
    expect(wheel(list, 40).defaultPrevented).toBe(false);
    // At its end the wheel stops there instead of chaining to the page.
    scrollBox(list, 400, 300);
    expect(wheel(list, 40).defaultPrevented).toBe(true);
  });

  it("does nothing while off", () => {
    render(<Panel on={false} />);
    expect(wheel(screen.getByTestId("list"), 40).defaultPrevented).toBe(false);
  });
});
