/**
 * Fallback without a `document` (SSR) or when `getComputedStyle` gives no valid px
 * (matches the usual `:root` `font-size` in `globals`).
 */
const FALLBACK_ROOT_FONT_PX = 16;

/**
 * The computed root (`html`) `font-size` in px: converts rem primitives to pixels for floating UI
 * and SVG without assuming 16.
 */
export function getRootFontSizePx(): number {
  if (typeof document === "undefined") {
    return FALLBACK_ROOT_FONT_PX;
  }
  const raw = getComputedStyle(document.documentElement).fontSize;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : FALLBACK_ROOT_FONT_PX;
}

export function remToPx(rem: string, rootPx: number = getRootFontSizePx()): number {
  const n = Number.parseFloat(rem);
  return Number.isFinite(n) ? Math.round(n * rootPx) : 0;
}
