import { fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

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
      <Stepper.Step>
        <Step title="First" description="Step one" />
      </Stepper.Step>
      <Stepper.Step>
        <Step title="Second" description="Step two" />
      </Stepper.Step>
      <Stepper.Step>
        <Step title="Third" description="Step three" />
      </Stepper.Step>
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

  it("with value=1 marks step 0 completed, 1 active, 2 pending", () => {
    render(<ThreeStepStepper value={1} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("data-status", "completed");
    expect(buttons[1]).toHaveAttribute("data-status", "active");
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
        <Stepper.Step status="error">
          <Step title="Broken" />
        </Stepper.Step>
        <Stepper.Step>
          <Step title="Next" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("data-status", "error");
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
        <Stepper.Step>
          <Stepper.Indicator>★</Stepper.Indicator>
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("inserts separators between horizontal steps without consuming indexes", () => {
    render(<ThreeStepStepper orientation="horizontal" value={1} />);
    const list = screen.getByRole("list");
    expect(list.children).toHaveLength(5);
    expect(list.children[1]).toHaveAttribute("aria-hidden", "true");
    const buttons = screen.getAllByRole("button");
    expect(buttons[0].querySelector("svg")).toBeTruthy();
    expect(within(buttons[1]).getByText("2")).toBeInTheDocument();
    expect(within(buttons[2]).getByText("3")).toBeInTheDocument();
  });

  it("assigns indexes from steps produced by map", () => {
    render(
      <Stepper.Root value={0}>
        {["A", "B"].map((title) => (
          <Stepper.Step key={title}>
            <Step title={title} />
          </Stepper.Step>
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

  it("disabled steps do not select", () => {
    const onValueChange = vi.fn();
    render(
      <Stepper.Root onValueChange={onValueChange}>
        <Stepper.Step>
          <Step title="A" />
        </Stepper.Step>
        <Stepper.Step disabled>
          <Step title="B" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    const b = screen.getByRole("button", { name: /B/ });
    expect(b).toBeDisabled();
    fireEvent.click(b);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
