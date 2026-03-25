import { primitiveTokens } from "../../tokens/primitives";

/**
 * Fallback, если нет `document` (SSR) или `getComputedStyle` не дал валидный px
 * (должен совпадать с типичным `font-size` на `:root` в `globals`).
 */
const FALLBACK_ROOT_FONT_PX = 16;

/**
 * Текущий вычисленный `font-size` корня (`html`) в px — для перевода rem из примитивов
 * в пиксели floating UI / SVG без жёсткой привязки к 16.
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

/** Зазор панели от якоря: `spaces.layout.s`. */
export function getFloatingPanelOffsetPx(): number {
  return remToPx(primitiveTokens.spaces.layout.s);
}

/** Зазор listbox от триггера Select: `spaces.layout.xs`. */
export function getFloatingSelectListboxOffsetPx(): number {
  return remToPx(primitiveTokens.spaces.layout.xs);
}

/** Внутренний отступ от края вьюпорта при расчёте позиции / max-height. */
export function getFloatingViewportPadPx(): number {
  return remToPx(primitiveTokens.spaces.layout.s);
}
