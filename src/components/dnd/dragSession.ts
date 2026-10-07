import { formatLabel } from "@/internal/formatLabel";
import { autoScrollStep, scrollableAncestors } from "./autoScroll";
import { distanceBetween, type Point, type Rect, rectContains, rectOf } from "./geometry";

import { type DndLabels, defaultDndLabels } from "./labels";
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
  canDrop: boolean;
  /** The rect the lifted element occupied when the drag began: the size of the gap a list opens for it. */
  origin: Rect | null;
  /** Where inside that rect the pointer grabbed it. */
  grab: Point | null;
  /** The lifted element's `border-radius`, so the gap it leaves is shaped like it. */
  radius: string | null;
  /** The live region text; `sequence` makes a repeated message count as new for assistive technology. */
  announcement: { message: string; sequence: number };
};

export const IDLE_SNAPSHOT: DragSnapshot = {
  item: null,
  pointerKind: null,
  overId: null,
  canDrop: false,
  origin: null,
  grab: null,
  radius: null,
  announcement: { message: "", sequence: 0 },
};

export type DropTargetEntry = {
  id: string;
  element: HTMLElement;
  accepts: (item: DragItem) => boolean;
  enter: (item: DragItem) => void;
  /** Called on every resolved pointer position; returns whether a drop here would be accepted. */
  over: (point: Point, item: DragItem) => boolean;
  leave: () => void;
  drop: (point: Point, item: DragItem) => void;
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
  | { type: "end"; item: DragItem; outcome: DragOutcome; origin: Rect | null };

/**
 * How a drag ended. `release` is not `cancel`: the pointer was let go deliberately, just not over a
 * target that took it. `cancel` (Escape, a system-cancelled pointer) means the move was taken back.
 */
export type DragOutcome = "drop" | "release" | "cancel";

export type Activation = {
  /** Pointer travel, in px, that turns a press into a drag. */
  distance: number;
  /** Hold time, in ms, that does the same without any travel. */
  delay: number;
  /** Travel, in px, that cancels a pending hold: the finger is scrolling, not dragging. */
  tolerance: number;
};

// A mouse commits as soon as it moves 4px (past the tremor of a click). A finger cannot use travel,
// because travel is how a list scrolls, so touch waits out a hold and gives up once the finger runs.
const ACTIVATION = {
  mouse: { distance: 4, delay: 0, tolerance: Number.POSITIVE_INFINITY },
  pen: { distance: 4, delay: 0, tolerance: Number.POSITIVE_INFINITY },
  touch: { distance: Number.POSITIVE_INFINITY, delay: 180, tolerance: 10 },
} satisfies Record<PointerKind, Activation>;

export function activationFor(pointerType: string): Activation {
  if (pointerType === "touch") return ACTIVATION.touch;
  if (pointerType === "pen") return ACTIVATION.pen;
  return ACTIVATION.mouse;
}

function pointerKindOf(pointerType: string): PointerKind {
  return pointerType === "touch" || pointerType === "pen" ? pointerType : "mouse";
}

export type BeginDragParams<TData> = {
  event: PointerEvent;
  /** The element the drag lifts: the whole card, even when the press landed on a handle inside it. */
  element: HTMLElement;
  item: DragItem<TData>;
  activation?: Activation;
  /** Fired once the press became a drag, with the press point and the rect the item occupied. */
  onDragStart?: (item: DragItem<TData>, point: Point, origin: Rect) => void;
  onDragEnd?: (item: DragItem<TData>, outcome: DragOutcome) => void;
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
  destroy: () => void;
};

const area = (rect: Rect) => rect.width * rect.height;

export function createDragController(
  getLabels: () => DndLabels = () => defaultDndLabels,
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
    params: BeginDragParams<never>;
  } | null = null;
  let active: {
    pointerId: number;
    item: DragItem;
    element: HTMLElement;
    origin: Rect;
    over: DropTargetEntry | null;
    point: Point;
    scrollers: HTMLElement[];
    /** The element `scrollers` was computed for; they are re-read only when it changes. */
    scrollersFor: Element | null;
    frame: number | null;
    lastFrameAt: number;
    params: BeginDragParams<never>;
  } | null = null;

  const emit = (event: DragOverlayEvent) => {
    for (const listener of [...overlayListeners]) listener(event);
  };

  const announce = (message: string) => {
    sequence += 1;
    const announcement = { message, sequence };
    store.setState((current) => ({ ...current, announcement }));
  };

  const say = (key: Exclude<keyof DndLabels, "handle" | "roleDescription">, item: DragItem) =>
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
    const canDrop = next ? next.over(active.point, active.item) : false;
    const overId = next?.id ?? null;
    store.setState((current) =>
      current.overId === overId && current.canDrop === canDrop
        ? current
        : { ...current, overId, canDrop },
    );
    // The pointer scrolls what is under it or, with nothing under it, the box the drag came out of.
    // Walking the ancestors reads computed styles, so it is done once per target, not per move.
    const scrollRoot = next?.element ?? active.element;
    if (active.scrollersFor !== scrollRoot) {
      active.scrollersFor = scrollRoot;
      active.scrollers = scrollableAncestors(scrollRoot);
    }
  };

  const stopFrames = () => {
    if (active?.frame != null) cancelAnimationFrame(active.frame);
    if (active) active.frame = null;
  };

  const runFrame = (now: number) => {
    if (!active) return;
    const elapsed = Math.min(now - active.lastFrameAt, 32);
    active.lastFrameAt = now;
    if (autoScrollStep(active.scrollers, active.point, elapsed)) resolveOver();
    active.frame = requestAnimationFrame(runFrame);
  };

  const startFrames = () => {
    if (!active || typeof requestAnimationFrame !== "function") return;
    active.lastFrameAt = performance.now();
    active.frame = requestAnimationFrame(runFrame);
  };

  // A finished drag is followed by a click on whatever the pointer released over. Only a click back
  // inside the dragged element is swallowed, and only until the next press.
  const swallowNextClick = (source: HTMLElement) => {
    const stop = () => {
      window.removeEventListener("click", swallow, true);
      window.removeEventListener("pointerdown", stop, true);
    };
    function swallow(event: MouseEvent) {
      stop();
      if (!(event.target instanceof Node) || !source.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }
    window.addEventListener("click", swallow, true);
    window.addEventListener("pointerdown", stop, true);
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

  const finish = (outcome: DragOutcome) => {
    if (!active) return;
    const { item, element, params } = active;
    stopFrames();
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
      canDrop: false,
      origin: null,
      grab: null,
      radius: null,
    }));
    emit({ type: "end", item, outcome, origin });
    params.onDragEnd?.(item as DragItem<never>, outcome);
    swallowNextClick(element);
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
      point,
      scrollers: scrollableAncestors(element),
      scrollersFor: element,
      frame: null,
      lastFrameAt: 0,
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
    startFrames();
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
      if (target?.over(point, active.item)) {
        target.drop(point, active.item);
        say("dropped", active.item);
        finish("drop");
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

    const activation = params.activation ?? activationFor(params.event.pointerType);
    const origin = { x: params.event.clientX, y: params.event.clientY };
    pending = {
      pointerId: params.event.pointerId,
      origin,
      activation,
      holdTimer: null,
      params: params as unknown as BeginDragParams<never>,
    };
    attach();
    if (activation.delay > 0) {
      pending.holdTimer = setTimeout(() => {
        if (pending) activate(pending.origin);
      }, activation.delay);
    } else if (activation.distance === 0) {
      activate(origin);
    }
  };

  const registerTarget = (entry: DropTargetEntry) => {
    targets.add(entry);
    return () => {
      targets.delete(entry);
      if (active?.over === entry) active.over = null;
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
