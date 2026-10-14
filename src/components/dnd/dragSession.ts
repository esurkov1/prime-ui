import {
  createEdgeAutoScroll,
  type EdgeAutoScroll,
  edgeScrollers,
} from "@/internal/edgeAutoScroll";
import { formatLabel } from "@/internal/formatLabel";
import { DRAG_HOLD_MS, DRAG_THRESHOLD_PX, PRESS_SLOP_PX } from "@/internal/longPress";
import { swallowNextClick } from "@/internal/swallowNextClick";
import { distanceBetween, type Point, type Rect, rectContains, rectOf } from "./geometry";

import { DND_LABELS, type DndLabels } from "./labels";
import { createStore, type Store } from "./store";

/**
 * Every gesture runs on pointer events, mouse and finger alike. The HTML5 drag-and-drop API is not
 * used: it never fires from touch, its preview cannot be styled, and its drop delivery depends on a
 * preventDefault on the last dragover. One pointer path means one set of rules everywhere.
 */
export type PointerKind = "mouse" | "touch" | "pen";

export type DragItem<TData = unknown> = {
  /** What is dragged, matched against a target's `accepts`. Unrelated screens never see each other's drags. */
  kind: string;
  id: string;
  data: TData;
  /** Spoken by the live region; written for someone who cannot see where the item went. */
  label: string;
};

export type DragSnapshot = {
  item: DragItem | null;
  pointerKind: PointerKind | null;
  /** The drop target the pointer is over right now, by registered id. */
  overId: string | null;
  /**
   * The `holdsDrop` target the drop stays aimed at while the pointer crosses empty space: the last
   * one it was over that would take the item. Null once the pointer is over any other target.
   */
  heldId: string | null;
  canDrop: boolean;
  /** Why the target under the pointer refuses the item (its `canDrop` answered a string), or null. */
  reason: string | null;
  /** The rect the lifted element occupied when the drag began: the size of the gap a list opens for it. */
  origin: Rect | null;
  /** Where inside that rect the pointer grabbed it. */
  grab: Point | null;
  /**
   * The size the carried copy is drawn at when a grid list fits it to the cell it would land in (a
   * cover carried into a row of tiles shrinks); null — the origin's size. The grab point keeps its
   * place relative to the copy.
   */
  carried: { width: number; height: number } | null;
  /** The lifted element's `border-radius`, so the gap it leaves is shaped like it. */
  radius: string | null;
  /** The live region text; `sequence` makes a repeated message count as new for assistive technology. */
  announcement: { message: string; sequence: number };
};

export const IDLE_SNAPSHOT: DragSnapshot = {
  item: null,
  pointerKind: null,
  overId: null,
  heldId: null,
  canDrop: false,
  reason: null,
  origin: null,
  grab: null,
  carried: null,
  radius: null,
  announcement: { message: "", sequence: 0 },
};

/**
 * A target's answer for the item at a spot: `true` takes it; `false` refuses; a string refuses and
 * says why (spoken by the live region, shown by the carried copy).
 */
export type DropVerdict = boolean | string;

export type DropTargetEntry = {
  id: string;
  element: HTMLElement;
  accepts: (item: DragItem) => boolean;
  /** Keeps the drop while the pointer crosses empty space (the gutter between two lists). */
  holdsDrop: boolean;
  enter: (item: DragItem) => void;
  /** Called on every resolved pointer position; whether a drop here would be accepted, or why not. */
  over: (point: Point, item: DragItem) => DropVerdict;
  leave: () => void;
  drop: (point: Point, item: DragItem) => void;
  /** Drops where the pointer was last over this target: the release came over empty space. */
  dropHeld: (item: DragItem) => void;
};

export type DragPreview = {
  /** The element the gesture started on, cloned by the overlay. */
  element: HTMLElement;
  origin: Rect;
  /** Where inside the element the pointer grabbed it: the same pixel stays under the finger. */
  grab: Point;
  point: Point;
  pointerKind: PointerKind;
};

export type DragOverlayEvent =
  | { type: "start"; preview: DragPreview }
  | { type: "move"; point: Point }
  | { type: "resize"; width: number; height: number }
  | { type: "end"; item: DragItem; outcome: DragOutcome; origin: Rect | null };

/**
 * How a drag ended. `release` is not `cancel`: the pointer was let go deliberately, just not over a
 * target that took it. `cancel` (Escape, a system-cancelled pointer) means the move was taken back.
 */
export type DragOutcome = "drop" | "release" | "cancel";

type Activation = {
  /** Pointer travel, in px, that turns a press into a drag. */
  distance: number;
  /** Hold time, in ms, that does the same without any travel. */
  delay: number;
  /** Travel, in px, that cancels a pending hold: the finger is scrolling, not dragging. */
  tolerance: number;
};

// The kit's gesture thresholds (`longPress`), on purpose: a mouse or a pen commits once it travels
// past the tremor of a click. A finger cannot use travel, because travel is how a list scrolls, so
// touch waits out the carry hold and gives up once the finger moves past the press slop.
const POINTER_ACTIVATION: Activation = {
  distance: DRAG_THRESHOLD_PX,
  delay: 0,
  tolerance: Number.POSITIVE_INFINITY,
};
const TOUCH_ACTIVATION: Activation = {
  distance: Number.POSITIVE_INFINITY,
  delay: DRAG_HOLD_MS,
  tolerance: PRESS_SLOP_PX,
};

function pointerKindOf(pointerType: string): PointerKind {
  return pointerType === "touch" || pointerType === "pen" ? pointerType : "mouse";
}

export type BeginDragParams<TData> = {
  event: PointerEvent;
  /** The element the drag lifts: the whole card, even when the press landed on a handle inside it. */
  element: HTMLElement;
  item: DragItem<TData>;
  // Methods, not function-typed properties: the session stores params of any payload type.
  /** Fired once the press became a drag, with the press point and the rect the item occupied. */
  onDragStart?(item: DragItem<TData>, point: Point, origin: Rect): void;
  onDragEnd?(item: DragItem<TData>, outcome: DragOutcome): void;
};

export type DragController = {
  store: Store<DragSnapshot>;
  registerTarget: (entry: DropTargetEntry) => () => void;
  beginPointerDrag: <TData>(params: BeginDragParams<TData>) => void;
  /** Speaks through the live region without a pointer drag in flight (the keyboard path). */
  announce: (message: string) => void;
  labels: () => DndLabels;
  cancel: () => void;
  subscribeOverlay: (listener: (event: DragOverlayEvent) => void) => () => void;
  /** Fits the carried copy to the cell it would land in (a grid list of mixed cells). */
  resizeCarried: (size: { width: number; height: number }) => void;
  destroy: () => void;
};

const area = (rect: Rect) => rect.width * rect.height;

export function createDragController(
  getLabels: () => DndLabels = () => DND_LABELS,
): DragController {
  const store = createStore<DragSnapshot>(IDLE_SNAPSHOT);
  const targets = new Set<DropTargetEntry>();
  const overlayListeners = new Set<(event: DragOverlayEvent) => void>();

  let sequence = 0;
  let pending: {
    pointerId: number;
    origin: Point;
    activation: Activation;
    holdTimer: ReturnType<typeof setTimeout> | null;
    params: BeginDragParams<unknown>;
  } | null = null;
  let active: {
    pointerId: number;
    item: DragItem;
    element: HTMLElement;
    origin: Rect;
    over: DropTargetEntry | null;
    held: DropTargetEntry | null;
    point: Point;
    /** Scrolls the box under the pointer while it is held near an edge. */
    edges: EdgeAutoScroll;
    /** The element the scrollers were read for; they are re-read only when it changes. */
    scrollersFor: Element | null;
    params: BeginDragParams<unknown>;
  } | null = null;

  const emit = (event: DragOverlayEvent) => {
    for (const listener of [...overlayListeners]) listener(event);
  };

  const announce = (message: string) => {
    sequence += 1;
    const announcement = { message, sequence };
    store.setState((current) => ({ ...current, announcement }));
  };

  const say = (key: "grabbed" | "dropped" | "returned" | "cancelled", item: DragItem) =>
    announce(formatLabel(getLabels()[key], { label: item.label }));

  const hitTest = (point: Point, item: DragItem): DropTargetEntry | null => {
    let best: DropTargetEntry | null = null;
    let bestRect: Rect | null = null;
    for (const entry of targets) {
      if (!entry.element.isConnected || !entry.accepts(item)) continue;
      const rect = rectOf(entry.element);
      if (!rectContains(rect, point)) continue;
      if (best === null || bestRect === null) {
        best = entry;
        bestRect = rect;
      } else if (best.element.contains(entry.element)) {
        // The innermost target wins; unrelated overlapping ones fall back to the smaller one.
        best = entry;
        bestRect = rect;
      } else if (!entry.element.contains(best.element) && area(rect) < area(bestRect)) {
        best = entry;
        bestRect = rect;
      }
    }
    return best;
  };

  const resolveOver = () => {
    if (!active) return;
    const next = hitTest(active.point, active.item);
    if (next !== active.over) {
      active.over?.leave();
      active.over = next;
      next?.enter(active.item);
    }
    const verdict = next ? next.over(active.point, active.item) : false;
    const canDrop = verdict === true;
    const reason = typeof verdict === "string" && verdict !== "" ? verdict : null;
    // Empty space changes nothing: the pointer is on its way between two targets.
    if (next) active.held = next.holdsDrop && canDrop ? next : null;
    const overId = next?.id ?? null;
    const heldId = active.held?.id ?? null;
    const before = store.getSnapshot().reason;
    store.setState((current) =>
      current.overId === overId &&
      current.heldId === heldId &&
      current.canDrop === canDrop &&
      current.reason === reason
        ? current
        : { ...current, overId, heldId, canDrop, reason },
    );
    // A new reason is said once, when it appears, not on every move over the same refusal.
    if (reason !== null && reason !== before) {
      announce(formatLabel(getLabels().refusedReason, { label: active.item.label, reason }));
    }
    // The pointer scrolls what is under it or, with nothing under it, the box the drag came out of.
    // Walking the ancestors reads computed styles, so it is done once per target, not per move.
    const scrollRoot = next?.element ?? active.element;
    if (active.scrollersFor !== scrollRoot) {
      active.scrollersFor = scrollRoot;
      active.edges.setScrollers(edgeScrollers(scrollRoot));
    }
    active.edges.follow(active.point);
  };

  const detach = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerCancel);
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("contextmenu", handleContextMenu, true);
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("touchmove", handleTouchMove);
  };

  /** `landing`: the target the item was dropped on, where it may be drawn anew. */
  const finish = (outcome: DragOutcome, landing: HTMLElement | null = null) => {
    if (!active) return;
    const { item, element, params } = active;
    active.edges.stop();
    active.over?.leave();
    // A source that leaves the layout while lifted measures as nothing, so the rect it had when the
    // drag began is what the overlay flies back to.
    const current = element.isConnected ? rectOf(element) : null;
    const origin = current && current.width > 0 ? current : active.origin;
    active = null;
    detach();
    document.documentElement.removeAttribute("data-dnd-active");
    store.setState((state) => ({
      ...state,
      item: null,
      pointerKind: null,
      overId: null,
      heldId: null,
      canDrop: false,
      reason: null,
      origin: null,
      grab: null,
      carried: null,
      radius: null,
    }));
    emit({ type: "end", item, outcome, origin });
    params.onDragEnd?.(item, outcome);
    // The click that follows the release is no press: on the lifted element, or on the element the
    // target drew it as (a card dropped in another column is a new element there).
    swallowNextClick(element, landing);
  };

  const clearPendingTimer = () => {
    if (pending?.holdTimer) clearTimeout(pending.holdTimer);
  };

  const activate = (point: Point) => {
    if (!pending) return;
    const { params, pointerId } = pending;
    // The press point, not where the pointer travelled to: "which part did I grab" is about the press.
    const pressPoint = pending.origin;
    const element = params.element;
    const origin = rectOf(element);
    clearPendingTimer();
    pending = null;

    active = {
      pointerId,
      item: params.item,
      element,
      origin,
      over: null,
      held: null,
      point,
      edges: createEdgeAutoScroll({ scrollers: edgeScrollers(element), onScrolled: resolveOver }),
      scrollersFor: element,
      params,
    };
    const pointerKind = pointerKindOf(params.event.pointerType);
    document.documentElement.setAttribute("data-dnd-active", pointerKind);
    // A mouse drag activates after a few px, and the browser has begun selecting text by then.
    window.getSelection()?.removeAllRanges();
    store.setState((current) => ({
      ...current,
      item: params.item,
      pointerKind,
      origin,
      grab: { x: pressPoint.x - origin.left, y: pressPoint.y - origin.top },
      carried: null,
      radius: getComputedStyle(element).borderRadius || null,
    }));
    emit({
      type: "start",
      preview: {
        element,
        origin,
        grab: { x: pressPoint.x - origin.left, y: pressPoint.y - origin.top },
        point,
        pointerKind,
      },
    });
    params.onDragStart?.(params.item, pressPoint, origin);
    say("grabbed", params.item);
    resolveOver();
  };

  function abandonPending() {
    clearPendingTimer();
    pending = null;
    detach();
  }

  function handlePointerMove(event: PointerEvent) {
    if (active) {
      if (event.pointerId !== active.pointerId) return;
      active.point = { x: event.clientX, y: event.clientY };
      emit({ type: "move", point: active.point });
      resolveOver();
      return;
    }
    if (!pending || event.pointerId !== pending.pointerId) return;
    const point = { x: event.clientX, y: event.clientY };
    const travelled = distanceBetween(pending.origin, point);
    if (travelled >= pending.activation.distance) {
      activate(point);
      return;
    }
    // Past the tolerance while a hold counts down: the finger is scrolling the list.
    if (travelled > pending.activation.tolerance) abandonPending();
  }

  function handlePointerUp(event: PointerEvent) {
    if (active) {
      if (event.pointerId !== active.pointerId) return;
      const point = { x: event.clientX, y: event.clientY };
      active.point = point;
      // Resolved from the release point itself: a flick can end between two moves.
      const target = hitTest(point, active.item);
      if (target?.over(point, active.item) === true) {
        target.drop(point, active.item);
        say("dropped", active.item);
        finish("drop", target.element);
      } else if (!target && active.held) {
        const held = active.held;
        held.dropHeld(active.item);
        say("dropped", active.item);
        finish("drop", held.element);
      } else {
        say("returned", active.item);
        finish("release");
      }
      return;
    }
    if (pending && event.pointerId === pending.pointerId) abandonPending();
  }

  function handlePointerCancel(event: PointerEvent) {
    if (active && event.pointerId === active.pointerId) {
      say("cancelled", active.item);
      finish("cancel");
      return;
    }
    if (pending && event.pointerId === pending.pointerId) abandonPending();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    if (active) {
      event.preventDefault();
      say("cancelled", active.item);
      finish("cancel");
      return;
    }
    if (pending) abandonPending();
  }

  // The window lost focus mid-drag (alt-tab, a system dialog): no pointerup will arrive, so the
  // drag would stay stuck to the pointer.
  function handleBlur() {
    if (active) {
      say("cancelled", active.item);
      finish("cancel");
    } else if (pending) abandonPending();
  }

  // A long press on a touch screen is also how the OS opens its context menu.
  function handleContextMenu(event: Event) {
    if (active) event.preventDefault();
  }

  // Non-passive and registered only for the life of a gesture: the one call that stops a finger drag
  // from scrolling the page under itself, without costing every list its ordinary scrolling.
  function handleTouchMove(event: TouchEvent) {
    if (active) event.preventDefault();
  }

  const attach = () => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
  };

  const beginPointerDrag = <TData>(params: BeginDragParams<TData>) => {
    // Secondary buttons are for context menus; a drag in flight owns the pointer until it ends.
    if (params.event.button !== 0 || active !== null) return;
    if (pending) abandonPending();

    const activation = params.event.pointerType === "touch" ? TOUCH_ACTIVATION : POINTER_ACTIVATION;
    pending = {
      pointerId: params.event.pointerId,
      origin: { x: params.event.clientX, y: params.event.clientY },
      activation,
      holdTimer: null,
      params,
    };
    attach();
    if (activation.delay > 0) {
      pending.holdTimer = setTimeout(() => {
        if (pending) activate(pending.origin);
      }, activation.delay);
    }
  };

  const registerTarget = (entry: DropTargetEntry) => {
    targets.add(entry);
    return () => {
      targets.delete(entry);
      if (active?.over === entry) active.over = null;
      if (active?.held === entry) {
        active.held = null;
        store.setState((current) => ({ ...current, heldId: null }));
      }
    };
  };

  const cancel = () => {
    if (active) finish("cancel");
    else if (pending) abandonPending();
  };

  return {
    store,
    registerTarget,
    beginPointerDrag,
    announce,
    labels: getLabels,
    cancel,
    resizeCarried: (size) => {
      const state = store.getSnapshot();
      if (!active || !state.origin) return;
      const current = state.carried ?? state.origin;
      if (Math.abs(current.width - size.width) < 1 && Math.abs(current.height - size.height) < 1) {
        return;
      }
      store.setState((now) => ({ ...now, carried: { width: size.width, height: size.height } }));
      emit({ type: "resize", width: size.width, height: size.height });
    },
    subscribeOverlay: (listener) => {
      overlayListeners.add(listener);
      return () => {
        overlayListeners.delete(listener);
      };
    },
    destroy: () => {
      cancel();
      targets.clear();
      overlayListeners.clear();
    },
  };
}
