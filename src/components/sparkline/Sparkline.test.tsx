import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sparkline, type SparklinePoint } from "./Sparkline";

const DATA: SparklinePoint[] = [
  { label: "6 окт", value: 300 },
  { label: "7 окт", value: 330 },
  { label: "8 окт", value: 297 },
];

const plot = () => screen.getByRole("slider", { name: "Выручка" });

describe("Sparkline", () => {
  it("heads with the latest point, its date and its change", () => {
    render(<Sparkline data={DATA} label="Выручка" formatValue={(v) => `${v} ₽`} />);
    expect(screen.getByText("8 окт")).toBeInTheDocument();
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297 ₽");
    expect(screen.getByText("−10%")).toBeInTheDocument();
  });

  it("walks the points with the arrow keys, Home and End, and returns on blur", () => {
    render(<Sparkline data={DATA} label="Выручка" />);
    plot().focus();
    fireEvent.keyDown(plot(), { key: "ArrowLeft" });
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByText("7 окт")).toBeInTheDocument();
    expect(screen.getByText("+10%")).toBeInTheDocument();
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(plot()).toHaveAttribute("aria-valuenow", "0");
    fireEvent.keyDown(plot(), { key: "ArrowLeft" });
    expect(plot()).toHaveAttribute("aria-valuenow", "0");
    fireEvent.keyDown(plot(), { key: "End" });
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    fireEvent.keyDown(plot(), { key: "Home" });
    fireEvent.blur(plot());
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
  });

  it("follows the pointer and settles back when it leaves", () => {
    const { container } = render(<Sparkline data={DATA} label="Выручка" />);
    const area = plot();
    area.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 80 }) as DOMRect;
    fireEvent.pointerMove(area, { clientX: 10 });
    expect(area).toHaveAttribute("aria-valuenow", "0");
    expect(container.firstElementChild).toHaveAttribute("data-scrubbing", "true");
    fireEvent.pointerLeave(area);
    expect(area).toHaveAttribute("aria-valuenow", "2");
    expect(container.firstElementChild).not.toHaveAttribute("data-scrubbing");
  });

  it("speaks a point through labels", () => {
    render(<Sparkline data={DATA} label="Выручка" labels={{ point: "{value} на {label}" }} />);
    expect(plot()).toHaveAttribute("aria-valuetext", "297 на 8 окт");
  });
});
