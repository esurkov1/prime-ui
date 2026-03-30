import * as React from "react";

import { SIDEBAR_MEDIA_QUERY_NARROW } from "./sidebarLayout";

/**
 * Подписка на `(max-width: 47.999rem)` без рассинхрона с эффектом:
 * первый клиентский кадр совпадает с `matchMedia` (в т.ч. после гидрации).
 */
export function useSidebarNarrowViewport(enabled: boolean): boolean {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!enabled || typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const mq = window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [enabled],
  );

  const getSnapshot = React.useCallback(() => {
    if (!enabled || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW).matches;
  }, [enabled]);

  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
