import type { PositionSide } from "@/hooks/usePosition";
import {
  getFloatingPanelOffsetPx,
  getFloatingViewportPadPx,
} from "@/internal/layoutPxFromPrimitives";

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
  return getFloatingPanelOffsetPx();
}

export function getDropdownViewportPadPx(): number {
  return getFloatingViewportPadPx();
}
