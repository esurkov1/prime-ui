import * as React from "react";

/**
 * Клик по listbox Select в портале: триггер комбобокса лежит внутри `container`
 * (например панель Dropdown), иначе useOutsideClick закроет родителя.
 */
export function isPortaledSelectListboxOwnedByContainer(
  target: EventTarget | null,
  container: HTMLElement | null,
): boolean {
  if (!(target instanceof Element) || !container) {
    return false;
  }
  const listbox = target.closest('[role="listbox"][data-react-aria-top-layer="true"]');
  if (!listbox) {
    return false;
  }
  const triggerId = listbox.getAttribute("aria-labelledby")?.trim().split(/\s+/)[0];
  if (!triggerId) {
    return false;
  }
  const trigger = listbox.ownerDocument.getElementById(triggerId);
  return Boolean(trigger && container.contains(trigger));
}

type UseOutsideClickParams = {
  refs: Array<React.RefObject<HTMLElement | null>>;
  enabled: boolean;
  onOutsideClick: (event: MouseEvent | TouchEvent) => void;
  /** Если вернёт true, клик не считается «снаружи» (порталы внутри refs) */
  shouldSuppressOutsideClick?: (target: EventTarget | null) => boolean;
};

export function useOutsideClick({
  refs,
  enabled,
  onOutsideClick,
  shouldSuppressOutsideClick,
}: UseOutsideClickParams) {
  const suppressRef = React.useRef(shouldSuppressOutsideClick);
  suppressRef.current = shouldSuppressOutsideClick;

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const hasClickedOutside = (target: EventTarget | null) =>
      refs.every((ref) => {
        const node = ref.current;
        return !node || !target || !node.contains(target as Node);
      });

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (suppressRef.current?.(event.target)) {
        return;
      }
      if (hasClickedOutside(event.target)) {
        onOutsideClick(event);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [enabled, onOutsideClick, refs]);
}
