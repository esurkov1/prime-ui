import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useModalLayer } from "./useModalLayer";

function Layer({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onDismiss,
}: {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onDismiss: (reason: string) => void;
}) {
  const { ref } = useModalLayer<HTMLDivElement>({
    open: true,
    closeOnEscape,
    closeOnOutsideClick,
    onDismiss,
  });
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
});
