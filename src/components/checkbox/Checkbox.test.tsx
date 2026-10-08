import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox.Indicator", () => {
  it("draws the box without an input, hidden from assistive technology", () => {
    render(
      <div role="option" aria-selected="true" tabIndex={-1}>
        <Checkbox.Indicator checked data-testid="box" />
        Москва
      </div>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("aria-hidden", "true");
    expect(box).toHaveAttribute("data-state", "checked");
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByRole("option", { name: "Москва" })).toBeInTheDocument();
  });

  it("indeterminate wins over checked; disabled is marked", () => {
    render(<Checkbox.Indicator checked indeterminate disabled data-testid="box" />);
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-state", "indeterminate");
    expect(box).toHaveAttribute("data-disabled", "true");
  });

  it("takes the size of the nearest control, else m", async () => {
    const { ControlSizeProvider } = await import("@/internal/ControlSizeContext");
    const { rerender } = render(<Checkbox.Indicator data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveAttribute("data-size", "m");
    rerender(
      <ControlSizeProvider value="s">
        <Checkbox.Indicator data-testid="box" />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("data-size", "s");
  });
});

describe("Checkbox", () => {
  it("renders the bare control when Checkbox.Label is omitted", () => {
    render(<Checkbox.Root aria-label="Выбрать строку" />);
    expect(screen.getAllByRole("checkbox", { name: "Выбрать строку" })).toHaveLength(1);
  });

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
      <Checkbox.Root hint="We value your privacy">
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText("We value your privacy")).toBeInTheDocument();
  });

  it("renders with error text that replaces the hint", () => {
    render(
      <Checkbox.Root hint="We value your privacy" error="You must accept terms">
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText("You must accept terms")).toBeInTheDocument();
    expect(screen.queryByText("We value your privacy")).toBeNull();
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

  it("marks control invalid when an error is set", () => {
    render(
      <Checkbox.Root error="You must accept terms">
        <Checkbox.Label>Accept terms</Checkbox.Label>
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

  it("sets aria-describedby for the hint, then for the error that replaces it", () => {
    const { rerender } = render(
      <Checkbox.Root hint="Helper" aria-describedby="external">
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute(
      "aria-describedby",
      `external ${screen.getByText("Helper").id}`,
    );
    rerender(
      <Checkbox.Root hint="Helper" error="Required" aria-describedby="external">
        <Checkbox.Label>Accept</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(checkbox).toHaveAttribute(
      "aria-describedby",
      `external ${screen.getByText("Required").id}`,
    );
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

  it("keeps its state when readOnly (click and Space) and marks aria-readonly", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox.Root defaultChecked readOnly onCheckedChange={onChange}>
        <Checkbox.Label>Locked</Checkbox.Label>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Locked" });
    expect(checkbox).toHaveAttribute("aria-readonly", "true");
    expect(checkbox).not.toBeDisabled();

    fireEvent.click(screen.getByText("Locked"));
    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(checkbox).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
