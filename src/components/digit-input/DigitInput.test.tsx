import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DigitInput } from "./DigitInput";

describe("DigitInput", () => {
  it("renders 4 cells by default", () => {
    render(<DigitInput.Root />);

    expect(screen.getByRole("group", { name: "Digit input" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("renders 6 cells when length is 6", () => {
    render(<DigitInput.Root length={6} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("moves focus to the next cell after typing a digit", async () => {
    const user = userEvent.setup();
    render(<DigitInput.Root />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "7");

    expect(inputs[0]).toHaveValue("7");
    expect(inputs[1]).toHaveFocus();
  });

  it("moves focus to the previous cell on Backspace when empty", async () => {
    const user = userEvent.setup();
    render(<DigitInput.Root defaultValue="1" />);

    const inputs = screen.getAllByRole("textbox");
    inputs[1].focus();
    await user.keyboard("{Backspace}");

    expect(inputs[0]).toHaveFocus();
  });

  it("calls onChange on each change", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DigitInput.Root onChange={onChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "9");

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBe("9");
  });

  it("calls onComplete when all digits are filled", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<DigitInput.Root length={4} onComplete={onComplete} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");
    await user.type(inputs[3], "4");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("disables all cells", () => {
    render(<DigitInput.Root disabled />);

    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled();
    }
  });

  it("sets error state on the root", () => {
    const { container } = render(<DigitInput.Root hasError />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-has-error", "true");
  });

  it("defaults data-size to m", () => {
    const { container } = render(<DigitInput.Root />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from the size prop", () => {
    const { container } = render(<DigitInput.Root size="xl" />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-size", "xl");
  });

  it("mirrors data-size on each cell", () => {
    render(<DigitInput.Root size="l" length={4} />);

    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toHaveAttribute("data-size", "l");
    }
  });
});
