import { render, screen } from "@testing-library/react";

import { SegmentedProgressBar } from "./SegmentedProgressBar";

describe("SegmentedProgressBar", () => {
  it("renders a group with proportional segments", () => {
    render(
      <SegmentedProgressBar.Root
        segments={[
          { value: 30, label: "Errors", tone: "danger" },
          { value: 25, label: "Waiting", tone: "pending" },
          { value: 45, label: "OK", tone: "success" },
        ]}
      />,
    );
    const bar = screen.getByRole("img");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-label", "Errors 30%, Waiting 25%, OK 45%");
  });

  it("shows empty track when total is zero", () => {
    render(
      <SegmentedProgressBar.Root
        segments={[
          { value: 0, label: "A" },
          { value: 0, label: "B" },
        ]}
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "No data");
  });

  it("respects custom ariaLabel", () => {
    render(
      <SegmentedProgressBar.Root
        ariaLabel="Custom summary"
        segments={[{ value: 100, label: "All" }]}
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Custom summary");
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s on root", (size) => {
    render(<SegmentedProgressBar.Root size={size} segments={[{ value: 1, tone: "primary" }]} />);
    expect(screen.getByRole("img").parentElement).toHaveAttribute("data-size", size);
  });
});
