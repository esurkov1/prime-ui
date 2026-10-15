import * as React from "react";

import { createGlide, restPoints, type ScrollAxis, scrollMax, scrollPosition } from "./scrollGlide";

/** A wheel event this soon after the last one continues the same gesture. */
const GESTURE_GAP_MS = 200;
/** A scroll that has not moved for this long has ended (trackpad momentum included). */
const SCROLL_IDLE_MS = 120;
/** `proximity` settles only on a rest point within this share of the view. */
const PROXIMITY = 0.3;
/** One line of `deltaMode = 1` (a mouse wheel in Firefox), px. */
const LINE_PX = 16;
/** One notch of a mouse wheel as `wheelDeltaY` reports it (every engine). */
const NOTCH = 120;

/** When the last wheel gesture that was not a strip's own went on: it keeps scrolling the page. */
let passingUntil = 0;
let listeners = 0;

const onWindowWheel = (event: WheelEvent) => {
  if (!event.defaultPrevented) passingUntil = event.timeStamp + GESTURE_GAP_MS;
};

/**
 * A notch of a mouse wheel, not a trackpad: lines or pages (Firefox), or whole notches of
 * `wheelDeltaY` (a trackpad reports it as −3 × its fine `deltaY`).
 */
function isMouseWheel(event: WheelEvent): boolean {
  if (event.deltaMode !== 0) return true;
  const notch = (event as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
  return notch !== undefined && notch !== 0 && notch % NOTCH === 0;
}

export type ScrollMotionOptions = {
  axis: "vertical" | "horizontal" | "both";
  /** Settle on a rest point once a scroll ends: near one, or always. */
  snap: "proximity" | "mandatory" | null;
  /** Nothing the person does moves the region: no wheel glide, no settling. */
  lock: boolean;
};

/**
 * How a ScrollContainer moves beyond the browser's own scrolling, which it never replaces: the
 * trackpad, touch, the scrollbar and the keys scroll natively, momentum included.
 *
 * - Snapping (`snap`): once a scroll ends (no movement for a moment, nothing held), the region
 *   glides to the nearest rest point — the start of a child with a `scroll-snap-align`. CSS scroll
 *   snapping is not used: an engine snaps during the gesture, damps the trackpad's momentum and
 *   pulls a scroll back to merged rest points at the end.
 * - A mouse wheel over a strip that scrolls only sideways (`axis="horizontal"`) scrolls it — a
 *   snapping strip a rest point per notch, a free one by the wheel's distance. A trackpad, Shift
 *   + wheel, a gesture that began outside (it keeps scrolling the page) and a strip at its edge
 *   (the wheel chains to the page) stay native.
 * - Every glide runs on the kit's frames and stops the moment the person takes over (a wheel,
 *   touch, press or key); each notch retargets from where the glide is heading, so a turn the
 *   other way goes back mid-glide.
 */
export function useScrollMotion(
  ref: React.RefObject<HTMLElement | null>,
  { axis, snap, lock }: ScrollMotionOptions,
) {
  React.useEffect(() => {
    const node = ref.current;
    if (!node || lock) return;
    const glide = createGlide(node);
    const axes: ScrollAxis[] =
      axis === "horizontal" ? ["x"] : axis === "vertical" ? ["y"] : ["x", "y"];
    const wheelToInline = axis === "horizontal";
    if (wheelToInline && listeners++ === 0) {
      window.addEventListener("wheel", onWindowWheel, { passive: true });
    }
    let idle: ReturnType<typeof setTimeout> | undefined;
    let held = false;
    let lastWheel = Number.NEGATIVE_INFINITY;
    /** The wheel gesture under way is a trackpad's: the browser keeps it to the end. */
    let trackpad = false;

    const settle = () => {
      if (!snap || held || node.querySelector("[data-dnd-carrying]")) return;
      for (const along of axes) {
        const points = restPoints(node, along);
        if (points.length === 0) continue;
        const at = scrollPosition(node, along);
        const nearest = points.reduce((best, point) =>
          Math.abs(point - at) < Math.abs(best - at) ? point : best,
        );
        const view = along === "x" ? node.clientWidth : node.clientHeight;
        if (snap === "proximity" && Math.abs(nearest - at) > view * PROXIMITY) continue;
        if (Math.abs(nearest - at) >= 0.5) glide.to(along, nearest);
      }
    };
    const schedule = () => {
      clearTimeout(idle);
      if (snap) idle = setTimeout(settle, SCROLL_IDLE_MS);
    };

    const onScroll = () => {
      if (!glide.owns()) schedule();
    };
    // The person's own input stops a glide at once; the settling waits for it to go quiet again
    // (a trackpad's momentum ends in a tail of tiny wheel events that no longer move the region).
    const takeOver = () => {
      glide.stop();
      schedule();
    };
    const hold = () => {
      held = true;
      glide.stop();
    };
    const release = () => {
      if (!held) return;
      held = false;
      schedule();
    };

    const onWheel = (event: WheelEvent) => {
      const newGesture = event.timeStamp - lastWheel > GESTURE_GAP_MS;
      lastWheel = event.timeStamp;
      if (newGesture) trackpad = false;
      const notch =
        wheelToInline &&
        event.deltaX === 0 &&
        !event.shiftKey &&
        !event.ctrlKey &&
        event.deltaY !== 0 &&
        isMouseWheel(event);
      if (!notch) {
        // The person's own scroll: it takes over from a glide and settles when it ends.
        if (event.deltaX !== 0 || !isMouseWheel(event)) trackpad = true;
        takeOver();
        return;
      }
      if (trackpad) {
        takeOver();
        return;
      }
      if (event.timeStamp < passingUntil) return;
      const max = scrollMax(node, "x");
      if (max <= 1) return;
      const scale = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? node.clientWidth : 1;
      const delta = event.deltaY * scale;
      const heading = glide.target("x");
      const from = heading ?? scrollPosition(node, "x");
      let next: number | undefined;
      if (snap) {
        const points = restPoints(node, "x");
        next =
          delta > 0
            ? points.find((point) => point > from + 0.5)
            : [...points].reverse().find((point) => point < from - 0.5);
      } else {
        const to = Math.min(max, Math.max(0, from + delta));
        next = Math.abs(to - from) < 0.5 ? undefined : to;
      }
      if (next === undefined) {
        // At the edge: the wheel chains to the page, unless a glide is still heading there.
        if (heading !== null) event.preventDefault();
        return;
      }
      event.preventDefault();
      clearTimeout(idle);
      glide.to("x", next);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    node.addEventListener("wheel", onWheel, { passive: !wheelToInline });
    node.addEventListener("pointerdown", hold);
    node.addEventListener("touchstart", hold, { passive: true });
    node.addEventListener("keydown", takeOver);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("touchend", release);
    window.addEventListener("touchcancel", release);
    return () => {
      glide.stop();
      clearTimeout(idle);
      node.removeEventListener("scroll", onScroll);
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("pointerdown", hold);
      node.removeEventListener("touchstart", hold);
      node.removeEventListener("keydown", takeOver);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      if (wheelToInline && --listeners === 0) window.removeEventListener("wheel", onWindowWheel);
    };
  }, [ref, axis, snap, lock]);
}
