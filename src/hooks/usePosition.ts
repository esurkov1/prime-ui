import * as React from "react";

import { getRootFontSizePx } from "@/internal/layoutPxFromPrimitives";

export type PositionSide = "bottom" | "top";
export type PositionAlign = "start" | "center" | "end";

type UsePositionOptions = {
  side?: PositionSide;
  align?: PositionAlign;
  offset?: number;
  /** Отступ контента от краёв вьюпорта при расчёте flip/позиции (px). */
  viewportPad?: number;
  flip?: boolean;
  matchTriggerMinWidth?: boolean;
};

type PositionStyle = {
  position: "fixed";
  top: number;
  left: number;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
};

/**
 * Private custom properties written by `usePosition` on the floating element. Panels combine them
 * with tokens, e.g. `max-height: min(var(--prime-panel-max-height), var(--float-max-h))`, so the
 * design limit and the room next to the anchor both apply.
 */
export const FLOAT_MAX_HEIGHT_VAR = "--float-max-h";
/** Trigger width (px) when the panel should be at least as wide as its anchor. */
export const FLOAT_MIN_WIDTH_VAR = "--float-min-w";
/** Viewport width minus gutters (px): a panel is never wider than the screen. */
export const FLOAT_MAX_WIDTH_VAR = "--float-max-w";

export type PositionUpdateMeta = { resolvedSide: PositionSide };

const MIN_MENU_ESTIMATE = 176;
const FALLBACK_VIEWPORT_PAD_PX = 8;
const FALLBACK_PANEL_OFFSET_PX = 4;

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

/** Gap between anchor and floating panel: `--prime-panel-offset`. */
export function getPanelOffsetPx(): number {
  return readCssLengthPx("--prime-panel-offset", FALLBACK_PANEL_OFFSET_PX);
}

/** Minimum distance from a floating panel to the viewport edge: `--prime-space-2`. */
export function getViewportPadPx(): number {
  return readCssLengthPx("--prime-space-2", FALLBACK_VIEWPORT_PAD_PX);
}
/** Минимальная высота скролла выпадашки при очень маленьком вьюпорте. */
const MIN_FLOATING_MAX_HEIGHT = 120;
/** Пока offsetHeight === 0, для side=top задаём top от якоря с грубой оценкой высоты (следующий кадр поправит). */
const FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX = 280;

export type ComputeFloatingOptions = {
  preferredSide: PositionSide;
  align: PositionAlign;
  offset: number;
  /** Отступ от краёв вьюпорта (px); по умолчанию 8. */
  viewportPad?: number;
  flip: boolean;
  matchTriggerMinWidth: boolean;
};

export type ComputedFloatPosition = {
  top: number;
  left: number;
  resolvedSide: PositionSide;
  minWidth?: number;
  /** Ширина вьюпорта минус поля с обеих сторон — панель никогда не шире экрана. */
  maxWidth: number;
  /** Доступная высота под контент (px), со стороны открытия. */
  maxHeight?: number;
};

function pickSideForFlip(
  preferred: PositionSide,
  roomBottom: number,
  roomTop: number,
  contentH: number,
): PositionSide {
  if (contentH > 0) {
    const fitsB = roomBottom >= contentH;
    const fitsT = roomTop >= contentH;
    if (fitsB && !fitsT) return "bottom";
    if (fitsT && !fitsB) return "top";
    if (fitsB && fitsT) return "bottom";
  }
  /* Без высоты нельзя сравнивать «куда влезет» и нельзя брать сторону по room*: иначе side=top, а top в px считают как для bottom — панель уезжает, maxHeight берётся от неверной стороны. */
  if (contentH === 0) return preferred;
  if (roomBottom > roomTop) return "bottom";
  if (roomTop > roomBottom) return "top";
  return preferred;
}

/** Якорь + размеры слоя + вьюпорт; при flip — сторона с большим запасом / куда влезает контент. */
export function computeFloatingPosition(
  anchorRect: DOMRectReadOnly,
  contentW: number,
  contentH: number,
  vw: number,
  vh: number,
  opts: ComputeFloatingOptions,
): ComputedFloatPosition {
  const { preferredSide, align, offset, flip, matchTriggerMinWidth } = opts;
  const pad = opts.viewportPad ?? FALLBACK_VIEWPORT_PAD_PX;
  const roomBottom = vh - anchorRect.bottom - offset - pad;
  const roomTop = anchorRect.top - offset - pad;

  const side = flip ? pickSideForFlip(preferredSide, roomBottom, roomTop, contentH) : preferredSide;

  const top =
    contentH === 0
      ? side === "bottom"
        ? anchorRect.bottom + offset
        : Math.max(pad, anchorRect.top - offset - FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX)
      : side === "bottom"
        ? anchorRect.bottom + offset
        : anchorRect.top - offset - contentH;

  const maxWidth = Math.max(0, Math.floor(vw - pad * 2));
  const contentWidth = Math.min(
    maxWidth,
    contentW > 0
      ? contentW
      : matchTriggerMinWidth
        ? anchorRect.width
        : Math.max(anchorRect.width, MIN_MENU_ESTIMATE),
  );

  const leftFor = (a: PositionAlign) =>
    a === "start"
      ? anchorRect.left
      : a === "end"
        ? anchorRect.right - contentWidth
        : anchorRect.left + anchorRect.width / 2 - contentWidth / 2;
  const fits = (x: number) => x >= pad && x + contentWidth <= vw - pad;
  let left = leftFor(align);
  // Горизонтальный flip: не влезает с выбранного края — пробуем противоположный край якоря.
  if (flip && !fits(left)) {
    const opposite: PositionAlign = align === "end" ? "start" : align === "start" ? "end" : align;
    if (opposite !== align && fits(leftFor(opposite))) left = leftFor(opposite);
  }

  left = Math.max(pad, Math.min(left, vw - contentWidth - pad));

  const out: ComputedFloatPosition = {
    top: Math.round(top),
    left: Math.round(left),
    resolvedSide: side,
    maxWidth,
  };
  if (matchTriggerMinWidth) out.minWidth = Math.min(anchorRect.width, maxWidth);
  const roomVertical = side === "bottom" ? roomBottom : roomTop;
  out.maxHeight = Math.max(MIN_FLOATING_MAX_HEIGHT, Math.floor(roomVertical));
  return out;
}

type UsePositionResult = {
  resolvedSide: PositionSide;
  update: () => PositionUpdateMeta | undefined;
};

export function usePosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  options: UsePositionOptions = {},
): UsePositionResult {
  const {
    side: preferredSide = "bottom",
    align = "start",
    offset: offsetOption,
    viewportPad: viewportPadOption,
    flip = true,
    matchTriggerMinWidth = true,
  } = options;

  const [resolvedSide, setResolvedSide] = React.useState<PositionSide>(preferredSide);

  const applyPositionStyle = React.useCallback(
    (pos: PositionStyle) => {
      const content = contentRef.current;
      if (!content) return;

      const setVar = (name: string, px: number | undefined) => {
        const next = px !== undefined ? `${px}px` : "";
        if (content.style.getPropertyValue(name) !== next) content.style.setProperty(name, next);
      };
      const nextTop = `${pos.top}px`;
      const nextLeft = `${pos.left}px`;
      /* Без лишних присвоений — меньше layout thrashing при повторных update() с теми же числами. */
      if (content.style.position !== pos.position) content.style.position = pos.position;
      if (content.style.top !== nextTop) content.style.top = nextTop;
      if (content.style.left !== nextLeft) content.style.left = nextLeft;
      setVar(FLOAT_MIN_WIDTH_VAR, pos.minWidth);
      setVar(FLOAT_MAX_WIDTH_VAR, pos.maxWidth);
      setVar(FLOAT_MAX_HEIGHT_VAR, pos.maxHeight);
    },
    [contentRef],
  );

  const update = React.useCallback((): PositionUpdateMeta | undefined => {
    const anchor = anchorRef.current;
    const content = contentRef.current;
    if (!anchor) return undefined;

    const viewportPad = viewportPadOption ?? getViewportPadPx();
    const offset = offsetOption ?? getPanelOffsetPx();
    const anchorRect = anchor.getBoundingClientRect();
    const pos = computeFloatingPosition(
      anchorRect,
      content?.offsetWidth ?? 0,
      content?.offsetHeight ?? 0,
      window.innerWidth,
      window.innerHeight,
      { preferredSide, align, offset, viewportPad, flip, matchTriggerMinWidth },
    );

    setResolvedSide((prev) => (pos.resolvedSide === prev ? prev : pos.resolvedSide));
    applyPositionStyle({
      position: "fixed",
      top: pos.top,
      left: pos.left,
      maxWidth: pos.maxWidth,
      ...(pos.minWidth !== undefined ? { minWidth: pos.minWidth } : {}),
      ...(pos.maxHeight !== undefined ? { maxHeight: pos.maxHeight } : {}),
    });
    return { resolvedSide: pos.resolvedSide };
  }, [
    anchorRef,
    applyPositionStyle,
    contentRef,
    preferredSide,
    align,
    offsetOption,
    flip,
    matchTriggerMinWidth,
    viewportPadOption,
  ]);

  return { resolvedSide, update };
}
