import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { Stepper } from "./Stepper";

function Step({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <Stepper.Indicator />
      <Stepper.Content>
        <Stepper.Title>{title}</Stepper.Title>
        {description ? <Stepper.Description>{description}</Stepper.Description> : null}
      </Stepper.Content>
    </>
  );
}

function ThreeStepStepper(props: Omit<React.ComponentProps<typeof Stepper.Root>, "children">) {
  return (
    <Stepper.Root {...props}>
      <Stepper.Item>
        <Step title="First" description="Step one" />
      </Stepper.Item>
      <Stepper.Item>
        <Step title="Second" description="Step two" />
      </Stepper.Item>
      <Stepper.Item>
        <Step title="Third" description="Step three" />
      </Stepper.Item>
    </Stepper.Root>
  );
}

describe("Stepper", () => {
  it("renders an ordered list of step buttons", () => {
    render(<ThreeStepStepper />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Step one")).toBeInTheDocument();
  });

  it("with value=1 marks step 0 completed, 1 current, 2 pending", () => {
    render(<ThreeStepStepper value={1} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("data-status", "completed");
    expect(buttons[1]).toHaveAttribute("data-status", "current");
    expect(buttons[2]).toHaveAttribute("data-status", "pending");
    expect(buttons[0].querySelector("svg")).toBeTruthy();
    expect(within(buttons[1]).getByText("2")).toBeInTheDocument();
    expect(within(buttons[2]).getByText("3")).toBeInTheDocument();
    expect(buttons[1]).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "vertical");
  });

  it("status override wins over derived status", () => {
    render(
      <Stepper.Root value={0}>
        <Stepper.Item status="danger">
          <Step title="Broken" />
        </Stepper.Item>
        <Stepper.Item>
          <Step title="Next" />
        </Stepper.Item>
      </Stepper.Root>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("data-status", "danger");
    expect(buttons[1]).toHaveAttribute("data-status", "pending");
  });

  it("defaults data-size to m and respects size prop", () => {
    const { rerender } = render(<ThreeStepStepper />);
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "m");
    rerender(<ThreeStepStepper size="xl" />);
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "xl");
  });

  it("renders custom Indicator children", () => {
    render(
      <Stepper.Root>
        <Stepper.Item>
          <Stepper.Indicator>★</Stepper.Indicator>
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("draws horizontal separators inside the steps: every list item is a step", () => {
    render(<ThreeStepStepper orientation="horizontal" value={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) expect(item).not.toHaveAttribute("aria-hidden");
    // A decorative chevron leads each step; CSS shows it only between horizontal steps.
    expect(items[1].querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons[0].querySelector("svg")).toBeTruthy();
    expect(within(buttons[1]).getByText("2")).toBeInTheDocument();
    expect(within(buttons[2]).getByText("3")).toBeInTheDocument();
  });

  it("assigns indexes from steps produced by map", () => {
    render(
      <Stepper.Root value={0}>
        {["A", "B"].map((title) => (
          <Stepper.Item key={title}>
            <Step title={title} />
          </Stepper.Item>
        ))}
      </Stepper.Root>,
    );
    const buttons = screen.getAllByRole("button");
    expect(within(buttons[0]).getByText("1")).toBeInTheDocument();
    expect(within(buttons[1]).getByText("2")).toBeInTheDocument();
  });

  it("assigns stable indexes under StrictMode double rendering", () => {
    render(
      <React.StrictMode>
        <ThreeStepStepper />
      </React.StrictMode>,
    );
    const buttons = screen.getAllByRole("button");
    expect(within(buttons[0]).getByText("1")).toBeInTheDocument();
    expect(within(buttons[2]).getByText("3")).toBeInTheDocument();
  });

  it("uncontrolled: clicking a step selects it and calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(<ThreeStepStepper onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Third/ }));
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: /Third/ })).toHaveAttribute("aria-current", "step");
  });

  it("controlled: stays on value until the parent updates it", () => {
    render(<ThreeStepStepper value={0} />);
    fireEvent.click(screen.getByRole("button", { name: /Second/ }));
    expect(screen.getByRole("button", { name: /First/ })).toHaveAttribute("aria-current", "step");
  });

  it("items are native buttons: Tab reaches them and Enter selects", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ThreeStepStepper onValueChange={onValueChange} />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: /Second/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it("Space on a focused step selects it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ThreeStepStepper onValueChange={onValueChange} />);
    screen.getByRole("button", { name: /Third/ }).focus();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("speaks a completed or danger status with the step name, not by the circle alone", () => {
    render(
      <Stepper.Root value={2}>
        <Stepper.Item>
          <Step title="Paid" />
        </Stepper.Item>
        <Stepper.Item status="danger">
          <Step title="Delivery" />
        </Stepper.Item>
        <Stepper.Item>
          <Step title="Review" />
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(screen.getByRole("button", { name: "Paid, пройден" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delivery, требует внимания" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review" })).toHaveAttribute("aria-current", "step");
  });

  it("labels override the spoken statuses", () => {
    render(
      <Stepper.Root value={1} labels={{ completed: "done" }}>
        <Stepper.Item>
          <Step title="Paid" />
        </Stepper.Item>
        <Stepper.Item>
          <Step title="Review" />
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(screen.getByRole("button", { name: "Paid, done" })).toBeInTheDocument();
  });

  it("a danger step shows the danger glyph instead of its number", () => {
    render(
      <Stepper.Root value={0}>
        <Stepper.Item status="danger">
          <Step title="Delivery" />
        </Stepper.Item>
      </Stepper.Root>,
    );
    const button = screen.getByRole("button", { name: /Delivery/ });
    expect(within(button).queryByText("1")).not.toBeInTheDocument();
    expect(button.querySelector('[data-status="danger"] svg')).toBeInTheDocument();
  });

  it("`arrows` ends every vertical row with a hidden chevron, never a horizontal one", () => {
    const { rerender } = render(<ThreeStepStepper arrows />);
    for (const button of screen.getAllByRole("button")) {
      const last = button.lastElementChild;
      expect(last).toHaveAttribute("aria-hidden", "true");
      expect(last?.querySelector("svg")).toBeInTheDocument();
    }
    rerender(<ThreeStepStepper arrows orientation="horizontal" />);
    for (const button of screen.getAllByRole("button")) {
      expect(button.lastElementChild?.querySelector("svg")).toBeNull();
    }
  });

  it("the root takes the host tier when it has no size", () => {
    render(
      <ControlSizeProvider value="xs">
        <ThreeStepStepper />
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "xs");
  });

  it("disabled steps do not select", () => {
    const onValueChange = vi.fn();
    render(
      <Stepper.Root onValueChange={onValueChange}>
        <Stepper.Item>
          <Step title="A" />
        </Stepper.Item>
        <Stepper.Item disabled>
          <Step title="B" />
        </Stepper.Item>
      </Stepper.Root>,
    );
    const b = screen.getByRole("button", { name: /B/ });
    expect(b).toBeDisabled();
    fireEvent.click(b);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
