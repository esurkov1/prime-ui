import type * as React from "react";

export type DataTableOrder = "asc" | "desc";
export type DataTableSortState = { columnId: string; order: DataTableOrder } | null;
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
  onHeaderClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onCellClick?: (
    row: Row,
    event: React.MouseEvent<HTMLTableCellElement> | React.KeyboardEvent<HTMLTableCellElement>,
  ) => void;
};
