import * as React from "react";

type ChipOverflowOptions = {
  /** The visible chip row (its width and column gap). */
  rowRef: React.RefObject<HTMLElement | null>;
  /** An invisible row of every chip followed by a «+N» sample: the widths to fit. */
  measureRef: React.RefObject<HTMLElement | null>;
  /** The text input sharing the row; its min width is reserved unless it is collapsed. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** The chips (a new array when one is added, removed, renamed or recolored). */
  chips: readonly unknown[];
  inputCollapsed: boolean;
};

/**
 * How many chips fit on one row of the field; the rest collapse into a «+N» chip. At least one
 * chip stays visible (it shrinks with an ellipsis, «+N» never does). Recounts when the chips
 * change and when the row or the measured chips change size (fonts, a renamed tag).
 */
export function useChipOverflow({
  rowRef,
  measureRef,
  inputRef,
  chips,
  inputCollapsed,
}: ChipOverflowOptions): number {
  const count = chips.length;
  const [visible, setVisible] = React.useState(count);

  const recompute = React.useCallback(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const nodes = Array.from(measure.children) as HTMLElement[];
    const more = nodes.pop();
    const widths = nodes.map((node) => node.offsetWidth);
    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const input = inputRef.current;
    const inputReserve =
      input && !inputCollapsed ? Number.parseFloat(getComputedStyle(input).minWidth) || 0 : 0;
    const available = row.clientWidth - inputReserve;
    const total = widths.reduce((sum, width, index) => sum + width + (index > 0 ? gap : 0), 0);
    let next = widths.length;
    if (total > available) {
      const moreWidth = (more?.offsetWidth ?? 0) + gap;
      let used = 0;
      next = 0;
      for (const width of widths) {
        const add = width + (next > 0 ? gap : 0);
        if (used + add + moreWidth > available) break;
        used += add;
        next += 1;
      }
      next = Math.max(1, next);
    }
    setVisible((prev) => (prev === next ? prev : next));
  }, [rowRef, measureRef, inputRef, inputCollapsed]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: recount when the chips change
  React.useLayoutEffect(() => {
    recompute();
  }, [recompute, chips]);

  React.useEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => recompute());
    observer.observe(row);
    if (measure) observer.observe(measure);
    return () => observer.disconnect();
  }, [rowRef, measureRef, recompute]);

  return Math.min(visible, count);
}
