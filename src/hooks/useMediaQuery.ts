import * as React from "react";

/** Viewport below the first breakpoint (foundation §9): overlays become bottom sheets. */
export const COMPACT_QUERY = "(max-width: 639px)";

/**
 * Whether a media query matches, kept in sync with the viewport. `false` on the server, while
 * `enabled` is off, and where `matchMedia` is missing.
 */
export function useMediaQuery(query: string, enabled = true): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!enabled || typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [enabled, query],
  );
  const getSnapshot = () =>
    enabled && typeof window !== "undefined" && !!window.matchMedia
      ? window.matchMedia(query).matches
      : false;
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
