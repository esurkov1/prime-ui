import * as React from "react";

export type EdgeOverflow = { start: boolean; end: boolean };

const NONE: EdgeOverflow = { start: false, end: false };

/**
 * Tracks whether a scroll region hides content before / after its visible part along one axis
 * (`ScrollContainer` `fade`, the DataTable edge cue). Measured at most once per frame on scroll,
 * on resize of the region or any child, and when children are added. RTL-aware: the start is the
 * inline start of the region.
 *
 * It also writes how far the hidden content reaches on each side to the region itself
 * (`--edge-start` / `--edge-end`, px), so a fade can be as deep as that distance at most: it grows
 * as the region scrolls away from an edge and melts as it comes back, instead of switching.
 */
export function useEdgeOverflow(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  horizontal: boolean,
): EdgeOverflow {
  const [overflow, setOverflow] = React.useState<EdgeOverflow>(NONE);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    const update = () => {
      // In RTL `scrollLeft` runs from 0 at the start to negative values toward the end.
      const position = horizontal ? Math.abs(node.scrollLeft) : node.scrollTop;
      const max = horizontal
        ? node.scrollWidth - node.clientWidth
        : node.scrollHeight - node.clientHeight;
      const start = position > 1;
      const end = max - position > 1;
      node.style.setProperty("--edge-start", `${Math.max(0, position)}px`);
      node.style.setProperty("--edge-end", `${Math.max(0, max - position)}px`);
      setOverflow((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
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
    };
  }, [ref, enabled, horizontal]);

  return enabled ? overflow : NONE;
}
