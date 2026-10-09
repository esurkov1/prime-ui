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

export type EdgePoint = { x: number; y: number };

/** Speed toward an edge `distance` px away from the pointer: 0 outside the zone. */
export function edgeSpeed(distance: number, zone = EDGE_ZONE_PX): number {
  if (distance > zone) return 0;
  return MAX_SPEED_PX_PER_MS * (1 - Math.max(distance, 0) / zone);
}

const SCROLLS = /^(auto|scroll|overlay)$/;

/** The axes a person can scroll the element along; `hidden` and `clip` are not among them. */
function scrollAxes(element: Element): { x: boolean; y: boolean } {
  const style = getComputedStyle(element);
  return { x: SCROLLS.test(style.overflowX), y: SCROLLS.test(style.overflowY) };
}

/** Scrollable boxes between `element` and the root, innermost first: a list that can still scroll wins over the page. */
export function scrollableAncestors(element: Element | null): HTMLElement[] {
  const found: HTMLElement[] = [];
  let node: Element | null = element;
  while (node instanceof HTMLElement) {
    const axes = scrollAxes(node);
    if (axes.x || axes.y) found.push(node);
    node = node.parentElement;
  }
  // The page itself scrolls through the document element even with `overflow: visible`.
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

// The page's edges are the window's, not the (document-tall) element's.
function boundsOf(container: HTMLElement) {
  if (container === document.scrollingElement) {
    return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  }
  return container.getBoundingClientRect();
}

/**
 * One frame of edge auto-scroll: scrolls the innermost of `containers` that wants to move and still
 * can. `axes` limits the axes a gesture scrolls (a list's drag only up and down). Returns whether
 * anything moved, so the gesture re-reads what is under the pointer.
 */
export function autoScrollStep(
  containers: HTMLElement[],
  point: EdgePoint,
  elapsedMs: number,
  axes: { x: boolean; y: boolean } = { x: true, y: true },
): boolean {
  for (const container of containers) {
    const rect = boundsOf(container);
    // Only along an axis the box scrolls: a column with `overflow-x: hidden` still takes a
    // `scrollLeft` once something overflows it (a gap gliding in from the next column), and would
    // slide sideways under the pointer and snap back when the glide ends.
    const can =
      container === document.scrollingElement ? { x: true, y: true } : scrollAxes(container);
    const dy =
      axes.y && can.y
        ? (edgeSpeed(rect.bottom - point.y) - edgeSpeed(point.y - rect.top)) * elapsedMs
        : 0;
    const dx =
      axes.x && can.x
        ? (edgeSpeed(rect.right - point.x) - edgeSpeed(point.x - rect.left)) * elapsedMs
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
