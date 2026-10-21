import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addDays } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cssRule, cssValue } from "@/test/css";

import { Gantt, type GanttBar, type GanttCategory } from "./Gantt";
import styles from "./Gantt.module.css";
import { GanttCategoriesMenu } from "./GanttCategoriesMenu";
import {
  applyEdit,
  assignLanes,
  DAY_STEP,
  formatSpan,
  lanesHeight,
  laneTops,
  navigate,
  placeGhost,
  resolveRange,
  snapEdit,
  snapHysteresis,
  stickyFloor,
  stickyRound,
  visibleSegment,
} from "./ganttModel";
import { headStepOf } from "./timeHead";

const SEVEN_DAYS = headStepOf("7days");
const MONTH = headStepOf("month");

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
        edit: "none",
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
      defaultZoom="day"
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
    const { lanes, looks } = assignLanes(PEOPLE[0].bars);
    expect(looks).toEqual(["m", "m"]);
    expect(lanes.get("a1")).toBe(0);
    expect(lanes.get("a2")).toBe(1);
    expect(lanes.get("a3")).toBe(0);
  });

  it("pads the default range a month around the bars and today, from the 1st, at least a year", () => {
    const range = resolveRange(PEOPLE[0].bars, TODAY);
    expect(range.start).toEqual(day(6, 1));
    expect(range.end).toEqual(new Date(2027, 5, 1));
    // A given range is kept as given, in whole days.
    expect(resolveRange([], TODAY, { start: day(7, 6), end: day(8, 3) })).toEqual({
      start: day(7, 6),
      end: day(8, 3),
    });
  });

  it("lands a drag with Alt on the nearest tick of the head's step, counted from the 1st", () => {
    const origin = day(7, 6);
    const dates = { start: day(7, 9), end: day(7, 11) };
    // Moved 4.4 days at the 7-day step (1, 8, 15, 22, 29): the start goes to the 15th, the length stays.
    expect(snapEdit(dates, "move", 4.4, SEVEN_DAYS, origin)).toEqual({
      start: day(7, 15),
      end: day(7, 17),
    });
    // The 29th's cell is 3 days: past its middle the end goes to the next month's 1st.
    expect(snapEdit({ start: day(7, 20), end: day(7, 29) }, "end", 2, SEVEN_DAYS, origin)).toEqual({
      start: day(7, 20),
      end: day(8, 1),
    });
    // The end lands on a month line; never shorter than a day.
    expect(snapEdit(dates, "end", 20, MONTH, origin)).toEqual({ start: day(7, 9), end: day(8, 1) });
    expect(snapEdit(dates, "end", -5, SEVEN_DAYS, origin)).toEqual({
      start: day(7, 9),
      end: day(7, 10),
    });
  });

  it("edits by days or ticks, clamps at one day and never flips, only moves a milestone", () => {
    const dates = { start: day(7, 6), end: day(7, 11) };
    // A tick of the 7-day step from the 6th is the 8th; back, the 1st. The length stays.
    expect(applyEdit(dates, "move", 1, SEVEN_DAYS)).toEqual({ start: day(7, 8), end: day(7, 13) });
    expect(applyEdit(dates, "move", -1, SEVEN_DAYS)).toEqual({ start: day(7, 1), end: day(7, 6) });
    expect(applyEdit(dates, "end", 1, DAY_STEP)).toEqual({ start: day(7, 6), end: day(7, 12) });
    // Past the opposite edge: one day, the edges never swap.
    expect(applyEdit(dates, "end", -9, DAY_STEP)).toEqual({ start: day(7, 6), end: day(7, 7) });
    expect(applyEdit(dates, "start", 1, MONTH)).toEqual({ start: day(7, 10), end: day(7, 11) });
    expect(applyEdit(dates, "end", 1, MONTH)).toEqual({ start: day(7, 6), end: day(8, 1) });
    const milestone = { start: day(7, 20), end: day(7, 20) };
    expect(applyEdit(milestone, "end", 2, DAY_STEP)).toEqual({
      start: day(7, 22),
      end: day(7, 22),
    });
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
    // Lane tops: the row's padding, then a lane of the bar height and the lane gap.
    expect(bar(/^Аудит склада/).style.insetBlockStart).toBe("8px");
    expect(bar(/^Отчёт/).style.insetBlockStart).toBe("40px");
    const row = screen.getByRole("rowheader", { name: "Анна Котова" }).parentElement;
    expect(row?.style.getPropertyValue("--row-h")).toBe("76px");
  });

  it("colors bars by palette hue or by status tone", () => {
    render(<Chart />);
    expect(bar(/^Аудит склада/)).toHaveAttribute("data-color", "blue");
    expect(bar(/^Отпуск/)).toHaveAttribute("data-color", "purple");
    expect(bar(/^Отчёт/)).toHaveAttribute("data-tone", "warning");
    expect(bar(/^Отчёт/)).not.toHaveAttribute("data-color");
  });

  it("selects a bar by click (a native button: Enter and Space click too)", () => {
    const onItemOpen = vi.fn();
    render(<Chart onItemOpen={onItemOpen} />);
    fireEvent.click(bar(/^Отпуск/));
    expect(onItemOpen).toHaveBeenLastCalledWith(PEOPLE[1].bars[0], PEOPLE[1]);
    expect(onItemOpen).toHaveBeenCalledTimes(1);
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

  it("edits by a day at every zoom; with Alt by a tick of the head's step", () => {
    const onBarChange = vi.fn();
    // 4 px a day: the head counts 7 days from each 1st (1, 8, 15…), Alt lands on those ticks.
    render(<Chart defaultZoom="month" onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 7), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true, altKey: true });
    // From the 7th the next tick is the 8th; the length stays.
    expect(onBarChange.mock.calls[1][0]).toEqual({ start: day(7, 8), end: day(7, 13) });
    fireEvent.keyDown(audit, { key: "ArrowLeft", shiftKey: true, ctrlKey: true });
    expect(onBarChange.mock.calls[2][0]).toEqual({ start: day(7, 6), end: day(7, 10) });
    fireEvent.keyDown(audit, { key: "ArrowLeft", shiftKey: true, ctrlKey: true, altKey: true });
    // The end goes back to the tick before the 11th: the 8th.
    expect(onBarChange.mock.calls[3][0]).toEqual({ start: day(7, 6), end: day(7, 8) });
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
    const x = audit.getAttribute("data-x");
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(audit).toHaveAttribute("aria-busy", "true");
    expect(audit).toHaveAttribute("data-pending", "true");
    expect(audit.getAttribute("data-x")).toBe(String(Number(x) + 1));
    // A pending bar takes no further edits.
    fireEvent.keyDown(audit, { key: "ArrowRight", shiftKey: true });
    expect(onBarChange).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(audit).not.toHaveAttribute("aria-busy");
    expect(audit.getAttribute("data-x")).toBe(x);
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

  it("lets a bar with edit end change only its end: no move, no start grip, end keys only", () => {
    mockLayout();
    const rental: GanttBar = {
      id: "r1",
      label: "Аренда",
      start: day(7, 6),
      end: day(7, 11),
      edit: "end",
    };
    const handover: GanttBar = {
      id: "r2",
      label: "Передача",
      start: day(7, 20),
      end: day(7, 20),
      edit: "end",
    };
    const fleet: Person[] = [{ id: "e1", name: "E-101", bars: [rental, handover] }];
    const onBarChange = vi.fn();
    render(
      <Chart
        rows={fleet}
        range={{ start: day(7, 6), end: day(8, 3) }}
        defaultZoom={20}
        onBarChange={onBarChange}
      />,
    );
    const node = bar(/^Аренда/);
    expect(node).toHaveAttribute("data-editable", "end");
    expect(node.getAttribute("aria-keyshortcuts")).not.toMatch(/(^| )Shift\+Arrow/);
    expect(node).toHaveAccessibleDescription(/^Ctrl \+ Shift \+ стрелки меняют окончание/);
    expect(node.querySelector('[data-handle="start"]')).toBeNull();
    // Shift + arrows (with or without Alt) would move the start: nothing happens.
    fireEvent.keyDown(node, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(node, { key: "ArrowLeft", shiftKey: true, altKey: true });
    expect(onBarChange).not.toHaveBeenCalled();
    fireEvent.keyDown(node, { key: "ArrowRight", shiftKey: true, ctrlKey: true });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 6), end: day(7, 12) },
      rental,
      fleet[0],
    );
    // The body does not drag: a press and a move leave it where it is.
    fireEvent.pointerDown(node, { clientX: 20, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(node, { clientX: 100, pointerType: "mouse" });
    expect(node).not.toHaveAttribute("data-dragging");
    fireEvent.pointerUp(node, { clientX: 100, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledTimes(1);
    // The end grip resizes.
    const grip = node.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(node, { clientX: 90, pointerType: "mouse" });
    expect(node).toHaveAttribute("data-dragging", "end");
    fireEvent.pointerUp(node, { clientX: 90, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 6), end: day(7, 13) },
      rental,
      fleet[0],
    );
    expect(onBarChange).toHaveBeenCalledTimes(2);
    // A milestone has no end of its own: with edit end it stays put.
    const milestone = bar(/^Передача/);
    expect(milestone).not.toHaveAttribute("data-editable");
    expect(milestone).not.toHaveAttribute("aria-keyshortcuts");
    fireEvent.keyDown(milestone, { key: "ArrowRight", shiftKey: true, ctrlKey: true });
    expect(onBarChange).toHaveBeenCalledTimes(2);
  });

  it("on touch, a bar with edit end is not picked up by a long press", () => {
    vi.useFakeTimers();
    try {
      mockLayout();
      const rental: GanttBar = {
        id: "r1",
        label: "Аренда",
        start: day(7, 6),
        end: day(7, 11),
        edit: "end",
      };
      const onBarChange = vi.fn();
      render(
        <Chart
          rows={[{ id: "e1", name: "E-101", bars: [rental] }]}
          range={{ start: day(7, 6), end: day(8, 3) }}
          onBarChange={onBarChange}
        />,
      );
      const node = bar(/^Аренда/);
      fireEvent.pointerDown(node, { clientX: 20, button: 0, pointerType: "touch" });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      fireEvent.pointerMove(node, { clientX: 60, pointerType: "touch" });
      expect(node).not.toHaveAttribute("data-dragging");
      fireEvent.pointerUp(node, { clientX: 60, pointerType: "touch" });
      expect(onBarChange).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("drags a bar by whole days and does not select it", () => {
    mockLayout();
    const onBarChange = vi.fn();
    const onItemOpen = vi.fn();
    render(
      <Chart
        range={{ start: day(7, 6), end: day(8, 3) }}
        defaultZoom={20}
        onBarChange={onBarChange}
        onItemOpen={onItemOpen}
      />,
    );
    const audit = bar(/^Аудит склада/);
    fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 162, pointerType: "mouse" });
    expect(audit).toHaveAttribute("data-dragging", "move");
    // The bar follows the pointer exactly; the dates snap to whole days.
    expect(audit.getAttribute("data-x")).toBe("3.1");
    expect(audit).toHaveAccessibleName(/^Аудит склада: 9 июля 2026 — 13 июля 2026$/);
    fireEvent.pointerUp(audit, { clientX: 162, pointerType: "mouse" });
    fireEvent.click(audit);
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 9), end: day(7, 14) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    expect(onItemOpen).not.toHaveBeenCalled();
  });

  it("resizes from the end grip; Escape drops a drag", () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(
      <Chart
        range={{ start: day(7, 6), end: day(8, 3) }}
        defaultZoom={20}
        onBarChange={onBarChange}
      />,
    );
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 90, pointerType: "mouse" });
    expect(audit.getAttribute("data-span")).toBe("7");
    fireEvent.pointerUp(audit, { clientX: 90, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 6), end: day(7, 13) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
    fireEvent.pointerDown(audit, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 130, pointerType: "mouse" });
    fireEvent.keyDown(audit, { key: "Escape" });
    expect(audit).not.toHaveAttribute("data-dragging");
    fireEvent.pointerUp(audit, { clientX: 130, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledTimes(1);
  });

  it("is one head row: the zoom selector over the names, the dates over the axis", async () => {
    const user = userEvent.setup();
    const onZoomChange = vi.fn();
    render(<Chart onZoomChange={onZoomChange} />);
    const head = within(screen.getByRole("grid")).getAllByRole("row")[0];
    const [names, timeline] = within(head).getAllByRole("columnheader");
    expect(names).toHaveAccessibleName("Название");
    expect(timeline).toHaveAccessibleName("Шкала времени");
    // No title and no toolbar row: the selector is the head of the names.
    const selector = within(names).getByRole("combobox", { name: "Масштаб: День" });
    expect(selector).toHaveTextContent("День");
    expect(document.querySelector(`.${styles.toolbar}`)).toBeNull();
    // Today is a pill on the today line, its date in full; no label carries the accent.
    const pill = () => document.querySelector(`.${styles.todayPill}`);
    // Among the day numbers the pill says the day; the month is named at the start edge.
    expect(pill()).toHaveTextContent(/^8$/);
    expect(pill()?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(timeline).toHaveAccessibleDescription("Сегодня, 8 июля 2026");
    await user.click(selector);
    await user.click(screen.getByRole("option", { name: "Месяц" }));
    expect(onZoomChange).toHaveBeenCalledWith("month");
    expect(selector).toHaveAccessibleName("Масштаб: Месяц");
    expect(pill()).toHaveTextContent(/^8$/);
    expect(document.querySelector("[data-accent]")).toBeNull();
    // The next tests start from the keyboard: the clicks left the last input a press.
    await user.keyboard("{Shift}{Tab}");
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
      render(<Chart range={RANGE} />);
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

  it("makes the row header a link with getRowHref: the stop of the row in the grid", async () => {
    const user = userEvent.setup();
    render(<Chart getRowHref={(person) => `#/team/${person.id}`} />);
    const header = screen.getByRole("rowheader", { name: "Анна Котова" });
    const link = within(header).getByRole("link", { name: "Анна Котова" });
    expect(link).toHaveAttribute("href", "#/team/anna");
    // ← from the first bar reaches the link; ↓ and ↑ walk the row links.
    act(() => bar(/^Аудит склада/).focus());
    await user.keyboard("{ArrowLeft}");
    expect(link).toHaveFocus();
    expect(link.tabIndex).toBe(0);
    await user.keyboard("{ArrowDown}");
    const next = within(screen.getByRole("rowheader", { name: "Илья Гордеев" })).getByRole("link");
    expect(next).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(link).toHaveFocus();
  });

  it("sends the plain clicks of a row link to onRowClick; Space clicks it like Enter", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn((_person: Person, event: React.SyntheticEvent) =>
      event.preventDefault(),
    );
    render(<Chart getRowHref={(person) => `#/team/${person.id}`} onRowClick={onRowClick} />);
    const link = within(screen.getByRole("rowheader", { name: "Анна Котова" })).getByRole("link");
    fireEvent.click(link);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0]).toBe(PEOPLE[0]);
    // A modified click is the browser's (new tab).
    fireEvent.click(link, { metaKey: true });
    fireEvent.click(link, { ctrlKey: true });
    expect(onRowClick).toHaveBeenCalledTimes(1);
    act(() => link.focus());
    await user.keyboard(" ");
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("is one Tab stop: Tab enters the grid at its stop and leaves it at once", async () => {
    const user = userEvent.setup();
    render(<Chart />);
    // The toolbar comes first: the zoom switch and «Сегодня».
    const audit = bar(/^Аудит склада/);
    while (document.activeElement !== audit) {
      await user.tab();
      if (document.activeElement === document.body) break;
    }
    expect(audit).toHaveFocus();
    await user.tab();
    const focused = document.activeElement;
    expect(focused === document.body || !screen.getByRole("grid").contains(focused)).toBe(true);
  });

  it("takes the host tier without its own size; the bar text is one tier down", () => {
    render(
      <ControlSizeProvider value="l">
        <Chart />
      </ControlSizeProvider>,
    );
    const root = screen.getByRole("grid").closest("[data-depth]");
    expect(root).toHaveAttribute("data-size", "l");
    const track = bar(/^Аудит склада/).closest("[role='gridcell']");
    expect(track).toHaveAttribute("data-size", "m");
  });

  it("leaves time to the time core: the columns clip their layers, nothing scrolls sideways", () => {
    // jsdom has no layout: the contract lives in the CSS. The time column of the head, of every
    // row and of the backdrop clips a layer the core places and slides; a scroller there would
    // let a focused bar scroll it out from under the camera.
    const file = "src/components/gantt/Gantt.module.css";
    for (const selector of [".axis", ".track", ".backdrop"]) {
      expect(cssValue(cssRule(file, selector), "overflow"), selector).toBe("clip");
    }
    expect(cssValue(cssRule(file, ".grid"), "width")).toBe("100%");
    expect(cssValue(cssRule(file, ".viewport"), "touch-action")).toBe("pan-y");
    for (const selector of [".corner", ".rowHeader"]) {
      expect(cssValue(cssRule(file, selector), "width"), selector).toBe("var(--gantt-label-w)");
    }
    // A bar's place and length never ease after the grid: only the press is a transition.
    expect(cssValue(cssRule(file, ".bar"), "transition")).not.toMatch(/width|inset|left/);
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

/**
 * A scroller 300 px tall whose width is not measured yet, with every box at the origin: the time
 * core lays the whole axis out from day 0 with no stops, so a pointer `clientX` px into a track is
 * `clientX / dayPx` days from the axis start, at any zoom a test asks for.
 */
function mockLayout() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }) as DOMRect,
  );
  const isScroller = (node: Element) => node.firstElementChild?.getAttribute("role") === "grid";
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 300 : 0;
  });
}

const CATEGORIES: GanttCategory[] = [
  { id: "work", label: "Работа", color: "teal" },
  { id: "away", label: "Отсутствие", color: "orange" },
];

/** The team with a category on every bar: Илья is away, the rest is work. */
const CATEGORIZED: Person[] = PEOPLE.map((person) => ({
  ...person,
  bars: person.bars.map((each) => ({
    ...each,
    category: person.id === "ilya" ? "away" : "work",
  })),
}));

describe("Gantt categories", () => {
  it("colours a bar by its category unless it has a hue or a tone, and lists them in a legend", () => {
    render(<Chart rows={CATEGORIZED} categories={CATEGORIES} legend />);
    expect(bar(/^Аудит склада/)).toHaveAttribute("data-color", "teal");
    expect(bar(/^Отпуск/)).toHaveAttribute("data-color", "purple");
    expect(bar(/^Отчёт/)).toHaveAttribute("data-tone", "warning");
    const legend = screen.getByRole("group", { name: "Обозначения" });
    expect(within(legend).getByText("Работа")).toBeInTheDocument();
    expect(within(legend).getByText("Отсутствие")).toBeInTheDocument();
  });

  it("has no legend without categories", () => {
    render(<Chart legend />);
    expect(screen.queryByRole("group", { name: "Обозначения" })).toBeNull();
  });

  it("keeps the hues and the hiding of categories without the legend, which is off by default", () => {
    const { container } = render(
      <Chart rows={CATEGORIZED} categories={CATEGORIES} hiddenCategories={["away"]} />,
    );
    expect(screen.queryByRole("group", { name: "Обозначения" })).toBeNull();
    // No legend and no toolbar: no tool row above the chart at all.
    expect(container.querySelector(`.${styles.toolbar}`)).toBeNull();
    expect(bar(/^Аудит склада/)).toHaveAttribute("data-color", "teal");
    expect(screen.queryByRole("button", { name: /^Отпуск/ })).toBeNull();
  });

  it("leaves out the bars and the legend entry of a hidden category; the lanes close up", () => {
    render(<Chart rows={CATEGORIZED} categories={CATEGORIES} legend hiddenCategories={["work"]} />);
    expect(screen.queryByRole("button", { name: /^Аудит склада/ })).toBeNull();
    expect(bar(/^Отпуск/)).toBeInTheDocument();
    const anna = screen.getByRole("rowheader", { name: "Анна Котова" }).parentElement;
    expect(anna?.style.getPropertyValue("--row-h")).toBe("44px");
    const legend = screen.getByRole("group", { name: "Обозначения" });
    expect(within(legend).queryByText("Работа")).toBeNull();
    expect(within(legend).getByText("Отсутствие")).toBeInTheDocument();
  });

  it("GanttCategoriesMenu hides a category from the keyboard and «По умолчанию» brings it back", async () => {
    const user = userEvent.setup();
    function View() {
      const [hidden, setHidden] = React.useState<readonly string[]>([]);
      return (
        <>
          <GanttCategoriesMenu
            categories={CATEGORIES}
            hiddenCategories={hidden}
            onHiddenCategoriesChange={setHidden}
          />
          <Chart rows={CATEGORIZED} categories={CATEGORIES} legend hiddenCategories={hidden} />
        </>
      );
    }
    render(<View />);
    const trigger = screen.getByRole("button", { name: "Вид 2" });
    expect(trigger).toHaveAttribute("data-variant", "soft");
    act(() => trigger.focus());
    await user.keyboard("{Enter}");
    expect(screen.getByRole("group", { name: "На графике" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "По умолчанию" })).toBeNull();
    act(() => screen.getByRole("menuitemcheckbox", { name: "Отсутствие" }).focus());
    await user.keyboard(" ");
    expect(screen.getByRole("menuitemcheckbox", { name: "Отсутствие" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.queryByRole("button", { name: /^Отпуск/ })).toBeNull();
    const legend = screen.getByRole("group", { name: "Обозначения" });
    expect(within(legend).queryByText("Отсутствие")).toBeNull();
    expect(screen.getByRole("button", { name: "Вид 1" })).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "По умолчанию" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(bar(/^Отпуск/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Вид 2" })).toBeInTheDocument();
  });
});

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

  it("creates one unit the head names on a double-click in empty space", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    fireEvent.doubleClick(track("Ольга Белова"), { clientX: 100 });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 9) }, PEOPLE[2]);
  });

  it("draws a range with a ghost, and Escape drops it", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 80, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 220, pointerType: "mouse" });
    const ghost = row.querySelector('[data-state="drawing"]') as HTMLElement;
    expect(ghost.getAttribute("data-x")).toBe("2");
    expect(ghost.getAttribute("data-span")).toBe("4");
    expect(screen.getByRole("tooltip")).toHaveTextContent("8 – 11 июля");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(row.querySelector('[data-state="drawing"]')).toBeNull();
    fireEvent.pointerUp(row, { clientX: 220, pointerType: "mouse" });
    expect(onBarCreate).not.toHaveBeenCalled();

    fireEvent.pointerDown(row, { clientX: 80, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 220, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 220, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 12) }, PEOPLE[2]);
  });

  it("holds a busy ghost while pending; a refusal fades it out and is announced", async () => {
    mockLayout();
    let reject: () => void = () => {};
    const onBarCreate = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = () => fail(new Error("busy"));
        }),
    );
    render(<Chart range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.doubleClick(row, { clientX: 100 });
    expect(row.querySelector('[data-state="pending"]')).not.toBeNull();
    await act(async () => reject());
    // Tests run with reduced motion: the fade is instant, the ghost leaves at once.
    expect(row.querySelector('[data-state="pending"]')).toBeNull();
    expect(screen.getByText("Задача не создана")).toBeInTheDocument();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(row.querySelector("[data-state]")).toBeNull();
  });

  it("shows the phantom of a bar under the mouse: one unit, in bar geometry, by whole units", () => {
    mockLayout();
    render(<Chart range={RANGE} onBarCreate={vi.fn()} />);
    const row = track("Ольга Белова");
    const phantom = () => row.querySelector<HTMLElement>('[data-state="phantom"]');
    fireEvent.pointerMove(row, { clientX: 100, pointerType: "mouse" });
    const shown = phantom();
    expect(shown).toHaveClass(styles.ghost);
    expect(shown).toHaveAttribute("aria-hidden", "true");
    expect(shown).toHaveTextContent("Новая задача");
    expect(shown?.getAttribute("data-x")).toBe("2");
    expect(shown?.getAttribute("data-span")).toBe("1");
    expect(shown?.style.insetBlockStart).toBe("8px");
    // Within the same day it stays; the next day steps it, the same element.
    fireEvent.pointerMove(row, { clientX: 112, pointerType: "mouse" });
    expect(phantom()?.getAttribute("data-x")).toBe("2");
    fireEvent.pointerMove(row, { clientX: 124, pointerType: "mouse" });
    expect(phantom()).toBe(shown);
    expect(shown?.getAttribute("data-x")).toBe("3");
    fireEvent.pointerLeave(row, { pointerType: "mouse" });
    expect(phantom()).toBeNull();
    // Touch has no hover: no phantom until a long press picks the cell up.
    fireEvent.pointerMove(row, { clientX: 100, pointerType: "touch" });
    expect(phantom()).toBeNull();
  });

  it("grows the phantom into the drawn range: the same element", () => {
    mockLayout();
    render(<Chart range={RANGE} onBarCreate={vi.fn()} />);
    const row = track("Ольга Белова");
    fireEvent.pointerMove(row, { clientX: 100, pointerType: "mouse" });
    const phantom = row.querySelector('[data-state="phantom"]');
    fireEvent.pointerDown(row, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 220, pointerType: "mouse" });
    const drawing = row.querySelector<HTMLElement>('[data-state="drawing"]');
    expect(drawing).toBe(phantom);
    expect(drawing?.getAttribute("data-span")).toBe("4");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(row.querySelector('[data-state="drawing"]')).toBeNull();
  });

  it("shows no phantom over a bar, nor where it would need a lane of its own", () => {
    mockLayout();
    render(<Chart range={RANGE} onBarCreate={vi.fn()} />);
    const anna = track("Анна Котова");
    fireEvent.pointerMove(bar(/^Аудит склада/), { clientX: 100, pointerType: "mouse" });
    expect(anna.querySelector(`.${styles.ghost}`)).toBeNull();
    // 10 July: both of Анна's lanes are taken; the row never grows on hover.
    fireEvent.pointerMove(anna, { clientX: 180, pointerType: "mouse" });
    expect(anna.querySelector(`.${styles.ghost}`)).toBeNull();
    fireEvent.pointerMove(anna, { clientX: 660, pointerType: "mouse" });
    expect(anna.querySelector('[data-state="phantom"]')).not.toBeNull();
  });

  it("shows the phantom where N creates while a row header has keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Chart onBarCreate={vi.fn()} />);
    await user.keyboard("{Tab}");
    const olga = screen.getByRole("rowheader", { name: "Ольга Белова" });
    act(() => olga.focus());
    fireEvent.focus(olga);
    const phantom = track("Ольга Белова").querySelector<HTMLElement>('[data-state="phantom"]');
    expect(phantom).not.toBeNull();
    fireEvent.blur(olga);
    expect(track("Ольга Белова").querySelector('[data-state="phantom"]')).toBeNull();
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

  it("renders only the rows in view and the time laid out around it; keeps aria-rowcount", () => {
    cameraLayout();
    render(<Chart rows={MANY} range={YEARS} />);
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-rowcount", "2001");
    const rendered = within(grid).getAllByRole("row");
    expect(rendered.length).toBeLessThan(40);
    expect(rendered.length).toBeGreaterThan(5);
    // Two years at 40 px a day: five screens of 400 px are laid out, 50 days of dates and lines.
    const head = screen.getByRole("columnheader", { name: "Шкала времени" });
    expect(head.querySelectorAll(`.${styles.headLabel}`).length).toBeLessThanOrEqual(60);
    expect(document.querySelectorAll(`.${styles.gridLine}`).length).toBeLessThanOrEqual(51);
  });

  it("moves keyboard focus into a row that is not rendered yet", () => {
    mockLayout();
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
 * A chart laid out like a browser: a 600 × 300 scroller at the origin and a names column of 200, so
 * the visible axis is the 400 px from x 200 — the head's time column and every row's track. Those
 * boxes never move: the time core slides the layers inside them.
 */
function cameraLayout() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const box = (left: number, right: number) =>
      ({ left, right, width: right - left, top: 0, bottom: 0, height: 0 }) as DOMRect;
    if (this.getAttribute("aria-label") === "Название") return box(0, 200);
    if (this.getAttribute("aria-label") === "Шкала времени") return box(200, 600);
    if (this.getAttribute("role") === "gridcell") return box(200, 600);
    if (this.firstElementChild?.getAttribute("role") === "grid") return box(0, 600);
    return box(0, 0);
  });
  const isScroller = (node: Element) => node.firstElementChild?.getAttribute("role") === "grid";
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 600 : 0;
  });
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isScroller(this) ? 300 : 0;
  });
}

// July – September 2026: 92 days, 3680 px at the day preset; the whole axis fits at 400 / 92 px.
const QUARTER = { start: day(7, 1), end: day(10, 1) };
const DAY_MS = 86_400_000;
const scroller = () => screen.getByRole("grid").parentElement as HTMLElement;
const root = () => scroller().closest("[data-depth]") as HTMLElement;
/** The backdrop's layer: the scene it is laid out in, and the slide written onto it. */
const backdropLayer = () => document.querySelector(`.${styles.backdrop} > .${styles.layer}`);
/** The camera as the screen shows it: the length of a day and the day at the axis start edge. */
const view = () => {
  const layer = backdropLayer() as HTMLElement;
  const dayPx = Number(layer.dataset.dayPx);
  const shift = Number(/translate\((-?[\d.e+-]+)px/.exec(layer.style.transform)?.[1] ?? 0);
  return { dayPx, start: Number(layer.dataset.origin) - shift / dayPx };
};
const dayLength = () => view().dayPx;
/** The date under `offset` px into the visible axis, with its fraction of a day, in ms. */
const dateAt = (offset: number) => {
  const { dayPx, start } = view();
  return QUARTER.start.getTime() + (start + offset / dayPx) * DAY_MS;
};
/** Within a hundredth of a px at the zoom standing now. */
const sameMoment = (a: number, b: number) =>
  expect(Math.abs(a - b)).toBeLessThan((DAY_MS / dayLength()) * 0.01);
/** A sideways wheel: the time core slides the view by `deltaX` px. */
const slide = (deltaX: number) => {
  const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaX });
  act(() => {
    scroller().dispatchEvent(event);
  });
  return event;
};
/** Slides so the axis start edge stands `px` from the axis start. */
const slideTo = (px: number) => slide(px - view().start * dayLength());
/** Every time layer carries the one slide: the head's dates, the backdrop, every row. */
const layerTransforms = () =>
  [
    ...document.querySelectorAll(
      `[data-gantt-head] > .${styles.labels}, .${styles.backdrop} > .${styles.layer}, [data-gantt-layer]`,
    ),
  ].map((node) => (node as HTMLElement).style.transform);
/** A preset from the selector in the head. */
const choose = async (user: ReturnType<typeof userEvent.setup>, name: string) => {
  await user.click(screen.getByRole("combobox", { name: /^Масштаб/ }));
  await user.click(screen.getByRole("option", { name }));
};

describe("Gantt zoom keeps the moment in view", () => {
  afterEach(() => {
    fireEvent.keyDown(document, { key: "Tab" });
  });

  it("opens with today a third into the view", () => {
    cameraLayout();
    render(<Chart range={QUARTER} />);
    sameMoment(dateAt(400 / 3), day(7, 8).getTime() + DAY_MS / 2);
  });

  it("keeps the day in the middle across presets, with no drift", async () => {
    const user = userEvent.setup();
    cameraLayout();
    render(<Chart range={QUARTER} />);
    slideTo(600);
    // A pan at rest settles onto a whole device pixel (≤ half a pixel): the day to keep is read
    // after it, so a slow machine and a fast one compare the same view.
    await new Promise((resolve) => setTimeout(resolve, 200));
    const chosen = dateAt(200);
    const settledPx = view().start * 40;
    expect(Math.abs(chosen - day(7, 21).getTime())).toBeLessThan(DAY_MS / 40);

    // A preset glides the camera over a motion token: wait for it to settle, not for the click.
    await choose(user, "Неделя");
    await waitFor(() => {
      expect(dayLength()).toBe(16);
      sameMoment(dateAt(200), chosen);
    });
    await choose(user, "День");
    await waitFor(() => {
      expect(view().start * 40).toBeCloseTo(settledPx, 6);
      sameMoment(dateAt(200), chosen);
    });
  });

  it("returns to the chosen day after a zoom where the whole axis fits", () => {
    cameraLayout();
    const onZoomChange = vi.fn();
    const { rerender } = render(<Chart range={QUARTER} zoom="day" onZoomChange={onZoomChange} />);
    slideTo(600);

    // Controlled: the owner zooms to months; the axis fits, read through the lower stop.
    rerender(<Chart range={QUARTER} zoom="month" onZoomChange={onZoomChange} />);
    expect(dayLength()).toBeCloseTo(400 / 92);
    expect(view().start).toBe(0);
    rerender(<Chart range={QUARTER} zoom="day" onZoomChange={onZoomChange} />);
    expect(view().start * 40).toBeCloseTo(600, 6);
  });

  it("slides the dates, the grid and every row by one transform, rendering nothing", () => {
    cameraLayout();
    render(<Chart range={QUARTER} />);
    const audit = bar(/^Аудит склада/);
    const placed = audit.getAttribute("data-left");
    const before = layerTransforms();
    const from = view().start;
    expect(before.length).toBeGreaterThan(PEOPLE.length);
    expect(new Set(before).size).toBe(1);
    // A sideways swipe is the chart's: the page never takes it for «back».
    expect(slide(37).defaultPrevented).toBe(true);
    const after = layerTransforms();
    expect(after.length).toBe(before.length);
    expect(new Set(after).size).toBe(1);
    expect(after[0]).not.toBe(before[0]);
    expect(view().start - from).toBeCloseTo(37 / 40, 9);
    // The bar was not laid out again: the layer moved, not the bar.
    expect(audit.getAttribute("data-left")).toBe(placed);
  });
});

describe("Gantt zoom gestures", () => {
  afterEach(() => {
    vi.useRealTimers();
    // The fingers left the last input a press: the next tests start from the keyboard.
    fireEvent.keyDown(document, { key: "Tab" });
  });
  /** A trackpad pinch step at `clientX`: Chrome's ctrl + wheel. */
  const trackpad = (deltaY: number, clientX = 400) => {
    const event = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      deltaY,
      clientX,
    });
    act(() => {
      scroller().dispatchEvent(event);
    });
    return event;
  };
  const frame = () => act(() => vi.advanceTimersToNextFrame());
  /** The wheel went still: the gesture ends (at once: tests run with reduced motion). */
  const release = () => act(() => vi.advanceTimersByTime(500));

  function setup(props: ChartProps = {}) {
    vi.useFakeTimers();
    cameraLayout();
    const onZoomChange = vi.fn();
    render(<Chart range={QUARTER} onZoomChange={onZoomChange} {...props} />);
    slideTo(600);
    return { onZoomChange };
  }

  it("zooms live around the cursor: the date under it stays exactly, the head takes the step", () => {
    setup();
    // 600 + 200 px into a 40 px axis: 21 July.
    const under = dateAt(200);
    expect(under).toBe(day(7, 21).getTime());
    expect(root()).toHaveAttribute("data-step", "day");
    expect(trackpad(30).defaultPrevented).toBe(true);
    // Gathered: the frame lays it out.
    expect(dayLength()).toBe(40);
    frame();
    // A trackpad pinch: e^(−30 × 0.039) of 40 px — the 1st, 8th, 15th… are numbered now, days still drawn.
    expect(dayLength()).toBeCloseTo(40 * Math.exp(-1.17));
    expect(root()).toHaveAttribute("data-step", "7days");
    sameMoment(dateAt(200), under);
    // The bars are placed in the same frame, on the px of their days.
    const audit = bar(/^Аудит склада/);
    expect(Number(audit.dataset.right) - Number(audit.dataset.left)).toBeCloseTo(
      5 * dayLength(),
      0,
    );
  });

  it("cross-fades the dates to a new rung, both layers placed and slid by the live camera", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
    try {
      setup();
      // The first frame is on screen: from now on a step change is a zoom's, and it fades.
      frame();
      trackpad(30);
      frame();
      const layers = [...document.querySelectorAll<HTMLElement>("[data-gantt-head] [data-step]")];
      expect(layers.map((layer) => [layer.dataset.step, layer.dataset.state])).toEqual([
        ["day", "closed"],
        ["7days", undefined],
      ]);
      // The leaving numbers are not a still copy: they stand on the live camera, the same layer.
      expect(layers[0].parentElement).toBe(layers[1].parentElement);
      act(() => vi.advanceTimersByTime(1000));
      expect(document.querySelectorAll("[data-gantt-head] [data-step]")).toHaveLength(1);
      // One kind of label throughout: a day's number.
      const texts = [...document.querySelectorAll(`[data-gantt-head] .${styles.headLabel}`)].map(
        (node) => node.textContent ?? "",
      );
      expect(
        texts.every((text) => /^(\d{1,2}|1[а-яё]{3}(\d{4})?|[А-ЯЁ][а-яё]{2})$/.test(text)),
      ).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("stops at the top step and at the whole axis in view", () => {
    setup();
    trackpad(-200);
    frame();
    expect(dayLength()).toBe(96);
    trackpad(2000);
    frame();
    expect(dayLength()).toBeCloseTo(400 / 92);
    expect(view().start).toBe(0);
    expect(root()).toHaveAttribute("data-step", "7days");
  });

  it("commits the zoom where the hand left it: «Свой» between presets, a preset within reach", () => {
    const { onZoomChange } = setup();
    const under = dateAt(200);
    trackpad(10);
    frame();
    release();
    const left = 40 * Math.exp(-0.39);
    expect(onZoomChange).toHaveBeenLastCalledWith(expect.closeTo(left, 5));
    expect(screen.getByRole("combobox", { name: "Масштаб: Свой" })).toHaveTextContent("Свой");
    expect(screen.getByText("Масштаб: Свой")).toBeInTheDocument();
    sameMoment(dateAt(200), under);

    // Pinched on out to 3 % off the week preset: it comes to rest on «Неделя».
    trackpad(Math.log(left / (16 * 1.03)) / 0.039);
    frame();
    release();
    expect(onZoomChange).toHaveBeenLastCalledWith("week");
    expect(dayLength()).toBe(16);
    expect(screen.getByRole("combobox", { name: "Масштаб: Неделя" })).toBeInTheDocument();
    sameMoment(dateAt(200), under);
  });

  it("zooms with two fingers around the point between them", () => {
    const { onZoomChange } = setup();
    const touch = (pointerId: number, clientX: number) => ({
      pointerId,
      pointerType: "touch",
      clientX,
      clientY: 100,
    });
    fireEvent.pointerDown(scroller(), touch(1, 350));
    fireEvent.pointerDown(scroller(), touch(2, 450));
    // 100 → 40 px apart: 40 × 0.4 = 16 px, the week preset.
    fireEvent.pointerMove(scroller(), touch(1, 380));
    fireEvent.pointerMove(scroller(), touch(2, 420));
    frame();
    expect(dayLength()).toBeCloseTo(16, 9);
    fireEvent.pointerUp(scroller(), touch(2, 420));
    // Lifted on the preset: it rests on it exactly.
    expect(dayLength()).toBe(16);
    expect(onZoomChange).toHaveBeenCalledExactlyOnceWith("week");
    sameMoment(dateAt(200), day(7, 21).getTime());
  });

  it("zooms by a drag along the dates: down closer, up back, sideways along", () => {
    const { onZoomChange } = setup();
    const timeline = screen.getByRole("columnheader", { name: "Шкала времени" });
    const under = dateAt(200);
    fireEvent.pointerDown(timeline, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 400,
      clientY: 20,
    });
    fireEvent.pointerMove(timeline, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 400,
      clientY: 120,
    });
    frame();
    expect(dayLength()).toBeCloseTo(40 * Math.exp(0.6));
    sameMoment(dateAt(200), under);
    // Sideways the day travels with the hand.
    fireEvent.pointerMove(timeline, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 450,
      clientY: 120,
    });
    sameMoment(dateAt(250), under);
    fireEvent.pointerUp(timeline, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 450,
      clientY: 120,
    });
    expect(onZoomChange).toHaveBeenLastCalledWith(expect.closeTo(40 * Math.exp(0.6), 5));
  });

  it("zooms around the middle with + and −", () => {
    const { onZoomChange } = setup();
    const middle = dateAt(200);
    const audit = bar(/^Отпуск/);
    act(() => audit.focus());
    fireEvent.keyDown(audit, { key: "+" });
    expect(onZoomChange).toHaveBeenLastCalledWith(50);
    expect(dayLength()).toBe(50);
    sameMoment(dateAt(200), middle);
    fireEvent.keyDown(audit, { key: "-" });
    expect(onZoomChange).toHaveBeenLastCalledWith("day");
    expect(screen.getByText("Масштаб: День")).toBeInTheDocument();
    sameMoment(dateAt(200), middle);
  });

  it("leaves a vertical wheel to the rows; one finger slides the view, never zooms", () => {
    setup();
    // A new swipe: the sideways one that placed the view is over.
    act(() => vi.advanceTimersByTime(200));
    const wheel = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 40 });
    scroller().dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
    const from = view().start;
    fireEvent.pointerDown(scroller(), { pointerId: 1, pointerType: "touch", clientX: 300 });
    fireEvent.pointerMove(scroller(), { pointerId: 1, pointerType: "touch", clientX: 290 });
    fireEvent.pointerMove(scroller(), { pointerId: 1, pointerType: "touch", clientX: 200 });
    frame();
    expect(dayLength()).toBe(40);
    // The day under the finger stays under it: 100 px of travel, 2.5 days later.
    expect(view().start - from).toBeCloseTo(100 / 40, 9);
    fireEvent.pointerUp(scroller(), { pointerId: 1, pointerType: "touch", clientX: 200 });
  });

  it("cancels a long press that one of the fingers began", () => {
    const onBarChange = vi.fn();
    setup({ onBarChange });
    const audit = bar(/^Отпуск/);
    fireEvent.pointerDown(audit, { pointerId: 1, clientX: 380, button: 0, pointerType: "touch" });
    fireEvent.pointerDown(scroller(), { pointerId: 2, clientX: 480, pointerType: "touch" });
    act(() => vi.advanceTimersByTime(500));
    fireEvent.pointerMove(audit, { pointerId: 1, clientX: 300, pointerType: "touch" });
    expect(audit).not.toHaveAttribute("data-dragging");
  });
});

describe("Gantt today off screen", () => {
  it("shows «Сегодня» at the edge where today went and brings it back", async () => {
    const user = userEvent.setup();
    cameraLayout();
    render(<Chart range={QUARTER} />);
    // The first view: today a third into the axis, no button.
    expect(screen.queryByRole("button", { name: "К сегодня" })).toBeNull();
    slideTo(2000);
    const jump = screen.getByRole("button", { name: "К сегодня" });
    expect(jump).toHaveTextContent("Сегодня");
    expect(jump.closest("[data-edge]")).toHaveAttribute("data-edge", "start");
    // The start edge cue: more of the axis lies before the view.
    expect(root()).toHaveAttribute("data-overflow-start", "true");
    await user.click(jump);
    // The jump glides the camera over a motion token: wait for it to settle, not for the click.
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "К сегодня" })).toBeNull();
      // Today (8 July) is a third into the visible axis again.
      sameMoment(dateAt(400 / 3), day(7, 8).getTime() + DAY_MS / 2);
    });
    slideTo(0);
    expect(screen.queryByRole("button", { name: "К сегодня" })).toBeNull();
    expect(root()).not.toHaveAttribute("data-overflow-start");
    expect(root()).toHaveAttribute("data-overflow-end", "true");
    // Past today at the end edge, the button points there.
    slideTo(3680 - 400);
    expect(
      screen.getByRole("button", { name: "К сегодня" }).closest("[data-edge]"),
    ).toHaveAttribute("data-edge", "start");
    expect(root()).not.toHaveAttribute("data-overflow-end");
    fireEvent.keyDown(document, { key: "Tab" });
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
    if (this.getAttribute("aria-label") === "Название") return box(0, 200, 0, 50);
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

describe("Gantt lands on the grid it draws", () => {
  // 20 px a day draws days (a drag lands on days); 10 px draws weeks (a drag lands on Mondays).
  const WEEKS = { start: day(7, 6), end: day(9, 28) };

  it("resizes by a day where the grid draws days", () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(<Chart defaultZoom={20} range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 124, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("6 – 11 июля · 6 дн.");
    // The days are drawn: no guide needed.
    expect(document.querySelector(`.${styles.dayGuide}`)).toBeNull();
    fireEvent.pointerUp(audit, { clientX: 124, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 6), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("lands a resize on whole days even zoomed out to the years, the tooltip saying the days", () => {
    mockLayout();
    const onBarChange = vi.fn();
    // A px a day: a year in a screen; the drag still lands on days, no coarse grid.
    render(<Chart defaultZoom={1} range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 106, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("6 – 16 июля · 11 дн.");
    expect(document.querySelector(`.${styles.dayGuide}`)).toBeNull();
    fireEvent.pointerMove(audit, { clientX: 107, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("6 – 17 июля · 12 дн.");
    fireEvent.pointerUp(audit, { clientX: 107, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 6), end: day(7, 18) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("lands on the nearest tick of the head's step with Alt, a guide marking it", () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(<Chart defaultZoom={10} range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="end"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse", altKey: true });
    // The end (the 11th) pulled 2.5 days on with Alt: the head counts 1, 8, 15 — the 15th is nearest.
    fireEvent.pointerMove(audit, { clientX: 125, pointerType: "mouse", altKey: true });
    expect(document.querySelector(`.${styles.dayGuide}`)).not.toBeNull();
    // Without Alt, the same hand lands on the day.
    fireEvent.pointerMove(audit, { clientX: 121, pointerType: "mouse" });
    expect(document.querySelector(`.${styles.dayGuide}`)).toBeNull();
    expect(audit).toHaveAccessibleName(/: 6 июля 2026 — 12 июля 2026$/);
    fireEvent.pointerMove(audit, { clientX: 125, pointerType: "mouse", altKey: true });
    fireEvent.pointerUp(audit, { clientX: 125, pointerType: "mouse", altKey: true });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 6), end: day(7, 15) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("holds the snapped day with hysteresis, so a few px a day never jitter", () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(<Chart defaultZoom={20} range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const name = () => audit.getAttribute("aria-label");
    fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 132, pointerType: "mouse" });
    expect(name()).toMatch(/: 8 июля 2026 — 12 июля 2026$/);
    // Back to 1.4 days: still day 2 (within half a day plus the hysteresis).
    fireEvent.pointerMove(audit, { clientX: 128, pointerType: "mouse" });
    expect(name()).toMatch(/: 8 июля 2026 — 12 июля 2026$/);
    fireEvent.pointerMove(audit, { clientX: 116, pointerType: "mouse" });
    expect(name()).toMatch(/: 7 июля 2026 — 11 июля 2026$/);
    fireEvent.pointerUp(audit, { clientX: 116, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 7), end: day(7, 12) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("clamps a resize at the opposite edge: one day, never flipped", () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(<Chart defaultZoom={20} range={WEEKS} onBarChange={onBarChange} />);
    const audit = bar(/^Аудит склада/);
    const grip = audit.querySelector('[data-handle="start"]') as Element;
    fireEvent.pointerDown(grip, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(audit, { clientX: 300, pointerType: "mouse" });
    expect(audit.getAttribute("data-span")).toBe("1");
    fireEvent.pointerUp(audit, { clientX: 300, pointerType: "mouse" });
    expect(onBarChange).toHaveBeenCalledWith(
      { start: day(7, 10), end: day(7, 11) },
      PEOPLE[0].bars[0],
      PEOPLE[0],
    );
  });

  it("draws a new bar in whole days at every zoom, in whole cells of the head's step with Alt", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    const { unmount } = render(<Chart defaultZoom={20} range={WEEKS} onBarCreate={onBarCreate} />);
    let row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 50, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 110, pointerType: "mouse" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("8 – 11 июля · 4 дн.");
    fireEvent.pointerUp(row, { clientX: 110, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenLastCalledWith({ start: day(7, 8), end: day(7, 12) }, PEOPLE[2]);
    unmount();
    render(<Chart defaultZoom={10} range={WEEKS} onBarCreate={onBarCreate} />);
    row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 25, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 85, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 85, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenLastCalledWith({ start: day(7, 8), end: day(7, 15) }, PEOPLE[2]);
    // With Alt, from the 8th's cell (8–14) to the 19th's (15–21): the head counts from the 1st.
    fireEvent.pointerDown(row, { clientX: 25, button: 0, pointerType: "mouse", altKey: true });
    fireEvent.pointerMove(row, { clientX: 135, pointerType: "mouse", altKey: true });
    fireEvent.pointerUp(row, { clientX: 135, pointerType: "mouse", altKey: true });
    expect(onBarCreate).toHaveBeenLastCalledWith({ start: day(7, 8), end: day(7, 22) }, PEOPLE[2]);
  });

  it("on touch, a long press picks the bar up; moving earlier leaves it to scrolling", () => {
    vi.useFakeTimers();
    try {
      mockLayout();
      const onBarChange = vi.fn();
      render(<Chart defaultZoom={20} range={WEEKS} onBarChange={onBarChange} />);
      const audit = bar(/^Аудит склада/);
      fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "touch" });
      fireEvent.pointerMove(audit, { clientX: 160, pointerType: "touch" });
      expect(audit).not.toHaveAttribute("data-dragging");
      fireEvent.pointerUp(audit, { clientX: 160, pointerType: "touch" });
      fireEvent.pointerDown(audit, { clientX: 100, button: 0, pointerType: "touch" });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      fireEvent.pointerMove(audit, { clientX: 160, pointerType: "touch" });
      expect(audit).toHaveAttribute("data-dragging", "move");
      fireEvent.pointerUp(audit, { clientX: 160, pointerType: "touch" });
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

describe("Gantt creating: the look follows the gesture", () => {
  it("hovers one day at the week zoom, draws a real bar by whole days either way, creates on release", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    // 16 px a day, the day lines drawn: the phantom is one day.
    render(<Chart defaultZoom="week" range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    const ghost = () => row.querySelector<HTMLElement>(`.${styles.ghost}`);
    fireEvent.pointerMove(row, { clientX: 40, pointerType: "mouse" });
    expect(ghost()).toHaveAttribute("data-look", "phantom");
    expect([ghost()?.dataset.x, ghost()?.dataset.span]).toEqual(["2", "1"]);
    expect(ghost()).toHaveTextContent("Новая задача");
    // Pressed and moved within the day: a real bar of one day, its length inside.
    fireEvent.pointerDown(row, { clientX: 36, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 44, pointerType: "mouse" });
    expect(ghost()).toHaveAttribute("data-look", "bar");
    expect(ghost()).toHaveAttribute("data-color", "blue");
    expect(ghost()).toHaveTextContent("1 дн.");
    expect(ghost()).not.toHaveTextContent("Новая задача");
    // Five days on, then back before the press: the start moves, the pressed day stays in.
    fireEvent.pointerMove(row, { clientX: 100, pointerType: "mouse" });
    expect([ghost()?.dataset.x, ghost()?.dataset.span]).toEqual(["2", "5"]);
    expect(screen.getByRole("tooltip")).toHaveTextContent("8 – 12 июля · 5 дн.");
    fireEvent.pointerMove(row, { clientX: 4, pointerType: "mouse" });
    expect([ghost()?.dataset.x, ghost()?.dataset.span]).toEqual(["0", "3"]);
    fireEvent.pointerMove(row, { clientX: 44, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 44, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledExactlyOnceWith(
      { start: day(7, 8), end: day(7, 9) },
      PEOPLE[2],
    );
  });

  it("creates nothing on a press let go where it began; Escape fades the drawn bar out", async () => {
    mockLayout();
    const onBarCreate = vi.fn();
    render(<Chart defaultZoom="week" range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.pointerDown(row, { clientX: 36, button: 0, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 36, pointerType: "mouse" });
    expect(onBarCreate).not.toHaveBeenCalled();
    fireEvent.pointerDown(row, { clientX: 36, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 100, pointerType: "mouse" });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(row.querySelector('[data-state="leaving"]')).toHaveAttribute("data-look", "bar");
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(row.querySelector(`.${styles.ghost}`)).toBeNull();
    fireEvent.pointerUp(row, { clientX: 100, pointerType: "mouse" });
    expect(onBarCreate).not.toHaveBeenCalled();
  });

  it("shows the visible unit as the phantom where days are not drawn, and draws in days still", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    // 5 px a day: the grid draws the head's 7-day ticks (1, 8, 15…), the 8th's cell is 8–14.
    render(<Chart defaultZoom={5} range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Ольга Белова");
    fireEvent.pointerMove(row, { clientX: 12, pointerType: "mouse" });
    const ghost = row.querySelector<HTMLElement>(`.${styles.ghost}`);
    expect([ghost?.dataset.x, ghost?.dataset.span]).toEqual(["2", "7"]);
    fireEvent.pointerDown(row, { clientX: 12, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(row, { clientX: 27, pointerType: "mouse" });
    fireEvent.pointerUp(row, { clientX: 27, pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 8), end: day(7, 12) }, PEOPLE[2]);
  });
});

describe("Gantt bar labels", () => {
  /** Labels as wide as their text at 7 px a letter. */
  function measureLabels() {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.hasAttribute("data-gantt-label") ? (this.textContent?.length ?? 0) * 7 : 0;
    });
  }

  it("stands inside when it fits, beside when the lane is free, else inside and cut at the end", () => {
    mockLayout();
    measureLabels();
    const lane: Person[] = [
      {
        id: "x",
        name: "Склад",
        bars: [
          // 5 days × 40 px: «Инвентаризация» (98 px) fits inside.
          { id: "fits", label: "Инвентаризация", start: day(7, 6), end: day(7, 11) },
          // A day: the next bar is 4 days on, room beside it.
          { id: "beside", label: "Приёмка", start: day(7, 13), end: day(7, 14) },
          // A day with the next bar right after it: no room beside, inside and cut.
          { id: "cut", label: "Отгрузка партии", start: day(7, 18), end: day(7, 19) },
          { id: "next", label: "Учёт", start: day(7, 19), end: day(7, 24) },
        ],
      },
    ];
    render(<Chart rows={lane} range={RANGE} />);
    expect(bar(/^Инвентаризация/)).toHaveAttribute("data-label", "inside");
    expect(bar(/^Приёмка/)).toHaveAttribute("data-label", "outside");
    expect(bar(/^Отгрузка партии/)).toHaveAttribute("data-label", "clipped");
    // The name keeps the whole title.
    expect(bar(/^Отгрузка партии/)).toHaveAccessibleName(/^Отгрузка партии: 18 июля 2026/);
    const file = "src/components/gantt/Gantt.module.css";
    expect(cssValue(cssRule(file, '.bar[data-label="clipped"] .label'), "text-overflow")).toBe(
      "clip",
    );
  });
});

describe("Gantt head: today's pill and no selection", () => {
  it("stands today's pill on the today line at every zoom; no label carries the accent", () => {
    cameraLayout();
    const range = { start: day(1, 1), end: new Date(2027, 11, 31) };
    const { rerender } = render(<Chart range={range} zoom={40} />);
    const pill = () => document.querySelector<HTMLElement>(`.${styles.todayPill}`);
    const line = () =>
      document.querySelector<HTMLElement>(`[data-gantt-head] .${styles.todayLine}`);
    // Day steps: the number; the month step: the month too; the quarter step with years in view:
    // the year too.
    for (const [zoom, text] of [
      [40, /^8$/],
      [16, /^8$/],
      [4, /^8$/],
      [1.5, /^8 июл$/],
      [1, /^8 июл 2026$/],
    ] as const) {
      rerender(<Chart range={range} zoom={zoom} />);
      expect(pill(), `at ${zoom}`).toHaveTextContent(text);
      // On the line: the pill starts on the head's today line, the start of today's cell.
      expect(pill()?.style.insetInlineStart).toBe(line()?.style.insetInlineStart);
      expect(document.querySelector("[data-accent]")).toBeNull();
      // The chart's today line and the head's are one line, at the middle of today's column.
      expect(
        document.querySelector<HTMLElement>(`.${styles.backdrop} .${styles.todayLine}`)?.style
          .insetInlineStart,
      ).toBe(line()?.style.insetInlineStart);
    }
    // At a day step the pill is today's own label: the plain «8» starts after the same tick, by
    // the pill's own start padding (jsdom has none: the kit's step), so its text never moves.
    rerender(<Chart range={range} zoom={40} />);
    const at = Number.parseFloat(line()?.style.insetInlineStart ?? "");
    const plain = [...document.querySelectorAll<HTMLElement>(`.${styles.headLabel}`)].filter(
      (label) => Number.parseFloat(label.style.insetInlineStart) === at + 4,
    );
    expect(plain).toHaveLength(1);
    expect(plain[0]).toHaveTextContent(/^8$/);
  });

  it("draws one calm grid: one line weight, the head's ticks on the same lines, weekends only as columns", () => {
    cameraLayout();
    const range = { start: day(1, 1), end: new Date(2027, 11, 31) };
    const { rerender } = render(<Chart range={range} zoom={16} />);
    const days = (selector: string) =>
      [...document.querySelectorAll<HTMLElement>(selector)].map((node) => node.dataset.day);
    for (const zoom of [40, 16, 4]) {
      rerender(<Chart range={range} zoom={zoom} />);
      const lines = [...document.querySelectorAll<HTMLElement>(`.${styles.gridLine}`)];
      // One weight: no line carries a strength of its own.
      expect(lines.every((line) => line.style.opacity === "")).toBe(true);
      // The head is the top of the grid: its ticks are the grid's lines.
      expect(days(`[data-gantt-head] .${styles.tick}`)).toEqual(days(`.${styles.gridLine}`));
      // Every label one colour: no weekend label is set apart.
      expect(document.querySelector("[data-gantt-head] [data-weekend]")).toBeNull();
      const washed = document.querySelector(`.${styles.weekend}`) !== null;
      expect(washed, `at ${zoom}`).toBe(zoom >= 16);
    }
  });

  it("selects nothing where a press is a gesture; the names stay selectable", () => {
    const file = "src/components/gantt/Gantt.module.css";
    const rule = cssRule(file, ".axis,\n.track,\n.bar,\n.ghost");
    expect(cssValue(rule, "user-select")).toBe("none");
    expect(cssValue(rule, "-webkit-user-select")).toBe("none");
    expect(cssValue(cssRule(file, ".viewport"), "-webkit-touch-callout")).toBe("none");
    expect(
      cssRule(file, ".rowHeader").decls.some((decl) => decl.prop.endsWith("user-select")),
    ).toBe(false);
  });
});

describe("Gantt lanes: a pointer never moves them", () => {
  // Lane 0: a rental, then a booking from the 10th; lane 1: documents under the rental.
  const FLEET: Person[] = [
    {
      id: "pcx",
      name: "Скутер Honda PCX 160",
      bars: [
        { id: "rent", label: "Евгений", start: day(7, 6), end: day(7, 10) },
        { id: "docs", label: "Документы", start: day(7, 7), end: day(7, 9) },
        { id: "book", label: "Бронь · Waikl", start: day(7, 10), end: day(7, 16) },
      ],
    },
  ];
  const lanesOf = () =>
    [...document.querySelectorAll<HTMLElement>("[data-gantt-bar]")].map(
      (node) => `${node.dataset.barId}:${node.dataset.lane}:${node.style.insetBlockStart}`,
    );
  const ghost = () => document.querySelector<HTMLElement>(`.${styles.ghost}`);
  /** At 20 px a day from 6 July: lane 0 at y 10, lane 1 at y 42. */
  const LANE_Y = [10, 42];

  it("keeps every bar's lane and the row's height while the phantom sweeps lane 2", () => {
    mockLayout();
    render(<Chart rows={FLEET} defaultZoom={20} range={RANGE} onBarCreate={() => {}} />);
    const row = track("Скутер Honda PCX 160");
    const height = row.closest("[role='row']")?.getAttribute("style");
    const before = lanesOf();
    expect(before).toEqual(["rent:0:8px", "docs:1:40px", "book:0:8px"]);
    for (let step = 0; step < 30; step++) {
      fireEvent.pointerMove(row, {
        clientX: 10 + step * 20,
        clientY: LANE_Y[1],
        pointerType: "mouse",
      });
      expect(lanesOf(), `at ${step}`).toEqual(before);
      expect(row.closest("[role='row']")?.getAttribute("style")).toBe(height);
      const shown = ghost();
      // The documents hold the 7th and the 8th of lane 1: there, no phantom; elsewhere in lane 1.
      if (step === 1 || step === 2) expect(shown, `at ${step}`).toBeNull();
      else expect(shown?.style.insetBlockStart, `at ${step}`).toBe("40px");
    }
  });

  it("shows the phantom only in the free lane under the pointer, never another", () => {
    mockLayout();
    render(<Chart rows={FLEET} defaultZoom={20} range={RANGE} onBarCreate={() => {}} />);
    const row = track("Скутер Honda PCX 160");
    // Under the booking in lane 0 (the 12th): taken — nothing, though lane 1 is free there.
    fireEvent.pointerMove(row, { clientX: 130, clientY: LANE_Y[0], pointerType: "mouse" });
    expect(ghost()).toBeNull();
    fireEvent.pointerMove(row, { clientX: 130, clientY: LANE_Y[1], pointerType: "mouse" });
    expect(ghost()?.style.insetBlockStart).toBe("40px");
    expect(ghost()?.dataset.x).toBe("6");
  });

  it("draws in the pressed lane while it is free, else in the first free lane; the row keeps its height", () => {
    mockLayout();
    const onBarCreate = vi.fn();
    render(<Chart rows={FLEET} defaultZoom={20} range={RANGE} onBarCreate={onBarCreate} />);
    const row = track("Скутер Honda PCX 160");
    const height = row.closest("[role='row']")?.getAttribute("style");
    const before = lanesOf();
    // Pressed in lane 0 on the 12th, over the booking: drawn in lane 1, the first free one.
    fireEvent.pointerDown(row, {
      clientX: 130,
      clientY: LANE_Y[0],
      button: 0,
      pointerType: "mouse",
    });
    for (const clientX of [150, 170, 190]) {
      fireEvent.pointerMove(row, { clientX, clientY: LANE_Y[0], pointerType: "mouse" });
      expect(ghost()?.style.insetBlockStart).toBe("40px");
      expect(lanesOf()).toEqual(before);
      expect(row.closest("[role='row']")?.getAttribute("style")).toBe(height);
    }
    fireEvent.pointerUp(row, { clientX: 190, clientY: LANE_Y[0], pointerType: "mouse" });
    expect(onBarCreate).toHaveBeenCalledWith({ start: day(7, 12), end: day(7, 16) }, FLEET[0]);
  });

  it("places a ghost by the real bars' lanes alone", () => {
    const bars = FLEET[0].bars;
    const { lanes, looks } = assignLanes(bars);
    const row = { bars, lanes, looks };
    const lane = (place: ReturnType<typeof placeGhost>) =>
      place && [place.lane, place.looks.length];
    const dates = { start: day(7, 11), end: day(7, 12) };
    expect(lane(placeGhost(row, { dates, status: "phantom", lane: 1 }))).toEqual([1, 2]);
    expect(placeGhost(row, { dates, status: "phantom", lane: 0 })).toBeNull();
    expect(lane(placeGhost(row, { dates, status: "drawing", lane: 0 }))).toEqual([1, 2]);
    // Over both lanes: a drawing stays where it was pressed; a pending bar takes a new lane, once.
    const wide = { start: day(7, 7), end: day(7, 12) };
    expect(lane(placeGhost(row, { dates: wide, status: "drawing", lane: 0 }))).toEqual([0, 2]);
    expect(lane(placeGhost(row, { dates: wide, status: "pending", lane: 0 }))).toEqual([2, 3]);
    // The lanes are stable: the same bars in another order pack the same way.
    expect(assignLanes([...bars].reverse()).lanes).toEqual(lanes);
  });
});

describe("Gantt bar heights", () => {
  const FLEET: Person[] = [
    {
      id: "pcx",
      name: "Скутер Honda PCX 160",
      bars: [
        { id: "rent", label: "Евгений", start: day(7, 6), end: day(7, 8) },
        {
          id: "long",
          label: "Бронь · Waikl",
          description: "Клиент · 300 $ депозит",
          start: day(7, 8),
          end: day(7, 20),
          height: "l",
        },
        { id: "docs", label: "Документы", start: day(7, 6), end: day(7, 9), height: "s" },
        { id: "check", label: "Страховка", start: day(7, 9), end: day(7, 11), height: "s" },
        { id: "late", label: "Продление", start: day(7, 7), end: day(7, 10) },
      ],
    },
  ];

  it("packs the main bars first, then s below them; a lane is as tall as its tallest bar", () => {
    const { lanes, looks } = assignLanes(FLEET[0].bars);
    // «Евгений» and the long booking share lane 0, which the booking makes an l lane.
    expect(looks).toEqual(["l", "m", "s"]);
    expect(Object.fromEntries(lanes)).toEqual({ rent: 0, long: 0, late: 1, docs: 2, check: 2 });
    const heights = { s: 20, m: 28, l: 44 };
    expect(laneTops(looks, heights, 8, 4)).toEqual([8, 56, 88]);
    expect(lanesHeight(looks, heights, 8, 4)).toBe(116);
    // An m lane and an s lane are shorter than two m lanes.
    expect(lanesHeight(["m", "s"], heights, 8, 4)).toBeLessThan(
      lanesHeight(["m", "m"], heights, 8, 4),
    );
  });

  it("stacks the lanes by their heights, centres a shorter bar, and sizes the row from them", () => {
    mockLayout();
    render(<Chart rows={FLEET} defaultZoom={40} range={RANGE} />);
    const top = (name: RegExp) => bar(name).style.insetBlockStart;
    // An m bar centred in the l lane: 8 + (44 − 28) / 2.
    expect(top(/^Евгений/)).toBe("16px");
    expect(top(/^Бронь · Waikl/)).toBe("8px");
    expect(top(/^Продление/)).toBe("56px");
    expect(top(/^Документы/)).toBe("88px");
    expect(bar(/^Документы/)).toHaveAttribute("data-height", "s");
    expect(bar(/^Бронь · Waikl/)).toHaveAttribute("data-height", "l");
    const row = bar(/^Документы/).closest<HTMLElement>("[role='row']");
    expect(row?.style.getPropertyValue("--row-h")).toBe("116px");
  });

  it("shows an l bar's description on its second line, and every bar's in its name", () => {
    mockLayout();
    render(<Chart rows={FLEET} defaultZoom={40} range={RANGE} />);
    const long = bar(/^Бронь · Waikl/);
    expect(long.querySelector("[data-gantt-label]")).toHaveTextContent(
      "Бронь · WaiklКлиент · 300 $ депозит",
    );
    expect(long).toHaveAccessibleName(/^Бронь · Waikl, Клиент · 300 \$ депозит: 8 июля 2026/);
    // An s bar's label is inside it, in the caption role.
    expect(bar(/^Документы/).querySelector("[data-gantt-label]")).toHaveTextContent("Документы");
  });

  it("edits every height by the keys", () => {
    const onBarChange = vi.fn();
    render(<Chart rows={FLEET} defaultZoom={40} range={RANGE} onBarChange={onBarChange} />);
    for (const [name, id] of [
      [/^Бронь · Waikl/, "long"],
      [/^Продление/, "late"],
      [/^Документы/, "docs"],
    ] as const) {
      fireEvent.keyDown(bar(name), { key: "ArrowRight", shiftKey: true });
      expect(onBarChange.mock.lastCall?.[1]).toMatchObject({ id });
    }
  });

  it("places the phantom only in a main lane: an s lane holds none", () => {
    const { lanes, looks } = assignLanes(FLEET[0].bars);
    const row = { bars: FLEET[0].bars, lanes, looks };
    const dates = { start: day(7, 25), end: day(7, 26) };
    expect(placeGhost(row, { dates, status: "phantom", lane: 2 })).toBeNull();
    expect(placeGhost(row, { dates, status: "phantom", lane: 1 })?.lane).toBe(1);
    // A pending bar with no free main lane takes a new one after the main lanes: s steps down.
    const wide = { start: day(7, 6), end: day(7, 25) };
    const place = placeGhost(row, { dates: wide, status: "pending", lane: 0 });
    expect(place?.lane).toBe(2);
    expect(place?.looks).toEqual(["l", "m", "m", "s"]);
    expect(place?.lanes.get("docs")).toBe(3);
  });
});

describe("Gantt with many rows", () => {
  const MANY: Person[] = Array.from({ length: 400 }, (_, index) => ({
    id: `p-${index}`,
    name: `Сотрудник ${index + 1}`,
    bars: [{ id: `b-${index}`, label: `Задача ${index + 1}`, start: day(7, 8), end: day(7, 12) }],
  }));
  const scroller = () =>
    screen.getByRole("grid", { name: "Загрузка команды" }).parentElement as HTMLElement;
  const drag = (node: HTMLElement) => {
    fireEvent.pointerDown(node, { clientX: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(node, { clientX: 160, pointerType: "mouse" });
    fireEvent.pointerUp(node, { clientX: 160, pointerType: "mouse" });
  };

  it("drags a bar of the first screen and one of a row rendered after a scroll", async () => {
    mockLayout();
    const onBarChange = vi.fn();
    render(<Chart rows={MANY} defaultZoom={20} range={RANGE} onBarChange={onBarChange} />);
    // Rows are virtualized: the last row is not in the DOM until the view gets there.
    expect(screen.queryByRole("button", { name: /^Задача 400:/ })).toBeNull();
    drag(bar(/^Задача 1:/));
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 11), end: day(7, 15) },
      MANY[0].bars[0],
      MANY[0],
    );
    act(() => {
      scroller().scrollTop = 399 * 45;
      fireEvent.scroll(scroller());
    });
    // The rows of the new view render in the next frame.
    drag(await screen.findByRole("button", { name: /^Задача 400:/ }));
    expect(onBarChange).toHaveBeenLastCalledWith(
      { start: day(7, 11), end: day(7, 15) },
      MANY[399].bars[0],
      MANY[399],
    );
  });

  it("keeps the grid under every bar and paints a bar over the surface, never see-through", () => {
    mockLayout();
    render(<Chart rows={MANY} defaultZoom={40} range={RANGE} />);
    // The grid's layer comes first in the body and holds no stacking of its own; rows follow it.
    const body = bar(/^Задача 1:/).closest(`.${styles.body}`) as HTMLElement;
    const backdrop = body.querySelector(`.${styles.backdrop}:not(.${styles.overlay})`);
    expect(body.firstElementChild).toBe(backdrop);
    const file = "src/components/gantt/Gantt.module.css";
    const sets = (selector: string, prop: string) =>
      cssRule(file, selector).decls.some((decl) => decl.prop === prop);
    expect(sets(".backdrop", "z-index")).toBe(false);
    // The tint lies over the chart's surface, so the lines never show through a bar.
    const barRule = cssRule(file, ".bar");
    expect(cssValue(barRule, "background-color")).toBe("var(--gantt-surface)");
    expect(cssValue(barRule, "background-image")).toBe(
      "linear-gradient(var(--bar-bg), var(--bar-bg))",
    );
    expect(sets(".bar", "background")).toBe(false);
    // No bar rule takes the surface away with the `background` shorthand (a milestone draws none).
    for (const selector of ['.bar[data-progress="true"]', '.bar[data-tone="neutral"]']) {
      expect(sets(selector, "background")).toBe(false);
    }
  });
});

describe("Gantt scrollHeight fill", () => {
  it("is no taller than its parent: sized to its rows, shrinking to the free height, never growing", () => {
    render(<Chart scrollHeight="fill" />);
    expect(screen.getByRole("grid").closest("[data-scroll-height]")).toHaveAttribute(
      "data-scroll-height",
      "fill",
    );
    const file = "src/components/gantt/Gantt.module.css";
    const root = cssRule(file, '.root[data-scroll-height="fill"]');
    expect(cssValue(root, "flex")).toBe("0 1 auto");
    expect(cssValue(root, "max-height")).toBe("100%");
    expect(cssValue(root, "min-height")).toBe("0");
    expect(root.decls.some((decl) => decl.prop === "height")).toBe(false);
    const inner = cssRule(
      file,
      '.root[data-scroll-height="fill"] .frame,\n.root[data-scroll-height="fill"] .viewport',
    );
    expect(cssValue(inner, "flex")).toBe("0 1 auto");
  });
});
