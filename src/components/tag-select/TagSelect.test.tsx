import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { TagSelect } from "./TagSelect";

const sampleOptions = [
  { value: "a", label: "Alpha", color: "blue" as const },
  { value: "b", label: "Beta", color: "green" as const },
];

function BasicTagSelect(props: Partial<React.ComponentProps<typeof TagSelect.Root>>) {
  return (
    <TagSelect.Root
      options={sampleOptions}
      defaultValue={[]}
      placeholder="Теги"
      aria-label="Тестовый tag select"
      {...props}
    />
  );
}

describe("TagSelect", () => {
  it("рендерит combobox", () => {
    render(<BasicTagSelect />);
    expect(screen.getByRole("combobox", { name: "Тестовый tag select" })).toBeInTheDocument();
  });

  it("открывает listbox при фокусе", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("добавляет тег по клику на опцию", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Alpha" }));
    expect(screen.getByRole("button", { name: /Remove Alpha/i })).toBeInTheDocument();
  });

  it("снимает последний тег по Backspace при пустом вводе", () => {
    render(<BasicTagSelect defaultValue={["a"]} />);
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.queryByRole("button", { name: /Remove Alpha/i })).not.toBeInTheDocument();
  });

  it("в режиме creatable показывает строку создания для нового текста", () => {
    render(<BasicTagSelect creatable />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "новый" } });
    expect(screen.getByRole("option", { name: /новый/i })).toBeInTheDocument();
  });

  it("вызывает onValueChange при выборе", () => {
    const onValueChange = vi.fn();
    render(<BasicTagSelect onValueChange={onValueChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });
});
