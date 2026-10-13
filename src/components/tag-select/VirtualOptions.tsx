import * as React from "react";

import { readCssLengthPx } from "@/hooks/usePosition";
import { rowGaps, useVirtualRows } from "@/hooks/useVirtualRows";
import type { ControlSize } from "@/internal/states";

import styles from "./TagSelect.module.css";

/** Options share one measured height until each is measured itself. */
const ONE_GROUP = () => 0;

export type VirtualOptionsHandle = {
  /** Scrolls the list's own scroller so option `index` is in view (the keyboard moved to it). */
  reveal: (index: number) => void;
};

type VirtualOptionsProps = {
  count: number;
  getKey: (index: number) => string;
  /** The panel's scroller; the window follows its scroll. */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Options rendered wherever the list scrolls: the highlighted one, the one whose menu is open. */
  pinned: readonly number[];
  size: ControlSize;
  /** Draws option `index`; `measure` goes on its row element. */
  renderOption: (index: number, measure: (node: HTMLElement | null) => void) => React.ReactNode;
  ref: React.Ref<VirtualOptionsHandle>;
};

/**
 * A long option list: only the options around the view are rendered (`useVirtualRows`), spacers
 * hold the height of the rest. Mounted with the panel, so the scroller exists before its effects.
 */
export function VirtualOptions({
  count,
  getKey,
  scrollRef,
  pinned,
  size,
  renderOption,
  ref,
}: VirtualOptionsProps) {
  const startRef = React.useRef<HTMLDivElement | null>(null);
  // Rows above the options (the hint, the Create row) and the panel padding.
  const offset = React.useCallback(() => {
    const scroller = scrollRef.current;
    const start = startRef.current;
    if (!scroller || !start) return 0;
    return (
      start.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
    );
  }, [scrollRef]);
  const estimate = React.useMemo(
    () => readCssLengthPx(`--prime-control-${size}-height`, 36),
    [size],
  );
  const estimateSize = React.useCallback(() => estimate, [estimate]);
  const virtual = useVirtualRows({
    count,
    scrollRef,
    getKey,
    estimateSize,
    getGroup: ONE_GROUP,
    offset,
    pinned,
  });

  const { startOf } = virtual;
  React.useImperativeHandle(
    ref,
    () => ({
      reveal(index) {
        const scroller = scrollRef.current;
        if (!scroller) return;
        const top = offset() + startOf(index);
        const bottom = offset() + startOf(index + 1);
        if (top < scroller.scrollTop) scroller.scrollTop = top;
        else if (bottom > scroller.scrollTop + scroller.clientHeight) {
          scroller.scrollTop = bottom - scroller.clientHeight;
        }
      },
    }),
    [scrollRef, offset, startOf],
  );

  const laid = rowGaps(virtual);
  const spacer = (key: string, height: number) =>
    height > 0 ? (
      <div key={key} className={styles.spacer} style={{ height }} aria-hidden="true" />
    ) : null;
  return (
    <>
      <div ref={startRef} aria-hidden="true" />
      {laid.rows.map(({ index, gap }) => (
        <React.Fragment key={getKey(index)}>
          {spacer("gap", gap)}
          {renderOption(index, virtual.measure(index))}
        </React.Fragment>
      ))}
      {spacer("gap-end", laid.end)}
    </>
  );
}
