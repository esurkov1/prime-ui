import * as React from "react";

/**
 * Stable column widths. The browser sizes columns by the rows on screen, so searching, filtering,
 * paging or opening a row would make every column jump. Once real rows are laid out, the widths
 * are frozen into the colgroup (`table-layout: fixed`); later renders keep them. They are measured
 * again (never narrower than before) when content stops fitting, and from scratch when the column
 * set or the container width changes. `grow` columns (`col[data-grow]`) keep taking the free width.
 */
export function useFrozenColumns(
  tableRef: React.RefObject<HTMLTableElement | null>,
  rootRef: React.RefObject<HTMLDivElement | null>,
  columnsKey: string,
  /** Real rows are on screen (not loading, empty or error). */
  ready: boolean,
) {
  const widths = React.useRef<number[] | null>(null);

  const cols = () => [
    ...(tableRef.current?.querySelectorAll<HTMLTableColElement>(":scope > colgroup > col") ?? []),
  ];

  const unfreeze = () => {
    widths.current = null;
    if (tableRef.current) {
      tableRef.current.style.tableLayout = "";
      tableRef.current.style.minWidth = "";
    }
    for (const col of cols()) col.style.width = "";
  };

  const freeze = () => {
    const table = tableRef.current;
    const lead = table?.tHead?.rows[0] ?? table?.tBodies[0]?.rows[0];
    const list = cols();
    if (!table || !lead || list.length !== lead.cells.length) return;
    const previous = widths.current;
    // Measure the natural layout of what is on screen now.
    table.style.tableLayout = "";
    for (const col of list) col.style.width = "";
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
    list.forEach((col, index) => {
      const grows = col.dataset.grow === "true";
      if (!grows) col.style.width = `${next[index]}px`;
      floor += grows ? (minimums[index] ?? 0) : (next[index] ?? 0);
    });
    table.style.tableLayout = "fixed";
    // A `grow` column takes the free width but never less than its `minWidth`: below that the
    // table keeps its width and the container scrolls instead of cells overlapping.
    table.style.minWidth = `${floor}px`;
    widths.current = next;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new column set starts from scratch.
  React.useLayoutEffect(unfreeze, [columnsKey]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refs and DOM helpers are stable.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    let lastWidth = root.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const width = root.getBoundingClientRect().width;
      if (Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
      unfreeze();
      freeze();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // After every render: freeze once real rows are laid out; widen a column whose content no longer
  // fits (a longer value, a deeper row). Loading, empty and error states keep the widths.
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table || !ready) return;
    if (!widths.current) {
      freeze();
      return;
    }
    for (const cell of table.querySelectorAll<HTMLTableCellElement>(":scope > tbody > tr > td")) {
      if (cell.scrollWidth > cell.clientWidth + 1) {
        freeze();
        return;
      }
    }
  });
}
