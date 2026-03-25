import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { I18nProvider } from "react-aria-components";
import { describe, expect, it } from "vitest";

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
});
