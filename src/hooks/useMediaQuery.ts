import * as React from "react";

/**
 * Whether a media query matches (the constants of `./breakpoints`), kept in sync with the viewport. `false` on the server, while
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
