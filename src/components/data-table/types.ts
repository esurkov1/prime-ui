import type * as React from "react";

export type DataTableOrder = "asc" | "desc";
export type DataTableSortState = { columnId: string; order: DataTableOrder } | null;

/** What opened a row in place: a click on it, or Enter / Space on the focused row. */
export type DataTableRowClickEvent =
  | React.MouseEvent<HTMLTableRowElement>
  | React.KeyboardEvent<HTMLTableRowElement>;

/** A group of rows (`getRowGroup`): its key and every row of the data in it, in table order. */
export type DataTableGroup<Row> = { key: string | number; rows: Row[] };
/** Internal to the data-table folder (not exported from the kit). */
export type DataTableCellAlign = "start" | "center" | "end";

export type DataTableColumn<Row> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof Row | ((row: Row) => unknown);
  cell?: (row: Row) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: Row) => unknown;
  sortComparator?: (a: Row, b: Row, order: DataTableOrder) => number;
  align?: DataTableCellAlign;
  /**
   * Header alignment, independent of `align`: headers start at the start edge so every header lines
   * up, with the sort indicator at the end edge.
   */
  headerAlign?: DataTableCellAlign;
  /**
   * The header names the column for assistive tech only (an action column): the head cell looks
   * empty, the `<th>` keeps `header` as its name.
   */
  hideHeader?: boolean;
  /**
   * What the column means, for a header that cannot say it all: an info glyph after the header
   * opens it as a tooltip, and the header cell is described by it (`aria-describedby`).
   */
  description?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  /** `tabular-nums`, no wrapping, `end` alignment unless `align` is set. */
  numeric?: boolean;
  /** One line with an ellipsis; width from `maxWidth` (or `width`); string values get a `title`. */
  truncate?: boolean;
  /**
   * The column takes the free width of the table and wraps its text (descriptions, comments). With
   * such a column the table fills its container instead of growing to its content width.
   */
  grow?: boolean;
  /**
   * The column can be hidden through the table's `hiddenColumns`. Default `true`; `false` for the
   * key column that names the row — it stays even when its id is listed.
   */
  hideable?: boolean;
  /**
   * Heatmap: each cell is shaded by its numeric value (`sortAccessor`, else `accessor`) on the
   * five-step chart scale (`--prime-color-chart-scale-1…5`); the value itself stays in the cell.
   * `true` spans the column's own minimum to maximum; `{ min, max }` fixes either end.
   */
  scale?: boolean | { min?: number; max?: number };
};
