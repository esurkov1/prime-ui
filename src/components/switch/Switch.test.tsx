import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("uses non-dimmed track when disabled and keeps the checked state", () => {
    const { unmount: unmountOff } = render(
      <Switch.Root disabled>
        <Switch.Label>Disabled off</Switch.Label>
      </Switch.Root>,
    );

    const controlOff = screen.getByRole("switch", { name: "Disabled off" });
    const trackOff = controlOff.nextElementSibling as HTMLElement;
    expect(trackOff).toBeTruthy();
    expect(window.getComputedStyle(trackOff).opacity).not.toBe("0.6");
    expect(controlOff).not.toBeChecked();

    unmountOff();

    const { container: onContainer } = render(
      <Switch.Root disabled defaultChecked>
        <Switch.Label>Disabled on</Switch.Label>
      </Switch.Root>,
    );
    const controlOn = screen.getByRole("switch", { name: "Disabled on" });
    const trackOn = controlOn.nextElementSibling as HTMLElement;
    expect(window.getComputedStyle(trackOn).opacity).not.toBe("0.6");
    expect(controlOn).toBeChecked();

    fireEvent.click(screen.getByText("Disabled on"));
    expect(controlOn).toBeChecked();

    const field = onContainer.querySelector("[data-disabled='true']");
    expect(field).toBeTruthy();
    expect(field).toHaveAttribute("data-state", "checked");
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
});
