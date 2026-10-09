const NATIVE_FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
];

const FOCUSABLE = [...NATIVE_FOCUSABLE, "[tabindex]"]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(", ");

const NATIVE_TAB_STOP = NATIVE_FOCUSABLE.join(", ");

/** Tab stops inside `container`, in DOM order (hidden and `aria-hidden` ones skipped). */
export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

/**
 * The element is, or holds, a tab stop by nature (a native control, a link, editable text): focus
 * reaches it without an added `tabindex`.
 */
export function hasNativeTabStop(el: HTMLElement): boolean {
  return (
    el.matches(NATIVE_TAB_STOP) ||
    el.isContentEditable ||
    el.querySelector(NATIVE_TAB_STOP) !== null
  );
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

/** A press this recent opened the layer; an older one did not (a key did). */
const PRESS_OPENS_MS = 1000;

/** The control the person last pressed: Safari does not focus a button on a click. */
let pressed: { control: HTMLElement; time: number } | null = null;

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest<HTMLElement>(`${NATIVE_TAB_STOP}, ${FOCUSABLE}`) ?? null;
      pressed = control ? { control, time: performance.now() } : null;
    },
    true,
  );
}

/**
 * The element that opened a layer, to return focus to on close: the control just pressed — a
 * click leaves focus elsewhere in Safari (on the body, or on a `tabindex="-1"` region around the
 * button, which would then show its focus ring) — else the element focused right now. Read while
 * rendering the open transition, before a child `autoFocus` moves focus into the new layer.
 */
export function openerElement(): HTMLElement | null {
  const active = activeElement();
  if (
    pressed?.control.isConnected &&
    performance.now() - pressed.time < PRESS_OPENS_MS &&
    !(active && pressed.control.contains(active))
  ) {
    return pressed.control;
  }
  return active;
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
