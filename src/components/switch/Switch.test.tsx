import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { choiceTrackClass } from "@/internal/ChoiceField";
import { cssRule, cssValue } from "@/test/css";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders the bare control when Switch.Label is omitted", () => {
    const onCheckedChange = vi.fn();
    render(<Switch.Root aria-label="Активность бота" onCheckedChange={onCheckedChange} />);
    const input = screen.getByRole("switch", { name: "Активность бота" });
    fireEvent.click(input);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not add a second control when Switch.Label is present", () => {
    render(
      <Switch.Root>
        <Switch.Label>Уведомления</Switch.Label>
      </Switch.Root>,
    );
    expect(screen.getAllByRole("switch")).toHaveLength(1);
  });

  it("names the switch from Switch.Label and describes it with the hint", () => {
    render(
      <Switch.Root hint="Подсказка">
        <Switch.Label>Тёмная тема</Switch.Label>
      </Switch.Root>,
    );
    const control = screen.getByRole("switch", { name: "Тёмная тема" });
    expect(control).toHaveAccessibleDescription("Подсказка");
    fireEvent.click(screen.getByText("Тёмная тема"));
    expect(control).toBeChecked();
  });

  it("optional draws labels.optional after the text", () => {
    render(
      <Switch.Root optional>
        <Switch.Label>Уведомления по почте</Switch.Label>
      </Switch.Root>,
    );
    expect(screen.getByText("необязательно")).toBeInTheDocument();
  });

  it("toggles in uncontrolled mode", () => {
    render(
      <Switch.Root>
        <Switch.Label>Email notifications</Switch.Label>
      </Switch.Root>,
    );

    const control = screen.getByRole("switch", { name: "Email notifications" });
    expect(control).not.toBeChecked();

    fireEvent.click(screen.getByText("Email notifications"));
    expect(control).toBeChecked();
  });

  it("calls onCheckedChange in controlled mode", () => {
    const onCheckedChange = vi.fn();

    render(
      <Switch.Root checked={false} onCheckedChange={onCheckedChange}>
        <Switch.Label>Billing alerts</Switch.Label>
      </Switch.Root>,
    );

    fireEvent.click(screen.getByText("Billing alerts"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not change when readOnly", () => {
    render(
      <Switch.Root defaultChecked readOnly>
        <Switch.Label>Readonly switch</Switch.Label>
      </Switch.Root>,
    );

    const control = screen.getByRole("switch", { name: "Readonly switch" });
    expect(control).toBeChecked();

    fireEvent.click(screen.getByText("Readonly switch"));
    expect(control).toBeChecked();
    expect(control).toHaveAttribute("aria-readonly", "true");
    expect(control.closest("[data-readonly]")).toHaveAttribute("data-readonly", "true");
  });

  it("exposes the state through the native checked state, without an aria-checked copy", () => {
    render(
      <Switch.Root defaultChecked>
        <Switch.Label>Native</Switch.Label>
      </Switch.Root>,
    );
    const control = screen.getByRole("switch", { name: "Native" });
    expect(control).toBeChecked();
    expect(control).not.toHaveAttribute("aria-checked");
  });

  it("disabled keeps the checked state and ignores presses; the track keeps a soft accent", () => {
    const { container } = render(
      <Switch.Root disabled defaultChecked>
        <Switch.Label>Disabled on</Switch.Label>
      </Switch.Root>,
    );
    const control = screen.getByRole("switch", { name: "Disabled on" });
    expect(control).toBeChecked();
    fireEvent.click(screen.getByText("Disabled on"));
    expect(control).toBeChecked();

    const field = container.querySelector("[data-disabled='true']");
    expect(field).toHaveAttribute("data-state", "checked");
    // The track joins the choice track mode: a disabled «on» is a soft accent, not a dimmed copy.
    const track = control.nextElementSibling as HTMLElement;
    expect(track.className).toContain(choiceTrackClass);
    expect(
      cssValue(
        cssRule("src/internal/ChoiceField.module.css", ".track"),
        "--choice-bg-disabled-checked",
      ),
    ).toBe("var(--prime-color-accent-soft)");
  });

  it("keyboard: Tab focuses the switch, Space toggles it", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root onCheckedChange={onCheckedChange}>
        <Switch.Label>Уведомления</Switch.Label>
      </Switch.Root>,
    );
    const control = screen.getByRole("switch", { name: "Уведомления" });
    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(" ");
    expect(control).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.keyboard(" ");
    expect(control).not.toBeChecked();
  });

  it("keyboard: Space does nothing while readOnly", async () => {
    const user = userEvent.setup();
    render(<Switch.Root aria-label="Архив" readOnly />);
    const control = screen.getByRole("switch", { name: "Архив" });
    await user.tab();
    await user.keyboard(" ");
    expect(control).not.toBeChecked();
  });

  it("shows the error in place of the hint and marks the switch invalid", () => {
    render(
      <Switch.Root hint="You will receive push notifications" error="Required field">
        <Switch.Label>Notifications</Switch.Label>
      </Switch.Root>,
    );
    expect(screen.queryByText("You will receive push notifications")).toBeNull();
    expect(screen.getByRole("switch")).toHaveAccessibleDescription("Required field");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets invalid and state data attributes", () => {
    const { container } = render(
      <Switch.Root invalid>
        <Switch.Label>Terms</Switch.Label>
      </Switch.Root>,
    );
    const field = container.firstElementChild;
    expect(field).toHaveAttribute("data-invalid", "true");
    expect(field).toHaveAttribute("data-state", "unchecked");
  });
  /** A promise the test settles by hand. */
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }

  it("async: waits busy in the new position; presses do nothing; resolve keeps it", async () => {
    const save = deferred();
    const onCheckedChange = vi.fn(() => save.promise);
    const { container } = render(
      <Switch.Root aria-label="Документы на почту" onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByRole("switch");
    fireEvent.click(control);
    expect(control).toBeChecked();
    expect(control).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[data-loading]")).not.toBeNull();
    // Space (a click on the native input) is ignored until the answer.
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(control).toBeChecked();

    await act(async () => {
      save.resolve();
    });
    expect(control).toBeChecked();
    expect(control).not.toHaveAttribute("aria-busy");
    expect(container.querySelector("[data-loading]")).toBeNull();
  });

  it("async: reject puts the previous state back", async () => {
    const save = deferred();
    render(<Switch.Root aria-label="SMS" defaultChecked onCheckedChange={() => save.promise} />);
    const control = screen.getByRole("switch");
    fireEvent.click(control);
    expect(control).not.toBeChecked();
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(control).toBeChecked();
    expect(control).not.toHaveAttribute("aria-busy");
  });

  it("async controlled: the owner applies the state before resolving", async () => {
    function Controlled() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Switch.Root
          aria-label="Сводка"
          checked={checked}
          onCheckedChange={async (next) => {
            await Promise.resolve();
            setChecked(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const control = screen.getByRole("switch");
    await act(async () => {
      fireEvent.click(control);
    });
    expect(control).toBeChecked();
    expect(control).not.toHaveAttribute("aria-busy");
  });

  it("loading: busy, ignores presses", () => {
    const onCheckedChange = vi.fn();
    render(<Switch.Root aria-label="Сводка" loading onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch");
    expect(control).toHaveAttribute("aria-busy", "true");
    fireEvent.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(control).not.toBeChecked();
  });
});
