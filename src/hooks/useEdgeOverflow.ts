import * as React from "react";

import { readCssLengthPx } from "@/hooks/usePosition";

/** The axes a region scrolls along: only those are measured. */
export type EdgeOverflowAxis = "vertical" | "horizontal" | "both";

/**
 * Edges of a scroll region that hide content: `start` / `end` along the inline axis (logical,
 * RTL-aware), `top` / `bottom` along the block axis.
 */
export type EdgeOverflow = { start: boolean; end: boolean; top: boolean; bottom: boolean };

const NONE: EdgeOverflow = { start: false, end: false, top: false, bottom: false };

const same = (a: EdgeOverflow, b: EdgeOverflow) =>
  a.start === b.start && a.end === b.end && a.top === b.top && a.bottom === b.bottom;

/**
 * Tracks which edges of a scroll region hide content (`ScrollContainer` `edges="fade"`, the
 * DataTable and Gantt edge shadows). Measured at most once per frame on scroll, on resize of the
 * region or any child, and when children are added; `null` measures nothing.
 *
 * With `depth` it also writes how far the hidden content reaches on each side to the region itself
 * (`--edge-top` / `--edge-bottom` / `--edge-start` / `--edge-end`, px), so a fade is as deep as
 * that distance at most: it grows as the region scrolls away from an edge and melts as it comes
 * back. A distance is written capped at `--prime-space-8` (the deepest fade) and only when it
 * changes, so away from the edges a scroll frame writes nothing and restyles nothing.
 */
export function useEdgeOverflow(
  ref: React.RefObject<HTMLElement | null>,
  axis: EdgeOverflowAxis | null,
  depth = false,
): EdgeOverflow {
  const [overflow, setOverflow] = React.useState<EdgeOverflow>(NONE);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!axis || !node) return;
    const inline = axis !== "vertical";
    const block = axis !== "horizontal";
    const cap = depth ? readCssLengthPx("--prime-space-8", 32) : 0;
    const written = new Map<string, number>();
    const write = (name: string, distance: number) => {
      const value = Math.min(cap, Math.max(0, Math.round(distance)));
      if (written.get(name) === value) return;
      written.set(name, value);
      node.style.setProperty(name, `${value}px`);
    };
    const update = () => {
      // In RTL `scrollLeft` runs from 0 at the start to negative values toward the end.
      const left = Math.abs(node.scrollLeft);
      const leftMax = node.scrollWidth - node.clientWidth;
      const top = node.scrollTop;
      const topMax = node.scrollHeight - node.clientHeight;
      const next: EdgeOverflow = {
        start: inline && left > 1,
        end: inline && leftMax - left > 1,
        top: block && top > 1,
        bottom: block && topMax - top > 1,
      };
      if (depth) {
        if (inline) {
          write("--edge-start", left);
          write("--edge-end", leftMax - left);
        }
        if (block) {
          write("--edge-top", top);
          write("--edge-bottom", topMax - top);
        }
      }
      setOverflow((prev) => (same(prev, next) ? prev : next));
    };
    // Scroll and resize can fire many times per frame (a sidebar collapsing resizes every region
    // beside it): measure at most once per frame.
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    node.addEventListener("scroll", schedule, { passive: true });
    // The content size is the children's: observe every child, including ones added later.
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    const observeChildren = () => {
      for (const child of Array.from(node.children)) resize?.observe(child);
    };
    resize?.observe(node);
    observeChildren();
    const mutation = new MutationObserver(() => {
      observeChildren();
      schedule();
    });
    mutation.observe(node, { childList: true });
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("scroll", schedule);
      resize?.disconnect();
      mutation.disconnect();
      for (const name of written.keys()) node.style.removeProperty(name);
    };
  }, [ref, axis, depth]);

  return axis ? overflow : NONE;
}
