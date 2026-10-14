import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { useEnterConfirm } from "./useEnterConfirm";

function Dialog({
  enabled = true,
  onConfirm,
  onCancel = () => {},
  onEnterConfirm,
}: {
  enabled?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onEnterConfirm?: (event: KeyboardEvent) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  useEnterConfirm({ enabled, containerRef, confirmRef, onEnterConfirm });
  return (
    <>
      <div ref={containerRef} role="dialog" aria-label="Счёт">
        <header>
          <input aria-label="Заголовок" />
        </header>
        <input aria-label="Сумма" />
        <textarea aria-label="Комментарий" />
        <input type="checkbox" aria-label="Оплачен" />
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
        <button type="button" ref={confirmRef} onClick={onConfirm}>
          Сохранить
        </button>
      </div>
      <input aria-label="Поиск" />
    </>
  );
}

describe("useEnterConfirm", () => {
  it("Enter in a text field clicks the confirm action", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Dialog onConfirm={onConfirm} />);
    await user.click(screen.getByRole("textbox", { name: "Сумма" }));
    await user.keyboard("{Enter}");
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("leaves Enter to the element that owns it: a button, a textarea, a checkbox", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<Dialog onConfirm={onConfirm} onCancel={onCancel} />);
    screen.getByRole("button", { name: "Отмена" }).focus();
    await user.keyboard("{Enter}");
    expect(onCancel).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("textbox", { name: "Комментарий" }));
    await user.keyboard("{Enter}");
    screen.getByRole("checkbox", { name: "Оплачен" }).focus();
    await user.keyboard("{Enter}");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("ignores Enter in the header and outside the dialog", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Dialog onConfirm={onConfirm} />);
    await user.click(screen.getByRole("textbox", { name: "Заголовок" }));
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("textbox", { name: "Поиск" }));
    await user.keyboard("{Enter}");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("hands Enter to onEnterConfirm instead of the click", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onEnterConfirm = vi.fn();
    render(<Dialog onConfirm={onConfirm} onEnterConfirm={onEnterConfirm} />);
    await user.click(screen.getByRole("textbox", { name: "Сумма" }));
    await user.keyboard("{Enter}");
    expect(onEnterConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("does nothing while disabled", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Dialog enabled={false} onConfirm={onConfirm} />);
    await user.click(screen.getByRole("textbox", { name: "Сумма" }));
    await user.keyboard("{Enter}");
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
