import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders", () => {
    render(<Slider aria-label="Level" />);
    expect(screen.getByRole("slider", { name: "Level" })).toBeInTheDocument();
  });

  it("calls onValueChange on input event", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        defaultValue={10}
        min={0}
        max={100}
        onValueChange={onValueChange}
        aria-label="Volume"
      />,
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.input(slider, { target: { value: "50" } });

    expect(onValueChange).toHaveBeenCalledWith(50);
  });

  it("respects min, max, and step", () => {
    render(<Slider defaultValue={5} min={10} max={20} step={5} aria-label="Stepped" />);

    const slider = screen.getByRole("slider", { name: "Stepped" }) as HTMLInputElement;
    expect(slider.min).toBe("10");
    expect(slider.max).toBe("20");
    expect(slider.step).toBe("5");
    expect(slider.value).toBe("10");
  });

  it("uses defaultValue in uncontrolled mode", () => {
    render(<Slider defaultValue={33} aria-label="Default" />);

    const slider = screen.getByRole("slider", { name: "Default" }) as HTMLInputElement;
    expect(slider.value).toBe("33");
  });

  it("clamps a controlled value and shows the formatted value", () => {
    render(
      <Slider
        value={150}
        label="Temp"
        showValue
        formatValue={(v) => `${v} °C`}
        onValueChange={() => {}}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Temp" }) as HTMLInputElement;
    expect(slider.value).toBe("100");
    expect(slider).toHaveAttribute("aria-valuetext", "100 °C");
    expect(screen.getByText("100 °C")).toBeInTheDocument();
  });

  it("disables the track", () => {
    render(<Slider disabled aria-label="Off" />);

    expect(screen.getByRole("slider", { name: "Off" })).toBeDisabled();
  });

  it("associates visible label with the slider", () => {
    render(<Slider label="Brightness" />);

    expect(screen.getByLabelText("Brightness")).toBeInTheDocument();
    expect(screen.getByText("Brightness")).toBeInTheDocument();
  });

  it("supports aria-label without visible label", () => {
    render(<Slider aria-label="Gain" />);

    expect(screen.getByRole("slider", { name: "Gain" })).toBeInTheDocument();
  });

  it("sets data-size on root (default m)", () => {
    const { container } = render(<Slider aria-label="Default size" />);
    expect(container.firstChild).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    const { container } = render(<Slider size="xl" aria-label="XL" />);
    expect(container.firstChild).toHaveAttribute("data-size", "xl");
  });

  it("sets data-tone (default accent)", () => {
    const { container, rerender } = render(<Slider aria-label="Tone" />);
    expect(container.firstChild).toHaveAttribute("data-tone", "accent");

    rerender(<Slider aria-label="Tone" tone="danger" />);
    expect(container.firstChild).toHaveAttribute("data-tone", "danger");
  });

  it("is focusable for keyboard control", () => {
    render(<Slider defaultValue={10} aria-label="Keys" />);

    const slider = screen.getByRole("slider", { name: "Keys" });
    slider.focus();
    expect(slider).toHaveFocus();
  });

  it("is framed like every field: required marker, hint, error replacing it, value in the label row", () => {
    const { rerender } = render(
      <Slider label="Громкость" required hint="От 0 до 100" showValue defaultValue={40} />,
    );
    const slider = screen.getByRole("slider", { name: "Громкость" });
    expect(slider).toHaveAccessibleDescription("От 0 до 100");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    const value = screen.getByText("40");
    expect(value.tagName).toBe("OUTPUT");
    expect(value.closest("label")).toBeNull();

    rerender(
      <Slider label="Громкость" required hint="От 0 до 100" error="Слишком громко" showValue />,
    );
    expect(slider).toHaveAccessibleDescription("Слишком громко");
    expect(slider).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("От 0 до 100")).toBeNull();
  });

  it("puts id on the range input and className / rest on the frame", () => {
    const { container } = render(
      <Slider id="vol" className="custom" data-testid="frame" aria-label="Vol" />,
    );
    expect(screen.getByRole("slider", { name: "Vol" })).toHaveAttribute("id", "vol");
    expect(screen.getByTestId("frame")).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("custom");
  });
});
