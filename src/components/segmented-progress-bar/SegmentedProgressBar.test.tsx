import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SegmentedProgressBar } from "./SegmentedProgressBar";

describe("SegmentedProgressBar", () => {
  it("renders group with accessible name from distribution", () => {
    render(
      <SegmentedProgressBar.Root
        segments={[
          { value: 30, label: "Errors", tone: "danger" },
          { value: 25, label: "Pending", tone: "warning" },
          { value: 45, label: "OK", tone: "success" },
        ]}
      />,
    );
    expect(
      screen.getByRole("group", { name: "Errors: 30%, Pending: 25%, OK: 45%" }),
    ).toBeInTheDocument();
  });

  it("sets data-size on root default m", () => {
    render(<SegmentedProgressBar.Root segments={[{ value: 1 }]} />);
    const root = screen.getByRole("group").parentElement;
    expect(root).toHaveAttribute("data-size", "m");
  });

  it("merges className on root", () => {
    render(<SegmentedProgressBar.Root segments={[{ value: 1 }]} className="custom-root" />);
    expect(screen.getByRole("group").parentElement).toHaveClass("custom-root");
  });

  it("clamps negative segment weights to zero", () => {
    render(<SegmentedProgressBar.Root segments={[{ value: -10 }, { value: 10 }]} />);
    expect(screen.getByRole("group", { name: "0%, 100%" })).toBeInTheDocument();
  });

  it("shows empty track when all weights are zero", () => {
    render(<SegmentedProgressBar.Root segments={[{ value: 0 }, { value: 0 }]} />);
    expect(screen.getByRole("group", { name: "All segments empty" })).toBeInTheDocument();
  });

  it("associates visible label with group via aria-labelledby and description", () => {
    render(
      <SegmentedProgressBar.Root
        label="Batch status"
        segments={[
          { value: 50, label: "A" },
          { value: 50, label: "B" },
        ]}
      />,
    );
    const group = screen.getByRole("group");
    const title = screen.getByText("Batch status");
    expect(group).toHaveAttribute("aria-labelledby", title.id);
    expect(group).toHaveAttribute("aria-describedby");
  });
});
