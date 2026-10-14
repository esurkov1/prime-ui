import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";

/** A wheel event this soon after the last one continues the same gesture. */
const GESTURE_GAP_MS = 200;
/** One line of `deltaMode = 1` (a mouse wheel in Firefox), px. */
const LINE_PX = 16;

/** When the last wheel gesture that was not a strip's own went on: it keeps scrolling the page. */
let passingUntil = 0;
let listeners = 0;

const onWindowWheel = (event: WheelEvent) => {
  if (!event.defaultPrevented) passingUntil = event.timeStamp + GESTURE_GAP_MS;
};

/**
 * A vertical wheel over a strip that scrolls only sideways (`axis="horizontal"`) scrolls the strip:
 * a mouse has no other way to reach what is hidden to the side. The browser's own sideways wheel
 * (a trackpad swipe, Shift + wheel) stays native, and so does a page scroll that passes over the
 * strip (a wheel gesture that began outside it keeps scrolling the page) or a strip already at the
 * edge in that direction (the wheel chains to the page). The steps glide to an accumulated target
 * (instant under reduced motion), so fast wheeling loses no distance.
 */
export function useWheelToInline(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  React.useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    if (listeners++ === 0) {
      window.addEventListener("wheel", onWindowWheel, { passive: true });
    }
    let target: number | null = null;
    let settle = 0;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaX !== 0 || event.shiftKey || event.ctrlKey || event.deltaY === 0) return;
      if (event.timeStamp < passingUntil) return;
      const max = node.scrollWidth - node.clientWidth;
      if (max <= 1) return;
      const rtl = getComputedStyle(node).direction === "rtl";
      const scale = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? node.clientWidth : 1;
      // Distance from the start, whatever the direction (RTL `scrollLeft` is negative).
      const from = target ?? Math.abs(node.scrollLeft);
      const next = Math.min(max, Math.max(0, from + event.deltaY * scale));
      if (Math.abs(next - from) < 0.5) return;
      event.preventDefault();
      target = next;
      node.scrollTo({
        left: rtl ? -next : next,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        target = null;
      }, GESTURE_GAP_MS);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      window.clearTimeout(settle);
      if (--listeners === 0) window.removeEventListener("wheel", onWindowWheel);
    };
  }, [ref, enabled]);
}
