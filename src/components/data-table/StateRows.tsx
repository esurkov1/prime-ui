import type * as React from "react";

import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";

import styles from "./DataTable.module.css";
import { columnAlign, columnSizeStyle } from "./Row";
import type { DataTableColumn } from "./types";

type StateRowsProps<Row> = {
  state: "error" | "loading" | "empty";
  columns: DataTableColumn<Row>[];
  size: ControlSize;
  totalColumns: number;
  selectable: boolean;
  expandEnabled: boolean;
  /** A leading column of row handles (`onReorder`). */
  reorderable?: boolean;
  error: React.ReactNode;
  empty: React.ReactNode;
  emptyLabel: string;
  skeletonRows: number;
};

/**
 * The body of the loading (skeleton rows), empty and error states. The empty and error content sits
 * in a sticky box of the visible width, so a wide table centres it in the viewport, not across
 * every column.
 */
export function StateRows<Row>({
  state,
  columns,
  size,
  totalColumns,
  selectable,
  expandEnabled,
  reorderable = false,
  error,
  empty,
  emptyLabel,
  skeletonRows,
}: StateRowsProps<Row>) {
  if (state === "error") {
    return (
      <tr>
        <td colSpan={totalColumns} className={cx(styles.stateCell, styles.stateError)}>
          <div className={styles.stateBox}>
            <div className={styles.stateContent} role="alert">
              {error}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (state === "empty") {
    return (
      <tr>
        <td colSpan={totalColumns} className={styles.stateCell}>
          <div className={styles.stateBox}>
            {empty == null || typeof empty === "string" ? (
              <EmptyPage.Root layout="compact" size={size} role="status">
                <EmptyPage.Description>{empty ?? emptyLabel}</EmptyPage.Description>
              </EmptyPage.Root>
            ) : (
              <div className={styles.stateContent}>{empty}</div>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return Array.from({ length: skeletonRows }, (_, rowIndex) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
    <tr key={rowIndex} className={cx(styles.row, styles.skeletonRow)} data-skeleton="true">
      {reorderable ? <td className={cx(styles.cell, styles.handleCell)} /> : null}
      {selectable ? (
        <td className={cx(styles.cell, styles.selectCell)}>
          <Skeleton shape="block" className={styles.skeletonChoice} />
        </td>
      ) : null}
      {expandEnabled ? <td className={cx(styles.cell, styles.toggleCell)} /> : null}
      {columns.map((column) => (
        <td
          key={column.id}
          className={styles.cell}
          style={columnSizeStyle(column)}
          data-align={columnAlign(column)}
        >
          <Skeleton className={styles.skeleton} />
        </td>
      ))}
    </tr>
  ));
}
