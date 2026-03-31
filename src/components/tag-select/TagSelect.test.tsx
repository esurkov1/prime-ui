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
    fireEvent.change(input, { target: { value: "новый" } });
    expect(screen.getByRole("option", { name: /новый/i })).toBeInTheDocument();
  });

  it("после creatable снятие чипа оставляет значение в списке опций", () => {
    render(<BasicTagSelect creatable />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "новый" } });
    fireEvent.click(screen.getByRole("option", { name: /новый/i }));
    expect(screen.getByRole("button", { name: /Remove новый/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Remove новый/i }));
    expect(screen.queryByRole("button", { name: /Remove новый/i })).not.toBeInTheDocument();
    fireEvent.focus(input);
    expect(screen.getByRole("option", { name: "новый" })).toBeInTheDocument();
  });

  it("не открывает список при фокусе если нечего выбирать и нет creatable", () => {
    render(<BasicTagSelect defaultValue={["a", "b"]} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("вызывает onValueChange при выборе", () => {
    const onValueChange = vi.fn();
    render(<BasicTagSelect onValueChange={onValueChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });

  it("вызывает onCreated только при создании через creatable", () => {
    const onCreated = vi.fn();
    render(<BasicTagSelect creatable onCreated={onCreated} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "newtag" } });
    fireEvent.click(screen.getByRole("option", { name: /newtag/i }));
    expect(onCreated).toHaveBeenCalledWith("newtag");
  });

  it("снимает тег по крестику при фокусе в поле ввода", () => {
    render(<BasicTagSelect defaultValue={["a"]} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole("button", { name: /Remove Alpha/i }));
    expect(screen.queryByRole("button", { name: /Remove Alpha/i })).not.toBeInTheDocument();
  });

  it("при optionManagement показывает кнопку меню у опции", () => {
    render(
      <BasicTagSelect
        optionManagement={{
          onUpdate: vi.fn(),
          onDelete: vi.fn(),
        }}
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("button", { name: /Edit tag Alpha/i })).toBeInTheDocument();
  });

  it("при optionManagement не дублирует уже выбранные в основном списке (только строки для добавления)", () => {
    render(
      <BasicTagSelect
        defaultValue={["a"]}
        optionManagement={{
          onUpdate: vi.fn(),
          onDelete: vi.fn(),
        }}
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument();
  });

  it("при optionManagement при всех выбранных тегах панель не открывается; после снятия тега — снова есть ⋯", () => {
    render(
      <BasicTagSelect
        defaultValue={["a", "b"]}
        optionManagement={{
          onUpdate: vi.fn(),
          onDelete: vi.fn(),
        }}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Remove Alpha/i }));
    fireEvent.focus(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Edit tag Alpha/i })).toBeInTheDocument();
  });

  it("вызывает onDelete из меню (опция видна, пока не выбрана в поле)", () => {
    const onDelete = vi.fn();
    render(
      <BasicTagSelect
        defaultValue={["b"]}
        optionManagement={{
          onUpdate: vi.fn(),
          onDelete,
        }}
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Edit tag Alpha/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Delete$/i }));
    expect(onDelete).toHaveBeenCalledWith("a");
  });
});
