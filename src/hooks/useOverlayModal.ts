import type * as React from "react";

import { useEscapeKey } from "./useEscapeKey";
import { useFocusTrap } from "./useFocusTrap";
import { useScrollLock } from "./useScrollLock";

/**
 * Shared mechanics of modal overlays (the off-canvas Sidebar, Drawer, …): focus trap, document
 * scroll lock, Escape.
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
