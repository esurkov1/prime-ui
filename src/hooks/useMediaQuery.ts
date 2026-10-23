import * as React from "react";

/**
 * Whether a media query matches, kept in sync with the viewport. Pass a named query of the kit
 * (`COMPACT_QUERY` — below 640px, where Drawer and the other overlays go full width or become
 * sheets; `OFF_CANVAS_QUERY` — below 768px; `TOUCH_QUERY`, `HOVER_QUERY`, `REDUCED_MOTION_QUERY`)
 * or any media query string. `false` on the server, while `enabled` is off, and where
 * `matchMedia` is missing.
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
