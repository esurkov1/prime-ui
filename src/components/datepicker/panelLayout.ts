import * as React from "react";

import { readCssLengthPx } from "@/hooks/usePosition";
import type { ControlSize } from "@/internal/states";

/** Panel geometry in px, the same numbers the CSS lays out with. */
export type PanelMetrics = {
  /** Day cell: `--prime-control-<tier>-item-height`. */
  cell: number;
  /** Gap between months: `--prime-space-6`. */
  monthsGap: number;
  /** Side padding of `.main` (both sides): `space-3` in the popover, none embedded (the host pads). */
  chrome: number;
};

/** Reads the panel geometry from the tokens on the document (theme and app overrides apply). */
export function readPanelMetrics(size: ControlSize, embedded: boolean): PanelMetrics {
  return {
    cell: readCssLengthPx(`--prime-control-${size}-item-height`, 0),
    monthsGap: readCssLengthPx("--prime-space-6", 0),
    chrome: embedded ? 0 : readCssLengthPx("--prime-space-3", 0) * 2,
  };
}

export type PanelLayoutInput = {
  /** Requested months (`months` prop). */
  months: 1 | 2;
  hasPresets: boolean;
  /** Embedded panel (`Datepicker.Panel`), not the popover of `Datepicker.Root`. */
  embedded: boolean;
  /** Available inline size in px; `null` — not measured yet (assume it fits). */
  available: number | null;
  metrics: PanelMetrics;
};

export type PanelLayout = { monthCount: 1 | 2; presetsAside: boolean; compact: boolean };

/**
 * 1 vs 2 months, presets aside vs stacked, compact cells — from the space AVAILABLE to the panel
 * (the parent's content box for an embedded panel, the viewport for the popover). The panel's own
 * width never feeds back into the decision, so there is no resize loop. Without readable tokens
 * (no stylesheet yet) everything is assumed to fit.
 */
export function resolvePanelLayout({
  months,
  hasPresets,
  embedded,
  available,
  metrics,
}: PanelLayoutInput): PanelLayout {
  const room = metrics.cell > 0 ? available : null;
  const month = metrics.cell * 7;
  const monthsWidth = (n: 1 | 2) => month * n + (n === 2 ? metrics.monthsGap : 0);
  const fits = (px: number) => room == null || room >= px;
  const monthCount: 1 | 2 = months === 2 && fits(monthsWidth(2) + metrics.chrome) ? 2 : 1;
  // The presets column: five cells and a hairline.
  const presetsAside =
    hasPresets && fits(monthsWidth(monthCount) + metrics.chrome + metrics.cell * 5 + 1);
  // An embedded panel narrower than one month with its padding: cells shrink, padding tightens.
  const compact = embedded && room != null && room < monthsWidth(1) + metrics.chrome;
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
