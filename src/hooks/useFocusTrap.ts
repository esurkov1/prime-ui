import * as React from "react";

const FOCUSABLE_SELECTORS = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((el) => {
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

type UseFocusTrapOptions = {
  enabled: boolean;
  /** Whether to restore focus to the previously focused element on disable */
  restoreFocus?: boolean;
  /** Element to focus initially; falls back to first focusable element */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Traps keyboard focus inside a container element.
 * Tab cycles forward through focusable elements, Shift+Tab cycles backward.
 * Shared by Modal.Content, Select.Content, Dropdown.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions,
): React.RefObject<T | null> {
  const { enabled, restoreFocus = true, initialFocusRef } = options;
  const containerRef = React.useRef<T | null>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable
    const toFocus = initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
    (toFocus as HTMLElement).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [enabled, restoreFocus, initialFocusRef]);

  return containerRef;
}
