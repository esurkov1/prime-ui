import * as React from "react";
import { Button } from "@/components/button/Button";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { useScrollRegion } from "@/hooks/useScrollRegion";
import { flowGaps, useVirtualRows } from "@/hooks/useVirtualRows";
import { GripVertical } from "@/icons/glyphs/grip-vertical";
import { Lock } from "@/icons/glyphs/lock";
import { Plus } from "@/icons/glyphs/plus";
import addTileStyles from "@/internal/addTile.module.css";
import { cx } from "@/internal/cx";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { fieldTierClass } from "@/internal/fieldClasses";
import { motionTiming } from "@/internal/motionTiming";
import { namedRole } from "@/internal/namedRole";
import { handoffFocus } from "@/internal/overlay/focus";
import { press } from "@/internal/press";
import { stillCopy } from "@/internal/stillCopy";
import textRole from "@/internal/textRole.module.css";
import { touchTargetClass } from "@/internal/touchTarget";
import type { AsyncHandler } from "@/internal/usePendingChanges";

import { DragControllerContext, useDragController } from "./context";
import styles from "./Dnd.module.css";
import { DragOverlay } from "./DragOverlay";
import {
  createDragController,
  type DragController,
  type DragItem,
  type DragOutcome,
} from "./dragSession";
import { type Point, type Rect, rectOf } from "./geometry";
import { useInPlaceShift } from "./inPlaceRow";
import { DND_LABELS, type DndLabels } from "./labels";
import { useStoreSelector } from "./store";
import { DRAG_FROM_CONTROLS, useDragSource } from "./useDragSource";
import { useDropTarget } from "./useDropTarget";
import { useSortableList } from "./useSortableList";

export type { DragItem, DragOutcome } from "./dragSession";
export type { DndLabels } from "./labels";
/** Applies a reorder to an array; hosts of `Dnd.Sortable` (FieldList) take it from this module. */
export { moveBefore } from "./useSortableList";

/**
 * Set on a `Dnd.Sortable` while an item of its kind is carried: the list may take it. A host scopes
 * its drag-time look to it (no hover-only actions, no snapping in the scroller around the list).
 */
export const DND_CARRYING_ATTRIBUTE = "data-dnd-carrying";

// ---------------------------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------------------------

export type DndRootProps = {
  labels?: Partial<DndLabels>;
  children?: React.ReactNode;
};

/**
 * Owns the one drag session the app shares, the overlay that follows the pointer and the live
 * region. Mount once above every screen that drags: a drag crosses component boundaries. A root
 * inside another one is its children: the outer session stays the one session.
 */
function DndRoot(props: DndRootProps) {
  const outer = React.useContext(DragControllerContext);
  return outer ? props.children : <DndSession {...props} />;
}
DndRoot.displayName = "Dnd.Root";

/**
 * The live region of the drag session above, for a host that announces its own changes of the same
 * items (a FileUpload set of tiles): one region speaks them in order. `null` without a `Dnd.Root`.
 */
export function useDragAnnouncer(): ((message: string) => void) | null {
  const controller = React.useContext(DragControllerContext);
  return controller ? controller.announce : null;
}

function DndSession({ labels, children }: DndRootProps) {
  // The controller outlives renders and reads the current strings when it needs them.
  const labelsRef = React.useRef<DndLabels>(DND_LABELS);
  labelsRef.current = { ...DND_LABELS, ...labels };
  const [controller] = React.useState(() => createDragController(() => labelsRef.current));
  const message = useStoreSelector(controller.store, (state) => state.announcement.message);

  React.useEffect(() => controller.destroy, [controller]);

  return (
    <DragControllerContext value={controller}>
      {children}
      <DragOverlay controller={controller} />
      <VisuallyHidden live="polite">{message}</VisuallyHidden>
    </DragControllerContext>
  );
}

// ---------------------------------------------------------------------------------------------
// Handle
// ---------------------------------------------------------------------------------------------

export type DndHandleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  ref?: React.Ref<HTMLElement>;
};

/** What a `Dnd.Handle` needs from the item around it. */
type ItemContextValue = {
  /** The item holds its place: the grip is a lock. */
  locked: boolean;
  /** The owner is saving the item's move: the grip is busy. */
  busy: boolean;
  /** The grip is the item's keyboard target (`handle` list): its keys and role description. */
  keys: { shortcuts: string; roleDescription: string } | null;
};

const ItemContext = React.createContext<ItemContextValue>({
  locked: false,
  busy: false,
  keys: null,
});

/**
 * Whether the owner is still saving the move of the `Dnd.SortableItem` around (its `onReorder`
 * promise): for a host that draws the busy state inside the item itself (a card's spinner).
 */
export function useSortableItemBusy(): boolean {
  return React.useContext(ItemContext).busy;
}

/** Stops the browser's own drag of an image or a link inside an item: the kit drag owns the press. */
function preventNativeDrag(event: React.DragEvent<HTMLElement>) {
  event.preventDefault();
}

export type DndLockProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "role"> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The mark of a thing that holds its place (a pinned row, a system column): the lock a `Dnd.Handle`
 * turns into in a `locked` item, and the same mark where a host shows a fixed row without a grip
 * (FieldList). Named `labels.locked` unless the host names it.
 */
export function DndLock({ className, "aria-label": ariaLabel, ...rest }: DndLockProps) {
  const controller = useDragController();
  return (
    <span
      {...rest}
      role="img"
      aria-label={ariaLabel ?? controller.labels().locked}
      className={cx(fieldTierClass, styles.lock, className)}
      data-size="xs"
      data-dnd-lock=""
    >
      <Lock />
    </span>
  );
}

/**
 * The grip of a `handle` item: a ghost icon-only Button (`xs`), so it is reachable by keyboard
 * (Alt+arrows reorder) and carries the item's key shortcuts and role description. In a `locked`
 * item it is a `Dnd.Lock` instead; while the owner saves the item's move it is busy.
 */
function DndHandle({ className, "aria-label": ariaLabel, ref, ...rest }: DndHandleProps) {
  const controller = useDragController();
  const item = React.useContext(ItemContext);
  // One callback ref fits the grip and the lock.
  const elementRef = useMergedRefs<HTMLElement>(ref);
  if (item.locked) {
    const { disabled: _disabled, ...attributes } = rest;
    return <DndLock {...attributes} ref={elementRef} className={className} />;
  }
  return (
    <Button.Root
      ref={elementRef}
      variant="ghost"
      tone="neutral"
      size="xs"
      loading={item.busy}
      aria-label={ariaLabel ?? controller.labels().handle}
      aria-keyshortcuts={item.keys?.shortcuts}
      aria-roledescription={item.keys?.roleDescription}
      {...rest}
      data-dnd-handle=""
      className={cx(styles.handle, className)}
    >
      <Button.Icon>
        <GripVertical />
      </Button.Icon>
    </Button.Root>
  );
}
DndHandle.displayName = "Dnd.Handle";

// ---------------------------------------------------------------------------------------------
// Sortable
// ---------------------------------------------------------------------------------------------

type ItemTag = "div" | "li" | "tr" | "th";

const ITEM_TAG: Record<"div" | "ul" | "ol" | "tbody" | "tr", ItemTag> = {
  div: "div",
  ul: "li",
  ol: "li",
  tbody: "tr",
  tr: "th",
};

type SortableContextValue = {
  itemProps: ReturnType<typeof useSortableList>["itemProps"];
  disabled: boolean;
  handle: boolean;
  itemTag: ItemTag;
  /** The keys that move an item: along the axis, and across it to linked lists. */
  shortcuts: string;
  /** Items whose move the owner is still saving. */
  pending: ReadonlySet<string>;
  /**
   * A windowed list (`virtual`): the ref that measures an item, and its place in the whole list —
   * the items not drawn still count for assistive tech. `null` when every item is drawn.
   */
  windowed: {
    measure: (id: string) => ((node: HTMLElement | null) => void) | undefined;
    position: (id: string) => number;
    size: number;
  } | null;
};

const ALONG: Record<"x" | "y" | "grid", string> = {
  y: "Alt+ArrowUp Alt+ArrowDown",
  x: "Alt+ArrowLeft Alt+ArrowRight",
  grid: "Alt+ArrowLeft Alt+ArrowRight",
};

const ACROSS: Record<"x" | "y" | "grid", string> = {
  y: " Alt+ArrowLeft Alt+ArrowRight",
  x: " Alt+ArrowUp Alt+ArrowDown",
  grid: "",
};

const SortableContext = React.createContext<SortableContextValue | null>(null);

export type DndSortableProps<T> = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  items: readonly T[];
  getId: (item: T) => string;
  getLabel?: (item: T) => string;
  onReorder: AsyncHandler<[id: string, beforeId: string | null]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  axis?: "x" | "y" | "grid";
  handle?: boolean;
  disabled?: boolean;
  kind?: string;
  canDrop?: (id: string) => boolean | string;
  empty?: React.ReactNode;
  as?: "div" | "ul" | "ol" | "tbody" | "tr";
  "aria-label"?: string;
  header?: React.ReactNode;
  virtual?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/** Where `list` starts in the content of `scroller`, px: layout offsets, which scrolling leaves alone. */
function offsetIn(scroller: HTMLElement | null, list: HTMLElement | null): number {
  if (!scroller || !list) return 0;
  let top = 0;
  let node: HTMLElement | null = list;
  while (node && node !== scroller && scroller.contains(node)) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  // The chain stepped past the scroller (it is not positioned): both are measured from there.
  return node === scroller ? top : top - scroller.offsetTop;
}

/** Every item shares one measured height until it is measured itself. */
const ONE_GROUP = () => 0;

/**
 * A reorderable list: pointer drag with a gap where the item lands, neighbours that glide aside, an
 * optimistic order, auto-scroll near the edges and an Alt+arrow keyboard path.
 */
function DndSortable<T>({
  items,
  getId,
  getLabel,
  onReorder,
  renderItem,
  axis = "y",
  handle = false,
  disabled = false,
  kind,
  canDrop,
  empty,
  as: Tag = "div",
  header,
  virtual = false,
  className,
  children: trailing,
  ref: forwardedRef,
  ...rest
}: DndSortableProps<T>) {
  const generatedKind = React.useId();
  const linked = kind !== undefined;
  const ids = React.useMemo(() => items.map(getId), [items, getId]);
  const labelById = React.useMemo(
    () => new Map(items.map((item) => [getId(item), getLabel?.(item) ?? getId(item)])),
    [items, getId, getLabel],
  );
  const labelOf = React.useCallback((id: string) => labelById.get(id) ?? id, [labelById]);

  const list = useSortableList({
    kind: kind ?? generatedKind,
    linked,
    items: ids,
    labelOf,
    onReorder,
    axis,
    disabled,
    handleOnly: handle,
    canDrop,
    // A head row keeps its cells in their columns: the others glide aside by transforms instead.
    inPlace: ITEM_TAG[Tag] === "th",
  });

  const byId = React.useMemo(
    () => new Map(items.map((item) => [getId(item), item])),
    [items, getId],
  );
  const itemTag = ITEM_TAG[Tag];
  const shortcuts = ALONG[axis] + (linked ? ACROSS[axis] : "");
  const [rowElement, setRowElement] = React.useState<HTMLElement | null>(null);

  // `virtual`: a vertical list inside a ScrollContainer draws only the items around the view (and
  // the ones it must keep: carried, focused, at the gap, arriving by a keyboard move); spacers stand
  // for the rest.
  const region = useScrollRegion();
  const windowed =
    virtual && axis === "y" && (itemTag === "li" || itemTag === "div") && region !== null;
  const drawn = React.useMemo(() => list.order.filter((id) => byId.has(id)), [list.order, byId]);
  const indexOf = React.useMemo(() => new Map(drawn.map((id, index) => [id, index])), [drawn]);
  const [rowGap, setRowGap] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!windowed || !rowElement) return;
    setRowGap(Number.parseFloat(getComputedStyle(rowElement).rowGap) || 0);
  }, [windowed, rowElement]);
  const scrollRef = React.useMemo<React.RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        return windowed ? (region?.element() ?? null) : null;
      },
    }),
    [region, windowed],
  );
  const offset = React.useCallback(
    () => offsetIn(region?.element() ?? null, rowElement),
    [region, rowElement],
  );
  const getKey = React.useCallback((index: number) => drawn[index] ?? index, [drawn]);
  const estimate = React.useMemo(() => readCssLengthPx("--prime-space-16", 64), []);
  const estimateSize = React.useCallback(() => estimate, [estimate]);
  const virtualRows = useVirtualRows({
    count: windowed ? drawn.length : 0,
    scrollRef,
    getKey,
    estimateSize,
    getGroup: ONE_GROUP,
    offset,
    pinned: list.keep.flatMap((id) => {
      const index = indexOf.get(id);
      return index === undefined ? [] : [index];
    }),
    gap: rowGap,
  });
  const { measure } = virtualRows;
  // A carried item over a list that drew other items as it scrolled (an edge auto-scroll): the gap
  // is placed again among the items now drawn, not the ones drawn a frame ago.
  const controller = useDragController();
  const firstRow = virtualRows.rows[0]?.index ?? -1;
  const lastRow = virtualRows.rows[virtualRows.rows.length - 1]?.index ?? -1;
  React.useLayoutEffect(() => {
    if (!windowed || !list.carrying || firstRow < 0 || lastRow < 0) return;
    controller.reresolve();
  }, [windowed, list.carrying, firstRow, lastRow, controller]);
  const windowedContext = React.useMemo(
    () =>
      windowed
        ? {
            measure: (id: string) => {
              const index = indexOf.get(id);
              return index === undefined ? undefined : measure(index);
            },
            position: (id: string) => (indexOf.get(id) ?? 0) + 1,
            size: drawn.length,
          }
        : null,
    [windowed, indexOf, measure, drawn.length],
  );

  const context = React.useMemo<SortableContextValue>(
    () => ({
      itemProps: list.itemProps,
      disabled,
      handle,
      itemTag,
      shortcuts,
      pending: list.pending,
      windowed: windowedContext,
    }),
    [list.itemProps, disabled, handle, itemTag, shortcuts, list.pending, windowedContext],
  );

  // A head row inserts no gap node: the carried cell holds its column and is drawn as the gap, and
  // it and the others glide to where they will stand (`useInPlaceShift`).
  const inPlace = itemTag === "th";
  useInPlaceShift(inPlace ? rowElement : null, list.order, list.draggingId, list.gapBefore);
  const placeholder =
    list.gap && itemTag !== "th" ? (
      <DndPlaceholder
        as={itemTag}
        width={list.gap.width}
        height={list.gap.height}
        radius={list.gap.radius}
        bare={list.gap.bare}
        key="dnd-gap"
      />
    ) : null;

  // During a drag `index` is the place an item will have on release, so a position it shows (a
  // number) follows the gap as it moves, not only the drop.
  const shownIndex = previewIndex(list.order, list.draggingId, list.gapBefore);
  const children: React.ReactNode[] = [];
  const pushItem = (id: string, index: number) => {
    const item = byId.get(id);
    if (item === undefined) return;
    if (placeholder && list.gapBefore === id) children.push(placeholder);
    children.push(
      <React.Fragment key={id}>{renderItem(item, shownIndex.get(id) ?? index)}</React.Fragment>,
    );
  };
  if (windowed) {
    const SpacerTag = itemTag === "li" ? "li" : "div";
    const spacer = (height: number, key: string) =>
      height > 0 ? (
        <SpacerTag
          key={key}
          aria-hidden="true"
          className={styles.spacer}
          style={{ blockSize: height }}
        />
      ) : null;
    const laid = flowGaps(virtualRows, rowGap);
    for (const row of laid.rows) {
      const id = drawn[row.index];
      if (id === undefined) continue;
      children.push(spacer(row.spacer, `dnd-spacer-${id}`));
      pushItem(id, list.order.indexOf(id));
    }
    children.push(spacer(laid.end, "dnd-spacer-end"));
  } else {
    list.order.forEach(pushItem);
  }
  if (placeholder && list.gapBefore === null) children.push(placeholder);
  if (empty != null && empty !== false && list.order.length === 0) {
    if (itemTag === "tr") {
      children.push(
        <tr key="dnd-empty" className={styles.empty} data-dnd-empty="">
          <td ref={spanEveryColumn}>{empty}</td>
        </tr>,
      );
    } else {
      const EmptyTag = itemTag;
      children.push(
        <EmptyTag
          key="dnd-empty"
          className={styles.empty}
          data-dnd-empty=""
          // Not an item: an empty list still reads as a list of nothing.
          role={EmptyTag === "li" ? "presentation" : undefined}
        >
          {empty}
        </EmptyTag>,
      );
    }
  }

  const { ref: targetRef, ...targetData } = list.containerProps;
  const ref = useMergedRefs<HTMLElement | null>(targetRef, forwardedRef, setRowElement);
  return (
    <SortableContext value={context}>
      <Tag
        ref={ref}
        {...rest}
        {...targetData}
        // A table body or a head row keeps its table layout: the list look (flex column, gap) is
        // for the others.
        className={cx(
          Tag === "tbody" || Tag === "tr" ? styles.sortableRows : styles.sortable,
          className,
        )}
        data-axis={axis}
        data-disabled={disabled || undefined}
        data-windowed={windowed || undefined}
        data-dragging={list.draggingId !== null || undefined}
        {...{ [DND_CARRYING_ATTRIBUTE]: list.carrying || undefined }}
      >
        {header}
        {children}
        {trailing}
      </Tag>
    </SortableContext>
  );
}
DndSortable.displayName = "Dnd.Sortable";

export type DndAddButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  label?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The add tile at the end of a `Dnd.Sortable` (its `children`): a cell of the list (`li` in
 * `ul` / `ol`, else `div`) that is no item — never carried, never a place to drop in front of —
 * holding a `<button>` that fills it, so in a grid it stands as tall as the cells of its row.
 */
function DndAddButton({
  label,
  className,
  disabled,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: DndAddButtonProps) {
  const context = React.useContext(SortableContext);
  const controller = useDragController();
  const inactive = useInheritedDisabled(disabled);
  if (context === null) throw new Error("Dnd.AddButton must be rendered inside Dnd.Sortable");
  if (context.itemTag === "tr" || context.itemTag === "th") {
    throw new Error('Dnd.AddButton is a cell of a "div", "ul" or "ol" Dnd.Sortable');
  }
  const Cell = context.itemTag;
  const text = label ?? controller.labels().add;
  return (
    <Cell ref={handFocusOnLeave} className={cx(addTileStyles.cell, styles.add)} data-dnd-add="">
      {/* Not `Button`: the tile is the dashed add slot FileUpload draws (`internal/addTile`), not a
          button look. */}
      <button
        ref={ref}
        type="button"
        // The word leaves a narrow cell (only the «+» stays): the name never goes with it.
        aria-label={ariaLabel ?? text}
        {...rest}
        disabled={inactive}
        className={cx(
          addTileStyles.target,
          press.press,
          touchTargetClass,
          styles.addButton,
          className,
        )}
      >
        <span className={cx(fieldTierClass, addTileStyles.icon)} data-size="xs" aria-hidden="true">
          <Plus />
        </span>
        <span className={cx(textRole.caption, addTileStyles.text, styles.addText)}>{text}</span>
      </button>
    </Cell>
  );
}
DndAddButton.displayName = "Dnd.AddButton";

/** The tile leaves while focused (the add that filled the list): focus goes to the last item. */
function handFocusOnLeave(cell: HTMLElement | null) {
  if (!cell) return;
  const list = cell.parentElement;
  return () => {
    if (!list || !cell.contains(document.activeElement)) return;
    queueMicrotask(() => {
      // Strict Mode replays a detach on a cell that stays: only a cell that left hands focus on.
      if (!list.isConnected || cell.isConnected) return;
      const items = list.querySelectorAll<HTMLElement>(":scope > [data-dnd-item]");
      handoffFocus(cell, items[items.length - 1]);
    });
  };
}

/**
 * A cell that spans every column of its table: the gap and the empty row of a `tbody` list. The
 * count is read from a row of the table (a head row included), so the list need not know it.
 */
function spanEveryColumn(cell: HTMLTableCellElement | null) {
  const table = cell?.closest("table");
  if (!cell || !table) return;
  const row = Array.from(table.rows).find(
    (candidate) => candidate !== cell.parentElement && !candidate.hasAttribute("data-dnd-gap"),
  );
  const span = row ? Array.from(row.cells).reduce((sum, each) => sum + each.colSpan, 0) : 1;
  cell.colSpan = Math.max(1, span);
}

/**
 * Where every item would stand if the drag ended now: the carried item at the gap, the others
 * closing its hole; an item from another list only takes a place (the ones after the gap move on).
 */
function previewIndex(
  order: readonly string[],
  draggingId: string | null,
  gapBefore: string | null | undefined,
): Map<string, number> {
  const index = new Map<string, number>();
  if (gapBefore === undefined || gapBefore === draggingId) {
    order.forEach((id, at) => {
      index.set(id, at);
    });
    return index;
  }
  const rest = order.filter((id) => id !== draggingId);
  const at = gapBefore === null ? rest.length : rest.indexOf(gapBefore);
  const shown: Array<string | null> = [...rest];
  shown.splice(at === -1 ? rest.length : at, 0, draggingId);
  shown.forEach((id, position) => {
    if (id !== null) index.set(id, position);
  });
  return index;
}

export type DndSortableItemProps = {
  id: string;
  disabled?: boolean;
  locked?: boolean;
  dragFromControls?: boolean;
  bare?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "id"> &
  // A head cell item (`as="tr"`) says what it heads.
  Pick<React.ThHTMLAttributes<HTMLTableCellElement>, "scope">;

/**
 * One item of a `Dnd.Sortable`. Renders `li` inside `ul` / `ol`, `tr` inside `tbody`, `div` otherwise.
 * The item is the keyboard target (a `div` one is a named `button`), or with `handle` its grip is.
 */
function DndSortableItem({
  id,
  disabled: itemDisabled = false,
  locked = false,
  dragFromControls = false,
  bare = false,
  className,
  children,
  onPointerDown,
  onKeyDown,
  onDragStart,
  ref,
  ...rest
}: DndSortableItemProps) {
  const context = React.useContext(SortableContext);
  // A callback ref fits whichever tag the list picks; a windowed list measures the item too.
  const elementRef = useMergedRefs<HTMLElement | null>(ref, context?.windowed?.measure(id));
  if (context === null) throw new Error("Dnd.SortableItem must be rendered inside Dnd.Sortable");
  const Tag = context.itemTag;
  const disabled = context.disabled || itemDisabled;
  const busy = context.pending.has(id);
  const still = disabled || locked || busy;
  const sortable = context.itemProps(id);
  const roleDescription = sortable["aria-roledescription"];
  // The keyboard target carries the keys and says what it is; a generic `div` needs a role for
  // that, `li` and `tr` have theirs.
  const ownKeys = !context.handle && !still;
  const role = ownKeys && Tag === "div" ? namedRole(rest, "button") : rest.role;
  const describes = ownKeys && (Tag !== "div" || role !== undefined);
  const item = React.useMemo<ItemContextValue>(
    () => ({
      locked,
      busy,
      keys:
        context.handle && !still && roleDescription
          ? { shortcuts: context.shortcuts, roleDescription }
          : null,
    }),
    [locked, busy, context.handle, still, roleDescription, context.shortcuts],
  );
  return (
    <Tag
      ref={elementRef}
      tabIndex={ownKeys ? 0 : undefined}
      aria-keyshortcuts={ownKeys ? context.shortcuts : undefined}
      {...rest}
      {...sortable}
      role={role}
      aria-roledescription={describes ? roleDescription : undefined}
      aria-busy={busy || rest["aria-busy"] || undefined}
      // A windowed list draws some of its items: each one says its place in the whole list.
      aria-posinset={context.windowed && Tag === "li" ? context.windowed.position(id) : undefined}
      aria-setsize={context.windowed && Tag === "li" ? context.windowed.size : undefined}
      onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event);
        if (!still && !event.defaultPrevented) sortable.onPointerDown(event);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (!still && !event.defaultPrevented) sortable.onKeyDown(event);
      }}
      onDragStart={(event: React.DragEvent<HTMLElement>) => {
        onDragStart?.(event);
        if (!still) preventNativeDrag(event);
      }}
      className={cx(styles.draggable, className)}
      data-disabled={disabled || undefined}
      data-locked={locked || undefined}
      data-pending={busy || undefined}
      data-handle={context.handle || undefined}
      data-dnd-bare={bare || undefined}
      {...{ [DRAG_FROM_CONTROLS]: (dragFromControls && !context.handle) || undefined }}
    >
      <ItemContext value={item}>{children}</ItemContext>
    </Tag>
  );
}
DndSortableItem.displayName = "Dnd.SortableItem";

/**
 * Leaves a copy of a gap that is leaving mid-drag, out of the flow at the same spot, and fades it
 * out. First in its parent, so the items gliding into the hole are drawn over it. A drop or a
 * cancel ends the drag before the gap goes: then the item itself takes the place, nothing fades.
 * Measured now, while the node is still drawn; placed after the commit, before the paint, and only
 * if the node really left (Strict Mode replays an unmount on a node that stays).
 */
function fadeOutGap(node: HTMLElement, controller: DragController) {
  const parent = node.parentElement;
  const container = node.offsetParent;
  if (
    // A table row cannot stand out of the flow; it leaves with the items closing over it.
    node.tagName === "TR" ||
    controller.store.getSnapshot().item === null ||
    !parent ||
    !container ||
    prefersReducedMotion() ||
    typeof node.animate !== "function"
  ) {
    return;
  }
  const rect = rectOf(node);
  const box = rectOf(container);
  const ghost = stillCopy(node, false);
  ghost.removeAttribute("data-dnd-gap");
  // Out of the flow and on its way out: hosts that count cells (a grid's first cell) skip it.
  ghost.setAttribute("data-dnd-ghost", "");
  ghost.style.position = "absolute";
  ghost.style.margin = "0";
  ghost.style.left = `${rect.left - box.left - container.clientLeft + container.scrollLeft}px`;
  ghost.style.top = `${rect.top - box.top - container.clientTop + container.scrollTop}px`;
  queueMicrotask(() => {
    if (node.isConnected || !parent.isConnected) return;
    parent.prepend(ghost);
    const animation = ghost.animate([{ opacity: 1 }, { opacity: 0 }], {
      ...motionTiming("fast", "exit"),
      fill: "forwards",
    });
    const remove = () => ghost.remove();
    animation.addEventListener("finish", remove, { once: true });
    animation.addEventListener("cancel", remove, { once: true });
  });
}

function DndPlaceholder({
  as: Tag,
  width,
  height,
  radius,
  bare,
}: {
  as: Exclude<ItemTag, "th">;
  width: number;
  height: number;
  radius: string | null;
  bare: boolean;
}) {
  const controller = useDragController();
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const entered = React.useRef(false);

  // Fades in once per gap. Not `enterMotion`: React re-inserts the gap's node as it moves through the
  // list, which restarts a CSS animation, and Strict Mode re-attaches the ref, so the flag (not the
  // node) decides; a WAAPI animation keeps running through the move.
  const ref = React.useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
    if (!node || entered.current) return;
    entered.current = true;
    if (prefersReducedMotion() || typeof node.animate !== "function") return;
    node.animate([{ opacity: 0 }, { opacity: 1 }], motionTiming("base", "enter"));
  }, []);

  // The gap leaves mid-drag (the pointer moved on to another list or a zone): it fades out on the
  // spot while the items close the hole, and the next gap fades in where the item would land. Read
  // before React detaches the node, so it is still drawn where the person saw it.
  React.useLayoutEffect(
    () => () => {
      const node = nodeRef.current;
      if (node) fadeOutGap(node, controller);
    },
    [controller],
  );
  const style = {
    "--dnd-gap-width": `${width}px`,
    "--dnd-gap-height": `${height}px`,
    // The gap is shaped like the item it stands in for.
    ...(radius ? { "--dnd-gap-radius": radius } : {}),
  } as React.CSSProperties;
  if (Tag === "tr") {
    // A row of the lifted row's height across every column: a table body takes no other child.
    return (
      // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an empty row with no tab stop; it is no row of data.
      <tr ref={ref} aria-hidden="true" data-dnd-gap="" className={styles.gapRow} style={style}>
        <td ref={spanEveryColumn} />
      </tr>
    );
  }
  return (
    <Tag
      ref={ref}
      aria-hidden="true"
      data-dnd-gap=""
      data-dnd-bare={bare || undefined}
      className={styles.placeholder}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------------------------
// Draggable
// ---------------------------------------------------------------------------------------------

export type DndDraggableProps<TData = unknown> = {
  kind: string;
  id: string;
  data?: TData;
  label?: string;
  disabled?: boolean;
  handle?: boolean;
  as?: "div" | "li" | "span" | "article" | "section";
  onDragStart?: (item: DragItem<TData>, point: Point, origin: Rect) => void;
  onDragEnd?: (item: DragItem<TData>, outcome: DragOutcome) => void;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "id" | "onDragStart" | "onDragEnd">;

/** Something to carry onto a `Dnd.DropZone`. The source stays in place, faded, until the drop. */
function DndDraggable<TData = unknown>({
  kind,
  id,
  data,
  label,
  disabled = false,
  handle = false,
  as: Tag = "div",
  onDragStart,
  onDragEnd,
  className,
  children,
  onPointerDown,
  onDragStartCapture,
  ref,
  ...rest
}: DndDraggableProps<TData>) {
  const source = useDragSource<TData | undefined>({
    kind,
    disabled,
    handleOnly: handle,
    onDragStart,
    onDragEnd,
  });
  const dragProps = source.props({ id, data, label: label ?? id });
  // A callback ref fits whichever tag `as` picks.
  const elementRef = useMergedRefs<HTMLElement | null>(ref);
  // A named source is a `button`; a role description needs a role (an `li` has its own).
  const role = Tag === "li" ? rest.role : namedRole(rest, "button");
  const describes = Tag === "li" || role !== undefined;
  return (
    <Tag
      ref={elementRef}
      {...rest}
      {...dragProps}
      role={role}
      aria-roledescription={describes ? dragProps["aria-roledescription"] : undefined}
      onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) dragProps.onPointerDown(event);
      }}
      // `onDragStart` is the kit's own event here; the browser's is stopped in the capture phase.
      onDragStartCapture={(event: React.DragEvent<HTMLElement>) => {
        onDragStartCapture?.(event);
        if (!disabled) preventNativeDrag(event);
      }}
      className={cx(styles.draggable, className)}
      data-disabled={disabled || undefined}
    >
      {children}
    </Tag>
  );
}
DndDraggable.displayName = "Dnd.Draggable";

// ---------------------------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------------------------

export type DndDropZoneProps<TData = unknown> = {
  accepts: string | readonly string[] | ((item: DragItem) => boolean);
  onDrop: (item: DragItem<TData>) => void;
  canDrop?: (item: DragItem<TData>) => boolean | string;
  onEnter?: (item: DragItem<TData>) => void;
  onLeave?: () => void;
  flashOnDrop?: boolean;
  disabled?: boolean;
  as?: "div" | "section" | "li" | "ul" | "ol" | "span";
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "onDrop">;

/** A box that takes dropped items. `data-dnd-over` / `data-dnd-reject` / `data-dnd-flash` mirror its state. */
function DndDropZone<TData = unknown>({
  accepts,
  onDrop,
  canDrop,
  onEnter,
  onLeave,
  flashOnDrop = false,
  disabled = false,
  as: Tag = "div",
  className,
  children,
  ref: forwardedRef,
  ...rest
}: DndDropZoneProps<TData>) {
  const target = useDropTarget<true, TData>({
    accepts,
    resolve: () => true,
    canDrop: canDrop ? (_value, item) => canDrop(item) : undefined,
    onDrop: (_value, item) => onDrop(item),
    onEnter,
    onLeave,
    flashOnDrop,
    disabled,
  });
  const { ref: targetRef, ...targetData } = target.props;
  const ref = useMergedRefs<HTMLElement | null>(targetRef, forwardedRef);
  return (
    <Tag
      ref={ref}
      {...rest}
      {...targetData}
      className={cx(styles.dropZone, className)}
      data-disabled={disabled || undefined}
    >
      {children}
    </Tag>
  );
}
DndDropZone.displayName = "Dnd.DropZone";

export const Dnd = {
  Root: DndRoot,
  Sortable: DndSortable,
  SortableItem: DndSortableItem,
  Draggable: DndDraggable,
  DropZone: DndDropZone,
  Handle: DndHandle,
  AddButton: DndAddButton,
};
