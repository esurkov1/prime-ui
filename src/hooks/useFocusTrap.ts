import * as React from "react";

import { isPointerDismiss } from "./useOutsideClick";

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

/**
 * Active traps, innermost last. Only the top trap handles Tab, so a Dropdown or nested Drawer
 * opened from inside a Modal keeps focus without the outer trap pulling it back.
 */
const trapStack: symbol[] = [];

/**
 * Last element that lost focus. When `autoFocus` inside the container moved focus before the
 * trap effect ran, this is the opener that should get focus back on close.
 */
let lastBlurred: HTMLElement | null = null;
let blurTrackingInstalled = false;

function ensureBlurTracking() {
  if (blurTrackingInstalled || typeof document === "undefined") return;
  blurTrackingInstalled = true;
  document.addEventListener(
    "focusout",
    (event) => {
      if (event.target instanceof HTMLElement) {
        lastBlurred = event.target;
      }
    },
    true,
  );
}

type UseFocusTrapOptions = {
  enabled: boolean;
  /** Whether to restore focus to the previously focused element on disable */
  restoreFocus?: boolean;
  /**
   * Element to focus initially. Without it the trap keeps focus that is already inside the
   * container (e.g. `autoFocus`), then tries `[data-autofocus]`, then the first focusable element,
   * then the container itself.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Traps keyboard focus inside a container element.
 * Tab cycles forward through focusable elements, Shift+Tab cycles backward.
 * Shared by Modal (panel), Drawer, Sidebar (mobile), Select.Content, Dropdown, Popover.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions,
): React.RefObject<T | null> {
  const { enabled, restoreFocus = true, initialFocusRef } = options;
  const containerRef = React.useRef<T | null>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  // Installed on render (before any commit) so the opener is recorded even when a child
  // `autoFocus` steals focus in the same commit that mounts the container.
  ensureBlurTracking();

  React.useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const layer = Symbol("focus-trap");
    trapStack.push(layer);

    // React applies `autoFocus` during commit, before this effect: then the opener is the element
    // that just lost focus rather than the active one.
    const active = document.activeElement as HTMLElement | null;
    const focusAlreadyInside = active != null && container.contains(active);
    previousFocusRef.current = focusAlreadyInside
      ? lastBlurred && !container.contains(lastBlurred)
        ? lastBlurred
        : null
      : active;

    if (!focusAlreadyInside) {
      const toFocus =
        initialFocusRef?.current ??
        container.querySelector<HTMLElement>("[data-autofocus]") ??
        getFocusableElements(container)[0] ??
        container;
      toFocus.focus({ preventScroll: true });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      if (trapStack[trapStack.length - 1] !== layer) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !container.contains(current)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const index = trapStack.lastIndexOf(layer);
      if (index !== -1) {
        trapStack.splice(index, 1);
      }
      const previous = previousFocusRef.current;
      // Dismissed by a press outside: focus follows the pointer, not back to the opener.
      if (restoreFocus && previous?.isConnected && !isPointerDismiss()) {
        // Modal / Drawer make the page inert in a sibling effect whose cleanup runs after this
        // one; focusing an inert opener is a no-op, so wait until the same commit lifts it.
        if (previous.closest("[inert]")) {
          queueMicrotask(() => {
            if (previous.isConnected) previous.focus({ preventScroll: true });
          });
        } else {
          previous.focus({ preventScroll: true });
        }
      }
    };
  }, [enabled, restoreFocus, initialFocusRef]);

  return containerRef;
}
