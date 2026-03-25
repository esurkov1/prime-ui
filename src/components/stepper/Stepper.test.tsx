import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stepper } from "./Stepper";
import styles from "./Stepper.module.css";

function ThreeStepStepper(props: { currentStep?: number }) {
  return (
    <Stepper.Root currentStep={props.currentStep}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="First" description="Step one" />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Second" description="Step two" />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Third" description="Step three" />
      </Stepper.Step>
    </Stepper.Root>
  );
}

describe("Stepper", () => {
  it("renders", () => {
    render(<ThreeStepStepper />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("with currentStep=1 marks step 0 completed, 1 active, 2 pending", () => {
    const { container } = render(<ThreeStepStepper currentStep={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-status", "completed");
    expect(items[1]).toHaveAttribute("data-status", "active");
    expect(items[2]).toHaveAttribute("data-status", "pending");
    expect((items[0] as HTMLElement).querySelector("svg")).toBeTruthy();
    expect(within(items[1] as HTMLElement).getByText("2")).toBeInTheDocument();
    expect(within(items[2] as HTMLElement).getByText("3")).toBeInTheDocument();
    expect(within(items[1] as HTMLElement).getByRole("button")).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(container.querySelector(`.${styles.root}`)).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("status override wins over derived status", () => {
    render(
      <Stepper.Root currentStep={0}>
        <Stepper.Step status="error">
          <Stepper.Indicator />
          <Stepper.Content title="Broken" />
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="Next" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-status", "error");
    expect(items[1]).toHaveAttribute("data-status", "pending");
  });

  it("sets data-orientation on root", () => {
    const { container } = render(
      <Stepper.Root orientation="horizontal">
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="A" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(container.querySelector(`.${styles.root}`)).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("defaults data-size to m and respects size prop", () => {
    const { container, rerender } = render(<ThreeStepStepper />);
    expect(container.querySelector(`.${styles.root}`)).toHaveAttribute("data-size", "m");
    rerender(
      <Stepper.Root currentStep={0} size="xl">
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="First" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(container.querySelector(`.${styles.root}`)).toHaveAttribute("data-size", "xl");
  });

  it("explicit index overrides auto index for that step only", () => {
    render(
      <Stepper.Root currentStep={0}>
        <Stepper.Step index={1}>
          <Stepper.Indicator />
          <Stepper.Content title="Forced index 1" />
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="Auto index 0" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-status", "pending");
    expect(within(items[0] as HTMLElement).getByText("2")).toBeInTheDocument();
    expect(items[1]).toHaveAttribute("data-status", "active");
    expect(within(items[1] as HTMLElement).getByText("1")).toBeInTheDocument();
  });

  it("renders StepperIndicator custom children", () => {
    render(
      <Stepper.Root>
        <Stepper.Step>
          <Stepper.Indicator>★</Stepper.Indicator>
          <Stepper.Content title="Star" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("renders StepperContent title and description", () => {
    render(
      <Stepper.Root>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="T" description="D" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders SeparatorIcon between horizontal steps without consuming step index", () => {
    const { container } = render(
      <Stepper.Root orientation="horizontal" currentStep={1}>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="A" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="B" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content title="C" />
        </Stepper.Step>
      </Stepper.Root>,
    );
    expect(container.querySelectorAll(`ol.${styles.root} > li`)).toHaveLength(5);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect((buttons[0] as HTMLElement).querySelector("svg")).toBeTruthy();
    expect(within(buttons[1] as HTMLElement).getByText("2")).toBeInTheDocument();
    expect(within(buttons[2] as HTMLElement).getByText("3")).toBeInTheDocument();
  });
});
