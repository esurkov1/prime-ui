import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "@/components/data-table/DataTable";

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

  describe("bars", () => {
    const SIGNED: SparklinePoint[] = [
      { label: "июл", value: 120 },
      { label: "авг", value: -40 },
      { label: "сен", value: 80 },
      { label: "окт", value: 60 },
    ];
    const bars = (container: HTMLElement) => [
      ...container.querySelectorAll<HTMLElement>(
        "[data-variant='bars'] [style*='--sparkline-top']",
      ),
    ];

    it("draws signed bars from the zero line: positive up, negative down", () => {
      const { container } = render(<Sparkline data={SIGNED} label="Прибыль" variant="bars" />);
      const drawn = bars(container);
      expect(drawn).toHaveLength(4);
      expect(drawn[1]).toHaveAttribute("data-negative", "true");
      expect(drawn[0]).not.toHaveAttribute("data-negative");
      // Scale −40…120: zero at 0.75 of the height; the negative bar starts there and goes down.
      expect(drawn[1].style.getPropertyValue("--sparkline-top")).toBe("0.75");
      expect(drawn[0].style.getPropertyValue("--sparkline-top")).toBe("0");
    });

    it("rests on the highlighted bar, quiets the others and scrubs by slot", () => {
      const { container } = render(
        <Sparkline data={SIGNED} label="Прибыль" variant="bars" highlight={2} />,
      );
      const slider = screen.getByRole("slider", { name: "Прибыль" });
      expect(slider).toHaveAttribute("aria-valuenow", "2");
      expect(slider).toHaveAttribute("aria-valuetext", "сен: 80");
      const slots = () => bars(container).map((bar) => bar.parentElement);
      expect(slots()[2]).toHaveAttribute("data-current", "true");
      expect(slots()[0]).toHaveAttribute("data-quiet", "true");
      slider.getBoundingClientRect = () => ({ left: 0, width: 400, top: 0, height: 80 }) as DOMRect;
      fireEvent.pointerMove(slider, { clientX: 150 });
      expect(slider).toHaveAttribute("aria-valuenow", "1");
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "2");
    });

    it("shows no percentage change across a sign flip", () => {
      render(<Sparkline data={SIGNED} label="Прибыль" variant="bars" highlight={1} />);
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
  });

  it("swaps skeletons for the data and keeps the title while loading", () => {
    const { container, rerender } = render(<Sparkline data={[]} label="Выручка" loading />);
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Выручка")).toBeInTheDocument();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    rerender(<Sparkline data={DATA} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    expect(container.firstElementChild).not.toHaveAttribute("aria-busy");
  });

  it("speaks a point through labels", () => {
    render(<Sparkline data={DATA} label="Выручка" labels={{ point: "{value} на {label}" }} />);
    expect(plot()).toHaveAttribute("aria-valuetext", "297 на 8 окт");
  });

  describe("compact", () => {
    it("draws the plot alone: label only names the slider, the point is in aria-valuetext", () => {
      const { container } = render(
        <Sparkline data={DATA} label="Выручка" layout="compact" formatValue={(v) => `${v} ₽`} />,
      );
      expect(container.firstElementChild).toHaveAttribute("data-layout", "compact");
      expect(screen.queryByText("Выручка")).not.toBeInTheDocument();
      expect(screen.queryByText("8 окт")).not.toBeInTheDocument();
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
      expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297 ₽");
      // The dot rests on the latest point.
      const cursor = container.querySelector<HTMLElement>("[style*='--sparkline-x']");
      expect(cursor?.style.getPropertyValue("--sparkline-x")).toBe("1");
      fireEvent.keyDown(plot(), { key: "Home" });
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт: 300 ₽");
    });

    it("loads as the plot skeleton alone", () => {
      const { container } = render(
        <Sparkline data={[]} label="Выручка" layout="compact" loading />,
      );
      expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByText("Выручка")).not.toBeInTheDocument();
      expect(container.firstElementChild?.childElementCount).toBe(1);
    });

    it("scrubbing and keys on the plot never open a DataTable row", () => {
      type Client = { id: string; name: string; trend: SparklinePoint[] };
      const onRowClick = vi.fn();
      render(
        <DataTable<Client>
          rows={[{ id: "c1", name: "Гранит", trend: DATA }]}
          columns={[
            { id: "name", header: "Клиент", accessor: "name" },
            {
              id: "trend",
              header: "По месяцам",
              cell: (row) => <Sparkline data={row.trend} label="Выручка" layout="compact" />,
            },
          ]}
          getRowKey={(row) => row.id}
          onRowClick={onRowClick}
        />,
      );
      const area = plot();
      area.getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 20 }) as DOMRect;
      fireEvent.pointerDown(area, { clientX: 0, pointerType: "mouse" });
      fireEvent.pointerUp(area, { clientX: 0, pointerType: "mouse" });
      fireEvent.click(area);
      area.focus();
      fireEvent.keyDown(area, { key: "Enter" });
      fireEvent.keyDown(area, { key: " " });
      fireEvent.keyDown(area, { key: "ArrowLeft" });
      expect(onRowClick).not.toHaveBeenCalled();
      expect(area).toHaveAttribute("data-row-click-ignore");
      // The row itself still opens.
      fireEvent.click(screen.getByRole("cell", { name: "Гранит" }));
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });
  });
});
