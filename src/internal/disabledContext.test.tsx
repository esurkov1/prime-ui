import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DisabledProvider,
  NativeButton,
  ReachableDisabledProvider,
  useDisabledControl,
  useInheritedDisabled,
  useReachableDisabled,
} from "./disabledContext";

function ControlProbe({ disabled }: { disabled: boolean }) {
  const off = useDisabledControl(disabled);
  return <span data-testid="control">{`${off.native} ${off.reachable} ${off.ariaDisabled}`}</span>;
}

function ReachableProbe() {
  return <span data-testid="reachable">{String(useReachableDisabled())}</span>;
}

function Probe({ own }: { own?: boolean }) {
  return <span data-testid="probe">{String(useInheritedDisabled(own))}</span>;
}

describe("disabledContext", () => {
  it("is the control's own disabled outside a group", () => {
    const { rerender } = render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("false");
    rerender(<Probe own />);
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
  });

  it("a disabled group disables everything inside; an enabled one never re-enables", () => {
    const { rerender } = render(
      <DisabledProvider disabled>
        <Probe />
      </DisabledProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
    rerender(
      <DisabledProvider disabled>
        <DisabledProvider disabled={false}>
          <Probe />
        </DisabledProvider>
      </DisabledProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
  });

  it("a disabled control stays reachable only inside ReachableDisabledProvider", () => {
    const { rerender } = render(<ReachableProbe />);
    expect(screen.getByTestId("reachable")).toHaveTextContent("false");
    rerender(
      <ReachableDisabledProvider>
        <ReachableProbe />
      </ReachableDisabledProvider>,
    );
    expect(screen.getByTestId("reachable")).toHaveTextContent("true");
  });

  it("a disabled control is natively disabled, under a tooltip's trigger reachable instead", () => {
    const { rerender } = render(<ControlProbe disabled />);
    expect(screen.getByTestId("control")).toHaveTextContent("true false undefined");
    rerender(
      <ReachableDisabledProvider>
        <ControlProbe disabled />
      </ReachableDisabledProvider>,
    );
    expect(screen.getByTestId("control")).toHaveTextContent("false true true");
    rerender(
      <ReachableDisabledProvider>
        <ControlProbe disabled={false} />
      </ReachableDisabledProvider>,
    );
    expect(screen.getByTestId("control")).toHaveTextContent("false false undefined");
  });

  it("NativeButton takes a disabled group's state and, reachable, stays the same node with no press", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const tree = (disabled: boolean) => (
      <ReachableDisabledProvider>
        <DisabledProvider disabled={disabled}>
          <NativeButton onClick={onClick} onKeyDown={onKeyDown}>
            Сортировать
          </NativeButton>
        </DisabledProvider>
      </ReachableDisabledProvider>
    );
    const { rerender } = render(tree(false));
    const button = screen.getByRole("button", { name: "Сортировать" });
    expect(button).toHaveAttribute("type", "button");
    rerender(tree(true));
    expect(screen.getByRole("button", { name: "Сортировать" })).toBe(button);
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-reachable-disabled");
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
    rerender(tree(false));
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("NativeButton outside a tooltip is natively disabled by a disabled group", () => {
    render(
      <DisabledProvider disabled>
        <NativeButton>Сортировать</NativeButton>
      </DisabledProvider>,
    );
    expect(screen.getByRole("button", { name: "Сортировать" })).toBeDisabled();
  });
});
