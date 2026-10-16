import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable, type DataTableColumn, type DataTableSortState } from "./DataTable";
import { DataTableColumnsMenu } from "./DataTableColumnsMenu";

const CELL_WIDTH = 100;
const MOUSE = { pointerId: 1, pointerType: "mouse", button: 0 };

/** A cell that takes a place in its row: a column's cell (a carried head cell keeps its own). */
const placed = (node: Element) => (node as HTMLElement).dataset.columnId !== undefined;

/** jsdom lays nothing out: every cell of a column is 100 px wide, in the order of its row. */
function stubLayout() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    let box = { left: 0, top: 0, width: 600, height: 400 };
    if (placed(this) && this.parentElement) {
      const cells = Array.from(this.parentElement.children).filter(placed);
      box = { left: cells.indexOf(this) * CELL_WIDTH, top: 0, width: CELL_WIDTH, height: 40 };
    }
    return {
      ...box,
      right: box.left + box.width,
      bottom: box.top + box.height,
      x: box.left,
      y: box.top,
      toJSON: () => ({}),
    };
  });
}

beforeEach(stubLayout);
afterEach(() => {
  vi.restoreAllMocks();
});

type Invoice = { id: string; client: string; status: string; total: number };

const INVOICES: Invoice[] = [
  { id: "СЧ-101", client: "ООО «Север»", status: "Оплачен", total: 1200 },
  { id: "СЧ-102", client: "АО «Восток»", status: "Ждёт оплаты", total: 800 },
];

const COLUMNS: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", accessor: "id" },
  { id: "client", header: "Клиент", accessor: "client", sortable: true },
  { id: "status", header: "Статус", accessor: "status" },
  { id: "total", header: "Сумма", accessor: "total", numeric: true, sortable: true },
];

/** With the row-actions column, whose head holds the column chooser (`columnsMenu`). */
const WITH_ACTIONS: DataTableColumn<Invoice>[] = [
  ...COLUMNS,
  { id: "actions", header: "Действия", hideHeader: true, hideable: false, cell: () => "⋯" },
];

type TableProps = Partial<React.ComponentProps<typeof DataTable<Invoice>>>;

function Invoices(props: TableProps) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={INVOICES}
      paging="none"
      getRowKey={(row) => row.id}
      {...props}
    />
  );
}

/** The column ids of the head, in the order on screen. */
const headOrder = () =>
  Array.from(
    screen.getByRole("table").querySelectorAll<HTMLElement>(":scope > thead th[data-column-id]"),
  ).map((cell) => cell.dataset.columnId);
/** The column ids of the first body row. */
const rowOrder = () =>
  // The table itself, not the carried copy in the drag overlay.
  Array.from(
    screen.getByRole("table").querySelectorAll<HTMLElement>(":scope > tbody > tr:first-child > td"),
  ).map((cell) => cell.dataset.columnId ?? "?");
const header = (name: string) => screen.getByRole("columnheader", { name });
/** What a column is picked up and moved by: its sort button, or the plain header itself. */
const grip = (name: string) => within(header(name)).queryByRole("button") ?? header(name);
const announced = (text: string) =>
  screen.getAllByRole("status").some((node) => node.textContent?.includes(text));

describe("DataTable column order", () => {
  it("columns keep their order without the triad: the headers carry nothing", () => {
    render(<Invoices />);
    expect(header("Статус")).not.toHaveAttribute("data-dnd-item");
    expect(header("Статус")).not.toHaveAttribute("tabindex");
  });

  it("draws columns in `columnOrder`; a column it does not list stands after its neighbour", () => {
    render(<Invoices columnOrder={["total", "client", "id"]} />);
    // `status` follows `client`, its neighbour in `columns`.
    expect(headOrder()).toEqual(["total", "client", "status", "id"]);
    expect(rowOrder()).toEqual(["total", "client", "status", "id"]);
  });

  it("the head row is a Dnd sortable list: the header itself is the item, no grip", () => {
    render(<Invoices defaultColumnOrder={[]} />);
    expect(screen.queryByRole("button", { name: /Переместить колонку/ })).toBeNull();
    // A plain header is its own keyboard target.
    const status = header("Статус");
    expect(status).toHaveAttribute("data-dnd-item", "status");
    expect(status).toHaveAttribute("tabindex", "0");
    expect(status).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowLeft Alt+ArrowRight");
    // A sortable one keeps one tab stop, its sort button, which carries the keys.
    const client = header("Клиент");
    expect(client).toHaveAttribute("tabindex", "-1");
    expect(grip("Клиент")).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowLeft Alt+ArrowRight");
  });

  it("only the header is carried, the body stays still; the drop rebuilds it once and fades the column in", async () => {
    const onColumnOrderChange = vi.fn();
    render(<Invoices onColumnOrderChange={onColumnOrderChange} />);
    fireEvent.pointerDown(grip("Сумма"), { ...MOUSE, clientX: 350, clientY: 10 });
    fireEvent.pointerMove(window, { ...MOUSE, clientX: 170, clientY: 10 });
    // The head row: the carried header keeps its column (it stands as the gap), no gap node.
    expect(document.querySelector('thead th[data-dnd-item="total"]')).toHaveAttribute(
      "data-lifted",
    );
    expect(document.querySelector("[data-dnd-gap]")).toBeNull();
    expect(headOrder()).toEqual(["id", "client", "status", "total"]);
    // The body does not move mid-drag.
    expect(rowOrder()).toEqual(["id", "client", "status", "total"]);
    // The carried copy is the header alone.
    const copy = document.querySelector("[data-dnd-overlay] table");
    expect(copy?.querySelector("thead th")?.textContent).toContain("Сумма");
    expect(copy?.querySelector("tbody")).toBeNull();
    expect(onColumnOrderChange).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.pointerUp(window, { ...MOUSE, clientX: 170, clientY: 10 });
    });
    expect(onColumnOrderChange).toHaveBeenCalledWith(["id", "total", "client", "status"]);
    expect(headOrder()).toEqual(["id", "total", "client", "status"]);
    expect(rowOrder()).toEqual(["id", "total", "client", "status"]);
    expect(announced("Сумма: перемещён")).toBe(true);
    // The moved column's body cells fade in where they now stand; the others do not.
    const fades = (id: string) =>
      Array.from(
        screen.getByRole("table").querySelectorAll(`tbody td[data-column-id="${id}"]`),
      ).every((cell) => /enterFade/.test(cell.className));
    expect(fades("total")).toBe(true);
    expect(fades("client")).toBe(false);
  });

  it("Escape puts the column back; nothing is committed and the body never moved", () => {
    const onColumnOrderChange = vi.fn();
    render(<Invoices onColumnOrderChange={onColumnOrderChange} />);
    fireEvent.pointerDown(grip("Сумма"), { ...MOUSE, clientX: 350, clientY: 10 });
    fireEvent.pointerMove(window, { ...MOUSE, clientX: 20, clientY: 10 });
    expect(rowOrder()).toEqual(["id", "client", "status", "total"]);
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.pointerUp(window, { ...MOUSE, clientX: 20, clientY: 10 });
    expect(onColumnOrderChange).not.toHaveBeenCalled();
    expect(rowOrder()).toEqual(["id", "client", "status", "total"]);
    expect(announced("перемещение отменено")).toBe(true);
  });

  it("a click on a header sorts; the click that ends a drag never does", async () => {
    const onSortChange = vi.fn<(sort: DataTableSortState) => void>();
    render(<Invoices defaultColumnOrder={[]} onSortChange={onSortChange} />);
    fireEvent.pointerDown(grip("Клиент"), { ...MOUSE, clientX: 150, clientY: 10 });
    fireEvent.pointerUp(window, { ...MOUSE, clientX: 150, clientY: 10 });
    fireEvent.click(grip("Клиент"));
    expect(onSortChange).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(grip("Клиент"), { ...MOUSE, clientX: 150, clientY: 10 });
    fireEvent.pointerMove(window, { ...MOUSE, clientX: 330, clientY: 10 });
    await act(async () => {
      fireEvent.pointerUp(window, { ...MOUSE, clientX: 330, clientY: 10 });
    });
    expect(headOrder()).toEqual(["id", "status", "total", "client"]);
    fireEvent.click(grip("Клиент"));
    expect(onSortChange).toHaveBeenCalledTimes(1);
  });

  it("a plain header is pulled by itself", async () => {
    render(<Invoices defaultColumnOrder={[]} />);
    fireEvent.pointerDown(header("Статус"), { ...MOUSE, clientX: 250, clientY: 10 });
    fireEvent.pointerMove(window, { ...MOUSE, clientX: 20, clientY: 10 });
    await act(async () => {
      fireEvent.pointerUp(window, { ...MOUSE, clientX: 20, clientY: 10 });
    });
    expect(headOrder()).toEqual(["status", "id", "client", "total"]);
  });

  it("the drop moves the column's width with it: the colgroup keeps every width by column", async () => {
    render(<Invoices defaultColumnOrder={[]} />);
    const table = screen.getByRole("table");
    const cols = () => Array.from(table.querySelectorAll("col"));
    // Frozen widths stand in the colgroup (the stubbed layout: 100 px each); give one its own.
    const totalCol = cols()[3] as HTMLTableColElement;
    totalCol.style.width = "160px";
    act(() => grip("Сумма").focus());
    const user = userEvent.setup();
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    expect(headOrder()).toEqual(["id", "client", "total", "status"]);
    expect(cols()[2]).toBe(totalCol);
  });

  it("Alt + ← / → on a header moves its column and announces the place", async () => {
    const user = userEvent.setup();
    const onColumnOrderChange = vi.fn();
    render(<Invoices onColumnOrderChange={onColumnOrderChange} />);
    act(() => grip("Клиент").focus());
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(onColumnOrderChange).toHaveBeenLastCalledWith(["id", "status", "client", "total"]);
    expect(headOrder()).toEqual(["id", "status", "client", "total"]);
    expect(rowOrder()).toEqual(["id", "status", "client", "total"]);
    expect(announced("Клиент: позиция 3 из 4")).toBe(true);
    act(() => grip("Счёт").focus());
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    // The first place: nothing further back.
    expect(headOrder()).toEqual(["id", "status", "client", "total"]);
  });

  it("columns that hold their place: no grip, and nothing steps over them", async () => {
    const user = userEvent.setup();
    const columns: DataTableColumn<Invoice>[] = [
      ...COLUMNS.map((column) =>
        column.id === "status" ? { ...column, reorderable: false } : column,
      ),
      { id: "actions", header: "Действия", hideHeader: true, cell: () => "⋯" },
    ];
    render(<Invoices columns={columns} defaultColumnOrder={[]} stickyFirstColumn />);
    for (const name of ["Счёт", "Статус", "Действия"]) {
      expect(
        within(header(name)).queryByRole("button", { name: /Переместить колонку/ }),
      ).toBeNull();
    }
    // The pinned first column and the fixed status around it: «Клиент» goes nowhere.
    act(() => grip("Клиент").focus());
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(headOrder()).toEqual(["id", "client", "status", "total", "actions"]);
  });

  it("a hidden column keeps its place: shown again, it comes back where it was", async () => {
    const user = userEvent.setup();
    const onColumnOrderChange = vi.fn();
    render(
      <Invoices
        columns={WITH_ACTIONS}
        defaultHiddenColumns={["client"]}
        onColumnOrderChange={onColumnOrderChange}
        columnsMenu
      />,
    );
    expect(headOrder()).toEqual(["id", "status", "total", "actions"]);
    act(() => grip("Сумма").focus());
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    // In front of «Статус»: the hidden «Клиент» stays right after «Счёт».
    expect(onColumnOrderChange).toHaveBeenLastCalledWith([
      "id",
      "client",
      "total",
      "status",
      "actions",
    ]);
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Клиент" }));
    expect(headOrder()).toEqual(["id", "client", "total", "status", "actions"]);
  });
});

describe("DataTable column chooser with columnOrder", () => {
  it("lists every column in table order; a grip ends each item, a lock where a column holds", async () => {
    const user = userEvent.setup();
    render(
      <Invoices
        columns={WITH_ACTIONS}
        defaultColumnOrder={["total", "id", "client", "status", "actions"]}
        stickyFirstColumn
        columnsMenu
      />,
    );
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    const menu = screen.getByRole("menu");
    expect(within(menu).getByRole("group", { name: "Показывать" })).toBeInTheDocument();
    const items = within(menu).getAllByRole("menuitemcheckbox");
    expect(items.map((item) => item.textContent)).toEqual([
      "Сумма",
      "Счёт",
      "Клиент",
      "Статус",
      "Действия",
    ]);
    const menuGrip = within(menu).getByRole("button", { name: "Переместить колонку Клиент" });
    expect(menuGrip).toHaveAttribute("tabindex", "-1");
    expect(menuGrip.closest("[data-dnd-item]")?.lastElementChild).toBe(menuGrip);
    expect(items[2]).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    // The pinned first column on screen («Сумма») holds its place: a lock, no keys.
    expect(within(menu).queryByRole("button", { name: "Переместить колонку Сумма" })).toBeNull();
    expect(items[0]).not.toHaveAttribute("aria-keyshortcuts");
    expect(within(items[0]?.parentElement as HTMLElement).getByRole("img")).toBeInTheDocument();
  });

  it("Alt + ↑ / ↓ on an item moves its column; the focus stays on the item", async () => {
    const user = userEvent.setup();
    const onColumnOrderChange = vi.fn();
    render(
      <Invoices columns={WITH_ACTIONS} onColumnOrderChange={onColumnOrderChange} columnsMenu />,
    );
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    const client = screen.getByRole("menuitemcheckbox", { name: "Клиент" });
    act(() => client.focus());
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(onColumnOrderChange).toHaveBeenLastCalledWith([
      "id",
      "status",
      "client",
      "total",
      "actions",
    ]);
    expect(headOrder()).toEqual(["id", "status", "client", "total", "actions"]);
    expect(screen.getByRole("menuitemcheckbox", { name: "Клиент" })).toHaveFocus();
    // The menu stays open, and the arrows without Alt still move the focus.
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Сумма" })).toHaveFocus();
  });

  it("«Исходный порядок» puts the order of `columns` back; off while it is that order", async () => {
    const user = userEvent.setup();
    const onColumnOrderChange = vi.fn();
    render(
      <Invoices
        columns={WITH_ACTIONS}
        defaultColumnOrder={[]}
        onColumnOrderChange={onColumnOrderChange}
        columnsMenu
      />,
    );
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    expect(screen.getByRole("menuitem", { name: "Исходный порядок" })).toBeDisabled();
    await user.keyboard("{Escape}");
    act(() => grip("Сумма").focus());
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    expect(headOrder()).toEqual(["id", "client", "total", "status", "actions"]);
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    await user.click(screen.getByRole("menuitem", { name: "Исходный порядок" }));
    expect(onColumnOrderChange).toHaveBeenLastCalledWith([
      "id",
      "client",
      "status",
      "total",
      "actions",
    ]);
    expect(headOrder()).toEqual(["id", "client", "status", "total", "actions"]);
  });

  it("without the triad the chooser only shows and hides", async () => {
    const user = userEvent.setup();
    render(<Invoices columns={WITH_ACTIONS} columnsMenu />);
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    expect(screen.queryByRole("button", { name: /Переместить колонку/ })).toBeNull();
    expect(screen.queryByRole("menuitem", { name: "Исходный порядок" })).toBeNull();
  });

  it("stands only in the head of the row-actions column: without one it renders nothing and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Invoices columnsMenu />);
    expect(screen.queryByRole("button", { name: "Колонки" })).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("DataTableColumnsMenu"));
  });
});

describe("DataTableColumnsMenu", () => {
  function Page({ reorder = true }: { reorder?: boolean }) {
    const [hidden, setHidden] = React.useState<string[]>(["status"]);
    const [order, setOrder] = React.useState<string[]>([]);
    return (
      <>
        <DataTableColumnsMenu
          columns={COLUMNS}
          hiddenColumns={hidden}
          onHiddenColumnsChange={setHidden}
          columnOrder={order}
          onColumnOrderChange={reorder ? setOrder : undefined}
        />
        <Invoices hiddenColumns={hidden} columnOrder={order} />
      </>
    );
  }

  it("a labelled soft button with the count of shown columns, bound to the table's state", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const trigger = screen.getByRole("button", { name: "Колонки 3" });
    expect(trigger).toHaveAttribute("data-variant", "soft");
    await user.click(trigger);
    expect(screen.getByRole("group", { name: "Показывать" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Статус" }));
    expect(headOrder()).toEqual(["id", "client", "status", "total"]);
    expect(screen.getByRole("button", { name: "Колонки 4" })).toBeInTheDocument();
  });

  it("Alt + ↑ / ↓ on an item reorders the table's columns", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByRole("button", { name: "Колонки 3" }));
    act(() => screen.getByRole("menuitemcheckbox", { name: "Счёт" }).focus());
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(headOrder()).toEqual(["client", "id", "total"]);
    expect(screen.getByRole("menuitemcheckbox", { name: "Счёт" })).toHaveFocus();
  });

  it("without `onColumnOrderChange` it only shows and hides", async () => {
    const user = userEvent.setup();
    render(<Page reorder={false} />);
    await user.click(screen.getByRole("button", { name: "Колонки 3" }));
    expect(screen.queryByRole("button", { name: /Переместить колонку/ })).toBeNull();
  });
});
