import * as React from "react";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { isPlainClick, opensRow } from "@/internal/rowLink";
import rowLink from "@/internal/rowLink.module.css";
import { type ControlSize, compactTier } from "@/internal/states";

import type { DataTableLabels } from "./DataTable";
import styles from "./DataTable.module.css";
import { ReorderHandleCell, RowElement, type RowReorderShared } from "./reorder";
import { columnValue, type MeasureRow, scaleStep } from "./rows";
import type { DataTableCellAlign, DataTableColumn, DataTableRowClickEvent } from "./types";
import type { RowSelectionHandlers } from "./useRowSelection";

export function columnAlign<Row>(column: DataTableColumn<Row>): DataTableCellAlign {
  return column.align ?? (column.numeric ? "end" : "start");
}

/**
 * The size of a column's cells: its own lengths inline (a fixed `width` is also its floor, which the
 * frozen widths keep), `data-grow` for the free width (CSS).
 */
export function columnSizeProps<Row>(column: DataTableColumn<Row>) {
  const { width, minWidth = width, maxWidth, grow } = column;
  return {
    style: width || minWidth || maxWidth ? { width, minWidth, maxWidth } : undefined,
    "data-grow": grow ? "true" : undefined,
  };
}

/** The cell's inline padding and divider, set by `DataTable.module.css` on every cell. */
const CELL_INSET = "--dt-cell-inset";

/**
 * The widest a `truncate` value may be: the column's `maxWidth` (or `width`) less the cell's own
 * inline padding and divider (`--dt-cell-inset`), so the cell — border-box — holds that length.
 */
function truncateMaxWidth<Row>(column: DataTableColumn<Row>) {
  const length = column.maxWidth ?? column.width;
  return length ? `calc(${length} - var(${CELL_INSET}))` : undefined;
}

function renderCell<Row>(row: Row, column: DataTableColumn<Row>, withTitle: boolean) {
  const value = column.cell ? undefined : columnValue(row, column);
  const content = column.cell ? column.cell(row) : value == null ? "—" : String(value);
  if (!column.truncate) return content;
  return (
    <span
      className={styles.truncate}
      style={{ maxWidth: truncateMaxWidth(column) }}
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

/** Everything a row needs that is the same for every row (memoized by the table). */
export type RowShared<Row> = {
  columns: DataTableColumn<Row>[];
  size: ControlSize;
  labels: DataTableLabels;
  selectable: boolean;
  expandEnabled: boolean;
  stickyFirstColumn: boolean;
  /** The last visible column sticks to the end edge (row actions). */
  stickyLastColumn: boolean;
  /** A trailing utility cell ends every row: the row grip (`reorderHandle="end"`). */
  endCell: boolean;
  striped: boolean;
  totalColumns: number;
  /**
   * Opens a row in place (`onRowClick`); null without it. Stable: it calls the owner's latest
   * handler, so an inline handler never re-renders every row.
   */
  openRow: ((row: Row, index: number, event: DataTableRowClickEvent) => void) | null;
  renderExpanded?: (row: Row) => React.ReactNode;
  rowDomId: (key: React.Key) => string;
  detailDomId: (key: React.Key) => string;
  /** Value range of every `scale` column (heatmap shading). */
  scaleDomains: Map<string, [number, number]>;
  selection: RowSelectionHandlers;
  toggleExpanded: (key: React.Key) => void;
  /** Row reordering (`onReorder`): sortable rows with a grip cell or a row grip; null without it. */
  reorder: RowReorderShared | null;
};

type DataTableRowProps<Row> = {
  shared: RowShared<Row>;
  row: Row;
  rowKey: React.Key;
  /** `getRowLabel(row)`: values, not the owner's functions, so rows memoize on what they show. */
  rowLabel: string | undefined;
  /** The row opens (`getRowHref` / `onRowClick`, not taken out by `isRowClickable`). */
  opens: boolean;
  /** `getRowHref(row)` of a row that opens as a link. */
  href: string | undefined;
  index: number;
  depth: number;
  expandable: boolean;
  expanded: boolean;
  animate: boolean;
  /** A row of a collapsing parent or group: it folds away before it unmounts. */
  folding?: boolean;
  /** The row folds open and shut: a sub-row, or a row of a collapsible group. */
  foldable?: boolean;
  /** The detail panel opened by the latest expand: it drops in. */
  detailAnimate: boolean;
  selected: boolean;
  /** Ids of the sub-rows the toggle controls (while expanded). */
  childControls: string;
  /** A virtualized body: measures the row's `<tr>` (`useVirtualRows`). */
  measureRef?: ((node: HTMLElement | null) => void) | undefined;
  /** A virtualized body: the row's position among all rows of the table, head included. */
  ariaRowIndex?: number | undefined;
};

function DataTableRowImpl<Row>({
  shared,
  row,
  rowKey,
  rowLabel,
  opens,
  href,
  index,
  depth,
  expandable,
  expanded,
  animate,
  folding = false,
  foldable = depth > 0,
  detailAnimate,
  selected,
  childControls,
  measureRef,
  ariaRowIndex,
}: DataTableRowProps<Row>) {
  const { columns, size, labels, selection, renderExpanded, openRow: onRowClick } = shared;
  // In-place rows take focus themselves; a link row's focus stop is its link.
  const focusable = opens && href === undefined;
  const scaleOf = (column: DataTableColumn<Row>) => {
    const domain = column.scale ? shared.scaleDomains.get(column.id) : undefined;
    return domain ? scaleStep(columnValue(row, column), domain) : undefined;
  };
  // Folds on the same clock as it opens (`base`), so the room and the text leave together.
  const detail = usePresence(expanded && Boolean(renderExpanded), { exitDuration: "base" });
  const detailContent = detail.mounted ? renderExpanded?.(row) : null;
  const hasDetail = detailContent != null && detailContent !== false;
  const controls = [
    hasDetail && expanded ? shared.detailDomId(rowKey) : "",
    expanded ? childControls : "",
  ]
    .filter(Boolean)
    .join(" ");
  // Sub-rows and rows of a collapsible group fold open and shut like the detail panel: every
  // cell's content is a Disclosure (a row that arrives with an expand opens; one that leaves folds
  // before it unmounts). Other top-level rows that arrive keep the drop-in (`enterMotion`).
  const sub = depth > 0;
  const fold = !foldable ? undefined : folding ? "closed" : "open";
  const enter = animate && !foldable && enterMotion.enterBase;
  const lead = cx(styles.cell, enter, shared.stickyFirstColumn && styles.stickyLead);
  const folded = (node: React.ReactNode) =>
    foldable ? (
      <Disclosure open={!folding} appear={animate}>
        <div className={styles.foldPad}>{node}</div>
      </Disclosure>
    ) : (
      node
    );

  // One fragment either way, so opening the detail never remounts the row (the toggle keeps focus).
  return (
    <>
      <RowElement
        reorder={shared.reorder}
        rowKey={rowKey}
        rowRef={measureRef}
        id={shared.rowDomId(rowKey)}
        aria-rowindex={ariaRowIndex}
        className={cx(styles.row, href !== undefined && rowLink.host)}
        style={sub ? ({ "--dt-depth": depth } as React.CSSProperties) : undefined}
        data-stripe={shared.striped && index % 2 === 1 ? "alt" : undefined}
        data-clickable={opens ? "true" : undefined}
        data-link={href !== undefined ? "true" : undefined}
        tabIndex={focusable ? 0 : undefined}
        data-level={sub ? depth : undefined}
        data-fold={fold}
        data-expanded={expanded ? "true" : undefined}
        data-animate={animate ? "true" : undefined}
        aria-selected={shared.selectable ? selected : undefined}
        onClick={
          opens && onRowClick
            ? (event) => {
                if (!opensRow(event)) return;
                // A link row keeps the browser's modified clicks (new tab, new window).
                if (href !== undefined && !isPlainClick(event)) return;
                onRowClick(row, index, event);
              }
            : undefined
        }
        onKeyDown={
          focusable && onRowClick
            ? (event) => {
                if (event.target !== event.currentTarget || event.repeat) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onRowClick(row, index, event);
              }
            : undefined
        }
      >
        {shared.reorder?.handle === "start" ? (
          <ReorderHandleCell
            reorder={shared.reorder}
            rowLabel={rowLabel}
            className={cx(lead, styles.handleCell)}
            wrap={folded}
          />
        ) : null}
        {shared.selectable ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents: the checkbox inside is the keyboard control (Space clicks it and the click bubbles here); the cell only widens the pointer target.
          <td
            className={cx(lead, styles.selectCell)}
            data-select-index={index}
            // A row that is its own grip: a press here paints the selection, never carries the row.
            data-dnd-ignore={shared.reorder?.handle === "row" ? "" : undefined}
            onPointerDown={(event) => selection.onPointerDown(index, event)}
            onClick={(event) => selection.onClick(index, event)}
          >
            {folded(
              <Checkbox.Root
                size={size}
                checked={selected}
                aria-label={formatLabel(labels.selectRow, { label: rowLabel })}
              />,
            )}
          </td>
        ) : null}
        {shared.expandEnabled ? (
          <td className={cx(lead, styles.toggleCell)}>
            {folded(
              expandable ? (
                <Button.Root
                  variant="ghost"
                  tone="neutral"
                  size={compactTier(size)}
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
              ) : null,
            )}
          </td>
        ) : null}
        {columns.map((column, columnIndex) => {
          const isFirstColumn = columnIndex === 0;
          const isLastColumn = columnIndex === columns.length - 1;
          return (
            <td
              key={column.id}
              className={cx(
                styles.cell,
                shared.stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                shared.stickyLastColumn && isLastColumn && styles.lastColumnSticky,
                enter,
              )}
              {...columnSizeProps(column)}
              data-align={columnAlign(column)}
              data-numeric={column.numeric ? "true" : undefined}
              data-first-column={isFirstColumn ? "true" : undefined}
              data-column-id={column.id}
              data-scale={scaleOf(column)}
            >
              {href === undefined ? (
                folded(renderCell(row, column, true))
              ) : isFirstColumn ? (
                // The row's link: the name in the key cell, its hit area stretched over the cell.
                folded(
                  <a href={href} className={styles.rowLink} data-row-link="">
                    {renderCell(row, column, true)}
                  </a>,
                )
              ) : (
                <>
                  {/* The same link over every other cell, hidden from AT and Tab: a click,
                      ⌘-click, middle click or the context menu anywhere on the row is the link's. */}
                  {/* biome-ignore lint/a11y/useAnchorContent: a pointer-only duplicate of the key cell's named link, hidden from AT and Tab */}
                  <a
                    href={href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className={styles.cellLink}
                    data-row-link=""
                  />
                  {folded(renderCell(row, column, true))}
                </>
              )}
            </td>
          );
        })}
        {shared.reorder?.handle === "end" ? (
          <ReorderHandleCell
            reorder={shared.reorder}
            rowLabel={rowLabel}
            className={cx(
              styles.cell,
              styles.endCell,
              shared.stickyLastColumn && styles.endCellSticky,
              enter,
            )}
            wrap={folded}
          />
        ) : shared.endCell ? (
          <td
            className={cx(
              styles.cell,
              styles.endCell,
              shared.stickyLastColumn && styles.endCellSticky,
              enter,
            )}
          >
            {href === undefined ? null : (
              // biome-ignore lint/a11y/useAnchorContent: a pointer-only duplicate of the key cell's named link, hidden from AT and Tab
              <a
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className={styles.cellLink}
                data-row-link=""
              />
            )}
          </td>
        ) : null}
      </RowElement>
      {hasDetail ? (
        <tr
          id={shared.detailDomId(rowKey)}
          className={styles.detailRow}
          data-state={detail.state}
          inert={!expanded}
        >
          <td colSpan={shared.totalColumns} className={styles.detailCell}>
            <Disclosure
              open={detail.state === "open"}
              appear={detailAnimate || animate}
              onTransitionEnd={detail.onExitEnd}
            >
              <div className={styles.detailContent}>{detailContent}</div>
            </Disclosure>
          </td>
        </tr>
      ) : null}
    </>
  );
}

/** A body row (plus its detail panel); re-renders only when its own props change. */
export const DataTableRow = React.memo(DataTableRowImpl) as typeof DataTableRowImpl;

/** The disclosure toggle of a collapsible group (`collapsedGroups`). */
export type GroupToggle = {
  collapsed: boolean;
  /** `labels.expandGroup` / `labels.collapseGroup` with `{group}` filled in. */
  label: string;
  /** Ids of the group's rows on screen (while expanded). */
  controls: string | undefined;
  onToggle: () => void;
};

type GroupRowProps = {
  totalColumns: number;
  sticky: boolean;
  size: ControlSize;
  toggle?: GroupToggle | undefined;
  children: React.ReactNode;
};

/**
 * The header row of a group (`getRowGroup`): a `<th scope="rowgroup">` across every column at the
 * head of its own `<tbody>`, led by a disclosure toggle when groups fold. Its content stays in the
 * visible width while the table scrolls sideways.
 */
export function GroupRow({ totalColumns, sticky, size, toggle, children }: GroupRowProps) {
  return (
    <tr className={styles.groupRow} data-collapsed={toggle?.collapsed ? "true" : undefined}>
      <th
        scope="rowgroup"
        colSpan={totalColumns}
        className={styles.groupCell}
        data-sticky={sticky ? "true" : undefined}
      >
        <div className={styles.groupContent}>
          {toggle ? (
            <Button.Root
              variant="ghost"
              tone="neutral"
              size={compactTier(size)}
              aria-expanded={!toggle.collapsed}
              aria-controls={toggle.controls || undefined}
              aria-label={toggle.label}
              onClick={toggle.onToggle}
            >
              <Button.Icon>
                <Icon name="nav.chevronRight" className={styles.chevron} />
              </Button.Icon>
            </Button.Root>
          ) : null}
          <div className={styles.groupLabel}>{children}</div>
        </div>
      </th>
    </tr>
  );
}

type MeasureBodyProps<Row> = {
  rows: MeasureRow<Row>[];
  columns: DataTableColumn<Row>[];
  selectable: boolean;
  expandEnabled: boolean;
  /** A leading column of row grips (`reorderHandle="start"`). */
  gripStart: boolean;
  /** A trailing utility cell (the end grip, the column chooser). */
  endCell: boolean;
};

/**
 * Sub-rows of collapsed rows and rows of collapsed groups, laid out invisibly so the columns are
 * already as wide as they will be once a row or group opens; never shown or reachable.
 */
export function MeasureBody<Row>({
  rows,
  columns,
  selectable,
  expandEnabled,
  gripStart,
  endCell,
}: MeasureBodyProps<Row>) {
  return (
    <tbody className={styles.measureBody} aria-hidden="true" inert>
      {rows.map(({ row, key, depth }) => (
        <tr
          key={String(key)}
          className={styles.row}
          style={{ "--dt-depth": depth } as React.CSSProperties}
          data-level={depth > 0 ? depth : undefined}
        >
          {gripStart ? <td className={cx(styles.cell, styles.handleCell)} /> : null}
          {selectable ? <td className={cx(styles.cell, styles.selectCell)} /> : null}
          {expandEnabled ? <td className={cx(styles.cell, styles.toggleCell)} /> : null}
          {columns.map((column, columnIndex) => (
            <td
              key={column.id}
              className={styles.cell}
              {...columnSizeProps(column)}
              data-align={columnAlign(column)}
              data-numeric={column.numeric ? "true" : undefined}
              data-first-column={columnIndex === 0 ? "true" : undefined}
            >
              {renderCell(row, column, false)}
            </td>
          ))}
          {endCell ? <td className={cx(styles.cell, styles.endCell)} /> : null}
        </tr>
      ))}
    </tbody>
  );
}
