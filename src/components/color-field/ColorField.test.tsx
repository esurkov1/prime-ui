import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { I18nProvider } from "react-aria-components";
import { describe, expect, it, vi } from "vitest";

import { ColorField } from "./ColorField";

function withLocale(node: React.ReactNode) {
  return <I18nProvider locale="ru-RU">{node}</I18nProvider>;
}

/** Types a hex into the panel's hex cell and commits it with Enter. */
function typeHex(text: string) {
  const hex = screen.getByRole("textbox", { name: "Hex" });
  fireEvent.change(hex, { target: { value: text } });
  fireEvent.keyDown(hex, { key: "Enter" });
}

describe("ColorField", () => {
  it("names the field button by the label and the current hex", () => {
    render(withLocale(<ColorField label="Цвет бренда" defaultValue="#5b5bd6" />));
    const button = screen.getByRole("button", { name: "Цвет бренда #5B5BD6" });
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the picker panel from the keyboard and Escape returns focus to the field", async () => {
    const user = userEvent.setup();
    render(withLocale(<ColorField label="Цвет" defaultValue="#336699" />));
    const button = screen.getByRole("button", { name: /Цвет/ });
    button.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("slider", { name: "Оттенок, градусы" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("emits the new color as hex and shows it in the field", () => {
    const onValueChange = vi.fn();
    render(
      withLocale(<ColorField label="Цвет" defaultValue="#336699" onValueChange={onValueChange} />),
    );
    fireEvent.click(screen.getByRole("button", { name: /Цвет/ }));
    typeHex("#ff0000");
    expect(onValueChange).toHaveBeenLastCalledWith("#FF0000");
    expect(screen.getByRole("button", { name: "Цвет #FF0000" })).toBeInTheDocument();
  });

  it("follows a controlled value and keeps it when the parent does not take the change", () => {
    function Controlled() {
      const [color, setColor] = React.useState("#336699");
      return (
        <>
          <ColorField label="Цвет" value={color} />
          <button type="button" onClick={() => setColor("#00ff00")}>
            Зелёный
          </button>
        </>
      );
    }
    render(withLocale(<Controlled />));
    fireEvent.click(screen.getByRole("button", { name: "Зелёный" }));
    expect(screen.getByRole("button", { name: "Цвет #00FF00" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Цвет #/ }));
    typeHex("#ff0000");
    expect(screen.getByRole("button", { name: "Цвет #00FF00" })).toBeInTheDocument();
  });

  it("adds the opacity slider with alpha and emits #RRGGBBAA", () => {
    const onValueChange = vi.fn();
    render(withLocale(<ColorField label="Цвет" alpha onValueChange={onValueChange} />));
    fireEvent.click(screen.getByRole("button", { name: /Цвет/ }));
    expect(screen.getByRole("slider", { name: "Непрозрачность, проценты" })).toBeInTheDocument();
    typeHex("#ff000080");
    expect(onValueChange).toHaveBeenLastCalledWith("#FF000080");
  });

  it("picks a preset in one click", () => {
    const onValueChange = vi.fn();
    render(
      withLocale(
        <ColorField
          label="Цвет"
          presets={[{ value: "#12a594", label: "Бирюзовый" }]}
          onValueChange={onValueChange}
        />,
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: /Цвет/ }));
    expect(screen.getByRole("radiogroup", { name: "Готовые цвета" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Бирюзовый" }));
    expect(onValueChange).toHaveBeenLastCalledWith("#12A594");
  });

  it("submits the hex through a hidden input", () => {
    const { container } = render(withLocale(<ColorField label="Цвет" name="brand" />));
    expect(container.querySelector('input[type="hidden"][name="brand"]')).toHaveValue("#000000");
  });

  it("takes hint and error like other fields", () => {
    render(withLocale(<ColorField label="Цвет" hint="Для кнопок" error="Слишком светлый" />));
    const button = screen.getByRole("button", { name: /Цвет/ });
    expect(button).toHaveAttribute("aria-invalid", "true");
    expect(button).toHaveAccessibleDescription("Слишком светлый");
  });

  it("disabled does not open", () => {
    render(withLocale(<ColorField label="Цвет" disabled />));
    const button = screen.getByRole("button", { name: /Цвет/ });
    expect(button).toBeDisabled();
    act(() => fireEvent.click(button));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends ref and className to the frame, id to the button", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(withLocale(<ColorField ref={ref} id="brand" className="custom" label="Цвет" />));
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.querySelector("button")).toHaveAttribute("id", "brand");
  });
});
