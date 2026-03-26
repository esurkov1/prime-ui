import type * as React from "react";

import { useEscapeKey } from "./useEscapeKey";
import { useFocusTrap } from "./useFocusTrap";
import { useScrollLock } from "./useScrollLock";

/**
 * Общий слой для модальных оверлеев (Sidebar narrow, Drawer и т.д.):
 * ловушка фокуса, блокировка прокрутки документа, Escape.
 */
export function useOverlayModal<T extends HTMLElement = HTMLElement>(
  enabled: boolean,
  onClose: () => void,
): React.RefObject<T | null> {
  const trapRef = useFocusTrap<T>({ enabled });
  useScrollLock(enabled);
  useEscapeKey({ enabled, onEscape: onClose });
  return trapRef;
}
