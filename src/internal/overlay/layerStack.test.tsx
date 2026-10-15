import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createPortal } from "react-dom";
import { describe, expect, it, vi } from "vitest";

import { type DismissReason, LayerProvider, useLayer } from "./layerStack";

type LayerProps = {
  name: string;
  open?: boolean;
  dismiss?: "pointerdown" | "click" | "none";
  trap?: boolean;
  onDismiss: (name: string, reason: DismissReason) => void;
  children?: React.ReactNode;
};

/** A portaled panel registered in the stack, like every kit overlay. */
function Layer({
  name,
  open = true,
  dismiss = "pointerdown",
  trap,
  onDismiss,
  children,
}: LayerProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const layer = useLayer(open, {
    refs: [panelRef],
    dismiss,
    trap,
    onDismiss: (reason) => onDismiss(name, reason),
  });
  if (!open) return null;
  return createPortal(
    <LayerProvider value={layer}>
      <div ref={panelRef} role="dialog" aria-label={name} tabIndex={-1}>
        {children}
      </div>
    </LayerProvider>,
    document.body,
  );
}

describe("layer stack", () => {
  it("Escape closes only the topmost layer", async () => {
    const onDismiss = vi.fn();
    render(
      <>
        <Layer name="Фильтры" onDismiss={onDismiss} />
        <Layer name="Экспорт" onDismiss={onDismiss} />
      </>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onDismiss.mock.calls).toEqual([["Экспорт", "escape"]]);
  });

  it("ignores an Escape a nested control already consumed", async () => {
    const onDismiss = vi.fn();
    render(
      <Layer name="Фильтры" onDismiss={onDismiss}>
        <input
          aria-label="Поиск"
          onKeyDown={(event) => {
            if (event.key === "Escape") event.preventDefault();
          }}
        />
      </Layer>,
    );
    await userEvent.click(screen.getByRole("textbox", { name: "Поиск" }));
    await userEvent.keyboard("{Escape}");
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("a press outside closes the topmost panel; a press inside it or its child layer does not", async () => {
    const onDismiss = vi.fn();
    render(
      <>
        <button type="button">Снаружи</button>
        <Layer name="Меню" onDismiss={onDismiss}>
          <button type="button">Пункт</button>
          <Layer name="Подменю" onDismiss={onDismiss}>
            <button type="button">Вложенный пункт</button>
          </Layer>
        </Layer>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Вложенный пункт" }));
    await userEvent.click(screen.getByRole("button", { name: "Пункт" }));
    expect(onDismiss.mock.calls).toEqual([["Подменю", "outside"]]);
    onDismiss.mockClear();
    await userEvent.click(screen.getByRole("button", { name: "Снаружи" }));
    expect(onDismiss.mock.calls).toEqual([["Подменю", "outside"]]);
  });

  it("a child that opened with its parent stays above it", async () => {
    const onDismiss = vi.fn();
    render(
      <Layer name="Меню" onDismiss={onDismiss}>
        <Layer name="Подменю" onDismiss={onDismiss} />
      </Layer>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onDismiss.mock.calls).toEqual([["Подменю", "escape"]]);
  });

  it("a scrim layer closes only on a press that starts and ends outside", () => {
    const onDismiss = vi.fn();
    render(
      <>
        <div data-testid="scrim" />
        <Layer name="Счёт" dismiss="click" onDismiss={onDismiss}>
          <p>Сумма</p>
        </Layer>
      </>,
    );
    const scrim = screen.getByTestId("scrim");
    // A drag from inside the dialog onto the scrim.
    fireEvent.pointerDown(screen.getByText("Сумма"));
    fireEvent.click(scrim);
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.pointerDown(scrim);
    fireEvent.click(scrim);
    expect(onDismiss.mock.calls).toEqual([["Счёт", "scrim"]]);
  });

  it("a press in a live region (the toast viewport) is outside no layer", () => {
    const onDismiss = vi.fn();
    render(
      <>
        <div data-prime-live-region="">
          <button type="button">Закрыть уведомление</button>
        </div>
        <Layer name="Сделка" dismiss="click" onDismiss={onDismiss} />
        <Layer name="Меню" onDismiss={onDismiss} />
      </>,
    );
    const toastButton = screen.getByRole("button", { name: "Закрыть уведомление" });
    fireEvent.pointerDown(toastButton);
    fireEvent.click(toastButton);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("a passive layer takes no presses but gets Escape first", async () => {
    const onDismiss = vi.fn();
    render(
      <>
        <button type="button">Снаружи</button>
        <Layer name="Меню" onDismiss={onDismiss} />
        <Layer name="Подсказка" dismiss="none" onDismiss={onDismiss} />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Снаружи" }));
    expect(onDismiss.mock.calls).toEqual([["Меню", "outside"]]);
    onDismiss.mockClear();
    await userEvent.keyboard("{Escape}");
    expect(onDismiss.mock.calls).toEqual([["Подсказка", "escape"]]);
  });

  it("a trapping layer cycles Tab inside its panel and pulls focus back in", async () => {
    render(
      <>
        <button type="button">Снаружи</button>
        <Layer name="Счёт" dismiss="click" trap onDismiss={() => {}}>
          <button type="button">Отмена</button>
          <button type="button">Оплатить</button>
        </Layer>
      </>,
    );
    const outside = screen.getByRole("button", { name: "Снаружи" });
    const cancel = screen.getByRole("button", { name: "Отмена" });
    const pay = screen.getByRole("button", { name: "Оплатить" });
    outside.focus();
    await userEvent.tab();
    expect(cancel).toHaveFocus();
    await userEvent.tab();
    expect(pay).toHaveFocus();
    await userEvent.tab();
    expect(cancel).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(pay).toHaveFocus();
  });

  it("stops listening once the last layer closes", async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Layer name="Меню" onDismiss={onDismiss} />);
    rerender(<Layer name="Меню" open={false} onDismiss={onDismiss} />);
    await userEvent.keyboard("{Escape}");
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
