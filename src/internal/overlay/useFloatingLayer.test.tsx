import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { FloatingPanel, FloatingTrigger } from "./FloatingPanel";
import { floatingTriggerProps, useFloatingLayer } from "./useFloatingLayer";

function Picker({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  openOnArrow = false,
  onOpenChange,
}: {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  openOnArrow?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpenState] = React.useState(false);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const floating = useFloatingLayer({
    open,
    onOpenChange: setOpen,
    triggerRef,
    closeOnEscape,
    closeOnOutsideClick,
    focusOnOpen: '[role="option"]',
  });
  return (
    <>
      <FloatingTrigger
        triggerProps={{ ref: triggerRef, ...floatingTriggerProps({ open, setOpen, openOnArrow }) }}
      >
        <button type="button">Цвет</button>
      </FloatingTrigger>
      <FloatingPanel floating={floating} size="m" role="listbox" aria-label="Цвета">
        <div role="option" aria-selected="false" tabIndex={-1}>
          Синий
        </div>
      </FloatingPanel>
    </>
  );
}

describe("useFloatingLayer", () => {
  it("applies the dismiss options inside: Escape and an outside press only when on", () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Picker onOpenChange={onOpenChange} closeOnEscape={false} closeOnOutsideClick={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Цвет" }));
    onOpenChange.mockClear();
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.pointerDown(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    unmount();

    render(<Picker onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Цвет" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("focuses the first match of a focusOnOpen selector, which is no tab stop", () => {
    render(<Picker />);
    fireEvent.click(screen.getByRole("button", { name: "Цвет" }));
    expect(screen.getByRole("option", { name: "Синий" })).toHaveFocus();
  });

  it("the trigger props carry the state and open on the arrow keys with openOnArrow", async () => {
    const user = userEvent.setup();
    render(<Picker openOnArrow />);
    const trigger = screen.getByRole("button", { name: "Цвет" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("keeps the wheel over the panel from scrolling the page", () => {
    render(<Picker />);
    fireEvent.click(screen.getByRole("button", { name: "Цвет" }));
    const wheel = new WheelEvent("wheel", { deltaY: 40, bubbles: true, cancelable: true });
    screen.getByRole("option").dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);
  });
});
