import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("names the switch from Switch.Label and describes it with Switch.Hint", () => {
    render(
      <Switch.Root>
        <Switch.Label>Тёмная тема</Switch.Label>
        <Switch.Hint>Подсказка</Switch.Hint>
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
    expect(control).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByText("Readonly switch"));
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("uses non-dimmed track when disabled and keeps checked + aria-checked in sync", () => {
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
    expect(controlOff).toHaveAttribute("aria-checked", "false");

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
    expect(controlOn).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByText("Disabled on"));
    expect(controlOn).toBeChecked();
    expect(controlOn).toHaveAttribute("aria-checked", "true");

    const field = onContainer.querySelector("[data-disabled='true']");
    expect(field).toBeTruthy();
    expect(field).toHaveAttribute("data-state", "checked");
  });

  it("renders hint and error sub-components", () => {
    render(
      <Switch.Root>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.Hint>You will receive push notifications</Switch.Hint>
        <Switch.Error>Required field</Switch.Error>
      </Switch.Root>,
    );
    expect(screen.getByText("You will receive push notifications")).toBeInTheDocument();
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets invalid and fullWidth data attributes", () => {
    const { container } = render(
      <Switch.Root invalid fullWidth>
        <Switch.Label>Terms</Switch.Label>
      </Switch.Root>,
    );
    const field = container.firstElementChild;
    expect(field).toHaveAttribute("data-invalid", "true");
    expect(field).toHaveAttribute("data-full-width", "true");
    expect(field).toHaveAttribute("data-state", "unchecked");
  });
});
