import * as React from "react";

import { type PositionAlign, type PositionSide, usePosition } from "@/hooks/usePosition";
import { getScrollContainers } from "@/internal/scrollAncestors";

export type AnchoredPositionOptions = {
  side: PositionSide;
  align: PositionAlign;
  /** Write the anchor width to `--float-min-w` (the panel CSS decides min or exact width). */
  matchAnchorWidth: boolean;
};

export type AnchoredPosition = {
  /** The side the layer opened on (after flipping). */
  side: PositionSide;
  /** Attach to the layer element (merge with other refs): positioning starts once it is in the DOM. */
  attachLayer: (node: HTMLElement | null) => void;
};

/**
 * `usePosition` that follows its anchor while `enabled`: places the layer before paint, again on
 * the next frame (fonts), and on window resize, scroll of any scrolling ancestor of the anchor,
 * visual-viewport changes and size changes of the layer or the anchor. Shared by every anchored
 * panel (Popover, Dropdown, Select, TagSelect). A portaled layer reaches the DOM one commit after
 * its owner, so the subscription waits for `attachLayer` instead of reading the ref too early.
 */
export function useAnchoredPosition(
  enabled: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  layerRef: React.RefObject<HTMLElement | null>,
  { side, align, matchAnchorWidth }: AnchoredPositionOptions,
): AnchoredPosition {
  const [attached, setAttached] = React.useState(false);
  const { resolvedSide, update } = usePosition(anchorRef, layerRef, {
    side,
    align,
    matchTriggerMinWidth: matchAnchorWidth,
  });
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
