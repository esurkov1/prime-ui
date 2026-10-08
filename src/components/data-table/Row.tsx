import * as React from "react";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import type { ControlSize } from "@/internal/states";

import type { DataTableLabels } from "./DataTable";
import styles from "./DataTable.module.css";
import { columnValue, type MeasureRow } from "./rows";
import type { DataTableCellAlign, DataTableColumn } from "./types";
import type { RowSelectionHandlers } from "./useRowSelection";

export function columnAlign<Row>(column: DataTableColumn<Row>): DataTableCellAlign {
  return column.align ?? (column.numeric ? "end" : "start");
}

export function columnSizeStyle<Row>(
  column: DataTableColumn<Row>,
): React.CSSProperties | undefined {
  const { width, minWidth, maxWidth, grow } = column;
  if (!width && !minWidth && !maxWidth && !grow) return undefined;
  return { width: width ?? (grow ? "100%" : undefined), minWidth, maxWidth };
}

function renderCell<Row>(row: Row, column: DataTableColumn<Row>, withTitle: boolean) {
  const value = column.cell ? undefined : columnValue(row, column);
  const content = column.cell ? column.cell(row) : value == null ? "—" : String(value);
  if (!column.truncate) return content;
  return (
    <span
      className={styles.truncate}
      style={{ maxWidth: column.maxWidth ?? column.width }}
      title={
        withTitle && (typeof content === "string" || typeof content === "number")
          ? String(content)
          : undefined
      }
    >
      {content}
    </span>
  );
}

/** Toggle buttons sit one tier below the table tier (m table → xs button, 28). */
const TOGGLE_SIZE: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "xs",
  l: "s",
  xl: "s",
};

/** Everything a row needs that is the same for every row (memoized by the table). */
export type RowShared<Row> = {
  columns: DataTableColumn<Row>[];
  size: ControlSize;
  labels: DataTableLabels;
  selectable: boolean;
  expandEnabled: boolean;
  stickyFirstColumn: boolean;
  striped: boolean;
  totalColumns: number;
  getRowLabel?: (row: Row) => string;
  onRowClick?: (row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
  renderExpanded?: (row: Row) => React.ReactNode;
  rowDomId: (key: React.Key) => string;
  detailDomId: (key: React.Key) => string;
  selection: RowSelectionHandlers;
  toggleExpanded: (key: React.Key) => void;
};

type DataTableRowProps<Row> = {
  shared: RowShared<Row>;
  row: Row;
  rowKey: React.Key;
  index: number;
  depth: number;
  expandable: boolean;
  expanded: boolean;
  animate: boolean;
  /** The detail panel opened by the latest expand: it drops in. */
  detailAnimate: boolean;
  selected: boolean;
  /** Ids of the sub-rows the toggle controls (while expanded). */
  childControls: string;
};

function DataTableRowImpl<Row>({
  shared,
  row,
  rowKey,
  index,
  depth,
  expandable,
  expanded,
  animate,
  detailAnimate,
  selected,
  childControls,
}: DataTableRowProps<Row>) {
  const { columns, size, labels, selection, renderExpanded } = shared;
  const rowLabel = shared.getRowLabel?.(row);
  const detail = usePresence(expanded && Boolean(renderExpanded), { exitDuration: "fast" });
  const detailContent = detail.mounted ? renderExpanded?.(row) : null;
  const hasDetail = detailContent != null && detailContent !== false;
  const controls = [
    hasDetail && expanded ? shared.detailDomId(rowKey) : "",
    expanded ? childControls : "",
  ]
    .filter(Boolean)
    .join(" ");
  const enter = animate && enterMotion.enterBase;
  const lead = cx(styles.cell, enter, shared.stickyFirstColumn && styles.stickyLead);

  // One fragment either way, so opening the detail never remounts the row (the toggle keeps focus).
  return (
    <>
      <tr
        id={shared.rowDomId(rowKey)}
        className={styles.row}
        style={depth > 0 ? ({ "--dt-depth": depth } as React.CSSProperties) : undefined}
        data-stripe={shared.striped && index % 2 === 1 ? "alt" : undefined}
        data-clickable={shared.onRowClick ? "true" : undefined}
        data-depth={depth > 0 ? depth : undefined}
        data-expanded={expanded ? "true" : undefined}
        data-animate={animate ? "true" : undefined}
        aria-selected={shared.selectable ? selected : undefined}
        onClick={(event) => shared.onRowClick?.(row, index, event)}
      >
        {shared.selectable ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents: the checkbox inside is the keyboard control (Space clicks it and the click bubbles here); the cell only widens the pointer target.
          <td
            className={cx(lead, styles.selectCell)}
            data-select-index={index}
            onPointerDown={(event) => selection.onPointerDown(index, event)}
            onClick={(event) => selection.onClick(index, event)}
          >
            <Checkbox.Root
              size={size}
              checked={selected}
              aria-label={formatLabel(labels.selectRow, { label: rowLabel })}
            />
          </td>
        ) : null}
        {shared.expandEnabled ? (
          <td className={cx(lead, styles.toggleCell)}>
            {expandable ? (
              <Button.Root
                variant="ghost"
                tone="neutral"
                size={TOGGLE_SIZE[size]}
                aria-expanded={expanded}
                aria-controls={controls || undefined}
                aria-label={formatLabel(expanded ? labels.collapse : labels.expand, {
                  label: rowLabel,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  shared.toggleExpanded(rowKey);
                }}
              >
                <Button.Icon>
                  <Icon name="nav.chevronRight" className={styles.chevron} />
                </Button.Icon>
              </Button.Root>
            ) : null}
          </td>
        ) : null}
        {columns.map((column, columnIndex) => {
          const isFirstColumn = columnIndex === 0;
          return (
            <td
              key={column.id}
              className={cx(
                styles.cell,
                shared.stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                enter,
              )}
              style={columnSizeStyle(column)}
              data-align={columnAlign(column)}
              data-numeric={column.numeric ? "true" : undefined}
              data-first-column={isFirstColumn ? "true" : undefined}
              data-column-id={column.id}
            >
              {renderCell(row, column, true)}
            </td>
          );
        })}
      </tr>
      {hasDetail ? (
        <tr
          id={shared.detailDomId(rowKey)}
          className={styles.detailRow}
          data-state={detail.state}
          data-animate={detailAnimate || animate ? "true" : undefined}
          inert={!expanded}
        >
          <td colSpan={shared.totalColumns} className={styles.detailCell}>
            <div className={styles.detailMotion} onTransitionEnd={detail.onExitEnd}>
              <div className={styles.detailContent}>{detailContent}</div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

/** A body row (plus its detail panel); re-renders only when its own props change. */
export const DataTableRow = React.memo(DataTableRowImpl) as typeof DataTableRowImpl;

type MeasureBodyProps<Row> = {
  rows: MeasureRow<Row>[];
  columns: DataTableColumn<Row>[];
  selectable: boolean;
  expandEnabled: boolean;
};

/**
 * Sub-rows of collapsed rows, laid out invisibly so the columns are already as wide as they will
 * be once a row opens; never shown or reachable.
 */
export function MeasureBody<Row>({
  rows,
  columns,
  selectable,
  expandEnabled,
}: MeasureBodyProps<Row>) {
  return (
    <tbody className={styles.measureBody} aria-hidden="true" inert>
      {rows.map(({ row, key, depth }) => (
        <tr
          key={String(key)}
          className={styles.row}
          style={{ "--dt-depth": depth } as React.CSSProperties}
          data-depth={depth}
        >
          {selectable ? <td className={cx(styles.cell, styles.selectCell)} /> : null}
          {expandEnabled ? <td className={cx(styles.cell, styles.toggleCell)} /> : null}
          {columns.map((column, columnIndex) => (
            <td
              key={column.id}
              className={styles.cell}
              style={columnSizeStyle(column)}
              data-align={columnAlign(column)}
              data-numeric={column.numeric ? "true" : undefined}
              data-first-column={columnIndex === 0 ? "true" : undefined}
            >
              {renderCell(row, column, false)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
