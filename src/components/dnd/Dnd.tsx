import * as React from "react";

import { Button } from "@/components/button/Button";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { DragControllerContext, useDragController } from "./context";
import styles from "./Dnd.module.css";
import { DragOverlay } from "./DragOverlay";
import { createDragController, type DragItem, type DragOutcome } from "./dragSession";
import type { Point, Rect } from "./geometry";
import { type DndLabels, defaultDndLabels } from "./labels";
import { useStoreSelector } from "./store";
import { useDragSource } from "./useDragSource";
import { useDropTarget } from "./useDropTarget";
import { motionTiming } from "./useFlipList";
import { type ReorderReturn, useSortableList } from "./useSortableList";

export type { DragItem, DragOutcome } from "./dragSession";
export type { DndLabels } from "./labels";
export type { DndReorderResult } from "./useSortableList";

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
  const labelsRef = React.useRef<DndLabels>(defaultDndLabels);
  labelsRef.current = { ...defaultDndLabels, ...labels };
  const [controller] = React.useState(() => createDragController(() => labelsRef.current));
  const message = useStoreSelector(controller.store, (state) => state.announcement.message);

  React.useEffect(() => controller.destroy, [controller]);

  return (
    <DragControllerContext value={controller}>
      {children}
      <DragOverlay controller={controller} />
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {message}
      </VisuallyHidden>
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

/**
 * The grip of a `handle` item: a ghost icon-only Button (`xs`), so it is reachable by keyboard
 * (Alt+arrows reorder).
 */
function DndHandle({ className, "aria-label": ariaLabel, ref, ...rest }: DndHandleProps) {
  const controller = useDragController();
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

type SortableContextValue = {
  itemProps: ReturnType<typeof useSortableList>["itemProps"];
  disabled: boolean;
  handle: boolean;
  itemTag: "div" | "li";
};

const SortableContext = React.createContext<SortableContextValue | null>(null);

export type DndSortableProps<T> = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Items in their current order. */
  items: readonly T[];
  /** Stable unique id of an item. */
  getId: (item: T) => string;
  /** Spoken by the live region ("Задача 3: позиция 2 из 5"). Defaults to the id. */
  getLabel?: (item: T) => string;
  /** Called when an item lands in front of `beforeId` (`null` = last). Return `{ ok: false }` (or reject) to roll the drawn order back. */
  onReorder: (id: string, beforeId: string | null) => ReorderReturn | Promise<ReorderReturn>;
  /** Renders one item; return a `Dnd.SortableItem`. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Layout direction of the list. */
  axis?: "x" | "y";
  /** Only `Dnd.Handle` starts a drag; the rest of the item stays free for clicks and text selection. */
  handle?: boolean;
  disabled?: boolean;
  /**
   * Drag kind. Lists sharing a `kind` exchange items: an item dropped from another list arrives in
   * `onReorder` with an `id` that is not in `items` (move it into this list). Defaults to a unique
   * value per list, so lists stay separate.
   */
  kind?: string;
  /** Refuses an item (by id) the list would otherwise take; the list turns `danger` before the release. */
  canDrop?: (id: string) => boolean;
  /** Root element: `ul` / `ol` turn items into `li`. */
  as?: "div" | "ul" | "ol";
  /** Accessible name of the list. */
  "aria-label"?: string;
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
  as: Tag = "div",
  className,
  ref: forwardedRef,
  ...rest
}: DndSortableProps<T>) {
  const generatedKind = React.useId();
  const ids = React.useMemo(() => items.map(getId), [items, getId]);
  const labelById = React.useMemo(
    () => new Map(items.map((item) => [getId(item), getLabel?.(item) ?? getId(item)])),
    [items, getId, getLabel],
  );
  const labelOf = React.useCallback((id: string) => labelById.get(id) ?? id, [labelById]);

  const list = useSortableList({
    kind: kind ?? generatedKind,
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
  const itemTag = Tag === "div" ? "div" : "li";
  const context = React.useMemo<SortableContextValue>(
    () => ({ itemProps: list.itemProps, disabled, handle, itemTag }),
    [list.itemProps, disabled, handle, itemTag],
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

  const children: React.ReactNode[] = [];
  list.order.forEach((id, index) => {
    const item = byId.get(id);
    if (item === undefined) return;
    if (placeholder && list.gapBefore === id) children.push(placeholder);
    children.push(<React.Fragment key={id}>{renderItem(item, index)}</React.Fragment>);
  });
  if (placeholder && list.gapBefore === null) children.push(placeholder);

  const { ref: targetRef, ...targetData } = list.containerProps;
  const ref = useMergedRefs<HTMLElement | null>(targetRef, forwardedRef);
  return (
    <SortableContext value={context}>
      <Tag
        ref={ref}
        {...rest}
        {...targetData}
        className={cx(styles.sortable, className)}
        data-axis={axis}
        data-dragging={list.draggingId !== null || undefined}
      >
        {children}
      </Tag>
    </SortableContext>
  );
}
DndSortable.displayName = "Dnd.Sortable";

export type DndSortableItemProps = {
  /** Must match `getId` of the item. */
  id: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "id">;

/** One item of a `Dnd.Sortable`. Renders `li` inside `ul` / `ol`, `div` otherwise. */
function DndSortableItem({
  id,
  disabled: itemDisabled = false,
  className,
  children,
  onPointerDown,
  onKeyDown,
  ref,
  ...rest
}: DndSortableItemProps) {
  const context = React.useContext(SortableContext);
  // A callback ref fits whichever tag the list picks.
  const elementRef = useMergedRefs<HTMLElement | null>(ref);
  if (context === null) throw new Error("Dnd.SortableItem must be rendered inside Dnd.Sortable");
  const Tag = context.itemTag;
  const disabled = context.disabled || itemDisabled;
  const sortable = context.itemProps(id);
  return (
    <Tag
      ref={elementRef}
      tabIndex={context.handle || disabled ? undefined : 0}
      aria-keyshortcuts={disabled ? undefined : "Alt+ArrowUp Alt+ArrowDown"}
      {...rest}
      {...sortable}
      aria-roledescription={disabled ? undefined : sortable["aria-roledescription"]}
      onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event);
        if (!disabled && !event.defaultPrevented) sortable.onPointerDown(event);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (!disabled && !event.defaultPrevented) sortable.onKeyDown(event);
      }}
      className={cx(styles.draggable, className)}
      data-disabled={disabled || undefined}
      data-handle={context.handle || undefined}
    >
      {children}
    </Tag>
  );
}
DndSortableItem.displayName = "Dnd.SortableItem";

function DndPlaceholder({
  as: Tag,
  width,
  height,
  radius,
}: {
  as: "div" | "li";
  width: number;
  height: number;
  radius: string | null;
}) {
  const faded = React.useRef(false);
  // Fades in once per gap. Not `enterMotion`: React re-inserts the gap's node as it moves through the
  // list, which restarts a CSS animation, and it may re-attach the ref, so the flag (not the node)
  // decides; a WAAPI animation keeps running through the move.
  const ref = React.useCallback((node: HTMLElement | null) => {
    if (!node || faded.current) return;
    faded.current = true;
    if (prefersReducedMotion() || typeof node.animate !== "function") return;
    node.animate([{ opacity: 0 }, { opacity: 1 }], motionTiming("base", "enter"));
  }, []);
  return (
    <Tag
      ref={ref}
      aria-hidden="true"
      data-dnd-gap=""
      className={styles.placeholder}
      style={
        {
          "--dnd-gap-width": `${width}px`,
          "--dnd-gap-height": `${height}px`,
          // The gap is shaped like the item it stands in for.
          ...(radius ? { "--dnd-gap-radius": radius } : {}),
        } as React.CSSProperties
      }
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
} & Omit<React.HTMLAttributes<HTMLElement>, "id">;

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
  /** Refuses an item the zone would otherwise take; the zone turns `danger` before the release. */
  canDrop?: (item: DragItem<TData>) => boolean;
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
