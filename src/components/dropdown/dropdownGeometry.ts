import { getPanelOffsetPx, getViewportPadPx, type PositionSide } from "@/hooks/usePosition";

export const DROPDOWN_MIN_MAX_HEIGHT = 120;

/**
 * Максимальная высота панели по якорю и выбранной стороне (до commit layout панели).
 * `panelOffsetPx` / `viewportPadPx` должны совпадать с вызовом `computeFloatingPosition`.
 */
export function getDropdownMaxHeightForAnchorSide(
  anchor: DOMRectReadOnly,
  side: PositionSide,
  viewportHeight: number,
  panelOffsetPx: number,
  viewportPadPx: number,
): number {
  const raw =
    side === "bottom"
      ? viewportHeight - anchor.bottom - panelOffsetPx - viewportPadPx
      : anchor.top - panelOffsetPx - viewportPadPx;
  return Math.floor(Math.max(DROPDOWN_MIN_MAX_HEIGHT, raw));
}

export function getDropdownPanelOffsetPx(): number {
  return getPanelOffsetPx();
}

export function getDropdownViewportPadPx(): number {
  return getViewportPadPx();
}
