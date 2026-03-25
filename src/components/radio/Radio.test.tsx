import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Radio } from "./Radio";
import styles from "./Radio.module.css";

describe("Radio", () => {
  it("renders with label, name and value", () => {
    render(
      <Radio.Root name="plan" value="pro">
        <Radio.Label>Pro plan</Radio.Label>
      </Radio.Root>,
    );

    const radio = screen.getByRole("radio", { name: "Pro plan" });
    expect(radio).toHaveAttribute("name", "plan");
    expect(radio).toHaveAttribute("value", "pro");
  });

  it("shows checked state with inner indicator in the checked branch of the DOM", () => {
    const { container } = render(
      <Radio.Root name="x" value="a" defaultChecked>
        <Radio.Label>Option A</Radio.Label>
      </Radio.Root>,
    );

    const radio = screen.getByRole("radio", { name: "Option A" });
    expect(radio).toBeChecked();

    expect(container.querySelector(`input:checked + svg .${styles.innerCircle}`)).toBeTruthy();
  });

  it("renders inner indicator outside the checked selector when unchecked", () => {
    const { container } = render(
      <Radio.Root name="x" value="b">
        <Radio.Label>Option B</Radio.Label>
      </Radio.Root>,
    );

    expect(screen.getByRole("radio", { name: "Option B" })).not.toBeChecked();

    expect(container.querySelector(`input:checked + svg .${styles.innerCircle}`)).toBeNull();
    expect(container.querySelector(`.${styles.innerCircle}`)).toBeTruthy();
  });

  it("keeps one option checked in a group", () => {
    render(
      <div>
        <Radio.Root name="plan" value="basic" defaultChecked>
          <Radio.Label>Basic</Radio.Label>
        </Radio.Root>
        <Radio.Root name="plan" value="pro">
          <Radio.Label>Pro</Radio.Label>
        </Radio.Root>
      </div>,
    );

    const basic = screen.getByRole("radio", { name: "Basic" });
    const pro = screen.getByRole("radio", { name: "Pro" });

    expect(basic).toBeChecked();
    expect(pro).not.toBeChecked();

    fireEvent.click(pro);
    expect(pro).toBeChecked();
    expect(basic).not.toBeChecked();
  });

  it("disables input and ignores label activation", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Radio.Root name="g" value="on" defaultChecked>
          <Radio.Label>On</Radio.Label>
        </Radio.Root>
        <Radio.Root name="g" value="off" disabled>
          <Radio.Label>Off</Radio.Label>
        </Radio.Root>
      </div>,
    );

    const off = screen.getByRole("radio", { name: "Off" });
    expect(off).toBeDisabled();
    expect(off).not.toBeChecked();

    await user.click(screen.getByText("Off"));
    expect(off).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "On" })).toBeChecked();
  });

  it("marks aria-invalid when variant is error", () => {
    render(
      <Radio.Root name="risk" value="high" variant="error">
        <Radio.Label>High</Radio.Label>
      </Radio.Root>,
    );

    expect(screen.getByRole("radio", { name: "High" })).toHaveAttribute("aria-invalid", "true");
  });

  it("marks aria-invalid and shows error text when Radio.Error is rendered", () => {
    render(
      <Radio.Root name="field" value="yes">
        <Radio.Label>Yes</Radio.Label>
        <Radio.Error>This field has an error</Radio.Error>
      </Radio.Root>,
    );

    const radio = screen.getByRole("radio", { name: "Yes" });
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("This field has an error")).toBeInTheDocument();
    const describedBy = radio.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const errorId = describedBy?.split(/\s+/).find((id) => id.endsWith("-error"));
    expect(errorId).toBeTruthy();
    const node = errorId ? document.getElementById(errorId) : null;
    expect(node?.textContent).toBe("This field has an error");
  });

  it("renders hint and links via aria-describedby", () => {
    render(
      <Radio.Root name="n" value="v">
        <Radio.Label>L</Radio.Label>
        <Radio.Hint>Helper copy</Radio.Hint>
      </Radio.Root>,
    );

    const radio = screen.getByRole("radio", { name: "L" });
    expect(screen.getByText("Helper copy")).toBeInTheDocument();
    const describedBy = radio.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const hintId = describedBy?.split(/\s+/).find((id) => id.endsWith("-hint"));
    expect(hintId).toBeTruthy();
    const node = hintId ? document.getElementById(hintId) : null;
    expect(node?.textContent).toBe("Helper copy");
  });

  it("forwards ref to input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <Radio.Root ref={ref} name="r" value="1">
        <Radio.Label>One</Radio.Label>
      </Radio.Root>,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("radio");
  });
});
