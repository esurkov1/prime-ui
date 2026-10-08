import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorSwatches } from "./ColorSwatches";

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
});
