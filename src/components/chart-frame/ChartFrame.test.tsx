import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ChartFrame,
  type ChartFramePlotArea,
  type ChartFrameSeries,
  type ChartFrameState,
} from "./ChartFrame";

const SERIES: ChartFrameSeries[] = [
  { id: "new", label: "Новые клиенты", value: 1200 },
  { id: "renewals", label: "Продления", value: 3400, color: "teal" },
];

const ROWS = [
  { label: "сен", values: { new: 3900, renewals: 4400 } },
  { label: "окт", values: { new: 4200 } },
];

function Frame({
  state,
  renderPlot = () => <svg data-testid="plot" />,
  ...rest
}: Partial<React.ComponentProps<typeof ChartFrame.Root>> & {
  renderPlot?: (area: ChartFramePlotArea) => React.ReactNode;
}) {
  return (
    <ChartFrame.Root state={state} series={SERIES} rows={ROWS} {...rest}>
      <ChartFrame.Header>
        <ChartFrame.Title>Выручка</ChartFrame.Title>
        <ChartFrame.Description>По месяцам</ChartFrame.Description>
      </ChartFrame.Header>
      <ChartFrame.Value>
        8,4 млн ₽<ChartFrame.Delta tone="success">+8%</ChartFrame.Delta>
      </ChartFrame.Value>
      <ChartFrame.Plot renderPlot={renderPlot} />
      <ChartFrame.Legend />
    </ChartFrame.Root>
  );
}

let observers: Array<(width: number, height: number) => void> = [];

beforeEach(() => {
  observers = [];
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 480,
    height: 240,
    top: 0,
    left: 0,
    right: 480,
    bottom: 240,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        observers.push((width, height) =>
          this.callback(
            [{ contentRect: { width, height } } as ResizeObserverEntry],
            this as unknown as ResizeObserver,
          ),
        );
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ChartFrame", () => {
  it("is a figure named by its title and described by its description", () => {
    render(<Frame />);
    const figure = screen.getByRole("figure", { name: "Выручка" });
    expect(figure).toHaveAccessibleDescription("По месяцам");
    expect(figure).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("heading", { level: 3, name: "Выручка" })).toBeInTheDocument();
  });

  it("hands renderPlot the measured size and the series with resolved colors", () => {
    const renderPlot = vi.fn(() => null);
    render(<Frame renderPlot={renderPlot} defaultHiddenSeries={["renewals"]} />);
    expect(renderPlot).toHaveBeenLastCalledWith({
      width: 480,
      height: 240,
      series: [
        { id: "new", label: "Новые клиенты", color: "var(--prime-color-chart-1)", hidden: false },
        { id: "renewals", label: "Продления", color: "var(--prime-color-chart-3)", hidden: true },
      ],
    });
    act(() => observers[0]?.(320, 160));
    expect(renderPlot).toHaveBeenLastCalledWith(
      expect.objectContaining({ width: 320, height: 160 }),
    );
  });

  it("height: a number sets the plot height; fill marks the plot and sets none", () => {
    const { rerender } = render(
      <ChartFrame.Root series={SERIES} rows={ROWS}>
        <ChartFrame.Plot data-testid="area" height={200} />
      </ChartFrame.Root>,
    );
    const area = screen.getByTestId("area");
    expect(area.style.getPropertyValue("--chart-frame-plot-height")).toBe("200px");
    expect(area).not.toHaveAttribute("data-height");

    rerender(
      <ChartFrame.Root series={SERIES} rows={ROWS}>
        <ChartFrame.Plot data-testid="area" height="fill" />
      </ChartFrame.Root>,
    );
    expect(area).toHaveAttribute("data-height", "fill");
    expect(area.style.getPropertyValue("--chart-frame-plot-height")).toBe("");
  });

  it("toggles series from the legend with aria-pressed and reports the hidden ids", () => {
    const onHiddenSeriesChange = vi.fn();
    render(<Frame onHiddenSeriesChange={onHiddenSeriesChange} />);
    const legend = screen.getByRole("list", { name: "Ряды графика" });
    const entry = within(legend).getByRole("button", { name: /Новые клиенты/ });
    expect(entry).toHaveAttribute("aria-pressed", "true");
    expect(entry).toHaveTextContent("1 200");
    fireEvent.click(entry);
    expect(entry).toHaveAttribute("aria-pressed", "false");
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith(["new"]);
    fireEvent.click(entry);
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith([]);
  });

  it("follows controlled hiddenSeries", () => {
    function Controlled() {
      const [hidden, setHidden] = React.useState<string[]>([]);
      return (
        <>
          <button type="button" onClick={() => setHidden(["renewals"])}>
            Скрыть продления
          </button>
          <Frame hiddenSeries={hidden} onHiddenSeriesChange={setHidden} />
        </>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Скрыть продления" }));
    expect(screen.getByRole("button", { name: /Продления/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("moves through the legend with roving focus: arrows, Home, End; one tab stop", () => {
    render(<Frame />);
    const [first, second] = screen.getAllByRole("button");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: "End" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "Home" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: " " });
  });

  it("keyboard: Tab enters the legend once, arrows wrap both ways, Enter and Space toggle", async () => {
    const user = userEvent.setup();
    const onHiddenSeriesChange = vi.fn();
    render(
      <ChartFrame.Root series={SERIES} rows={ROWS} onHiddenSeriesChange={onHiddenSeriesChange}>
        <ChartFrame.Header>
          <ChartFrame.Title>Выручка</ChartFrame.Title>
          <ChartFrame.Actions>
            <button type="button">Экспорт</button>
          </ChartFrame.Actions>
        </ChartFrame.Header>
        <ChartFrame.Legend />
      </ChartFrame.Root>,
    );
    const legend = within(screen.getByRole("list", { name: "Ряды графика" }));
    const [first, second] = legend.getAllByRole("button");
    await user.tab();
    expect(screen.getByRole("button", { name: "Экспорт" })).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(second).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(first).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(second).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-pressed", "false");
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith(["renewals"]);
    await user.keyboard(" ");
    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith([]);
    // One stop: the next Tab leaves the legend from the entry focused last.
    await user.tab();
    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(second).toHaveFocus();
  });

  it("a read-only legend names series without buttons", () => {
    render(
      <ChartFrame.Root series={SERIES} rows={ROWS}>
        <ChartFrame.Legend readOnly />
      </ChartFrame.Root>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(within(screen.getByRole("list")).getByText("Продления")).toBeInTheDocument();
  });

  it("loading: aria-busy, Skeletons for the value and the plot, no table", () => {
    const renderPlot = vi.fn(() => <svg data-testid="plot" />);
    render(<Frame state="loading" renderPlot={renderPlot} />);
    expect(screen.getByRole("figure")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("8,4 млн ₽")).toBeNull();
    expect(screen.queryByTestId("plot")).toBeNull();
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByRole("heading", { name: "Выручка" })).toBeInTheDocument();
  });

  it("empty and error take the plot's place; the error retries", async () => {
    const onRetry = vi.fn(() => Promise.resolve());
    const { rerender } = render(<Frame state="empty" onRetry={onRetry} />);
    expect(screen.getByRole("status")).toHaveTextContent("Нет данных за период");
    rerender(<Frame state="error" onRetry={onRetry} />);
    // The headline number is unknown after a failed load: a dash, not the last value.
    expect(screen.queryByText("8,4 млн ₽")).toBeNull();
    expect(screen.getByText("—")).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Не удалось загрузить график");
    await act(async () => {
      fireEvent.click(within(alert).getByRole("button", { name: "Повторить" }));
    });
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("the error without onRetry has no retry button", () => {
    render(<Frame state="error" />);
    expect(within(screen.getByRole("alert")).queryByRole("button")).toBeNull();
  });

  it("swaps states in place: the ready plot comes back after loading", () => {
    function Swap() {
      const [state, setState] = React.useState<ChartFrameState>("loading");
      return (
        <>
          <button type="button" onClick={() => setState("ready")}>
            Готово
          </button>
          <Frame state={state} />
        </>
      );
    }
    render(<Swap />);
    fireEvent.click(screen.getByRole("button", { name: "Готово" }));
    expect(screen.getByTestId("plot")).toBeInTheDocument();
    expect(screen.getByRole("figure")).not.toHaveAttribute("aria-busy");
  });

  it("the table holds the shown series, formatted, named by the title", () => {
    render(<Frame defaultHiddenSeries={["renewals"]} formatValue={(v) => `${v} ₽`} />);
    const table = screen.getByRole("table", { name: "Выручка" });
    const headers = within(table)
      .getAllByRole("columnheader")
      .map((th) => th.textContent);
    expect(headers).toEqual(["Период", "Новые клиенты"]);
    expect(within(table).getByRole("rowheader", { name: "окт" })).toBeInTheDocument();
    expect(within(table).getByText("4200 ₽")).toBeInTheDocument();
  });

  it("the data table comes from the root's rows: no part is needed to expose the data", () => {
    render(
      <ChartFrame.Root series={SERIES} rows={ROWS}>
        <ChartFrame.Plot renderPlot={() => <svg aria-hidden="true" />} />
      </ChartFrame.Root>,
    );
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(ROWS.length + 1);
  });

  it("the table reads a missing value as a dash", () => {
    render(<Frame />);
    const cells = within(screen.getByRole("table")).getAllByRole("cell");
    // Intl groups digits with a no-break space.
    expect(cells.map((td) => td.textContent?.replace(/\s/g, " "))).toEqual([
      "3 900",
      "4 400",
      "4 200",
      "—",
    ]);
  });

  it("the tooltip names rows from the series, formats values and skips hidden series", () => {
    render(
      <ChartFrame.Root series={SERIES} rows={ROWS} defaultHiddenSeries={["renewals"]}>
        <ChartFrame.Tooltip
          label="Неделя 41"
          items={[
            { id: "new", value: 61 },
            { id: "renewals", value: 8 },
          ]}
        />
      </ChartFrame.Root>,
    );
    const tooltip = screen.getByText("Неделя 41").parentElement as HTMLElement;
    expect(within(tooltip).getByText("Новые клиенты")).toBeInTheDocument();
    expect(within(tooltip).getByText("61")).toBeInTheDocument();
    expect(within(tooltip).queryByText("Продления")).toBeNull();
  });

  it("floats the tooltip beside a point of the plot, aria-hidden, and Escape hides it", () => {
    function Floating({ point }: { point: { x: number; y: number } | null }) {
      return (
        <ChartFrame.Root series={SERIES} rows={ROWS}>
          <ChartFrame.Plot data-testid="area">
            <svg />
          </ChartFrame.Plot>
          <ChartFrame.Tooltip point={point} label="Неделя 41" items={[{ id: "new", value: 61 }]} />
        </ChartFrame.Root>
      );
    }
    const { container, rerender } = render(<Floating point={null} />);
    expect(screen.queryByText("Неделя 41")).toBeNull();
    screen.getByTestId("area").getBoundingClientRect = () =>
      ({ left: 100, top: 50, right: 500, bottom: 290, width: 400, height: 240 }) as DOMRect;
    rerender(<Floating point={{ x: 40, y: 100 }} />);
    const tooltip = screen.getByText("Неделя 41").parentElement as HTMLElement;
    // Portaled out of the figure and placed by usePosition: right of the point at its height.
    expect(container.contains(tooltip)).toBe(false);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).toHaveAttribute("data-side", "right");
    expect(tooltip.style.top).toBe("150px");
    const open = () => document.body.querySelector("[data-side][data-state='open']");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(open()).toBeNull();
    // The next point shows it again.
    rerender(<Floating point={{ x: 60, y: 100 }} />);
    expect(open()).toHaveTextContent("Неделя 41");
  });

  it("renders a self-sizing chart from children", () => {
    render(
      <ChartFrame.Root rows={[]}>
        <ChartFrame.Plot height={120} data-testid="area">
          <svg data-testid="self" />
        </ChartFrame.Plot>
      </ChartFrame.Root>,
    );
    expect(screen.getByTestId("self")).toBeInTheDocument();
    expect(screen.getByTestId("area").style.getPropertyValue("--chart-frame-plot-height")).toBe(
      "120px",
    );
  });

  it("parts outside the root throw", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<ChartFrame.Legend />)).toThrow(
      "`ChartFrame.Legend` sub-component must be used inside `ChartFrame.Root`",
    );
  });
});
