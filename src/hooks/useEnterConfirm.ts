import * as React from "react";

/**
 * Keys where Enter belongs to the focused element: its own activation (buttons, links), a new line,
 * a native picker or a toggle.
 */
function ownsEnter(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target.closest('[contenteditable="true"]')) return true;
  if (target.matches('button, a[href], [role="button"], textarea, select')) return true;
  if (target instanceof HTMLInputElement) {
    return ["checkbox", "radio", "file", "button", "submit", "reset"].includes(target.type);
  }
  return false;
}

export type UseEnterConfirmOptions = {
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Replaces the default (a `click()` on `confirmRef`). */
  onEnterConfirm?: (event: KeyboardEvent) => void;
  /** The confirm target (the primary button wrapped in `Modal.Confirm`). */
  confirmRef: React.RefObject<HTMLElement | null>;
};

/**
 * Enter inside a dialog clicks its confirm action — from a text field or the dialog itself. Enter on
 * a button, link or `role="button"` activates that element instead (Enter on Cancel cancels), and
 * the header (close button) is left alone.
 */
export function useEnterConfirm({
  enabled,
  containerRef,
  onEnterConfirm,
  confirmRef,
}: UseEnterConfirmOptions) {
  React.useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat || event.defaultPrevented) return;
      const container = containerRef.current;
      const target = event.target instanceof Node ? event.target : null;
      if (!container || !target || !container.contains(target)) return;
      if (container.querySelector("header")?.contains(target)) return;
      if (ownsEnter(target)) return;

      if (onEnterConfirm) {
        onEnterConfirm(event);
        return;
      }
      const confirm = confirmRef.current;
      if (!confirm) return;
      event.preventDefault();
      confirm.click();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, onEnterConfirm, confirmRef, containerRef]);
}
