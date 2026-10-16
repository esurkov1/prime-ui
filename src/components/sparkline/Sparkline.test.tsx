import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "@/components/data-table/DataTable";
import { cssRule, cssValue } from "@/test/css";

import { pathsOf, scaleOf, yOf } from "./geometry";
import { Sparkline, type SparklinePoint } from "./Sparkline";

const DATA: SparklinePoint[] = [
  { label: "6 окт", value: 300 },
  { label: "7 окт", value: 330 },
  { label: "8 окт", value: 297 },
];

const plot = () => screen.getByRole("slider", { name: "Выручка" });

describe("Sparkline", () => {
  it("heads with the latest point and its date, the change only when asked", () => {
    const { rerender } = render(
      <Sparkline data={DATA} label="Выручка" formatValue={(v) => `${v} ₽`} />,
    );
    expect(screen.getByText("8 окт")).toBeInTheDocument();
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297 ₽");
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    rerender(<Sparkline data={DATA} label="Выручка" change="previous" />);
    expect(screen.getByText("−10%")).toBeInTheDocument();
  });

  it("walks the points with the arrow keys, Home and End, and returns on blur", () => {
    render(<Sparkline data={DATA} label="Выручка" change="previous" />);
    plot().focus();
    fireEvent.keyDown(plot(), { key: "ArrowLeft" });
    expect(plot()).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getAllByText("7 окт")).toHaveLength(2); // the headline date and the tooltip
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
        <Sparkline data={DATA} label="Выручка" />
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
    const { container, rerender } = render(<Sparkline data={DATA} label="Выручка" />);
    expect(container.querySelectorAll("svg[viewBox='0 0 100 100'] path")).toHaveLength(2);
    expect(container.querySelector("linearGradient")).not.toBeNull();
    rerender(<Sparkline data={DATA} label="Выручка" variant="line" />);
    expect(container.querySelectorAll("svg[viewBox='0 0 100 100'] path")).toHaveLength(1);
    expect(container.querySelector("linearGradient")).toBeNull();
  });

  it("rests on the latest point with a value and speaks a missing one", () => {
    const GAPS: SparklinePoint[] = [...DATA, { label: "9 окт", value: null }];
    render(<Sparkline data={GAPS} label="Выручка" />);
    expect(plot()).toHaveAttribute("aria-valuenow", "2");
    fireEvent.keyDown(plot(), { key: "End" });
    expect(plot()).toHaveAttribute("aria-valuetext", "9 окт: Нет данных");
    expect(screen.getAllByText("Нет данных")).toHaveLength(2);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("compares with the first point or shows no change", () => {
    const { rerender } = render(<Sparkline data={DATA} label="Выручка" change="first" />);
    expect(screen.getByText("−1%")).toBeInTheDocument();
    rerender(<Sparkline data={DATA} label="Выручка" change="none" />);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("draws the reference line and describes the chart with it", () => {
    const { container } = render(
      <Sparkline data={DATA} label="Выручка" reference={400} formatValue={(v) => `${v} ₽`} />,
    );
    expect(plot()).toHaveAccessibleDescription("Ориентир: 400 ₽");
    // The scale reaches the reference: 400 is the top of the plot.
    const line = container.querySelector<HTMLElement>("[style*='--sparkline-ref']");
    expect(line?.style.getPropertyValue("--sparkline-ref")).toBe("0");
  });

  it("puts one scale on several sparklines through min and max", () => {
    const { container } = render(
      <Sparkline data={DATA} label="Выручка" variant="line" min={0} max={600} />,
    );
    // 297 of 0…600: the dot of the latest point sits just below the middle.
    const cursor = container.querySelector<HTMLElement>("[style*='--sparkline-y']");
    expect(Number(cursor?.style.getPropertyValue("--sparkline-y"))).toBeCloseTo(0.505, 3);
  });

  it("shows a tooltip beside the scrubbed point and hides it when scrubbing ends", () => {
    render(<Sparkline data={DATA} label="Выручка" formatValue={(v) => `${v} ₽`} />);
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

  it("shows the tooltip in compact and over bars", () => {
    const { rerender } = render(<Sparkline data={DATA} label="Выручка" layout="compact" />);
    fireEvent.keyDown(plot(), { key: "End" });
    expect(
      document.body.querySelector("[data-depth='floating'][data-state='open']"),
    ).toHaveTextContent("8 окт297");
    rerender(<Sparkline data={DATA} label="Выручка" variant="bars" />);
    fireEvent.keyDown(plot(), { key: "Home" });
    expect(
      document.body.querySelector("[data-depth='floating'][data-state='open']"),
    ).toHaveTextContent("6 окт300");
  });

  describe("summary", () => {
    it("rests on the period total against the previous period and shows a day while scrubbing", () => {
      const { container } = render(
        <Sparkline data={DATA} label="Выручка" summary="sum" compareTo={800} />,
      );
      // 300 + 330 + 297 = 927, +15,9% against 800.
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт – 8 окт: 927");
      expect(screen.getByText("6 окт – 8 окт")).toBeInTheDocument();
      expect(screen.getByText("+15,9%")).toBeInTheDocument();
      expect(container.querySelector("[data-hidden]")).not.toBeNull();
      fireEvent.keyDown(plot(), { key: "Home" });
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт: 300");
      expect(container.querySelector("[data-hidden]")).toBeNull();
      fireEvent.blur(plot());
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт – 8 окт: 927");
    });

    it("averages the present values and shows no change at rest without compareTo", () => {
      const GAPS: SparklinePoint[] = [...DATA, { label: "9 окт", value: null }];
      render(<Sparkline data={GAPS} label="Выручка" summary="average" />);
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт – 9 окт: 309");
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
    it("rests on its own value of the period against compareTo and scrubs the points", () => {
      const { container } = render(
        <Sparkline data={DATA} label="Выручка" value={250} compareTo={200} change="previous" />,
      );
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт – 8 окт: 250");
      expect(screen.getByText("+25%")).toBeInTheDocument();
      expect(container.querySelector("[data-hidden]")).not.toBeNull();
      fireEvent.keyDown(plot(), { key: "End" });
      expect(plot()).toHaveAttribute("aria-valuetext", "8 окт: 297");
      expect(screen.getByText("−10%")).toBeInTheDocument();
    });

    it("speaks an own value of null as empty", () => {
      render(<Sparkline data={DATA} label="Выручка" value={null} compareTo={200} />);
      expect(plot()).toHaveAttribute("aria-valuetext", "6 окт – 8 окт: Нет данных");
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });
  });

  describe("change", () => {
    const badge = (text: string) => screen.getByText(text).closest("[data-tone]");

    it("paints growth danger and a fall success when lower is better", () => {
      const { rerender } = render(
        <Sparkline data={DATA} label="Выручка" change="previous" better="lower" />,
      );
      expect(badge("−10%")).toHaveAttribute("data-tone", "success");
      rerender(
        <Sparkline data={DATA.slice(0, 2)} label="Выручка" change="previous" better="lower" />,
      );
      expect(badge("+10%")).toHaveAttribute("data-tone", "danger");
      rerender(<Sparkline data={DATA.slice(0, 2)} label="Выручка" change="previous" />);
      expect(badge("+10%")).toHaveAttribute("data-tone", "success");
    });

    it("shows a zero change neutral, without an arrow", () => {
      const FLAT: SparklinePoint[] = [
        { label: "7 окт", value: 1_000 },
        { label: "8 окт", value: 1_000.2 },
      ];
      render(<Sparkline data={FLAT} label="Выручка" change="previous" />);
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
        <Sparkline data={SHARE} label="Выручка" change="previous" changeUnit="points" />,
      );
      expect(badge("+0,5 п. п.")).toHaveAttribute("data-tone", "success");
      // A difference has a meaning across zero, where a percentage has none.
      rerender(
        <Sparkline
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
    render(<Sparkline data={DATA} label="Выручка" />);
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

  it("hides the tooltip on Escape until the pointer moves on", () => {
    render(<Sparkline data={DATA} label="Выручка" />);
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

  it("CSS: on a narrow head the title takes its line and the date goes under it", () => {
    const css = "src/components/sparkline/Sparkline.module.css";
    expect(cssValue(cssRule(css, ".head"), "container-type")).toBe("inline-size");
    expect(cssValue(cssRule(css, ".head"), "flex-wrap")).toBe("wrap");
    const label = cssRule(css, ".label", ["@container (max-width: 20rem)"]);
    expect(cssValue(label, "flex-basis")).toBe("100%");
    expect(cssValue(label, "white-space")).toBe("normal");
  });
});
