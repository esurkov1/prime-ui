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

/** Keys that only modify another: they do not count as the person turning to the keyboard. */
const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);

/**
 * Hides the focus ring of `el` until the person turns to the keyboard or focus leaves: the
 * `data-focus-quiet` attribute makes `--prime-color-focus-ring` transparent (globals.css), which
 * every ring of the kit is drawn with — whatever the browser decides about `:focus-visible`.
 */
function quietRing(el: HTMLElement): void {
  el.setAttribute("data-focus-quiet", "");
  const clear = () => {
    el.removeAttribute("data-focus-quiet");
    el.removeEventListener("blur", clear);
    document.removeEventListener("keydown", onKey, true);
  };
  const onKey = (event: KeyboardEvent) => {
    if (!MODIFIERS.has(event.key)) clear();
  };
  el.addEventListener("blur", clear);
  document.addEventListener("keydown", onKey, true);
}

/**
 * Focuses `el` when it is still in the document. `quiet` — the layer was opened with a pointer:
 * focus returns without the focus ring, also when a key (Escape) closed the layer; the next key
 * brings the ring back.
 */
export function focusBack(el: HTMLElement | null | undefined, quiet = false): void {
  if (!el?.isConnected) return;
  if (quiet) quietRing(el);
  // `focusVisible` is a FocusOptions field newer than the DOM typings.
  el.focus({ preventScroll: true, ...(quiet ? { focusVisible: false } : {}) } as FocusOptions);
}

/** A press this recent opened the layer; an older one did not (a key did). */
const PRESS_OPENS_MS = 1000;

/** The last press: when, and the control it landed on (Safari does not focus a clicked button). */
let press: { control: HTMLElement | null; time: number } | null = null;

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest<HTMLElement>(`${NATIVE_TAB_STOP}, ${FOCUSABLE}`) ?? null;
      press = { control, time: performance.now() };
    },
    true,
  );
  // A key after the press is what acts next (Enter on a focused button): the press no longer counts.
  document.addEventListener(
    "keydown",
    () => {
      press = null;
    },
    true,
  );
}

/** Who opened a layer, to return focus to on close, and whether a pointer did it. */
export type Opener = { element: HTMLElement | null; byPointer: boolean };

/**
 * The opener of a layer, read while rendering the open transition (before a child `autoFocus`
 * moves focus in). After a press: the control pressed — a click leaves focus elsewhere in Safari
 * (the body, or a `tabindex="-1"` region around the button) — and `byPointer`, so focus goes
 * back without a focus ring. After a key: the focused element, and the ring shows.
 */
export function captureOpener(): Opener {
  const active = activeElement();
  if (press && performance.now() - press.time < PRESS_OPENS_MS) {
    const { control } = press;
    const element =
      control?.isConnected && !(active && control.contains(active)) ? control : active;
    return { element, byPointer: true };
  }
  return { element: active, byPointer: false };
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

/**
 * Focus is in a part that is going away (a region's old state, a dismissed message), still in the
 * document: it moves to `next` — its `[data-autofocus]`, else its first tab stop, else `next`
 * itself (made focusable with `tabindex="-1"`) — so it never falls to the page. Call it before the
 * part leaves the document. Does nothing when focus is elsewhere; returns whether focus moved.
 */
export function handoffFocus(leaving: Element | null, next: HTMLElement | null): boolean {
  if (!leaving || !next?.isConnected || !leaving.contains(document.activeElement)) return false;
  const target =
    next.querySelector<HTMLElement>("[data-autofocus]") ?? getFocusable(next)[0] ?? next;
  if (target === next && !next.hasAttribute("tabindex")) next.tabIndex = -1;
  target.focus({ preventScroll: true });
  return true;
}
