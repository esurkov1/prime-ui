const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]",
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(", ");

/** Tab stops inside `container`, in DOM order (hidden and `aria-hidden` ones skipped). */
export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

/**
 * Moves focus into a layer that just opened, unless focus is already inside (a child `autoFocus`):
 * `[data-autofocus]`, else the first tab stop, else the container itself.
 */
export function focusInto(container: HTMLElement): void {
  if (container.contains(document.activeElement)) return;
  const target =
    container.querySelector<HTMLElement>("[data-autofocus]") ??
    getFocusable(container)[0] ??
    container;
  target.focus({ preventScroll: true });
}

/** Focuses `el` when it is still in the document. */
export function focusBack(el: HTMLElement | null | undefined): void {
  if (el?.isConnected) el.focus({ preventScroll: true });
}

/**
 * The element focused right now — read while rendering the open transition, before a child
 * `autoFocus` moves focus into the new layer, so it is the opener to return to on close.
 */
export function activeElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const el = document.activeElement;
  return el instanceof HTMLElement && el !== document.body ? el : null;
}
