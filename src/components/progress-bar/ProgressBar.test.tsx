import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders", () => {
    render(<ProgressBar value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets data-size on root default m", () => {
    render(<ProgressBar value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.parentElement).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<ProgressBar value={40} size="xl" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-size", "xl");
  });

  it("sets value and max attributes on native progress", () => {
    render(<ProgressBar value={30} max={200} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("value", "30");
    expect(el).toHaveAttribute("max", "200");
  });

  it("associates visible label with progressbar via aria-labelledby", () => {
    render(<ProgressBar value={10} label="Upload progress" />);
    const bar = screen.getByRole("progressbar");
    const labelEl = screen.getByText("Upload progress");
    expect(bar).toHaveAttribute("aria-labelledby", labelEl.id);
  });

  it.each([
    [0, "0"],
    [50, "50"],
    [100, "100"],
  ] as const)("value %s maps to progress value %s", (value, expected) => {
    render(<ProgressBar value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", expected);
  });

  it("defaults data-tone to accent and reflects tone", () => {
    const { rerender } = render(<ProgressBar value={40} />);
    const root = () => screen.getByRole("progressbar").parentElement;
    expect(root()).toHaveAttribute("data-tone", "accent");
    rerender(<ProgressBar value={40} tone="danger" />);
    expect(root()).toHaveAttribute("data-tone", "danger");
  });

  it("draws the fill from the clamped value ratio, hidden from assistive tech", () => {
    const { container, rerender } = render(<ProgressBar value={30} max={200} />);
    const fill = () => container.querySelector<HTMLElement>("span[aria-hidden='true'][style]");
    expect(fill()?.style.getPropertyValue("--pb-ratio")).toBe("0.15");
    rerender(<ProgressBar value={500} max={200} />);
    expect(fill()?.style.getPropertyValue("--pb-ratio")).toBe("1");
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });

  it("merges className on root", () => {
    render(<ProgressBar value={5} className="custom-bar" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveClass("custom-bar");
  });

  it("reflects tone in value mode", () => {
    const { container } = render(<ProgressBar value={10} tone="info" />);
    expect(container.firstChild).toHaveAttribute("data-tone", "info");
  });

  it("forwards ref and native attributes to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<ProgressBar ref={ref} value={10} data-testid="bar" />);
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveAttribute("data-testid", "bar");
  });

  it("names an unlabelled bar with aria-label", () => {
    render(<ProgressBar value={10} aria-label="Импорт" />);
    expect(screen.getByRole("progressbar", { name: "Импорт" })).toBeInTheDocument();
  });

  describe("segments", () => {
    const tasks = [
      { value: 30, label: "Errors", tone: "danger" as const },
      { value: 25, label: "Pending", tone: "warning" as const },
      { value: 45, label: "OK", tone: "success" as const },
    ];

    it("renders a group named by the distribution", () => {
      render(<ProgressBar segments={tasks} />);
      expect(
        screen.getByRole("group", { name: "Errors: 30%, Pending: 25%, OK: 45%" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("measures shares against max and leaves the rest as track", () => {
      const { container } = render(
        <ProgressBar segments={[{ value: 20, label: "A" }]} max={80} showValue />,
      );
      expect(screen.getByRole("group", { name: "A: 25%" })).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      const rest = container.querySelector<HTMLElement>("[role='group'] > span:last-child");
      expect(rest?.style.flexGrow).toBe("60");
    });

    it("clamps negative weights to zero", () => {
      render(<ProgressBar segments={[{ value: -10 }, { value: 10 }]} />);
      expect(screen.getByRole("group", { name: "0%, 100%" })).toBeInTheDocument();
    });

    it("describes empty distributions with labels", () => {
      const { rerender } = render(<ProgressBar segments={[{ value: 0 }]} />);
      expect(screen.getByRole("group", { name: "Все сегменты пусты" })).toBeInTheDocument();
      rerender(<ProgressBar segments={[]} labels={{ empty: "No data" }} />);
      expect(screen.getByRole("group", { name: "No data" })).toBeInTheDocument();
    });

    it("defaults segment tone to accent and sets the gap mode", () => {
      const { container } = render(<ProgressBar segments={[{ value: 1 }]} segmentGap="hairline" />);
      expect(container.querySelector("[data-tone]")).toHaveAttribute("data-tone", "accent");
      expect(screen.getByRole("group")).toHaveAttribute("data-segment-gap", "hairline");
    });

    it("labels the group with the visible label and describes it with the distribution", () => {
      render(
        <ProgressBar
          label="Batch status"
          segments={[
            { value: 50, label: "A" },
            { value: 50, label: "B" },
          ]}
        />,
      );
      const group = screen.getByRole("group", { name: "Batch status" });
      expect(group).toHaveAccessibleDescription("A: 50%, B: 50%");
    });
  });
});
