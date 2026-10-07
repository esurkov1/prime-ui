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
