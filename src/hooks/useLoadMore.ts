import * as React from "react";

import type { AsyncHandler } from "@/internal/usePendingChanges";

/** A list asks a little before its end scrolls into view, so the next batch is ready. */
const LIST_ROOT_MARGIN = "0px 0px 48px 0px";

/** Nothing asked in this round yet. */
const NONE = Symbol("none");

type LoadMoreOptions = {
  /** More can be requested now: `hasMore`, a handler, nothing loading, no load error. */
  enabled: boolean;
  onLoadMore: AsyncHandler | undefined;
  /** The list's own scroller: the observer root. */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Changes when the list changes (a batch arrived): a new round may ask again. */
  round: unknown;
  /**
   * How far past the scroller's end the sentinel counts as reached (`IntersectionObserver`
   * `rootMargin`). A list of rows asks 48 px early; a long table asks earlier.
   */
  rootMargin?: string;
};

/**
 * Load more at the end of a list (Select, CommandMenu, a DataTable that scrolls forever): a
 * sentinel after the last item asks once per round when it scrolls into the list's own scroller;
 * `request` asks the same way from the keyboard (the highlight reached the last item). A disabled
 * round (loading, an error) asks again once it is enabled. Without `IntersectionObserver` (jsdom,
 * old engines) only `request` asks.
 */
export function useLoadMore<E extends HTMLElement = HTMLDivElement>({
  enabled,
  onLoadMore,
  scrollRef,
  round,
  rootMargin = LIST_ROOT_MARGIN,
}: LoadMoreOptions) {
  const sentinelRef = React.useRef<E | null>(null);
  const handlerRef = React.useRef(onLoadMore);
  handlerRef.current = onLoadMore;
  /** The round the last request was made in. */
  const askedIn = React.useRef<unknown>(NONE);

  React.useLayoutEffect(() => {
    if (!enabled) askedIn.current = NONE;
  }, [enabled]);

  const request = React.useCallback(() => {
    if (!enabled || Object.is(askedIn.current, round)) return;
    askedIn.current = round;
    void handlerRef.current?.();
  }, [enabled, round]);

  // A new round is a new `request`: the sentinel is observed anew, and one still in view reports.
  React.useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!enabled || !root || !target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) request();
      },
      { root, rootMargin, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, request, rootMargin, scrollRef]);

  return { sentinelRef, request };
}
