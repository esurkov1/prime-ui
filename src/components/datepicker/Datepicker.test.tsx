import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Datepicker, datepickerPresets, formatDateValue, YEARLESS_YEAR } from "./Datepicker";
import {
  DEFAULT_DATEPICKER_PRESETS,
  matchPreset,
  monthGrid,
  parseTime,
  rowsNeeded,
} from "./datepickerModel";
import { resolvePanelLayout } from "./panelLayout";

const TODAY = new Date(2026, 9, 7); // 7 October 2026, a Wednesday

/** jsdom loads no stylesheet: the layout tokens the panel reads are set on the root for a test. */
const LAYOUT_TOKENS = {
  "--prime-control-m-item-height": "32px",
  "--prime-space-6": "24px",
  "--prime-space-3": "12px",
};
function withLayoutTokens(run: () => void) {
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(LAYOUT_TOKENS)) root.setProperty(name, value);
  try {
    run();
  } finally {
    for (const name of Object.keys(LAYOUT_TOKENS)) root.removeProperty(name);
  }
}

describe("datepickerModel", () => {
  it("сетка месяца начинается с понедельника и выравнивает строки", () => {
    const oct = new Date(2026, 9, 1); // a Thursday
    const rows = rowsNeeded(oct, 1);
    const grid = monthGrid(oct, rows, 1);
    expect(grid[0].slice(0, 3).every((c) => !c.inMonth)).toBe(true);
    expect(grid[0][0].date.getDate()).toBe(28);
    expect(grid[0][3]).toEqual({ date: oct, inMonth: true });
    expect(rows).toBe(5);
  });

  it("parseTime принимает только корректное время", () => {
    expect(parseTime("09:30")).toBe(570);
    expect(parseTime("24:00")).toBeNull();
    expect(parseTime("abc")).toBeNull();
  });

  it("matchPreset узнаёт «Всё время» без начала и «Прошлый месяц»", () => {
    const groups = [datepickerPresets.allTime(), datepickerPresets.lastMonth];
    expect(matchPreset(groups, null, TODAY, TODAY)?.key).toBe("allTime");
    expect(matchPreset(groups, new Date(2026, 8, 1), new Date(2026, 8, 30), TODAY)?.key).toBe(
      "lastMonth",
    );
    expect(matchPreset(groups, new Date(2026, 8, 2), new Date(2026, 8, 30), TODAY)).toBeNull();
  });

  it("the default periods end with «Всё время»", () => {
    const last = DEFAULT_DATEPICKER_PRESETS[DEFAULT_DATEPICKER_PRESETS.length - 1];
    expect(last?.key).toBe("allTime");
    expect(last?.label).toBe("Всё время");
    expect(matchPreset(DEFAULT_DATEPICKER_PRESETS, null, TODAY, TODAY)?.key).toBe("allTime");
  });
});

describe("Datepicker.Panel", () => {
  it("range без нижней строки применяет диапазон после второго клика", async () => {
    const onChange = vi.fn();
    render(
      <Datepicker.Panel
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={onChange}
        today={TODAY}
        prompt
      />,
    );
    expect(screen.getByText("Выберите начальную дату")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "12 октября 2026" }));
    expect(screen.getByText("Выберите конечную дату")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "5 октября 2026" }));
    const [range] = onChange.mock.calls[0];
    expect(range.from).toEqual(new Date(2026, 9, 5, 0, 0, 0, 0));
    expect(range.to).toEqual(new Date(2026, 9, 12, 23, 59, 59, 999));
  });

  it("нижняя строка применяет выбор со временем только по «Применить»", async () => {
    const onChange = vi.fn();
    render(
      <Datepicker.Panel
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={onChange}
        today={TODAY}
        footer
        withTime
      />,
    );
    const apply = screen.getByRole("button", { name: "Применить" });
    expect(apply).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "1 октября 2026" }));
    await userEvent.click(screen.getByRole("button", { name: "3 октября 2026" }));
    const start = screen.getByRole("textbox", { name: "Время начала" });
    await userEvent.clear(start);
    await userEvent.type(start, "09:30");
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(apply);
    expect(onChange.mock.calls[0][0].from).toEqual(new Date(2026, 9, 1, 9, 30));
  });

  it("пресет применяется сразу и подсвечивается", async () => {
    const onChange = vi.fn();
    const presets = [datepickerPresets.today];
    const { rerender } = render(
      <Datepicker.Panel
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={onChange}
        today={TODAY}
        presets={presets}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Сегодня" }));
    const value = onChange.mock.calls[0][0];
    rerender(
      <Datepicker.Panel
        mode="range"
        value={value}
        onValueChange={onChange}
        today={TODAY}
        presets={presets}
      />,
    );
    expect(screen.getByRole("button", { name: "Сегодня" })).toHaveAttribute("aria-pressed", "true");
  });

  it("пресеты — именованная группа без видимого заголовка", () => {
    render(
      <Datepicker.Panel
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={() => {}}
        today={TODAY}
        presets={[datepickerPresets.today]}
      />,
    );
    const group = screen.getByRole("group", { name: "Период" });
    expect(group).toHaveTextContent(/^Сегодня$/);
  });

  it("будущие и недоступные дни нельзя выбрать", () => {
    render(
      <Datepicker.Panel
        mode="single"
        value={null}
        onValueChange={() => {}}
        today={TODAY}
        disableFuture
        isDayDisabled={(day) => day.getDate() === 1}
      />,
    );
    expect(screen.getByRole("button", { name: "8 октября 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1 октября 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "6 октября 2026" })).toBeEnabled();
  });

  it("стрелки двигают фокус по дням и листают месяц", () => {
    render(<Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />);
    const today = screen.getByRole("button", { name: "7 октября 2026" });
    expect(today).toHaveAttribute("tabindex", "0");
    today.focus();
    fireEvent.keyDown(today, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "8 октября 2026" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "PageDown" });
    expect(screen.getByRole("button", { name: "8 ноября 2026" })).toHaveFocus();
    expect(screen.getByRole("table", { name: "Ноябрь 2026" })).toBeInTheDocument();
  });

  it("yearless: без года в заголовке, листание по кругу", async () => {
    const onChange = vi.fn();
    render(
      <Datepicker.Panel
        mode="single"
        yearless
        value={new Date(YEARLESS_YEAR, 11, 31)}
        onValueChange={onChange}
      />,
    );
    expect(screen.getByRole("table", { name: "Декабрь" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Следующий месяц" }));
    expect(screen.getByRole("table", { name: "Январь" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "15 января" }));
    expect(onChange.mock.calls[0][0]).toEqual(new Date(YEARLESS_YEAR, 0, 15));
  });
});

describe("Datepicker keyboard", () => {
  const day = (name: string) => screen.getByRole("button", { name });

  it("↑ · ↓ walk weeks, Home · End the week, PageUp the month", async () => {
    const user = userEvent.setup();
    render(<Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />);
    act(() => day("7 октября 2026").focus());
    await user.keyboard("{ArrowDown}");
    expect(day("14 октября 2026")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(day("7 октября 2026")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(day("5 октября 2026")).toHaveFocus();
    await user.keyboard("{End}");
    expect(day("11 октября 2026")).toHaveFocus();
    await user.keyboard("{PageUp}");
    expect(day("11 сентября 2026")).toHaveFocus();
    expect(screen.getByRole("table", { name: "Сентябрь 2026" })).toBeInTheDocument();
  });

  it("Enter on the field opens the calendar; Space on a day picks it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Datepicker.Root mode="single" label="Срок" today={TODAY} onValueChange={onValueChange} />,
    );
    act(() => screen.getByRole("button", { name: /Срок/ }).focus());
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => day("9 октября 2026").focus());
    await user.keyboard(" ");
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 9, 9));
  });
});

describe("Datepicker.Panel — keys outside the days", () => {
  it("an arrow on a month button stays the button's: the grid walks only from a day", () => {
    render(<Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />);
    const next = screen.getByRole("button", { name: "Следующий месяц" });
    next.focus();
    fireEvent.keyDown(next, { key: "ArrowLeft" });
    expect(next).toHaveFocus();
    expect(screen.getByRole("table", { name: "Октябрь 2026" })).toBeInTheDocument();
  });

  it("paging with the month button keeps focus on it", async () => {
    const user = userEvent.setup();
    render(<Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />);
    await user.click(screen.getByRole("button", { name: "Следующий месяц" }));
    expect(screen.getByRole("table", { name: "Ноябрь 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Следующий месяц" })).toHaveFocus();
  });
});

describe("Datepicker.Panel — сетка и раскладка", () => {
  it("Shift+PageDown листает на год вперёд", () => {
    render(<Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />);
    const today = screen.getByRole("button", { name: "7 октября 2026" });
    today.focus();
    fireEvent.keyDown(today, { key: "PageDown", shiftKey: true });
    expect(screen.getByRole("button", { name: "7 октября 2027" })).toHaveFocus();
    expect(screen.getByRole("table", { name: "Октябрь 2027" })).toBeInTheDocument();
  });

  it("в одном месяце показывает дни соседних месяцев приглушённо и без кнопок", () => {
    const { container } = render(
      <Datepicker.Panel mode="single" value={null} onValueChange={() => {}} today={TODAY} />,
    );
    // October 2026 starts on a Thursday: 28–30 September are in the first row.
    expect(container.querySelector("tbody tr")?.textContent?.startsWith("282930")).toBe(true);
    expect(screen.queryByRole("button", { name: "30 сентября 2026" })).not.toBeInTheDocument();
  });

  it("на узком окне периоды уходят строкой над календарём и остаётся один месяц", () => {
    const original = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    try {
      withLayoutTokens(() => {
        render(
          <Datepicker.Root
            mode="range"
            value={{ from: null, to: null }}
            onValueChange={() => {}}
            months={2}
            presets={[datepickerPresets.today]}
            today={TODAY}
            open
          />,
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog.querySelector('[data-layout="stacked"]')).not.toBeNull();
        expect(screen.getAllByRole("table")).toHaveLength(1);
      });
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: original });
    }
  });
});

describe("Datepicker.Panel — value and draft", () => {
  it("with a footer, an outside value change reaches the draft", () => {
    const { rerender } = render(
      <Datepicker.Panel mode="single" footer value={new Date(2026, 9, 7)} today={TODAY} />,
    );
    expect(screen.getByText("07.10.2026")).toBeInTheDocument();
    rerender(<Datepicker.Panel mode="single" footer value={new Date(2026, 9, 9)} today={TODAY} />);
    expect(screen.getByText("09.10.2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9 октября 2026" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("without a footer, the band follows the outside value", () => {
    const { rerender } = render(
      <Datepicker.Panel
        mode="range"
        value={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 6) }}
        today={TODAY}
      />,
    );
    rerender(
      <Datepicker.Panel
        mode="range"
        value={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 14) }}
        today={TODAY}
      />,
    );
    expect(screen.getByRole("button", { name: "13 октября 2026" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "5 октября 2026" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("announces the visible months in one live region", () => {
    const { container } = render(
      <Datepicker.Panel mode="range" months={2} today={TODAY} value={{ from: null, to: null }} />,
    );
    const live = container.querySelectorAll("[aria-live]");
    expect(live).toHaveLength(1);
    expect(live[0]).toHaveTextContent("Сентябрь 2026 — Октябрь 2026");
  });
});

describe("Datepicker.Panel — сегодня", () => {
  it("сегодня помечен aria-current=date, другие дни — нет", () => {
    render(<Datepicker.Panel mode="single" today={TODAY} />);
    const today = screen.getByRole("button", { name: "7 октября 2026" });
    expect(today).toHaveAttribute("aria-current", "date");
    expect(screen.getByRole("button", { name: "8 октября 2026" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

describe("Datepicker.Root", () => {
  it("поле получает ярус и состояние ошибки", () => {
    render(
      <Datepicker.Root
        invalid
        mode="single"
        value={null}
        onValueChange={() => {}}
        size="xl"
        aria-label="Дата"
      />,
    );
    const trigger = screen.getByRole("button", { name: /Дата/ });
    expect(trigger).toHaveAttribute("data-size", "xl");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("колесо над открытым календарём не прокручивает страницу", async () => {
    render(
      <Datepicker.Root
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={() => {}}
        presets={[datepickerPresets.today]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Выбрать дату/ }));
    const day = screen.getAllByRole("button", { name: /\d{4}$/ })[0];
    const wheel = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
    day.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);
  });

  it("кнопка показывает значение и открывает панель", async () => {
    render(
      <Datepicker.Root
        mode="single"
        yearless
        value={new Date(YEARLESS_YEAR, 9, 15)}
        onValueChange={() => {}}
        valuePrefix="С"
        aria-label="Дата изменения"
      />,
    );
    const trigger = screen.getByRole("button", { name: "Дата изменения: С 15 октября" });
    await userEvent.click(trigger);
    expect(screen.getByRole("button", { name: "15 октября" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("a range without withTime shows days only, whatever time its dates carry", () => {
    const value = { from: new Date(2026, 6, 1), to: new Date(2026, 7, 4) };
    const today = new Date(2026, 9, 7);
    const { rerender } = render(
      <Datepicker.Root mode="range" value={value} today={today} aria-label="Период" />,
    );
    expect(screen.getByRole("button", { name: "Период: 1 июл — 4 авг" })).toBeInTheDocument();
    rerender(
      <Datepicker.Root mode="range" value={value} today={today} withTime aria-label="Период" />,
    );
    expect(
      screen.getByRole("button", { name: "Период: 1 июл 00:00 — 4 авг 00:00" }),
    ).toBeInTheDocument();
  });

  it("labels.rangeValue writes a range with both ends; an open start keeps labels.until", () => {
    const today = new Date(2026, 9, 7);
    const labels = { rangeValue: "{from} → {to}" };
    const { rerender } = render(
      <Datepicker.Root
        mode="range"
        value={{ from: new Date(2026, 9, 20), to: new Date(2026, 10, 2) }}
        today={today}
        valuePrefix="Аренда:"
        labels={labels}
        aria-label="Срок"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Срок: Аренда: 20 окт → 2 нояб" }),
    ).toBeInTheDocument();
    rerender(
      <Datepicker.Root
        mode="range"
        value={{ from: null, to: new Date(2026, 10, 2) }}
        today={today}
        labels={labels}
        aria-label="Срок"
      />,
    );
    expect(screen.getByRole("button", { name: "Срок: до 2 нояб" })).toBeInTheDocument();
  });

  it("draws a leading glyph only with Datepicker.TriggerIcon; Enter still opens", async () => {
    const { rerender } = render(<Datepicker.Root mode="single" aria-label="Дата" />);
    const trigger = screen.getByRole("button", { name: /Дата/ });
    // Without the part: the chevron alone.
    expect(trigger.querySelectorAll("svg")).toHaveLength(1);
    rerender(
      <Datepicker.Root mode="single" aria-label="Дата">
        <Datepicker.TriggerIcon data-testid="glyph" />
      </Datepicker.Root>,
    );
    const glyph = screen.getByTestId("glyph");
    expect(glyph).toHaveAttribute("aria-hidden", "true");
    expect(glyph.querySelector("svg")).not.toBeNull();
    expect(trigger.firstElementChild).toBe(glyph);
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opening the popover focuses the picked day", async () => {
    render(
      <Datepicker.Root
        mode="single"
        defaultValue={new Date(2026, 9, 9)}
        today={TODAY}
        aria-label="Дата"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Дата/ }));
    expect(screen.getByRole("button", { name: "9 октября 2026" })).toHaveFocus();
  });

  it("без значения показывает placeholder", () => {
    render(
      <Datepicker.Root
        mode="range"
        value={{ from: null, to: null }}
        onValueChange={() => {}}
        placeholder="Период"
      />,
    );
    expect(screen.getByRole("button", { name: /Период/ })).toBeInTheDocument();
  });

  it("неконтролируемый режим: defaultValue и onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <Datepicker.Root
        mode="single"
        defaultValue={new Date(2026, 9, 7)}
        onValueChange={onValueChange}
        today={TODAY}
        aria-label="Дата"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Дата/ }));
    await userEvent.click(screen.getByRole("button", { name: "9 октября 2026" }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 9, 0, 0, 0, 0));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Дата/ })).toHaveTextContent("9 окт");
  });

  it("label, hint и error: подпись и описание кнопки поля", () => {
    const { rerender } = render(
      <Datepicker.Root mode="single" label="Дата рождения" hint="ДД.ММ.ГГГГ" />,
    );
    const trigger = screen.getByRole("button", { name: /Дата рождения/ });
    expect(trigger).toHaveAccessibleDescription("ДД.ММ.ГГГГ");
    rerender(<Datepicker.Root mode="single" label="Дата рождения" error="Укажите дату" />);
    expect(trigger).toHaveAccessibleDescription("Укажите дату");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("data-invalid", "true");
  });

  it("controlled open: onOpenChange, data-state на поле", async () => {
    const onOpenChange = vi.fn();
    render(
      <Datepicker.Root mode="single" open={false} onOpenChange={onOpenChange} aria-label="Дата" />,
    );
    const trigger = screen.getByRole("button", { name: /Дата/ });
    await userEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Datepicker focusRing", () => {
  it("focusRing={false} marks the field and keeps the invalid state", () => {
    render(
      <Datepicker.Root
        focusRing={false}
        invalid
        mode="single"
        value={null}
        onValueChange={() => {}}
        aria-label="Дата"
      />,
    );
    const trigger = screen.getByRole("button", { name: /Дата/ });
    expect(trigger).toHaveAttribute("data-focus-ring", "false");
    expect(trigger).toHaveAttribute("data-invalid", "true");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Datepicker — overlay contract", () => {
  it("an outside click and Escape close the popover; focus returns to the trigger", async () => {
    render(
      <div>
        <Datepicker.Root mode="single" aria-label="Дата" />
        <div data-testid="empty-space" />
      </div>,
    );
    const trigger = screen.getByRole("button", { name: /Дата/ });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByTestId("empty-space"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Datepicker.Panel — доступная ширина", () => {
  it("resolvePanelLayout: 2 месяца при достаточной ширине, 1 — на узкой, compact уже месяца", () => {
    const base = {
      months: 2 as const,
      hasPresets: false,
      embedded: true,
      metrics: { cell: 32, monthsGap: 24, chrome: 32 },
    };
    // m: cell 32 → month 224; 2 months + gap 24 + padding 2 × 16 = 504.
    expect(resolvePanelLayout({ ...base, available: 1440 }).monthCount).toBe(2);
    expect(resolvePanelLayout({ ...base, available: 504 }).monthCount).toBe(2);
    expect(resolvePanelLayout({ ...base, available: 503 }).monthCount).toBe(1);
    expect(resolvePanelLayout({ ...base, available: 343 })).toEqual({
      monthCount: 1,
      presetsAside: false,
      compact: false,
    });
    expect(resolvePanelLayout({ ...base, available: 250 }).compact).toBe(true);
    // Not measured yet: assume there is room.
    expect(resolvePanelLayout({ ...base, available: null }).monthCount).toBe(2);
    // The popover is never compact.
    expect(resolvePanelLayout({ ...base, embedded: false, available: 200 }).compact).toBe(false);
    // No readable tokens (no stylesheet): everything is assumed to fit.
    const unstyled = { ...base, metrics: { cell: 0, monthsGap: 0, chrome: 0 } };
    expect(resolvePanelLayout({ ...unstyled, available: 200 }).monthCount).toBe(2);
  });

  it("меряет content box родителя, а не саму панель", () => {
    const observed: Element[] = [];
    let notify: ((width: number) => void) | undefined;
    const Original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        notify = (width) =>
          act(() =>
            cb(
              [{ contentRect: { width } } as ResizeObserverEntry],
              this as unknown as ResizeObserver,
            ),
          );
      }
      observe(el: Element) {
        observed.push(el);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    try {
      withLayoutTokens(() => {
        const { container } = render(
          <div data-testid="host">
            <Datepicker.Panel
              mode="range"
              months={2}
              value={{ from: null, to: null }}
              onValueChange={() => {}}
              today={TODAY}
            />
          </div>,
        );
        expect(observed).toEqual([screen.getByTestId("host")]);
        notify?.(1200);
        expect(container.querySelectorAll("table")).toHaveLength(2);
        notify?.(343);
        expect(container.querySelectorAll("table")).toHaveLength(1);
        expect(container.querySelector("[data-embedded]")).not.toHaveAttribute("data-compact");
        notify?.(200);
        expect(container.querySelector("[data-compact]")).not.toBeNull();
      });
    } finally {
      globalThis.ResizeObserver = Original;
    }
  });
});

describe("Datepicker labels", () => {
  it("labels.placeholder is the default field text; placeholder overrides it per field", () => {
    const { rerender } = render(
      <Datepicker.Root mode="single" label="Дата ТО" labels={{ placeholder: "дд.мм.гггг" }} />,
    );
    expect(screen.getByRole("button", { name: "Дата ТО дд.мм.гггг" })).toBeInTheDocument();
    rerender(<Datepicker.Root mode="single" label="Дата ТО" placeholder="Не заполнено" />);
    expect(screen.getByRole("button", { name: "Дата ТО Не заполнено" })).toBeInTheDocument();
  });
});

describe("Datepicker.Root — open, dismiss and name", () => {
  it("ArrowDown on the field opens the calendar", async () => {
    const user = userEvent.setup();
    render(<Datepicker.Root mode="single" label="Срок" today={TODAY} />);
    screen.getByRole("button", { name: /Срок/ }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closeOnEscape={false} and closeOnOutsideClick={false} keep the calendar open", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Datepicker.Root
          mode="single"
          label="Срок"
          closeOnEscape={false}
          closeOnOutsideClick={false}
        />
        <div data-testid="outside" />
      </div>,
    );
    await user.click(screen.getByRole("button", { name: /Срок/ }));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("a required field names its value and is described by the required word", () => {
    render(<Datepicker.Root mode="single" label="Срок" required defaultValue={TODAY} />);
    const field = screen.getByRole("button", { name: /Срок/ });
    expect(field).toHaveAccessibleName(/Срок.*7 окт|Срок.*Сегодня/);
    expect(field).toHaveAccessibleDescription(/обязательное поле/);
  });
});

describe("formatDateValue", () => {
  it("formats the local day (and time), never the UTC one", () => {
    const lateEvening = new Date(2026, 9, 7, 23, 30);
    expect(formatDateValue(lateEvening)).toBe("2026-10-07");
    expect(formatDateValue(lateEvening, { withTime: true })).toBe("2026-10-07T23:30");
  });
});

describe("Datepicker form value", () => {
  it("submits a single date and a range through hidden inputs under its name", () => {
    const { container } = render(
      <form>
        <Datepicker.Root mode="single" name="due" label="Срок" defaultValue={TODAY} />
        <Datepicker.Root
          mode="range"
          name="period"
          label="Период"
          defaultValue={{ from: null, to: new Date(2026, 9, 31) }}
        />
        <Datepicker.Root mode="single" name="empty" label="Без даты" />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("due")).toBe("2026-10-07");
    expect(data.getAll("period")).toEqual(["", "2026-10-31"]);
    expect(data.get("empty")).toBe("");
  });
});
