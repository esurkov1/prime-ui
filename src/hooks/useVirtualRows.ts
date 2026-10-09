import * as React from "react";
import { flushSync } from "react-dom";

/** A row to render: its index, top offset and height in px. */
export type VirtualRow = { index: number; start: number; size: number };

export type UseVirtualRowsOptions = {
  /** Number of rows. */
  count: number;
  /** The scroll container the rows scroll in (vertically). */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Stable key of a row: a measured height stays with its row when rows reorder. */
  getKey: (index: number) => React.Key;
  /** Height before the row is measured, px. */
  estimateSize: (index: number) => number;
  /**
   * Rows of one group share a measured height until each is measured itself (rows with the same
   * lane count, the same template): one measurement corrects the estimate for the whole group.
   */
  getGroup?: (index: number) => React.Key;
  /**
   * Distance from the top of the scroller's content to the first row (a sticky head above, content
   * before the list), px — or a function read on every scroll, for a distance that changes.
   */
  offset?: number | (() => number);
  /** Extra rows rendered above and below the visible ones. Default 6. */
  overscan?: number;
  /** Rows rendered whatever the scroll position (a focused row, a row being dragged in). */
  pinned?: readonly number[];
  /** Rows rendered while the scroller has no size yet (no layout, first paint). Default 30. */
  initialCount?: number;
  /**
   * Which end the list opens at: `end` for a list that opens at its end (a chat) — the first batch
   * and the first range come from the end, so the first paint shows the rows the scroller lands on.
   */
  initialAlign?: "start" | "end";
  /**
   * Sticky header rows, ascending (date separators): the last one at or above the first rendered
   * row stays rendered, so it can stick while its rows scroll under it.
   */
  sticky?: readonly number[];
};

export type VirtualRows = {
  /** Rows to render, by index: the visible range, the overscan and the pinned rows. */
  rows: VirtualRow[];
  /** Height of all rows, px: the size of the scrolled content. */
  totalSize: number;
  /** Top offset of a row (rendered or not), px from the first row. */
  startOf: (index: number) => number;
  /** Callback ref for the element of row `index`: measures it and follows its size. */
  measure: (index: number) => (node: HTMLElement | null) => void;
};

/**
 * Vertical row virtualization inside a component's own scroller: renders the rows that intersect
 * the viewport plus an overscan, places them by exact offsets (estimated, then measured with a
 * ResizeObserver, each size cached by row key) and keeps the total height right, so the scrollbar
 * never jumps. Re-renders only when the rendered range changes, at most once per frame. The range
 * follows its rows by key: rows inserted above (history loaded) keep the same rows rendered — the
 * same DOM nodes — and a range that reaches the last row grows with rows appended at the end. An
 * estimate that changes never moves the range: it is read from the scroll position.
 */
export function useVirtualRows({
  count,
  scrollRef,
  getKey,
  estimateSize,
  getGroup,
  offset = 0,
  overscan = 6,
  pinned,
  initialCount = 30,
  initialAlign = "start",
  sticky,
}: UseVirtualRowsOptions): VirtualRows {
  const sizes = React.useRef(new Map<React.Key, number>());
  const groupSizes = React.useRef(new Map<React.Key, number>());
  const [measuredVersion, setMeasuredVersion] = React.useState(0);
  const [range, setRange] = React.useState<[number, number] | null>(null);
  const rangeRef = React.useRef(range);
  rangeRef.current = range;

  // Offsets of every row: measured size, else the group's measured size, else the estimate.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `measuredVersion` invalidates the sizes read from refs
  const starts = React.useMemo(() => {
    const result = new Float64Array(count + 1);
    for (let index = 0; index < count; index++) {
      const own = sizes.current.get(getKey(index));
      const group = getGroup ? groupSizes.current.get(getGroup(index)) : undefined;
      result[index + 1] = result[index] + (own ?? group ?? estimateSize(index));
    }
    return result;
  }, [count, getKey, getGroup, estimateSize, measuredVersion]);

  const startsRef = React.useRef(starts);
  startsRef.current = starts;

  /** First row whose bottom is below `y` (binary search over the offsets). */
  const rowAt = React.useCallback((y: number) => {
    const offsets = startsRef.current;
    let low = 0;
    let high = offsets.length - 2;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (offsets[mid + 1] <= y) low = mid + 1;
      else high = mid;
    }
    return Math.max(0, low);
  }, []);

  /** The rows that intersect the viewport, without overscan; `null` before the scroller has a size. */
  const visibleRows = React.useCallback((): [number, number] | null => {
    const node = scrollRef.current;
    if (!node || node.clientHeight === 0 || count === 0) return null;
    const start = typeof offset === "function" ? offset() : offset;
    // Opening at the end, the first range is the end's: the scroller is put there in the same
    // commit, after this read.
    const top =
      rangeRef.current === null && initialAlign === "end"
        ? startsRef.current[count] - node.clientHeight
        : node.scrollTop - start;
    return [rowAt(Math.max(0, top)), rowAt(Math.max(0, top + node.clientHeight))];
  }, [scrollRef, offset, count, rowAt, initialAlign]);

  /*
   * The rendered range moves in steps: while it still holds the visible rows with a row to spare
   * on each side, scrolling renders nothing — a re-render every few rows, not every frame.
   */
  const update = React.useCallback(() => {
    const visible = visibleRows();
    setRange((prev) => {
      if (!visible) return prev === null ? prev : null;
      const [first, last] = visible;
      if (
        prev &&
        prev[0] <= Math.max(0, first - 1) &&
        prev[1] >= Math.min(count - 1, last + 1) &&
        prev[1] - prev[0] <= last - first + 2 * overscan &&
        prev[1] < count
      ) {
        return prev;
      }
      return [Math.max(0, first - overscan), Math.min(count - 1, last + overscan)];
    });
  }, [visibleRows, overscan, count]);

  // Every new geometry (count, sizes) re-reads the range before paint.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `starts` changes the range
  React.useLayoutEffect(() => update(), [update, starts]);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Rendered in this frame, before it paints: a fast scroll never shows the spacer where
        // the next rows belong.
        flushSync(update);
      });
    };
    node.addEventListener("scroll", schedule, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(node);
    return () => {
      node.removeEventListener("scroll", schedule);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollRef, update]);

  // Measurement: one observer for all rendered rows; new sizes re-run the offsets once per frame.
  const observed = React.useRef(new Map<Element, number>());
  const measureFrame = React.useRef(0);
  const getKeyRef = React.useRef(getKey);
  getKeyRef.current = getKey;
  const getGroupRef = React.useRef(getGroup);
  getGroupRef.current = getGroup;
  const record = React.useCallback((size: number, index: number) => {
    const offsets = startsRef.current;
    if (size <= 0 || index >= offsets.length - 1) return;
    const key = getKeyRef.current(index);
    if (sizes.current.get(key) === size) return;
    sizes.current.set(key, size);
    const group = getGroupRef.current?.(index);
    const groupChanged = group !== undefined && groupSizes.current.get(group) !== size;
    if (group !== undefined) groupSizes.current.set(group, size);
    // The size the offsets already use: nothing moves, nothing re-renders.
    if (!groupChanged && offsets[index + 1] - offsets[index] === size) return;
    if (!measureFrame.current) {
      measureFrame.current = requestAnimationFrame(() => {
        measureFrame.current = 0;
        setMeasuredVersion((version) => version + 1);
      });
    }
  }, []);
  const observer = React.useMemo(
    () =>
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((entries) => {
            for (const entry of entries) {
              const index = observed.current.get(entry.target);
              const size = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
              if (index !== undefined) record(size, index);
            }
          }),
    [record],
  );
  React.useEffect(
    () => () => {
      observer?.disconnect();
      if (measureFrame.current) cancelAnimationFrame(measureFrame.current);
    },
    [observer],
  );
  const refs = React.useRef(new Map<number, (node: HTMLElement | null) => void>());
  const nodes = React.useRef(new Map<number, HTMLElement>());
  const measure = React.useCallback(
    (index: number) => {
      let ref = refs.current.get(index);
      if (!ref) {
        ref = (node: HTMLElement | null) => {
          const previous = nodes.current.get(index);
          if (previous && previous !== node) {
            observer?.unobserve(previous);
            observed.current.delete(previous);
            nodes.current.delete(index);
          }
          if (!node) return;
          nodes.current.set(index, node);
          observed.current.set(node, index);
          // The observer reports the first size after layout: no read during the commit.
          observer?.observe(node);
        };
        refs.current.set(index, ref);
      }
      return ref;
    },
    [observer],
  );

  // The range follows its rows by key: when rows were inserted above or removed, the same rows
  // stay rendered (what the reader looks at never unmounts); a range at the last row takes the
  // rows appended after it.
  const anchor = React.useRef<{ range: [number, number]; first: React.Key; count: number } | null>(
    null,
  );
  let held = range;
  // Only when the rows changed under a range that did not move itself (a scroll moves it).
  if (range && anchor.current && anchor.current.range === range && count > 0) {
    let first = Math.min(range[0], count - 1);
    if (getKey(first) !== anchor.current.first) {
      for (let index = 0; index < count; index++) {
        if (getKey(index) === anchor.current.first) {
          first = index;
          break;
        }
      }
    }
    const shift = first - range[0];
    const atEnd = range[1] >= anchor.current.count - 1;
    const last = atEnd ? count - 1 : Math.min(count - 1, range[1] + shift);
    if (first !== range[0] || last !== range[1]) held = [Math.min(first, last), last];
  }
  if (held !== range) setRange(held);
  React.useLayoutEffect(() => {
    anchor.current = range && count > 0 ? { range, first: getKey(range[0]), count } : null;
  });

  const visible =
    held ??
    (initialAlign === "end"
      ? [Math.max(0, count - initialCount), count - 1]
      : [0, Math.min(count, initialCount) - 1]);
  const indexes = new Set<number>();
  for (let index = visible[0]; index <= Math.min(visible[1], count - 1); index++)
    indexes.add(index);
  for (const index of pinned ?? []) if (index >= 0 && index < count) indexes.add(index);
  if (sticky) {
    let header = -1;
    for (const index of sticky) {
      if (index > visible[0]) break;
      header = index;
    }
    if (header >= 0 && header < count) indexes.add(header);
  }
  const rows = [...indexes]
    .sort((a, b) => a - b)
    .map((index) => ({ index, start: starts[index], size: starts[index + 1] - starts[index] }));

  const startOf = React.useCallback((index: number) => startsRef.current[index] ?? 0, []);

  return { rows, totalSize: starts[count] ?? 0, startOf, measure };
}
