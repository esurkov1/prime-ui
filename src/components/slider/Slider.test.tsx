import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
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

describe("Slider — commit", () => {
  it("commits once on release and on a key step, never for an unchanged value", () => {
    const onCommit = vi.fn();
    render(<Slider aria-label="Громкость" defaultValue={20} onCommit={onCommit} />);
    const input = screen.getByRole("slider", { name: "Громкость" });
    fireEvent.pointerDown(input);
    fireEvent.change(input, { target: { value: "35" } });
    fireEvent.change(input, { target: { value: "40" } });
    fireEvent.pointerUp(input);
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenLastCalledWith(40);
    fireEvent.pointerDown(input);
    fireEvent.pointerUp(input);
    expect(onCommit).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: "41" } });
    fireEvent.keyUp(input, { key: "ArrowRight" });
    expect(onCommit).toHaveBeenLastCalledWith(41);
  });

  it("async commit: busy until the answer; resolve keeps the value", async () => {
    let resolve: () => void = () => {};
    render(
      <Slider
        aria-label="Громкость"
        defaultValue={20}
        onCommit={() =>
          new Promise<void>((done) => {
            resolve = done;
          })
        }
      />,
    );
    const input = screen.getByRole("slider", { name: "Громкость" });
    fireEvent.pointerDown(input);
    fireEvent.change(input, { target: { value: "40" } });
    fireEvent.pointerUp(input);
    expect(input).toHaveAttribute("aria-busy", "true");
    await act(async () => {
      resolve();
    });
    expect(input).not.toHaveAttribute("aria-busy");
    expect(input).toHaveValue("40");
  });

  it("async commit: reject puts the last saved value back, to a controlled owner too", async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = React.useState(20);
      return (
        <Slider
          aria-label="Громкость"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
          onCommit={async () => {
            throw new Error("offline");
          }}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("slider", { name: "Громкость" });
    fireEvent.change(input, { target: { value: "45" } });
    await act(async () => {
      fireEvent.keyUp(input, { key: "ArrowRight" });
    });
    expect(input).toHaveValue("20");
    expect(onValueChange).toHaveBeenLastCalledWith(20);
    expect(input).not.toHaveAttribute("aria-busy");
  });

  it("stands upright with orientation vertical and still steps from the keyboard", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Slider
        aria-label="Громкость"
        orientation="vertical"
        defaultValue={50}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("slider", { name: "Громкость" });
    expect(input).toHaveAttribute("aria-orientation", "vertical");
    expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
    fireEvent.change(input, { target: { value: "60" } });
    expect(onValueChange).toHaveBeenLastCalledWith(60);
  });

  it("is horizontal by default, with no orientation attributes", () => {
    const { container } = render(<Slider aria-label="Уровень" />);
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-orientation");
    expect(container.firstElementChild).not.toHaveAttribute("data-orientation");
  });
});
