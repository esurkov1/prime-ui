import * as React from "react";

import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import {
  computeFloatingPosition,
  FLOAT_MAX_HEIGHT_VAR,
  FLOAT_MAX_WIDTH_VAR,
  FLOAT_MIN_WIDTH_VAR,
} from "@/hooks/usePosition";
import { getScrollContainers } from "@/internal/scrollAncestors";

import {
  getDropdownMaxHeightForAnchorSide,
  getDropdownPanelOffsetPx,
  getDropdownViewportPadPx,
} from "./dropdownGeometry";

export type DropdownLayout = {
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

function styleVar(layout: DropdownLayout, name: string): unknown {
  return (layout.style as Record<string, unknown>)[name];
}

function layoutEqual(a: DropdownLayout, b: DropdownLayout): boolean {
  return (
    a.resolvedSide === b.resolvedSide &&
    a.style.top === b.style.top &&
    a.style.left === b.style.left &&
    styleVar(a, FLOAT_MAX_HEIGHT_VAR) === styleVar(b, FLOAT_MAX_HEIGHT_VAR) &&
    styleVar(a, FLOAT_MIN_WIDTH_VAR) === styleVar(b, FLOAT_MIN_WIDTH_VAR) &&
    styleVar(a, FLOAT_MAX_WIDTH_VAR) === styleVar(b, FLOAT_MAX_WIDTH_VAR)
  );
}

/** Позиция + max-height одним проходом; resize / scroll-предки / ResizeObserver / visualViewport. */
export function useDropdownPosition({
  open,
  triggerRef,
  contentRef,
  side,
  align,
  sameMinWidthAsTrigger,
}: Params): DropdownLayout | null {
  const [layout, setLayout] = React.useState<DropdownLayout | null>(null);

  const commit = React.useCallback(() => {
    const trigger = triggerRef.current;
    const panel = contentRef.current;
    if (!trigger || !panel) return;

    const anchorRect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelOffset = getDropdownPanelOffsetPx();
    const viewportPad = getDropdownViewportPadPx();
    const pos = computeFloatingPosition(anchorRect, panel.offsetWidth, panel.offsetHeight, vw, vh, {
      preferredSide: side,
      align,
      offset: panelOffset,
      viewportPad,
      flip: true,
      matchTriggerMinWidth: sameMinWidthAsTrigger,
    });

    const next: DropdownLayout = {
      resolvedSide: pos.resolvedSide,
      style: {
        position: "fixed",
        top: pos.top,
        left: pos.left,
        [FLOAT_MAX_HEIGHT_VAR]: `${getDropdownMaxHeightForAnchorSide(
          anchorRect,
          pos.resolvedSide,
          vh,
          panelOffset,
          viewportPad,
        )}px`,
        [FLOAT_MAX_WIDTH_VAR]: `${pos.maxWidth}px`,
        ...(pos.minWidth !== undefined ? { [FLOAT_MIN_WIDTH_VAR]: `${pos.minWidth}px` } : {}),
      } as React.CSSProperties,
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
