import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "@/components/data-table/DataTable";
import { cssRule, cssValue } from "@/test/css";

import { pathsOf, scaleOf, yOf } from "./geometry";
import { Sparkline, type SparklinePoint, type SparklineProps } from "./Sparkline";
import { type UseSparklineOptions, useSparkline } from "./useSparkline";

type TileProps = UseSparklineOptions &
  Pick<
    SparklineProps,
    "label" | "variant" | "layout" | "size" | "min" | "max" | "reference" | "loading" | "curve"
  >;

/** A headline laid out from the reading, as a card does: the date, the value and the change. */
function Tile({
  label,
  variant,
  layout,
  size,
  min,
  max,
  reference,
  loading,
  curve,
  ...options
}: TileProps) {
  const reading = useSparkline(options as UseSparklineOptions);
  return (
    <div>
      <span data-testid="date">{reading.date}</span>
      <span data-testid="value">{reading.valueText}</span>
      {reading.changeText ? (
        <span data-testid="change" data-tone={reading.changeTone}>
          {reading.changeText}
        </span>
      ) : null}
      <Sparkline
        {...reading.plot}
        label={label}
        variant={variant}
        layout={layout}
        size={size}
        min={min}
        max={max}
        reference={reference}
        loading={loading}
        curve={curve}
      />
    </div>
  );
}

const DATA: SparklinePoint[] = [
  { label: "6 окт", value: 300 },
  { label: "7 окт", value: 330 },
  { label: "8 окт", value: 297 },
];

const plot = () => screen.getByRole("slider", { name: "Выручка" });

describe("Sparkline", () => {
  it("heads with the latest point and its date, the change only when asked", () => {
    const { rerender } = render(<Tile data={DATA} label="Выручка" formatValue={(v) => `${v} ₽`} />);
    expect(screen.getByText("8 окт")).toBeInTheDocument();
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297 ₽");
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    rerender(<Tile data={DATA} label="Выручка" change="previous" />);
    expect(screen.getByText("−10%")).toBeInTheDocument();
  });

  it("walks the points with the arrow keys, Home and End, and returns on blur", () => {
    render(<Tile data={DATA} label="Выручка" change="previous" />);
    plot().focus();
    fireEvent.keyDown(plot(), { key: "ArrowLeft" });
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getAllByText("7 окт")).toHaveLength(1); // the headline date; no tooltip repeats it
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

  it("takes focus with Tab, steps with ↓ and ↑ as on a slider and rests again when Tab leaves", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tile data={DATA} label="Выручка" />
        <button type="button">Дальше</button>
      </>,
    );
    await user.tab();
    expect(plot()).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    await user.keyboard("{ArrowDown}");
    expect(plot()).toHaveAttribute("aria-valuenow", "0");
    await user.keyboard("{ArrowUp}");
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    await user.tab();
    expect(screen.getByRole("button", { name: "Дальше" })).toHaveFocus();
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
  });

  it("follows the pointer and settles back when it leaves", () => {
    const { container } = render(<Tile data={DATA} label="Выручка" />);
    const area = plot();
    area.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 80 }) as DOMRect;
    fireEvent.pointerMove(area, { clientX: 10 });
    expect(area).toHaveAttribute("aria-valuenow", "0");
    expect(container.querySelector("[data-size]")).toHaveAttribute("data-scrubbing", "true");
    fireEvent.pointerLeave(area);
    expect(area).toHaveAttribute("aria-valuenow", "2");
    expect(container.querySelector("[data-size]")).not.toHaveAttribute("data-scrubbing");
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
      const { container } = render(<Tile data={SIGNED} label="Прибыль" variant="bars" />);
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
        <Tile data={SIGNED} label="Прибыль" variant="bars" highlight={2} />,
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
      render(<Tile data={SIGNED} label="Прибыль" variant="bars" highlight={1} />);
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
  });

  it("swaps the plot skeleton for the data", () => {
    const { container, rerender } = render(<Sparkline data={[]} label="Выручка" loading />);
    expect(container.querySelector("[data-size]")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    rerender(<Sparkline data={DATA} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    expect(container.querySelector("[data-size]")).not.toHaveAttribute("aria-busy");
  });

  it("speaks a point through labels", () => {
    render(<Tile data={DATA} label="Выручка" labels={{ point: "{value} на {label}" }} />);
    expect(plot()).toHaveAttribute("aria-valuetext", "297 на 8 окт");
  });

  describe("compact", () => {
    it("draws the plot alone: label only names the slider, the point is in aria-valuetext", () => {
      const { container } = render(
        <Sparkline data={DATA} label="Выручка" layout="compact" formatValue={(v) => `${v} ₽`} />,
      );
      expect(container.querySelector("[data-size]")).toHaveAttribute("data-layout", "compact");
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
      const { container } = render(<Tile data={[]} label="Выручка" layout="compact" loading />);
      expect(container.querySelector("[data-size]")).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByText("Выручка")).not.toBeInTheDocument();
      expect(container.querySelector("[data-size]")?.childElementCount).toBe(1);
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
              cell: (row) => <Tile data={row.trend} label="Выручка" layout="compact" />,
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

  describe("geometry", () => {
    const values = [10, 40, 40, 5, 30];
    const x = (i: number) => i / (values.length - 1);
    const y = (value: number) => yOf(scaleOf(values, []), value);
    /** Every y of the cubic Bézier pieces, sampled densely, in the 0–100 box. */
    const sampledY = (d: string) => {
      const numbers = d.match(/-?[\d.]+/g)?.map(Number) ?? [];
      const out: number[] = [];
      let [, y0] = numbers;
      for (let k = 2; k + 5 < numbers.length; k += 6) {
        const [, c1, , c2, , y1] = numbers.slice(k, k + 6);
        for (let t = 0; t <= 1; t += 0.05) {
          const u = 1 - t;
          out.push(u * u * u * y0 + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t * y1);
        }
        y0 = y1;
      }
      return out;
    };

    it("draws a smooth curve through every point that never overshoots the extremes", () => {
      const { line } = pathsOf(values, x, y, "smooth");
      expect(line.startsWith("M0,85.71C")).toBe(true);
      const ys = sampledY(line);
      // 0 is the top (the max, 40) and 100 the bottom (the min, 5): the curve stays inside.
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(-1e-9);
      expect(Math.max(...ys)).toBeLessThanOrEqual(100 + 1e-9);
      // A flat stretch between two equal points stays flat (no bump between them).
      expect(line).toContain("C33.33,0,41.67,0,50,0");
    });

    it("breaks the line at null and keeps a lone point as a dot", () => {
      const gaps = [10, 20, null, 30, null, 15, 25];
      const { line, area, lone } = pathsOf(
        gaps,
        (i) => i / 6,
        (v) => yOf(scaleOf(gaps, []), v),
        "linear",
      );
      expect(line.match(/M/g)).toHaveLength(2);
      expect(area.match(/Z/g)).toHaveLength(2);
      expect(lone).toEqual([3]);
    });

    it("widens the scale to min, max and the reference without cutting the data", () => {
      expect(scaleOf([20, 30], [0, 100, undefined])).toEqual({ lo: 0, hi: 100 });
      expect(scaleOf([20, 130], [0, 100])).toEqual({ lo: 0, hi: 130 });
      expect(scaleOf([], [])).toEqual({ lo: 0, hi: 1 });
      expect(yOf({ lo: 5, hi: 5 }, 5)).toBe(0.5);
    });

    it("draws steps that change halfway between points", () => {
      expect(
        pathsOf(
          [1, 3],
          (i) => i,
          (v) => (v === 1 ? 1 : 0),
          "step",
        ).line,
      ).toBe("M0,100H50V0H100");
    });
  });

  it("draws an area by default and the line alone with variant line", () => {
    const { container, rerender } = render(<Tile data={DATA} label="Выручка" />);
    expect(container.querySelectorAll("svg[viewBox='0 0 100 100'] path")).toHaveLength(2);
    expect(container.querySelector("linearGradient")).not.toBeNull();
    rerender(<Tile data={DATA} label="Выручка" variant="line" />);
    expect(container.querySelectorAll("svg[viewBox='0 0 100 100'] path")).toHaveLength(1);
    expect(container.querySelector("linearGradient")).toBeNull();
  });

  it("rests on the latest point with a value and speaks a missing one", () => {
    const GAPS: SparklinePoint[] = [...DATA, { label: "9 окт", value: null }];
    render(<Tile data={GAPS} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    fireEvent.keyDown(plot(), { key: "End" });
    expect(plot()).toHaveAttribute("aria-valuetext", "9 окт: Нет данных");
    expect(screen.getAllByText("Нет данных")).toHaveLength(1);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("compares with the first point or shows no change", () => {
    const { rerender } = render(<Tile data={DATA} label="Выручка" change="first" />);
    expect(screen.getByText("−1%")).toBeInTheDocument();
    rerender(<Tile data={DATA} label="Выручка" change="none" />);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("draws the reference line and describes the chart with it", () => {
    const { container } = render(
      <Tile data={DATA} label="Выручка" reference={400} formatValue={(v) => `${v} ₽`} />,
    );
    expect(plot()).toHaveAccessibleDescription("Ориентир: 400 ₽");
    // The scale reaches the reference: 400 is the top of the plot.
    const line = container.querySelector<HTMLElement>("[style*='--sparkline-ref']");
    expect(line?.style.getPropertyValue("--sparkline-ref")).toBe("0");
  });

  it("puts one scale on several sparklines through min and max", () => {
    const { container } = render(
      <Tile data={DATA} label="Выручка" variant="line" min={0} max={600} />,
    );
    // 297 of 0…600: the dot of the latest point sits just below the middle.
    const cursor = container.querySelector<HTMLElement>("[style*='--sparkline-y']");
    expect(Number(cursor?.style.getPropertyValue("--sparkline-y"))).toBeCloseTo(0.505, 3);
  });

  it("shows a tooltip beside the scrubbed point of a compact plot and hides it when scrubbing ends", () => {
    render(<Tile data={DATA} label="Выручка" layout="compact" formatValue={(v) => `${v} ₽`} />);
    const tooltip = () => document.body.querySelector("[data-depth='floating'][data-state='open']");
    expect(tooltip()).toBeNull();
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(tooltip()).toHaveTextContent("6 окт300 ₽");
    expect(tooltip()).toHaveAttribute("aria-hidden", "true");
    fireEvent.keyDown(plot(), { key: "ArrowRight" });
    expect(tooltip()).toHaveTextContent("7 окт330 ₽");
    fireEvent.blur(plot());
    expect(tooltip()).toBeNull();
  });

  it("leads a group through a shared point: cursor and headline on all, no tooltip", async () => {
    const user = userEvent.setup();
    const onPointChange = vi.fn();
    function Group() {
      const [point, setPoint] = React.useState<number | null>(null);
      return (
        <>
          {["Лиды", "Брони"].map((label) => (
            <Tile
              key={label}
              data={DATA}
              label={label}
              point={point}
              onPointChange={(next) => {
                setPoint(next);
                onPointChange(next);
              }}
            />
          ))}
        </>
      );
    }
    render(<Group />);
    const leads = screen.getByRole("slider", { name: "Лиды" });
    const bookings = screen.getByRole("slider", { name: "Брони" });
    const tooltips = () =>
      document.body.querySelectorAll("[data-depth='floating'][data-state='open']");
    await user.tab();
    await user.keyboard("{Home}");
    expect(onPointChange).toHaveBeenLastCalledWith(0);
    expect(leads).toHaveAttribute("aria-valuenow", "0");
    expect(bookings).toHaveAttribute("aria-valuenow", "0");
    expect(bookings.closest("[data-scrubbing]")).not.toBeNull();
    expect(tooltips()).toHaveLength(0); // the headlines show the point
    await user.keyboard("{ArrowRight}");
    expect(bookings).toHaveAttribute("aria-valuetext", "7 окт: 330");
    await user.tab();
    expect(onPointChange).toHaveBeenLastCalledWith(null);
    expect(bookings).toHaveAttribute("aria-valuenow", "2");
    expect(tooltips()).toHaveLength(0);
  });

  it("rests on a controlled point and sizes the plot by its tier", () => {
    const { container, rerender } = render(<Tile data={DATA} label="Выручка" point={1} />);
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    expect(container.querySelector("[data-size]")).toHaveAttribute("data-size", "m");
    rerender(<Tile data={DATA} label="Выручка" size="s" defaultPoint={0} />);
    expect(container.querySelector("[data-size]")).toHaveAttribute("data-size", "s");
    const css = "src/components/sparkline/Sparkline.module.css";
    expect(cssValue(cssRule(css, '.root[data-size="s"]'), "--sparkline-h")).toBe(
      "var(--prime-space-12)",
    );
    expect(cssValue(cssRule(css, ".plotSkeleton"), "height")).toBe("var(--sparkline-h)");
  });

  it("shows the tooltip in compact and over bars", () => {
    const { rerender } = render(<Tile data={DATA} label="Выручка" layout="compact" />);
    fireEvent.keyDown(plot(), { key: "End" });
    expect(
      document.body.querySelector("[data-depth='floating'][data-state='open']"),
    ).toHaveTextContent("8 окт297");
    rerender(<Tile data={DATA} label="Выручка" layout="compact" variant="bars" />);
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(
      document.body.querySelector("[data-depth='floating'][data-state='open']"),
    ).toHaveTextContent("6 окт300");
  });

  describe("summary", () => {
    it("rests on the period total against the previous period and shows a day while scrubbing", () => {
      const { container } = render(
        <Tile data={DATA} label="Выручка" summary="sum" compareTo={800} />,
      );
      // 300 + 330 + 297 = 927, +15,9% against 800.
      expect(screen.getByTestId("value")).toHaveTextContent("927");
      expect(screen.getByText("6 окт – 8 окт")).toBeInTheDocument();
      expect(screen.getByText("+15,9%")).toBeInTheDocument();
      expect(container.querySelector("[data-hidden]")).not.toBeNull();
      fireEvent.keyDown(plot(), { key: "Home" });
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт: 300");
      expect(screen.getByTestId("value")).toHaveTextContent("300");
      expect(container.querySelector("[data-hidden]")).toBeNull();
      fireEvent.blur(plot());
      expect(screen.getByTestId("date")).toHaveTextContent("6 окт – 8 окт");
    });

    it("averages the present values and shows no change at rest without compareTo", () => {
      const GAPS: SparklinePoint[] = [...DATA, { label: "9 окт", value: null }];
      render(<Tile data={GAPS} label="Выручка" summary="average" />);
      expect(screen.getByTestId("date")).toHaveTextContent("6 окт – 9 окт");
      expect(screen.getByTestId("value")).toHaveTextContent("309");
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
    it("rests on its own value of the period against compareTo and scrubs the points", () => {
      const { container } = render(
        <Tile data={DATA} label="Выручка" value={250} compareTo={200} change="previous" />,
      );
      expect(screen.getByTestId("value")).toHaveTextContent("250");
      expect(screen.getByText("+25%")).toBeInTheDocument();
      expect(container.querySelector("[data-hidden]")).not.toBeNull();
      fireEvent.keyDown(plot(), { key: "End" });
      expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297");
      expect(screen.getByText("−10%")).toBeInTheDocument();
    });

    it("speaks an own value of null as empty", () => {
      render(<Tile data={DATA} label="Выручка" value={null} compareTo={200} />);
      expect(screen.getByTestId("value")).toHaveTextContent("Нет данных");
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
  });

  describe("change", () => {
    const badge = (text: string) => screen.getByText(text).closest("[data-tone]");

    it("paints growth danger and a fall success when lower is better", () => {
      const { rerender } = render(
        <Tile data={DATA} label="Выручка" change="previous" better="lower" />,
      );
      expect(badge("−10%")).toHaveAttribute("data-tone", "success");
      rerender(<Tile data={DATA.slice(0, 2)} label="Выручка" change="previous" better="lower" />);
      expect(badge("+10%")).toHaveAttribute("data-tone", "danger");
      rerender(<Tile data={DATA.slice(0, 2)} label="Выручка" change="previous" />);
      expect(badge("+10%")).toHaveAttribute("data-tone", "success");
    });

    it("shows a zero change neutral, without an arrow", () => {
      const FLAT: SparklinePoint[] = [
        { label: "7 окт", value: 1_000 },
        { label: "8 окт", value: 1_000.2 },
      ];
      render(<Tile data={FLAT} label="Выручка" change="previous" />);
      const zero = badge("0%");
      expect(zero).toHaveAttribute("data-tone", "neutral");
      expect(zero?.querySelector("svg")).toBeNull();
    });

    it("measures a share in percentage points through labels.points", () => {
      const SHARE: SparklinePoint[] = [
        { label: "сен", value: 4.1 },
        { label: "окт", value: 4.6 },
      ];
      const { rerender } = render(
        <Tile data={SHARE} label="Выручка" change="previous" changeUnit="points" />,
      );
      expect(badge("+0,5 п. п.")).toHaveAttribute("data-tone", "success");
      // A difference has a meaning across zero, where a percentage has none.
      rerender(
        <Tile
          data={[
            { label: "сен", value: -1 },
            { label: "окт", value: 2 },
          ]}
          label="Выручка"
          change="previous"
          changeUnit="points"
          labels={{ points: "{value} пп" }}
        />,
      );
      expect(screen.getByText("+3 пп")).toBeInTheDocument();
    });
  });

  it("places the tooltip right of the pointer at its height and keeps the side past the middle", () => {
    document.documentElement.style.setProperty("--prime-space-4", "16px");
    render(<Tile data={DATA} label="Выручка" layout="compact" />);
    const area = plot();
    area.getBoundingClientRect = () =>
      ({ left: 100, width: 200, top: 100, height: 80, right: 300, bottom: 180 }) as DOMRect;
    const chip = () =>
      document.body.querySelector<HTMLElement>("[data-depth='floating'][data-state='open']");
    fireEvent.pointerMove(area, { clientX: 120, clientY: 150 });
    // The anchor is the pointer itself: right of it by `--prime-space-4` (`usePosition`).
    expect(chip()?.style.left).toBe("136px");
    expect(chip()?.style.top).toBe("150px");
    fireEvent.pointerMove(area, { clientX: 122, clientY: 120 });
    expect(chip()?.style.left).toBe("138px");
    expect(chip()?.style.top).toBe("120px");
    // Past the middle of the plot it stays right: only a lack of room flips it.
    fireEvent.pointerMove(area, { clientX: 280, clientY: 120 });
    expect(chip()?.style.left).toBe("296px");
    expect(chip()).toHaveAttribute("data-side", "right");
    document.documentElement.style.removeProperty("--prime-space-4");
  });

  it("returns the headline to rest on Escape, with no tooltip over the default plot", () => {
    render(<Tile data={DATA} label="Выручка" />);
    plot().focus();
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(plot()).toHaveAttribute("aria-valuenow", "0");
    expect(document.body.querySelector("[data-depth='floating'][data-state='open']")).toBeNull();
    fireEvent.keyDown(plot(), { key: "Escape" });
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
  });

  it("hides the compact tooltip on Escape until the pointer moves on", () => {
    render(<Tile data={DATA} label="Выручка" layout="compact" />);
    const area = plot();
    area.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, height: 80, right: 200, bottom: 80 }) as DOMRect;
    fireEvent.pointerMove(area, { clientX: 20, clientY: 40 });
    expect(
      document.body.querySelector("[data-depth='floating'][data-state='open']"),
    ).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.querySelector("[data-depth='floating'][data-state='open']")).toBeNull();
    expect(area).toHaveAttribute("aria-valuenow", "2");
  });
});

/** Days from `start`: `count` of them, the value of each from `valueAt(dayIndex)`. */
const daysFrom = (start: string, count: number, valueAt: (i: number) => number | null) => {
  const [y, m, d] = start.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(y, m - 1, d + i),
    value: valueAt(i),
  }));
};

describe("Sparkline with dated days", () => {
  it("auto: a month goes by days, half a year by weeks, a year by months, three years by quarters", () => {
    const { rerender } = render(
      <Tile data={daysFrom("2026-09-01", 30, () => 1)} label="Выручка" />,
    );
    expect(plot()).toHaveAttribute("aria-valuemax", "29");
    expect(plot()).toHaveAttribute("aria-valuetext", "30 сен: 1");
    rerender(<Tile data={daysFrom("2026-04-06", 175, () => 1)} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuemax", "24"); // 25 ISO weeks from Monday 6 April
    rerender(<Tile data={daysFrom("2025-01-01", 365, () => 1)} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuemax", "11");
    expect(plot()).toHaveAttribute("aria-valuetext", "дек: 1");
    rerender(<Tile data={daysFrom("2023-01-01", 1096, () => 1)} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuemax", "11");
    expect(plot()).toHaveAttribute("aria-valuetext", "IV кв. 2025: 1");
  });

  it("folds the days by summary: a sum per period, the last day for a level", () => {
    const data = daysFrom("2026-08-01", 61, (i) => (i < 31 ? 10 : 20));
    const { rerender } = render(<Tile data={data} label="Выручка" grain="month" summary="sum" />);
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(plot()).toHaveAttribute("aria-valuetext", "авг: 310");
    rerender(<Tile data={data} label="Выручка" grain="month" />);
    fireEvent.keyDown(plot(), { key: "End" });
    expect(plot()).toHaveAttribute("aria-valuetext", "сен: 20");
  });

  it("names a cut period by its days and compares it with the same days of the one before", () => {
    // 1 September – 22 October: October is cut at the 22nd.
    const data = daysFrom("2026-09-01", 52, (i) => (i < 30 ? 10 : 11));
    render(<Tile data={data} label="Выручка" grain="month" summary="sum" change="previous" />);
    fireEvent.keyDown(plot(), { key: "End" });
    expect(plot()).toHaveAttribute("aria-valuetext", "1–22 окт: 242");
    // 22 days × 11 against the same 22 days × 10 of September, not the whole month (300).
    expect(screen.getByText("+10%")).toBeInTheDocument();
    expect(document.querySelector("[data-cut]")).not.toBeNull();
  });

  it("a KPI tile heads with the latest week's total against the same days of the week before", () => {
    // Monday 5 – Thursday 22 October: the week of the 19th is cut at Thursday.
    const data = daysFrom("2026-10-05", 18, (i) => (i < 14 ? 10 : 12));
    render(<Tile data={data} label="Выручка" grain="week" aggregate="sum" change="previous" />);
    expect(screen.getByText("19–22 окт")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    // 4 days × 12 against Monday–Thursday of the week before, 4 × 10.
    expect(screen.getByText("+20%")).toBeInTheDocument();
  });

  it("at rest the period runs from the first day to the last, whatever the grain", () => {
    render(
      <Tile
        data={daysFrom("2026-09-01", 52, () => 1)}
        label="Выручка"
        grain="week"
        summary="sum"
      />,
    );
    expect(screen.getByText("1 сен – 22 окт")).toBeInTheDocument();
    expect(screen.getByText("52")).toBeInTheDocument();
  });

  it("a missing day is a gap, not a zero", () => {
    render(
      <Tile
        data={[
          { date: "2026-10-06", value: 3 },
          { date: "2026-10-08", value: 5 },
        ]}
        label="Выручка"
        change="previous"
      />,
    );
    fireEvent.keyDown(plot(), { key: "ArrowLeft" });
    expect(plot()).toHaveAttribute("aria-valuetext", "7 окт: Нет данных");
  });

  it("the reading offers the steps with two points or more and sets one", () => {
    const { result } = renderHook(() =>
      useSparkline({ data: daysFrom("2026-10-01", 53, () => 1), aggregate: "sum" }),
    );
    // 1 October – 22 November: one quarter is a single point.
    expect(result.current.grains).toEqual(["day", "week", "month"]);
    expect(result.current.grain).toBe("week");
    act(() => result.current.setGrain("month"));
    expect(result.current.grain).toBe("month");
    expect(result.current.plot.grain).toBe("month");
    expect(result.current.date).toBe("1–22 ноя");
  });
});

describe("Sparkline with series", () => {
  const LAST_YEAR = [
    { label: "6 окт", value: 250 },
    { label: "7 окт", value: 270 },
    { label: "8 окт", value: 260 },
  ];

  it("draws each line in its color and variant, names it in the legend and speaks it", () => {
    render(
      <Tile
        data={DATA}
        label="Выручка"
        variant="line"
        series={[
          { id: "last", label: "Прошлый год", data: LAST_YEAR, variant: "dotted", color: "orange" },
          { id: "plan", label: "План", data: [{ label: "6 окт", value: 280 }], variant: "dashed" },
        ]}
      />,
    );
    const lines = Array.from(document.querySelectorAll("path[data-line]"));
    expect(lines.map((line) => line.getAttribute("data-line"))).toEqual(["dotted", "line"]);
    expect(lines[0].closest("g")?.getAttribute("style")).toContain("var(--prime-color-chart-2)");
    const legend = screen.getByRole("list", { name: "Линии графика" });
    expect(legend).toHaveTextContent("Выручка");
    expect(legend).toHaveTextContent("Прошлый год260");
    // A line shorter than the main series has no value past its end.
    expect(legend).toHaveTextContent("ПланНет данных");
    expect(plot()).toHaveAttribute(
      "aria-valuetext",
      "8 окт: 297; Прошлый год: 260; План: Нет данных",
    );
    plot().focus();
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(legend).toHaveTextContent("Прошлый год250");
    // A dot per line on the cursor.
    expect(
      document.querySelectorAll("[style*='--sparkline-y']:not([style*='--sparkline-x'])"),
    ).toHaveLength(3);
  });

  it("the default color of a line is the next chart color; one scale holds every line", () => {
    render(
      <Tile
        data={DATA}
        label="Выручка"
        series={[
          {
            id: "plan",
            label: "План",
            data: DATA.map((p) => ({ label: p.label ?? "", value: 600 })),
          },
        ]}
      />,
    );
    const plan = document.querySelector("path[data-line='line']")?.closest("g");
    expect(plan?.getAttribute("style")).toContain("var(--prime-color-chart-2)");
    // 600 widens the scale: the main series stays in the lower half.
    const [planDot, mainDot] = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[style*='--sparkline-y']:not([style*='--sparkline-x'])",
      ),
    );
    expect(Number(planDot.style.getPropertyValue("--sparkline-y"))).toBe(0);
    expect(Number(mainDot.style.getPropertyValue("--sparkline-y"))).toBeGreaterThan(0.5);
  });

  it("dated lines fold by the main series' grain, by position; at rest a sum gives each total", () => {
    render(
      <Tile
        data={daysFrom("2026-09-01", 61, () => 10)}
        label="Заказы"
        grain="month"
        summary="sum"
        series={[{ id: "last", label: "Прошлый год", data: daysFrom("2025-09-01", 61, () => 5) }]}
      />,
    );
    expect(screen.getByRole("list", { name: "Линии графика" })).toHaveTextContent("Прошлый год305");
    const orders = screen.getByRole("slider", { name: "Заказы" });
    orders.focus();
    fireEvent.keyDown(orders, { key: "Home" });
    expect(orders).toHaveAttribute("aria-valuetext", "сен: 300; Прошлый год: 150");
  });

  it("bars carry the lines of series over them; compact shows them in the tooltip", () => {
    const { rerender } = render(
      <Tile
        data={DATA}
        label="Выручка"
        variant="bars"
        series={[{ id: "plan", label: "План", data: LAST_YEAR, variant: "dashed" }]}
      />,
    );
    expect(document.querySelector("path[data-line='dashed']")).not.toBeNull();
    rerender(
      <Tile
        data={DATA}
        label="Выручка"
        layout="compact"
        series={[{ id: "plan", label: "План", data: LAST_YEAR }]}
      />,
    );
    expect(screen.queryByRole("list", { name: "Линии графика" })).not.toBeInTheDocument();
    const area = plot();
    vi.spyOn(area, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 28));
    fireEvent.pointerMove(area, { clientX: 0, clientY: 10 });
    const tooltip = document.body.querySelector("[data-depth='floating'][data-state='open']");
    expect(tooltip).toHaveTextContent("План250");
  });

  it("a dashed or dotted main line is drawn so, and a cut period does not dash it again", () => {
    render(
      <Tile
        data={daysFrom("2026-09-01", 52, () => 1)}
        label="Выручка"
        grain="month"
        variant="dotted"
      />,
    );
    expect(document.querySelector("path[data-line='dotted']")).not.toBeNull();
    expect(document.querySelector("[data-cut]")).toBeNull();
  });

  it("CSS: the pointer hits only the plot: one target while scrubbing", () => {
    const css = "src/components/sparkline/Sparkline.module.css";
    expect(cssValue(cssRule(css, ".plot *"), "pointer-events")).toBe("none");
  });

  it("CSS: dashed and dotted lines and swatches", () => {
    const css = "src/components/sparkline/Sparkline.module.css";
    expect(cssValue(cssRule(css, '.line[data-line="dashed"]'), "stroke-dasharray")).toContain(
      "--prime-space-2",
    );
    expect(cssValue(cssRule(css, '.line[data-line="dotted"]'), "stroke-dasharray")).toMatch(/^0 /);
    expect(cssValue(cssRule(css, '.swatch[data-line="dotted"]'), "border-top-style")).toBe(
      "dotted",
    );
  });
});
