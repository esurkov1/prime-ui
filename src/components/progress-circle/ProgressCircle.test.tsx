import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProgressCircleSize } from "./ProgressCircle";
import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
  it("renders", () => {
    render(<ProgressCircle.Root value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(<ProgressCircle.Root value={25} max={80} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("aria-valuenow", "25");
    expect(el).toHaveAttribute("aria-valuemin", "0");
    expect(el).toHaveAttribute("aria-valuemax", "80");
  });

  it("sets aria-label when label is passed", () => {
    render(<ProgressCircle.Root value={10} label="Task completion" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Task completion");
  });

  it.each([0, 50, 100] as const)("value %s is reflected in aria-valuenow", (value) => {
    render(<ProgressCircle.Root value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(value));
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s", (size: ProgressCircleSize) => {
    render(<ProgressCircle.Root value={50} size={size} />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-size", size);
  });

  it("renders children text inside", () => {
    render(<ProgressCircle.Root value={75}>75%</ProgressCircle.Root>);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(<ProgressCircle.Root value={5} className="custom-circle" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveClass("custom-circle");
  });
});
