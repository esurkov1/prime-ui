import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { I18nProvider, Input } from "react-aria-components";
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

describe("ColorPicker focusRing", () => {
  it("focusRing={false} marks Field and keeps the invalid state", () => {
    const { container } = render(
      withLocale(
        <ColorPicker.Field focusRing={false} isInvalid aria-label="Цвет">
          <Input />
        </ColorPicker.Field>,
      ),
    );
    const field = container.querySelector("[data-focus-ring]");
    expect(field).toHaveAttribute("data-focus-ring", "false");
    expect(field).toHaveAttribute("data-invalid", "true");
  });

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
