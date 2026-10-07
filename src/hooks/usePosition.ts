import * as React from "react";

import { getRootFontSizePx } from "@/internal/layoutPxFromPrimitives";
import { getScrollContainers } from "@/internal/scrollAncestors";

export type PositionSide = "top" | "right" | "bottom" | "left";
export type PositionAlign = "start" | "center" | "end";

/**
 * Private custom properties written by `usePosition` on the floating element. Panels combine them
 * with tokens, e.g. `max-height: min(var(--prime-panel-max-height), var(--float-max-h))`, so the
 * design limit and the room next to the anchor both apply.
 */
export const FLOAT_MAX_HEIGHT_VAR = "--float-max-h";
/** Anchor width (px) when the panel should be at least as wide as its anchor. */
export const FLOAT_MIN_WIDTH_VAR = "--float-min-w";
/** Room across the main axis (px): a panel is never wider than the screen or its side. */
export const FLOAT_MAX_WIDTH_VAR = "--float-max-w";
/** Arrow centre along the layer edge that faces the anchor (px), when `arrowInset` is given. */
export const FLOAT_ARROW_VAR = "--float-arrow";

const MIN_MENU_ESTIMATE = 176;
const FALLBACK_VIEWPORT_PAD_PX = 8;
const FALLBACK_PANEL_OFFSET_PX = 4;
/** Smallest scroll height of a panel on a very small viewport. */
const MIN_FLOATING_MAX_HEIGHT = 120;
/** Before the layer has a height, a `top` panel is placed with a rough guess; the next frame fixes it. */
const FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX = 280;

const OPPOSITE: Record<PositionSide, PositionSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * Computed length of a CSS custom property on `:root` in px (rem/px values).
 * Falls back when there is no DOM / stylesheet (SSR, jsdom).
 */
export function readCssLengthPx(name: string, fallbackPx: number): number {
  if (typeof document === "undefined") return fallbackPx;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallbackPx;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return fallbackPx;
  if (raw.endsWith("rem")) return Math.round(n * getRootFontSizePx());
  if (raw.endsWith("px") || n === 0) return Math.round(n);
  return fallbackPx;
}

/** Minimum distance from a floating panel to the viewport edge: `--prime-space-2`. */
export function getViewportPadPx(): number {
  return readCssLengthPx("--prime-space-2", FALLBACK_VIEWPORT_PAD_PX);
}

export type ComputeFloatingOptions = {
  side: PositionSide;
  align: PositionAlign;
  /** Gap between the anchor and the layer (px). */
  offset: number;
  /** Minimum distance from the viewport edge (px); 8 by default. */
  viewportPad?: number;
  /** Flip to the opposite side (and edge) when the layer does not fit. */
  flip: boolean;
  matchAnchorWidth: boolean;
  /** Closest the arrow centre may come to a layer corner; computes `arrow` when set. */
  arrowInset?: number;
};

export type ComputedFloatPosition = {
  top: number;
  left: number;
  /** The side after flipping. */
  side: PositionSide;
  minWidth?: number;
  /** Room across: the viewport minus gutters (top / bottom) or the room on the side (left / right). */
  maxWidth: number;
  /** Room along the side the layer opened on (px). */
  maxHeight: number;
  /** Arrow centre along the edge facing the anchor (px from the layer's start). */
  arrow?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, Math.max(min, max)));

/**
 * Places a layer on `side` of the anchor: flips to the opposite side when it does not fit there
 * and does on the other (or has more room), aligns it along the cross axis (flipping the edge when
 * it overflows), keeps it inside the viewport and, with `arrowInset`, points an arrow at the
 * anchor's centre without leaving the layer's straight edge.
 */
export function computeFloatingPosition(
  anchor: Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "width" | "height">,
  contentW: number,
  contentH: number,
  vw: number,
  vh: number,
  opts: ComputeFloatingOptions,
): ComputedFloatPosition {
  const { align, offset, flip, matchAnchorWidth, arrowInset } = opts;
  const pad = opts.viewportPad ?? FALLBACK_VIEWPORT_PAD_PX;
  const room: Record<PositionSide, number> = {
    top: anchor.top - offset - pad,
    bottom: vh - anchor.bottom - offset - pad,
    left: anchor.left - offset - pad,
    right: vw - anchor.right - offset - pad,
  };
  const isVertical = (s: PositionSide) => s === "top" || s === "bottom";

  const mainSize = isVertical(opts.side) ? contentH : contentW;
  let side = opts.side;
  // Without a measured size there is nothing to compare: keep the requested side.
  if (flip && mainSize > 0 && room[side] < mainSize) {
    const opposite = OPPOSITE[side];
    if (room[opposite] >= mainSize || room[opposite] > room[side]) side = opposite;
  }
  const vertical = isVertical(side);

  const viewportMaxWidth = Math.max(0, Math.floor(vw - pad * 2));
  const maxWidth = vertical
    ? viewportMaxWidth
    : Math.max(0, Math.min(viewportMaxWidth, Math.floor(room[side])));
  const width = Math.min(
    maxWidth,
    contentW > 0
      ? contentW
      : matchAnchorWidth
        ? anchor.width
        : Math.max(anchor.width, MIN_MENU_ESTIMATE),
  );

  let main: number;
  if (side === "bottom") main = anchor.bottom + offset;
  else if (side === "right") main = anchor.right + offset;
  else if (side === "left") main = Math.max(pad, anchor.left - offset - width);
  else
    main = Math.max(
      pad,
      anchor.top - offset - (contentH > 0 ? contentH : FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX),
    );

  const anchorStart = vertical ? anchor.left : anchor.top;
  const anchorSize = vertical ? anchor.width : anchor.height;
  const crossSize = vertical ? width : contentH;
  const viewport = vertical ? vw : vh;
  const crossFor = (a: PositionAlign) =>
    a === "start"
      ? anchorStart
      : a === "end"
        ? anchorStart + anchorSize - crossSize
        : anchorStart + anchorSize / 2 - crossSize / 2;
  const fits = (x: number) => x >= pad && x + crossSize <= viewport - pad;
  let cross = crossFor(align);
  // Edge flip: does not fit from the chosen edge — try the opposite edge of the anchor.
  if (flip && !fits(cross)) {
    const opposite: PositionAlign = align === "end" ? "start" : align === "start" ? "end" : align;
    if (opposite !== align && fits(crossFor(opposite))) cross = crossFor(opposite);
  }
  cross = Math.round(clamp(cross, pad, viewport - crossSize - pad));

  const out: ComputedFloatPosition = {
    top: Math.round(vertical ? main : cross),
    left: Math.round(vertical ? cross : main),
    side,
    maxWidth,
    maxHeight: Math.max(MIN_FLOATING_MAX_HEIGHT, Math.floor(vertical ? room[side] : vh - pad * 2)),
  };
  if (matchAnchorWidth) out.minWidth = Math.min(anchor.width, maxWidth);
  if (arrowInset !== undefined) {
    out.arrow = Math.round(
      clamp(anchorStart + anchorSize / 2 - cross, arrowInset, crossSize - arrowInset),
    );
  }
  return out;
}

export type PositionOptions = {
  side?: PositionSide;
  align?: PositionAlign;
  /** Write the anchor width to `--float-min-w` (the panel CSS decides min or exact width). */
  matchAnchorWidth?: boolean;
  /** Token of the gap between anchor and layer. Default `--prime-panel-offset`. */
  offsetToken?: string;
  /** Closest the arrow may come to a layer corner, read from the layer; writes `--float-arrow`. */
  arrowInset?: (layer: HTMLElement) => number;
};

export type Position = {
  /** The side the layer opened on (after flipping). */
  side: PositionSide;
  /** Attach to the layer element (merge with other refs): positioning starts once it is in the DOM. */
  attachLayer: (node: HTMLElement | null) => void;
};

/**
 * Places a floating layer (`position: fixed`) next to its anchor and follows the anchor while
 * `enabled`: before paint, again on the next frame (fonts), and on window resize, scroll of any
 * scrolling ancestor of the anchor, visual-viewport changes and size changes of the layer or the
 * anchor. Shared by every anchored layer (Popover, Dropdown, Select, TagSelect, Tooltip). A
 * portaled layer reaches the DOM one commit after its owner, so the subscription waits for
 * `attachLayer` instead of reading the ref too early.
 */
export function usePosition(
  enabled: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  layerRef: React.RefObject<HTMLElement | null>,
  {
    side: preferredSide = "bottom",
    align = "start",
    matchAnchorWidth = false,
    offsetToken = "--prime-panel-offset",
    arrowInset,
  }: PositionOptions = {},
): Position {
  const [attached, setAttached] = React.useState(false);
  const [resolvedSide, setResolvedSide] = React.useState<PositionSide>(preferredSide);

  const update = React.useCallback(() => {
    const anchor = anchorRef.current;
    const layer = layerRef.current;
    if (!anchor || !layer) return;

    const pos = computeFloatingPosition(
      anchor.getBoundingClientRect(),
      layer.offsetWidth,
      layer.offsetHeight,
      window.innerWidth,
      window.innerHeight,
      {
        side: preferredSide,
        align,
        offset: readCssLengthPx(offsetToken, FALLBACK_PANEL_OFFSET_PX),
        viewportPad: getViewportPadPx(),
        flip: true,
        matchAnchorWidth,
        arrowInset: arrowInset?.(layer),
      },
    );
    setResolvedSide(pos.side);

    // Only real changes are written: repeated updates with the same numbers cause no layout work.
    const set = (name: string, value: string) => {
      if (layer.style.getPropertyValue(name) !== value) layer.style.setProperty(name, value);
    };
    const px = (n: number | undefined) => (n === undefined ? "" : `${n}px`);
    set("position", "fixed");
    set("top", px(pos.top));
    set("left", px(pos.left));
    set(FLOAT_MIN_WIDTH_VAR, px(pos.minWidth));
    set(FLOAT_MAX_WIDTH_VAR, px(pos.maxWidth));
    set(FLOAT_MAX_HEIGHT_VAR, px(pos.maxHeight));
    set(FLOAT_ARROW_VAR, px(pos.arrow));
  }, [anchorRef, layerRef, preferredSide, align, matchAnchorWidth, offsetToken, arrowInset]);

  // `update` changes identity with the options; subscriptions read the latest one.
  const updateRef = React.useRef(update);
  updateRef.current = update;

  const attachLayer = React.useCallback(
    (node: HTMLElement | null) => {
      layerRef.current = node;
      setAttached(node !== null);
    },
    [layerRef],
  );

  const active = enabled && attached;

  React.useLayoutEffect(() => {
    if (!active) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => updateRef.current());
    };

    updateRef.current();
    const followUp = requestAnimationFrame(() => updateRef.current());

    window.addEventListener("resize", schedule);
    const scrollTargets = getScrollContainers(anchorRef.current);
    for (const target of scrollTargets) {
      target.addEventListener("scroll", schedule, { passive: true });
    }
    window.visualViewport?.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (layerRef.current) observer?.observe(layerRef.current);
    if (anchorRef.current) observer?.observe(anchorRef.current);

    return () => {
      cancelAnimationFrame(followUp);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      for (const target of scrollTargets) target.removeEventListener("scroll", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [active, anchorRef, layerRef]);

  // New side / align / width options while open take effect at once.
  React.useLayoutEffect(() => {
    if (active) update();
  }, [active, update]);

  return { side: resolvedSide, attachLayer };
}
