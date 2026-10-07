import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DigitInput } from "./DigitInput";

describe("DigitInput", () => {
  it("renders 4 cells by default", () => {
    render(<DigitInput />);

    expect(screen.getByRole("group", { name: "Код" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByRole("textbox", { name: "Цифра 1 из 4" })).toBeInTheDocument();
  });

  it("names the group and cells from labels", () => {
    render(<DigitInput length={2} labels={{ group: "PIN", cell: "Digit {index}/{length}" }} />);

    expect(screen.getByRole("group", { name: "PIN" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Digit 2/2" })).toBeInTheDocument();
  });

  it("renders 6 cells when length is 6", () => {
    render(<DigitInput length={6} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("moves focus to the next cell after typing a digit", async () => {
    const user = userEvent.setup();
    render(<DigitInput />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "7");

    expect(inputs[0]).toHaveValue("7");
    expect(inputs[1]).toHaveFocus();
  });

  it("moves focus to the previous cell on Backspace when empty", async () => {
    const user = userEvent.setup();
    render(<DigitInput defaultValue="1" />);

    const inputs = screen.getAllByRole("textbox");
    inputs[1].focus();
    await user.keyboard("{Backspace}");

    expect(inputs[0]).toHaveFocus();
  });

  it("calls onValueChange on each change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DigitInput onValueChange={onValueChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "9");

    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("9");
  });

  it("renders a controlled value and ignores non-digits", () => {
    render(<DigitInput value="1a2" />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("");
  });

  it("fills cells from a pasted code", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DigitInput onValueChange={onValueChange} />);

    screen.getAllByRole("textbox")[0].focus();
    await user.paste("12-34");

    expect(onValueChange).toHaveBeenLastCalledWith("1234");
  });

  it("calls onComplete when all digits are filled", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<DigitInput length={4} onComplete={onComplete} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");
    await user.type(inputs[3], "4");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("disables all cells", () => {
    const { container } = render(<DigitInput disabled />);

    expect(container.querySelector("fieldset")).toHaveAttribute("data-disabled", "true");
    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled();
    }
  });

  it("sets invalid state on the root and cells", () => {
    const { container } = render(<DigitInput invalid />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("aria-invalid", "true");
  });

  it("defaults data-size to m", () => {
    const { container } = render(<DigitInput />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from the size prop", () => {
    const { container } = render(<DigitInput size="xl" />);

    const root = container.querySelector("fieldset");
    expect(root).toHaveAttribute("data-size", "xl");
  });

  it("mirrors data-size on each cell", () => {
    render(<DigitInput size="l" length={4} />);

    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toHaveAttribute("data-size", "l");
    }
  });
});

describe("DigitInput field frame", () => {
  it("names the group by the label; clicking the label focuses the first cell", async () => {
    render(<DigitInput label="Код из SMS" required />);
    expect(screen.getByRole("group", { name: "Код из SMS" })).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    for (const input of screen.getAllByRole("textbox")) expect(input).toBeRequired();
    await userEvent.click(screen.getByText("Код из SMS"));
    expect(screen.getByRole("textbox", { name: "Цифра 1 из 4" })).toHaveFocus();
  });

  it("describes the group by the hint, then by the error that replaces it", () => {
    const { rerender } = render(<DigitInput label="Код" hint="Код действует 5 минут" />);
    expect(screen.getByRole("group", { name: "Код" })).toHaveAccessibleDescription(
      "Код действует 5 минут",
    );
    rerender(<DigitInput label="Код" hint="Код действует 5 минут" error="Неверный код" />);
    const group = screen.getByRole("group", { name: "Код" });
    expect(group).toHaveAccessibleDescription("Неверный код");
    expect(group).toHaveAttribute("data-invalid", "true");
    expect(screen.queryByText("Код действует 5 минут")).toBeNull();
  });
});

describe("DigitInput focusRing", () => {
  it("focusRing={false} marks the group and keeps the invalid state", () => {
    render(<DigitInput length={2} focusRing={false} invalid />);
    const group = screen.getByRole("group", { name: "Код" });
    expect(group).toHaveAttribute("data-focus-ring", "false");
    expect(group).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("aria-invalid", "true");
  });

  it("sets data-full-width on the group only with fullWidth", () => {
    const { rerender } = render(<DigitInput />);
    expect(screen.getByRole("group")).not.toHaveAttribute("data-full-width");
    rerender(<DigitInput fullWidth />);
    expect(screen.getByRole("group")).toHaveAttribute("data-full-width", "true");
  });

  it("marks the first cell of every group with groupSize", () => {
    render(<DigitInput length={6} groupSize={3} />);
    const starts = screen
      .getAllByRole("textbox")
      .map((cell) => cell.getAttribute("data-group-start") === "true");
    expect(starts).toEqual([false, false, false, true, false, false]);
  });

  it("mask renders password cells", () => {
    const { container } = render(<DigitInput mask defaultValue="12" />);
    expect(container.querySelectorAll('input[type="password"]')).toHaveLength(4);
  });

  it("carries the joined code in a hidden input with name", () => {
    const { container } = render(<DigitInput name="code" length={4} defaultValue="12" />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("code");
    expect(hidden.value).toBe("12");
  });

  it("has no hidden input without name", () => {
    const { container } = render(<DigitInput />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("autoFocus focuses the first empty cell", () => {
    render(<DigitInput length={4} defaultValue="12" autoFocus />);
    expect(screen.getByRole("textbox", { name: "Цифра 3 из 4" })).toHaveFocus();
  });

  it("redirects focus from a later cell to the first empty one", async () => {
    render(<DigitInput length={4} defaultValue="1" />);
    await userEvent.click(screen.getByRole("textbox", { name: "Цифра 4 из 4" }));
    expect(screen.getByRole("textbox", { name: "Цифра 2 из 4" })).toHaveFocus();
  });

  it("does not leave gaps when a digit is typed past the first empty cell", () => {
    const onValueChange = vi.fn();
    render(<DigitInput length={4} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Цифра 3 из 4" }), {
      target: { value: "7" },
    });
    expect(onValueChange).toHaveBeenLastCalledWith("7");
    expect(screen.getByRole("textbox", { name: "Цифра 1 из 4" })).toHaveValue("7");
  });

  it("accepts a whole code delivered into one cell (autofill)", () => {
    const onComplete = vi.fn();
    render(<DigitInput length={4} onComplete={onComplete} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Цифра 1 из 4" }), {
      target: { value: "4821" },
    });
    expect(onComplete).toHaveBeenCalledWith("4821");
  });

  it("Home and End move between the first and the entry cell", async () => {
    render(<DigitInput length={4} defaultValue="12" />);
    const third = screen.getByRole("textbox", { name: "Цифра 3 из 4" });
    third.focus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("textbox", { name: "Цифра 1 из 4" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(third).toHaveFocus();
  });
});
