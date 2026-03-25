import type { PositionSide } from "@/hooks/usePosition";
import {
  getFloatingPanelOffsetPx,
  getFloatingViewportPadPx,
} from "@/internal/layoutPxFromPrimitives";

export const POPOVER_MIN_MAX_HEIGHT = 120;

export function getPopoverMaxHeightForAnchorSide(
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
  return Math.floor(Math.max(POPOVER_MIN_MAX_HEIGHT, raw));
}

export function getPopoverPanelOffsetPx(): number {
  return getFloatingPanelOffsetPx();
}

export function getPopoverViewportPadPx(): number {
  return getFloatingViewportPadPx();
}
