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
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Kanban.module.css";

/** A column of the board: application data, drawn in array order. */
export type KanbanColumn = {
  /** Stable unique id; the key of the column in `value`. */
  id: string;
  /** Heading of the column. */
  title: string;
  /** Most cards the column holds (a WIP limit): when full it refuses cards from other columns. */
  limit?: number;
};

/** Where every card stands: column id → card ids in their order. */
export type KanbanValue = Readonly<Record<string, readonly string[]>>;

/** One applied move: card `id` went from column `from` to column `to` (may be the same) at `index`. */
export type KanbanMove = { id: string; from: string; to: string; index: number };

/** System strings of the board. `{token}` values are substituted. */
export type KanbanLabels = {
  /** Spoken name of the count badge: `{count}`. */
  count: string;
  /** Spoken name of the count badge of a column with a `limit`: `{count}`, `{limit}`. */
  countLimit: string;
  /** Text of an empty column. */
  empty: string;
  /** Live region: a card moved to another column from the keyboard. */
  moved: string;
  /** Live region: the next column refused the card (full or `canDrop`). */
  refused: string;
};

export const defaultKanbanLabels: KanbanLabels = {
  count: "Карточек: {count}",
  countLimit: "Карточек: {count} из {limit}",
  empty: "Нет карточек",
  moved: "{label}: «{column}», позиция {position} из {total}",
  refused: "{label}: колонка «{column}» не принимает карточку",
};

const SKELETON_CARDS = [3, 2, 1];
const ITEM_SHORTCUTS = "Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight";

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
  /** Columns in their order. */
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
  /** Renders one card; return a `Kanban.Item`. */
  renderItem: (item: T) => React.ReactNode;
  /** Renders the trailing actions of a column header (add a card, a menu). */
  renderColumnActions?: (column: KanbanColumn) => React.ReactNode;
  /** Refuses a card in a column (a workflow rule); the column turns `danger` before the release. */
  canDrop?: (id: string, columnId: string) => boolean;
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

function KanbanBoard<T>({
  columns,
  items,
  getId,
  getLabel,
  value: valueProp,
  defaultValue,
  onValueChange,
  renderItem,
  renderColumnActions,
  canDrop,
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
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const setRootRef = useMergedRefs<HTMLDivElement | null>(rootRef, ref);
  // The card a keyboard move carried to another column: focus follows it once it is drawn there.
  const pendingFocus = React.useRef<string | null>(null);

  const [value, setValue] = useControllableState<KanbanValue>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_VALUE,
  });

  const byId = React.useMemo(
    () => new Map(items.map((item) => [getId(item), item])),
    [items, getId],
  );
  const idsOf = (columnId: string) => (value[columnId] ?? []).filter((id) => byId.has(id));
  const labelOf = (id: string) => {
    const item = byId.get(id);
    return item === undefined ? id : (getLabel?.(item) ?? id);
  };
  const columnOf = (id: string) => columns.find((column) => (value[column.id] ?? []).includes(id));

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
    const target = columns[columns.indexOf(from) + direction];
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
    pendingFocus.current = id;
    controller.announce(
      formatLabel(labels.moved, {
        label: labelOf(id),
        column: target.title,
        position: move.index + 1,
        total: ids.length + 1,
      }),
    );
  };

  React.useLayoutEffect(() => {
    const id = pendingFocus.current;
    if (id === null) return;
    pendingFocus.current = null;
    const card = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-kanban-item]") ?? [],
    ).find((element) => element.dataset.kanbanItem === id);
    // A keyboard move: the ring must show even if the card was first focused by a click.
    card?.focus({ focusVisible: true } as FocusOptions);
  });

  const context = { moveAcross, disabled: disabled || loading };

  return (
    <BoardContext value={context}>
      <div
        ref={setRootRef}
        aria-busy={loading || undefined}
        {...rest}
        className={cx(styles.root, className)}
        data-loading={loading || undefined}
        data-disabled={disabled || undefined}
      >
        {/* The strip always spans the board: hosts that size blocks by content stretch it. */}
        <ScrollContainer axis="horizontal" className={styles.scroller} data-full-width="true">
          {columns.map((column, columnIndex) => (
            <KanbanColumnView
              key={column.id}
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
              renderItem={renderItem}
              actions={renderColumnActions?.(column)}
              loading={loading}
              disabled={disabled}
              labels={labels}
            />
          ))}
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
  renderItem: (item: T) => React.ReactNode;
  actions: React.ReactNode;
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
  renderItem,
  actions,
  loading,
  disabled,
  labels,
}: KanbanColumnViewProps<T>) {
  const headingId = React.useId();
  const count = cards.length;
  const full = column.limit !== undefined && count >= column.limit;
  const countText =
    column.limit === undefined
      ? formatLabel(labels.count, { count })
      : formatLabel(labels.countLimit, { count, limit: column.limit });

  return (
    <div className={styles.column} data-kanban-column={column.id} data-full={full || undefined}>
      <ControlSizeProvider value="s">
        <div className={styles.header}>
          <h3 id={headingId} className={styles.title}>
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
                </EmptyPage.Root>
              ) : null}
            </div>
          )}
        </Crossfade>
      </ScrollContainer>
    </div>
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
        // Columns follow the writing direction: in right-to-left the next column is on the left.
        const rtl = event.currentTarget.closest("[dir]")?.getAttribute("dir") === "rtl";
        const towardStart = event.key === (rtl ? "ArrowRight" : "ArrowLeft");
        board.moveAcross(id, towardStart ? -1 : 1);
      }}
    >
      <ControlSizeProvider value="m">{children}</ControlSizeProvider>
    </Dnd.SortableItem>
  );
}
KanbanItem.displayName = "Kanban.Item";

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
  ItemTitle: KanbanItemTitle,
  ItemDescription: KanbanItemDescription,
  ItemBadges: KanbanItemBadges,
  ItemFooter: KanbanItemFooter,
  ItemCount: KanbanItemCount,
};
