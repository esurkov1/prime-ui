import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { Dnd, useDragAnnouncer, useSortableItemBusy } from "@/components/dnd/Dnd";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Spinner } from "@/components/spinner/Spinner";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useElementSize } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import hairline from "@/internal/hairline.module.css";
import { hasContent } from "@/internal/hasContent";
import { namedRole } from "@/internal/namedRole";
import { flattenChildren, splitParts } from "@/internal/parts";
import { isPlainClick, opensRow } from "@/internal/rowLink";
import rowLink from "@/internal/rowLink.module.css";
import type { PaletteColor } from "@/internal/states";
import { type SurfaceDepth, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { useFlipList } from "@/internal/useFlipList";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./Kanban.module.css";

/** A column of the board: application data, drawn in array order. */
export type KanbanColumn = {
  /** Stable unique id; the key of the column in `value`. */
  id: string;
  /** Heading of the column. */
  title: string;
  /** A short muted line under the heading: what the column holds or its rule. */
  description?: string;
  /** The stage's palette hue, on its count: tells the columns apart at a glance. */
  color?: PaletteColor;
  /** Most cards the column holds (a WIP limit): when full it refuses cards from other columns. */
  limit?: number;
  /**
   * The column holds its place when columns are reordered (a system stage: the first «Новые», the
   * last «Закрыто»): a lock stands where its grip would, and no column moves past it.
   */
  locked?: boolean;
};

/**
 * A phase of the board: a heading over its columns. A column moves only within its group; columns
 * named by no group stand after the last one, with no heading.
 */
export type KanbanColumnGroup = {
  /** Stable unique id of the group. */
  id: string;
  /** Heading of the group, over its columns. */
  title: string;
  /** Ids of the columns the group holds. */
  columnIds: readonly string[];
};

/** Where every card stands: column id → card ids in their order. */
export type KanbanValue = Readonly<Record<string, readonly string[]>>;

/** One applied move: card `id` went from column `from` to column `to` (may be the same) at `index`. */
export type KanbanMove = { id: string; from: string; to: string; index: number };

/** One applied column move: column `id` now stands at `index`. */
export type KanbanColumnMove = { id: string; index: number };

/** What opened a card: a click on it, or Enter / Space on the focused card. */
export type KanbanItemOpenEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

/** The heading level of the column titles in the page outline. */
export type KanbanColumnTitleAs = "h2" | "h3" | "h4";

/** How columns stand on the board: bare columns of cards, or filled wells. */
export type KanbanVariant = "plain" | "line" | "well";

/** System strings of the board. `{token}` values are substituted. */
export type KanbanLabels = {
  /** Spoken name of the count badge: `{count}`. */
  count: string;
  /** Spoken name of the count badge of a column with a `limit`: `{count}`, `{limit}`. */
  countLimit: string;
  /** Text of an empty column. */
  empty: string;
  /** Why a full column refuses a card (spoken, and shown under the carried card): `{column}`, `{limit}`. */
  full: string;
  /** Name of the grip that moves a column: `{column}`. */
  moveColumn: string;
  /** A column as the live region names it when it is carried or moved: `{column}`. */
  column: string;
  /** Spoken when a card's move is refused (its `onValueChange` promise rejected): `{label}`. */
  moveFailed: string;
  /** Spoken when a column's move is refused (its `onColumnOrderChange` promise rejected): `{column}`. */
  columnMoveFailed: string;
  /** Why a column cannot leave its group (spoken, and shown under the carried column): `{column}`, `{group}`. */
  columnGroupLocked: string;
};

export const KANBAN_LABELS: KanbanLabels = {
  count: "Карточек: {count}",
  countLimit: "Карточек: {count} из {limit}",
  empty: "Нет карточек",
  full: "Колонка «{column}» заполнена ({limit})",
  moveColumn: "Переместить колонку «{column}»",
  column: "Колонка «{column}»",
  moveFailed: "Не удалось переместить «{label}», карточка вернулась на место",
  columnMoveFailed: "Не удалось переместить колонку «{column}», она вернулась на место",
  columnGroupLocked: "Колонка «{column}» остаётся в группе «{group}»",
};

const SKELETON_CARDS = [3, 2, 1];

type BoardContextValue = {
  disabled: boolean;
  /** `getItemHref` of a card, `undefined` when cards are not links. */
  hrefOf: (id: string) => string | undefined;
  /** `onItemOpen` of a card, `null` when cards do not open in place. */
  openItem: ((id: string, event: KanbanItemOpenEvent) => void) | null;
  /** The card's name (`getLabel`, else its id): the name of its link. */
  labelOf: (id: string) => string;
  /**
   * `plain` / `line`: the depth of a card, a surface one step above the board's host (it stands on it
   * directly). The attribute travels with the carried clone, so it keeps its color in flight.
   * `well`: none — the card is the selected thumb of its well.
   */
  cardDepth: SurfaceDepth | undefined;
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
  columns: readonly KanbanColumn[];
  columnGroups?: readonly KanbanColumnGroup[];
  items: readonly T[];
  getId: (item: T) => string;
  getLabel?: (item: T) => string;
  value?: KanbanValue;
  defaultValue?: KanbanValue;
  onValueChange?: (value: KanbanValue, move: KanbanMove) => void | Promise<void>;
  columnOrder?: readonly string[];
  defaultColumnOrder?: readonly string[];
  onColumnOrderChange?: (order: readonly string[], move: KanbanColumnMove) => void | Promise<void>;
  reorderableColumns?: boolean;
  renderItem: (item: T) => React.ReactNode;
  getItemHref?: (item: T) => string;
  onItemOpen?: (item: T, event: KanbanItemOpenEvent) => void;
  columnTitleAs?: KanbanColumnTitleAs;
  renderColumnActions?: (column: KanbanColumn) => React.ReactNode;
  renderColumnMeta?: (column: KanbanColumn) => React.ReactNode | readonly React.ReactNode[];
  canDrop?: (id: string, columnId: string) => boolean | string;
  variant?: KanbanVariant;
  loading?: boolean;
  loadingColumns?: number;
  disabled?: boolean;
  labels?: Partial<KanbanLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A board of columns: cards move within and between columns by pointer, touch (a hold) and
 * keyboard (Alt + arrows, Dnd's linked lists). Its `Dnd.Root` joins a drag session already above
 * it.
 */
/** Below this width (rem) a column takes most of the board and the columns snap. */
const NARROW_REM = 40;

const rootFontSize = () =>
  typeof document === "undefined"
    ? 16
    : Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

function KanbanRoot<T>(props: KanbanRootProps<T>) {
  return (
    <Dnd.Root>
      <KanbanBoard {...props} />
    </Dnd.Root>
  );
}
KanbanRoot.displayName = "Kanban.Root";

const EMPTY_VALUE: KanbanValue = {};
const getColumnId = (column: KanbanColumn) => column.id;

/** A card move: card `id` into column `to` in front of `beforeId` (`null` = last). */
type CardChange = { id: string; to: string; beforeId: string | null };

/** A column move: column `id` in front of `beforeId` (`null` = last). */
type ColumnChange = { id: string; beforeId: string | null };

/** `value` with a card move applied; the same object when it changes nothing. */
function placeCard(value: KanbanValue, { id, to, beforeId }: CardChange): KanbanValue {
  const from = Object.keys(value).find((column) => value[column]?.includes(id));
  if (from === undefined) return value;
  const next: Record<string, readonly string[]> = { ...value };
  next[from] = (value[from] ?? []).filter((card) => card !== id);
  const target = (next[to] ?? []).filter((card) => card !== id);
  const before = beforeId === null ? -1 : target.indexOf(beforeId);
  target.splice(before === -1 ? target.length : before, 0, id);
  if (from === to && target.join("\n") === (value[to] ?? []).join("\n")) return value;
  next[to] = target;
  return next;
}

/** `order` with a column move applied; the same array when it changes nothing. */
function placeColumn(order: readonly string[], { id, beforeId }: ColumnChange): readonly string[] {
  const next = order.filter((column) => column !== id);
  const before = beforeId === null ? -1 : next.indexOf(beforeId);
  next.splice(before === -1 ? next.length : before, 0, id);
  return next.join("\n") === order.join("\n") ? order : next;
}

const CARD_SELECTOR = "[data-kanban-item]";
const cardNodes = (board: HTMLElement) => board.querySelectorAll<HTMLElement>(CARD_SELECTOR);
const cardKey = (node: HTMLElement) => node.dataset.kanbanItem;

function KanbanBoard<T>({
  columns,
  columnGroups,
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
  getItemHref,
  onItemOpen,
  columnTitleAs = "h3",
  renderColumnActions,
  renderColumnMeta,
  canDrop,
  variant = "plain",
  loading = false,
  loadingColumns = 3,
  disabled = false,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: KanbanRootProps<T>) {
  const labels = { ...KANBAN_LABELS, ...labelsProp };
  const kind = `kanban-${React.useId()}`;
  // The board is inside its own `Dnd.Root`: the session's live region is always there.
  const announce = useDragAnnouncer();
  const [board, setBoard] = React.useState<HTMLDivElement | null>(null);
  const rootRef = useMergedRefs(setBoard, ref);
  // Columns snap only on a narrow board, where one takes 85% of it (the CSS container step,
  // 40rem). A wide board scrolls freely: its last columns cannot align to the start, so snapping
  // would pull every scroll near the end back to it.
  const boardRef = React.useMemo(() => ({ current: board }), [board]);
  const boardSize = useElementSize(boardRef);
  const narrow = boardSize !== null && boardSize.width < NARROW_REM * rootFontSize();
  // A refused card move glides back: every card that moved glides from where it stood.
  const { capture: glideCards } = useFlipList({
    container: board,
    nodes: cardNodes,
    keyOf: cardKey,
  });
  const nestedDepth = useNestedSurfaceDepth();
  const cardDepth = variant === "well" ? undefined : nestedDepth;

  const [storedValue, setValue] = useControllableState<KanbanValue>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_VALUE,
  });
  // Moves the owner is still saving are drawn ahead of its answer.
  const cardChanges = usePendingChanges(storedValue, placeCard);
  const value = cardChanges.shown;

  const [storedOrder, setOrder] = useControllableState<readonly string[]>({
    value: columnOrderProp,
    defaultValue: defaultColumnOrder ?? columns.map(getColumnId),
  });
  const columnChanges = usePendingChanges(storedOrder, placeColumn);
  const order = columnChanges.shown;
  // The order names the columns it knows; any other column keeps its place in `columns` after them.
  const ordered = React.useMemo(() => {
    const known = new Map(columns.map((column) => [column.id, column]));
    const placed = order.flatMap((id) => {
      const column = known.get(id);
      return column ? [column] : [];
    });
    const all = [...placed, ...columns.filter((column) => !order.includes(column.id))];
    if (!columnGroups) return all;
    // With groups the columns stand group by group, each in the order's sequence.
    const inGroups = new Set(columnGroups.flatMap((group) => group.columnIds));
    return [
      ...columnGroups.flatMap((group) =>
        all.filter((column) => group.columnIds.includes(column.id)),
      ),
      ...all.filter((column) => !inGroups.has(column.id)),
    ];
  }, [columns, columnGroups, order]);
  // The groups as drawn: the heading and the columns it holds; the strays form one more, unnamed.
  const groups = React.useMemo(() => {
    if (!columnGroups) return null;
    const named = columnGroups.map((group) => ({
      id: group.id,
      title: group.title as string | null,
      columns: ordered.filter((column) => group.columnIds.includes(column.id)),
    }));
    const inGroups = new Set(columnGroups.flatMap((group) => group.columnIds));
    const strays = ordered.filter((column) => !inGroups.has(column.id));
    return [
      ...named.filter((group) => group.columns.length > 0),
      ...(strays.length > 0 ? [{ id: "", title: null, columns: strays }] : []),
    ];
  }, [columnGroups, ordered]);

  const byId = React.useMemo(
    () => new Map(items.map((item) => [getId(item), item])),
    [items, getId],
  );
  const idsOf = (columnId: string) => (value[columnId] ?? []).filter((id) => byId.has(id));
  const columnOf = (id: string) => ordered.find((column) => (value[column.id] ?? []).includes(id));

  const accepts = (column: KanbanColumn, id: string): boolean | string => {
    const ids = idsOf(column.id);
    if (ids.includes(id)) return true;
    if (column.limit !== undefined && ids.length >= column.limit) {
      return formatLabel(labels.full, { column: column.title, limit: column.limit });
    }
    return canDrop?.(id, column.id) ?? true;
  };

  const labelOf = (id: string) => {
    const item = byId.get(id);
    return item !== undefined && getLabel ? getLabel(item) : id;
  };

  /**
   * Puts card `id` into column `to` in front of `beforeId` (`null` = last). A promise from the
   * owner keeps the card there, busy, until it settles; a rejection glides it back and says so.
   */
  const place = (id: string, to: string, beforeId: string | null) => {
    const from = columnOf(id)?.id;
    if (from === undefined) return;
    const change: CardChange = { id, to, beforeId };
    const next = placeCard(value, change);
    if (next === value) return;
    const index = (next[to] ?? []).indexOf(id);
    const outcome = onValueChange?.(next, { id, from, to, index });
    const apply = () => setValue((current) => placeCard(current, change));
    if (!isPromiseLike(outcome)) {
      apply();
      return outcome;
    }
    cardChanges.track(change, outcome, {
      onResolve: apply,
      onReject: () => {
        glideCards();
        announce?.(formatLabel(labels.moveFailed, { label: labelOf(id) }));
      },
    });
    return outcome;
  };

  /** Puts column `id` in front of `beforeId` (`null` = last); a promise as for a card. */
  const moveColumn = (id: string, beforeId: string | null) => {
    const current = ordered.map(getColumnId);
    const change: ColumnChange = { id, beforeId };
    const next = placeColumn(current, change);
    if (next === current) return;
    const outcome = onColumnOrderChange?.(next, { id, index: next.indexOf(id) });
    const apply = () => setOrder((stored) => placeColumn(stored, change));
    if (!isPromiseLike(outcome)) {
      apply();
      return outcome;
    }
    const title = columns.find((column) => column.id === id)?.title ?? id;
    // The glide back is the column list's own (Dnd rolls its drawn order back).
    columnChanges.track(change, outcome, {
      onResolve: apply,
      onReject: () => announce?.(formatLabel(labels.columnMoveFailed, { column: title })),
    });
    return outcome;
  };

  /** A group's move: past its last column means in front of the next group's first, not the end. */
  const moveColumnIn = (
    group: { columns: readonly KanbanColumn[] },
    id: string,
    beforeId: string | null,
  ) => {
    if (beforeId !== null) return moveColumn(id, beforeId);
    const last = group.columns[group.columns.length - 1];
    const at = last ? ordered.findIndex((column) => column.id === last.id) : -1;
    return moveColumn(id, ordered[at + 1]?.id ?? null);
  };

  /**
   * Alt + an arrow along the row on the first / last column of a group would leave it: the list
   * holds still, so the refusal is said here (a pointer drop says it through `canDrop`).
   */
  const refuseAtEdge = (
    event: React.KeyboardEvent<HTMLElement>,
    group: { columns: readonly KanbanColumn[]; title: string | null },
  ) => {
    if (!event.altKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    if (!reorderableColumns || locked || !(event.target instanceof Element)) return;
    const item = event.target.closest("[data-dnd-item]");
    const id = item instanceof HTMLElement ? item.dataset.kanbanColumn : undefined;
    const at = group.columns.findIndex((column) => column.id === id);
    if (at === -1) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = (event.key === "ArrowRight") !== rtl;
    if (at !== (forward ? group.columns.length - 1 : 0)) return;
    announce?.(
      formatLabel(labels.columnGroupLocked, {
        column: group.columns[at]?.title ?? "",
        group: group.title ?? "",
      }),
    );
  };

  const locked = disabled || loading;
  // A board loading before its columns arrive draws placeholder columns (`loadingColumns`).
  const placeholders = loading && columns.length === 0;
  const [placeholdersShown, setPlaceholdersShown] = React.useState(placeholders);
  if (placeholders && !placeholdersShown) setPlaceholdersShown(true);
  const latest = React.useRef({ byId, getItemHref, onItemOpen, getLabel });
  latest.current = { byId, getItemHref, onItemOpen, getLabel };
  const links = getItemHref !== undefined;
  const opens = onItemOpen !== undefined;
  // Stable while the props are: the cards read the latest data and callbacks themselves.
  const context = React.useMemo<BoardContextValue>(
    () => ({
      disabled: locked,
      hrefOf: (id) => {
        const { byId: items, getItemHref: href } = latest.current;
        const item = items.get(id);
        return links && item !== undefined ? href?.(item) : undefined;
      },
      openItem: opens
        ? (id, event) => {
            const item = latest.current.byId.get(id);
            if (item !== undefined) latest.current.onItemOpen?.(item, event);
          }
        : null,
      labelOf: (id) => {
        const item = latest.current.byId.get(id);
        const label = latest.current.getLabel;
        return item !== undefined && label ? label(item) : id;
      },
      cardDepth,
    }),
    [locked, links, opens, cardDepth],
  );

  /** The sortable row of columns: the whole board, or one group's (a linked list that refuses a stranger). */
  const columnList = (
    list: readonly KanbanColumn[],
    {
      group,
      onReorder,
    }: {
      group?: { id: string; title: string | null };
      onReorder: (id: string, beforeId: string | null) => void | Promise<void>;
    },
  ) => (
    <Dnd.Sortable
      as="ul"
      axis="x"
      handle
      kind={group ? `${kind}-columns` : undefined}
      // The columns that replace the placeholders fade in where they stood.
      className={cx(styles.columns, placeholdersShown && enterMotion.enterFade)}
      items={list}
      getId={getColumnId}
      getLabel={(column) => formatLabel(labels.column, { column: column.title })}
      canDrop={
        group
          ? (id) =>
              list.some((column) => column.id === id) ||
              formatLabel(labels.columnGroupLocked, {
                column: columns.find((column) => column.id === id)?.title ?? id,
                group: group.title ?? "",
              })
          : undefined
      }
      disabled={!reorderableColumns || locked}
      onReorder={onReorder}
      renderItem={(column) => (
        <KanbanColumnView
          column={column}
          titleAs={columnTitleAs}
          cardDepth={cardDepth}
          cards={idsOf(column.id).flatMap((id) => {
            const item = byId.get(id);
            return item === undefined ? [] : [item];
          })}
          skeletons={SKELETON_CARDS[ordered.indexOf(column) % SKELETON_CARDS.length] ?? 1}
          kind={kind}
          getId={getId}
          getLabel={getLabel}
          accepts={(id) => accepts(column, id)}
          onReorder={(id, beforeId) => place(id, column.id, beforeId)}
          renderItem={renderItem}
          actions={renderColumnActions?.(column)}
          meta={renderColumnMeta?.(column)}
          reorderable={reorderableColumns && !disabled}
          loading={loading}
          disabled={disabled}
          labels={labels}
        />
      )}
    />
  );

  return (
    <BoardContext value={context}>
      <div
        ref={rootRef}
        aria-busy={loading || undefined}
        {...rest}
        // A named board is a group: a name on a bare `<div>` reaches no assistive tech.
        role={namedRole(rest, "group")}
        className={cx(styles.root, className)}
        data-variant={variant}
        data-loading={loading || undefined}
        data-disabled={disabled || undefined}
      >
        {/* The strip always spans the board: hosts that size blocks by content stretch it. */}
        <ScrollContainer
          axis="horizontal"
          snap={narrow ? "mandatory" : false}
          className={styles.scroller}
          data-full-width="true"
        >
          {placeholders ? (
            // Before the columns arrive: placeholder columns in the column geometry.
            <div className={styles.placeholders} aria-hidden="true">
              {Array.from({ length: loadingColumns }, (_, columnIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder columns
                <div key={columnIndex} className={styles.column}>
                  <div className={cx(styles.header, hairline.bottom)}>
                    <Skeleton shape="block" className={styles.skeletonTitle} />
                  </div>
                  <div className={styles.body}>
                    <SkeletonCards
                      count={SKELETON_CARDS[columnIndex % SKELETON_CARDS.length] ?? 1}
                      cardDepth={cardDepth}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : groups ? (
            <div className={styles.groups}>
              {groups.map((group) => (
                <KanbanGroupView
                  key={group.id}
                  id={group.id}
                  title={group.title}
                  onKeyDownCapture={(event) => refuseAtEdge(event, group)}
                  list={columnList(group.columns, {
                    group,
                    onReorder: (id, beforeId) => moveColumnIn(group, id, beforeId),
                  })}
                />
              ))}
            </div>
          ) : (
            columnList(ordered, { onReorder: (id, beforeId) => moveColumn(id, beforeId) })
          )}
        </ScrollContainer>
      </div>
    </BoardContext>
  );
}

/** A phase of the board: its heading over its columns. The unnamed group (strays) has no heading. */
function KanbanGroupView({
  id,
  title,
  list,
  onKeyDownCapture,
}: {
  id: string;
  title: string | null;
  list: React.ReactNode;
  onKeyDownCapture: React.KeyboardEventHandler<HTMLElement>;
}) {
  const headingId = React.useId();
  // A named group of columns: a name on a bare `<div>` reaches no assistive tech.
  const name = { "aria-labelledby": headingId } as const;
  if (title === null) {
    return (
      <div className={styles.group} onKeyDownCapture={onKeyDownCapture}>
        {list}
      </div>
    );
  }
  return (
    <div
      className={styles.group}
      onKeyDownCapture={onKeyDownCapture}
      data-kanban-group={id}
      role={namedRole(name, "group")}
      {...name}
    >
      <div id={headingId} className={cx(textRole.titleS, styles.groupTitle)}>
        {title}
      </div>
      {list}
    </div>
  );
}

/** Placeholder cards in the card geometry: a loading column, or a placeholder column. */
function SkeletonCards({
  count,
  cardDepth,
}: {
  count: number;
  cardDepth: SurfaceDepth | undefined;
}) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder cards
          key={index}
          className={cx(styles.item, styles.skeleton)}
          data-depth={cardDepth}
          data-surface={cardDepth !== undefined || undefined}
          aria-hidden="true"
        >
          <Skeleton lines={2} />
          <div className={styles.footer}>
            <Skeleton shape="block" className={styles.skeletonBadge} />
            <Skeleton shape="circle" size="s" />
          </div>
        </div>
      ))}
    </div>
  );
}

type KanbanColumnViewProps<T> = {
  column: KanbanColumn;
  titleAs: KanbanColumnTitleAs;
  cardDepth: SurfaceDepth | undefined;
  cards: readonly T[];
  skeletons: number;
  kind: string;
  getId: (item: T) => string;
  getLabel: ((item: T) => string) | undefined;
  accepts: (id: string) => boolean | string;
  onReorder: (id: string, beforeId: string | null) => void | Promise<void>;
  renderItem: (item: T) => React.ReactNode;
  actions: React.ReactNode;
  meta: React.ReactNode | readonly React.ReactNode[];
  reorderable: boolean;
  loading: boolean;
  disabled: boolean;
  labels: KanbanLabels;
};

function KanbanColumnView<T>({
  column,
  titleAs: Title,
  cardDepth,
  cards,
  skeletons,
  kind,
  getId,
  getLabel,
  accepts,
  onReorder,
  renderItem,
  actions,
  meta,
  reorderable,
  loading,
  disabled,
  labels,
}: KanbanColumnViewProps<T>) {
  const headingId = React.useId();
  const descriptionId = React.useId();
  const metaId = React.useId();
  const count = cards.length;
  const full = column.limit !== undefined && count >= column.limit;
  const countText =
    column.limit === undefined
      ? formatLabel(labels.count, { count })
      : formatLabel(labels.countLimit, { count, limit: column.limit });
  // An array is a line per entry, in order, under the description; anything else is one line.
  const metaLines = (Array.isArray(meta) ? (meta as readonly React.ReactNode[]) : [meta]).filter(
    hasContent,
  );
  const showMeta = metaLines.length > 0;
  const describedBy =
    [column.description ? descriptionId : null, showMeta ? metaId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Dnd.SortableItem
      id={column.id}
      locked={column.locked ?? false}
      className={styles.column}
      // plain / line: no surface of its own, the carried column is its header and its cards.
      bare={cardDepth !== undefined}
      data-kanban-column={column.id}
      data-full={full || undefined}
    >
      <ControlSizeProvider value="s">
        <div
          className={cx(styles.header, hairline.bottom)}
          data-reorderable={reorderable || undefined}
        >
          <Title id={headingId} className={cx(textRole.titleM, styles.title)}>
            {column.title}
          </Title>
          {loading ? null : (
            <>
              {/* The stage's hue; a full column turns it orange (and reads `count / limit`). */}
              <Badge.Root color={full ? "orange" : (column.color ?? "gray")} aria-hidden="true">
                {column.limit === undefined ? count : `${count} / ${column.limit}`}
              </Badge.Root>
              <VisuallyHidden>{countText}</VisuallyHidden>
            </>
          )}
          {actions ? (
            <div className={cx(fieldTierClass, styles.actions)} data-size="s">
              {actions}
            </div>
          ) : null}
          {/* While the column's move is saved, the grip is busy (Dnd). */}
          {reorderable ? (
            <Dnd.Handle
              className={styles.grip}
              disabled={loading}
              aria-label={formatLabel(labels.moveColumn, { column: column.title })}
            />
          ) : null}
          {column.description ? (
            <p id={descriptionId} className={cx(textRole.caption, styles.description)}>
              {column.description}
            </p>
          ) : null}
          {showMeta ? (
            <div id={metaId} className={cx(textRole.caption, styles.meta)}>
              {metaLines.map((line, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a line is its place
                <span key={index} className={styles.metaLine}>
                  {line}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </ControlSizeProvider>
      <ScrollContainer className={styles.body}>
        <Crossfade state={loading ? "loading" : "ready"} className={styles.swap}>
          {loading ? (
            <SkeletonCards count={skeletons} cardDepth={cardDepth} />
          ) : (
            <div className={styles.drop}>
              <Dnd.Sortable
                as="ul"
                kind={kind}
                // A long column draws only the cards around the view.
                virtual
                aria-labelledby={headingId}
                aria-describedby={describedBy}
                className={styles.list}
                items={cards}
                getId={getId}
                getLabel={getLabel}
                canDrop={accepts}
                disabled={disabled}
                onReorder={onReorder}
                empty={
                  <EmptyPage.Root layout="compact">
                    <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
                  </EmptyPage.Root>
                }
                renderItem={(item) => (
                  <ItemIdContext value={getId(item)}>{renderItem(item)}</ItemIdContext>
                )}
              />
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
  disabled?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * One card: an `<li>` on a filled surface; drags by the whole card, moves with Alt + arrows. While
 * the owner saves its move it is busy: dimmed under a spinner, still. With `getItemHref` a link
 * covers it; with `onItemOpen` a click, Enter or Space opens it.
 */
function KanbanItem({
  disabled = false,
  className,
  children,
  onClick,
  onKeyDown,
  ...rest
}: KanbanItemProps) {
  const id = React.useContext(ItemIdContext);
  const board = React.useContext(BoardContext);
  const linkRef = React.useRef<HTMLAnchorElement | null>(null);
  if (id === null || board === null) {
    throw new Error("Kanban.Item must be returned from Kanban.Root renderItem");
  }
  const href = board.hrefOf(id);
  const { openItem } = board;
  // A link card: the link is the tab stop, the card is focused only after a keyboard move to
  // another column. An in-place card stays a tab stop on a read-only board too.
  const focus = href !== undefined ? { tabIndex: -1 } : openItem ? { tabIndex: 0 } : null;
  return (
    <Dnd.SortableItem
      id={id}
      disabled={disabled}
      {...focus}
      {...rest}
      data-kanban-item={id}
      data-depth={board.cardDepth}
      data-surface={board.cardDepth !== undefined || undefined}
      data-link={href !== undefined || undefined}
      data-clickable={(href === undefined && openItem !== null) || undefined}
      className={cx(styles.item, href !== undefined && rowLink.host, className)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event);
        // The release of a drag never opens the card: Dnd takes that click.
        if (event.defaultPrevented || href !== undefined || !openItem || !opensRow(event)) return;
        openItem(id, event);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget || event.repeat) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (href !== undefined) {
          event.preventDefault();
          linkRef.current?.click();
        } else if (openItem) {
          event.preventDefault();
          openItem(id, event);
        }
      }}
    >
      {href !== undefined ? (
        // A press on the link drags the card like a press anywhere on it (`data-dnd-handle`).
        // biome-ignore lint/a11y/useAnchorContent: named by `aria-label` (the card's `getLabel`); the card's content stays readable beside it
        <a
          ref={linkRef}
          href={href}
          className={styles.itemLink}
          aria-label={board.labelOf(id)}
          draggable={false}
          data-dnd-handle=""
          data-row-link=""
          onClick={(event) => {
            // The release of a drag follows no link: Dnd takes that click.
            // The browser keeps the modified clicks (new tab, new window).
            if (openItem && isPlainClick(event)) openItem(id, event);
          }}
          onKeyDown={(event) => {
            // Space opens the card like Enter does.
            if (event.key !== " " || event.repeat) return;
            event.preventDefault();
            event.currentTarget.click();
          }}
        />
      ) : null}
      <ControlSizeProvider value="m">{children}</ControlSizeProvider>
      <KanbanItemSpinner />
    </Dnd.SortableItem>
  );
}
KanbanItem.displayName = "Kanban.Item";

/** Dnd makes a card whose move is saved busy and still; the card draws its spinner. */
function KanbanItemSpinner() {
  const busy = useSortableItemBusy();
  return busy ? <Spinner size="s" aria-hidden="true" className={styles.itemSpinner} /> : null;
}

export type KanbanItemHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Plain text children of a row become spans, so the row can cut them with an ellipsis. */
function textInSpans(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <span>{child}</span> : child,
  );
}

/**
 * The top zone of a card above a faint hairline: a muted row with the key or project at the start
 * and the last child (a priority, an assignee) at the end.
 */
function KanbanItemHeader({ className, children, ...rest }: KanbanItemHeaderProps) {
  return (
    <div
      className={cx(
        fieldTierClass,
        textRole.caption,
        styles.itemHeader,
        hairline.bottom,
        className,
      )}
      data-size="xs"
      {...rest}
    >
      {textInSpans(children)}
    </div>
  );
}
KanbanItemHeader.displayName = "Kanban.ItemHeader";

export type KanbanItemTitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  number?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The card title: medium body text, wraps up to three lines. With a tail — the record's `number`,
 * an `Avatar.Root` child (the owner, found inside fragments too) — it is one row: the name cut with
 * an ellipsis, then the number, the owner last, never shrunk.
 */
function KanbanItemTitle({ number, className, children, ...rest }: KanbanItemTitleProps) {
  const { parts: avatars, rest: text } = splitParts(flattenChildren(children), Avatar.Root);
  const hasNumber = hasContent(number);
  if (!hasNumber && avatars.length === 0) {
    return (
      <span className={cx(textRole.bodyM, styles.itemTitle, className)} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <span className={cx(textRole.bodyM, styles.itemTitleRow, className)} {...rest}>
      <span className={styles.itemTitleText}>{text}</span>
      {hasNumber ? <span className={cx(textRole.caption, styles.itemNumber)}>{number}</span> : null}
      {avatars}
    </span>
  );
}
KanbanItemTitle.displayName = "Kanban.ItemTitle";

export type KanbanItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The muted meta line: id, due date. */
function KanbanItemDescription({ className, ...rest }: KanbanItemDescriptionProps) {
  return <span className={cx(textRole.caption, styles.itemDescription, className)} {...rest} />;
}
KanbanItemDescription.displayName = "Kanban.ItemDescription";

export type KanbanItemBadgesProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** A wrapping row of `Badge`s: labels, priority (a `Badge.Group`). */
function KanbanItemBadges(props: KanbanItemBadgesProps) {
  return <Badge.Group {...props} />;
}
KanbanItemBadges.displayName = "Kanban.ItemBadges";

export type KanbanItemFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The bottom row: `Kanban.ItemCount`s at the start, anything else (an assignee, a date) at the
 * end. Text before the last child is cut with an ellipsis; the last child never shrinks.
 */
function KanbanItemFooter({ className, children, ...rest }: KanbanItemFooterProps) {
  return (
    <div
      className={cx(fieldTierClass, textRole.caption, styles.footer, className)}
      data-size="xs"
      {...rest}
    >
      {textInSpans(children)}
    </div>
  );
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

export type KanbanItemSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A zone of a card: a group of its parts. Neighbouring zones stand apart by more air than the parts
 * inside one, over a faint line; a zone with nothing in it is not drawn and leaves no line.
 */
function KanbanItemSection({ className, children, ...rest }: KanbanItemSectionProps) {
  if (!hasContent(children)) return null;
  return (
    <div className={cx(styles.itemSection, hairline.between, className)} {...rest}>
      {children}
    </div>
  );
}
KanbanItemSection.displayName = "Kanban.ItemSection";

export type KanbanItemResourceProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * One unit a record holds (a vehicle, a room, a seat): its mark at the start (a `ProgressCircle`
 * of its term, an `Avatar`, a `Thumbnail`; kit marks take the `s` tier), then its name and a
 * caption line, each cut with an ellipsis.
 */
function KanbanItemResource({
  label,
  description,
  children,
  className,
  ...rest
}: KanbanItemResourceProps) {
  return (
    <div className={cx(styles.resource, className)} {...rest}>
      {hasContent(children) ? (
        <ControlSizeProvider value="s">
          <span className={styles.resourceMark}>{children}</span>
        </ControlSizeProvider>
      ) : null}
      <span className={styles.resourceText}>
        <span className={cx(textRole.bodyS, styles.resourceLabel)}>{label}</span>
        {hasContent(description) ? (
          <span className={cx(textRole.caption, styles.resourceDescription)}>{description}</span>
        ) : null}
      </span>
    </div>
  );
}
KanbanItemResource.displayName = "Kanban.ItemResource";

export type KanbanItemFactProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * One fact of a record: an `Icon` (14 px) and a secondary caption line, cut with an ellipsis; a
 * part of the text may carry its own tone (a `Typography` span). Facts in a row stand close.
 */
function KanbanItemFact({ className, children, ...rest }: KanbanItemFactProps) {
  const { parts: icons, rest: text } = splitParts(children, Icon);
  return (
    <div className={cx(textRole.caption, styles.fact, className)} {...rest}>
      {icons}
      <span className={styles.factText}>{text}</span>
    </div>
  );
}
KanbanItemFact.displayName = "Kanban.ItemFact";

export const Kanban = {
  Root: KanbanRoot,
  Item: KanbanItem,
  ItemHeader: KanbanItemHeader,
  ItemTitle: KanbanItemTitle,
  ItemDescription: KanbanItemDescription,
  ItemBadges: KanbanItemBadges,
  ItemFooter: KanbanItemFooter,
  ItemCount: KanbanItemCount,
  ItemSection: KanbanItemSection,
  ItemResource: KanbanItemResource,
  ItemFact: KanbanItemFact,
};
