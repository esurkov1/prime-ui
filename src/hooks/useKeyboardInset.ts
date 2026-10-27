import * as React from "react";

/**
 * A smaller gap between the layout and the visual viewport is browser chrome (a toolbar that
 * collapses) or the drift iOS 26 leaves after the keyboard closes, never an on-screen keyboard.
 */
const KEYBOARD_MIN_PX = 120;

/** Above this the visual viewport is a pinch-zoom lens over the page, not the keyboard's room. */
const ZOOMED_SCALE = 1.01;

/** The custom properties written on the panel (px), read by its CSS with a zero fallback. */
const TOP_VAR = "--visual-inset-top";
const BOTTOM_VAR = "--visual-inset-bottom";

const SCROLLS = new Set(["auto", "scroll", "overlay"]);

/** The nearest scroller between `node` and `panel` (inclusive) that has room to move. */
function scrollerOf(node: Element, panel: HTMLElement): HTMLElement | null {
  for (let el = node.parentElement; el; el = el.parentElement) {
    const { overflowY } = window.getComputedStyle(el);
    if (SCROLLS.has(overflowY) && el.scrollHeight > el.clientHeight) return el;
    if (el === panel) return null;
  }
  return null;
}

/** Scrolls the panel's own scroller (never the page) so the focused field is in view. */
function revealFocused(panel: HTMLElement) {
  const focused = document.activeElement;
  if (!(focused instanceof HTMLElement) || !panel.contains(focused)) return;
  const scroller = scrollerOf(focused, panel);
  if (!scroller) return;
  const box = scroller.getBoundingClientRect();
  const rect = focused.getBoundingClientRect();
  if (rect.bottom > box.bottom) scroller.scrollTop += rect.bottom - box.bottom;
  else if (rect.top < box.top) scroller.scrollTop -= box.top - rect.top;
}

/**
 * Keeps a panel fixed to the layout viewport (a bottom sheet, a drawer, a centred dialog) on the
 * part of the screen the on-screen keyboard leaves. iOS Safari and Chrome on Android (by default)
 * lay the page out at full height and only shrink the visual viewport, so `bottom: 0` lands under
 * the keyboard. While `panel` is given, this writes on it `--visual-inset-top` / `--visual-inset-bottom`
 * — how far the visual viewport stands in from the layout viewport's top and bottom edges — and
 * `data-keyboard` while a keyboard takes the bottom; the panel CSS moves its edges by them. When the
 * keyboard comes up, the panel's own scroller brings the focused field into view. A pinch-zoomed
 * page and a browser without `visualViewport` (or with `interactive-widget=resizes-content`, where
 * the layout viewport shrinks itself) leave the panel where it is.
 */
export function useKeyboardInset(panel: HTMLElement | null): void {
  React.useEffect(() => {
    const viewport = window.visualViewport;
    if (!panel || !viewport) return;
    let keyboard = false;
    let frame = 0;

    const update = () => {
      const zoomed = viewport.scale > ZOOMED_SCALE;
      const top = zoomed ? 0 : Math.max(0, Math.round(viewport.offsetTop));
      const gap = window.innerHeight - viewport.height - viewport.offsetTop;
      const bottom = zoomed || gap < KEYBOARD_MIN_PX ? 0 : Math.round(gap);
      panel.style.setProperty(TOP_VAR, `${bottom > 0 ? top : 0}px`);
      panel.style.setProperty(BOTTOM_VAR, `${bottom}px`);
      const opened = bottom > 0 && !keyboard;
      keyboard = bottom > 0;
      if (keyboard) panel.setAttribute("data-keyboard", "");
      else panel.removeAttribute("data-keyboard");
      // The panel has its new edges after this frame's layout; then the field is brought in.
      if (opened) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => revealFocused(panel));
      }
    };

    // A field focused while the keyboard is up (the next field) is brought in at once.
    const onFocusIn = () => {
      if (keyboard) revealFocused(panel);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    panel.addEventListener("focusin", onFocusIn);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      panel.removeEventListener("focusin", onFocusIn);
      panel.style.removeProperty(TOP_VAR);
      panel.style.removeProperty(BOTTOM_VAR);
      panel.removeAttribute("data-keyboard");
    };
  }, [panel]);
}
