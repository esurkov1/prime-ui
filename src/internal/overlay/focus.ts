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
 * the first match of `first` (a menu's first enabled item, which is no tab stop of its own), else
 * `[data-autofocus]`, else the first tab stop, else the container itself.
 */
export function focusInto(container: HTMLElement, first?: string): void {
  if (container.contains(document.activeElement)) return;
  const target =
    (first ? container.querySelector<HTMLElement>(first) : null) ??
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

/** Nothing holds focus: the document body (or nothing at all) is the active element. */
function focusLost(): boolean {
  const active = document.activeElement;
  return active === null || active === document.body;
}

/**
 * Focuses `el` when it is still in the document. `quiet` — the layer was opened with a pointer:
 * focus returns without the focus ring, also when a key (Escape) closed the layer; the next key
 * brings the ring back. When `el` is gone (the row that opened a menu was deleted), focus goes to
 * the first tab stop of the page instead, so it is never lost and the next Tab starts from a known
 * place.
 */
export function focusBack(el: HTMLElement | null | undefined, quiet = false): void {
  if (typeof document === "undefined") return;
  const target = el?.isConnected ? el : getFocusable(document.body)[0];
  if (!target) return;
  if (quiet) quietRing(target);
  // `focusVisible` is a FocusOptions field newer than the DOM typings.
  target.focus({ preventScroll: true, ...(quiet ? { focusVisible: false } : {}) } as FocusOptions);
}

/**
 * Hands focus from a part that is about to leave to the part that takes its place (a region that
 * swaps state, a dismissed message, an item moved to another place): only when `leaving` holds
 * focus, or held it and is already gone with focus lost to the body. `next` is focused itself when
 * it is a tab stop; a container gets focus on its `[data-autofocus]`, else its first tab stop,
 * else itself (made programmatically focusable, `tabindex="-1"`). Without a `next` in the document,
 * focus goes to the first tab stop of the page. Returns whether focus moved.
 */
export function handoffFocus(
  leaving: Element | null | undefined,
  next: HTMLElement | null | undefined,
): boolean {
  if (typeof document === "undefined" || !leaving) return false;
  const held = leaving.isConnected ? leaving.contains(document.activeElement) : focusLost();
  if (!held) return false;
  const target = next?.isConnected ? focusTarget(next) : getFocusable(document.body)[0];
  if (!target) return false;
  target.focus({ preventScroll: true });
  return document.activeElement === target;
}

/**
 * The tab stop that takes the place of `el` when it leaves the page (a dismissed banner, a closed
 * toast): the first one after it in document order, else the last one before it. Tab stops inside
 * `el` do not count.
 */
export function tabStopBeside(el: Element): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const outside = getFocusable(document.body).filter((node) => !el.contains(node));
  const after = outside.find(
    (node) => el.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  return after ?? outside.at(-1) ?? null;
}

/** Where focus lands in `container`: itself when a tab stop, else as `handoffFocus` describes. */
function focusTarget(container: HTMLElement): HTMLElement {
  if (container.matches(FOCUSABLE) || container.isContentEditable) return container;
  const inner =
    container.querySelector<HTMLElement>("[data-autofocus]") ?? getFocusable(container)[0];
  if (inner) return inner;
  if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
  return container;
}

/** A press this recent opened the layer; an older one did not (a key did). */
const PRESS_OPENS_MS = 1000;

/**
 * The last press: when, the element it landed on and the control around it (Safari does not focus
 * a clicked button).
 */
let press: { control: HTMLElement | null; target: Element | null; time: number } | null = null;

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest<HTMLElement>(`${NATIVE_TAB_STOP}, ${FOCUSABLE}`) ?? null;
      press = { control, target, time: performance.now() };
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

/**
 * Who opened a layer, to return focus to on close: `element` — the control (or the focused
 * element); `target` — the exact element a press landed on (a picture inside a link, for a layer
 * that grows out of it), `null` after a key; `byPointer` — a pointer did it.
 */
export type Opener = { element: HTMLElement | null; target: Element | null; byPointer: boolean };

/**
 * The opener of a layer, read while rendering the open transition (before a child `autoFocus`
 * moves focus in). After a press: the control pressed — a click leaves focus elsewhere in Safari
 * (the body, or a `tabindex="-1"` region around the button) — the element pressed, and
 * `byPointer`, so focus goes back without a focus ring. After a key: the focused element, and the
 * ring shows.
 */
export function captureOpener(): Opener {
  const active = activeElement();
  if (press && performance.now() - press.time < PRESS_OPENS_MS) {
    const { control, target } = press;
    const element =
      control?.isConnected && !(active && control.contains(active)) ? control : active;
    return { element, target: target?.isConnected ? target : null, byPointer: true };
  }
  return { element: active, target: null, byPointer: false };
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
