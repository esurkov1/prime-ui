import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { leaveGuardCapture, useLeaveGuard } from "./leaveGuard";

type Ask = (leave: () => void) => void;

function Guard({
  busy = false,
  dirty = false,
  ask,
}: {
  busy?: boolean;
  dirty?: boolean;
  ask: Ask;
}) {
  useLeaveGuard({ busy, dirty }, ask);
  return null;
}

function NavItem({ onClick, onClickCapture }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClickCapture={leaveGuardCapture(onClickCapture)} onClick={onClick}>
      <span>Заказы</span>
    </button>
  );
}

describe("leaveGuard", () => {
  it("lets the press through while no guard holds", async () => {
    const onClick = vi.fn();
    const ask = vi.fn();
    render(
      <>
        <Guard ask={ask} />
        <NavItem onClick={onClick} />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Заказы" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ask).not.toHaveBeenCalled();
  });

  it("dirty: stops the press, asks, and the leave replays it once", async () => {
    const onClick = vi.fn();
    const onClickCapture = vi.fn();
    let leave: (() => void) | undefined;
    const ask = vi.fn((next: () => void) => {
      leave = next;
    });
    render(
      <>
        <Guard dirty ask={ask} />
        <NavItem onClick={onClick} onClickCapture={onClickCapture} />
      </>,
    );
    screen.getByRole("button", { name: "Заказы" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(ask).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
    expect(onClickCapture).not.toHaveBeenCalled();
    leave?.();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClickCapture).toHaveBeenCalledTimes(1);
  });

  it("busy: holds the press without asking", async () => {
    const onClick = vi.fn();
    const ask = vi.fn();
    render(
      <>
        <Guard busy dirty ask={ask} />
        <NavItem onClick={onClick} />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Заказы" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(ask).not.toHaveBeenCalled();
  });

  it("never holds a press that opens another tab", () => {
    const onClick = vi.fn();
    const ask = vi.fn();
    render(
      <>
        <Guard dirty ask={ask} />
        <NavItem onClick={onClick} />
      </>,
    );
    fireEvent.click(screen.getByText("Заказы"), { metaKey: true });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ask).not.toHaveBeenCalled();
  });

  it("asks the browser before the tab closes while it holds, and stops after unmount", () => {
    const { rerender, unmount } = render(<Guard ask={vi.fn()} />);
    const quiet = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(quiet);
    expect(quiet.defaultPrevented).toBe(false);

    rerender(<Guard dirty ask={vi.fn()} />);
    const held = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(held);
    expect(held.defaultPrevented).toBe(true);

    unmount();
    const gone = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(gone);
    expect(gone.defaultPrevented).toBe(false);
  });

  it("a confirmed leave does not ask the browser again", async () => {
    let leave: (() => void) | undefined;
    render(
      <>
        <Guard
          dirty
          ask={(next) => {
            leave = next;
          }}
        />
        <NavItem />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Заказы" }));
    leave?.();
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(false);
  });
});
