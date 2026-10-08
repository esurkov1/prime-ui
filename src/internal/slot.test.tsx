import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slot } from "./slot";

describe("Slot", () => {
  it("chains handlers, the child's first", () => {
    const calls: string[] = [];
    render(
      <Slot onClick={() => calls.push("slot")}>
        <button type="button" onClick={() => calls.push("child")}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(calls).toEqual(["child", "slot"]);
  });

  it("skips its own handler when the child's handler calls preventDefault()", () => {
    const slot = vi.fn();
    render(
      <Slot onClick={slot}>
        <button type="button" onClick={(event) => event.preventDefault()}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(slot).not.toHaveBeenCalled();
  });

  it("joins aria-describedby ids, the child's first", () => {
    render(
      <Slot aria-describedby="tip">
        <button type="button" aria-describedby="hint">
          Go
        </button>
      </Slot>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-describedby", "hint tip");
  });

  it("aria-disabled stops the click before the child's own handler (a link does not navigate)", () => {
    const child = vi.fn();
    render(
      <Slot aria-disabled>
        <a href="#next" onClick={child}>
          Далее
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(child).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it("keeps the merged ref stable between renders", () => {
    const ref = vi.fn();
    const { rerender } = render(
      <Slot ref={ref}>
        <button type="button">Go</button>
      </Slot>,
    );
    rerender(
      <Slot ref={ref}>
        <button type="button">Go</button>
      </Slot>,
    );
    expect(ref).toHaveBeenCalledTimes(1);
  });
});
