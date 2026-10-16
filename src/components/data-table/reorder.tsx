import * as React from "react";
import { Dnd } from "@/components/dnd/Dnd";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { formatLabel } from "@/internal/formatLabel";
import { isPromiseLike } from "@/internal/usePendingChanges";

import type { FlatRow } from "./rows";

/** What every row needs to know about reordering (part of the rows' shared props). */
export type RowReorderShared = {
  /** Where a row is picked up: a grip cell leading or ending it, or the row itself. */
  handle: "start" | "end" | "row";
  /** The table is sorted by a column: the manual order is not what is on screen. */
  locked: boolean;
  /** `aria-label` of a row's handle; `{label}` is `getRowLabel(row)`. */
  handleLabel: string;
  /** Why the handles are off while the table is sorted. */
  lockedHint: string;
};

type Entry<Row> = { item: FlatRow<Row>; index: number };

export type RowReorderOptions<Row> = {
  /** `reorderHandle`: a grip cell at the start or the end of a row, or the whole row. */
  handle: "start" | "end" | "row";
  onReorder: ((id: React.Key, beforeId: React.Key | null) => void | Promise<void>) | undefined;
  /** Expandable rows (sub-rows, detail panels) do not reorder: a row would leave its children. */
  expandEnabled: boolean;
  /** Sorted by a column. */
  sorted: boolean;
  /** The owner's `rows` as given: a move is made against this array. */
  rows: readonly Row[];
  /** Every row in table order (sorted, grouped), the rows on screen a run of them. */
  orderedRows: readonly Row[];
  /** Where the rows on screen start in `orderedRows`. */
  offset: number;
  getRowKey: ((row: Row, index: number) => React.Key) | undefined;
  getRowGroup: ((row: Row) => string | number) | undefined;
  getRowLabel: ((row: Row) => string) | undefined;
  handleLabel: string;
  lockedHint: string;
};

/**
 * Row reordering of a DataTable on Dnd's sortable list: the move goes to the owner as
 * `onReorder(id, beforeId)` with the row keys; a returned promise keeps the row in its new place,
 * busy with a busy handle, until it settles, a rejection glides it back (Dnd tracks the promise and
 * rolls the drawn order back).
 */
export function useRowReorder<Row>(options: RowReorderOptions<Row>) {
  const { onReorder, expandEnabled, sorted, rows, orderedRows, offset, getRowKey, getRowGroup } =
    options;
  const enabled = onReorder !== undefined && !expandEnabled;
  /**
   * The `rows` the table itself moved a row in: the owner's next `rows` after them (the same rows,
   * another order) is that move, not a new result set (`source="server"` would cross-fade it and
   * scroll to the top). Any later change starts from other rows, so the move is never matched twice.
   */
  const movedFrom = React.useRef<readonly Row[] | null>(null);

  const keyOf = React.useCallback(
    (row: Row, index: number): React.Key => (getRowKey ? getRowKey(row, index) : index),
    [getRowKey],
  );

  const latest = React.useRef({ onReorder, rows, orderedRows, offset, getRowGroup, keyOf });
  latest.current = { onReorder, rows, orderedRows, offset, getRowGroup, keyOf };

  /** The handler of one run of rows on screen (the page, or one group of it). */
  const reorderIn = React.useCallback((entries: readonly Entry<Row>[]) => {
    const keys = new Map(entries.map((entry) => [String(entry.item.key), entry.item.key]));
    return (id: string, beforeId: string | null): void | Promise<void> => {
      const current = latest.current;
      const key = keys.get(id);
      if (key === undefined || !current.onReorder) return;
      let before: React.Key | null = beforeId === null ? null : (keys.get(beforeId) ?? null);
      if (beforeId === null) {
        // Last on screen is in front of the first row after the run (the next page), if it is one
        // of the same group; otherwise last of all.
        // Found by the row itself: rows of a collapsed group are not on screen, so a position on
        // screen is not a position in the data.
        const last = entries[entries.length - 1];
        const found = last ? current.orderedRows.indexOf(last.item.row, current.offset) : -1;
        const at = found >= 0 ? found + 1 : -1;
        const next = at >= 0 ? current.orderedRows[at] : undefined;
        const group = current.getRowGroup;
        if (
          next !== undefined &&
          last !== undefined &&
          (!group || group(next) === group(last.item.row))
        ) {
          before = current.keyOf(next, at);
        }
      }
      const from = current.rows;
      movedFrom.current = from;
      const outcome = current.onReorder(key, before);
      if (!isPromiseLike(outcome)) return;
      Promise.resolve(outcome).catch(() => {
        // Refused: no new order follows.
        if (movedFrom.current === from) movedFrom.current = null;
      });
      return outcome;
    };
  }, []);

  /**
   * Whether the owner's change from `previousRows` is the table's own move (the same ids, another
   * order). Pure: a render may run twice.
   */
  const isOwnMove = React.useCallback(
    (previousRows: readonly Row[], previous: readonly unknown[], next: readonly unknown[]) => {
      if (movedFrom.current !== previousRows || previous.length !== next.length) return false;
      const set = new Set(previous);
      return next.every((id) => set.has(id));
    },
    [],
  );

  const shared = React.useMemo<RowReorderShared | null>(
    () =>
      enabled
        ? {
            handle: options.handle,
            locked: sorted,
            handleLabel: options.handleLabel,
            lockedHint: options.lockedHint,
          }
        : null,
    [enabled, options.handle, sorted, options.handleLabel, options.lockedHint],
  );

  return { enabled, shared, reorderIn, isOwnMove };
}

type ReorderBodyProps<Row> = {
  entries: Entry<Row>[];
  /** First index of the run among the rows on screen. */
  start: number;
  /** Only a row's grip picks it up (`reorderHandle` `start` / `end`); else the whole row. */
  handle: boolean;
  locked: boolean;
  onReorder: (id: string, beforeId: string | null) => void | Promise<void>;
  getRowLabel: ((row: Row) => string) | undefined;
  renderRow: (item: FlatRow<Row>, index: number) => React.ReactNode;
  /** The group's heading row: it heads the body and never moves. */
  header?: React.ReactNode;
  className?: string | undefined;
};

const entryId = <Row,>(entry: Entry<Row>) => String(entry.item.key);

/**
 * A `<tbody>` whose rows reorder: Dnd's sortable list in its table-rows mode, by the grip only, or
 * by the whole row (`reorderHandle="row"`: the row is the keyboard target and the drag source).
 */
export function ReorderBody<Row>({
  entries,
  start,
  handle,
  locked,
  onReorder,
  getRowLabel,
  renderRow,
  header,
  className,
}: ReorderBodyProps<Row>) {
  const getLabel = React.useCallback(
    (entry: Entry<Row>) => getRowLabel?.(entry.item.row) ?? String(entry.item.key),
    [getRowLabel],
  );
  return (
    <Dnd.Sortable
      as="tbody"
      items={entries}
      getId={entryId}
      getLabel={getLabel}
      onReorder={onReorder}
      // On screen the position counts from the run, the stripes from the rows on screen.
      renderItem={(entry, index) => renderRow(entry.item, start + index)}
      handle={handle}
      disabled={locked}
      header={header}
      className={className}
    />
  );
}

/** The drag session the rows need; it joins one the app already has above the table. */
export function ReorderRoot({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return enabled ? <Dnd.Root>{children}</Dnd.Root> : children;
}

type RowElementProps = Omit<React.ComponentProps<"tr">, "ref"> & {
  reorder: RowReorderShared | null;
  rowKey: React.Key;
  /** The plain `<tr>` (a virtualized body measures it; virtualized tables never reorder). */
  rowRef?: ((node: HTMLElement | null) => void) | undefined;
};

/**
 * A body row's `<tr>`; in a reorderable table, a sortable item rendered as that `<tr>` (it needs no
 * DOM id: only expandable rows are pointed at, and those do not reorder).
 */
export function RowElement({
  reorder,
  rowKey,
  rowRef,
  id,
  tabIndex,
  children,
  ...rest
}: RowElementProps) {
  if (!reorder) {
    return (
      <tr ref={rowRef} id={id} tabIndex={tabIndex} {...rest}>
        {children}
      </tr>
    );
  }
  // A row that is its own grip is a tab stop through Dnd (the move keys); a row that opens keeps
  // its own.
  return (
    <Dnd.SortableItem
      {...(rest as Omit<React.HTMLAttributes<HTMLElement>, "id">)}
      {...(tabIndex === undefined ? null : { tabIndex })}
      id={String(rowKey)}
    >
      {children}
    </Dnd.SortableItem>
  );
}

type HandleCellProps = {
  reorder: RowReorderShared;
  rowLabel: string | undefined;
  className?: string | undefined;
  /** Wraps the content like the row's other cells (the fold of a collapsible group's row). */
  wrap?: (node: React.ReactNode) => React.ReactNode;
};

/**
 * The grip cell of a reorderable row, leading or ending it (`reorderHandle`): the grip (Alt + ↑ / ↓
 * from the keyboard; busy while the owner saves this row's move) and, while the table is sorted, a
 * disabled grip that says why.
 */
export function ReorderHandleCell({ reorder, rowLabel, className, wrap }: HandleCellProps) {
  const label = formatLabel(reorder.handleLabel, { label: rowLabel ?? "" }).trim();
  let content: React.ReactNode;
  if (reorder.locked) {
    content = (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Dnd.Handle aria-label={label} disabled />
        </Tooltip.Trigger>
        <Tooltip.Content>{reorder.lockedHint}</Tooltip.Content>
      </Tooltip.Root>
    );
  } else {
    content = <Dnd.Handle aria-label={label} />;
  }
  return <td className={className}>{wrap ? wrap(content) : content}</td>;
}
