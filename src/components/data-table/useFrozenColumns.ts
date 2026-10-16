import * as React from "react";

/** Quiet time after the last container resize before the widths are measured again. */
const RESIZE_SETTLE_MS = 120;

type Frozen = { widths: number[] | null };

const colsOf = (table: HTMLTableElement) => [
  ...table.querySelectorAll<HTMLTableColElement>(":scope > colgroup > col"),
];

function unfreeze(table: HTMLTableElement, frozen: Frozen) {
  frozen.widths = null;
  table.style.tableLayout = "";
  table.style.minWidth = "";
  for (const col of colsOf(table)) col.style.width = "";
}

type Measure = { cols: HTMLTableColElement[]; measured: number[]; minimums: number[] };

/** Writes: the natural layout, so the widths can be measured. */
function release(table: HTMLTableElement) {
  table.style.tableLayout = "";
  for (const col of colsOf(table)) col.style.width = "";
}

/** Reads only: the natural widths of the columns on screen, or null when there is nothing to freeze. */
function measure(table: HTMLTableElement): Measure | null {
  const cols = colsOf(table);
  // The head row, else the first body row with a cell per column (not a group header row).
  const lead =
    table.tHead?.rows[0] ??
    [...table.querySelectorAll<HTMLTableRowElement>(":scope > tbody > tr")].find(
      (row) => row.cells.length === cols.length,
    );
  if (!lead || cols.length !== lead.cells.length) return null;
  const measured = [...lead.cells].map((cell) => cell.getBoundingClientRect().width);
  // Not laid out (hidden, or a test DOM): nothing to freeze.
  if (measured.every((width) => width === 0)) return null;
  // Browsers ignore `min-width` on table cells, so a column's `minWidth` (resolved to px) is
  // enforced here: frozen widths never go below it.
  const minimums = [...lead.cells].map((cell) => parseFloat(getComputedStyle(cell).minWidth) || 0);
  return { cols, measured, minimums };
}

function freeze(table: HTMLTableElement, frozen: Frozen) {
  release(table);
  const result = measure(table);
  if (result) apply(table, frozen, result);
}

/**
 * Tables whose container width settled, frozen again together in one frame: every release, then
 * every measurement, then every write — one layout for all of them, not one per table (a sidebar
 * collapsing resizes every table beside it).
 */
const refreeze = new Map<HTMLTableElement, Frozen>();
let refreezeFrame = 0;

function scheduleRefreeze(table: HTMLTableElement, frozen: Frozen) {
  refreeze.set(table, frozen);
  if (refreezeFrame) return;
  refreezeFrame = requestAnimationFrame(() => {
    refreezeFrame = 0;
    const tables = [...refreeze].filter(([node]) => node.isConnected);
    refreeze.clear();
    for (const [node, state] of tables) {
      state.widths = null;
      node.style.minWidth = "";
      release(node);
    }
    const measured = tables.map(([node]) => measure(node));
    tables.forEach(([node, state], index) => {
      const result = measured[index];
      if (result) apply(node, state, result);
    });
  });
}

function apply(table: HTMLTableElement, frozen: Frozen, { cols, measured, minimums }: Measure) {
  const previous = frozen.widths;
  const next = measured.map((width, index) =>
    Math.max(width, previous?.[index] ?? 0, minimums[index] ?? 0),
  );
  let floor = 0;
  cols.forEach((col, index) => {
    const grows = col.dataset.grow === "true";
    if (!grows) col.style.width = `${next[index]}px`;
    floor += grows ? (minimums[index] ?? 0) : (next[index] ?? 0);
  });
  table.style.tableLayout = "fixed";
  // A `grow` column takes the free width but never less than its `minWidth`: below that the
  // table keeps its width and the container scrolls instead of cells overlapping.
  table.style.minWidth = `${floor}px`;
  frozen.widths = next;
}

/**
 * Stable column widths. The browser sizes columns by the rows on screen, so searching, filtering,
 * paging or opening a row would make every column jump. Once real rows are laid out, the widths
 * are frozen into the colgroup (`table-layout: fixed`); later renders keep them. They are measured
 * again (never narrower than before) when the rendered rows change and content stops fitting, and
 * from scratch when the column set or the container width changes. `grow` columns
 * (`col[data-grow]`) keep taking the free width.
 */
export function useFrozenColumns(
  tableRef: React.RefObject<HTMLTableElement | null>,
  rootRef: React.RefObject<HTMLDivElement | null>,
  /**
   * One key per `<col>`, in order. A new set of columns starts the widths from scratch; the same
   * set in another order (columns that changed places, a carried column's gap) keeps every
   * column's width and only moves it, so nothing reflows while columns reorder.
   */
  slots: readonly string[],
  /** Changes with the rendered rows: widths widen when content no longer fits. */
  rowsKey: unknown,
  /** Real rows are on screen (not loading, empty or error). */
  ready: boolean,
) {
  /** The widths, and the columns and rows they were last checked against. */
  const columnsKey = slots.join("\u0000");
  const frozen = React.useRef<
    Frozen & { columnsKey: string; slots: readonly string[]; rowsKey: unknown }
  >({
    widths: null,
    columnsKey,
    slots,
    rowsKey: undefined,
  });

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    let lastWidth = root.getBoundingClientRect().width;
    let settle: ReturnType<typeof setTimeout> | undefined;
    // While the container width animates (a sidebar collapsing) the fixed layout already follows
    // it; widths are measured again once, after the width has settled — not on every frame.
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? lastWidth;
      if (Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
      clearTimeout(settle);
      settle = setTimeout(() => {
        const table = tableRef.current;
        if (table) scheduleRefreeze(table, frozen.current);
      }, RESIZE_SETTLE_MS);
    });
    observer.observe(root);
    return () => {
      clearTimeout(settle);
      observer.disconnect();
    };
  }, [rootRef, tableRef]);

  // When the rows or columns change: freeze once real rows are laid out; widen a column whose
  // content no longer fits (a longer value, a deeper row). Loading, empty and error states keep
  // the widths.
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    if (frozen.current.columnsKey !== columnsKey) {
      const before = frozen.current.slots;
      const widths = frozen.current.widths;
      frozen.current.columnsKey = columnsKey;
      frozen.current.slots = slots;
      const moved =
        widths !== null &&
        before.length === slots.length &&
        slots.every((slot) => before.includes(slot));
      if (moved) {
        // Every column keeps its width at its new place.
        const next = slots.map((slot) => widths[before.indexOf(slot)] ?? 0);
        colsOf(table).forEach((col, index) => {
          if (col.dataset.grow !== "true") col.style.width = `${next[index]}px`;
        });
        frozen.current.widths = next;
        return;
      }
      unfreeze(table, frozen.current);
    }
    if (!ready) return;
    const newRows = frozen.current.rowsKey !== rowsKey;
    frozen.current.rowsKey = rowsKey;
    if (!frozen.current.widths) {
      freeze(table, frozen.current);
      return;
    }
    // Rows already checked against these widths fit them.
    if (!newRows) return;
    for (const cell of table.querySelectorAll<HTMLTableCellElement>(":scope > tbody > tr > td")) {
      if (cell.scrollWidth > cell.clientWidth + 1) {
        freeze(table, frozen.current);
        return;
      }
    }
  }, [tableRef, columnsKey, slots, rowsKey, ready]);
}
