import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  canExcludeValue,
  matchesSmartFilter,
  matchIndex,
  removeSelectionValue,
  resolveSmartFilterValues,
  toggleSelectionMode,
  withSelection,
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

const openPanel = () => fireEvent.click(screen.getByRole("button", { name: /Фильтр/ }));
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
      withSelection({ f: { include: ["a"], exclude: [] } }, "f", { include: [], exclude: [] }),
    ).toEqual({});
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
    expect(screen.getByRole("button", { name: /Фильтр/ })).toHaveTextContent("1");
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
    await user.click(within(dialog).getByText("Искать «ge»"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Enter and Escape in the search close the panel", async () => {
    render(<Harness />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("searchbox", { name: "Поиск" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
