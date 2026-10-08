import type * as React from "react";

import type { DataTableColumn, DataTableOrder, DataTableSortState } from "./types";

function comparePrimitive(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/** The value a column sorts by: `sortAccessor`, else `accessor`. */
export function columnValue<Row>(row: Row, column: DataTableColumn<Row>): unknown {
  if (column.sortAccessor) return column.sortAccessor(row);
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor !== undefined) return row[column.accessor];
  return undefined;
}

/** Stable sort: equal rows keep their order. */
export function sortRows<Row>(list: Row[], column: DataTableColumn<Row>, order: DataTableOrder) {
  const direction = order === "asc" ? 1 : -1;
  return list
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const compared = column.sortComparator
        ? column.sortComparator(a.row, b.row, order)
        : comparePrimitive(columnValue(a.row, column), columnValue(b.row, column));
      return compared === 0 ? a.index - b.index : compared * direction;
    })
    .map((item) => item.row);
}

/** Header click cycle: asc → desc → none. */
export function nextSort(current: DataTableSortState, columnId: string): DataTableSortState {
  if (current?.columnId !== columnId) return { columnId, order: "asc" };
  return current.order === "asc" ? { columnId, order: "desc" } : null;
}

export type FlatRow<Row> = {
  row: Row;
  key: React.Key;
  depth: number;
  /** Ids of the direct sub-rows (empty when none). */
  childKeys: React.Key[];
  expandable: boolean;
  expanded: boolean;
  /** Mounted by the latest expand, or newly added to `rows`: plays the enter animation. */
  animate: boolean;
};

export type MeasureRow<Row> = { row: Row; key: React.Key; depth: number };

export type FlattenOptions<Row> = {
  /** Top-level rows in `[start, end)` are rendered; the rest only contribute keys. */
  start: number;
  end: number;
  getRowKey?: (row: Row, index: number) => React.Key;
  getRowChildren?: (row: Row) => Row[] | undefined;
  sortColumn?: DataTableColumn<Row>;
  order?: DataTableOrder;
  expandEnabled: boolean;
  /** `renderExpanded` is set: every row may open a detail panel. */
  withDetail: boolean;
  isRowExpandable?: (row: Row) => boolean;
  expanded: ReadonlySet<React.Key>;
  /** Top-level rows newly added to the data. */
  arrived: ReadonlySet<React.Key>;
  /** Row whose latest expand mounted new rows: only those animate in. */
  lastExpandedKey: React.Key | null;
  /** Collect every key of the data (all pages, all depths) for «select all». */
  collectKeys: boolean;
};

export type Flattened<Row> = {
  /** Rendered rows in order: the page rows plus the sub-rows of expanded rows. */
  rows: FlatRow<Row>[];
  /**
   * Direct sub-rows of collapsed rows: drawn invisible so the columns are already as wide as they
   * will be once a row opens.
   */
  measure: MeasureRow<Row>[];
  /** Every row id in the data: the scope of «select all» (empty without `collectKeys`). */
  keys: React.Key[];
};

/**
 * One walk over the sorted data. Sub-rows are sorted like the top level and keyed the same way in
 * every pass, so positional ids of the rendered rows and of «select all» always agree.
 */
export function flatten<Row>(data: Row[], options: FlattenOptions<Row>): Flattened<Row> {
  const { getRowKey, getRowChildren, sortColumn, order, expanded, arrived } = options;
  const result: Flattened<Row> = { rows: [], measure: [], keys: [] };

  const childrenOf = (row: Row): Row[] => {
    const list = getRowChildren?.(row) ?? [];
    return sortColumn && order && list.length > 1 ? sortRows(list, sortColumn, order) : list;
  };
  const keyOf = (row: Row, index: number, parentKey: React.Key | null): React.Key => {
    if (getRowKey) return getRowKey(row, index);
    return parentKey === null ? index : `${String(parentKey)}.${index}`;
  };

  const collect = (list: Row[], parentKey: React.Key) => {
    list.forEach((row, index) => {
      const key = keyOf(row, index, parentKey);
      result.keys.push(key);
      collect(childrenOf(row), key);
    });
  };

  const visit = (row: Row, key: React.Key, depth: number, parentAnimate: boolean) => {
    const children = getRowChildren ? childrenOf(row) : [];
    const childKeys = children.map((child, index) => keyOf(child, index, key));
    const expandable =
      options.expandEnabled &&
      (options.isRowExpandable?.(row) ?? (children.length > 0 || options.withDetail));
    const isExpanded = expandable && expanded.has(key);
    const animate = parentAnimate || (depth === 0 && arrived.has(key));
    result.rows.push({ row, key, depth, childKeys, expandable, expanded: isExpanded, animate });
    if (options.collectKeys) result.keys.push(key);

    const childAnimate = parentAnimate || options.lastExpandedKey === key;
    children.forEach((child, index) => {
      const childKey = childKeys[index] as React.Key;
      if (isExpanded) {
        visit(child, childKey, depth + 1, childAnimate);
        return;
      }
      result.measure.push({ row: child, key: childKey, depth: depth + 1 });
      if (options.collectKeys) {
        result.keys.push(childKey);
        collect(childrenOf(child), childKey);
      }
    });
  };

  data.forEach((row, index) => {
    const key = keyOf(row, index, null);
    if (index >= options.start && index < options.end) {
      visit(row, key, 0, false);
    } else if (options.collectKeys) {
      result.keys.push(key);
      collect(childrenOf(row), key);
    }
  });
  return result;
}
