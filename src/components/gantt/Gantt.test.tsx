import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { addDays } from "date-fns";
import { ru } from "date-fns/locale";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { read } from "@/test/contract-utils";

import { Gantt, type GanttBar } from "./Gantt";
import {
  applyEdit,
  assignLanes,
  formatSpan,
  headerTiers,
  navigate,
  resolveRange,
  snapHysteresis,
  stickyFloor,
  stickyRound,
  visibleSegment,
} from "./ganttModel";

type Person = { id: string; name: string; bars: GanttBar[] };

const day = (month: number, date: number) => new Date(2026, month - 1, date);
const TODAY = day(7, 8);

const PEOPLE: Person[] = [
  {
    id: "anna",
    name: "Анна Котова",
    bars: [
      { id: "a1", label: "Аудит склада", start: day(7, 6), end: day(7, 11) },
      { id: "a2", label: "Отчёт", start: day(7, 9), end: day(7, 14), tone: "warning" },
      { id: "a3", label: "Релиз", start: day(7, 20), end: day(7, 20) },
    ],
  },
  {
    id: "ilya",
    name: "Илья Гордеев",
    bars: [
      {
        id: "i1",
        label: "Отпуск",
        start: day(7, 13),
        end: day(7, 27),
        color: "purple",
        readOnly: true,
      },
    ],
  },
  { id: "olga", name: "Ольга Белова", bars: [] },
  {
    id: "petr",
    name: "Пётр Соколов",
    bars: [{ id: "p1", label: "Онбординг", start: day(7, 8), end: day(7, 10), progress: 0.5 }],
  },
];

type ChartProps = Partial<React.ComponentProps<typeof Gantt<Person>>>;

function Chart(props: ChartProps) {
  return (
    <Gantt
      aria-label="Загрузка команды"
      rows={PEOPLE}
      getRowKey={(person) => person.id}
      getRowLabel={(person) => person.name}
      getRowBars={(person) => person.bars}
      today={TODAY}
      defaultScale="day"
      {...props}
    />
  );
}

const bar = (name: RegExp) => screen.getByRole("button", { name });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ganttModel", () => {
  it("stacks overlapping bars into lanes and lets a free lane take the next bar", () => {
    const { lanes, count } = assignLanes(PEOPLE[0].bars);
    expect(count).toBe(2);
    expect(lanes.get("a1")).toBe(0);
    expect(lanes.get("a2")).toBe(1);
    expect(lanes.get("a3")).toBe(0);
  });

  it("pads the default range around the bars and today and snaps it to the unit", () => {
    const range = resolveRange(PEOPLE[0].bars, TODAY, "week");
    expect(range.start.getDay()).toBe(1);
    expect(range.start < day(7, 6)).toBe(true);
    expect(range.end > day(7, 20)).toBe(true);
  });

  it("builds months over days and years over months", () => {
    const range = { start: day(6, 29), end: day(7, 6) };
    const tiers = headerTiers("day", range, TODAY, ru);
    expect(tiers.top.map((cell) => cell.text)).toEqual(["06.2026", "07.2026"]);
    expect(tiers.bottom.map((cell) => cell.text)).toEqual(["29", "30", "1", "2", "3", "4", "5"]);
    expect(tiers.bottom.filter((cell) => cell.weekend).map((cell) => cell.text)).toEqual([
      "4",
      "5",
    ]);
    expect(tiers.bottom.filter((cell) => cell.boundary).map((cell) => cell.text)).toEqual(["1"]);
  });

  it("starts a month at the week zoom on its first ISO week, never inside a column", () => {
    // 31 Aug – 6 Sep has its Thursday (3 Sep) in September; 28 Sep – 4 Oct belongs to October.
    const range = { start: day(8, 24), end: day(10, 12) };
    const { top, bottom } = headerTiers("week", range, TODAY, ru);
    expect(top.map((cell) => [cell.text, cell.x, cell.span])).toEqual([
      ["08.2026", 0, 7],
      ["09.2026", 7, 28],
      ["10.2026", 35, 14],
    ]);
    for (const cell of top) expect(bottom.some((week) => week.x === cell.x)).toBe(true);
    expect(bottom.filter((cell) => cell.boundary).map((cell) => cell.text)).toEqual([
      "31–6",
      "28–4",
    ]);
    const years = headerTiers("month", { start: day(11, 1), end: new Date(2027, 2, 1) }, TODAY, ru);
    expect(years.top.map((cell) => [cell.text, cell.x])).toEqual([
      ["2026", 0],
      ["2027", 61],
    ]);
  });

  it("edits by days or units, clamps at one day and never flips, only moves a milestone", () => {
    const dates = { start: day(7, 6), end: day(7, 11) };
    expect(applyEdit(dates, "move", 1, "week")).toEqual({ start: day(7, 13), end: day(7, 18) });
    expect(applyEdit(dates, "end", 1, "day")).toEqual({ start: day(7, 6), end: day(7, 12) });
    // Past the opposite edge: one day, the edges never swap.
    expect(applyEdit(dates, "end", -9, "day")).toEqual({ start: day(7, 6), end: day(7, 7) });
    expect(applyEdit(dates, "start", 1, "month")).toEqual({ start: day(7, 10), end: day(7, 11) });
    expect(applyEdit(dates, "end", 1, "month")).toEqual({ start: day(7, 6), end: day(8, 11) });
    const milestone = { start: day(7, 20), end: day(7, 20) };
    expect(applyEdit(milestone, "end", 2, "day")).toEqual({ start: day(7, 22), end: day(7, 22) });
  });

  it("formats spans with an inclusive last day", () => {
    expect(formatSpan({ start: day(7, 3), end: day(7, 15) }, ru)).toBe("3 – 14 июля");
    expect(formatSpan({ start: day(6, 28), end: day(7, 5) }, ru)).toBe("28 июня – 4 июля");
    expect(formatSpan({ start: day(7, 3), end: day(7, 3) }, ru)).toBe("3 июля");
  });

  it("navigates rows × bars", () => {
    const items = [
      { id: "r0", row: 0, center: -1e9, kind: "row" as const },
      { id: "a", row: 0, center: 2, kind: "bar" as const },
      { id: "b", row: 0, center: 10, kind: "bar" as const },
      { id: "r1", row: 1, center: -1e9, kind: "row" as const },
      { id: "r2", row: 2, center: -1e9, kind: "row" as const },
      { id: "c", row: 2, center: 9, kind: "bar" as const },
    ];
    expect(navigate(items, "a", "ArrowRight", false)).toBe("b");
    expect(navigate(items, "b", "ArrowRight", false)).toBeNull();
    expect(navigate(items, "a", "ArrowLeft", false)).toBe("r0");
    expect(navigate(items, "r0", "ArrowRight", false)).toBe("a");
    // Bars skip rows without bars; row headers walk every row.
    expect(navigate(items, "a", "ArrowDown", false)).toBe("c");
    expect(navigate(items, "r0", "ArrowDown", false)).toBe("r1");
    expect(navigate(items, "c", "ArrowUp", false)).toBe("b");
    expect(navigate(items, "c", "Home", true)).toBe("a");
  });
});

describe("Gantt", () => {
  it("is a labelled grid: a header row, a row header per row and bars named with spoken dates", () => {
    render(<Chart />);
    const grid = screen.getByRole("grid", { name: "Загрузка команды" });
    expect(within(grid).getAllByRole("row")).toHaveLength(PEOPLE.length + 1);
    expect(within(grid).getByRole("columnheader", { name: "Шкала времени" })).toBeInTheDocument();
    expect(within(grid).getByRole("rowheader", { name: "Илья Гордеев" })).toBeInTheDocument();
    expect(bar(/^Аудит склада: 6 июля 2026 — 10 июля 2026$/)).toBeInTheDocument();
    expect(bar(/^Релиз: 20 июля 2026$/)).toHaveAttribute("data-milestone", "true");
    expect(bar(/^Онбординг: .*, выполнено 50%$/)).toHaveAttribute("data-progress", "true");
  });

  it("puts overlapping bars on separate lanes and grows the row", () => {
    render(<Chart />);
    expect(bar(/^Аудит склада/).style.getPropertyValue("--lane")).toBe("0");
    expect(bar(/^Отчёт/).style.getPropertyValue("--lane")).toBe("1");
    const row = screen.getByRole("rowheader", { name: "Анна Котова" }).parentElement;
    expect(row?.style.getPropertyValue("--lanes")).toBe("2");
  });

  it("colors bars by palette hue or by status tone", () => {
    render(<Chart />);
    expect(bar(/^Аудит склада/)).toHaveAttribute("data-color", "blue");
    expect(bar(/^Отпуск/)).toHaveAttribute("data-color", "purple");
    expect(bar(/^Отчёт/)).toHaveAttribute("data-tone", "warning");
    expect(bar(/^Отчёт/)).not.toHaveAttribute("data-color");
  });

  it("selects a bar by click (a native button: Enter and Space click too)", () => {
    const onSelect = vi.fn();
    render(<Chart onSelect={onSelect} />);
    fireEvent.click(bar(/^Отпуск/));
    expect(onSelect).toHaveBeenLastCalledWith(PEOPLE[1].bars[0], PEOPLE[1]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("is one tab stop; arrows move between bars and rows, Home / End to the row ends", () => {
    render(<Chart />);
    const bars = screen
      .getAllByRole("button")
      .filter((node) => node.hasAttribute("data-gantt-bar"));
    expect(bars.filter((node) => node.tabIndex === 0)).toHaveLength(1);
    const audit = bar(/^Аудит склада/);
    expect(audit.tabIndex).toBe(0);
    act(() => audit.focus());
    fireEvent.keyDown(audit, { key: "ArrowRight" });
    expect(bar(/^Отчёт/)).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "End" });
    expect(bar(/^Релиз/)).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(bar(/^Отпуск/)).toHaveFocus();
    // The empty row is skipped.
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(bar(/^Онбординг/)).toHaveFocus();
    expect(bar(/^Онбординг/).tabIndex).toBe(0);
    expect(audit.tabIndex).toBe(-1);
    fireEvent.keyDown(document.activeElement as Element, { key: "Home", ctrlKey: true });
    expect(audit).toHaveFocus();
    // ← from the first bar reaches the row header; ↓ there walks every row, empty ones too.
    fireEvent.keyDown(audit, { key: "ArrowLeft" });
    expect(screen.getByRole("rowheader", { name: "Анна Котова" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(screen.getByRole("rowheader", { name: "Ольга Белова" })).toHaveFocus();
  });

  it("moves with Shift + arrows and changes the end with Ctrl + Shift + arrows", () => {
    const onBarChange = vi.fn();
    render(<Chart onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    expect(audit).toHaveAttribute("aria-keyshortcuts");
    expect(audit).toHaveAccessibleDescription(/Shift \+ стрелки/);
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 7), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    fireEvent.keyDown(audit, { key: "ArrowLeft", shiftKey: true, ctrlKey: true });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 6), end: day(7, 10) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    expect(screen.getByText(/^Аудит склада: 6 июля 2026 — 9 июля 2026$/)).toBeInTheDocument();
  });

  it("edits by a day at every zoom; with Alt by the zoom's unit", () => {
    const onBarChange = vi.fn();
    render(<Chart defaultScale="week" onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 7), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true, altKey: true });
    expect(onBarChange.mock.calls[1][0]).toEqual({ start: day(7, 13), end: day(7, 18) });
    fireEvent.keyDown(audit, { key: "ArrowLeft", shiftKey: true, ctrlKey: true });
    expect(onBarChange.mock.calls[2][0]).toEqual({ start: day(7, 6), end: day(7, 10) });
    fireEvent.keyDown(audit, { key: "ArrowLeft", shiftKey: true, ctrlKey: true, altKey: true });
    // A week back from 11 July passes the start: clamped to one day.
    expect(onBarChange.mock.calls[3][0]).toEqual({ start: day(7, 6), end: day(7, 7) });
  });

  it("holds a pending change busy and glides back with an announcement when it is rejected", async () => {
    let reject: () => void = () => {};
    const onBarChange = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = () => fail(new Error("conflict"));
        }),
    );
    render(<Chart onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const x = audit.style.getPropertyValue("--x");
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(audit).toHaveAttribute("aria-busy", "true");
    expect(audit).toHaveAttribute("data-pending", "true");
    expect(audit.style.getPropertyValue("--x")).toBe(String(Number(x) + 1));
    // A pending bar takes no further edits.
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(onBarChange).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(audit).not.toHaveAttribute("aria-busy");
    expect(audit.style.getPropertyValue("--x")).toBe(x);
    expect(screen.getByText("Сроки не изменены: Аудит склада")).toBeInTheDocument();
  });

  it("keeps read-only charts and bars still", () => {
    const onBarChange = vi.fn();
    const { rerender } = render(<Chart onBarChange={onBarChange} />);
    fireEvent.keyDown(bar(/^Отпуск/), { key: "ArrowRight", shiftKey: true });
    expect(bar(/^Отпуск/)).not.toHaveAttribute("aria-keyshortcuts");
    rerender(<Chart onBarChange={onBarChange} readOnly />);
    fireEvent.keyDown(bar(/^Аудит склада/), { key: "ArrowRight", shiftKey: true });
    expect(bar(/^Аудит склада/)).not.toHaveAttribute("aria-describedby");
    expect(onBarChange).not.toHaveBeenCalled();
  });

  it("drags a bar by whole days and does not select it", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element,
    ) {
      const width = this.getAttribute("aria-label") === "Шкала времени" ? 280 : 0;
      return { width, height: 0, left: 0, right: width, top: 0, bottom: 0 } as DOMRect;
    });
    const onBarChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Chart
        range={{ start: day(7, 6), end: day(8, 3) }}
        onBarChange={onBarChange}
        onSelect={onSelect}
      />,
    );
    const audit = bar(/^Аудит склада/);
    fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 131, pointerType: "mouse" });
    expect(audit).toHaveAttribute("data-dragging", "move");
    // The bar follows the pointer exactly; the dates snap to whole days.
    expect(audit.style.getPropertyValue("--x")).toBe("3.1");
    expect(audit).toHaveAccessibleName(/^Аудит склада: 9 июля 2026 — 13 июля 2026$/);
    fireEvent.pointerUp(audit, { clientX: 131, pointerType: "mouse" });
    fireEvent.click(audit);
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 9), end: day(7, 14) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("resizes from the end grip; Escape drops a drag", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element,
    ) {
      const width = this.getAttribute("aria-label") === "Шкала времени" ? 280 : 0;
      return { width, height: 0, left: 0, right: width, top: 0, bottom: 0 } as DOMRect;
    });
    const onBarChange = vi.fn();
    render(<Chart range={{ start: day(7, 6), end: day(8, 3) }} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 70, pointerType: "mouse" });
    expect(audit.style.getPropertyValue("--span")).toBe("7");
    fireEvent.pointerUp(audit, { clientX: 70, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 6), end: day(7, 13) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    fireEvent.pointerDown(audit, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 90, pointerType: "mouse" });
    fireEvent.keyDown(audit, { key: "Escape" });
    expect(audit).not.toHaveAttribute("data-dragging");
    fireEvent.pointerUp(audit, { clientX: 90, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledTimes(1);
  });

  it("switches the zoom from the toolbar and draws its header", () => {
    const onScaleChange = vi.fn();
    render(<Chart onScaleChange={onScaleChange} />);
    expect(screen.getByRole("radio", { name: "День" })).toBeChecked();
    expect(document.querySelector('[data-today="true"]')).toHaveTextContent("8");
    fireEvent.click(screen.getByRole("radio", { name: "Месяц" }));
    expect(onScaleChange).toHaveBeenCalledWith("month");
    expect(screen.getByRole("radio", { name: "Месяц" })).toBeChecked();
    expect(document.querySelector('[data-today="true"]')).toHaveTextContent("июль");
  });

  it("shows skeleton rows while loading and an empty state without rows", () => {
    const { rerender } = render(<Chart rows={[]} loading />);
    expect(screen.getByText("Загрузка графика…")).toBeInTheDocument();
    expect(document.querySelectorAll("[data-gantt-bar]")).toHaveLength(0);
    rerender(<Chart rows={[]} />);
    expect(screen.getByText("Нет задач за этот период.")).toBeInTheDocument();
    rerender(<Chart rows={PEOPLE} loading />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true");
    expect(bar(/^Аудит склада/)).not.toHaveAttribute("aria-keyshortcuts");
  });

  it("closes a bar's tooltip when the chart scrolls, by scrollbar, wheel or touch", () => {
    vi.useFakeTimers();
    try {
      timelineLayout({ left: 300, right: 400 });
      render(<Chart />);
      const scroller = screen.getByRole("grid").parentElement as HTMLElement;
      const open = (name: RegExp) => {
        act(() => bar(name).focus());
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        expect(screen.getByRole("tooltip")).toHaveTextContent(/Аудит склада|Отпуск/);
      };
      open(/^Аудит склада/);
      fireEvent.scroll(scroller);
      expect(screen.queryByRole("tooltip")).toBeNull();
      act(() => bar(/^Аудит склада/).blur());
      open(/^Отпуск/);
      fireEvent.wheel(scroller);
      expect(screen.queryByRole("tooltip")).toBeNull();
      act(() => bar(/^Отпуск/).blur());
      open(/^Аудит склада/);
      fireEvent.touchMove(scroller);
      expect(screen.queryByRole("tooltip")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("adds renderBarTooltip under the title and the dates line, which always stay", () => {
    vi.useFakeTimers();
    try {
      timelineLayout({ left: 300, right: 400 });
      const renderBarTooltip = vi.fn((item: GanttBar, person: Person) => (
        <span>
          {item.id} · {person.name} · 16 ч
        </span>
      ));
      render(<Chart renderBarTooltip={renderBarTooltip} />);
      act(() => bar(/^Аудит склада/).focus());
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      const tip = screen.getByRole("tooltip");
      expect(tip).toHaveTextContent("Аудит склада");
      expect(tip).toHaveTextContent(formatSpan(PEOPLE[0].bars[0], ru));
      expect(tip).toHaveTextContent("a1 · Анна Котова · 16 ч");
      expect(renderBarTooltip).toHaveBeenCalledWith(PEOPLE[0].bars[0], PEOPLE[0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("opens a row from its header: click, Enter, Space; never from a control inside it", () => {
    const onRowClick = vi.fn();
    render(
      <Chart
        onRowClick={onRowClick}
        renderRow={(person) => (
          <>
            {person.name}
            <button type="button">Написать</button>
          </>
        )}
      />,
    );
    const header = screen.getByRole("rowheader", { name: /Ольга Белова/ });
    expect(header).toHaveAttribute("data-clickable");
    fireEvent.click(header);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0]).toBe(PEOPLE[2]);
    expect(onRowClick.mock.calls[0][1].type).toBe("click");
    act(() => header.focus());
    fireEvent.keyDown(header, { key: "Enter" });
    fireEvent.keyDown(header, { key: " " });
    expect(onRowClick).toHaveBeenCalledTimes(3);
    expect(onRowClick.mock.calls[2][1].type).toBe("keydown");
    // A held key, a control inside the header and a bar never open the row.
    fireEvent.keyDown(header, { key: "Enter", repeat: true });
    fireEvent.click(within(header).getByRole("button", { name: "Написать" }));
    fireEvent.click(bar(/^Аудит склада/));
    expect(onRowClick).toHaveBeenCalledTimes(3);
  });

  it("makes the row header a link with getRowHref: the grid stop, plain clicks to onRowClick", () => {
    const onRowClick = vi.fn((_person: Person, event: React.SyntheticEvent) =>
      event.preventDefault(),
    );
    render(<Chart getRowHref={(person) => `#/team/${person.id}`} onRowClick={onRowClick} />);
    const header = screen.getByRole("rowheader", { name: "Анна Котова" });
    const link = within(header).getByRole("link", { name: "Анна Котова" });
    expect(link).toHaveAttribute("href", "#/team/anna");
    // ← from the first bar reaches the link: it is the row header's stop in the grid.
    const audit = bar(/^Аудит склада/);
    act(() => audit.focus());
    fireEvent.keyDown(audit, { key: "ArrowLeft" });
    expect(link).toHaveFocus();
    expect(link.tabIndex).toBe(0);
    fireEvent.keyDown(link, { key: "ArrowDown" });
    expect(
      within(screen.getByRole("rowheader", { name: "Илья Гордеев" })).getByRole("link"),
    ).toHaveFocus();
    fireEvent.click(link);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0]).toBe(PEOPLE[0]);
    // A modified click is the browser's (new tab); Space clicks the link like Enter.
    fireEvent.click(link, { metaKey: true });
    fireEvent.click(link, { ctrlKey: true });
    expect(onRowClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(link, { key: " " });
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("sizes the grid, head, rows and backdrop from the axis length, not from the viewport", () => {
    // jsdom has no layout: the contract lives in the CSS. A max-content grid let engines drop the
    // fixed axis basis, and the head fill, row lines and washes stopped at the viewport width.
    const css = read("src/components/gantt/Gantt.module.css");
    const rule = (selector: string) =>
      css.match(new RegExp(`^${selector.replace(".", "\\.")} \\{([^}]*)\\}`, "m"))?.[1] ?? "";
    expect(rule(".grid")).toMatch(
      /width: max\(100%, calc\(var\(--gantt-label-w\) \+ var\(--gantt-axis-w\)\)\);/,
    );
    expect(rule(".grid")).toMatch(
      /--gantt-axis-w: calc\(var\(--gantt-days\) \* var\(--gantt-day\)\);/,
    );
    expect(css).toMatch(
      /^\.backdropWash,\n\.backdropLines \{[^}]*\bwidth: var\(--gantt-axis-w\);/m,
    );
    for (const selector of [".axis", ".track"]) {
      expect(rule(selector), selector).toMatch(/\bwidth: var\(--gantt-axis-w\);/);
    }
    for (const selector of [".corner", ".rowHeader"]) {
      expect(rule(selector), selector).toMatch(/\bwidth: var\(--gantt-label-w\);/);
    }
    render(<Chart range={{ start: day(7, 6), end: day(8, 3) }} />);
    expect(screen.getByRole("grid").style.getPropertyValue("--gantt-days")).toBe("28");
  });

  it("passes the ref to the surface and aria-label to the grid", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Chart
        ref={(element) => {
          node = element;
        }}
        className="custom"
      />,
    );
    expect(node).toHaveClass("custom");
    expect(node).not.toHaveAttribute("aria-label");
  });
});

/** Layout for jsdom: the axis is `days × 10px`, the chart's scroller 600 × 300 px. */
function mockLayout(days: number) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const width = this.getAttribute("aria-label") === "Шкала времени" ? days * 10 : 0;
    return { width, height: 0, left: 0, right: width, top: 0, bottom: 0 } as DOMRect;
  });
  const isScroller = (node: Element) => node.firstElementChild?.getAttribute("role") === "grid";
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 300 : 0;
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 600 : 0;
  });
}

const RANGE = { start: day(7, 6), end: day(8, 3) };
const track = (name: string) =>
  screen.getByRole("rowheader", { name }).nextElementSibling as HTMLElement;

describe("Gantt creating", () => {
  it("offers nothing to create without onBarCreate or when read-only", () => {
    const { rerender } = render(<Chart />);
    expect(track("Ольга Белова")).not.toHaveAttribute("data-creatable");
    rerender(<Chart onBarCreate={vi.fn()} readOnly />);
    expect(track("Ольга Белова")).not.toHaveAttribute("data-creatable");
    rerender(<Chart onBarCreate={vi.fn()} />);
    expect(track("Ольга Белова")).toHaveAttribute("data-creatable", "true");
  });

  it("creates one scale unit on a double-click in empty space", () => {
    mockLayout(28);
    const onBarCreate = vi.fn();
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    fireEvent.doubleClick(track("Ольга Белова"), { clientX: 25 });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 9) }, PEOPLE[2]);
  });

  it("draws a range with a ghost, and Escape drops it", () => {
    mockLayout(28);
    const onBarCreate = vi.fn();
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 20, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 55, pointerType: "mouse" });
    const ghost = row.querySelector('[data-state="drawing"]') as HTMLElement;
    expect(ghost.style.getPropertyValue("--x")).toBe("2");
    expect(ghost.style.getPropertyValue("--span")).toBe("4");
    expect(screen.getByRole("tooltip")).toHaveTextContent("8 – 11 июля");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(row.querySelector('[data-state="drawing"]')).toBeNull();
    fireEvent.pointerUp(row, { clientX: 55, pointerType: "mouse" });
    expect(onBarCreate).not.toHaveBeenCalled();

    fireEvent.pointerDown(row, { clientX: 20, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 55, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 55, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 12) }, PEOPLE[2]);
  });

  it("holds a busy ghost while pending; a refusal fades it out and is announced", async () => {
    mockLayout(28);
    let reject: () => void = () => {};
    const onBarCreate = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = () => fail(new Error("busy"));
        }),
    );
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.doubleClick(row, { clientX: 25 });
    expect(row.querySelector('[data-state="pending"]')).not.toBeNull();
    await act(async () => reject());
    // Tests run with reduced motion: the fade is instant, the ghost leaves at once.
    expect(row.querySelector('[data-state="pending"]')).toBeNull();
    expect(screen.getByText("Задача не создана")).toBeInTheDocument();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(row.querySelector("[data-state]")).toBeNull();
  });

  it("creates with N: at today on a row header, after the focused bar on a bar", () => {
    const onBarCreate = vi.fn();
    render(<Chart onBarCreate={onBarCreate} />);
    const header = screen.getByRole("rowheader", { name: "Ольга Белова" });
    expect(header).toHaveAttribute("aria-keyshortcuts", "N");
    expect(header).toHaveAccessibleDescription("N — создать задачу");
    fireEvent.keyDown(header, { key: "n", code: "KeyN" });
    expect(onBarCreate).toHaveBeenLastCalledWith({ start: TODAY, end: day(7, 9) }, PEOPLE[2]);
    fireEvent.keyDown(bar(/^Аудит склада/), { key: "т", code: "KeyN" });
    expect(onBarCreate).toHaveBeenLastCalledWith({ start: day(7, 11), end: day(7, 12) }, PEOPLE[0]);
  });
});

describe("Gantt virtualization", () => {
  const MANY = Array.from({ length: 2000 }, (_, index) => ({
    id: `p${index}`,
    name: `Сотрудник ${String(index + 1).padStart(4, "0")}`,
    bars: [
      {
        id: `b${index}`,
        label: `Проект ${index + 1}`,
        start: addDays(day(1, 1), (index * 37) % 700),
        end: addDays(day(1, 1), ((index * 37) % 700) + 5),
      },
    ],
  }));
  const YEARS = { start: day(1, 1), end: new Date(2028, 0, 1) };

  it("renders only the rows and header cells in view and keeps aria-rowcount", () => {
    mockLayout(730);
    render(<Chart rows={MANY} range={YEARS} />);
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-rowcount", "2001");
    const rendered = within(grid).getAllByRole("row");
    expect(rendered.length).toBeLessThan(40);
    expect(rendered.length).toBeGreaterThan(5);
    expect(document.querySelectorAll('[data-tier="bottom"] > span').length).toBeLessThan(200);
  });

  it("moves keyboard focus into a row that is not rendered yet", () => {
    mockLayout(730);
    render(<Chart rows={MANY} range={YEARS} />);
    const first = document.querySelector("[data-gantt-bar]") as HTMLElement;
    act(() => first.focus());
    fireEvent.keyDown(first, { key: "End", ctrlKey: true });
    const focused = document.activeElement as HTMLElement;
    expect(focused).toHaveAttribute("aria-label", expect.stringMatching(/^Проект 2000:/));
    expect(focused.closest('[role="row"]')).toHaveAttribute("aria-rowindex", "2001");
  });
});

/**
 * The timeline for tooltip tests: a 600 × 300 scroller at the origin, a label column of 200 and a
 * header of 50 (sticky parts), and every bar at `bar` horizontally, in the first row.
 */
function timelineLayout(bar: { left: number; right: number }) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const box = (left: number, right: number, top: number, bottom: number) =>
      ({ left, right, top, bottom, width: right - left, height: bottom - top }) as DOMRect;
    if (this.hasAttribute("data-gantt-bar")) return box(bar.left, bar.right, 60, 88);
    if (this.getAttribute("role") === "columnheader" && !this.hasAttribute("aria-label")) {
      return box(0, 200, 0, 50);
    }
    if (this.getAttribute("role") === "row" && this.getAttribute("aria-rowindex") === "1") {
      return box(0, 600, 0, 50);
    }
    return box(0, 0, 0, 0);
  });
  const isScroller = (node: Element) => node.firstElementChild?.getAttribute("role") === "grid";
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 300 : 0;
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 600 : 0;
  });
}

describe("Gantt tooltips on the visible part of a bar", () => {
  const openTip = (name: RegExp) => {
    act(() => bar(name).focus());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  };

  it("clips the anchor to the timeline: the centre of what is visible", () => {
    const viewport = { left: 200, top: 50, right: 600, bottom: 300 };
    // Half under the label column: the visible segment is 200–260, its centre 230.
    const segment = visibleSegment({ left: 140, right: 260, top: 60, bottom: 88 }, viewport);
    expect(segment).toEqual({ left: 200, right: 260, top: 60, bottom: 88, width: 60, height: 28 });
    expect(((segment?.left ?? 0) + (segment?.right ?? 0)) / 2).toBe(230);
    expect(visibleSegment({ left: 40, right: 180, top: 60, bottom: 88 }, viewport)).toBeNull();
  });

  it("shows the tooltip of a bar partly under the label column", () => {
    vi.useFakeTimers();
    try {
      timelineLayout({ left: 140, right: 260 });
      render(<Chart />);
      openTip(/^Аудит склада/);
      expect(screen.getByRole("tooltip")).toHaveTextContent("Аудит склада");
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows no tooltip for a bar hidden under the label column or nearly so", () => {
    vi.useFakeTimers();
    try {
      timelineLayout({ left: 40, right: 210 });
      render(<Chart />);
      openTip(/^Аудит склада/);
      expect(screen.queryByRole("tooltip")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Gantt day-precise editing", () => {
  // 10 px per day on the axis, at every zoom (the axis width follows the range).
  const WEEKS = { start: day(7, 6), end: day(9, 28) };

  it.each([
    ["week", WEEKS, 84],
    ["month", { start: day(7, 1), end: new Date(2027, 6, 1) }, 365],
  ] as const)("resizes by one day at the %s zoom", (scale, range, days) => {
    mockLayout(days);
    const onBarChange = vi.fn();
    render(<Chart defaultScale={scale} range={range} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 112, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("6 – 11 июля · 6 дн.");
    expect(document.querySelector('[class*="dayGuide"]')).not.toBeNull();
    fireEvent.pointerUp(audit, { clientX: 112, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 6), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("holds the snapped day with hysteresis and snaps to the unit with Alt", () => {
    mockLayout(84);
    const onBarChange = vi.fn();
    render(<Chart defaultScale="week" range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const name = () => audit.getAttribute("aria-label");
    fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 116, pointerType: "mouse" });
    expect(name()).toMatch(/: 8 июля 2026 — 12 июля 2026$/);
    // Back to 1.4 days: still day 2 (within half a day plus the hysteresis).
    fireEvent.pointerMove(audit, { clientX: 114, pointerType: "mouse" });
    expect(name()).toMatch(/: 8 июля 2026 — 12 июля 2026$/);
    fireEvent.pointerMove(audit, { clientX: 108, pointerType: "mouse" });
    expect(name()).toMatch(/: 7 июля 2026 — 11 июля 2026$/);
    // Alt: whole weeks.
    fireEvent.pointerMove(audit, { clientX: 160, pointerType: "mouse", altKey: true });
    expect(name()).toMatch(/: 13 июля 2026 — 17 июля 2026$/);
    fireEvent.pointerUp(audit, { clientX: 160, pointerType: "mouse", altKey: true });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 13), end: day(7, 18) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("clamps a resize at the opposite edge: one day, never flipped", () => {
    mockLayout(84);
    const onBarChange = vi.fn();
    render(<Chart defaultScale="week" range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="start"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 300, pointerType: "mouse" });
    expect(audit.style.getPropertyValue("--span")).toBe("1");
    fireEvent.pointerUp(audit, { clientX: 300, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 10), end: day(7, 11) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("draws a new bar in whole days at the week zoom", () => {
    mockLayout(84);
    const onBarCreate = vi.fn();
    render(<Chart defaultScale="week" range={WEEKS} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 25, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 55, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("8 – 11 июля · 4 дн.");
    fireEvent.pointerUp(row, { clientX: 55, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 12) }, PEOPLE[2]);
  });

  it("on touch, a long press picks the bar up; moving earlier leaves it to scrolling", () => {
    vi.useFakeTimers();
    try {
      mockLayout(84);
      const onBarChange = vi.fn();
      render(<Chart defaultScale="week" range={WEEKS} onBarChange={onBarChange} />);
      const audit = bar(/^Аудит склада/);
      fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "touch" });
      fireEvent.pointerMove(audit, { clientX: 130, pointerType: "touch" });
      expect(audit).not.toHaveAttribute("data-dragging");
      fireEvent.pointerUp(audit, { clientX: 130, pointerType: "touch" });
      fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "touch" });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      fireEvent.pointerMove(audit, { clientX: 130, pointerType: "touch" });
      expect(audit).toHaveAttribute("data-dragging", "move");
      fireEvent.pointerUp(audit, { clientX: 130, pointerType: "touch" });
      expect(onBarChange.mock.calls[0][0]).toEqual({ start: day(7, 9), end: day(7, 14) });
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps a sub-day hysteresis: a few px per day never jitter", () => {
    expect(snapHysteresis(4)).toBe(0.4);
    expect(snapHysteresis(40)).toBe(0.15);
    expect(stickyRound(1.6, 2, 0.15)).toBe(2);
    expect(stickyRound(1.3, 2, 0.15)).toBe(1);
    expect(stickyFloor(3.05, 2, 0.15)).toBe(2);
    expect(stickyFloor(3.2, 2, 0.15)).toBe(3);
  });
});
