import * as React from "react";

import { Button } from "@/components/button/Button";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { motionTiming } from "@/internal/motionTiming";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

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
import { DND_LABELS, type DndLabels } from "./labels";
import { useStoreSelector } from "./store";
import { useDragSource } from "./useDragSource";
import { useDropTarget } from "./useDropTarget";
import { useSortableList } from "./useSortableList";

export type { DragItem, DragOutcome } from "./dragSession";
export type { DndLabels } from "./labels";

// ---------------------------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------------------------

export type DndRootProps = {
  /** Built-in strings (live region, handle, role description). Russian defaults. */
  labels?: Partial<DndLabels>;
  children?: React.ReactNode;
};

/**
 * Owns the one drag session the app shares, the overlay that follows the pointer and the live
 * region. Mount once above every screen that drags: a drag crosses component boundaries.
 */
function DndRoot({ labels, children }: DndRootProps) {
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
DndRoot.displayName = "Dnd.Root";

// ---------------------------------------------------------------------------------------------
// Handle
// ---------------------------------------------------------------------------------------------

export type DndHandleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/** Whether the item around is `locked`: its grip shows a lock. */
const LockedContext = React.createContext(false);

/** Stops the browser's own drag of an image or a link inside an item: the kit drag owns the press. */
function preventNativeDrag(event: React.DragEvent<HTMLElement>) {
  event.preventDefault();
}

/**
 * The grip of a `handle` item: a ghost icon-only Button (`xs`), so it is reachable by keyboard
 * (Alt+arrows reorder). In a `locked` item it is a lock (`labels.locked`) instead.
 */
function DndHandle({ className, "aria-label": ariaLabel, ref, ...rest }: DndHandleProps) {
  const controller = useDragController();
  // In a locked item the grip turns into a lock: nothing to grab, the place is fixed.
  if (React.useContext(LockedContext)) {
    return (
      <span
        role="img"
        aria-label={controller.labels().locked}
        className={cx(styles.lock, className)}
        data-dnd-lock=""
      >
        <Icon name="status.locked" />
      </span>
    );
  }
  return (
    <Button.Root
      ref={ref}
      variant="ghost"
      tone="neutral"
      size="xs"
      aria-label={ariaLabel ?? controller.labels().handle}
      {...rest}
      data-dnd-handle=""
      className={cx(styles.handle, className)}
    >
      <Button.Icon>
        <Icon name="action.drag" />
      </Button.Icon>
    </Button.Root>
  );
}
DndHandle.displayName = "Dnd.Handle";

// ---------------------------------------------------------------------------------------------
// Sortable
// ---------------------------------------------------------------------------------------------

type ItemTag = "div" | "li" | "tr";

const ITEM_TAG: Record<"div" | "ul" | "ol" | "tbody", ItemTag> = {
  div: "div",
  ul: "li",
  ol: "li",
  tbody: "tr",
};

type SortableContextValue = {
  itemProps: ReturnType<typeof useSortableList>["itemProps"];
  disabled: boolean;
  handle: boolean;
  itemTag: ItemTag;
  /** The keys that move an item: along the axis, and across it to linked lists. */
  shortcuts: string;
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
  /** Items in their current order. */
  items: readonly T[];
  /** Stable unique id of an item. */
  getId: (item: T) => string;
  /** Spoken by the live region ("Задача 3: позиция 2 из 5"). Defaults to the id. */
  getLabel?: (item: T) => string;
  /**
   * Called when an item lands in front of `beforeId` (`null` = last). A returned promise keeps the
   * item drawn in its new place until it settles; a rejection glides it back.
   */
  onReorder: (id: string, beforeId: string | null) => void | Promise<void>;
  /**
   * Renders one item; return a `Dnd.SortableItem`. During a drag `index` is the place the item will
   * have on release. Parts marked `data-dnd-mirror` stay in step on the carried copy.
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Layout of the list: a column, a row, or a wrapping grid (reading order, Alt + ← / →). */
  axis?: "x" | "y" | "grid";
  /** Only `Dnd.Handle` starts a drag; the rest of the item stays free for clicks and text selection. */
  handle?: boolean;
  disabled?: boolean;
  /**
   * Drag kind. Lists sharing a `kind` exchange items: an item dropped from another list arrives in
   * `onReorder` with an `id` that is not in `items` (move it into this list), and Alt + the arrows
   * across the axis move an item to the neighbouring list of the kind (document order). Defaults to
   * a unique value per list, so lists stay separate.
   */
  kind?: string;
  /**
   * Refuses an item (by id) the list would otherwise take: `false`, or a string that says why — it
   * is spoken and shown under the carried copy. The list turns `danger` before the release.
   */
  canDrop?: (id: string) => boolean | string;
  /** Shown while the list has no items; a gap opening in the list takes its place. */
  empty?: React.ReactNode;
  /**
   * Root element: `ul` / `ol` turn items into `li`; `tbody` turns them into table rows (`tr`), the
   * gap into a row across every column, and the carried copy keeps every cell's width.
   */
  as?: "div" | "ul" | "ol" | "tbody";
  "aria-label"?: string;
  /**
   * Content in front of the items that never moves and takes no drop position (the heading row of
   * a group of table rows).
   */
  header?: React.ReactNode;
  /** Content after the items that never moves and takes no drop position (an add tile). */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

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
  });

  const byId = React.useMemo(
    () => new Map(items.map((item) => [getId(item), item])),
    [items, getId],
  );
  const itemTag = ITEM_TAG[Tag];
  const shortcuts = ALONG[axis] + (linked ? ACROSS[axis] : "");
  const context = React.useMemo<SortableContextValue>(
    () => ({ itemProps: list.itemProps, disabled, handle, itemTag, shortcuts }),
    [list.itemProps, disabled, handle, itemTag, shortcuts],
  );

  const placeholder = list.gap ? (
    <DndPlaceholder
      as={itemTag}
      width={list.gap.width}
      height={list.gap.height}
      radius={list.gap.radius}
      key="dnd-gap"
    />
  ) : null;

  // During a drag `index` is the place an item will have on release, so a position it shows (a
  // number) follows the gap as it moves, not only the drop.
  const shownIndex = previewIndex(list.order, list.draggingId, list.gapBefore);
  const children: React.ReactNode[] = [];
  list.order.forEach((id, index) => {
    const item = byId.get(id);
    if (item === undefined) return;
    if (placeholder && list.gapBefore === id) children.push(placeholder);
    children.push(
      <React.Fragment key={id}>{renderItem(item, shownIndex.get(id) ?? index)}</React.Fragment>,
    );
  });
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
  const ref = useMergedRefs<HTMLElement | null>(targetRef, forwardedRef);
  return (
    <SortableContext value={context}>
      <Tag
        ref={ref}
        {...rest}
        {...targetData}
        // A table body keeps its table layout: the list look (flex column, gap) is for the others.
        className={cx(Tag === "tbody" ? styles.sortableRows : styles.sortable, className)}
        data-axis={axis}
        data-dragging={list.draggingId !== null || undefined}
      >
        {header}
        {children}
        {trailing}
      </Tag>
    </SortableContext>
  );
}
DndSortable.displayName = "Dnd.Sortable";

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
  /** Must match `getId` of the item. */
  id: string;
  disabled?: boolean;
  /**
   * Holds its place: it does not drag or move, and nothing is put where it would shift it (a
   * pinned first row, a system column). Its `Dnd.Handle` shows a lock.
   */
  locked?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "id">;

/** One item of a `Dnd.Sortable`. Renders `li` inside `ul` / `ol`, `tr` inside `tbody`, `div` otherwise. */
function DndSortableItem({
  id,
  disabled: itemDisabled = false,
  locked = false,
  className,
  children,
  onPointerDown,
  onKeyDown,
  onDragStart,
  ref,
  ...rest
}: DndSortableItemProps) {
  const context = React.useContext(SortableContext);
  // A callback ref fits whichever tag the list picks.
  const elementRef = useMergedRefs<HTMLElement | null>(ref);
  if (context === null) throw new Error("Dnd.SortableItem must be rendered inside Dnd.Sortable");
  const Tag = context.itemTag;
  const disabled = context.disabled || itemDisabled;
  const still = disabled || locked;
  const sortable = context.itemProps(id);
  return (
    <Tag
      ref={elementRef}
      tabIndex={context.handle || still ? undefined : 0}
      aria-keyshortcuts={still ? undefined : context.shortcuts}
      {...rest}
      {...sortable}
      aria-roledescription={still ? undefined : sortable["aria-roledescription"]}
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
      data-handle={context.handle || undefined}
    >
      <LockedContext value={locked}>{children}</LockedContext>
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
  const ghost = node.cloneNode(false) as HTMLElement;
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
}: {
  as: ItemTag;
  width: number;
  height: number;
  radius: string | null;
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
      className={styles.placeholder}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------------------------
// Draggable
// ---------------------------------------------------------------------------------------------

export type DndDraggableProps<TData = unknown> = {
  /** What is dragged; a `Dnd.DropZone` accepts it by kind. */
  kind: string;
  id: string;
  /** Payload handed to the drop target. */
  data?: TData;
  /** Spoken by the live region. Defaults to the id. */
  label?: string;
  disabled?: boolean;
  /** Only `Dnd.Handle` starts a drag. */
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
  return (
    <Tag
      ref={elementRef}
      {...rest}
      {...dragProps}
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
  /** Drag kinds this zone takes, or a predicate over the dragged item. */
  accepts: string | readonly string[] | ((item: DragItem) => boolean);
  onDrop: (item: DragItem<TData>) => void;
  /**
   * Refuses an item the zone would otherwise take: `false`, or a string that says why (spoken and
   * shown under the carried copy). The zone turns `danger` before the release.
   */
  canDrop?: (item: DragItem<TData>) => boolean | string;
  onEnter?: (item: DragItem<TData>) => void;
  onLeave?: () => void;
  /** Flashes the zone after a drop, so the eye can follow where the item went. */
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
  onAnimationEnd,
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
      onAnimationEnd={(event: React.AnimationEvent<HTMLElement>) => {
        onAnimationEnd?.(event);
        targetData.onAnimationEnd(event);
      }}
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
};
