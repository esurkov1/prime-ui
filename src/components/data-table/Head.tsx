import * as React from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";
import { stickySurfaceClass } from "@/internal/sticky";

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
  /** The last visible column sticks to the end edge (with `stickyHeader`: the end corner). */
  stickyLastColumn: boolean;
  /** The head sticks to the top of the scroller. */
  stickyHeader: boolean;
  expandEnabled: boolean;
  /** Name of the info glyph of a column with a `description`. */
  infoLabel: string;
  /** A leading column of row handles (`onReorder`). */
  reorderable?: boolean;
  /** The column chooser trigger (`columnsMenu`), or null. */
  columnsMenu: React.ReactNode;
  /** The chooser stands in a cell of its own at the end; else in the row-actions head cell. */
  menuCell: boolean;
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
  stickyLastColumn,
  stickyHeader,
  expandEnabled,
  infoLabel,
  reorderable = false,
  columnsMenu,
  menuCell,
  selectAll,
}: HeadProps<Row>) {
  const idPrefix = React.useId();
  // One rung of the stacking ladder per head cell (DataTable.module.css): under a sticky head a
  // cell pinned to a column edge is a corner, every other cell stands on the sticky head's rung.
  const headCell = (pinned: boolean) =>
    cx(
      styles.headCell,
      stickyHeader && stickySurfaceClass,
      stickyHeader && (pinned ? styles.cornerCellSticky : styles.headSticky),
    );
  const lead = cx(headCell(stickyFirstColumn), stickyFirstColumn && styles.stickyLead);
  return (
    <thead className={styles.head}>
      <tr>
        {reorderable ? <td className={cx(lead, styles.handleCell)} /> : null}
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
          const isLastColumn = columnIndex === columns.length - 1;
          const described = column.description !== undefined && !column.hideHeader;
          const descriptionId = `${idPrefix}-${columnIndex}-description`;
          // The row-actions head cell holds the column chooser beside its hidden name.
          const menuHere =
            columnsMenu != null && !menuCell && isLastColumn && column.hideHeader === true;
          // A plain header with its named glyph, or the actions head with the chooser, is named by
          // its text alone.
          const labelId =
            (described && !column.sortable) || menuHere
              ? `${idPrefix}-${columnIndex}-label`
              : undefined;
          // The info glyph after the label: the tooltip's trigger on a plain header (a tab stop of
          // its own); a sort button carries the tooltip itself (no control inside a button).
          const info = described ? (
            <Icon
              name="status.info"
              className={styles.headInfo}
              label={column.sortable ? undefined : infoLabel}
            />
          ) : null;
          return (
            <th
              key={column.id}
              scope="col"
              className={cx(
                headCell(
                  (stickyFirstColumn && isFirstColumn) || (stickyLastColumn && isLastColumn),
                ),
                stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                stickyLastColumn && isLastColumn && styles.lastColumnSticky,
              )}
              style={columnSizeStyle(column)}
              data-align={column.headerAlign ?? "start"}
              data-sorted={order ? "true" : undefined}
              aria-sort={column.sortable ? (order ? ARIA_SORT[order] : "none") : undefined}
              data-first-column={isFirstColumn ? "true" : undefined}
              data-column-id={column.id}
              aria-labelledby={labelId}
              aria-describedby={described ? descriptionId : undefined}
              onClick={column.sortable ? () => onSort(column.id) : undefined}
            >
              {column.sortable ? (
                <WithDescription description={described ? column.description : undefined}>
                  {/* A full-cell button: the head cell draws its inset focus ring (see CSS). */}
                  <button type="button" className={styles.sortButton}>
                    <span className={styles.headTitle}>
                      <span className={styles.headLabel}>{column.header}</span>
                      {info}
                    </span>
                    <Icon
                      name={order ? SORT_ICON[order] : "sort.none"}
                      className={styles.sortIcon}
                      strokeWidth={2}
                    />
                  </button>
                </WithDescription>
              ) : column.hideHeader ? (
                <>
                  <VisuallyHidden id={labelId}>{column.header}</VisuallyHidden>
                  {menuHere ? <span className={styles.headMenu}>{columnsMenu}</span> : null}
                </>
              ) : (
                <span className={styles.headTitle}>
                  <span id={labelId} className={styles.headLabel}>
                    {column.header}
                  </span>
                  {info ? (
                    <WithDescription description={column.description}>{info}</WithDescription>
                  ) : null}
                </span>
              )}
              {described ? (
                <span id={descriptionId} hidden>
                  {column.description}
                </span>
              ) : null}
            </th>
          );
        })}
        {menuCell && columnsMenu != null ? (
          <td
            className={cx(
              headCell(stickyLastColumn),
              styles.menuCell,
              stickyLastColumn && styles.menuCellSticky,
            )}
          >
            <span className={styles.headMenu}>{columnsMenu}</span>
          </td>
        ) : null}
      </tr>
    </thead>
  );
}

/** The column's `description` as the tooltip of its trigger (the sort button or the info glyph). */
function WithDescription({
  description,
  children,
}: {
  description: string | undefined;
  children: React.ReactElement;
}) {
  if (description === undefined) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Content>{description}</Tooltip.Content>
    </Tooltip.Root>
  );
}
