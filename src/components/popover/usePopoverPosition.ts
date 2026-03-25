import * as React from "react";

import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { computeFloatingPosition } from "@/hooks/usePosition";
import { getScrollContainers } from "@/internal/scrollAncestors";

import {
  getPopoverMaxHeightForAnchorSide,
  getPopoverPanelOffsetPx,
  getPopoverViewportPadPx,
} from "./popoverGeometry";

export type PopoverLayout = {
  style: React.CSSProperties;
  resolvedSide: PositionSide;
};

type Params = {
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  side: PositionSide;
  align: PositionAlign;
  sameMinWidthAsTrigger: boolean;
};

function layoutEqual(a: PopoverLayout, b: PopoverLayout): boolean {
  return (
    a.resolvedSide === b.resolvedSide &&
    a.style.top === b.style.top &&
    a.style.left === b.style.left &&
    a.style.maxHeight === b.style.maxHeight &&
    a.style.minWidth === b.style.minWidth
  );
}

/** Позиция + max-height одним проходом; resize / scroll-предки / ResizeObserver / visualViewport. */
export function usePopoverPosition({
  open,
  triggerRef,
  contentRef,
  side,
  align,
  sameMinWidthAsTrigger,
}: Params): PopoverLayout | null {
  const [layout, setLayout] = React.useState<PopoverLayout | null>(null);

  const commit = React.useCallback(() => {
    const trigger = triggerRef.current;
    const panel = contentRef.current;
    if (!trigger || !panel) return;

    const anchorRect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelOffset = getPopoverPanelOffsetPx();
    const viewportPad = getPopoverViewportPadPx();
    const pos = computeFloatingPosition(anchorRect, panel.offsetWidth, panel.offsetHeight, vw, vh, {
      preferredSide: side,
      align,
      offset: panelOffset,
      viewportPad,
      flip: true,
      matchTriggerMinWidth: sameMinWidthAsTrigger,
    });

    const next: PopoverLayout = {
      resolvedSide: pos.resolvedSide,
      style: {
        position: "fixed",
        top: pos.top,
        left: pos.left,
        maxHeight: getPopoverMaxHeightForAnchorSide(
          anchorRect,
          pos.resolvedSide,
          vh,
          panelOffset,
          viewportPad,
        ),
        ...(pos.minWidth !== undefined ? { minWidth: pos.minWidth } : {}),
      },
    };

    setLayout((prev) => (prev && layoutEqual(prev, next) ? prev : next));
  }, [triggerRef, contentRef, side, align, sameMinWidthAsTrigger]);

  React.useLayoutEffect(() => {
    if (!open) {
      setLayout(null);
      return;
    }

    let rafCoalesce = 0;
    const schedule = () => {
      cancelAnimationFrame(rafCoalesce);
      rafCoalesce = requestAnimationFrame(commit);
    };

    commit();
    const rafFollowUp = requestAnimationFrame(commit);

    window.addEventListener("resize", schedule);
    const scrollTargets = getScrollContainers(triggerRef.current);
    for (const t of scrollTargets) {
      t.addEventListener("scroll", schedule, { passive: true });
    }
    const vv = window.visualViewport;
    vv?.addEventListener("resize", schedule);

    const panel = contentRef.current;
    const ro = panel ? new ResizeObserver(schedule) : null;
    if (panel && ro) ro.observe(panel);

    return () => {
      cancelAnimationFrame(rafFollowUp);
      cancelAnimationFrame(rafCoalesce);
      window.removeEventListener("resize", schedule);
      for (const t of scrollTargets) {
        t.removeEventListener("scroll", schedule);
      }
      vv?.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, [open, commit, triggerRef, contentRef]);

  return layout;
}
