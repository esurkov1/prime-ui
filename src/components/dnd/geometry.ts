export type Point = { x: number; y: number };

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type Axis = "x" | "y";

export function rectOf(element: Element): Rect {
  const { left, top, right, bottom, width, height } = element.getBoundingClientRect();
  return { left, top, right, bottom, width, height };
}

function currentTranslation(element: Element): Point {
  // Only an element mid-animation is drawn away from its layout box; skipping the style read for the
  // rest keeps a long list cheap to measure on every pointer move.
  // `getAnimations` is missing in jsdom, where consumers test screens built with the kit.
  if (!element.getAnimations || element.getAnimations().length === 0) {
    return { x: 0, y: 0 };
  }
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === "none") return { x: 0, y: 0 };
  try {
    const matrix = new DOMMatrixReadOnly(transform);
    return { x: matrix.m41, y: matrix.m42 };
  } catch {
    return { x: 0, y: 0 };
  }
}

/**
 * Where an element sits in the layout with any animation transform taken back out. Every drop
 * decision is measured against this: reading the drawn position makes each answer depend on the
 * animation the previous answer started, and the gap flickers under a pointer that barely moves.
 */
export function layoutRect(element: Element): Rect {
  const rect = rectOf(element);
  const shift = currentTranslation(element);
  return {
    left: rect.left - shift.x,
    top: rect.top - shift.y,
    right: rect.right - shift.x,
    bottom: rect.bottom - shift.y,
    width: rect.width,
    height: rect.height,
  };
}

export function rectContains(rect: Rect, point: Point): boolean {
  return (
    point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  );
}

export function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Marks the gap a sortable list opens where the dragged item will land. */
export const DROP_GAP_SELECTOR = "[data-dnd-gap]";

/**
 * The item a dragged one would land in front of: the first whose midline is past the pointer, or
 * `null` for "after every item". Measured in the layout the list would have WITHOUT the gap, so the
 * answer depends only on the pointer, never on where the gap currently stands.
 */
export function insertionBefore(
  container: Element,
  itemSelector: string,
  point: Point,
  axis: Axis = "y",
  liftedId?: string,
): string | null {
  const position = axis === "y" ? point.y : point.x;
  let gapShift = 0;
  for (const node of container.querySelectorAll<HTMLElement>(
    `${itemSelector}, ${DROP_GAP_SELECTOR}`,
  )) {
    if (node.hasAttribute("data-lifted")) continue;
    const rect = layoutRect(node);
    if (rect.width === 0 && rect.height === 0) continue;
    if (node.matches(DROP_GAP_SELECTOR) || node.dataset.dndItem === liftedId) {
      gapShift += axis === "y" ? rect.height : rect.width;
      continue;
    }
    const id = node.dataset.dndItem;
    if (id === undefined) continue;
    const midline =
      (axis === "y" ? rect.top + rect.height / 2 : rect.left + rect.width / 2) - gapShift;
    if (position < midline) return id;
  }
  return null;
}
