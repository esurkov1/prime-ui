export type ThemeScheme = "light" | "dark";

/** Attribute that turns transitions off while a theme switch is painted (see globals.css). */
export const THEME_SWITCHING_ATTRIBUTE = "data-theme-switching";

/**
 * Freezes transitions on `element` and its subtree for the frame in which the theme changes.
 * Without it every element with a color transition would interpolate from the old theme's
 * colors and visibly blink. Call it right before the theme attribute changes.
 */
export function suspendTransitions(element: HTMLElement): void {
  element.setAttribute(THEME_SWITCHING_ATTRIBUTE, "");
  // Two frames: the first paints the new theme without transitions, the second re-enables them.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => element.removeAttribute(THEME_SWITCHING_ATTRIBUTE));
  });
}

/**
 * Switches the theme instantly: sets `data-theme` on `element` (default `<html>`) with transitions
 * suspended for that frame. Use it instead of setting the attribute by hand.
 */
export function applyTheme(
  scheme: ThemeScheme,
  element: HTMLElement = document.documentElement,
): void {
  if (element.getAttribute("data-theme") === scheme) return;
  suspendTransitions(element);
  element.setAttribute("data-theme", scheme);
}
