import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
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

  it("native focus and blur reach the select (form libraries mark it touched)", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <NativeSelect aria-label="Тема" onFocus={onFocus} onBlur={onBlur}>
        <option value="a">A</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox");
    fireEvent.focus(select);
    fireEvent.blur(select);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
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

  it("size and disabled reach the select", () => {
    render(
      <NativeSelect aria-label="Тема" size="l" disabled>
        <option value="a">A</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("data-size", "l");
    expect(select).toBeDisabled();
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

describe("NativeSelect — async onValueChange", () => {
  /** A promise the test settles by hand. */
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }

  it("holds the pick busy with a Spinner, not disabled; picks wait; resolve keeps it", async () => {
    const user = userEvent.setup();
    const save = deferred();
    const onValueChange = vi.fn((): void | Promise<void> => save.promise);
    const { container } = render(
      <NativeSelect aria-label="Язык" defaultValue="ru" onValueChange={onValueChange}>
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="kk">Қазақша</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await user.selectOptions(select, "en");
    expect(select.value).toBe("en");
    expect(select).toHaveAttribute("aria-busy", "true");
    expect(select).toHaveAttribute("data-loading", "true");
    expect(select).not.toBeDisabled();
    expect(container.querySelector("[role='status']")).not.toBeNull();

    await user.selectOptions(select, "kk");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(select.value).toBe("en");

    await act(async () => {
      save.resolve();
    });
    expect(select.value).toBe("en");
    expect(select).not.toHaveAttribute("aria-busy");
    expect(select).not.toHaveAttribute("data-loading");
    // The keyboard picks again once the save is answered.
    onValueChange.mockImplementation(() => undefined);
    select.focus();
    await user.selectOptions(select, "kk");
    expect(select.value).toBe("kk");
    expect(onValueChange).toHaveBeenLastCalledWith("kk");
  });

  it("uncontrolled: reject puts the previous option back", async () => {
    const save = deferred();
    render(
      <NativeSelect aria-label="Язык" onValueChange={() => save.promise}>
        <option value="ru">Русский</option>
        <option value="en">English</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "en" } });
    expect(select.value).toBe("en");
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(select.value).toBe("ru");
    expect(select).not.toHaveAttribute("aria-busy");
  });

  it("controlled: shown ahead of the owner; reject shows the owner's value again", async () => {
    const save = deferred();
    function Controlled() {
      const [value, setValue] = React.useState("ru");
      return (
        <NativeSelect
          aria-label="Язык"
          value={value}
          onValueChange={async (next) => {
            await save.promise;
            setValue(next);
          }}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </NativeSelect>
      );
    }
    render(<Controlled />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "en" } });
    expect(select.value).toBe("en");
    expect(select).toHaveAttribute("aria-busy", "true");
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(select.value).toBe("ru");
    expect(select).not.toHaveAttribute("aria-busy");
  });
});
