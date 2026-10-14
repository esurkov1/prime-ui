import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { setControlValue } from "./controlValue";

function ControlledInput({ onValue }: { onValue: (value: string) => void }) {
  const [value, setValue] = React.useState("");
  return (
    <input
      aria-label="Сумма"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onValue(event.target.value);
      }}
    />
  );
}

describe("setControlValue", () => {
  it("reaches a controlled input's onChange as typing would", () => {
    const onValue = vi.fn();
    render(<ControlledInput onValue={onValue} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    setControlValue(input, "12 480");
    expect(onValue).toHaveBeenCalledWith("12 480");
    expect(input.value).toBe("12 480");
  });

  it("writes a textarea through its own value setter", () => {
    const onChange = vi.fn();
    render(<textarea aria-label="Комментарий" defaultValue="" onChange={onChange} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    setControlValue(textarea, "Счёт выставлен");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe("Счёт выставлен");
  });

  it("fires again when the same control is cleared", () => {
    const onValue = vi.fn();
    render(<ControlledInput onValue={onValue} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "draft" } });
    setControlValue(input, "");
    expect(onValue).toHaveBeenLastCalledWith("");
    expect(input.value).toBe("");
  });
});
