import { type Point, rectOf } from "./geometry";

// Distance from a scroll container's edge where it starts moving, and its top speed on the edge.
// Speed is per millisecond so a 120Hz display scrolls as fast as a 60Hz one.
const EDGE_PX = 64;
const MAX_SPEED_PX_PER_MS = 1.1;

function isScrollable(element: Element): boolean {
  const style = getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(`${style.overflowY} ${style.overflowX}`);
}

/** Scrollable boxes between `element` and the root, innermost first: a list that can still scroll wins over the page. */
export function scrollableAncestors(element: Element | null): HTMLElement[] {
  const found: HTMLElement[] = [];
  let node: Element | null = element;
  while (node instanceof HTMLElement) {
    if (isScrollable(node)) found.push(node);
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
  return rectOf(container);
}

function speedFor(distanceToEdge: number): number {
  if (distanceToEdge > EDGE_PX) return 0;
  return MAX_SPEED_PX_PER_MS * (1 - Math.max(distanceToEdge, 0) / EDGE_PX);
}

/** Scrolls the innermost container that wants to move and still can. Returns whether anything moved. */
export function autoScrollStep(
  containers: HTMLElement[],
  point: Point,
  elapsedMs: number,
): boolean {
  for (const container of containers) {
    const rect = boundsOf(container);
    const dy =
      speedFor(point.y - rect.top) * -1 * elapsedMs + speedFor(rect.bottom - point.y) * elapsedMs;
    const dx =
      speedFor(point.x - rect.left) * -1 * elapsedMs + speedFor(rect.right - point.x) * elapsedMs;
    if (dy === 0 && dx === 0) continue;
    const beforeTop = container.scrollTop;
    const beforeLeft = container.scrollLeft;
    container.scrollTop = beforeTop + dy;
    container.scrollLeft = beforeLeft + dx;
    if (container.scrollTop !== beforeTop || container.scrollLeft !== beforeLeft) return true;
  }
  return false;
}
