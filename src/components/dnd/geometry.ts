export type Point = { x: number; y: number };

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

/** `grid`: items wrap into rows (reading order: row by row, start to end inside a row). */
export type Axis = "x" | "y" | "grid";

export function rectOf(element: Element): Rect {
  const { left, top, right, bottom, width, height } = element.getBoundingClientRect();
  return { left, top, right, bottom, width, height };
}

/** A running glide on the element: its scale and move, and the point it scales around. */
function currentTransform(
  element: Element,
): { a: number; d: number; tx: number; ty: number; ox: number; oy: number } | null {
  // Only an element mid-animation is drawn away from its layout box; skipping the style read for the
  // rest keeps a long list cheap to measure on every pointer move.
  // `getAnimations` is missing in jsdom, where consumers test screens built with the kit.
  if (!element.getAnimations || element.getAnimations().length === 0) return null;
  const style = getComputedStyle(element);
  if (!style.transform || style.transform === "none") return null;
  try {
    const m = new DOMMatrixReadOnly(style.transform);
    const [ox = 0, oy = 0] = style.transformOrigin.split(" ").map((v) => Number.parseFloat(v) || 0);
    return { a: m.a || 1, d: m.d || 1, tx: m.m41, ty: m.m42, ox, oy };
  } catch {
    return null;
  }
}

/**
 * Where an element sits in the layout with any animation transform taken back out — its glide and
 * its growth (a tile growing into the cover cell is drawn smaller until it gets there). Every drop
 * decision is measured against this: reading the drawn box makes each answer depend on the
 * animation the previous answer started, and the gap swings between cells under a pointer that
 * barely moves.
 */
export function layoutRect(element: Element): Rect {
  const rect = rectOf(element);
  const t = currentTransform(element);
  if (!t) return rect;
  // drawn = layout scaled by (a, d) around the origin, then moved by (tx, ty).
  const width = rect.width / t.a;
  const height = rect.height / t.d;
  const left = rect.left - t.tx - t.ox * (1 - t.a);
  const top = rect.top - t.ty - t.oy * (1 - t.d);
  return { left, top, right: left + width, bottom: top + height, width, height };
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
 * The nodes matching `selector` that belong to `container` itself: a list nested inside one of its
 * items (cards inside a column of a board) keeps its own items and gap.
 */
export function ownNodes(container: Element, selector: string): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((node) => {
    const owner = node.parentElement?.closest("[data-dnd-item]");
    return !owner || !container.contains(owner);
  });
}

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
  if (axis === "grid") return gridInsertionBefore(container, itemSelector, point, liftedId);
  const position = axis === "y" ? point.y : point.x;
  let gapShift = 0;
  for (const node of ownNodes(container, `${itemSelector}, ${DROP_GAP_SELECTOR}`)) {
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

/**
 * A wrapping grid, cells of any span (a cover two cells wide), read as slots: the drawn cells in
 * order — the gap, or the carried item's own cell before the gap replaces it, among them — are the
 * places 0…n, and the slot nearest the aim (the carried item's centre) is the index the item takes.
 * The answer depends on where the slots are, not on which item stands in them: once the order
 * follows, the aim is over the gap, which is the same slot, and nothing swings back however the
 * cells change size. A slot is taken as soon as the aim enters it.
 */
function gridInsertionBefore(
  container: Element,
  itemSelector: string,
  point: Point,
  liftedId?: string,
): string | null {
  const slots = ownNodes(container, `${itemSelector}, ${DROP_GAP_SELECTOR}`).filter((node) => {
    if (node.hasAttribute("data-lifted")) return false;
    const rect = layoutRect(node);
    return rect.width > 0 || rect.height > 0;
  });
  let target = -1;
  let best = Number.POSITIVE_INFINITY;
  slots.forEach((node, index) => {
    const rect = layoutRect(node);
    const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
    const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
    const distance = Math.hypot(dx, dy);
    if (distance < best) {
      best = distance;
      target = index;
    }
  });
  if (target === -1) return null;
  // The others in order, without the carried item: it lands in front of the one at the target.
  const rest = slots
    .map((node) => node.dataset.dndItem)
    .filter((id): id is string => id !== undefined && id !== liftedId);
  return rest[target] ?? null;
}
