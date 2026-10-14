import { type ScrollAxes, scrollAxes, scrollableAncestors } from "@/internal/scrollAncestors";

/**
 * Edge auto-scroll: the one mechanism behind every gesture that scrolls a ScrollContainer (or the
 * page) while the pointer is held near its edge — a Dnd drag, a Gantt bar moved or drawn along the
 * time axis, a drag that paints a selection over DataTable rows or chat messages. Within
 * `EDGE_ZONE_PX` of an edge the scroller moves toward it, faster the closer the pointer is, up to
 * `MAX_SPEED_PX_PER_MS` on the edge itself. Speed is per millisecond, so a 120 Hz display scrolls
 * as fast as a 60 Hz one. A region that cannot scroll (`data-fits`, ScrollContainer `lock`: both
 * `overflow: hidden`) is never moved.
 */

/** Distance from an edge where the scroller starts to move (`--prime-space-16`). */
export const EDGE_ZONE_PX = 64;
/** Top speed, on the edge itself. */
export const MAX_SPEED_PX_PER_MS = 1.1;
/**
 * The longest step one frame may take: a frame that comes late (a busy main thread, a tab coming
 * back) moves as far as two frames at 60 Hz, never a jump.
 */
const MAX_FRAME_MS = 32;

export type EdgePoint = { x: number; y: number };

/**
 * How far in from a scroller's edges its zones start, in px, by logical side: a scroller with a
 * pinned column (Gantt's names) scrolls from the end of that column, not from its own edge.
 * Inline sides follow the scroller's writing direction.
 */
type EdgeInsets = {
  inlineStart?: number;
  inlineEnd?: number;
  blockStart?: number;
  blockEnd?: number;
};

/** Speed toward an edge `distance` px away from the pointer: 0 outside the zone. */
function edgeSpeed(distance: number, zone = EDGE_ZONE_PX): number {
  if (distance > zone) return 0;
  return MAX_SPEED_PX_PER_MS * (1 - Math.max(distance, 0) / zone);
}

/**
 * The boxes a gesture that started on `element` may scroll, innermost first — a list that can
 * still scroll wins over the page. The page itself scrolls through the document element even with
 * `overflow: visible`.
 */
export function edgeScrollers(element: Element | null): HTMLElement[] {
  const found = scrollableAncestors(element);
  const page = typeof document === "undefined" ? null : document.scrollingElement;
  if (
    page instanceof HTMLElement &&
    !found.includes(page) &&
    (page.scrollHeight > page.clientHeight || page.scrollWidth > page.clientWidth)
  ) {
    found.push(page);
  }
  return found;
}

const isPage = (container: HTMLElement) => container === document.scrollingElement;

/** The edges the zones start from: the box, moved in by the insets on their physical sides. */
function edgesOf(container: HTMLElement, insets: EdgeInsets | undefined) {
  // The page's edges are the window's, not the (document-tall) element's.
  const rect = isPage(container)
    ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
    : container.getBoundingClientRect();
  if (!insets) return rect;
  const rtl =
    (insets.inlineStart || insets.inlineEnd) && getComputedStyle(container).direction === "rtl";
  const start = insets.inlineStart ?? 0;
  const end = insets.inlineEnd ?? 0;
  return {
    left: rect.left + (rtl ? end : start),
    right: rect.right - (rtl ? start : end),
    top: rect.top + (insets.blockStart ?? 0),
    bottom: rect.bottom - (insets.blockEnd ?? 0),
  };
}

const BOTH: ScrollAxes = { x: true, y: true };

/**
 * One frame of edge auto-scroll: scrolls the innermost of `containers` that wants to move and still
 * can. Returns whether anything moved, so the gesture re-reads what is under the pointer.
 */
function autoScrollStep(
  containers: readonly HTMLElement[],
  point: EdgePoint,
  elapsedMs: number,
  axes: ScrollAxes,
  insets: ((container: HTMLElement) => EdgeInsets | undefined) | undefined,
): boolean {
  for (const container of containers) {
    const edges = edgesOf(container, insets?.(container));
    // Only along an axis the box scrolls: a column with `overflow-x: hidden` still takes a
    // `scrollLeft` once something overflows it (a gap gliding in from the next column), and would
    // slide sideways under the pointer and snap back when the glide ends.
    const can = isPage(container) ? BOTH : scrollAxes(container);
    // Physical sides: in a right-to-left box `scrollLeft` runs negative toward the inline end, so
    // the same sign moves toward the edge the pointer is at.
    const dy =
      axes.y && can.y
        ? (edgeSpeed(edges.bottom - point.y) - edgeSpeed(point.y - edges.top)) * elapsedMs
        : 0;
    const dx =
      axes.x && can.x
        ? (edgeSpeed(edges.right - point.x) - edgeSpeed(point.x - edges.left)) * elapsedMs
        : 0;
    if (dy === 0 && dx === 0) continue;
    const beforeTop = container.scrollTop;
    const beforeLeft = container.scrollLeft;
    container.scrollTop = beforeTop + dy;
    container.scrollLeft = beforeLeft + dx;
    if (container.scrollTop !== beforeTop || container.scrollLeft !== beforeLeft) return true;
  }
  return false;
}

type EdgeAutoScrollOptions = {
  /** The boxes to scroll, innermost first (`edgeScrollers`); `setScrollers` replaces them. */
  scrollers: readonly HTMLElement[];
  /** The axes the gesture scrolls (a list's drag: only up and down). Both by default. */
  axes?: ScrollAxes;
  /** Where a scroller's zones start (a pinned column), read every frame. */
  insets?: (container: HTMLElement) => EdgeInsets | undefined;
  /** Something scrolled under the pointer: the gesture re-reads what it is over. */
  onScrolled: () => void;
};

export type EdgeAutoScroll = {
  /** The pointer moved during the gesture: scrolls while it is held near an edge. */
  follow: (point: EdgePoint) => void;
  /** The pointer went over another box: the boxes to scroll from now on. */
  setScrollers: (scrollers: readonly HTMLElement[]) => void;
  /** The gesture ended. */
  stop: () => void;
};

/**
 * The frame loop of a gesture held near an edge: `follow` starts it, each frame scrolls by the
 * time that passed (clamped to `MAX_FRAME_MS`) and calls `onScrolled` when something moved. A frame
 * that moves nothing (the pointer left the zones, the scroller reached its end) rests the loop
 * until the pointer moves again.
 */
export function createEdgeAutoScroll(options: EdgeAutoScrollOptions): EdgeAutoScroll {
  const { axes = BOTH, insets, onScrolled } = options;
  let scrollers = options.scrollers;
  let point: EdgePoint | null = null;
  let frame = 0;
  let last = 0;

  const tick = (now: number) => {
    frame = 0;
    if (!point) return;
    const elapsed = last ? Math.min(now - last, MAX_FRAME_MS) : 16;
    last = now;
    if (!autoScrollStep(scrollers, point, elapsed, axes, insets)) {
      last = 0;
      return;
    }
    // The next frame first: `onScrolled` may follow the pointer again, and one loop runs.
    frame = requestAnimationFrame(tick);
    onScrolled();
  };

  return {
    follow(next) {
      point = next;
      if (frame || scrollers.length === 0 || typeof requestAnimationFrame !== "function") return;
      frame = requestAnimationFrame(tick);
    },
    setScrollers(next) {
      scrollers = next;
    },
    stop() {
      point = null;
      last = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
