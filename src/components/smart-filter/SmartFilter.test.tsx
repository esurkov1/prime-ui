import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_DATEPICKER_PRESETS } from "@/components/datepicker/Datepicker";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { matchIndex } from "@/internal/HighlightMatch";

import {
  canExcludeValue,
  matchesSmartFilter,
  removeSelectionValue,
  resolveSmartFilterValues,
  toggleSelectionMode,
  toggleSingleValue,
  withFieldValue,
} from "./model";
import { SmartFilter, type SmartFilterField, type SmartFilterValue } from "./SmartFilter";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const FIELDS: SmartFilterField[] = [
  {
    key: "service",
    label: "Сервис",
    finite: false,
    options: ["billing", "catalog", "events"].map((v) => ({ value: v, label: v })),
  },
  {
    key: "method",
    label: "Метод",
    options: METHODS.map((v) => ({ value: v, label: v })),
  },
  {
    key: "state",
    label: "Состояние",
    options: [
      { value: "active", label: "Активные" },
      { value: "inactive", label: "Неактивные" },
    ],
  },
];

function Harness({
  fields = FIELDS,
  initial = {},
  onValue,
  onSearch,
  collapsedLimit,
}: {
  fields?: SmartFilterField[];
  initial?: SmartFilterValue;
  onValue?: (v: SmartFilterValue) => void;
  onSearch?: (s: string) => void;
  collapsedLimit?: number;
}) {
  const [value, setValue] = React.useState(initial);
  const [search, setSearch] = React.useState("");
  return (
    <SmartFilter.Root
      fields={fields}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValue?.(next);
      }}
      search={search}
      onSearchChange={(s) => {
        setSearch(s);
        onSearch?.(s);
      }}
      {...(collapsedLimit !== undefined ? { collapsedLimit } : {})}
    >
      <SmartFilter.Toolbar />
      <SmartFilter.Chips />
    </SmartFilter.Root>
  );
}

/** The toolbar's filter button (the chips row has its own «+ Фильтр»). */
const filterButton = () =>
  within(document.querySelector('[data-slot="smart-filter-toolbar"]') as HTMLElement).getByRole(
    "button",
    { name: /Фильтр/ },
  );
const openPanel = () => fireEvent.click(filterButton());
const chips = () => document.querySelector('[data-slot="smart-filter-chips"]');

describe("model", () => {
  it("toggles a mode and clears it when asked twice", () => {
    const a = toggleSelectionMode(undefined, "x", "include");
    expect(a).toEqual({ include: ["x"], exclude: [] });
    expect(toggleSelectionMode(a, "x", "exclude")).toEqual({ include: [], exclude: ["x"] });
    expect(toggleSelectionMode(a, "x", "include")).toEqual({ include: [], exclude: [] });
  });

  it("removes a value and an empty selection leaves the value map", () => {
    expect(removeSelectionValue({ include: ["a"], exclude: ["b"] }, "a")).toEqual({
      include: [],
      exclude: ["b"],
    });
    expect(
      withFieldValue({ f: { include: ["a"], exclude: [] } }, "f", { include: [], exclude: [] }),
    ).toEqual({});
    expect(withFieldValue({ r: { from: 1, to: null } }, "r", { from: null, to: null })).toEqual({});
  });

  it("matches ranges: inclusive bounds, dates by whole days", () => {
    expect(matchesSmartFilter({ from: 1000, to: 5000 }, 1000)).toBe(true);
    expect(matchesSmartFilter({ from: 1000, to: 5000 }, 5001)).toBe(false);
    expect(matchesSmartFilter({ from: null, to: 5000 }, -3)).toBe(true);
    expect(matchesSmartFilter({ from: 1000, to: null }, null)).toBe(false);
    const march = { from: new Date(2026, 2, 1), to: new Date(2026, 2, 15) };
    expect(matchesSmartFilter(march, new Date(2026, 2, 15, 18, 30))).toBe(true);
    expect(matchesSmartFilter(march, new Date(2026, 2, 16))).toBe(false);
    expect(matchesSmartFilter(march, new Date(2026, 1, 28, 23, 59))).toBe(false);
    expect(resolveSmartFilterValues({ from: 1, to: 2 }, ["a"])).toEqual([]);
  });

  it("a single-value field holds one value and clears on a second press", () => {
    const a = toggleSingleValue(undefined, "x");
    expect(a).toEqual({ include: ["x"], exclude: [] });
    expect(toggleSingleValue(a, "y")).toEqual({ include: ["y"], exclude: [] });
    expect(toggleSingleValue(a, "x")).toEqual({ include: [], exclude: [] });
  });

  it("does not allow hiding every value of a fixed set", () => {
    const all = ["a", "b"];
    expect(canExcludeValue({ include: [], exclude: ["a"] }, "b", all)).toBe(false);
    expect(canExcludeValue({ include: [], exclude: ["a"] }, "a", all)).toBe(true);
    expect(canExcludeValue(undefined, "a", all)).toBe(true);
  });

  it("matches values: include empty is any, exclude rejects", () => {
    expect(matchesSmartFilter(undefined, "a")).toBe(true);
    expect(matchesSmartFilter({ include: ["a"], exclude: [] }, "b")).toBe(false);
    expect(matchesSmartFilter({ include: [], exclude: ["a"] }, "a")).toBe(false);
    expect(matchesSmartFilter({ include: [], exclude: ["a"] }, "b")).toBe(true);
  });

  it("resolves a selection over a fixed set into the list to ask for", () => {
    const all = ["a", "b", "c"];
    expect(resolveSmartFilterValues(undefined, all)).toEqual([]);
    expect(resolveSmartFilterValues({ include: ["a"], exclude: [] }, all)).toEqual(["a"]);
    expect(resolveSmartFilterValues({ include: [], exclude: ["a"] }, all)).toEqual(["b", "c"]);
    expect(resolveSmartFilterValues({ include: ["a", "b", "c"], exclude: [] }, all)).toEqual([]);
  });

  it("finds a match ignoring case", () => {
    expect(matchIndex("E2E-Events", "events")).toBe(4);
    expect(matchIndex("abc", "")).toBe(-1);
  });
});

describe("SmartFilter", () => {
  it("keeps autofill and the password managers off the search", () => {
    render(<Harness />);
    const search = screen.getByRole("searchbox", { name: "Поиск" });
    expect(search).toHaveAttribute("autocomplete", "off");
    expect(search).toHaveAttribute("data-1p-ignore");
    expect(search).toHaveAttribute("data-lpignore", "true");
    expect(search).toHaveAttribute("data-bwignore");
    expect(search).toHaveAttribute("data-form-type", "other");
  });

  it("opens the panel from the filter button and from focusing the search", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    openPanel();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    openPanel();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.focus(screen.getByRole("searchbox", { name: "Поиск" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows a value on click and lists it as a chip with a count on the button", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "GET" }));
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: ["GET"], exclude: [] } });
    expect(chips()).not.toBeNull();
    expect(within(chips() as HTMLElement).getByText("Метод: GET")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "GET" })).toHaveAttribute("aria-pressed", "true");
    expect(filterButton()).toHaveTextContent("1");
  });

  it("the panel footer offers Reset only while a filter is set, with no hint or count", async () => {
    render(<Harness />);
    openPanel();
    const dialog = () => within(screen.getByRole("dialog"));
    expect(dialog().queryByRole("button", { name: "Сбросить" })).toBeNull();
    expect(dialog().queryByText(/Фильтров/)).toBeNull();
    fireEvent.click(dialog().getByRole("button", { name: "GET" }));
    const reset = dialog().getByRole("button", { name: "Сбросить" });
    reset.focus();
    fireEvent.click(reset);
    expect(dialog().getByRole("button", { name: "GET" })).toHaveAttribute("aria-pressed", "false");
    expect(dialog().queryByRole("button", { name: "Сбросить" })).toBeNull();
    await act(async () => {});
    expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
  });

  it("a press shows a value, the «−» action hides it, pressing «−» again unhides", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    openPanel();
    const dialog = () => within(screen.getByRole("dialog"));
    fireEvent.click(dialog().getByRole("button", { name: "GET" }));
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: ["GET"], exclude: [] } });
    expect(dialog().getByRole("button", { name: "GET" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(dialog().getByRole("button", { name: "Скрыть GET" }));
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: [], exclude: ["GET"] } });
    const tag = dialog().getByRole("button", { name: "Не скрывать GET" }).closest("[data-mode]");
    expect(tag).toHaveAttribute("data-action", "persistent");
    fireEvent.click(dialog().getByRole("button", { name: "Не скрывать GET" }));
    expect(onValue).toHaveBeenLastCalledWith({});
  });

  it("a hidden value shows a red «не» tag", () => {
    render(<Harness />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Скрыть billing" }));
    const chip = (chips() as HTMLElement).querySelector("[data-negated]");
    expect(chip).toHaveTextContent("Сервис: не billing");
    expect(chip).toHaveAttribute("data-color", "red");
    expect(
      within(screen.getByRole("dialog")).getByRole("button", { name: /^НЕ billing/ }),
    ).toBeInTheDocument();
  });

  it("hides with Alt+click and Shift+Enter", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "GET" }), { altKey: true });
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: [], exclude: ["GET"] } });
    fireEvent.keyDown(screen.getByRole("button", { name: "POST" }), {
      key: "Enter",
      shiftKey: true,
    });
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: [], exclude: ["GET", "POST"] } });
  });

  it("does not allow hiding every value of a fixed field", () => {
    const onValue = vi.fn();
    render(<Harness initial={{ state: { include: [], exclude: ["active"] } }} onValue={onValue} />);
    openPanel();
    const inactive = screen.getByRole("button", { name: "Неактивные" });
    fireEvent.click(inactive, { altKey: true });
    expect(onValue).toHaveBeenLastCalledWith({
      state: { include: ["inactive"], exclude: ["active"] },
    });
    // Shown, and hiding it would hide everything: the next click clears it instead.
    fireEvent.click(screen.getByRole("button", { name: "Неактивные" }));
    expect(onValue).toHaveBeenLastCalledWith({ state: { include: [], exclude: ["active"] } });
  });

  it("allows hiding every value of an open field", () => {
    const onValue = vi.fn();
    render(
      <Harness
        initial={{ service: { include: [], exclude: ["billing", "catalog"] } }}
        onValue={onValue}
      />,
    );
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "events" }), { altKey: true });
    expect(onValue).toHaveBeenLastCalledWith({
      service: { include: [], exclude: ["billing", "catalog", "events"] },
    });
  });

  it("removes a tag", () => {
    const onValue = vi.fn();
    render(<Harness initial={{ method: { include: [], exclude: ["GET"] } }} onValue={onValue} />);
    fireEvent.click(screen.getByRole("button", { name: "Убрать фильтр «Метод: не GET»" }));
    expect(onValue).toHaveBeenLastCalledWith({});
    expect(chips()).toBeNull();
  });

  it("clears every field of the screen at once and leaves foreign keys alone", () => {
    const onValue = vi.fn();
    render(
      <Harness
        initial={{
          method: { include: ["GET"], exclude: [] },
          other: { include: ["x"], exclude: [] },
        }}
        onValue={onValue}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Сбросить все" }));
    expect(onValue).toHaveBeenLastCalledWith({ other: { include: ["x"], exclude: [] } });
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="l">
        <SmartFilter.Root fields={FIELDS}>
          <SmartFilter.Toolbar />
        </SmartFilter.Root>
      </ControlSizeProvider>,
    );
    expect(filterButton()).toHaveAttribute("data-size", "l");
  });

  it("the chips row rises in when the first filter applies", () => {
    function Filtered({ value }: { value: SmartFilterValue }) {
      return (
        <SmartFilter.Root fields={FIELDS} value={value}>
          <SmartFilter.Chips data-testid="chips" />
        </SmartFilter.Root>
      );
    }
    const { rerender } = render(<Filtered value={{}} />);
    expect(screen.queryByTestId("chips")).toBeNull();
    rerender(<Filtered value={{ method: { include: ["GET"], exclude: [] } }} />);
    expect(screen.getByTestId("chips")).toHaveClass(enterMotion.enter);
  });

  it("tag row: tags take the tag tier (never below s), «add» is a text action of their type and opens the panel", () => {
    const value = { method: { include: ["GET"], exclude: [] } };
    const { rerender } = render(
      <SmartFilter.Root fields={FIELDS} size="xs" defaultValue={value}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>,
    );
    const row = () => chips() as HTMLElement;
    const add = () => within(row()).getByRole("button", { name: "Фильтр" });
    expect(row().firstElementChild).toHaveAttribute("data-size", "s");
    // LinkButton runs one tier larger than Badge: an xs link has the 12px text of an s tag.
    expect(add()).toHaveAttribute("data-size", "xs");

    rerender(
      <SmartFilter.Root fields={FIELDS} size="l" defaultValue={value}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>,
    );
    expect(row().firstElementChild).toHaveAttribute("data-size", "l");
    expect(add()).toHaveAttribute("data-size", "s");

    fireEvent.click(add());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("filters the panel by the search text and offers the text search row", async () => {
    const onSearch = vi.fn();
    render(<Harness onSearch={onSearch} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("searchbox", { name: "Поиск" }));
    await user.keyboard("ge");
    expect(onSearch).toHaveBeenLastCalledWith("ge");
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Искать «ge»")).toBeInTheDocument();
    // GET matches, POST does not; services and states have no match.
    expect(within(dialog).getByRole("button", { name: "GET" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "POST" })).toBeNull();
    expect(within(dialog).getByText(/Сервис, Состояние — нет совпадений/)).toBeInTheDocument();
    // The row pins the query: a chip, the field empty and focused, the panel kept for filters.
    await user.click(within(dialog).getByText("Искать «ge»"));
    expect(within(chips() as HTMLElement).getByText("Поиск: ge")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Поиск" })).toHaveValue("");
    expect(screen.getByRole("searchbox", { name: "Поиск" })).toHaveFocus();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onSearch).toHaveBeenLastCalledWith("ge");
  });

  it("Enter and Escape in the search close the panel", async () => {
    render(<Harness />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("searchbox", { name: "Поиск" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Focus leaves the search and comes back: the panel opens again, Escape closes it.
    await user.tab({ shift: true });
    await user.tab();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Tab walks a value and its «−»; Enter and Space show the value, a second press clears it", async () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    const user = userEvent.setup();
    openPanel();
    const dialog = within(screen.getByRole("dialog"));
    dialog.getByRole("button", { name: "GET" }).focus();
    await user.tab();
    expect(dialog.getByRole("button", { name: "Скрыть GET" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(dialog.getByRole("button", { name: "GET" })).toHaveFocus();
    await user.keyboard(" ");
    expect(onValue).toHaveBeenLastCalledWith({ method: { include: ["GET"], exclude: [] } });
    await user.keyboard("{Enter}");
    expect(onValue).toHaveBeenLastCalledWith({});
  });

  it("collapses a long field to «ещё N» and expands it", () => {
    const many: SmartFilterField[] = [
      {
        key: "svc",
        label: "Сервис",
        options: Array.from({ length: 8 }, (_, i) => ({ value: `s${i}`, label: `service-${i}` })),
      },
    ];
    render(<Harness fields={many} collapsedLimit={3} />);
    openPanel();
    expect(screen.queryByRole("button", { name: "service-5" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Ещё 5/ }));
    expect(screen.getByRole("button", { name: "service-5" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ещё/ })).toBeNull();
  });

  it("keeps a selected value that is gone from the options visible", () => {
    render(<Harness initial={{ service: { include: ["deleted-svc"], exclude: [] } }} />);
    openPanel();
    expect(
      within(screen.getByRole("dialog")).getByRole("button", { name: "deleted-svc" }),
    ).toBeInTheDocument();
  });

  it("without fields renders only the search", () => {
    render(<Harness fields={[]} />);
    expect(screen.queryByRole("button", { name: /Фильтр/ })).toBeNull();
    expect(screen.getByRole("searchbox", { name: "Поиск" })).toBeInTheDocument();
  });

  it("works uncontrolled", () => {
    render(
      <SmartFilter.Root fields={FIELDS}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>,
    );
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "GET" }));
    expect(chips()).not.toBeNull();
  });

  it("takes custom labels", () => {
    render(
      <SmartFilter.Root fields={FIELDS} labels={{ filter: "Filter", searchPlaceholder: "Search" }}>
        <SmartFilter.Toolbar />
      </SmartFilter.Root>,
    );
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });

  it("throws outside Root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SmartFilter.Toolbar />)).toThrow(/SmartFilter/);
    spy.mockRestore();
  });
});

describe("SmartFilter range, single and grouped fields", () => {
  const RANGE_FIELDS: SmartFilterField[] = [
    { key: "amount", label: "Сумма", kind: "range", formatValue: (n) => `${n} ₽` },
    { key: "period", label: "Период", kind: "date-range" },
    {
      key: "stage",
      label: "Этап",
      multiple: false,
      options: [
        { value: "new", label: "Новый" },
        { value: "won", label: "Выигран" },
      ],
    },
    {
      key: "owner",
      label: "Владелец",
      options: [
        { value: "team", label: "Моя команда", group: "Тип" },
        { value: "anna", label: "Анна Ким", group: "Сотрудник" },
        { value: "mine", label: "Мои", group: "Тип" },
      ],
    },
  ];

  it("types a number range and shows a readable chip; removing it clears the bounds", async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<Harness fields={RANGE_FIELDS} onValue={onValue} />);
    openPanel();
    await user.type(screen.getByRole("textbox", { name: "Сумма, от" }), "1000");
    await user.type(screen.getByRole("textbox", { name: "Сумма, до" }), "5 000");
    expect(onValue).toHaveBeenLastCalledWith({ amount: { from: 1000, to: 5000 } });
    const chip = within(chips() as HTMLElement).getByText("Сумма: 1000 ₽–5000 ₽");
    expect(chip).toBeInTheDocument();
    expect(filterButton()).toHaveTextContent("1");
    fireEvent.click(screen.getByRole("button", { name: "Убрать фильтр «Сумма: 1000 ₽–5000 ₽»" }));
    expect(onValue).toHaveBeenLastCalledWith({});
    expect(screen.getByRole("textbox", { name: "Сумма, от" })).toHaveValue("");
  });

  it("chips an open-ended range with «от» / «до» and marks an inverted range invalid", async () => {
    const user = userEvent.setup();
    render(<Harness fields={RANGE_FIELDS} initial={{ amount: { from: null, to: 300 } }} />);
    expect(within(chips() as HTMLElement).getByText("Сумма: до 300 ₽")).toBeInTheDocument();
    openPanel();
    await user.type(screen.getByRole("textbox", { name: "Сумма, от" }), "900");
    expect(screen.getByRole("textbox", { name: "Сумма, от" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("chips a date range in the Datepicker's own words", () => {
    render(
      <Harness
        fields={RANGE_FIELDS}
        initial={{ period: { from: new Date(2026, 2, 1), to: new Date(2026, 2, 15, 23, 59) } }}
      />,
    );
    const chip = within(chips() as HTMLElement).getByText(/^Период: /);
    expect(chip.textContent).toMatch(/1.*15 мар/);
  });

  it("a period with `calendar` gets presets and «Применить», and the chip names the preset", async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    const today = new Date(2026, 2, 20);
    const fields: SmartFilterField[] = [
      {
        key: "period",
        label: "Период",
        kind: "date-range",
        calendar: { presets: DEFAULT_DATEPICKER_PRESETS, months: 2, footer: true, today },
      },
    ];
    render(
      <Harness
        fields={fields}
        onValue={onValue}
        initial={{ period: { from: new Date(2026, 2, 1), to: today } }}
      />,
    );
    expect(within(chips() as HTMLElement).getByText("Период: Этот месяц")).toBeInTheDocument();
    openPanel();
    const trigger = screen
      .getAllByRole("button", { name: "Период: Этот месяц" })
      .find((button) => button.getAttribute("aria-haspopup") === "dialog");
    await user.click(trigger as HTMLElement);
    expect(screen.getByRole("button", { name: "Применить" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Прошлый месяц" }));
    expect(onValue).toHaveBeenLastCalledWith({
      period: { from: new Date(2026, 1, 1), to: expect.any(Date) },
    });
    expect(within(chips() as HTMLElement).getByText("Период: Прошлый месяц")).toBeInTheDocument();
  });

  it("a single-value field picks one value and has no hide action", () => {
    const onValue = vi.fn();
    render(<Harness fields={RANGE_FIELDS} onValue={onValue} />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Новый" }));
    fireEvent.click(screen.getByRole("button", { name: "Выигран" }));
    expect(onValue).toHaveBeenLastCalledWith({ stage: { include: ["won"], exclude: [] } });
    expect(screen.queryByRole("button", { name: "Скрыть Новый" })).toBeNull();
    expect(screen.getByRole("button", { name: "Скрыть Анна Ким" })).toBeInTheDocument();
  });

  it("groups the values of one field under their headings", () => {
    render(<Harness fields={RANGE_FIELDS} />);
    openPanel();
    const type = screen.getByRole("group", { name: "Тип" });
    expect(within(type).getByRole("button", { name: "Моя команда" })).toBeInTheDocument();
    expect(within(type).getByRole("button", { name: "Мои" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Сотрудник" })).getByRole("button", {
        name: "Анна Ким",
      }),
    ).toBeInTheDocument();
  });

  it("a toolbar without search keeps only the filter button", () => {
    render(
      <SmartFilter.Root fields={RANGE_FIELDS}>
        <SmartFilter.Toolbar searchable={false} />
      </SmartFilter.Root>,
    );
    expect(screen.queryByRole("searchbox")).toBeNull();
    openPanel();
    expect(screen.getByRole("textbox", { name: "Сумма, от" })).toBeInTheDocument();
  });
});

describe("SmartFilter.Toolbar compact button", () => {
  function renderAt(width: number, value: SmartFilterValue = {}) {
    const spy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.slot === "smart-filter-toolbar" ? width : 0;
    });
    const offset = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(100);
    const result = render(
      <SmartFilter.Root fields={FIELDS} defaultValue={value}>
        <SmartFilter.Toolbar />
      </SmartFilter.Root>,
    );
    spy.mockRestore();
    offset.mockRestore();
    return result;
  }

  it("keeps the label while the search has room beside the button", () => {
    renderAt(600);
    const button = screen.getByRole("button", { name: "Фильтр" });
    expect(button).toHaveTextContent("Фильтр");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("shows only the icon in a narrow toolbar, named by its label", () => {
    renderAt(200);
    const button = screen.getByRole("button", { name: "Фильтр" });
    expect(button).toHaveAttribute("aria-label", "Фильтр");
    expect(button).toHaveAttribute("data-icon-only", "true");
  });

  it("keeps the count beside the icon while filters apply", () => {
    renderAt(200, { service: { include: ["billing"], exclude: [] } });
    const button = filterButton();
    expect(button).not.toHaveAttribute("aria-label");
    expect(button).toHaveTextContent("1");
  });
});

describe("SmartFilter.Toolbar layout", () => {
  const section = () => screen.getByRole("button", { name: /^Фильтр/ });
  /** The combined toolbar at a width (jsdom lays out nothing: the toolbar reports `width`). */
  function renderCombined(value: SmartFilterValue = {}, width = 600) {
    const spy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.slot === "smart-filter-toolbar" ? width : 0;
    });
    const offset = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(100);
    const result = render(
      <SmartFilter.Root fields={FIELDS} defaultValue={value}>
        <SmartFilter.Toolbar layout="combined" />
      </SmartFilter.Root>,
    );
    spy.mockRestore();
    offset.mockRestore();
    return result;
  }

  it("combined: the filter is a section of the search field, after the input, always shown", () => {
    renderCombined();
    const field = screen.getByRole("searchbox", { name: "Поиск" });
    const button = section();
    expect(button).toHaveAttribute("data-field-section", "");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveTextContent("Фильтр");
    expect(button).not.toHaveAttribute("aria-label");
    // One frame: the section sits beside the input inside the same wrapper, never inside it.
    expect(button.parentElement).toBe(field.parentElement);
    expect(field.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("combined: the clear «×» comes with the text, before the divider", async () => {
    const user = userEvent.setup();
    renderCombined();
    await user.type(screen.getByRole("searchbox"), "GET");
    const clear = screen.getByRole("button", { name: "Очистить поиск" });
    expect(clear.nextElementSibling).toBe(section());
    expect(
      clear.compareDocumentPosition(section()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("combined: Tab reaches the section after the search, Enter and Space open, Escape closes", async () => {
    const user = userEvent.setup();
    renderCombined();
    await user.tab();
    expect(screen.getByRole("searchbox")).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.tab();
    expect(section()).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog", { name: "Фильтр" })).toBeInTheDocument();
    expect(section()).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await act(async () => {});
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(section()).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("dialog", { name: "Фильтр" })).toBeInTheDocument();
  });

  it("combined: the count Badge joins the name while filters apply", () => {
    renderCombined({ service: { include: ["billing"], exclude: [] } });
    expect(section()).not.toHaveAttribute("aria-label");
    expect(section()).toHaveAccessibleName(/^Фильтр\s*1$/);
  });

  it("combined without a search is the plain filter button", () => {
    render(
      <SmartFilter.Root fields={FIELDS}>
        <SmartFilter.Toolbar layout="combined" searchable={false} />
      </SmartFilter.Root>,
    );
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(section()).not.toHaveAttribute("data-field-section");
  });

  it("empty fields leave only the search, in either layout", () => {
    render(
      <SmartFilter.Root fields={[]}>
        <SmartFilter.Toolbar layout="combined" />
      </SmartFilter.Root>,
    );
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("combined: a narrow toolbar keeps the section to its icon, named «Фильтр»", () => {
    renderCombined({}, 200);
    const button = section();
    expect(button).toHaveAttribute("aria-label", "Фильтр");
    expect(button).toHaveAttribute("data-icon-only", "true");
    expect(button).not.toHaveTextContent("Фильтр");
  });
});

describe("SmartFilter search chip", () => {
  const field = () => screen.getByRole("searchbox", { name: "Поиск" });
  const searchChip = () => document.querySelector('[data-slot="smart-filter-chips"] [data-search]');

  it("Enter pins the typed query as the first chip and empties the field, which keeps the focus", async () => {
    const onSearch = vi.fn();
    render(<Harness initial={{ method: { include: ["GET"], exclude: [] } }} onSearch={onSearch} />);
    const user = userEvent.setup();
    await user.click(field());
    await user.keyboard("Евгений");
    expect(onSearch).toHaveBeenLastCalledWith("Евгений");
    const calls = onSearch.mock.calls.length;
    await user.keyboard("{Enter}");
    expect(field()).toHaveValue("");
    expect(field()).toHaveFocus();
    // The query was already live: pinning it asks nothing new of the owner.
    expect(onSearch).toHaveBeenCalledTimes(calls);
    const row = chips() as HTMLElement;
    expect(row.firstElementChild).toBe(searchChip());
    expect(searchChip()).toHaveTextContent("Поиск: Евгений");
    expect(within(row).getByText("Метод: GET")).toBeInTheDocument();
    expect(screen.getByText("Поиск «Евгений» добавлен к фильтрам")).toBeInTheDocument();
    // The panel stays for the filters.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("typing after a pin finds values without touching the query; Enter replaces it", async () => {
    const onSearch = vi.fn();
    render(<Harness onSearch={onSearch} />);
    const user = userEvent.setup();
    await user.click(field());
    await user.keyboard("Евгений{Enter}");
    onSearch.mockClear();
    await user.keyboard("ge");
    expect(onSearch).not.toHaveBeenCalled();
    expect(searchChip()).toHaveTextContent("Поиск: Евгений");
    expect(
      within(screen.getByRole("dialog")).getByRole("button", { name: "GET" }),
    ).toBeInTheDocument();
    // Escape clears only the typed text.
    await user.keyboard("{Escape}");
    expect(field()).toHaveValue("");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(searchChip()).toHaveTextContent("Поиск: Евгений");
    await user.keyboard("Иван{Enter}");
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenLastCalledWith("Иван");
    expect(searchChip()).toHaveTextContent("Поиск: Иван");
  });

  it("the chip's × clears the search; «Сбросить все» clears it with the filters", async () => {
    const onSearch = vi.fn();
    const onValue = vi.fn();
    render(
      <Harness
        initial={{ method: { include: ["GET"], exclude: [] } }}
        onSearch={onSearch}
        onValue={onValue}
      />,
    );
    const user = userEvent.setup();
    await user.click(field());
    await user.keyboard("Евгений{Enter}");
    await user.click(screen.getByRole("button", { name: "Убрать поиск «Евгений»" }));
    expect(onSearch).toHaveBeenLastCalledWith("");
    expect(searchChip()).toBeNull();
    await user.click(field());
    await user.keyboard("Иван{Enter}");
    await user.click(screen.getByRole("button", { name: "Сбросить все" }));
    expect(onSearch).toHaveBeenLastCalledWith("");
    expect(onValue).toHaveBeenLastCalledWith({});
    expect(chips()).toBeNull();
  });

  it("Enter in an empty field closes the panel and pins nothing", async () => {
    const onSearch = vi.fn();
    render(<Harness onSearch={onSearch} />);
    const user = userEvent.setup();
    await user.click(field());
    await user.keyboard("   {Enter}");
    expect(searchChip()).toBeNull();
    expect(onSearch).not.toHaveBeenCalledWith("   ".trim() || "x");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a search-only toolbar pins the query too", async () => {
    render(
      <SmartFilter.Root fields={[]}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>,
    );
    const user = userEvent.setup();
    await user.click(field());
    await user.keyboard("Евгений{Enter}");
    expect(searchChip()).toHaveTextContent("Поиск: Евгений");
    expect(field()).toHaveValue("");
  });

  it("a query set from outside stands as the chip", () => {
    render(
      <SmartFilter.Root fields={FIELDS} defaultSearch="Евгений">
        <SmartFilter.Toolbar layout="combined" />
        <SmartFilter.Chips />
      </SmartFilter.Root>,
    );
    expect(field()).toHaveValue("");
    expect(searchChip()).toHaveTextContent("Поиск: Евгений");
  });
});

describe("SmartFilter.Toolbar fit near the threshold", () => {
  // The search keeps 18rem (288px) beside a 100px labelled button: the threshold is 388px.
  let resize: (() => void) | null = null;
  class FakeResizeObserver {
    constructor(callback: () => void) {
      resize = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  /**
   * A toolbar whose width follows its own form (a host laid out by content): `labelled` wide with
   * the label, `compact` wide with the icon. Returns the flips of the form and the width setter.
   */
  function renderAt(width: { labelled: number; compact: number }) {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const size = { ...width };
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.dataset.slot !== "smart-filter-toolbar") return 0;
      return this.dataset.compact === "true" ? size.compact : size.labelled;
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.tagName !== "BUTTON") return 0;
      return this.closest('[data-compact="true"]') ? 40 : 100;
    });
    const flips: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        flips.push((record.target as HTMLElement).dataset.compact ?? "labelled");
      }
    });
    render(
      <SmartFilter.Root fields={FIELDS}>
        <SmartFilter.Toolbar />
      </SmartFilter.Root>,
    );
    const toolbar = document.querySelector('[data-slot="smart-filter-toolbar"]') as HTMLElement;
    observer.observe(toolbar, { attributeFilter: ["data-compact"] });
    const takeFlips = () => {
      for (const record of observer.takeRecords()) {
        flips.push((record.target as HTMLElement).dataset.compact ?? "labelled");
      }
      return flips.splice(0);
    };
    const resizeTo = (next: { labelled: number; compact: number }) => {
      Object.assign(size, next);
      act(() => resize?.());
    };
    return { toolbar, takeFlips, resizeTo };
  }

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resize = null;
  });

  it("a toolbar that grows by the label's own width settles in one update", () => {
    const { toolbar, takeFlips, resizeTo } = renderAt({ labelled: 600, compact: 600 });
    expect(toolbar).not.toHaveAttribute("data-compact");
    // At the threshold: 380 with the label, 400 with the icon (it gains 20, the label adds 60).
    resizeTo({ labelled: 380, compact: 400 });
    expect(toolbar).toHaveAttribute("data-compact", "true");
    expect(takeFlips().length).toBeLessThanOrEqual(2);
    act(() => resize?.());
    expect(takeFlips()).toEqual([]);
  });

  it("a host whose width jumps past the label settles after one bounce, never looping", () => {
    const { toolbar, takeFlips, resizeTo } = renderAt({ labelled: 600, compact: 600 });
    resizeTo({ labelled: 380, compact: 470 });
    expect(toolbar).toHaveAttribute("data-compact", "true");
    expect(takeFlips().length).toBeLessThanOrEqual(3);
    act(() => resize?.());
    act(() => resize?.());
    expect(takeFlips()).toEqual([]);
  });

  it("narrows to the icon and widens back to the label", () => {
    const { toolbar, takeFlips, resizeTo } = renderAt({ labelled: 600, compact: 600 });
    resizeTo({ labelled: 300, compact: 300 });
    expect(toolbar).toHaveAttribute("data-compact", "true");
    resizeTo({ labelled: 700, compact: 700 });
    expect(toolbar).not.toHaveAttribute("data-compact");
    expect(takeFlips().length).toBeLessThanOrEqual(2);
  });
});
