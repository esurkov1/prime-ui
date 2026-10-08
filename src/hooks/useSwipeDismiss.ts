import * as React from "react";

/** The direction a panel leaves in: toward the screen edge it came from. */
export type SwipeDirection = "down" | "left" | "right";

export type UseSwipeDismissOptions = {
  enabled: boolean;
  direction: SwipeDirection;
  onDismiss: () => void;
  /** Selector of the zones a drag starts from by any pointer: the grab handle, the header. */
  handle: string;
  /**
   * A touch drag may also start anywhere else in the panel (side drawers, whose content scrolls
   * across the swipe axis). Mouse and pen drags start from `handle` only, so text stays selectable.
   */
  touchAnywhere?: boolean;
  /**
   * How far out the panel is, 0 (at rest) … 1 (off its edge), on every move and on release (0 back,
   * 1 out) — for parts that follow the drag, such as the scrim's opacity.
   */
  onProgress?: (progress: number) => void;
};

/** Distance before a press turns into a drag (or into a scroll the drag leaves alone). */
const SLOP_PX = 8;
/** Share of the panel size past which a release closes it. */
const DISTANCE_RATIO = 0.3;
/** A flick toward the edge faster than this (px/ms) closes the panel from any distance. */
const FLICK_VELOCITY = 0.5;
/** Velocity is measured over the last stretch of the drag, not the whole of it. */
const VELOCITY_WINDOW_MS = 100;

/** Never starts a drag: text entry, sliders. */
const NO_DRAG = "input, textarea, select, [contenteditable], [role='slider']";

/** The custom property the panel CSS maps onto its own axis (`transform`). */
export const SWIPE_OFFSET_VAR = "--swipe-offset";

/**
 * Farthest a panel moves against its closing direction (= `--prime-space-6`): the panel CSS
 * continues its fill this far past the screen edge, so it never comes away from the edge.
 */
const OVERPULL_PX = 24;

/** A drag against the closing direction moves the panel ever more stiffly, never past the cap. */
function rubberBand(distance: number): number {
  return -OVERPULL_PX * (1 - 1 / (1 + Math.abs(distance) / OVERPULL_PX));
}

/** True when the target sits in a scroller that already scrolls along the swipe axis. */
function inCrossScroller(target: Element, panel: Element, horizontal: boolean): boolean {
  for (let node: Element | null = target; node && node !== panel; node = node.parentElement) {
    const style = getComputedStyle(node);
    const overflow = horizontal ? style.overflowX : style.overflowY;
    const scrolls = horizontal
      ? node.scrollWidth > node.clientWidth
      : node.scrollHeight > node.clientHeight;
    if (scrolls && (overflow === "auto" || overflow === "scroll")) return true;
  }
  return false;
}

/**
 * Swipe-to-close for a panel at a screen edge (Drawer, a bottom sheet). Attach `onPointerDown` to
 * the panel: a drag from `handle` (or, with `touchAnywhere`, any touch) along the closing axis moves
 * the panel with the pointer through `--swipe-offset` and `data-swiping`, which its CSS maps onto
 * `transform`. On release the panel closes past 30% of its size or on a flick — gliding the rest of
 * the way out from the release point (`data-swipe-dismissed`) — otherwise it glides back;
 * `onProgress` follows along. A drag across the axis is left to scrolling. The gesture is an extra
 * way out: the panel keeps its close button and Escape (WCAG 2.5.7).
 */
export function useSwipeDismiss({
  enabled,
  direction,
  onDismiss,
  handle,
  touchAnywhere = false,
  onProgress,
}: UseSwipeDismissOptions): { onPointerDown: (event: React.PointerEvent<HTMLElement>) => void } {
  const optionsRef = React.useRef({ direction, onDismiss, handle, touchAnywhere, onProgress });
  optionsRef.current = { direction, onDismiss, handle, touchAnywhere, onProgress };
  const cleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => () => cleanupRef.current?.(), []);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || event.defaultPrevented || !event.isPrimary || event.button !== 0) return;
      const { direction, handle, touchAnywhere } = optionsRef.current;
      const panel = event.currentTarget;
      const target = event.target as Element;
      if (target.closest(NO_DRAG)) return;
      const fromHandle = target.closest(handle) !== null && panel.contains(target.closest(handle));
      const horizontal = direction !== "down";
      if (!fromHandle) {
        if (!touchAnywhere || event.pointerType !== "touch") return;
        if (inCrossScroller(target, panel, horizontal)) return;
      }

      cleanupRef.current?.();
      const pointerId = event.pointerId;
      const sign = direction === "left" ? -1 : 1;
      const start = horizontal ? event.clientX : event.clientY;
      const startCross = horizontal ? event.clientY : event.clientX;
      let dragging = false;
      let offset = 0;
      let samples: { t: number; d: number }[] = [];
      // Measured once: the panel's size does not change while it is dragged.
      const full = horizontal ? panel.offsetWidth : panel.offsetHeight;

      const write = (value: number, progress = full > 0 ? value / full : value > 0 ? 1 : 0) => {
        panel.style.setProperty(SWIPE_OFFSET_VAR, `${value * sign}px`);
        optionsRef.current.onProgress?.(Math.min(1, Math.max(0, progress)));
      };

      const finish = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        cleanupRef.current = null;
      };

      const settle = (dismiss: boolean) => {
        delete panel.dataset.swiping;
        if (dismiss) {
          // The panel glides the rest of the way out from where the finger left it (the CSS
          // transition on `transform`); its keyframe exit, which would start over, is switched off.
          panel.dataset.swipeDismissed = "";
          write(full, 1);
          optionsRef.current.onDismiss();
        } else {
          // Back to rest: the panel CSS transitions `transform` while not swiping.
          write(0);
        }
      };

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== pointerId) return;
        const along = ((horizontal ? move.clientX : move.clientY) - start) * sign;
        const across = (horizontal ? move.clientY : move.clientX) - startCross;
        if (!dragging) {
          if (Math.abs(along) < SLOP_PX && Math.abs(across) < SLOP_PX) return;
          // Across the axis, or away from the edge outside the handle: a scroll, not a swipe.
          if (Math.abs(across) > Math.abs(along) || (!fromHandle && along < 0)) {
            finish();
            return;
          }
          dragging = true;
          panel.dataset.swiping = "";
          panel.setPointerCapture?.(pointerId);
        }
        move.preventDefault();
        offset = along > 0 ? along : rubberBand(along);
        write(offset);
        const now = move.timeStamp;
        samples.push({ t: now, d: along });
        samples = samples.filter((s) => now - s.t <= VELOCITY_WINDOW_MS);
      };

      const onUp = (up: PointerEvent) => {
        if (up.pointerId !== pointerId) return;
        finish();
        if (!dragging) return;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const elapsed = first && last ? last.t - first.t : 0;
        const velocity = elapsed > 0 ? (last.d - first.d) / elapsed : 0;
        settle(offset > full * DISTANCE_RATIO || (offset > SLOP_PX && velocity > FLICK_VELOCITY));
      };

      const onCancel = (cancel: PointerEvent) => {
        if (cancel.pointerId !== pointerId) return;
        finish();
        if (dragging) settle(false);
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      cleanupRef.current = finish;
    },
    [enabled],
  );

  return { onPointerDown };
}
