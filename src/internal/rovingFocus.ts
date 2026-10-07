/**
 * Keyboard → index math for roving focus, shared by single-row groups (tablist, radiogroup of
 * segments) and grids (swatches). Pure functions: the caller owns the items, focus and selection.
 */

/** Which arrow keys move along a single row. `both` accepts all four (a vertical list shown as a row). */
export type RovingOrientation = "horizontal" | "vertical" | "both";

const PREV: Record<RovingOrientation, readonly string[]> = {
  horizontal: ["ArrowLeft"],
  vertical: ["ArrowUp"],
  both: ["ArrowLeft", "ArrowUp"],
};

const NEXT: Record<RovingOrientation, readonly string[]> = {
  horizontal: ["ArrowRight"],
  vertical: ["ArrowDown"],
  both: ["ArrowRight", "ArrowDown"],
};

/**
 * Next index in a wrapping row of `count` items, or `null` when `key` does not navigate.
 * Arrows wrap around the ends; Home / End jump to the first / last item. A current index of `-1`
 * (nothing focused yet) moves to the first item on "next" and to the last on "previous".
 */
export function rovingIndex(
  key: string,
  index: number,
  count: number,
  orientation: RovingOrientation = "both",
): number | null {
  if (count <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (NEXT[orientation].includes(key)) return index < 0 ? 0 : (index + 1) % count;
  if (PREV[orientation].includes(key)) return index < 0 ? count - 1 : (index - 1 + count) % count;
  return null;
}

/**
 * Next index in a grid of `count` items laid out in rows of `columns`, or `null` when `key` does
 * not navigate. Left / Right step through the reading order and stop at the ends; Up / Down move
 * one row and stay put when there is no row; Home / End jump to the first / last item.
 */
export function gridIndex(
  key: string,
  index: number,
  count: number,
  columns: number,
): number | null {
  if (count <= 0) return null;
  const from = Math.min(Math.max(index, 0), count - 1);
  const step = Math.max(1, columns);
  switch (key) {
    case "ArrowRight":
      return Math.min(from + 1, count - 1);
    case "ArrowLeft":
      return Math.max(from - 1, 0);
    case "ArrowDown":
      return from + step < count ? from + step : from;
    case "ArrowUp":
      return from - step >= 0 ? from - step : from;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}
