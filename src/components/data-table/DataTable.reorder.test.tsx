import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { moveBefore } from "@/components/dnd/Dnd";
import swapMotion from "@/internal/swapMotion.module.css";

import { DataTable, type DataTableColumn, type DataTableSortState } from "./DataTable";
import styles from "./DataTable.module.css";

const ROW_HEIGHT = 20;
const POINTER = { pointerId: 1, pointerType: "mouse", button: 0 };

/** jsdom lays nothing out: sortable rows stack in document order (a lifted one takes no room). */
function stubLayout() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    let box = { left: 0, top: 0, width: 300, height: 400 };
    if (this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap")) {
      const siblings = Array.from(this.parentElement?.children ?? []).filter(
        (node) => node.hasAttribute("data-dnd-item") || node.hasAttribute("data-dnd-gap"),
      );
      const top =
        siblings.slice(0, siblings.indexOf(this)).filter((n) => !n.hasAttribute("data-lifted"))
          .length * ROW_HEIGHT;
      const hidden = this.hasAttribute("data-lifted");
      box = { left: 0, top, width: hidden ? 0 : 300, height: hidden ? 0 : ROW_HEIGHT };
    } else if (this.tagName === "TD") {
      box = { left: 0, top: 0, width: 100, height: ROW_HEIGHT };
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

type Stage = { id: string; name: string; deals: number; pipeline: string };

const STAGES: Stage[] = [
  { id: "a", name: "Лиды", deals: 40, pipeline: "Продажи" },
  { id: "b", name: "Переговоры", deals: 12, pipeline: "Продажи" },
  { id: "c", name: "Договор", deals: 5, pipeline: "Продажи" },
];

const columns: DataTableColumn<Stage>[] = [
  { id: "name", header: "Этап", accessor: "name", sortable: true },
  { id: "deals", header: "Сделки", accessor: "deals", numeric: true, sortable: true },
];

type TableProps = Partial<React.ComponentProps<typeof DataTable<Stage>>>;

function Pipeline({
  onMove,
  initial = STAGES,
  ...props
}: TableProps & {
  onMove?: (id: React.Key, beforeId: React.Key | null) => void | Promise<void>;
  initial?: Stage[];
}) {
  const [rows, setRows] = React.useState(initial);
  return (
    <DataTable
      columns={columns}
      rows={rows}
      paging="none"
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      onReorder={async (id, beforeId) => {
        await onMove?.(id, beforeId);
        setRows((current) =>
          moveBefore(current, String(id), beforeId as string | null, (r) => r.id),
        );
      }}
      {...props}
    />
  );
}

const order = () =>
  Array.from(document.querySelectorAll<HTMLElement>("tbody > tr[data-dnd-item]")).map(
    (row) => row.dataset.dndItem,
  );
const handle = (name: string) => screen.getByRole("button", { name: `Переместить строку ${name}` });
const announced = (text: string) =>
  screen.getAllByRole("status").some((node) => node.textContent?.includes(text));

describe("DataTable onReorder", () => {
  it("drags a row by its handle: a gap row spans every column, the copy keeps the table", async () => {
    const onMove = vi.fn();
    render(<Pipeline onMove={onMove} />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);

    fireEvent.pointerDown(handle("Лиды"), { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 25 });
    const gap = document.querySelector<HTMLTableRowElement>("tr[data-dnd-gap]");
    expect(gap?.parentElement?.tagName).toBe("TBODY");
    // Handle column + two data columns.
    expect(gap?.cells[0]?.colSpan).toBe(3);
    const copy = document.querySelector("[data-dnd-overlay] table");
    expect(copy?.querySelectorAll("col")).toHaveLength(3);
    expect(copy?.querySelector("tbody > tr")?.textContent).toContain("Лиды");

    await act(async () => {
      fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 25 });
    });
    expect(onMove).toHaveBeenCalledWith("a", "c");
    expect(order()).toEqual(["b", "a", "c"]);
  });

  it("Escape cancels a row drag: the row goes back to its place", () => {
    const onMove = vi.fn();
    render(<Pipeline onMove={onMove} />);
    fireEvent.pointerDown(handle("Лиды"), { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 25 });
    expect(document.querySelector("tr[data-dnd-gap]")).not.toBeNull();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 25 });
    expect(onMove).not.toHaveBeenCalled();
    expect(document.querySelector("tr[data-dnd-gap]")).toBeNull();
    expect(order()).toEqual(["a", "b", "c"]);
    expect(announced("отменено")).toBe(true);
  });

  it("the handle, not the row, carries the move keys and the role description", () => {
    render(<Pipeline />);
    expect(handle("Лиды")).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    expect(handle("Лиды")).toHaveAttribute("aria-roledescription");
    const row = handle("Лиды").closest("tr");
    expect(row).not.toHaveAttribute("aria-keyshortcuts");
    expect(row).not.toHaveAttribute("aria-roledescription");
  });

  it("moves a row with Alt+↑ / ↓ on its handle and announces the place", async () => {
    const onMove = vi.fn();
    render(<Pipeline onMove={onMove} />);
    await act(async () => {
      fireEvent.keyDown(handle("Лиды"), { key: "ArrowDown", altKey: true });
    });
    expect(onMove).toHaveBeenCalledWith("a", "c");
    expect(order()).toEqual(["b", "a", "c"]);
    expect(announced("Лиды: позиция 2 из 3")).toBe(true);
  });

  it("keeps the row in place busy while saving; a rejection moves it back", async () => {
    let reject: (reason: unknown) => void = () => {};
    const onMove = () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      });
    render(<Pipeline onMove={onMove} />);
    await act(async () => {
      fireEvent.keyDown(handle("Лиды"), { key: "ArrowDown", altKey: true });
    });
    expect(order()).toEqual(["b", "a", "c"]);
    const row = document.querySelector('tr[data-dnd-item="a"]');
    expect(row).toHaveAttribute("aria-busy", "true");
    // The grip is busy (Dnd's busy handle), not replaced.
    expect(handle("Лиды")).toHaveAttribute("aria-busy", "true");
    expect(handle("Лиды")).toBeDisabled();

    await act(async () => {
      reject(new Error("Сервер недоступен"));
    });
    expect(order()).toEqual(["a", "b", "c"]);
    expect(document.querySelector('tr[data-dnd-item="a"]')).not.toHaveAttribute("aria-busy");
    expect(handle("Лиды")).toBeInTheDocument();
  });

  it("is off while sorted by a column: the handle is disabled and says why", async () => {
    const onMove = vi.fn();
    const sort: DataTableSortState = { columnId: "deals", order: "asc" };
    render(<Pipeline onMove={onMove} defaultSort={sort} />);
    // The disabled grip stays a reachable button of its own (no host around it): it opens the hint.
    const grip = handle("Договор");
    expect(grip.tagName).toBe("BUTTON");
    expect(grip).not.toHaveAttribute("data-disabled-host");
    expect(grip).toHaveAttribute("aria-disabled", "true");
    expect(grip).not.toBeDisabled();
    act(() => grip.focus());
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Порядок задан сортировкой. Сбросьте её, чтобы перемещать строки",
    );
    await act(async () => {
      fireEvent.keyDown(grip, { key: "ArrowDown", altKey: true });
    });
    fireEvent.pointerDown(grip, { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 45 });
    expect(document.querySelector("[data-lifted]")).toBeNull();
    fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 45 });
    expect(onMove).not.toHaveBeenCalled();
  });

  it("a press or a click on the handle never opens the row", () => {
    const onRowClick = vi.fn();
    render(<Pipeline onRowClick={onRowClick} />);
    fireEvent.click(handle("Переговоры"));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Переговоры"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("the grip ends the row by default; the checkbox leads", () => {
    render(<Pipeline selectable />);
    const row = document.querySelector('tr[data-dnd-item="b"]') as HTMLTableRowElement;
    expect(row.lastElementChild).toContainElement(handle("Переговоры"));
    expect(row.cells[0]?.querySelector('input[type="checkbox"]')).not.toBeNull();
    const head = document.querySelector("thead > tr") as HTMLTableRowElement;
    // One trailing cell over the grips, empty in the head.
    expect(head.cells).toHaveLength(row.cells.length);
    expect(head.lastElementChild).toBeEmptyDOMElement();
    expect(document.querySelector("[data-reorder-handle]")).toHaveAttribute(
      "data-reorder-handle",
      "end",
    );
  });

  it('reorderHandle="start": the grip column leads, the checkbox follows', () => {
    render(<Pipeline selectable reorderHandle="start" />);
    const row = document.querySelector('tr[data-dnd-item="b"]') as HTMLTableRowElement;
    expect(row.cells[0]).toContainElement(handle("Переговоры"));
    expect(row.cells[1]?.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(row.lastElementChild).not.toHaveClass(styles.endCell as string);
  });

  it("with stickyLastColumn the end grip sticks, the last column right before it", () => {
    render(<Pipeline stickyLastColumn />);
    const row = document.querySelector('tr[data-dnd-item="b"]') as HTMLTableRowElement;
    expect(row.lastElementChild).toHaveClass(styles.endCellSticky as string);
    expect(row.cells[row.cells.length - 2]).toHaveClass(styles.lastColumnSticky as string);
  });

  it("moves rows only inside their group", async () => {
    const onMove = vi.fn();
    const grouped: Stage[] = [
      ...STAGES,
      { id: "d", name: "Онбординг", deals: 8, pipeline: "Внедрение" },
      { id: "e", name: "Запуск", deals: 3, pipeline: "Внедрение" },
    ];
    render(<Pipeline onMove={onMove} initial={grouped} getRowGroup={(row) => row.pipeline} />);
    const bodies = document.querySelectorAll("table > tbody");
    expect(bodies).toHaveLength(2);
    // The heading row stays first in its group's body.
    expect(bodies[0]?.firstElementChild).toHaveTextContent("Продажи");
    await act(async () => {
      fireEvent.keyDown(handle("Договор"), { key: "ArrowDown", altKey: true });
    });
    expect(onMove).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.keyDown(handle("Запуск"), { key: "ArrowUp", altKey: true });
    });
    expect(onMove).toHaveBeenCalledWith("e", "d");
  });

  it("a row put last on a page stands in front of the first row of the next page", async () => {
    const onMove = vi.fn();
    render(<Pipeline onMove={onMove} paging="pages" pageSize={2} />);
    fireEvent.pointerDown(handle("Лиды"), { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 200 });
    await act(async () => {
      fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 200 });
    });
    expect(onMove).toHaveBeenCalledWith("a", "c");
  });

  it('reorderHandle="row": the whole row is carried and takes the move keys; no grip', async () => {
    const onMove = vi.fn();
    render(<Pipeline onMove={onMove} reorderHandle="row" />);
    expect(screen.queryByRole("button", { name: /Переместить строку/ })).toBeNull();
    const row = document.querySelector('tr[data-dnd-item="a"]') as HTMLTableRowElement;
    expect(row.cells).toHaveLength(2);
    expect(row).toHaveAttribute("tabindex", "0");
    expect(row).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    expect(row).toHaveAttribute("aria-roledescription");

    fireEvent.pointerDown(row.cells[1] as HTMLElement, { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 25 });
    expect(document.querySelector("tr[data-dnd-gap]")).not.toBeNull();
    await act(async () => {
      fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 25 });
    });
    expect(onMove).toHaveBeenCalledWith("a", "c");
    expect(order()).toEqual(["b", "a", "c"]);

    const first = document.querySelector('tr[data-dnd-item="b"]') as HTMLElement;
    await act(async () => {
      fireEvent.keyDown(first, { key: "ArrowDown", altKey: true });
    });
    expect(onMove).toHaveBeenLastCalledWith("b", "c");
    expect(order()).toEqual(["a", "b", "c"]);
    expect(announced("Переговоры: позиция 2 из 3")).toBe(true);
  });

  it('reorderHandle="row": a click still opens the row, the checkbox cell only selects', () => {
    const onRowClick = vi.fn();
    render(<Pipeline reorderHandle="row" onRowClick={onRowClick} selectable />);
    const row = document.querySelector('tr[data-dnd-item="b"]') as HTMLTableRowElement;
    // The row opens in place and moves: one tab stop for both.
    expect(row).toHaveAttribute("tabindex", "0");
    fireEvent.click(screen.getByText("Переговоры"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    const select = row.cells[0] as HTMLElement;
    expect(select).toHaveAttribute("data-dnd-ignore");
    // The press paints the selection over the row under the pointer (jsdom lays nothing out).
    const original = document.elementFromPoint;
    document.elementFromPoint = () => select;
    try {
      fireEvent.pointerDown(select, { ...POINTER, clientX: 10, clientY: 25 });
      fireEvent.pointerMove(window, { ...POINTER, clientX: 10, clientY: 45 });
      expect(document.querySelector("tr[data-dnd-gap]")).toBeNull();
      fireEvent.pointerUp(window, { ...POINTER, clientX: 10, clientY: 45 });
    } finally {
      document.elementFromPoint = original;
    }
  });

  it('source="server": the reordered rows that follow are no new page', async () => {
    const { container } = render(<Pipeline source="server" rowCount={3} scrollHeight={200} />);
    const body = container.querySelector("table > tbody") as HTMLElement;
    const viewport = container.querySelector("table")?.parentElement as HTMLElement;
    viewport.scrollTop = 40;
    await act(async () => {
      fireEvent.keyDown(handle("Лиды"), { key: "ArrowDown", altKey: true });
    });
    expect(order()).toEqual(["b", "a", "c"]);
    expect(container.querySelector("table > tbody")).toBe(body);
    expect(body).not.toHaveClass(swapMotion.swapIn);
    expect(viewport.scrollTop).toBe(40);
  });
});
