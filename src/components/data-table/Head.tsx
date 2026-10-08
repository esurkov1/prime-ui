import { Checkbox } from "@/components/checkbox/Checkbox";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";

import styles from "./DataTable.module.css";
import { columnSizeStyle } from "./Row";
import type { DataTableColumn, DataTableSortState } from "./types";

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;
const SORT_ICON = { asc: "sort.ascending", desc: "sort.descending" } as const;

type HeadProps<Row> = {
  columns: DataTableColumn<Row>[];
  size: ControlSize;
  sort: DataTableSortState;
  onSort: (columnId: string) => void;
  stickyFirstColumn: boolean;
  /** Sticky head and first column: the leading head cells stick to both edges. */
  stickyCorner: boolean;
  expandEnabled: boolean;
  selectAll?: {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    label: string;
    onToggle: () => void;
  };
};

export function Head<Row>({
  columns,
  size,
  sort,
  onSort,
  stickyFirstColumn,
  stickyCorner,
  expandEnabled,
  selectAll,
}: HeadProps<Row>) {
  const lead = cx(
    styles.headCell,
    stickyFirstColumn && styles.stickyLead,
    stickyCorner && styles.cornerCellSticky,
  );
  return (
    <thead>
      <tr>
        {selectAll ? (
          <th scope="col" className={cx(lead, styles.selectCell)}>
            <Checkbox.Root
              size={size}
              checked={selectAll.checked}
              indeterminate={selectAll.indeterminate}
              disabled={selectAll.disabled}
              onCheckedChange={selectAll.onToggle}
              aria-label={selectAll.label}
            />
          </th>
        ) : null}
        {expandEnabled ? <th scope="col" className={cx(lead, styles.toggleCell)} /> : null}
        {columns.map((column, columnIndex) => {
          const order = column.sortable && sort?.columnId === column.id ? sort.order : null;
          const isFirstColumn = columnIndex === 0;
          return (
            <th
              key={column.id}
              scope="col"
              className={cx(
                styles.headCell,
                stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                stickyCorner && isFirstColumn && styles.cornerCellSticky,
              )}
              style={columnSizeStyle(column)}
              data-align={column.headerAlign ?? "start"}
              data-sorted={order ? "true" : undefined}
              aria-sort={column.sortable ? (order ? ARIA_SORT[order] : "none") : undefined}
              data-first-column={isFirstColumn ? "true" : undefined}
              data-column-id={column.id}
              onClick={column.sortable ? () => onSort(column.id) : undefined}
            >
              {column.sortable ? (
                // A full-cell button: the head cell draws its inset focus ring (see CSS).
                <button type="button" className={styles.sortButton}>
                  <span className={styles.headLabel}>{column.header}</span>
                  <Icon
                    name={order ? SORT_ICON[order] : "sort.none"}
                    className={styles.sortIcon}
                    strokeWidth={2}
                  />
                </button>
              ) : (
                <span className={styles.headLabel}>{column.header}</span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
