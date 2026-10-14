import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import type { PositionAlign, PositionSide } from "./usePosition";

/** Width guess (px) of a panel not measured yet that does not take its anchor's width. */
const MIN_MENU_ESTIMATE = 176;
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

type FloatingOptions = {
  side: PositionSide;
  align: PositionAlign;
  /** Gap between the anchor and the layer (px). */
  offset: number;
  /** Minimum distance from the viewport edge (px); `--prime-space-2` by default. */
  viewportPad?: number;
  /** Flip to the opposite side (and edge) when the layer does not fit. */
  flip: boolean;
  matchAnchorWidth: boolean;
  /** Closest the arrow centre may come to a layer corner; computes `arrow` when set. */
  arrowInset?: number;
  /**
   * The box the layer must stay in (viewport px), intersected with the viewport: a scroll region
   * whose sticky parts the layer must not cover. Flipping, the cross-axis clamp and the size limits
   * use it instead of the viewport.
   */
  boundary?: Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom">;
};

type FloatingPosition = {
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
 * The geometry of `usePosition`, without the DOM. Places a layer on `side` of the anchor: flips to
 * the opposite side when it does not fit there and does on the other (or has more room), aligns it
 * along the cross axis (flipping the edge when it overflows), keeps it inside the viewport and,
 * with `arrowInset`, points an arrow at the anchor's centre without leaving the layer's straight
 * edge.
 */
export function computeFloatingPosition(
  anchor: Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "width" | "height">,
  contentW: number,
  contentH: number,
  vw: number,
  vh: number,
  opts: FloatingOptions,
): FloatingPosition {
  const { align, offset, flip, matchAnchorWidth, arrowInset, boundary } = opts;
  const pad = opts.viewportPad ?? TOKEN_DEFAULTS["--prime-space-2"];
  // The box to stay in: the viewport, or the boundary inside it.
  const minX = boundary ? Math.max(0, boundary.left) : 0;
  const minY = boundary ? Math.max(0, boundary.top) : 0;
  const maxX = boundary ? Math.min(vw, boundary.right) : vw;
  const maxY = boundary ? Math.min(vh, boundary.bottom) : vh;
  const room: Record<PositionSide, number> = {
    top: anchor.top - minY - offset - pad,
    bottom: maxY - anchor.bottom - offset - pad,
    left: anchor.left - minX - offset - pad,
    right: maxX - anchor.right - offset - pad,
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

  const viewportMaxWidth = Math.max(0, Math.floor(maxX - minX - pad * 2));
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
  else if (side === "left") main = Math.max(minX + pad, anchor.left - offset - width);
  else
    main = Math.max(
      minY + pad,
      anchor.top - offset - (contentH > 0 ? contentH : FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX),
    );

  const anchorStart = vertical ? anchor.left : anchor.top;
  const anchorSize = vertical ? anchor.width : anchor.height;
  const crossSize = vertical ? width : contentH;
  const crossMin = (vertical ? minX : minY) + pad;
  const crossMax = (vertical ? maxX : maxY) - pad;
  const crossFor = (a: PositionAlign) =>
    a === "start"
      ? anchorStart
      : a === "end"
        ? anchorStart + anchorSize - crossSize
        : anchorStart + anchorSize / 2 - crossSize / 2;
  const fits = (x: number) => x >= crossMin && x + crossSize <= crossMax;
  // `auto`: the anchor edge with more room beyond it — the room toward the end from the start
  // edge against the room toward the start from the end edge.
  const edge: PositionAlign =
    align !== "auto"
      ? align
      : crossMax - anchorStart >= anchorStart + anchorSize - crossMin
        ? "start"
        : "end";
  let cross = crossFor(edge);
  // Edge flip: does not fit from the chosen edge — try the opposite edge of the anchor.
  if (flip && !fits(cross)) {
    const opposite: PositionAlign = edge === "end" ? "start" : edge === "start" ? "end" : edge;
    if (opposite !== edge && fits(crossFor(opposite))) cross = crossFor(opposite);
  }
  cross = Math.round(clamp(cross, crossMin, crossMax - crossSize));

  const out: FloatingPosition = {
    top: Math.round(vertical ? main : cross),
    left: Math.round(vertical ? cross : main),
    side,
    maxWidth,
    maxHeight: Math.max(
      MIN_FLOATING_MAX_HEIGHT,
      Math.floor(vertical ? room[side] : maxY - minY - pad * 2),
    ),
  };
  if (matchAnchorWidth) out.minWidth = Math.min(anchor.width, maxWidth);
  if (arrowInset !== undefined) {
    out.arrow = Math.round(
      clamp(anchorStart + anchorSize / 2 - cross, arrowInset, crossSize - arrowInset),
    );
  }
  return out;
}
