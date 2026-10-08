import * as React from "react";

import { formatLabel } from "@/internal/formatLabel";

import { useDragController } from "./context";
import type { DragItem } from "./dragSession";
import { type Axis, insertionBefore } from "./geometry";
import { useStoreSelector } from "./store";
import { type DragSourceProps, useDraggedItem, useDragSource } from "./useDragSource";
import { type DropTargetProps, useDropTarget } from "./useDropTarget";
import { useFlipList } from "./useFlipList";

/**
 * Where a dragged item would land: in front of `before`, or last when that is null. `moves` is false
 * while that answer is the place the item already occupies: the gap is still drawn there (the lifted
 * item is out of the layout), but nothing is reordered.
 */
export type InsertionPoint = { before: string | null; moves: boolean };

/** What a caller's own write may answer. Answering is optional; `{ ok: false }` rolls the drawn order back at once. */
export type DndReorderResult = { ok: boolean } | undefined;

// `void` (not `undefined`) so that `(id, before) => { setItems(...) }` is assignable.
// biome-ignore lint/suspicious/noConfusingVoidType: a callback that returns nothing must fit.
export type ReorderReturn = DndReorderResult | void;

export type SortableListOptions = {
  kind: string;
  /** The ids in the order they are drawn. */
  items: readonly string[];
  labelOf: (id: string) => string;
  onReorder: (id: string, beforeId: string | null) => ReorderReturn | Promise<ReorderReturn>;
  axis?: Axis | undefined;
  disabled?: boolean | undefined;
  /** Refuses an item of this kind (typically one from another list); the container turns `danger` before the release. */
  canDrop?: ((id: string) => boolean) | undefined;
  /** Only a press on a `[data-dnd-handle]` element starts a drag. */
  handleOnly?: boolean | undefined;
};

export type SortableItemProps = DragSourceProps & {
  "data-lifted"?: true | undefined;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
};

export type SortableListHandle = {
  containerProps: DropTargetProps;
  itemProps: (id: string) => SortableItemProps;
  draggingId: string | null;
  /** The item the gap precedes; null means the end, undefined means idle. */
  gapBefore: string | null | undefined;
  /** The hole the lifted item left, in px. Set only while a drag is in flight. */
  gap: { width: number; height: number; radius: string | null } | null;
  isOver: boolean;
  /**
   * The order to DRAW: `items`, except right after a drop, when the owner answers a beat later and
   * drawing the old order until then would snap the item back and then jump again.
   */
  order: readonly string[];
};

const ITEM_SELECTOR = "[data-dnd-item]";

// How long the drawn order may run ahead of `items` (reached only when a reorder is silently refused).
const OPTIMISTIC_TIMEOUT_MS = 2000;

/** `items` with `id` pulled out and put in front of `beforeId`, or last when that is null. */
export function moveBefore<T>(
  items: readonly T[],
  id: string,
  beforeId: string | null,
  getId: (item: T) => string,
): T[] {
  const moved = items.find((item) => getId(item) === id);
  if (moved === undefined) return [...items];
  const without = items.filter((item) => getId(item) !== id);
  if (beforeId === null) return [...without, moved];
  const index = without.findIndex((item) => getId(item) === beforeId);
  if (index === -1) return [...without, moved];
  return [...without.slice(0, index), moved, ...without.slice(index)];
}

const idOf = (id: string) => id;

function neighbourAfter(items: readonly string[], id: string): string | null {
  const index = items.indexOf(id);
  return index === -1 ? null : (items[index + 1] ?? null);
}

/**
 * Reordering, complete: the pointer drag, the gap that opens where the item will land, the settle
 * animation, and an Alt+arrow path for anyone who cannot drag (WCAG 2.2 "Dragging Movements").
 * The list container is the drop target, not each item: items come and go mid-drag.
 */
export function useSortableList(options: SortableListOptions): SortableListHandle {
  const { kind, items, labelOf, onReorder, disabled } = options;
  const axis = options.axis ?? "y";
  const controller = useDragController();
  // Held here, not read off the drop target: a pointer that wanders out of the list must not close
  // the hole, the item is still in the air.
  const [placement, setPlacement] = React.useState<InsertionPoint | null>(null);
  const placementRef = React.useRef<InsertionPoint | null>(null);
  React.useEffect(() => {
    placementRef.current = placement;
  });
  // What was just dropped, drawn ahead of the owner's answer, plus the order true at drop time: the
  // moment `items` differs from that, the owner has answered and wins.
  const [optimistic, setOptimistic] = React.useState<{ order: string[]; from: string } | null>(
    null,
  );
  const expiryRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsKey = JSON.stringify(items);
  const order = optimistic && itemsKey === optimistic.from ? optimistic.order : items;

  React.useEffect(
    () => () => {
      if (expiryRef.current !== null) clearTimeout(expiryRef.current);
    },
    [],
  );

  const commit = React.useCallback(
    (id: string, before: string | null, from: string) => {
      // An item from another list is not in this order: the owner's answer is the only truth.
      if (!order.includes(id)) {
        try {
          void Promise.resolve(onReorder(id, before)).catch(() => {});
        } catch {
          // A refusing owner has nothing drawn ahead to roll back.
        }
        return;
      }
      const drawn = { order: moveBefore(order, id, before, idOf), from };
      setOptimistic(drawn);
      if (expiryRef.current !== null) clearTimeout(expiryRef.current);
      expiryRef.current = setTimeout(() => setOptimistic(null), OPTIMISTIC_TIMEOUT_MS);
      // Only the answer to THIS drop counts: a later drag has its own drawn order.
      const rollback = () => setOptimistic((current) => (current === drawn ? null : current));
      let outcome: ReturnType<typeof onReorder>;
      try {
        outcome = onReorder(id, before);
      } catch {
        rollback();
        return;
      }
      void Promise.resolve(outcome).then((result) => {
        if (result && !result.ok) rollback();
      }, rollback);
    },
    [order, onReorder],
  );

  const source = useDragSource<null>({
    kind,
    disabled: disabled ?? false,
    handleOnly: options.handleOnly,
    onDragStart: (item) => {
      setPlacement({ before: item.id, moves: false });
    },
    onDragEnd: (item, outcome) => {
      // Released over nothing with the gap standing somewhere real: the gap is what the user aimed
      // at. Escape is the one that takes the move back.
      if (outcome === "release" && placementRef.current?.moves === true) {
        commit(item.id, placementRef.current.before, itemsKey);
      }
      setPlacement(null);
    },
  });

  const resolve = React.useCallback(
    (
      point: { x: number; y: number },
      item: DragItem<unknown>,
      element: HTMLElement,
    ): InsertionPoint => {
      const grab = controller.store.getSnapshot().grab ?? { x: 0, y: 0 };
      const before = insertionBefore(
        element,
        ITEM_SELECTOR,
        { x: point.x - grab.x, y: point.y - grab.y },
        axis,
        item.id,
      );
      // In front of itself, or of whatever already follows it, is where the item already is. An
      // item from another list always moves.
      const own = order.includes(item.id);
      const moves = !own || (before !== item.id && before !== neighbourAfter(order, item.id));
      const next = { before: moves || !own ? before : item.id, moves };
      placementRef.current = next;
      setPlacement((current) =>
        current && current.before === next.before && current.moves === moves ? current : next,
      );
      return next;
    },
    [axis, controller, order],
  );

  const target = useDropTarget<InsertionPoint>({
    // Any item of this kind: lists sharing a `kind` hand items to each other.
    accepts: (item) => item.kind === kind,
    resolve,
    canDrop: options.canDrop ? (_value, item) => options.canDrop?.(item.id) ?? true : undefined,
    disabled: disabled ?? false,
    // Wandering off changes nothing for the list the item came from: the hole stays where the
    // pointer last put it. A foreign item's hole closes when it leaves.
    onLeave: () => {
      if (!ownRef.current) setPlacement(null);
    },
    onDrop: (insertion, item) => {
      if (insertion.moves) commit(item.id, insertion.before, itemsKey);
    },
  });

  // The item in flight from this kind, and whether it belongs to this list.
  const dragged = useDraggedItem(kind);
  const own = dragged !== null && items.includes(dragged.id);
  const ownRef = React.useRef(own);
  React.useEffect(() => {
    ownRef.current = own;
  });
  // The pointer is over a different target: the list the item came from closes its hole.
  const overOther = useStoreSelector(
    controller.store,
    (state) => state.overId !== null && state.overId !== target.id,
  );
  const showGap = dragged !== null && placement !== null && (own ? !overOther : target.isOver);
  const gapBefore = showGap ? placement.before : undefined;
  const origin = useStoreSelector(controller.store, (state) => state.origin);
  const radius = useStoreSelector(controller.store, (state) => state.radius);
  // Everything that moves an item, and nothing else: re-renders from the owner's state must not animate.
  const gapKey = gapBefore === undefined ? "idle" : (gapBefore ?? "end");
  useFlipList(
    target.element,
    JSON.stringify([order, dragged?.id ?? null, gapKey]),
    ITEM_SELECTOR,
    // Only while the item is in the air: after the drop the list already stands in its final order.
    dragged !== null,
  );

  const move = React.useCallback(
    (id: string, direction: -1 | 1) => {
      const index = items.indexOf(id);
      const to = index + direction;
      if (index === -1 || to < 0 || to >= items.length) return;
      // Moving down lands in front of the item after the one stepped over.
      const beforeId = direction === -1 ? (items[to] ?? null) : (items[to + 1] ?? null);
      void onReorder(id, beforeId);
      controller.announce(
        formatLabel(controller.labels().moved, {
          label: labelOf(id),
          position: to + 1,
          total: items.length,
        }),
      );
    },
    [controller, items, labelOf, onReorder],
  );

  const { props: sourceProps, draggingId: liftedId } = source;
  const itemProps = React.useCallback(
    (id: string): SortableItemProps => ({
      ...sourceProps({ id, data: null, label: labelOf(id) }),
      "data-lifted": liftedId === id || undefined,
      onKeyDown: (event) => {
        // Alt, so plain arrows keep whatever they mean on the element.
        if (disabled || !event.altKey) return;
        const back = axis === "y" ? "ArrowUp" : "ArrowLeft";
        const forward = axis === "y" ? "ArrowDown" : "ArrowRight";
        if (event.key !== back && event.key !== forward) return;
        event.preventDefault();
        move(id, event.key === back ? -1 : 1);
      },
    }),
    [axis, disabled, labelOf, move, sourceProps, liftedId],
  );

  return {
    containerProps: target.props,
    itemProps,
    draggingId: own && dragged ? dragged.id : null,
    gapBefore,
    gap: showGap && origin ? { width: origin.width, height: origin.height, radius } : null,
    isOver: target.isOver,
    order,
  };
}
