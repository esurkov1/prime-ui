import * as React from "react";

import { remToPx } from "@/internal/layoutPxFromPrimitives";
import type { ControlSize } from "@/internal/states";
import { primitiveTokens } from "../../../tokens/primitives";

/** Day cell = `--prime-control-<tier>-item-height` (4 px grid steps). */
const CELL_STEPS = { xs: 6, s: 7, m: 8, l: 9, xl: 10 } as const satisfies Record<
  ControlSize,
  keyof typeof primitiveTokens.space
>;

/** Buttons and fields inside the panel sit one tier below the panel (m → s, 32 = the day cell). */
export const STEP_DOWN: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

/** Layout in px from the tokens (`space.*`), so JS decisions match the CSS. */
function panelMetrics(size: ControlSize, embedded: boolean) {
  const space = (n: keyof typeof primitiveTokens.space) => remToPx(primitiveTokens.space[n]);
  const cell = space(CELL_STEPS[size]);
  return {
    month: cell * 7,
    /** Gap between months (`--prime-space-6`). */
    monthsGap: space(6),
    /** Side padding of `.main`: `space-3` × 2 in the popover, the card's `space-4` × 2 embedded. */
    chrome: (embedded ? space(4) : space(3)) * 2,
    /** The presets column: 5 cells + a hairline. */
    presets: cell * 5 + 1,
  };
}

export type PanelLayoutInput = {
  size: ControlSize;
  /** Requested months (`months` prop). */
  months: 1 | 2;
  hasPresets: boolean;
  /** Embedded panel (`Datepicker.Panel`), not the popover of `Datepicker.Root`. */
  embedded: boolean;
  /** Available inline size in px; `null` — not measured yet (assume it fits). */
  available: number | null;
};

export type PanelLayout = { monthCount: 1 | 2; presetsAside: boolean; compact: boolean };

/**
 * 1 vs 2 months, presets aside vs stacked, compact cells — from the space AVAILABLE to the panel
 * (the parent's content box for an embedded panel, the viewport for the popover). The panel's own
 * width never feeds back into the decision, so there is no resize loop.
 */
export function resolvePanelLayout({
  size,
  months,
  hasPresets,
  embedded,
  available,
}: PanelLayoutInput): PanelLayout {
  const metrics = panelMetrics(size, embedded);
  const monthsWidth = (n: 1 | 2) => metrics.month * n + (n === 2 ? metrics.monthsGap : 0);
  const fits = (px: number) => available == null || available >= px;
  const monthCount: 1 | 2 = months === 2 && fits(monthsWidth(2) + metrics.chrome) ? 2 : 1;
  const presetsAside =
    hasPresets && fits(monthsWidth(monthCount) + metrics.chrome + metrics.presets);
  // An embedded panel narrower than one month with its padding: cells shrink, padding tightens.
  const compact = embedded && available != null && available < monthsWidth(1) + metrics.chrome;
  return { monthCount, presetsAside, compact };
}

/** Window width (px) — for the popover panel, which cannot measure itself. */
export function useViewportWidth(enabled: boolean): number | null {
  const [width, setWidth] = React.useState<number | null>(() =>
    typeof window === "undefined" ? null : window.innerWidth,
  );
  React.useEffect(() => {
    if (!enabled) return;
    const sync = () => setWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [enabled]);
  return enabled ? width : null;
}

/**
 * Available width of an embedded panel: the content box of its PARENT (ResizeObserver), not the
 * panel's own width (that follows the content) — otherwise «1 or 2 months» would loop. `null` —
 * not measured yet.
 */
export function useAvailableWidth(node: HTMLElement | null): number | null {
  const [width, setWidth] = React.useState<number | null>(null);
  React.useEffect(() => {
    const parent = node?.parentElement;
    if (!parent || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, [node]);
  return width;
}

/** Whether the element itself can scroll in the wheel's direction. */
function canScroll(el: HTMLElement, deltaY: number): boolean {
  const { overflowY } = getComputedStyle(el);
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  if (el.scrollHeight <= el.clientHeight) return false;
  return deltaY < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight;
}

/**
 * The wheel over an open calendar does not scroll the page under it; scrolling areas inside (the
 * presets list) work as usual.
 */
export function useContainScroll(node: HTMLElement | null) {
  React.useEffect(() => {
    if (!node) return;
    // The boundary is the whole popover: it scrolls itself when the calendar is taller than the viewport.
    const boundary = node.closest<HTMLElement>('[role="dialog"]') ?? node;
    const onWheel = (event: WheelEvent) => {
      for (let el = event.target as HTMLElement | null; el; el = el.parentElement) {
        if (canScroll(el, event.deltaY)) return;
        if (el === boundary) break;
      }
      event.preventDefault();
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [node]);
}
