import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { DragControllerContext, useDragController } from "@/components/dnd/context";
import { Dnd } from "@/components/dnd/Dnd";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import palette from "@/internal/palette.module.css";
import type { PaletteColor } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Kanban.module.css";

/** A column of the board: application data, drawn in array order. */
export type KanbanColumn = {
  /** Stable unique id; the key of the column in `value`. */
  id: string;
  /** Heading of the column. */
  title: string;
  /** A short muted line under the heading: what the column holds or its rule. */
  description?: string;
  /** A palette dot before the heading: tells the columns apart at a glance. */
  color?: PaletteColor;
  /** Most cards the column holds (a WIP limit): when full it refuses cards from other columns. */
  limit?: number;
};

/** Where every card stands: column id → card ids in their order. */
export type KanbanValue = Readonly<Record<string, readonly string[]>>;

/** One applied move: card `id` went from column `from` to column `to` (may be the same) at `index`. */
export type KanbanMove = { id: string; from: string; to: string; index: number };

/** One applied column move: column `id` now stands at `index`. */
export type KanbanColumnMove = { id: string; index: number };

/** How columns stand on the board: filled wells, or bare columns of cards. */
export type KanbanVariant = "well" | "plain";

/** System strings of the board. `{token}` values are substituted. */
export type KanbanLabels = {
  /** Spoken name of the count badge: `{count}`. */
  count: string;
  /** Spoken name of the count badge of a column with a `limit`: `{count}`, `{limit}`. */
  countLimit: string;
  /** Text of an empty column. */
  empty: string;
  /** Hint under it while cards can be dropped. */
  emptyHint: string;
  /** Live region: a card moved to another column from the keyboard. */
  moved: string;
  /** Live region: the next column refused the card (full or `canDrop`). */
  refused: string;
  /** Name of the grip that moves a column: `{column}`. */
  moveColumn: string;
  /** Live region: a column moved with the keyboard: `{column}`, `{position}`, `{total}`. */
  columnMoved: string;
};

export const defaultKanbanLabels: KanbanLabels = {
  count: "Карточек: {count}",
  countLimit: "Карточек: {count} из {limit}",
  empty: "Нет карточек",
  emptyHint: "Перетащите сюда карточку",
  moved: "{label}: «{column}», позиция {position} из {total}",
  refused: "{label}: колонка «{column}» не принимает карточку",
  moveColumn: "Переместить колонку «{column}»",
  columnMoved: "Колонка «{column}»: позиция {position} из {total}",
};

const SKELETON_CARDS = [3, 2, 1];
const ITEM_SHORTCUTS = "Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight";
const COLUMN_SHORTCUTS = "Alt+ArrowLeft Alt+ArrowRight";

/** Whether Alt + this arrow points toward the start of the row, in the writing direction. */
function towardStart(event: React.KeyboardEvent<HTMLElement>): boolean {
  // Columns follow the writing direction: in right-to-left the next column is on the left.
  const rtl = event.currentTarget.closest("[dir]")?.getAttribute("dir") === "rtl";
  return event.key === (rtl ? "ArrowRight" : "ArrowLeft");
}

type BoardContextValue = {
  moveAcross: (id: string, direction: -1 | 1) => void;
  disabled: boolean;
};

const BoardContext = React.createContext<BoardContextValue | null>(null);
const ItemIdContext = React.createContext<string | null>(null);

// ---------------------------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------------------------

export type KanbanRootProps<T> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue"
> & {
  /** Every column; `columnOrder` decides their order (array order by default). */
  columns: readonly KanbanColumn[];
  /** Every card the board can show; `value` decides where each one stands. */
  items: readonly T[];
  /** Stable unique id of a card. */
  getId: (item: T) => string;
  /** Spoken by the live region. Defaults to the id. */
  getLabel?: (item: T) => string;
  /** Card ids per column (controlled). */
  value?: KanbanValue;
  /** Initial card ids per column (uncontrolled). */
  defaultValue?: KanbanValue;
  /** A card moved: the new placement first, then what moved. */
  onValueChange?: (value: KanbanValue, move: KanbanMove) => void;
  /** Column ids in their order (controlled). */
  columnOrder?: readonly string[];
  /** Initial column ids in their order (uncontrolled). Defaults to the order of `columns`. */
  defaultColumnOrder?: readonly string[];
  /** A column moved: the new order first, then what moved. */
  onColumnOrderChange?: (order: readonly string[], move: KanbanColumnMove) => void;
  /** A grip in every column header moves the column by pointer, touch and keyboard. */
  reorderableColumns?: boolean;
  /** Renders one card; return a `Kanban.Item`. */
  renderItem: (item: T) => React.ReactNode;
  /** Renders the trailing actions of a column header (add a card, a menu). */
  renderColumnActions?: (column: KanbanColumn) => React.ReactNode;
  /** Refuses a card in a column (a workflow rule); the column turns `danger` before the release. */
  canDrop?: (id: string, columnId: string) => boolean;
  /** `well`: every column is a filled well; `plain`: no wells, the cards and the header carry the column. */
  variant?: KanbanVariant;
  /** Columns show skeleton cards; the cards cross-fade in when it turns off. */
  loading?: boolean;
  /** No drag, no keyboard moves. */
  disabled?: boolean;
  labels?: Partial<KanbanLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A board of columns: cards move within and between columns by pointer, touch (a hold) and
 * keyboard (Alt + arrows). Mounts its own `Dnd.Root` unless one is already above it.
 */
function KanbanRoot<T>(props: KanbanRootProps<T>) {
  const outer = React.useContext(DragControllerContext);
  const board = <KanbanBoard {...props} />;
  return outer ? board : <Dnd.Root>{board}</Dnd.Root>;
}
KanbanRoot.displayName = "Kanban.Root";

const EMPTY_VALUE: KanbanValue = {};
const getColumnId = (column: KanbanColumn) => column.id;
const getColumnTitle = (column: KanbanColumn) => column.title;

function KanbanBoard<T>({
  columns,
  items,
  getId,
  getLabel,
  value: valueProp,
  defaultValue,
  onValueChange,
  columnOrder: columnOrderProp,
  defaultColumnOrder,
  onColumnOrderChange,
  reorderableColumns = false,
  renderItem,
  renderColumnActions,
  canDrop,
  variant = "well",
  loading = false,
  disabled = false,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: KanbanRootProps<T>) {
  const labels = { ...defaultKanbanLabels, ...labelsProp };
  const controller = useDragController();
  const kind = `kanban-${React.useId()}`;
  const columnKind = `${kind}-column`;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const setRootRef = useMergedRefs<HTMLDivElement | null>(rootRef, ref);
  // What a keyboard move carried (a card, or a column's grip): focus follows it once it is drawn.
  const pendingFocus = React.useRef<string | null>(null);

  const [value, setValue] = useControllableState<KanbanValue>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_VALUE,
  });

  const [order, setOrder] = useControllableState<readonly string[]>({
    value: columnOrderProp,
    defaultValue: defaultColumnOrder ?? columns.map(getColumnId),
  });
  // The order names the columns it knows; any other column keeps its place in `columns` after them.
  const ordered = React.useMemo(() => {
    const known = new Map(columns.map((column) => [column.id, column]));
    const placed = order.flatMap((id) => {
      const column = known.get(id);
      return column ? [column] : [];
    });
    return [...placed, ...columns.filter((column) => !order.includes(column.id))];
  }, [columns, order]);

  const byId = React.useMemo(
    () => new Map(items.map((item) => [getId(item), item])),
    [items, getId],
  );
  const idsOf = (columnId: string) => (value[columnId] ?? []).filter((id) => byId.has(id));
  const labelOf = (id: string) => {
    const item = byId.get(id);
    return item === undefined ? id : (getLabel?.(item) ?? id);
  };
  const columnOf = (id: string) => ordered.find((column) => (value[column.id] ?? []).includes(id));

  const accepts = (column: KanbanColumn, id: string) => {
    const ids = idsOf(column.id);
    if (ids.includes(id)) return true;
    if (column.limit !== undefined && ids.length >= column.limit) return false;
    return canDrop?.(id, column.id) ?? true;
  };

  /** Puts card `id` into column `to` in front of `beforeId` (`null` = last). */
  const place = (id: string, to: string, beforeId: string | null): KanbanMove | null => {
    const from = columnOf(id)?.id;
    if (from === undefined) return null;
    const next: Record<string, readonly string[]> = { ...value };
    next[from] = (value[from] ?? []).filter((card) => card !== id);
    const target = (next[to] ?? []).filter((card) => card !== id);
    const before = beforeId === null ? -1 : target.indexOf(beforeId);
    const index = before === -1 ? target.length : before;
    target.splice(index, 0, id);
    if (from === to && target.join("\n") === (value[to] ?? []).join("\n")) return null;
    next[to] = target;
    const move = { id, from, to, index };
    setValue(next);
    onValueChange?.(next, move);
    return move;
  };

  const moveAcross = (id: string, direction: -1 | 1) => {
    if (disabled || loading) return;
    const from = columnOf(id);
    if (!from) return;
    const target = ordered[ordered.indexOf(from) + direction];
    if (!target) return;
    if (!accepts(target, id)) {
      controller.announce(
        formatLabel(labels.refused, { label: labelOf(id), column: target.title }),
      );
      return;
    }
    // Same row in the next column, or its end.
    const position = idsOf(from.id).indexOf(id);
    const ids = idsOf(target.id);
    const move = place(id, target.id, ids[position] ?? null);
    if (!move) return;
    pendingFocus.current = `[data-kanban-item="${CSS.escape(id)}"]`;
    controller.announce(
      formatLabel(labels.moved, {
        label: labelOf(id),
        column: target.title,
        position: move.index + 1,
        total: ids.length + 1,
      }),
    );
  };

  /** Puts column `id` in front of `beforeId` (`null` = last). */
  const placeColumn = (id: string, beforeId: string | null): KanbanColumnMove | null => {
    const current = ordered.map(getColumnId);
    const next = current.filter((column) => column !== id);
    const before = beforeId === null ? -1 : next.indexOf(beforeId);
    const index = before === -1 ? next.length : before;
    next.splice(index, 0, id);
    if (next.join("\n") === current.join("\n")) return null;
    const move = { id, index };
    setOrder(next);
    onColumnOrderChange?.(next, move);
    return move;
  };

  const moveColumn = (id: string, direction: -1 | 1) => {
    if (disabled || loading) return;
    const index = ordered.findIndex((column) => column.id === id);
    const to = index + direction;
    const column = ordered[index];
    if (!column || to < 0 || to >= ordered.length) return;
    // Moving forward lands in front of the column after the one stepped over.
    const beforeId = ordered[direction === -1 ? to : to + 1]?.id ?? null;
    const move = placeColumn(id, beforeId);
    if (!move) return;
    pendingFocus.current = `[data-kanban-column="${CSS.escape(id)}"] [data-dnd-handle]`;
    controller.announce(
      formatLabel(labels.columnMoved, {
        column: column.title,
        position: move.index + 1,
        total: ordered.length,
      }),
    );
  };

  React.useLayoutEffect(() => {
    const selector = pendingFocus.current;
    if (selector === null) return;
    pendingFocus.current = null;
    // A keyboard move: the ring must show even if the element was first focused by a click.
    rootRef.current
      ?.querySelector<HTMLElement>(selector)
      ?.focus({ focusVisible: true } as FocusOptions);
  });

  const locked = disabled || loading;
  const context = { moveAcross, disabled: locked };

  return (
    <BoardContext value={context}>
      <div
        ref={setRootRef}
        aria-busy={loading || undefined}
        {...rest}
        className={cx(styles.root, className)}
        data-variant={variant}
        data-loading={loading || undefined}
        data-disabled={disabled || undefined}
      >
        {/* The strip always spans the board: hosts that size blocks by content stretch it. */}
        <ScrollContainer axis="horizontal" className={styles.scroller} data-full-width="true">
          <Dnd.Sortable
            as="ul"
            axis="x"
            handle
            kind={columnKind}
            className={styles.columns}
            items={ordered}
            getId={getColumnId}
            getLabel={getColumnTitle}
            disabled={!reorderableColumns || locked}
            onReorder={(id, beforeId) => {
              placeColumn(id, beforeId);
            }}
            renderItem={(column, columnIndex) => (
              <KanbanColumnView
                column={column}
                cards={idsOf(column.id).flatMap((id) => {
                  const item = byId.get(id);
                  return item === undefined ? [] : [item];
                })}
                skeletons={SKELETON_CARDS[columnIndex % SKELETON_CARDS.length] ?? 1}
                kind={kind}
                getId={getId}
                getLabel={getLabel}
                accepts={(id) => accepts(column, id)}
                onReorder={(id, beforeId) => {
                  place(id, column.id, beforeId);
                }}
                onMoveColumn={(direction) => moveColumn(column.id, direction)}
                renderItem={renderItem}
                actions={renderColumnActions?.(column)}
                reorderable={reorderableColumns && !disabled}
                loading={loading}
                disabled={disabled}
                labels={labels}
              />
            )}
          />
        </ScrollContainer>
      </div>
    </BoardContext>
  );
}

type KanbanColumnViewProps<T> = {
  column: KanbanColumn;
  cards: readonly T[];
  skeletons: number;
  kind: string;
  getId: (item: T) => string;
  getLabel: ((item: T) => string) | undefined;
  accepts: (id: string) => boolean;
  onReorder: (id: string, beforeId: string | null) => void;
  onMoveColumn: (direction: -1 | 1) => void;
  renderItem: (item: T) => React.ReactNode;
  actions: React.ReactNode;
  reorderable: boolean;
  loading: boolean;
  disabled: boolean;
  labels: KanbanLabels;
};

function KanbanColumnView<T>({
  column,
  cards,
  skeletons,
  kind,
  getId,
  getLabel,
  accepts,
  onReorder,
  onMoveColumn,
  renderItem,
  actions,
  reorderable,
  loading,
  disabled,
  labels,
}: KanbanColumnViewProps<T>) {
  const headingId = React.useId();
  const descriptionId = React.useId();
  const count = cards.length;
  const full = column.limit !== undefined && count >= column.limit;
  const countText =
    column.limit === undefined
      ? formatLabel(labels.count, { count })
      : formatLabel(labels.countLimit, { count, limit: column.limit });

  return (
    <Dnd.SortableItem
      id={column.id}
      className={styles.column}
      data-kanban-column={column.id}
      data-full={full || undefined}
      // The grip carries the shortcuts: the column itself is not focusable.
      aria-keyshortcuts={undefined}
      onKeyDown={(event) => {
        // The grip moves its column; keys from the cards are theirs.
        if (!reorderable || !event.altKey) return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest("[data-dnd-handle]") === null) return;
        event.preventDefault();
        onMoveColumn(towardStart(event) ? -1 : 1);
      }}
    >
      <ControlSizeProvider value="s">
        <div className={styles.header} data-reorderable={reorderable || undefined}>
          <h3 id={headingId} className={styles.title}>
            {column.color ? (
              <Badge.Dot className={cx(palette.hue, styles.dot)} data-color={column.color} />
            ) : null}
            {column.title}
          </h3>
          {loading ? null : (
            <>
              <Badge.Root color={full ? "orange" : "gray"} aria-hidden="true">
                {column.limit === undefined ? count : `${count} / ${column.limit}`}
              </Badge.Root>
              <VisuallyHidden>{countText}</VisuallyHidden>
            </>
          )}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
          {reorderable ? (
            <Dnd.Handle
              className={styles.grip}
              disabled={loading}
              aria-label={formatLabel(labels.moveColumn, { column: column.title })}
              aria-keyshortcuts={loading ? undefined : COLUMN_SHORTCUTS}
            />
          ) : null}
          {column.description ? (
            <p id={descriptionId} className={styles.description}>
              {column.description}
            </p>
          ) : null}
        </div>
      </ControlSizeProvider>
      <ScrollContainer className={styles.body}>
        <Crossfade state={loading ? "loading" : "ready"} className={styles.swap}>
          {loading ? (
            <div className={styles.list}>
              {Array.from({ length: skeletons }, (_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder cards
                <div key={index} className={cx(styles.item, styles.skeleton)} aria-hidden="true">
                  <Skeleton lines={2} />
                  <div className={styles.footer}>
                    <Skeleton shape="block" className={styles.skeletonBadge} />
                    <Skeleton shape="circle" size="s" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.drop}>
              <Dnd.Sortable
                as="ul"
                kind={kind}
                aria-labelledby={headingId}
                aria-describedby={column.description ? descriptionId : undefined}
                className={styles.list}
                items={cards}
                getId={getId}
                getLabel={getLabel}
                canDrop={accepts}
                disabled={disabled}
                onReorder={onReorder}
                renderItem={(item) => (
                  <ItemIdContext value={getId(item)}>{renderItem(item)}</ItemIdContext>
                )}
              />
              {count === 0 ? (
                <EmptyPage.Root layout="compact" className={styles.empty}>
                  <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
                  {disabled ? null : (
                    <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description>
                  )}
                </EmptyPage.Root>
              ) : null}
            </div>
          )}
        </Crossfade>
      </ScrollContainer>
    </Dnd.SortableItem>
  );
}

// ---------------------------------------------------------------------------------------------
// Item and its parts
// ---------------------------------------------------------------------------------------------

export type KanbanItemProps = Omit<React.HTMLAttributes<HTMLElement>, "id"> & {
  /** This card cannot be dragged or moved. */
  disabled?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/** One card: an `<li>` on a filled surface; drags by the whole card, moves with Alt + arrows. */
function KanbanItem({
  disabled = false,
  className,
  onKeyDown,
  children,
  ...rest
}: KanbanItemProps) {
  const id = React.useContext(ItemIdContext);
  const board = React.useContext(BoardContext);
  if (id === null || board === null) {
    throw new Error("Kanban.Item must be returned from Kanban.Root renderItem");
  }
  const locked = disabled || board.disabled;
  return (
    <Dnd.SortableItem
      id={id}
      disabled={disabled}
      aria-keyshortcuts={locked ? undefined : ITEM_SHORTCUTS}
      {...rest}
      data-kanban-item={id}
      className={cx(styles.item, className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || locked || !event.altKey) return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        board.moveAcross(id, towardStart(event) ? -1 : 1);
      }}
    >
      <ControlSizeProvider value="m">{children}</ControlSizeProvider>
    </Dnd.SortableItem>
  );
}
KanbanItem.displayName = "Kanban.Item";

export type KanbanItemHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The top zone of a card above a faint hairline: a muted row with the key or project at the start
 * and the last child (a priority, an assignee) at the end.
 */
function KanbanItemHeader({ className, ...rest }: KanbanItemHeaderProps) {
  return <div className={cx(styles.itemHeader, className)} {...rest} />;
}
KanbanItemHeader.displayName = "Kanban.ItemHeader";

export type KanbanItemTitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The card title: medium body text, wraps up to three lines. */
function KanbanItemTitle({ className, ...rest }: KanbanItemTitleProps) {
  return <span className={cx(styles.itemTitle, className)} {...rest} />;
}
KanbanItemTitle.displayName = "Kanban.ItemTitle";

export type KanbanItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The muted meta line: id, due date. */
function KanbanItemDescription({ className, ...rest }: KanbanItemDescriptionProps) {
  return <span className={cx(styles.itemDescription, className)} {...rest} />;
}
KanbanItemDescription.displayName = "Kanban.ItemDescription";

export type KanbanItemBadgesProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** A wrapping row of `Badge`s: labels, priority. */
function KanbanItemBadges({ className, ...rest }: KanbanItemBadgesProps) {
  return <div className={cx(styles.itemBadges, className)} {...rest} />;
}
KanbanItemBadges.displayName = "Kanban.ItemBadges";

export type KanbanItemFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The bottom row: `Kanban.ItemCount`s at the start, anything else (an assignee) at the end. */
function KanbanItemFooter({ className, ...rest }: KanbanItemFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
KanbanItemFooter.displayName = "Kanban.ItemFooter";

export type KanbanItemCountProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** A small muted counter with an icon (comments, attachments, subtasks). */
function KanbanItemCount({ className, ...rest }: KanbanItemCountProps) {
  return <span className={cx(styles.count, className)} {...rest} />;
}
KanbanItemCount.displayName = "Kanban.ItemCount";

export const Kanban = {
  Root: KanbanRoot,
  Item: KanbanItem,
  ItemHeader: KanbanItemHeader,
  ItemTitle: KanbanItemTitle,
  ItemDescription: KanbanItemDescription,
  ItemBadges: KanbanItemBadges,
  ItemFooter: KanbanItemFooter,
  ItemCount: KanbanItemCount,
};
