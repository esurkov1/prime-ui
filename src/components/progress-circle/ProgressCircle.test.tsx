import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import type { ControlSize } from "@/internal/states";

import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
  it("renders", () => {
    render(<ProgressCircle value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(<ProgressCircle value={25} max={80} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("aria-valuenow", "25");
    expect(el).toHaveAttribute("aria-valuemin", "0");
    expect(el).toHaveAttribute("aria-valuemax", "80");
  });

  it("puts aria-label on the progressbar, not the root", () => {
    const { container } = render(<ProgressCircle value={10} aria-label="Task completion" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Task completion");
    expect(container.firstChild).not.toHaveAttribute("aria-label");
  });

  it("forwards ref and native attributes to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<ProgressCircle ref={ref} value={10} data-testid="ring" />);
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveAttribute("data-testid", "ring");
  });

  it.each([0, 50, 100] as const)("value %s is reflected in aria-valuenow", (value) => {
    render(<ProgressCircle value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(value));
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s", (size: ControlSize) => {
    render(<ProgressCircle value={50} size={size} />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-size", size);
  });

  it("defaults data-tone to accent and reflects tone", () => {
    const { rerender } = render(<ProgressCircle value={50} />);
    const root = () => screen.getByRole("progressbar").parentElement;
    expect(root()).toHaveAttribute("data-tone", "accent");
    rerender(<ProgressCircle value={50} tone="danger" />);
    expect(root()).toHaveAttribute("data-tone", "danger");
  });

  it("renders children text inside", () => {
    render(<ProgressCircle value={75}>75%</ProgressCircle>);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it.each([
    "xs",
    "s",
  ] as const)("does not render inner text at size %s, keeps aria-valuetext", (size) => {
    render(
      <ProgressCircle value={75} size={size}>
        75%
      </ProgressCircle>,
    );
    expect(screen.queryByText("75%")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "75%");
  });

  it("merges className on root", () => {
    render(<ProgressCircle value={5} className="custom-circle" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveClass("custom-circle");
  });

  it("supports every tone in value mode", () => {
    render(<ProgressCircle value={50} tone="info" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-tone", "info");
  });

  describe("segments", () => {
    const tasks = [
      { value: 30, label: "Errors", tone: "danger" as const },
      { value: 70, label: "OK", tone: "success" as const },
    ];

    it("renders a group named by the distribution instead of a progressbar", () => {
      render(<ProgressCircle segments={tasks} />);
      expect(screen.getByRole("group", { name: "Errors: 30%, OK: 70%" })).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("names the group by label and describes it by the distribution of max", () => {
      render(<ProgressCircle segments={tasks} max={200} aria-label="Batch" />);
      const group = screen.getByRole("group", { name: "Batch" });
      expect(group).toHaveAccessibleDescription("Errors: 15%, OK: 35%");
    });

    it("draws one arc per non-empty part with its tone and caps when not closed", () => {
      const { container } = render(
        <ProgressCircle segments={[...tasks, { value: 0 }]} max={200} />,
      );
      const toned = container.querySelectorAll("circle[data-tone]");
      // two arcs + two caps
      expect(toned).toHaveLength(4);
      expect(toned[0]).toHaveAttribute("data-tone", "danger");
    });

    it("closes the ring without caps when the parts fill the scale", () => {
      const { container } = render(<ProgressCircle segments={tasks} />);
      expect(container.querySelectorAll("circle[data-tone]")).toHaveLength(2);
    });

    it("sets the gap mode and describes empty lists with labels", () => {
      render(<ProgressCircle segments={[]} segmentGap="hairline" labels={{ empty: "Пусто" }} />);
      const group = screen.getByRole("group", { name: "Пусто" });
      expect(group).toHaveAttribute("data-segment-gap", "hairline");
    });
  });
});
