import * as React from "react";

import { useEscapeKey } from "@/hooks/useEscapeKey";

function shouldBlockEnterConfirm(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }
  const el = target;
  if (el.isContentEditable) {
    return true;
  }
  if (el.closest('[contenteditable="true"]')) {
    return true;
  }
  const tag = el.tagName;
  if (tag === "TEXTAREA") {
    return true;
  }
  if (tag === "SELECT") {
    return true;
  }
  if (tag === "INPUT") {
    const { type } = el as HTMLInputElement;
    return (
      type === "checkbox" ||
      type === "radio" ||
      type === "file" ||
      type === "button" ||
      type === "submit" ||
      type === "reset"
    );
  }
  return false;
}

export type UseModalKeyboardOptions = {
  open: boolean;
  trapRef: React.RefObject<HTMLElement | null>;
  closeOnEscape: boolean;
  onClose: () => void;
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
  /** Целевой элемент подтверждения (кнопка из `Modal.Footer` `primary`). */
  primaryRef: React.RefObject<HTMLElement | null>;
};

/** Escape + Enter для `role="dialog"`: Escape закрывает; Enter имитирует `click()` по `primaryRef`. */
export function useModalKeyboard({
  open,
  trapRef,
  closeOnEscape,
  onClose,
  confirmOnEnter,
  onEnterConfirm,
  primaryRef,
}: UseModalKeyboardOptions) {
  useEscapeKey({ enabled: closeOnEscape && open, onEscape: onClose });

  React.useEffect(() => {
    if (!open || !confirmOnEnter) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) {
        return;
      }

      const container = trapRef.current;
      if (!container) {
        return;
      }

      const active = document.activeElement;
      if (!active || !container.contains(active)) {
        return;
      }

      const header = container.querySelector("header");
      if (header && event.target instanceof Node && header.contains(event.target)) {
        return;
      }

      if (shouldBlockEnterConfirm(event.target)) {
        return;
      }

      if (onEnterConfirm) {
        onEnterConfirm(event);
        return;
      }

      const primary = primaryRef.current;
      if (!primary) {
        return;
      }

      if (active === primary) {
        return;
      }

      event.preventDefault();
      primary.click();
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, confirmOnEnter, onEnterConfirm, primaryRef, trapRef]);
}
