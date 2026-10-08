import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { I18nProvider } from "react-aria-components";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";

function withLocale(node: React.ReactNode) {
  return <I18nProvider locale="ru-RU">{node}</I18nProvider>;
}

describe("ColorPicker", () => {
  it("рендерит область и слайдер с доступным именем", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#336699">
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.Thumb />
          </ColorPicker.Area>
          <ColorPicker.Slider aria-label="Оттенок" channel="hue" colorSpace="hsl">
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
        </ColorPicker.Root>,
      ),
    );

    expect(screen.getByRole("slider", { name: "Оттенок" })).toBeInTheDocument();
    expect(screen.getAllByRole("slider", { name: "Палитра цветов" }).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("TriggerSwatch рендерит слой цвета без inline style", () => {
    const { container } = render(
      withLocale(
        <ColorPicker.Root defaultValue="hsl(280, 70%, 55%)">
          <ColorPicker.TriggerSwatch />
        </ColorPicker.Root>,
      ),
    );
    const el = container.querySelector('span[aria-hidden="true"]');
    expect(el).toBeTruthy();
    expect(el).not.toHaveAttribute("style");
    expect(el?.querySelector("svg")).toBeTruthy();
    expect(el?.querySelector("rect")).toBeTruthy();
    expect(el?.querySelector("rect")).toHaveAttribute("fill");
  });

  it("ChannelStrip рендерит каналы формата из defaultFormat с именами из labels", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#ff0000" defaultFormat="rgb" labels={{ red: "R" }}>
          <ColorPicker.ChannelStrip />
        </ColorPicker.Root>,
      ),
    );

    expect(screen.getByRole("textbox", { name: "R" })).toHaveValue("255");
    expect(screen.getByRole("textbox", { name: "Зелёный, 0–255" })).toHaveValue("0");
  });

  it("HexInput вызывает onValueChange с новым цветом", () => {
    const onValueChange = vi.fn();
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#000000" onValueChange={onValueChange}>
          <ColorPicker.HexInput />
        </ColorPicker.Root>,
      ),
    );

    const input = screen.getByRole("textbox", { name: "Hex" });
    fireEvent.change(input, { target: { value: "#336699" } });
    fireEvent.blur(input);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].toString("hex")).toBe("#336699");
  });

  it("HexInput откатывает некорректное значение", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#112233">
          <ColorPicker.HexInput label="Цвет" />
        </ColorPicker.Root>,
      ),
    );

    const input = screen.getByRole("textbox", { name: "Цвет" });
    fireEvent.change(input, { target: { value: "nope" } });
    fireEvent.blur(input);

    expect(input).toHaveValue("#112233");
  });
});

describe("ColorPicker.Swatches", () => {
  const presets = [
    { value: "#e5484d", label: "Красный" },
    { value: "#0090ff", label: "Синий" },
  ];

  it("follows the picker color and sets it on pick", () => {
    const onValueChange = vi.fn();
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#0090ff" onValueChange={onValueChange}>
          <ColorPicker.Swatches presets={presets} aria-label="Цвета бренда" />
        </ColorPicker.Root>,
      ),
    );
    expect(screen.getByRole("radio", { name: "Синий" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Красный" }));
    expect(onValueChange.mock.calls[0][0].toString("hex")).toBe("#E5484D");
    expect(screen.getByRole("radio", { name: "Красный" })).toHaveAttribute("aria-checked", "true");
  });
});

describe("ColorPicker.HexInput field contract", () => {
  it("shows the error in place of the hint and marks the field invalid", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#112233">
          <ColorPicker.HexInput hint="Формат #RRGGBB" error="Цвет недостаточно контрастный" />
        </ColorPicker.Root>,
      ),
    );
    const input = screen.getByRole("textbox", { name: "Hex" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Цвет недостаточно контрастный");
  });
});

describe("ColorPicker drafts and parts", () => {
  it("a channel cell commits on Enter, clamps to the range and reverts unreadable text", () => {
    const onValueChange = vi.fn();
    render(
      withLocale(
        <ColorPicker.Root defaultValue="hsl(200, 50%, 40%)" onValueChange={onValueChange}>
          <ColorPicker.ChannelStrip />
        </ColorPicker.Root>,
      ),
    );
    const hue = screen.getByRole("textbox", { name: "Оттенок, градусы" }) as HTMLInputElement;
    fireEvent.change(hue, { target: { value: "500" } });
    fireEvent.keyDown(hue, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalled();
    expect(hue.value).toBe("360");

    fireEvent.change(hue, { target: { value: "abc" } });
    fireEvent.blur(hue);
    expect(hue.value).toBe("360");
  });

  it("the eyedropper without browser support is disabled and hidden from assistive tech", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#336699">
          <ColorPicker.EyeDropperButton data-testid="dropper" />
        </ColorPicker.Root>,
      ),
    );
    const dropper = screen.getByTestId("dropper");
    expect(dropper).toBeDisabled();
    expect(dropper).toHaveAttribute("aria-hidden", "true");
  });

  it("parts outside ColorPicker.Root fail loudly", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ColorPicker.TriggerSwatch />)).toThrow(/ColorPicker.Root/);
    spy.mockRestore();
  });
});

describe("ColorPicker focusRing", () => {
  it("focusRing={false} reaches HexInput and ChannelStrip", () => {
    render(
      withLocale(
        <ColorPicker.Root defaultValue="#336699" defaultFormat="hex">
          <ColorPicker.HexInput focusRing={false} />
          <ColorPicker.ChannelStrip focusRing={false} />
        </ColorPicker.Root>,
      ),
    );
    const [hexField, stripField] = screen.getAllByRole("textbox", { name: "Hex" });
    expect(hexField.parentElement).toHaveAttribute("data-focus-ring", "false");
    expect(stripField.closest("[data-focus-ring]")).toHaveAttribute("data-focus-ring", "false");
  });
});
