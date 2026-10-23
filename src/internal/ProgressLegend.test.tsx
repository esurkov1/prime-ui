import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressLegend, ProgressLegendSkeleton } from "./ProgressLegend";
import { formatProgressValue } from "./progressSegments";

const SEGMENTS = [
  { value: 1200, label: "Видео", color: "purple" as const },
  { value: 600, label: "Документы", tone: "success" as const },
  { value: 200, label: "Прочее" },
];

describe("ProgressLegend", () => {
  it("lists every part with its name, value and share of the scale", () => {
    render(
      <ProgressLegend
        segments={SEGMENTS}
        scale={4000}
        formatValue={formatProgressValue}
        size="m"
        id="storage-legend"
      />,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("id", "storage-legend");
    expect(list).toHaveAttribute("data-size", "m");
    const rows = within(list)
      .getAllByRole("listitem")
      .map((row) => row.textContent?.replace(/\s/g, " "));
    expect(rows).toEqual(["Видео1 20030%", "Документы60015%", "Прочее2005%"]);
  });

  it("marks each swatch with the part's color or tone and hides it from assistive tech", () => {
    const { container } = render(
      <ProgressLegend segments={SEGMENTS} scale={2000} formatValue={String} size="s" />,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "s");
    const marks = Array.from(container.querySelectorAll("li > span:first-child"));
    const swatches = marks.map((mark) => mark.firstElementChild as Element);
    expect(marks.map((mark) => mark.getAttribute("aria-hidden"))).toEqual(["true", "true", "true"]);
    expect(swatches.map((swatch) => swatch.getAttribute("data-color"))).toEqual([
      "purple",
      null,
      null,
    ]);
    expect(swatches.map((swatch) => swatch.getAttribute("data-tone"))).toEqual([
      null,
      "success",
      "accent",
    ]);
  });

  it("shows 0% shares on an empty scale and renders nothing without parts", () => {
    const { container, rerender } = render(
      <ProgressLegend
        segments={[{ value: 0, label: "Видео" }]}
        scale={0}
        formatValue={String}
        size="m"
      />,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Видео00%");
    rerender(<ProgressLegend segments={[]} scale={0} formatValue={String} size="m" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("ProgressLegendSkeleton", () => {
  it("draws one text line per expected row, at least one", () => {
    const { container, rerender } = render(<ProgressLegendSkeleton rows={3} size="m" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "m");
    expect(root.children).toHaveLength(3);
    rerender(<ProgressLegendSkeleton rows={0} size="m" />);
    expect((container.firstElementChild as HTMLElement).children).toHaveLength(1);
  });
});
