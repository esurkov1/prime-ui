import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders", () => {
    render(<ProgressBar.Root value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets data-size on root default m", () => {
    render(<ProgressBar.Root value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.parentElement).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<ProgressBar.Root value={40} size="xl" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-size", "xl");
  });

  it("sets value and max attributes on native progress", () => {
    render(<ProgressBar.Root value={30} max={200} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("value", "30");
    expect(el).toHaveAttribute("max", "200");
  });

  it("associates visible label with progressbar via aria-labelledby", () => {
    render(<ProgressBar.Root value={10} label="Upload progress" />);
    const bar = screen.getByRole("progressbar");
    const labelEl = screen.getByText("Upload progress");
    expect(bar).toHaveAttribute("aria-labelledby", labelEl.id);
  });

  it.each([
    [0, "0"],
    [50, "50"],
    [100, "100"],
  ] as const)("value %s maps to progress value %s", (value, expected) => {
    render(<ProgressBar.Root value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", expected);
  });

  it("merges className on root", () => {
    render(<ProgressBar.Root value={5} className="custom-bar" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveClass("custom-bar");
  });
});
