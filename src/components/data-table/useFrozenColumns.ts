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

function freeze(table: HTMLTableElement, frozen: Frozen) {
  const lead = table.tHead?.rows[0] ?? table.tBodies[0]?.rows[0];
  const cols = colsOf(table);
  if (!lead || cols.length !== lead.cells.length) return;
  const previous = frozen.widths;
  // Measure the natural layout of what is on screen now.
  table.style.tableLayout = "";
  for (const col of cols) col.style.width = "";
  const measured = [...lead.cells].map((cell) => cell.getBoundingClientRect().width);
  // Not laid out (hidden, or a test DOM): nothing to freeze.
  if (measured.every((width) => width === 0)) return;
  // Browsers ignore `min-width` on table cells, so a column's `minWidth` (resolved to px) is
  // enforced here: frozen widths never go below it.
  const minimums = [...lead.cells].map((cell) => parseFloat(getComputedStyle(cell).minWidth) || 0);
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
  /** Changes with the column set: widths start from scratch. */
  columnsKey: string,
  /** Changes with the rendered rows: widths widen when content no longer fits. */
  rowsKey: unknown,
  /** Real rows are on screen (not loading, empty or error). */
  ready: boolean,
) {
  const frozen = React.useRef<Frozen & { columnsKey: string }>({ widths: null, columnsKey });

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
        if (!table) return;
        unfreeze(table, frozen.current);
        freeze(table, frozen.current);
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rowsKey` is the trigger — new rendered rows may no longer fit the frozen widths.
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    if (frozen.current.columnsKey !== columnsKey) {
      frozen.current.columnsKey = columnsKey;
      unfreeze(table, frozen.current);
    }
    if (!ready) return;
    if (!frozen.current.widths) {
      freeze(table, frozen.current);
      return;
    }
    for (const cell of table.querySelectorAll<HTMLTableCellElement>(":scope > tbody > tr > td")) {
      if (cell.scrollWidth > cell.clientWidth + 1) {
        freeze(table, frozen.current);
        return;
      }
    }
  }, [tableRef, columnsKey, rowsKey, ready]);
}
