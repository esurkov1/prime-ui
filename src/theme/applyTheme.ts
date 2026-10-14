export type ThemeScheme = "light" | "dark";

/** Attribute that sets every motion clock to 0 while a theme switch is painted (see globals.css). */
export const THEME_SWITCHING_ATTRIBUTE = "data-theme-switching";

/**
 * Paints a theme change on `element` and its subtree with no transition: every motion clock is 0
 * while `change` runs and the styles are flushed, then the clocks come back in the same task, so
 * nothing interpolates from the old theme's colors. `change` sets the theme attribute; without it,
 * call this right after the attribute changed (before the browser paints).
 */
export function suspendTransitions(element: HTMLElement, change?: () => void): void {
  element.setAttribute(THEME_SWITCHING_ATTRIBUTE, "");
  change?.();
  // Reading layout flushes the styles: the new colors are computed with the clocks at 0.
  void element.offsetHeight;
  element.removeAttribute(THEME_SWITCHING_ATTRIBUTE);
}

/**
 * Switches the theme instantly: sets `data-theme` on `element` (default `<html>`) with transitions
 * suspended. Use it instead of setting the attribute by hand.
 */
export function applyTheme(
  scheme: ThemeScheme,
  element: HTMLElement = document.documentElement,
): void {
  if (element.getAttribute("data-theme") === scheme) return;
  suspendTransitions(element, () => element.setAttribute("data-theme", scheme));
}
