import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders", () => {
    render(<Slider.Root aria-label="Level" />);
    expect(screen.getByRole("slider", { name: "Level" })).toBeInTheDocument();
  });

  it("calls onChange on input event", () => {
    const onChange = vi.fn();
    render(
      <Slider.Root defaultValue={10} min={0} max={100} onChange={onChange} aria-label="Volume" />,
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.input(slider, { target: { value: "50" } });

    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("respects min, max, and step", () => {
    render(<Slider.Root defaultValue={5} min={10} max={20} step={5} aria-label="Stepped" />);

    const slider = screen.getByRole("slider", { name: "Stepped" }) as HTMLInputElement;
    expect(slider.min).toBe("10");
    expect(slider.max).toBe("20");
    expect(slider.step).toBe("5");
    expect(slider.value).toBe("10");
  });

  it("uses defaultValue in uncontrolled mode", () => {
    render(<Slider.Root defaultValue={33} aria-label="Default" />);

    const slider = screen.getByRole("slider", { name: "Default" }) as HTMLInputElement;
    expect(slider.value).toBe("33");
  });

  it("disables the track", () => {
    render(<Slider.Root disabled aria-label="Off" />);

    expect(screen.getByRole("slider", { name: "Off" })).toBeDisabled();
  });

  it("associates visible label with the slider", () => {
    render(<Slider.Root label="Brightness" />);

    expect(screen.getByLabelText("Brightness")).toBeInTheDocument();
    expect(screen.getByText("Brightness")).toBeInTheDocument();
  });

  it("supports aria-label without visible label", () => {
    render(<Slider.Root aria-label="Gain" />);

    expect(screen.getByRole("slider", { name: "Gain" })).toBeInTheDocument();
  });

  it("sets data-size on root (default m)", () => {
    const { container } = render(<Slider.Root aria-label="Default size" />);
    expect(container.firstChild).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    const { container } = render(<Slider.Root size="xl" aria-label="XL" />);
    expect(container.firstChild).toHaveAttribute("data-size", "xl");
  });
});
