import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Radio } from "./Radio";
import styles from "./Radio.module.css";

describe("Radio", () => {
  it("renders a radiogroup with name and value on every option", () => {
    render(
      <Radio.Group name="plan" aria-label="Plan">
        <Radio.Root value="pro">
          <Radio.Label>Pro plan</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );

    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    const radio = screen.getByRole("radio", { name: "Pro plan" });
    expect(radio).toHaveAttribute("name", "plan");
    expect(radio).toHaveAttribute("value", "pro");
  });

  it("generates a shared name when none is passed", () => {
    render(
      <Radio.Group>
        <Radio.Root value="a">
          <Radio.Label>A</Radio.Label>
        </Radio.Root>
        <Radio.Root value="b">
          <Radio.Label>B</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );
    const [a, b] = screen.getAllByRole("radio");
    expect(a.getAttribute("name")).toBeTruthy();
    expect(a.getAttribute("name")).toBe(b.getAttribute("name"));
  });

  it("shows the checked option from defaultValue with the inner dot", () => {
    const { container } = render(
      <Radio.Group defaultValue="a">
        <Radio.Root value="a">
          <Radio.Label>Option A</Radio.Label>
        </Radio.Root>
        <Radio.Root value="b">
          <Radio.Label>Option B</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );

    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Option B" })).not.toBeChecked();
    expect(
      container.querySelector(`input:checked + .${styles.control} .${styles.dot}`),
    ).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Option A" }).closest("[data-state]")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("keeps one option checked (uncontrolled) and reports onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <Radio.Group defaultValue="basic" onValueChange={onValueChange}>
        <Radio.Root value="basic">
          <Radio.Label>Basic</Radio.Label>
        </Radio.Root>
        <Radio.Root value="pro">
          <Radio.Label>Pro</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );

    const basic = screen.getByRole("radio", { name: "Basic" });
    const pro = screen.getByRole("radio", { name: "Pro" });
    fireEvent.click(pro);
    expect(pro).toBeChecked();
    expect(basic).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("follows the controlled value", () => {
    function Controlled() {
      const [value, setValue] = React.useState("week");
      return (
        <>
          <Radio.Group value={value} onValueChange={setValue}>
            <Radio.Root value="week">
              <Radio.Label>Week</Radio.Label>
            </Radio.Root>
            <Radio.Root value="month">
              <Radio.Label>Month</Radio.Label>
            </Radio.Root>
          </Radio.Group>
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(screen.getByRole("status")).toHaveTextContent("month");
    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
  });

  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Radio.Group defaultValue="a">
        <Radio.Root value="a">
          <Radio.Label>A</Radio.Label>
        </Radio.Root>
        <Radio.Root value="b">
          <Radio.Label>B</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );
    screen.getByRole("radio", { name: "A" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
  });

  it("disables an option and ignores label activation", async () => {
    const user = userEvent.setup();
    render(
      <Radio.Group defaultValue="on">
        <Radio.Root value="on">
          <Radio.Label>On</Radio.Label>
        </Radio.Root>
        <Radio.Root value="off" disabled>
          <Radio.Label>Off</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );

    const off = screen.getByRole("radio", { name: "Off" });
    expect(off).toBeDisabled();
    await user.click(screen.getByText("Off"));
    expect(off).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "On" })).toBeChecked();
  });

  it("disables every option when the group is disabled", () => {
    render(
      <Radio.Group disabled>
        <Radio.Root value="a">
          <Radio.Label>A</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();
  });

  it("marks aria-invalid from the group and from an option", () => {
    render(
      <>
        <Radio.Group invalid aria-label="Risk">
          <Radio.Root value="high">
            <Radio.Label>High</Radio.Label>
          </Radio.Root>
        </Radio.Group>
        <Radio.Group>
          <Radio.Root value="low" invalid>
            <Radio.Label>Low</Radio.Label>
          </Radio.Root>
        </Radio.Group>
      </>,
    );

    expect(screen.getByRole("radiogroup", { name: "Risk" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("radio", { name: "High" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("radio", { name: "Low" })).toHaveAttribute("aria-invalid", "true");
  });

  it("sets required on the inputs and aria-required on the group", () => {
    render(
      <Radio.Group required aria-label="Req">
        <Radio.Root value="a">
          <Radio.Label>A</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );
    expect(screen.getByRole("radiogroup", { name: "Req" })).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeRequired();
  });

  it("marks aria-invalid and links the error when Radio.Error is rendered", () => {
    render(
      <Radio.Group>
        <Radio.Root value="yes">
          <Radio.Label>Yes</Radio.Label>
          <Radio.Error>This field has an error</Radio.Error>
        </Radio.Root>
      </Radio.Group>,
    );

    const radio = screen.getByRole("radio", { name: "Yes" });
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAccessibleDescription("This field has an error");
  });

  it("renders hint and links via aria-describedby", () => {
    render(
      <Radio.Group>
        <Radio.Root value="v">
          <Radio.Label>L</Radio.Label>
          <Radio.Hint>Helper copy</Radio.Hint>
        </Radio.Root>
      </Radio.Group>,
    );

    expect(screen.getByRole("radio", { name: "L" })).toHaveAccessibleDescription("Helper copy");
  });

  it("passes size and orientation to the DOM", () => {
    render(
      <Radio.Group size="l" orientation="horizontal" aria-label="Sized">
        <Radio.Root value="a">
          <Radio.Label>A</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );
    const group = screen.getByRole("radiogroup", { name: "Sized" });
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("radio", { name: "A" }).closest("[data-state]")).toHaveAttribute(
      "data-size",
      "l",
    );
  });

  it("forwards ref to input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <Radio.Group>
        <Radio.Root ref={ref} value="1">
          <Radio.Label>One</Radio.Label>
        </Radio.Root>
      </Radio.Group>,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("radio");
  });
});
