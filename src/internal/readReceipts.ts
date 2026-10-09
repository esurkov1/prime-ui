/**
 * Read receipts of a list: reports each registered element once, when it has been seen — at least
 * half of it inside the view (or half the view, for an element taller than the view) — while the
 * page is visible. Reports are batched: everything seen in one frame comes in one call.
 */
export type ReadReceipts = {
  observe: (element: Element, value: string) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
};

const NOOP: ReadReceipts = { observe: () => {}, unobserve: () => {}, disconnect: () => {} };

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

export function createReadReceipts(onRead: (values: string[]) => void): ReadReceipts {
  if (typeof IntersectionObserver === "undefined" || typeof document === "undefined") return NOOP;
  const values = new Map<Element, string>();
  const reported = new Set<string>();
  /** Seen while the page was hidden, or waiting for the next frame. */
  const seen = new Set<string>();
  let frame = 0;

  const flush = () => {
    frame = 0;
    if (document.visibilityState === "hidden" || seen.size === 0) return;
    const batch = Array.from(seen).filter((value) => !reported.has(value));
    seen.clear();
    for (const value of batch) reported.add(value);
    if (batch.length > 0) onRead(batch);
  };
  const schedule = () => {
    if (frame !== 0) return;
    frame =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(flush)
        : (setTimeout(flush, 16) as unknown as number);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const value = values.get(entry.target);
        if (value === undefined || reported.has(value)) continue;
        const view = entry.rootBounds?.height ?? 0;
        const shown =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.5 ||
            (view > 0 && entry.intersectionRect.height >= view / 2));
        if (shown) seen.add(value);
        else seen.delete(value);
      }
      if (seen.size > 0) schedule();
    },
    { threshold: THRESHOLDS },
  );

  const onVisibility = () => {
    if (document.visibilityState === "visible") schedule();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    observe(element, value) {
      if (reported.has(value)) return;
      values.set(element, value);
      observer.observe(element);
    },
    unobserve(element) {
      const value = values.get(element);
      if (value !== undefined) seen.delete(value);
      values.delete(element);
      observer.unobserve(element);
    },
    disconnect() {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame !== 0) {
        if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(frame);
        clearTimeout(frame);
      }
      values.clear();
      seen.clear();
    },
  };
}
