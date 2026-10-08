import * as React from "react";

/** The sentinel reports a little before it scrolls into view, so the next batch is ready. */
const INFINITE_ROOT_MARGIN = "0px 0px 120px 0px";

type UseInfiniteRowsOptions = {
  enabled: boolean;
  /** First batch. */
  pageSize: number;
  /** Rows revealed per reach of the end. */
  batchSize: number;
  totalRows: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore?: () => void | Promise<void>;
  scrollRef: React.RefObject<HTMLElement | null>;
};

/**
 * Infinite scroll: reveals loaded rows in batches while a sentinel under the table reaches the
 * viewport, then asks for more data (`onLoadMore`) once every loaded row is shown.
 */
export function useInfiniteRows({
  enabled,
  pageSize,
  batchSize,
  totalRows,
  hasMore,
  loadingMore,
  onLoadMore,
  scrollRef,
}: UseInfiniteRowsOptions) {
  const [revealed, setRevealed] = React.useState(pageSize);
  const visibleCount = Math.min(Math.max(revealed, pageSize), Math.max(pageSize, totalRows));
  const hasInternalMore = enabled && visibleCount < totalRows;
  const canRequestMore = enabled && Boolean(onLoadMore) && hasMore && !loadingMore;
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const loadMoreRef = React.useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  // Re-observed after every reveal: a sentinel that is still visible then reports again.
  React.useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target || !(hasInternalMore || canRequestMore)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (hasInternalMore) setRevealed(visibleCount + Math.max(1, batchSize));
        else void loadMoreRef.current?.();
      },
      { root, rootMargin: INFINITE_ROOT_MARGIN, threshold: 0.01 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [scrollRef, hasInternalMore, canRequestMore, visibleCount, batchSize]);

  return { visibleCount, hasInternalMore, canRequestMore, sentinelRef };
}
