import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DigitInput } from "./DigitInput";

describe("DigitInput", () => {
  it("renders 4 cells by default", () => {
    render(<DigitInput.Root />);

    expect(screen.getByRole("group", { name: "Код" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByRole("textbox", { name: "Цифра 1 из 4" })).toBeInTheDocument();
  });

  it("names the group and cells from labels", () => {
    render(
      <DigitInput.Root length={2} labels={{ group: "PIN", cell: "Digit {index}/{length}" }} />,
    );

    expect(screen.getByRole("group", { name: "PIN" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Digit 2/2" })).toBeInTheDocument();
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

  it("calls onValueChange on each change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DigitInput.Root onValueChange={onValueChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "9");

    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("9");
  });

  it("renders a controlled value and ignores non-digits", () => {
    render(<DigitInput.Root value="1a2" />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("");
  });

  it("fills cells from a pasted code", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DigitInput.Root onValueChange={onValueChange} />);

    screen.getAllByRole("textbox")[0].focus();
    await user.paste("12-34");

    expect(onValueChange).toHaveBeenLastCalledWith("1234");
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
    const { container } = render(<DigitInput.Root disabled />);

    expect(container.querySelector("fieldset")).toHaveAttribute("data-disabled", "true");
    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled();
    }
  });

  it("sets invalid state on the root and cells", () => {
    const { container } = render(<DigitInput.Root invalid />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("aria-invalid", "true");
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

describe("DigitInput focusRing", () => {
  it("focusRing={false} marks the group and keeps the invalid state", () => {
    render(<DigitInput.Root length={2} focusRing={false} invalid />);
    const group = screen.getByRole("group", { name: "Код" });
    expect(group).toHaveAttribute("data-focus-ring", "false");
    expect(group).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("aria-invalid", "true");
  });
});
