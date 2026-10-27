import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { COLOR_SWATCHES_LABELS, ColorSwatches } from "./ColorSwatches";

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

  it("palette mode picks a kit hue by name and draws it from the palette", () => {
    const onValueChange = vi.fn();
    render(
      <ColorSwatches
        mode="palette"
        label="Цвет этапа"
        palette={["blue", "green"]}
        defaultValue="blue"
        onValueChange={onValueChange}
      />,
    );
    const blue = screen.getByRole("radio", { name: "Синий" });
    expect(blue).toHaveAttribute("aria-checked", "true");
    expect(blue).toHaveAttribute("data-color", "blue");
    expect(blue).toHaveAttribute("data-contrast", "hue");
    fireEvent.keyDown(blue, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith("green");
    expect(screen.getByRole("radio", { name: "Зелёный" })).toHaveFocus();
  });

  it("palette mode takes hue names from labels.colorNames", () => {
    render(
      <ColorSwatches
        mode="palette"
        palette={["blue", "red"]}
        labels={{ colorNames: { ...COLOR_SWATCHES_LABELS.colorNames, blue: "Лазурь" } }}
      />,
    );
    expect(screen.getByRole("radio", { name: "Лазурь" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Красный" })).toBeInTheDocument();
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

  it("keyboard: Tab enters on the selected swatch; the arrows move by visual rows and select", async () => {
    const user = userEvent.setup();
    const six = [
      ...presets,
      { value: "#f59e0b", label: "Янтарный" },
      { value: "#14b8a6", label: "Бирюзовый" },
      { value: "#a855f7", label: "Фиолетовый" },
    ];
    render(<ColorSwatches presets={six} defaultValue="#22c55e" aria-label="Цвет этапа" />);
    const radios = screen.getAllByRole("radio");
    // Two visual rows of three: the grid wraps to its width.
    radios.forEach((radio, index) => {
      Object.defineProperty(radio, "offsetTop", { configurable: true, value: index < 3 ? 0 : 40 });
    });
    const swatch = (name: string) => screen.getByRole("radio", { name });

    await user.tab();
    expect(swatch("Зелёный")).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(swatch("Красный")).toHaveFocus();
    expect(swatch("Красный")).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowDown}");
    expect(swatch("Янтарный")).toHaveFocus();
    expect(swatch("Янтарный")).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowUp}");
    expect(swatch("Красный")).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowRight}");
    expect(swatch("Зелёный")).toHaveAttribute("aria-checked", "true");
    // One tab stop: Tab leaves the group.
    await user.tab();
    expect(document.body).toHaveFocus();
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

describe("ColorSwatches — async onValueChange", () => {
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

  it("shows the pick busy, not disabled; picks and arrows wait; resolve keeps it", async () => {
    const user = userEvent.setup();
    const save = deferred();
    const onValueChange = vi.fn((): void | Promise<void> => save.promise);
    render(
      <ColorSwatches
        presets={presets}
        defaultValue="#ef4444"
        aria-label="Цвет этапа"
        onValueChange={onValueChange}
      />,
    );
    const group = screen.getByRole("radiogroup");
    const green = screen.getByRole("radio", { name: "Зелёный" });
    await user.click(green);
    expect(green).toHaveAttribute("aria-checked", "true");
    expect(group).toHaveAttribute("aria-busy", "true");
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toBeDisabled();
      expect(radio).toHaveAttribute("data-loading", "true");
    }
    await user.click(screen.getByRole("radio", { name: "Синий" }));
    green.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(green).toHaveAttribute("aria-checked", "true");
    expect(green).toHaveFocus();

    await act(async () => {
      save.resolve();
    });
    expect(green).toHaveAttribute("aria-checked", "true");
    expect(group).not.toHaveAttribute("aria-busy");
    expect(green).not.toHaveAttribute("data-loading");
    // The arrows select again once the save is answered.
    onValueChange.mockImplementation(() => undefined);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Синий" })).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith("#5068f5");
  });

  it("reject puts the previous color back", async () => {
    const save = deferred();
    render(
      <ColorSwatches presets={presets} defaultValue="#ef4444" onValueChange={() => save.promise} />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Синий" }));
    expect(screen.getByRole("radio", { name: "Синий" })).toHaveAttribute("aria-checked", "true");
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(screen.getByRole("radio", { name: "Красный" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-busy");
  });

  it("controlled: shown ahead of the owner, then the owner's value wins", async () => {
    const save = deferred();
    function Controlled() {
      const [color, setColor] = React.useState<string | null>("#ef4444");
      return (
        <ColorSwatches
          presets={presets}
          value={color}
          onValueChange={async (next) => {
            await save.promise;
            setColor(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const blue = screen.getByRole("radio", { name: "Синий" });
    fireEvent.click(blue);
    expect(blue).toHaveAttribute("aria-checked", "true");
    await act(async () => {
      save.resolve();
    });
    expect(blue).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-busy");
  });
});
