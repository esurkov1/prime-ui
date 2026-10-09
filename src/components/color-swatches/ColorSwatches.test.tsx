import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { balancedColumns, ColorSwatches } from "./ColorSwatches";

const presets = [
  { value: "#ef4444", label: "Красный" },
  { value: "#22c55e", label: "Зелёный" },
  { value: "#5068f5", label: "Синий" },
];

describe("ColorSwatches", () => {
  it("renders a radiogroup with one radio per preset and checks the value", () => {
    render(<ColorSwatches presets={presets} defaultValue="#22C55E" aria-label="Цвет этапа" />);
    expect(screen.getByRole("radiogroup", { name: "Цвет этапа" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Зелёный" })).toHaveAttribute("aria-checked", "true");
  });

  it("selects on click and calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(<ColorSwatches presets={presets} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Синий" }));
    expect(onValueChange).toHaveBeenCalledWith("#5068f5");
    expect(screen.getByRole("radio", { name: "Синий" })).toHaveAttribute("aria-checked", "true");
  });

  it("moves and selects with arrow keys, Home and End (roving tabindex)", () => {
    render(<ColorSwatches presets={presets} defaultValue="#ef4444" />);
    const red = screen.getByRole("radio", { name: "Красный" });
    expect(red).toHaveAttribute("tabindex", "0");
    red.focus();
    fireEvent.keyDown(red, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Зелёный" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Зелёный" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "End" });
    expect(screen.getByRole("radio", { name: "Синий" })).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(document.activeElement as Element, { key: "Home" });
    expect(red).toHaveAttribute("aria-checked", "true");
  });

  it("adds a no-color swatch with allowEmpty and submits through a hidden input", () => {
    const { container } = render(
      <ColorSwatches presets={presets} defaultValue="#ef4444" allowEmpty name="color" />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Без цвета" }));
    const input = container.querySelector('input[type="hidden"][name="color"]');
    expect(input).toHaveValue("");
  });

  it("takes label, hint and error like other fields", () => {
    render(<ColorSwatches presets={presets} label="Цвет" required error="Выберите цвет" />);
    const group = screen.getByRole("radiogroup", { name: "Цвет" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("aria-required", "true");
    expect(group).toHaveAccessibleDescription("Выберите цвет");
  });

  it("shows the check from the selected state, so it animates in and out", () => {
    render(<ColorSwatches presets={presets} defaultValue="#5068f5" />);
    const blue = screen.getByRole("radio", { name: "Синий" });
    const red = screen.getByRole("radio", { name: "Красный" });
    // Color layer + check on every swatch; CSS shows the check only under data-state="checked".
    expect(blue.querySelectorAll("svg")).toHaveLength(2);
    expect(red.querySelectorAll("svg")).toHaveLength(2);
    expect(blue).toHaveAttribute("data-state", "checked");
    expect(red).toHaveAttribute("data-state", "unchecked");
    fireEvent.click(red);
    expect(red).toHaveAttribute("data-state", "checked");
    expect(blue).toHaveAttribute("data-state", "unchecked");
  });

  it("disables every swatch", () => {
    render(<ColorSwatches presets={presets} disabled />);
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
  });

  it("size sets the swatches only: the label follows the host tier, else m", () => {
    const { container } = render(<ColorSwatches presets={presets} label="Цвет" size="xl" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-size", "xl");
    expect(container.firstElementChild).toHaveAttribute("data-size", "m");
  });
});

describe("balancedColumns", () => {
  it("keeps one row while every swatch fits", () => {
    expect(balancedColumns(16, 1000, 28, 8)).toBe(16);
  });

  it("splits a wrap evenly over the rows", () => {
    // 14 fit in 520: two rows of 8, not 14 + 2.
    expect(balancedColumns(16, 520, 28, 8)).toBe(8);
    // 9 fit: still two rows of 8; 5 fit: four rows of 4.
    expect(balancedColumns(16, 320, 28, 8)).toBe(8);
    expect(balancedColumns(16, 176, 28, 8)).toBe(4);
    // 17 swatches, 8 fit: three rows of 6 · 6 · 5.
    expect(balancedColumns(17, 284, 28, 8)).toBe(6);
  });

  it("falls back to one row before a measure", () => {
    expect(balancedColumns(5, 0, 28, 8)).toBe(5);
  });
});
