import * as React from "react";

import { useAnchorRectResolver, useFloatingBoundaryResolver } from "@/internal/AnchorRectContext";
import { getScrollContainers } from "@/internal/scrollAncestors";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import { computeFloatingPosition } from "./floatingPosition";

export type PositionSide = "top" | "right" | "bottom" | "left";
/** `auto` picks `start` or `end` by the room around the anchor (see `computeFloatingPosition`). */
export type PositionAlign = "auto" | "start" | "center" | "end";

/**
 * Where every anchored panel (Popover, Dropdown, Select, TagSelect, Datepicker, ColorPresets)
 * opens unless it asks otherwise: below its anchor, lined up with the anchor edge that has the
 * room — a trigger near the end of the screen lines up its end edge and the panel grows toward
 * the start, a trigger near the start the other way. It flips to the top only when it does not fit.
 */
export const DEFAULT_SIDE: PositionSide = "bottom";
export const DEFAULT_ALIGN: PositionAlign = "auto";

/**
 * Private custom properties written by `usePosition` on the floating element. Panels combine them
 * with tokens, e.g. `max-height: min(var(--prime-panel-max-height), var(--float-max-h))`, so the
 * design limit and the room next to the anchor both apply.
 */
const FLOAT_MAX_HEIGHT_VAR = "--float-max-h";
/** Anchor width (px) when the panel should be at least as wide as its anchor. */
const FLOAT_MIN_WIDTH_VAR = "--float-min-w";
/** Room across the main axis (px): a panel is never wider than the screen or its side. */
const FLOAT_MAX_WIDTH_VAR = "--float-max-w";
/** Arrow centre along the layer edge that faces the anchor (px), when `arrowInset` is given. */
const FLOAT_ARROW_VAR = "--float-arrow";

/** Root `font-size` without a `document` (SSR) or a valid computed px: the usual `:root` 16px. */
const FALLBACK_ROOT_FONT_PX = 16;

/** The computed root (`html`) `font-size` in px, so rem lengths convert without assuming 16. */
function getRootFontSizePx(): number {
  if (typeof document === "undefined") return FALLBACK_ROOT_FONT_PX;
  const parsed = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : FALLBACK_ROOT_FONT_PX;
}

/**
 * Computed length of a CSS custom property in px (rem/px values): on `element` when given (a value
 * a component or its tier sets on it), else on `:root`. Falls back when there is no DOM /
 * stylesheet (SSR, jsdom).
 */
export function readCssLengthPx(
  name: string,
  fallbackPx: number,
  element?: Element | null,
): number {
  if (typeof document === "undefined") return fallbackPx;
  const raw = getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallbackPx;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return fallbackPx;
  if (raw.endsWith("rem")) return Math.round(n * getRootFontSizePx());
  if (raw.endsWith("px") || n === 0) return Math.round(n);
  return fallbackPx;
}

/** Minimum distance from a floating panel to the viewport edge: `--prime-space-2`. */
export function getViewportPadPx(): number {
  return readCssLengthPx("--prime-space-2", TOKEN_DEFAULTS["--prime-space-2"]);
}

/** A zero-size anchor at a viewport point. */
function pointRect(x: number, y: number) {
  return { left: x, right: x, top: y, bottom: y, width: 0, height: 0 };
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
  /**
   * A point inside the anchor (px from its top-left corner) to place the layer against instead of
   * the whole anchor — the pointer over a chart (Floating UI's virtual element). It moves with the
   * anchor on scroll; every new point re-places the layer before paint. Flipping stays the same:
   * the layer keeps `side` until it has no room there.
   */
  anchorPoint?: AnchorPoint | null;
};

export type AnchorPoint = { x: number; y: number };

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
 * anchor. Shared by every anchored layer (Popover, Dropdown, Select, TagSelect, Tooltip, and the
 * chart tooltip at a point — `anchorPoint`). A portaled layer reaches the DOM one commit after its
 * owner, so the subscription waits for `attachLayer` instead of reading the ref too early.
 */
export function usePosition(
  enabled: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  layerRef: React.RefObject<HTMLElement | null>,
  {
    side: preferredSide = DEFAULT_SIDE,
    align = DEFAULT_ALIGN,
    matchAnchorWidth = false,
    offsetToken = "--prime-panel-offset",
    arrowInset,
    anchorPoint = null,
  }: PositionOptions = {},
): Position {
  const [attached, setAttached] = React.useState(false);
  const [resolvedSide, setResolvedSide] = React.useState<PositionSide>(preferredSide);
  const resolveAnchorRect = useAnchorRectResolver();
  const resolveBoundary = useFloatingBoundaryResolver();
  /** Token lengths read from CSS: once per activation / option change / resize, not per frame. */
  const metricsRef = React.useRef<{ offset: number; pad: number; arrow?: number } | null>(null);
  // Read by `update`: a moving point re-places the layer without rebuilding the subscriptions.
  const pointRef = React.useRef(anchorPoint);
  pointRef.current = anchorPoint;

  const update = React.useCallback(
    (remeasure: boolean) => {
      const anchor = anchorRef.current;
      const layer = layerRef.current;
      if (!anchor || !layer) return;
      if (remeasure || !metricsRef.current) {
        metricsRef.current = {
          offset: readCssLengthPx(offsetToken, TOKEN_DEFAULTS["--prime-panel-offset"]),
          pad: getViewportPadPx(),
          arrow: arrowInset?.(layer),
        };
      }
      const { offset, pad, arrow } = metricsRef.current;
      const rawRect = anchor.getBoundingClientRect();
      const point = pointRef.current;
      const rect = point
        ? pointRect(rawRect.left + point.x, rawRect.top + point.y)
        : resolveAnchorRect
          ? resolveAnchorRect(anchor, rawRect)
          : rawRect;
      const boundary = resolveBoundary?.(anchor) ?? undefined;
      const compute = (width: number, height: number) =>
        computeFloatingPosition(rect, width, height, window.innerWidth, window.innerHeight, {
          side: preferredSide,
          align,
          offset,
          viewportPad: pad,
          flip: true,
          matchAnchorWidth,
          arrowInset: arrow,
          boundary,
        });

      // Only real changes are written: repeated updates with the same numbers cause no layout work.
      const set = (name: string, value: string) => {
        if (layer.style.getPropertyValue(name) !== value) layer.style.setProperty(name, value);
      };
      const px = (n: number | undefined) => (n === undefined ? "" : `${n}px`);
      set("position", "fixed");

      /*
       * The size limits change the layer's own size (a Select panel takes its anchor's width), and
       * the place depends on that size (`align="auto"` lines the end edge up from the width). So the
       * limits are written first and the layer is measured again until its size settles — all in this
       * one call, before paint: the first frame already shows the final place, never a narrower
       * panel that jumps on the next frame.
       */
      let width = layer.offsetWidth;
      let height = layer.offsetHeight;
      let pos = compute(width, height);
      for (let pass = 0; pass < 3; pass++) {
        set(FLOAT_MIN_WIDTH_VAR, px(pos.minWidth));
        set(FLOAT_MAX_WIDTH_VAR, px(pos.maxWidth));
        set(FLOAT_MAX_HEIGHT_VAR, px(pos.maxHeight));
        const nextWidth = layer.offsetWidth;
        const nextHeight = layer.offsetHeight;
        if (nextWidth === width && nextHeight === height) break;
        width = nextWidth;
        height = nextHeight;
        pos = compute(width, height);
      }
      setResolvedSide(pos.side);

      set("top", px(pos.top));
      set("left", px(pos.left));
      set(FLOAT_ARROW_VAR, px(pos.arrow));
      // Placed: the layer may be seen (see `attachLayer`).
      delete layer.dataset.floatPending;
    },
    [
      anchorRef,
      layerRef,
      preferredSide,
      align,
      matchAnchorWidth,
      offsetToken,
      arrowInset,
      resolveAnchorRect,
      resolveBoundary,
    ],
  );

  // `update` changes identity with the options; subscriptions read the latest one.
  const updateRef = React.useRef(update);
  updateRef.current = update;

  const enabledRef = React.useRef(enabled);
  enabledRef.current = enabled;
  const attachLayer = React.useCallback(
    (node: HTMLElement | null) => {
      layerRef.current = node;
      // Not seen until it has a place: a layer is never painted where it does not belong, even for
      // a frame (`[data-float-pending]` hides it; the first update clears it).
      if (node && enabledRef.current) node.dataset.floatPending = "";
      setAttached(node !== null);
    },
    [layerRef],
  );

  const active = enabled && attached;

  // Before paint on activation, and again at once when side / align / width options change.
  React.useLayoutEffect(() => {
    if (active) update(true);
  }, [active, update]);

  // A new anchor point (the pointer moved) re-places the layer before paint.
  const pointX = anchorPoint?.x;
  const pointY = anchorPoint?.y;
  React.useLayoutEffect(() => {
    if (active && pointX !== undefined && pointY !== undefined) updateRef.current(false);
  }, [active, pointX, pointY]);

  React.useLayoutEffect(() => {
    if (!active) return;
    let frame = 0;
    let remeasure = false;
    const schedule = (measure: boolean) => {
      remeasure ||= measure;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updateRef.current(remeasure);
        remeasure = false;
      });
    };
    const follow = () => schedule(false);
    const resize = () => schedule(true);

    window.addEventListener("resize", resize);
    const scrollTargets = getScrollContainers(anchorRef.current);
    for (const target of scrollTargets) {
      target.addEventListener("scroll", follow, { passive: true });
    }
    window.visualViewport?.addEventListener("resize", resize);
    /*
     * The layer's late size changes (web fonts, content loading in, a filtered list) are placed in
     * the observer's own callback: it runs after layout and before paint, so the new place shows in
     * the same frame. A frame later (`requestAnimationFrame`) would paint the old place once.
     */
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            updateRef.current(false);
          });
    if (layerRef.current) observer?.observe(layerRef.current);
    if (anchorRef.current) observer?.observe(anchorRef.current);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      for (const target of scrollTargets) target.removeEventListener("scroll", follow);
      window.visualViewport?.removeEventListener("resize", resize);
      observer?.disconnect();
    };
  }, [active, anchorRef, layerRef]);

  return { side: resolvedSide, attachLayer };
}
