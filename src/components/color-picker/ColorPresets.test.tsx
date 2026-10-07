import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { primitiveTokens } from "../../../tokens/primitives";
import { COLOR_PRESETS, ColorPresets, type ColorPresetsRootProps } from "./ColorPresets";

function Picker(props: Omit<ColorPresetsRootProps, "children">) {
  return (
    <ColorPresets.Root {...props}>
      <ColorPresets.Trigger />
      <ColorPresets.Content />
    </ColorPresets.Root>
  );
}

const open = () => fireEvent.click(screen.getByRole("button"));

describe("ColorPresets", () => {
  it("default presets are the kit palette primitives at steps 500 / 700", () => {
    const c = primitiveTokens.color;
    const hues = [c.red, c.orange, c.yellow, c.green, c.teal, c.cobalt, c.purple, c.pink];
    expect(COLOR_PRESETS.map((p) => p.value)).toEqual([
      ...hues.map((h) => h[500]),
      ...hues.map((h) => h[700]),
    ]);
  });

  it("names the trigger by the current color and opens a listbox of 16 options", () => {
    render(<Picker defaultValue="#5068F5" />);
    const trigger = screen.getByRole("button", { name: "Цвет: Синий" });
    expect(trigger).toHaveAttribute("data-size", "m");
    open();
    const list = screen.getByRole("listbox", { name: "Цвета" });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(16);
    const selected = screen.getByRole("option", { name: "Синий" });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).toHaveFocus();
  });

  it("selects on click, closes and returns focus to the trigger", () => {
    const onValueChange = vi.fn();
    render(<Picker onValueChange={onValueChange} />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "Зелёный" }));
    expect(onValueChange).toHaveBeenCalledWith("#22c55e");
    expect(screen.queryByRole("listbox")).toBeNull();
    const trigger = screen.getByRole("button", { name: "Цвет: Зелёный" });
    expect(trigger).toHaveFocus();
  });

  it("keeps the panel open with closeOnSelect={false}", () => {
    render(<Picker closeOnSelect={false} />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "Красный" }));
    expect(screen.getByRole("option", { name: "Красный" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("moves through the grid with arrows, Home / End and selects with Enter", () => {
    const onValueChange = vi.fn();
    render(<Picker onValueChange={onValueChange} />);
    open();
    const list = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveFocus();
    expect(options[0]).toHaveAttribute("tabindex", "0");
    expect(options[1]).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(options[1]).toHaveFocus();
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(options[9]).toHaveFocus();
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(options[9]).toHaveFocus();
    fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(options[1]).toHaveFocus();
    fireEvent.keyDown(list, { key: "End" });
    expect(options[15]).toHaveFocus();
    fireEvent.keyDown(list, { key: "Home" });
    expect(options[0]).toHaveFocus();
    fireEvent.keyDown(list, { key: "ArrowLeft" });
    expect(options[0]).toHaveFocus();

    fireEvent.keyDown(list, { key: "ArrowRight" });
    fireEvent.keyDown(list, { key: " " });
    expect(onValueChange).toHaveBeenCalledWith("#f97316");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("Escape closes and returns focus to the trigger", () => {
    render(<Picker />);
    open();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("Tab leaves the panel through the trigger; ArrowDown on the trigger opens it", () => {
    render(<Picker />);
    const trigger = screen.getByRole("button");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Tab" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("allowEmpty adds the no-color option last and selects null", () => {
    const onValueChange = vi.fn();
    render(<Picker allowEmpty defaultValue="#ef4444" onValueChange={onValueChange} />);
    open();
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(17);
    expect(options[16]).toHaveAccessibleName("Без цвета");
    fireEvent.click(options[16]);
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole("button", { name: "Цвет: Без цвета" })).toHaveAttribute("data-empty");
  });

  it("takes custom presets, columns and a section label", () => {
    const presets = [
      { value: "#000000", label: "Чёрный" },
      { value: "#ffffff", label: "Белый" },
    ];
    render(
      <ColorPresets.Root presets={presets} defaultValue="#ffffff" columns={1}>
        <ColorPresets.Trigger />
        <ColorPresets.Content label="Цвет метки" />
      </ColorPresets.Root>,
    );
    open();
    const list = screen.getByRole("listbox", { name: "Цвет метки" });
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("option", { name: "Белый" })).toHaveAttribute("data-contrast", "dark");
    expect(screen.getByRole("option", { name: "Чёрный" })).toHaveAttribute(
      "data-contrast",
      "light",
    );
    fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(screen.getByRole("option", { name: "Чёрный" })).toHaveFocus();
  });

  it("takes labels and names an unknown value by itself", () => {
    render(<Picker defaultValue="#123456" labels={{ trigger: "Color", list: "Colors" }} />);
    const trigger = screen.getByRole("button", { name: "Color: #123456" });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox", { name: "Colors" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { selected: true })).toBeNull();
  });

  it("is controlled and disabled", () => {
    function Controlled() {
      const [value, setValue] = React.useState<string | null>("#ef4444");
      return <Picker value={value} onValueChange={setValue} />;
    }
    const { unmount } = render(<Controlled />);
    open();
    fireEvent.click(screen.getByRole("option", { name: "Розовый" }));
    expect(screen.getByRole("button", { name: "Цвет: Розовый" })).toBeInTheDocument();
    unmount();

    render(<Picker disabled />);
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("asChild turns a Button into the trigger", () => {
    render(
      <ColorPresets.Root defaultValue="#ef4444">
        <ColorPresets.Trigger asChild>
          <Button.Root variant="outline" tone="neutral">
            <ColorPresets.Swatch />
            Цвет
          </Button.Root>
        </ColorPresets.Trigger>
        <ColorPresets.Content />
      </ColorPresets.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Цвет: Красный" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("option", { name: "Жёлтый" }));
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName("Цвет: Жёлтый");
  });
});
