import * as React from "react";

import { useLoadMore } from "@/hooks/useLoadMore";
import { isPromiseLike } from "@/internal/usePendingChanges";

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
 * viewport (`useLoadMore`), then asks for more data (`onLoadMore`) once every loaded row is shown.
 * A promise from `onLoadMore` counts as loading until it settles; after a rejection the table
 * stops asking until the rows change, so a failing request is never repeated in a loop.
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

  const reachEnd = () => {
    if (hasInternalMore) {
      setRevealed(visibleCount + Math.max(1, batchSize));
      return;
    }
    const request = onLoadMore?.();
    if (!isPromiseLike(request)) return;
    setPending(true);
    Promise.resolve(request).then(
      () => setPending(false),
      () => {
        setPending(false);
        setFailedAt(totalRows);
      },
    );
  };

  // A reveal or a new batch is a new round: a sentinel still in view reports again.
  const { sentinelRef } = useLoadMore({
    enabled: hasInternalMore || canRequestMore,
    onLoadMore: reachEnd,
    scrollRef,
    round: `${visibleCount}/${totalRows}`,
    rootMargin: INFINITE_ROOT_MARGIN,
  });

  return {
    visibleCount,
    hasInternalMore,
    canRequestMore,
    loading: loadingMore || pending,
    sentinelRef,
  };
}
