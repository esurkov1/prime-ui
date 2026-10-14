import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { isPlainClick, opensRow } from "@/components/data-table/rowEvents";
import { DragControllerContext, useDragController } from "@/components/dnd/context";
import { Dnd } from "@/components/dnd/Dnd";
import { motionTiming } from "@/components/dnd/useFlipList";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Spinner } from "@/components/spinner/Spinner";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import type { PaletteColor } from "@/internal/states";
import { type SurfaceDepth, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";
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

/** Where every card stands: column id → card ids in their order. */
export type KanbanValue = Readonly<Record<string, readonly string[]>>;

/** One applied move: card `id` went from column `from` to column `to` (may be the same) at `index`. */
export type KanbanMove = { id: string; from: string; to: string; index: number };

/** One applied column move: column `id` now stands at `index`. */
export type KanbanColumnMove = { id: string; index: number };

/** What opened a card: a click on it, or Enter / Space on the focused card. */
export type KanbanItemClickEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

/** How columns stand on the board: bare columns of cards, or filled wells. */
export type KanbanVariant = "plain" | "well";

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
};

export const defaultKanbanLabels: KanbanLabels = {
  count: "Карточек: {count}",
  countLimit: "Карточек: {count} из {limit}",
  empty: "Нет карточек",
  emptyHint: "Перетащите сюда карточку",
  full: "Колонка «{column}» заполнена ({limit})",
  moveColumn: "Переместить колонку «{column}»",
  column: "Колонка «{column}»",
  moveFailed: "Не удалось переместить «{label}», карточка вернулась на место",
  columnMoveFailed: "Не удалось переместить колонку «{column}», она вернулась на место",
};

const SKELETON_CARDS = [3, 2, 1];
const COLUMN_SHORTCUTS = "Alt+ArrowLeft Alt+ArrowRight";

type BoardContextValue = {
  disabled: boolean;
  /** Cards whose move the owner is still saving. */
  pending: ReadonlySet<string>;
  /** `getItemHref` of a card, `undefined` when cards are not links. */
  hrefOf: (id: string) => string | undefined;
  /** `onItemClick` of a card, `null` when cards do not open in place. */
  openItem: ((id: string, event: KanbanItemClickEvent) => void) | null;
  /** The card's name (`getLabel`, else its id): the name of its link. */
  labelOf: (id: string) => string;
  /**
   * Whether this click is the release of a drag (taken once). Dnd swallows the click on the element
   * it lifted; a card dropped in another column is a new element, so the board keeps its own note.
   */
  takeDragClick: () => boolean;
  /**
   * `plain`: the depth of a card, a surface one step above the board's host (it stands on it
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
  /**
   * A card moved: the new placement first, then what moved. Return a promise to save on a server:
   * the card stays in its new place, busy, until it settles; reject — it glides back.
   */
  onValueChange?: (value: KanbanValue, move: KanbanMove) => void | Promise<void>;
  /** Column ids in their order (controlled). */
  columnOrder?: readonly string[];
  /** Initial column ids in their order (uncontrolled). Defaults to the order of `columns`. */
  defaultColumnOrder?: readonly string[];
  /**
   * A column moved: the new order first, then what moved. Return a promise to save on a server:
   * the column stays in its new place, busy, until it settles; reject — it glides back.
   */
  onColumnOrderChange?: (order: readonly string[], move: KanbanColumnMove) => void | Promise<void>;
  /** A grip in every column header moves the column by pointer, touch and keyboard. */
  reorderableColumns?: boolean;
  /** Renders one card; return a `Kanban.Item`. */
  renderItem: (item: T) => React.ReactNode;
  /**
   * The card is a link: a real `<a>` named by `getLabel` covers the card and is its tab stop, so a
   * click, ⌘/Ctrl-click, a middle click and «open in new tab» work anywhere on it. A drag never
   * follows it; Alt + arrows still move the card from it.
   */
  getItemHref?: (item: T) => string;
  /**
   * Opens a card in place: a click on it (never on a control inside it, never after a drag) or
   * Enter / Space on the focused card. With `getItemHref` it gets the plain clicks only — call
   * `event.preventDefault()` there to route in the app instead of loading the page.
   */
  onItemClick?: (item: T, event: KanbanItemClickEvent) => void;
  /** Renders the trailing actions of a column header (add a card, a menu). */
  renderColumnActions?: (column: KanbanColumn) => React.ReactNode;
  /**
   * Renders the meta line under a column's title (a stage's figures: «12 сделок · 4,8 млн ₽»).
   * It describes the column's list, like `description`.
   */
  renderColumnMeta?: (column: KanbanColumn) => React.ReactNode;
  /**
   * Refuses a card in a column (a workflow rule): `false`, or a string that says why — spoken and
   * shown under the carried card. The column turns `danger` before the release.
   */
  canDrop?: (id: string, columnId: string) => boolean | string;
  /** `plain`: no wells, the header and the cards stand on the host; `well`: every column is a filled well. */
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
 * keyboard (Alt + arrows, Dnd's linked lists). Mounts its own `Dnd.Root` unless one is already
 * above it.
 */
function KanbanRoot<T>(props: KanbanRootProps<T>) {
  const outer = React.useContext(DragControllerContext);
  const board = <KanbanBoard {...props} />;
  return outer ? board : <Dnd.Root>{board}</Dnd.Root>;
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

/**
 * A refused card move glides back: the cards' boxes are read before the rollback is drawn, and every
 * card that moved (into its old column or aside in either column) glides from where it was.
 */
function useCardGlide(board: React.RefObject<HTMLElement | null>) {
  const from = React.useRef<Map<string, DOMRect> | null>(null);
  const [tick, setTick] = React.useState(0);
  const capture = React.useCallback(() => {
    const root = board.current;
    if (!root) return;
    from.current = new Map(
      Array.from(root.querySelectorAll<HTMLElement>(CARD_SELECTOR), (node) => [
        node.dataset.kanbanItem ?? "",
        node.getBoundingClientRect(),
      ]),
    );
    setTick((value) => value + 1);
  }, [board]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a capture is the trigger.
  React.useLayoutEffect(() => {
    const boxes = from.current;
    from.current = null;
    const root = board.current;
    if (!boxes || !root || prefersReducedMotion()) return;
    const timing = motionTiming("base");
    // Every box first, then every glide: a read after a started glide would force a style pass.
    const glides: [HTMLElement, number, number][] = [];
    for (const node of root.querySelectorAll<HTMLElement>(CARD_SELECTOR)) {
      const before = boxes.get(node.dataset.kanbanItem ?? "");
      // `animate` is missing in jsdom.
      if (!before || typeof node.animate !== "function") continue;
      const now = node.getBoundingClientRect();
      const dx = before.left - now.left;
      const dy = before.top - now.top;
      if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) glides.push([node, dx, dy]);
    }
    for (const [node, dx, dy] of glides) {
      node.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], timing);
    }
  }, [tick, board]);
  return capture;
}

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
  getItemHref,
  onItemClick,
  renderColumnActions,
  renderColumnMeta,
  canDrop,
  variant = "plain",
  loading = false,
  disabled = false,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: KanbanRootProps<T>) {
  const labels = { ...defaultKanbanLabels, ...labelsProp };
  const kind = `kanban-${React.useId()}`;
  const columnKind = `${kind}-column`;
  const controller = useDragController();
  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = useMergedRefs(boardRef, ref);
  const glideCards = useCardGlide(boardRef);
  const nestedDepth = useNestedSurfaceDepth();
  const cardDepth = variant === "plain" ? nestedDepth : undefined;

  const [storedValue, setValue] = useControllableState<KanbanValue>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_VALUE,
  });
  // Moves the owner is still saving are drawn ahead of its answer.
  const cardChanges = usePendingChanges(storedValue, placeCard);
  const value = cardChanges.shown;
  const pendingCards = React.useMemo(
    () => new Set(cardChanges.pending.map((change) => change.id)),
    [cardChanges.pending],
  );

  const [storedOrder, setOrder] = useControllableState<readonly string[]>({
    value: columnOrderProp,
    defaultValue: defaultColumnOrder ?? columns.map(getColumnId),
  });
  const columnChanges = usePendingChanges(storedOrder, placeColumn);
  const order = columnChanges.shown;
  const pendingColumns = React.useMemo(
    () => new Set(columnChanges.pending.map((change) => change.id)),
    [columnChanges.pending],
  );
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
        controller.announce(formatLabel(labels.moveFailed, { label: labelOf(id) }));
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
      onReject: () => controller.announce(formatLabel(labels.columnMoveFailed, { column: title })),
    });
    return outcome;
  };

  const locked = disabled || loading;
  const latest = React.useRef({ byId, getItemHref, onItemClick, getLabel });
  latest.current = { byId, getItemHref, onItemClick, getLabel };
  const links = getItemHref !== undefined;
  const opens = onItemClick !== undefined;
  // A drag that ended: the next click is its release, unless a new press or a key comes first.
  const dragClick = React.useRef(false);
  React.useEffect(() => {
    if (!links && !opens) return;
    const clear = () => {
      dragClick.current = false;
    };
    const off = controller.subscribeOverlay((event) => {
      if (event.type === "end") dragClick.current = true;
    });
    window.addEventListener("pointerdown", clear, true);
    window.addEventListener("keydown", clear, true);
    return () => {
      off();
      window.removeEventListener("pointerdown", clear, true);
      window.removeEventListener("keydown", clear, true);
    };
  }, [controller, links, opens]);
  // Stable while the props are: the cards read the latest data and callbacks themselves.
  const context = React.useMemo<BoardContextValue>(
    () => ({
      disabled: locked,
      pending: pendingCards,
      hrefOf: (id) => {
        const { byId: items, getItemHref: href } = latest.current;
        const item = items.get(id);
        return links && item !== undefined ? href?.(item) : undefined;
      },
      openItem: opens
        ? (id, event) => {
            const item = latest.current.byId.get(id);
            if (item !== undefined) latest.current.onItemClick?.(item, event);
          }
        : null,
      labelOf: (id) => {
        const item = latest.current.byId.get(id);
        const label = latest.current.getLabel;
        return item !== undefined && label ? label(item) : id;
      },
      takeDragClick: () => {
        const was = dragClick.current;
        dragClick.current = false;
        return was;
      },
      cardDepth,
    }),
    [locked, pendingCards, links, opens, cardDepth],
  );

  return (
    <BoardContext value={context}>
      <div
        ref={rootRef}
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
            getLabel={(column) => formatLabel(labels.column, { column: column.title })}
            disabled={!reorderableColumns || locked}
            onReorder={(id, beforeId) => moveColumn(id, beforeId)}
            renderItem={(column, columnIndex) => (
              <KanbanColumnView
                column={column}
                cardDepth={cardDepth}
                cards={idsOf(column.id).flatMap((id) => {
                  const item = byId.get(id);
                  return item === undefined ? [] : [item];
                })}
                skeletons={SKELETON_CARDS[columnIndex % SKELETON_CARDS.length] ?? 1}
                kind={kind}
                getId={getId}
                getLabel={getLabel}
                accepts={(id) => accepts(column, id)}
                onReorder={(id, beforeId) => place(id, column.id, beforeId)}
                renderItem={renderItem}
                actions={renderColumnActions?.(column)}
                meta={renderColumnMeta?.(column)}
                reorderable={reorderableColumns && !disabled}
                pending={pendingColumns.has(column.id)}
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
  meta: React.ReactNode;
  reorderable: boolean;
  /** The owner is still saving this column's move. */
  pending: boolean;
  loading: boolean;
  disabled: boolean;
  labels: KanbanLabels;
};

const hasContent = (node: React.ReactNode) => node != null && node !== false && node !== "";

function KanbanColumnView<T>({
  column,
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
  pending,
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
  const showMeta = hasContent(meta);
  const describedBy =
    [column.description ? descriptionId : null, showMeta ? metaId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Dnd.SortableItem
      id={column.id}
      locked={column.locked ?? false}
      className={styles.column}
      data-kanban-column={column.id}
      data-full={full || undefined}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      disabled={pending}
      // The grip carries the shortcuts: the column itself is not focusable.
      aria-keyshortcuts={undefined}
    >
      <ControlSizeProvider value="s">
        <div className={styles.header} data-reorderable={reorderable || undefined}>
          <h3 id={headingId} className={styles.title}>
            {column.title}
          </h3>
          {loading ? null : (
            <>
              {/* The stage's hue; a full column turns it orange (and reads `count / limit`). */}
              <Badge.Root color={full ? "orange" : (column.color ?? "gray")} aria-hidden="true">
                {column.limit === undefined ? count : `${count} / ${column.limit}`}
              </Badge.Root>
              <VisuallyHidden>{countText}</VisuallyHidden>
            </>
          )}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
          {/* While the column's move is saved, a spinner stands in for its grip. */}
          {reorderable && pending ? (
            <span className={cx(styles.grip, styles.gripSpinner, enterMotion.enter)}>
              <Spinner size="xs" aria-hidden="true" />
            </span>
          ) : reorderable ? (
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
          {showMeta ? (
            <div id={metaId} className={styles.meta}>
              {meta}
            </div>
          ) : null}
        </div>
      </ControlSizeProvider>
      <ScrollContainer className={styles.body}>
        <Crossfade state={loading ? "loading" : "ready"} className={styles.swap}>
          {loading ? (
            <div className={styles.list}>
              {Array.from({ length: skeletons }, (_, index) => (
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
          ) : (
            <div className={styles.drop}>
              <Dnd.Sortable
                as="ul"
                kind={kind}
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
                  <EmptyPage.Root layout="compact" className={styles.empty}>
                    <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
                    {disabled ? null : (
                      <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description>
                    )}
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
  /** This card cannot be dragged or moved. */
  disabled?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * One card: an `<li>` on a filled surface; drags by the whole card, moves with Alt + arrows. While
 * the owner saves its move it is busy: dimmed under a spinner, still. With `getItemHref` a link
 * covers it; with `onItemClick` a click, Enter or Space opens it.
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
  const pending = board.pending.has(id);
  const href = board.hrefOf(id);
  const { openItem } = board;
  // A link card: the link is the tab stop, the card is focused only after a keyboard move to
  // another column. An in-place card stays a tab stop on a read-only board too.
  const focus = href !== undefined ? { tabIndex: -1 } : openItem ? { tabIndex: 0 } : null;
  return (
    <Dnd.SortableItem
      id={id}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...focus}
      {...rest}
      data-kanban-item={id}
      data-depth={board.cardDepth}
      data-surface={board.cardDepth !== undefined || undefined}
      data-pending={pending || undefined}
      data-link={href !== undefined || undefined}
      data-clickable={(href === undefined && openItem !== null) || undefined}
      className={cx(styles.item, className)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || href !== undefined || !openItem || !opensRow(event)) return;
        // The release of a drag never opens the card.
        if (board.takeDragClick()) return;
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
          onClick={(event) => {
            // The release of a drag follows no link.
            if (board.takeDragClick()) {
              event.preventDefault();
              return;
            }
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
      {pending ? (
        <Spinner
          size="s"
          aria-hidden="true"
          className={cx(styles.itemSpinner, enterMotion.enter)}
        />
      ) : null}
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
