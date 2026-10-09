import * as React from "react";

import { edgeSpeed } from "@/internal/edgeAutoScroll";

/**
 * Horizontal auto-scroll for a gesture on the time axis (move, resize, draw a bar): while the
 * pointer is near the start edge — the end of the pinned column, not the scroller's own edge, which
 * is why `autoScrollStep` does not fit — or near the end edge, the chart's scroller moves at the
 * kit's edge speed (`edgeSpeed`, `src/internal/edgeAutoScroll`), and `onScrolled` lets the gesture
 * re-read its position.
 */
export function useEdgeAutoScroll(
  scrollRef: React.RefObject<HTMLElement | null>,
  startEdge: () => number,
) {
  const state = React.useRef<{ clientX: number; onScrolled: () => void } | null>(null);
  const frame = React.useRef(0);
  const last = React.useRef(0);

  const stop = React.useCallback(() => {
    state.current = null;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  const tick = React.useCallback(
    (time: number) => {
      frame.current = 0;
      const current = state.current;
      const viewport = scrollRef.current;
      if (!current || !viewport) return;
      const elapsed = last.current ? Math.min(time - last.current, 50) : 16;
      last.current = time;
      const view = viewport.getBoundingClientRect();
      const fromStart = current.clientX - startEdge();
      const toEnd = view.right - current.clientX;
      const rtl = getComputedStyle(viewport).direction === "rtl";
      const delta = (edgeSpeed(toEnd) - edgeSpeed(fromStart)) * elapsed * (rtl ? -1 : 1);
      if (delta !== 0) {
        const before = viewport.scrollLeft;
        viewport.scrollLeft = before + delta;
        if (viewport.scrollLeft !== before) current.onScrolled();
      }
      frame.current = requestAnimationFrame(tick);
    },
    [scrollRef, startEdge],
  );

  /** The pointer moved during a gesture: keep scrolling while it stays near an edge. */
  const follow = React.useCallback(
    (clientX: number, onScrolled: () => void) => {
      state.current = { clientX, onScrolled };
      if (!frame.current && typeof requestAnimationFrame === "function") {
        last.current = 0;
        frame.current = requestAnimationFrame(tick);
      }
    },
    [tick],
  );

  React.useEffect(() => stop, [stop]);

  return React.useMemo(() => ({ follow, stop }), [follow, stop]);
}
