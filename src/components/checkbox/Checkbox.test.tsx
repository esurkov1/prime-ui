import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders without crashing", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label />
      </Checkbox.Root>,
    );
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with hint", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Hint>We value your privacy</Checkbox.Hint>
      </Checkbox.Root>,
    );
    expect(screen.getByText("We value your privacy")).toBeInTheDocument();
  });

  it("renders with error text", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Error>You must accept terms</Checkbox.Error>
      </Checkbox.Root>,
    );
    expect(screen.getByText("You must accept terms")).toBeInTheDocument();
  });

  it("toggles checked state on click (uncontrolled)", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByText("Accept terms"));
    expect(checkbox).toBeChecked();

    fireEvent.click(screen.getByText("Accept terms"));
    expect(checkbox).not.toBeChecked();
  });

  it("respects defaultChecked", () => {
    render(
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Pre-checked</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("works as controlled component", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Checkbox.Root checked={false} onCheckedChange={onChange}>
        <Checkbox.Label />
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkbox).not.toBeChecked();

    rerender(
      <Checkbox.Root checked={true} onCheckedChange={onChange}>
        <Checkbox.Label />
      </Checkbox.Root>,
    );
    expect(checkbox).toBeChecked();
  });

  it("sets data-state=checked on wrapper when checked", () => {
    render(
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    const wrapper = screen.getByRole("checkbox").closest("[data-state]");
    expect(wrapper).toHaveAttribute("data-state", "checked");
  });

  it("sets data-state=unchecked when unchecked", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    const wrapper = screen.getByRole("checkbox").closest("[data-state]");
    expect(wrapper).toHaveAttribute("data-state", "unchecked");
  });

  it("sets indeterminate property on native input", () => {
    render(
      <Checkbox.Root indeterminate>
        <Checkbox.Label>Partial</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("sets data-state=indeterminate when indeterminate", () => {
    render(
      <Checkbox.Root indeterminate>
        <Checkbox.Label>Partial</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const wrapper = checkbox.closest("[data-state]");
    expect(wrapper).toHaveAttribute("data-state", "indeterminate");
  });

  it("indeterminate wins over checked in data-state", () => {
    render(
      <Checkbox.Root defaultChecked indeterminate>
        <Checkbox.Label />
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const wrapper = checkbox.closest("[data-state]");
    expect(wrapper).toHaveAttribute("data-state", "indeterminate");
  });

  it("marks control invalid when Checkbox.Error is rendered", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Error>You must accept terms</Checkbox.Error>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("marks control invalid when invalid is set", () => {
    render(
      <Checkbox.Root invalid>
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when valid", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toHaveAttribute("aria-invalid");
  });

  it("sets aria-describedby for hint and error", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Accept</Checkbox.Label>
        <Checkbox.Hint>Helper</Checkbox.Hint>
        <Checkbox.Error>Required</Checkbox.Error>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const describedBy = checkbox.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toBeTruthy();
    const hintEl = screen.getByText("Helper");
    const errorEl = screen.getByText("Required");
    expect(describedBy).toContain(hintEl.id);
    expect(describedBy).toContain(errorEl.id);
  });

  it("sets data-disabled on wrapper when disabled", () => {
    render(
      <Checkbox.Root disabled>
        <Checkbox.Label>Disabled</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const wrapper = checkbox.closest("[data-disabled]");
    expect(wrapper).toHaveAttribute("data-disabled", "true");
    expect(checkbox).toBeDisabled();
  });

  it("sets data-size attribute for m size", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>Small</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const wrapper = checkbox.closest("[data-size]");
    expect(wrapper).toHaveAttribute("data-size", "m");
  });

  it("sets data-size attribute for l size", () => {
    render(
      <Checkbox.Root size="l">
        <Checkbox.Label>Medium</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    const wrapper = checkbox.closest("[data-size]");
    expect(wrapper).toHaveAttribute("data-size", "l");
  });

  it("forwards ref to the native input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <Checkbox.Root ref={ref}>
        <Checkbox.Label>Ref test</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  it("calls onCheckedChange when the label is clicked", () => {
    const onChange = vi.fn();
    render(
      <Checkbox.Root onCheckedChange={onChange}>
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    fireEvent.click(screen.getByText("Accept"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles with the Space key", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox.Root onCheckedChange={onChange}>
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    screen.getByRole("checkbox").focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not fire onCheckedChange when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox.Root disabled onCheckedChange={onChange}>
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
