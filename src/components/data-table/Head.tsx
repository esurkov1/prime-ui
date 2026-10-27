import * as React from "react";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Dnd } from "@/components/dnd/Dnd";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { ArrowDown } from "@/icons/glyphs/arrow-down";
import { ArrowUp } from "@/icons/glyphs/arrow-up";
import { ArrowUpDown } from "@/icons/glyphs/arrow-up-down";
import { Info } from "@/icons/glyphs/info";
import { cx } from "@/internal/cx";
import { nodeText } from "@/internal/nodeText";
import type { ControlSize } from "@/internal/states";
import { stickySurfaceClass } from "@/internal/sticky";

import styles from "./DataTable.module.css";
import { columnSizeProps } from "./Row";
import type { DataTableColumn, DataTableSortState } from "./types";

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;
const SORT_ICON = { asc: ArrowUp, desc: ArrowDown } as const;

/** Columns that reorder by their headers (`columnOrder`): the head row is a `Dnd.Sortable`. */
export type HeadColumnReorder = {
  /** Columns that hold their place: their headers carry nothing, no column moves past them. */
  locked: ReadonlySet<string>;
  onReorder: (id: string, beforeId: string | null) => void;
};

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
  /** A leading column of row grips (`reorderHandle="start"`). */
  gripStart: boolean;
  /** The column chooser trigger (`columnsMenu`) for the row-actions head cell, or null. */
  columnsMenu: React.ReactNode;
  /** A trailing utility cell ends the row: the head of the end grips' column. */
  endCell: boolean;
  /** Header grips (`columnOrder`); null when columns keep their order. */
  reorder: HeadColumnReorder | null;
  selectAll?: {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    label: string;
    onToggle: () => void;
  };
};

/** What a head column is called by its grip and in the move announcements. */
const columnLabel = <Row,>(column: DataTableColumn<Row>) => nodeText(column.header) || column.id;
const columnId = <Row,>(column: DataTableColumn<Row>) => column.id;

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
  gripStart,
  columnsMenu,
  endCell,
  reorder,
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

  const leading = (
    <>
      {gripStart ? <td className={cx(lead, styles.handleCell)} /> : null}
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
    </>
  );

  const trailing = endCell ? (
    <td
      className={cx(
        headCell(stickyLastColumn),
        styles.endCell,
        stickyLastColumn && styles.endCellSticky,
      )}
    />
  ) : null;

  /** A head cell's attributes and content; `moves`: it ends with the column's grip. */
  const cell = (column: DataTableColumn<Row>, columnIndex: number) => {
    const order = column.sortable && sort?.columnId === column.id ? sort.order : null;
    const SortGlyph = order ? SORT_ICON[order] : ArrowUpDown;
    const isFirstColumn = columnIndex === 0;
    const isLastColumn = columnIndex === columns.length - 1;
    const described = column.description !== undefined && !column.hideHeader;
    const descriptionId = `${idPrefix}-${column.id}-description`;
    // The row-actions head cell holds the column chooser beside its hidden name.
    const menuHere = columnsMenu != null && isLastColumn && column.hideHeader === true;
    // A plain header with its named glyph, or the actions head with the chooser, is named by
    // its text alone.
    const labelId =
      (described && !column.sortable) || menuHere ? `${idPrefix}-${column.id}-label` : undefined;
    const moves = reorder !== null && !reorder.locked.has(column.id);
    // The info glyph after the label: the tooltip's trigger on a plain header (a tab stop of
    // its own); a sort button carries the tooltip itself (no control inside a button).
    const info = described ? (
      <Info className={styles.headInfo} label={column.sortable ? undefined : infoLabel} />
    ) : null;
    const label = column.sortable ? (
      <WithDescription description={described ? column.description : undefined}>
        {/* A full-cell button: the head cell draws its inset focus ring (see CSS). */}
        <button
          type="button"
          className={styles.sortButton}
          aria-keyshortcuts={moves ? "Alt+ArrowLeft Alt+ArrowRight" : undefined}
        >
          <span className={styles.headTitle}>
            <span className={styles.headLabel}>{column.header}</span>
            {info}
          </span>
          <SortGlyph className={styles.sortIcon} strokeWidth={2} />
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
        {info ? <WithDescription description={column.description}>{info}</WithDescription> : null}
      </span>
    );
    return {
      moves,
      props: {
        scope: "col" as const,
        className: cx(
          headCell((stickyFirstColumn && isFirstColumn) || (stickyLastColumn && isLastColumn)),
          stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
          stickyLastColumn && isLastColumn && styles.lastColumnSticky,
        ),
        ...columnSizeProps(column),
        "data-align": column.headerAlign ?? "start",
        "data-sorted": order ? "true" : undefined,
        "aria-sort": column.sortable ? (order ? ARIA_SORT[order] : "none") : undefined,
        "data-first-column": isFirstColumn ? "true" : undefined,
        "data-column-id": column.id,
        "aria-labelledby": labelId,
        "aria-describedby": described ? descriptionId : undefined,
        onClick: column.sortable ? () => onSort(column.id) : undefined,
      } satisfies React.ThHTMLAttributes<HTMLTableCellElement> & Record<`data-${string}`, unknown>,
      content: (
        <>
          {label}
          {described ? (
            <span id={descriptionId} hidden>
              {column.description}
            </span>
          ) : null}
        </>
      ),
    };
  };

  if (reorder) {
    // The head row is a sortable list of its column cells (Kanban's columns, in a table): the
    // header itself is picked up — a press that travels (a finger: holds), the sort button
    // included, while a click still sorts; the carried header flies with its whole column and the
    // body rows carry the gap down (`onGapChange`). A plain header is its own keyboard target, a
    // sortable one passes the keys from its sort button.
    return (
      <thead className={styles.head}>
        <Dnd.Sortable
          as="tr"
          axis="x"
          items={columns}
          getId={columnId}
          getLabel={columnLabel}
          onReorder={reorder.onReorder}
          header={leading}
          renderItem={(column) => {
            const { moves, props, content } = cell(column, columns.indexOf(column));
            return (
              <Dnd.SortableItem
                {...props}
                id={column.id}
                locked={!moves}
                dragFromControls={column.sortable === true}
                // The sort button is the header's one tab stop; the header takes its keys.
                {...(moves && column.sortable ? { tabIndex: -1 } : null)}
              >
                {content}
              </Dnd.SortableItem>
            );
          }}
        >
          {trailing}
        </Dnd.Sortable>
      </thead>
    );
  }

  return (
    <thead className={styles.head}>
      <tr>
        {leading}
        {columns.map((column, columnIndex) => {
          const { props, content } = cell(column, columnIndex);
          return (
            <th key={column.id} {...props}>
              {content}
            </th>
          );
        })}
        {trailing}
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
