import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NativeSelect } from "./NativeSelect";

describe("NativeSelect", () => {
  it("renders the system select with its options", () => {
    const { container } = render(
      <NativeSelect aria-label="Тема">
        <option value="light">Светлая</option>
        <option value="dark">Тёмная</option>
      </NativeSelect>,
    );
    expect(container.querySelector("select")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onValueChange and the native onChange with the picked value", () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <NativeSelect aria-label="Тема" onValueChange={onValueChange} onChange={onChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </NativeSelect>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows the placeholder as the empty first option while nothing is picked", () => {
    render(
      <NativeSelect aria-label="Город" placeholder="Выберите город">
        <option value="msk">Москва</option>
      </NativeSelect>,
    );
    const select = screen.getByRole<HTMLSelectElement>("combobox");
    expect(select.value).toBe("");
    expect(screen.getByRole("option", { name: "Выберите город" })).toHaveValue("");
  });

  it("forwards id, name and the accessible name", () => {
    render(
      <>
        <span id="city-label">Город</span>
        <NativeSelect id="city" name="city" aria-labelledby="city-label">
          <option value="a">A</option>
        </NativeSelect>
      </>,
    );
    const city = screen.getByRole("combobox", { name: "Город" });
    expect(city).toHaveAttribute("id", "city");
    expect(city).toHaveAttribute("name", "city");
  });

  it("label, hint and error: label names the select, error replaces the hint and implies invalid", () => {
    const { rerender } = render(
      <NativeSelect label="Страна" hint="Для счетов" required>
        <option value="a">A</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox", { name: /Страна/ });
    expect(select).toBeRequired();
    expect(select).toHaveAccessibleDescription("Для счетов");
    expect(select).not.toHaveAttribute("aria-invalid");

    rerender(
      <NativeSelect label="Страна" hint="Для счетов" error="Обязательно">
        <option value="a">A</option>
      </NativeSelect>,
    );
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("data-invalid", "true");
    expect(select).toHaveAccessibleDescription("Обязательно");
  });

  it("size, disabled and focusRing reach the select", () => {
    render(
      <NativeSelect aria-label="Тема" size="l" disabled focusRing={false}>
        <option value="a">A</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("data-size", "l");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("data-focus-ring", "false");
  });

  it("is reachable with Tab and changes with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NativeSelect aria-label="Тема" onValueChange={onValueChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </NativeSelect>,
    );
    await user.tab();
    const select = screen.getByRole("combobox");
    expect(select).toHaveFocus();
    await user.selectOptions(select, "b");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});
