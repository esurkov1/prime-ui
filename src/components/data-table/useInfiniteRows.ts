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
 * viewport, then asks for more data (`onLoadMore`) once every loaded row is shown. A promise from
 * `onLoadMore` counts as loading until it settles; after a rejection the table stops asking until
 * the rows change, so a failing request is never repeated in a loop.
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
  const [pending, setPending] = React.useState(false);
  /** Row count at the last rejected request: no new request until it changes. */
  const [failedAt, setFailedAt] = React.useState<number | null>(null);
  const visibleCount = Math.min(Math.max(revealed, pageSize), Math.max(pageSize, totalRows));
  const hasInternalMore = enabled && visibleCount < totalRows;
  const canRequestMore =
    enabled && Boolean(onLoadMore) && hasMore && !loadingMore && !pending && failedAt !== totalRows;
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const loadMoreRef = React.useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;
  const mounted = React.useRef(true);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Re-observed after every reveal: a sentinel that is still visible then reports again.
  React.useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target || !(hasInternalMore || canRequestMore)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (hasInternalMore) {
          setRevealed(visibleCount + Math.max(1, batchSize));
          return;
        }
        const request = loadMoreRef.current?.();
        if (!request || typeof request.then !== "function") return;
        observer.disconnect();
        setPending(true);
        request.then(
          () => {
            if (mounted.current) setPending(false);
          },
          () => {
            if (!mounted.current) return;
            setPending(false);
            setFailedAt(totalRows);
          },
        );
      },
      { root, rootMargin: INFINITE_ROOT_MARGIN, threshold: 0.01 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [scrollRef, hasInternalMore, canRequestMore, visibleCount, batchSize, totalRows]);

  return {
    visibleCount,
    hasInternalMore,
    canRequestMore,
    loading: loadingMore || pending,
    sentinelRef,
  };
}
