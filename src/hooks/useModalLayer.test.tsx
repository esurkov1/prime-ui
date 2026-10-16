import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import type { FocusStart } from "@/internal/overlay/focus";

import { useModalLayer } from "./useModalLayer";

function Layer({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onDismiss,
  open = true,
  focusStart,
}: {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onDismiss: (reason: string) => void;
  open?: boolean;
  focusStart?: FocusStart;
}) {
  const { ref } = useModalLayer<HTMLDivElement>({
    open,
    closeOnEscape,
    closeOnOutsideClick,
    onDismiss,
    focusStart,
  });
  if (!open) return null;
  return (
    <>
      <div data-testid="scrim" />
      <div ref={ref} role="dialog" aria-label="Заказ" tabIndex={-1}>
        <button type="button">Сохранить</button>
      </div>
    </>
  );
}

function clickScrim() {
  const scrim = screen.getByTestId("scrim");
  fireEvent.pointerDown(scrim);
  fireEvent.click(scrim);
}

describe("useModalLayer", () => {
  it("hears Escape and a scrim click when both are on", () => {
    const onDismiss = vi.fn();
    render(<Layer onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: "Escape" });
    clickScrim();
    expect(onDismiss.mock.calls).toEqual([["escape"], ["scrim"]]);
  });

  it("drops the reasons its options turn off", () => {
    const onDismiss = vi.fn();
    render(<Layer onDismiss={onDismiss} closeOnEscape={false} closeOnOutsideClick={false} />);
    fireEvent.keyDown(document, { key: "Escape" });
    clickScrim();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("moves focus in and locks the page scroll", () => {
    render(<Layer onDismiss={() => {}} />);
    expect(screen.getByRole("button", { name: "Сохранить" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("focuses the panel itself with focusStart container", () => {
    render(<Layer onDismiss={() => {}} focusStart="container" />);
    expect(screen.getByRole("dialog", { name: "Заказ" })).toHaveFocus();
  });

  it("a press that opens it moves focus in without the ring; a key brings the ring", () => {
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Открыть
          </button>
          <Layer open={open} onDismiss={() => setOpen(false)} />
        </>
      );
    }
    render(<Page />);
    const opener = screen.getByRole("button", { name: "Открыть" });
    fireEvent.pointerDown(opener);
    fireEvent.click(opener);
    const save = screen.getByRole("button", { name: "Сохранить" });
    expect(save).toHaveFocus();
    expect(save).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(document, { key: "Tab" });
    expect(save).not.toHaveAttribute("data-focus-quiet");
  });
});
