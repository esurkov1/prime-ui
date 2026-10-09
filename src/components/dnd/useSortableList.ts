import * as React from "react";

import { formatLabel } from "@/internal/formatLabel";

import { useDragController } from "./context";
import type { DragItem, DropVerdict } from "./dragSession";
import { type Axis, insertionBefore, layoutRect, ownNodes } from "./geometry";
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

export type SortableListOptions = {
  kind: string;
  /**
   * The list shares its `kind` on purpose: Alt + the arrows across the axis move an item to the
   * neighbouring list of the same kind (a board's columns).
   */
  linked?: boolean | undefined;
  /** The ids in the order they are drawn. */
  items: readonly string[];
  labelOf: (id: string) => string;
  /** A returned promise keeps the move drawn until it settles; a rejection glides it back. */
  onReorder: (id: string, beforeId: string | null) => void | Promise<void>;
  axis?: Axis | undefined;
  disabled?: boolean | undefined;
  /** Refuses an item of this kind (typically one from another list); a string says why. */
  canDrop?: ((id: string) => DropVerdict) | undefined;
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
const LOCKED_SELECTOR = "[data-dnd-item][data-locked]";
/** What glides on a layout change: the items and the gap between them. */
const FLIP_SELECTOR = "[data-dnd-item], [data-dnd-gap]";

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

/** `order` once `id` (from this list or another) stands in front of `before`. */
function placed(order: readonly string[], id: string, before: string | null): string[] {
  if (order.includes(id)) return moveBefore(order, id, before, idOf);
  const at = before === null ? -1 : order.indexOf(before);
  return at === -1 ? [...order, id] : [...order.slice(0, at), id, ...order.slice(at)];
}

/** Whether putting `id` in front of `before` would shift a locked item off its place. */
function displacesLocked(
  order: readonly string[],
  id: string,
  before: string | null,
  locked: ReadonlySet<string>,
): boolean {
  if (locked.size === 0) return false;
  const next = placed(order, id, before);
  for (const lockedId of locked) {
    if (lockedId !== id && next.indexOf(lockedId) !== order.indexOf(lockedId)) return true;
  }
  return false;
}

/**
 * The first place at or after `before` that leaves every locked item where it is (an item from
 * another list can always go last).
 */
function nearestFree(
  order: readonly string[],
  id: string,
  before: string | null,
  locked: ReadonlySet<string>,
): string | null {
  const start = before === null ? order.length : Math.max(0, order.indexOf(before));
  for (let at = start; at < order.length; at += 1) {
    const candidate = order[at] ?? null;
    if (!displacesLocked(order, id, candidate, locked)) return candidate;
  }
  return null;
}

function lockedIn(element: HTMLElement | null): Set<string> {
  if (!element) return new Set();
  return new Set(
    ownNodes(element, LOCKED_SELECTOR).flatMap((node) =>
      node.dataset.dndItem === undefined ? [] : [node.dataset.dndItem],
    ),
  );
}

/** The accessible name of a list: its `aria-label`, else the text of its `aria-labelledby`. */
function nameOf(element: HTMLElement): string {
  const label = element.getAttribute("aria-label");
  if (label) return label;
  return (element.getAttribute("aria-labelledby") ?? "")
    .split(/\s+/)
    .map((id) => (id ? (document.getElementById(id)?.textContent ?? "") : ""))
    .join(" ")
    .trim();
}

/** Whether the arrow points toward the start of the line, in the writing direction. */
function towardStart(key: string, element: Element): boolean {
  const rtl = element.closest("[dir]")?.getAttribute("dir") === "rtl";
  return key === (rtl ? "ArrowRight" : "ArrowLeft");
}

/** A list of a linked kind, for Alt + arrow moves between lists. */
type LinkedList = {
  kind: string;
  element: () => HTMLElement | null;
  ids: () => readonly string[];
  disabled: () => boolean;
  canDrop: (id: string) => DropVerdict;
  accept: (id: string, before: string | null) => void;
};

/** Every mounted linked list; a keyboard move finds its neighbour here, in document order. */
const linkedLists = new Set<LinkedList>();

/** The item a keyboard move carried to another list: that list focuses it once it is drawn. */
let pendingFocus: { kind: string; id: string } | null = null;

function documentOrder(a: LinkedList, b: LinkedList): number {
  const ea = a.element();
  const eb = b.element();
  if (!ea || !eb) return 0;
  return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Reordering, complete: the pointer drag, the gap that opens where the item will land, the settle
 * animation, and an Alt+arrow path for anyone who cannot drag (WCAG 2.2 "Dragging Movements") —
 * along the list, and across to the neighbouring list of a linked kind. Locked items hold their
 * places. The list container is the drop target, not each item: items come and go mid-drag.
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
  // Bumped when the order changes with no drag in flight (a keyboard move, a refused drop rolling
  // back): the items glide to their new places instead of jumping.
  const [settle, setSettle] = React.useState(0);
  const itemsKey = JSON.stringify(items);
  const order = optimistic && itemsKey === optimistic.from ? optimistic.order : items;

  React.useEffect(
    () => () => {
      if (expiryRef.current !== null) clearTimeout(expiryRef.current);
    },
    [],
  );

  const commit = React.useCallback(
    (id: string, before: string | null, from: string, drawAhead = true) => {
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
      // Only the answer to THIS drop counts: a later drag has its own drawn order.
      const forget = () => setOptimistic((current) => (current === drawn ? null : current));
      const expire = () => {
        if (expiryRef.current !== null) clearTimeout(expiryRef.current);
        expiryRef.current = setTimeout(forget, OPTIMISTIC_TIMEOUT_MS);
      };
      const rollback = () => {
        forget();
        setSettle((value) => value + 1);
      };
      let outcome: ReturnType<typeof onReorder>;
      try {
        outcome = onReorder(id, before);
      } catch {
        rollback();
        return;
      }
      // A pending answer (a request in flight) keeps the item where it was put for as long as it
      // takes; the expiry counts only from the answer.
      if (outcome instanceof Promise) {
        if (expiryRef.current !== null) clearTimeout(expiryRef.current);
      } else if (drawAhead) {
        expire();
      } else {
        // A keyboard step answered at once: the owner's order is already the truth (a controlled
        // owner that did not apply the move keeps the item where it is).
        forget();
      }
      void Promise.resolve(outcome).then(expire, rollback);
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

  const elementRef = React.useRef<HTMLElement | null>(null);

  const resolve = React.useCallback(
    (
      point: { x: number; y: number },
      item: DragItem<unknown>,
      element: HTMLElement,
    ): InsertionPoint => {
      const { grab = null, origin = null } = controller.store.getSnapshot();
      const corner = { x: point.x - (grab?.x ?? 0), y: point.y - (grab?.y ?? 0) };
      // A list compares the carried item's leading edge; a grid the centre of the item as it was
      // picked up, wherever it was grabbed. Its size at pick-up, never the copy's current size: the
      // copy is fitted to the cell it would land in, and an aim that moved with it would push the gap
      // to the next cell, refit the copy and pull it back, round and round.
      const aim =
        axis === "grid" && origin
          ? { x: corner.x + origin.width / 2, y: corner.y + origin.height / 2 }
          : corner;
      let before = insertionBefore(element, ITEM_SELECTOR, aim, axis, item.id);
      // In front of itself, or of whatever already follows it, is where the item already is. An
      // item from another list always moves.
      const own = order.includes(item.id);
      let moves = !own || (before !== item.id && before !== neighbourAfter(order, item.id));
      // Locked items hold their places: a move that would shift one does not happen; an item
      // from another list takes the nearest place after them.
      const locked = lockedIn(element);
      if (moves && displacesLocked(order, item.id, before, locked)) {
        if (own) moves = false;
        else before = nearestFree(order, item.id, before, locked);
      }
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
    // Crossing the gutter to the next list keeps the hole where the pointer last put it.
    holdsDrop: true,
    onDrop: (insertion, item) => {
      if (insertion.moves) commit(item.id, insertion.before, itemsKey);
    },
  });
  elementRef.current = target.element;

  // The item in flight from this kind, and whether it belongs to this list.
  const dragged = useDraggedItem(kind);
  const own = dragged !== null && items.includes(dragged.id);
  // A list a foreign item visited keeps its last placement until the drag ends.
  React.useEffect(() => {
    if (dragged === null) setPlacement(null);
  }, [dragged]);
  // The hole stands in exactly one list: the one under the pointer; over empty space, the one the
  // drop is held at; with nothing held (the pointer last crossed a zone or a refusing list), the
  // list the item came from.
  const overId = useStoreSelector(controller.store, (state) => state.overId);
  const heldId = useStoreSelector(controller.store, (state) => state.heldId);
  const holdsGap =
    overId === target.id || (overId === null && (heldId === null ? own : heldId === target.id));
  // The frame the item lifts, its own placement is not set yet: the gap already stands where the item
  // was, so its neighbours never step into the hole and back (a jolt, worst in a grid of mixed cells).
  const effective = placement ?? (own && dragged ? { before: dragged.id, moves: false } : null);
  const showGap = dragged !== null && effective !== null && holdsGap;
  const gapBefore = showGap ? effective.before : undefined;
  const origin = useStoreSelector(controller.store, (state) => state.origin);
  const radius = useStoreSelector(controller.store, (state) => state.radius);
  // Everything that moves an item, and nothing else: re-renders from the owner's state must not animate.
  const gapKey = gapBefore === undefined ? "idle" : (gapBefore ?? "end");
  // A grid of mixed cells (a cover two cells wide): the carried copy takes the size of the cell the gap
  // stands in, so what is carried is what will land.
  React.useLayoutEffect(() => {
    if (axis !== "grid" || gapKey === "idle") return;
    const gap = target.element?.querySelector(":scope > [data-dnd-gap]");
    if (!gap) return;
    const rect = layoutRect(gap);
    if (rect.width > 0 && rect.height > 0) {
      controller.resizeCarried({ width: rect.width, height: rect.height });
    }
  }, [axis, gapKey, controller, target.element]);

  useFlipList(
    target.element,
    JSON.stringify([order, dragged?.id ?? null, gapKey]),
    FLIP_SELECTOR,
    // Only while the item is in the air: after the drop the list already stands in its final order.
    dragged !== null,
    settle,
  );

  // The neighbour lists of a linked kind reach this one through the registry.
  const latest = React.useRef({ items, disabled, canDrop: options.canDrop, commit, itemsKey });
  latest.current = { items, disabled, canDrop: options.canDrop, commit, itemsKey };
  const linked = options.linked ?? false;
  const entry = React.useMemo<LinkedList>(
    () => ({
      kind,
      element: () => elementRef.current,
      ids: () => latest.current.items,
      disabled: () => latest.current.disabled ?? false,
      canDrop: (id) => latest.current.canDrop?.(id) ?? true,
      accept: (id, before) => latest.current.commit(id, before, latest.current.itemsKey),
    }),
    [kind],
  );
  React.useEffect(() => {
    if (!linked) return;
    linkedLists.add(entry);
    return () => {
      linkedLists.delete(entry);
    };
  }, [linked, entry]);

  // A keyboard move carried an item here from another list: it takes the focus once it is drawn.
  React.useLayoutEffect(() => {
    const pending = pendingFocus;
    if (pending === null || pending.kind !== kind || !items.includes(pending.id)) return;
    const node = target.element?.querySelector<HTMLElement>(
      `[data-dnd-item="${CSS.escape(pending.id)}"][data-dnd-kind="${CSS.escape(kind)}"]`,
    );
    if (!node) return;
    pendingFocus = null;
    // With `handle` the grip is what takes the keys.
    const focusable = options.handleOnly
      ? (node.querySelector<HTMLElement>("[data-dnd-handle]") ?? node)
      : node;
    // A keyboard move: the ring must show even if the element was first focused by a click.
    focusable.focus({ focusVisible: true } as FocusOptions);
  });

  const move = React.useCallback(
    (id: string, direction: -1 | 1) => {
      // From the order on screen: a move still waiting for the owner's answer counts.
      const index = order.indexOf(id);
      const to = index + direction;
      if (index === -1 || to < 0 || to >= order.length) return;
      // Moving down lands in front of the item after the one stepped over.
      const beforeId = direction === -1 ? (order[to] ?? null) : (order[to + 1] ?? null);
      // A locked item holds its place: no step shifts it.
      if (displacesLocked(order, id, beforeId, lockedIn(elementRef.current))) return;
      // Drawn at once and rolled back on a refusal, like a drop; the items glide there.
      setSettle((value) => value + 1);
      commit(id, beforeId, itemsKey, false);
      controller.announce(
        formatLabel(controller.labels().moved, {
          label: labelOf(id),
          position: to + 1,
          total: order.length,
        }),
      );
    },
    [commit, controller, itemsKey, labelOf, order],
  );

  /** Alt + an arrow across the axis: to the same row of the neighbouring list of the kind. */
  const moveAcross = React.useCallback(
    (id: string, direction: -1 | 1) => {
      const lists = [...linkedLists]
        .filter((list) => list.kind === kind && list.element()?.isConnected)
        .sort(documentOrder);
      const next = lists[lists.indexOf(entry) + direction];
      const element = next?.element();
      if (!next || !element || next.disabled()) return;
      const labels = controller.labels();
      const list = nameOf(element);
      const verdict = next.canDrop(id);
      if (verdict !== true) {
        controller.announce(
          typeof verdict === "string" && verdict !== ""
            ? formatLabel(labels.refusedReason, { label: labelOf(id), reason: verdict })
            : formatLabel(labels.refused, { label: labelOf(id), list }),
        );
        return;
      }
      const ids = next.ids();
      const row = items.indexOf(id);
      const before = nearestFree(ids, id, ids[row] ?? null, lockedIn(element));
      pendingFocus = { kind, id };
      next.accept(id, before);
      controller.announce(
        formatLabel(labels.movedTo, {
          label: labelOf(id),
          list,
          position: (before === null ? ids.length : ids.indexOf(before)) + 1,
          total: ids.length + 1,
        }),
      );
    },
    [controller, entry, items, kind, labelOf],
  );

  const { props: sourceProps, draggingId: liftedId } = source;
  const itemProps = React.useCallback(
    (id: string): SortableItemProps => ({
      ...sourceProps({ id, data: null, label: labelOf(id) }),
      "data-lifted": liftedId === id || undefined,
      onKeyDown: (event) => {
        // Alt, so plain arrows keep whatever they mean on the element. A key from an item of a
        // nested list is that item's: it never moves the item around it.
        if (disabled || !event.altKey) return;
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest("[data-dnd-item]") !== event.currentTarget) return;
        if (event.currentTarget.hasAttribute("data-locked")) return;
        const { key } = event;
        const horizontal = key === "ArrowLeft" || key === "ArrowRight";
        const vertical = key === "ArrowUp" || key === "ArrowDown";
        if (!horizontal && !vertical) return;
        // Along the axis (a row and a grid read in the writing direction) …
        if (axis === "y" ? vertical : horizontal) {
          event.preventDefault();
          const back = axis === "y" ? key === "ArrowUp" : towardStart(key, event.currentTarget);
          move(id, back ? -1 : 1);
          return;
        }
        // … and across it, to the neighbouring list of a linked kind.
        if (!linked || axis === "grid") return;
        event.preventDefault();
        const back = axis === "y" ? towardStart(key, event.currentTarget) : key === "ArrowUp";
        moveAcross(id, back ? -1 : 1);
      },
    }),
    [axis, disabled, labelOf, linked, move, moveAcross, sourceProps, liftedId],
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
