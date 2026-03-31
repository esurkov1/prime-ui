import * as React from "react";

import {
  getFloatingSelectListboxOffsetPx,
  getFloatingViewportPadPx,
} from "@/internal/layoutPxFromPrimitives";

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
  maxHeight?: number;
};

export type PositionUpdateMeta = { resolvedSide: PositionSide };

const MIN_MENU_ESTIMATE = 176;
const FALLBACK_VIEWPORT_PAD_PX = 8;
/** Минимальная высота скролла выпадашки при очень маленьком вьюпорте. */
const MIN_FLOATING_MAX_HEIGHT = 120;
/** Пока offsetHeight === 0, для side=top задаём top от якоря с грубой оценкой высоты (следующий кадр поправит). */
const FIRST_PAINT_FLOAT_HEIGHT_GUESS_PX = 280;

export type ComputeFloatingOptions = {
  preferredSide: PositionSide;
  align: PositionAlign;
  offset: number;
  /** Отступ от краёв вьюпорта (px); по умолчанию 8 при отсутствии (тесты / legacy). */
  viewportPad?: number;
  flip: boolean;
  matchTriggerMinWidth: boolean;
};

export type ComputedFloatPosition = {
  top: number;
  left: number;
  resolvedSide: PositionSide;
  minWidth?: number;
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

  const contentWidth =
    contentW > 0
      ? contentW
      : matchTriggerMinWidth
        ? anchorRect.width
        : Math.max(anchorRect.width, MIN_MENU_ESTIMATE);

  let left: number;
  if (align === "start") left = anchorRect.left;
  else if (align === "end") left = anchorRect.right - contentWidth;
  else left = anchorRect.left + anchorRect.width / 2 - contentWidth / 2;

  left = Math.max(pad, Math.min(left, vw - contentWidth - pad));

  const out: ComputedFloatPosition = {
    top: Math.round(top),
    left: Math.round(left),
    resolvedSide: side,
  };
  if (matchTriggerMinWidth) out.minWidth = anchorRect.width;
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
    offset = getFloatingSelectListboxOffsetPx(),
    viewportPad: viewportPadOption,
    flip = true,
    matchTriggerMinWidth = true,
  } = options;

  const [resolvedSide, setResolvedSide] = React.useState<PositionSide>(preferredSide);

  const applyPositionStyle = React.useCallback(
    (pos: PositionStyle) => {
      const content = contentRef.current;
      if (!content) return;

      const nextTop = `${pos.top}px`;
      const nextLeft = `${pos.left}px`;
      const nextMinW = pos.minWidth !== undefined ? `${pos.minWidth}px` : "";
      const nextMaxH = pos.maxHeight !== undefined ? `${pos.maxHeight}px` : "";
      /* Без лишних присвоений — меньше layout thrashing при повторных update() с теми же числами. */
      if (content.style.position !== pos.position) content.style.position = pos.position;
      if (content.style.top !== nextTop) content.style.top = nextTop;
      if (content.style.left !== nextLeft) content.style.left = nextLeft;
      if (content.style.minWidth !== nextMinW) content.style.minWidth = nextMinW;
      if (content.style.maxHeight !== nextMaxH) content.style.maxHeight = nextMaxH;
    },
    [contentRef],
  );

  const update = React.useCallback((): PositionUpdateMeta | undefined => {
    const anchor = anchorRef.current;
    const content = contentRef.current;
    if (!anchor) return undefined;

    const viewportPad = viewportPadOption ?? getFloatingViewportPadPx();
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
    offset,
    flip,
    matchTriggerMinWidth,
    viewportPadOption,
  ]);

  return { resolvedSide, update };
}
