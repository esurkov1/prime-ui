import * as React from "react";

import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

/** What holds a panel that could otherwise swipe away (a dialog `Guard`). */
type SwipeGuard = "busy" | "dirty" | null;

export type UseSwipeDismissOptions = {
  /**
   * The gesture exists: the panel draws a grab handle and a drag can dismiss it. Off where the
   * panel takes no swipe at all (a wide viewport, `closeOnOutsideClick={false}`).
   */
  enabled: boolean;
  /**
   * `busy` — no drag starts (the panel carries `data-swipe-disabled`: no grab cursor, the browser
   * pans again); `dirty` — a drag past the threshold glides back and asks through `onDismiss` (the
   * host opens its «discard changes?» confirm) instead of leaving.
   */
  guard?: SwipeGuard;
  /** A drag released past the threshold, or a flick: the host's dismiss request. */
  onDismiss: () => void;
  /**
   * The scrim under the panel: it follows the drag through `--swipe-progress` (0 at rest … 1 off
   * the edge) and mirrors `data-swiping` / `data-swipe-dismissed`, so its CSS fades with the panel.
   */
  scrimRef?: React.RefObject<HTMLElement | null>;
};

export type SwipeDismiss = {
  /** The gesture exists: render the grab handle (`SheetHandle`). */
  enabled: boolean;
  /** Attach to the panel. */
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  /** Spread on the panel: `data-swipe-disabled` while the guard is busy. */
  panelProps: { "data-swipe-disabled"?: "" };
};

/** The attribute of the grab handle: a drag starts on it, or on the header right after it. */
export const SWIPE_HANDLE_ATTRIBUTE = "data-swipe-handle";

/** The zones a drag starts from: the grab handle and the panel's header right under it. */
const HANDLE = `[${SWIPE_HANDLE_ATTRIBUTE}], [${SWIPE_HANDLE_ATTRIBUTE}] + header`;

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
const SWIPE_OFFSET_VAR = "--swipe-offset";

/**
 * A drag against the closing direction moves the panel ever more stiffly, never past
 * `--prime-space-6`: the panel CSS continues its fill this far past the screen edge, so it never
 * comes away from the edge.
 */
function rubberBand(distance: number): number {
  const cap = TOKEN_DEFAULTS["--prime-space-6"];
  return -cap * (1 - 1 / (1 + Math.abs(distance) / cap));
}

/** Sets or clears a data attribute on the panel and the scrim that follows it. */
function mark(elements: (HTMLElement | null | undefined)[], name: string, on: boolean) {
  for (const el of elements) {
    if (!el) continue;
    if (on) el.setAttribute(name, "");
    else el.removeAttribute(name);
  }
}

/**
 * Swipe-down-to-close for a panel at the bottom edge (Sheet, Modal and floating layers as phone
 * sheets). Attach `onPointerDown` to the panel: a drag down from the grab handle (or the header
 * right under it) moves the panel with the pointer through `--swipe-offset` and `data-swiping`,
 * which its CSS maps onto `transform`. On release the panel closes past 30% of its height or on a
 * flick — gliding the rest of the way out from the release point (`data-swipe-dismissed`) —
 * otherwise it glides back; the scrim follows along. A `dirty` panel glides back and asks instead.
 * A sideways drag is left to scrolling. The gesture is an extra way out: the panel keeps Escape
 * and the scrim (WCAG 2.5.7).
 */
export function useSwipeDismiss({
  enabled,
  guard = null,
  onDismiss,
  scrimRef,
}: UseSwipeDismissOptions): SwipeDismiss {
  const optionsRef = React.useRef({ onDismiss, guard, scrimRef });
  optionsRef.current = { onDismiss, guard, scrimRef };
  const cleanupRef = React.useRef<(() => void) | null>(null);
  const active = enabled && guard !== "busy";

  React.useEffect(() => () => cleanupRef.current?.(), []);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!active || event.defaultPrevented || !event.isPrimary || event.button !== 0) return;
      const panel = event.currentTarget;
      const target = event.target as Element;
      if (target.closest(NO_DRAG)) return;
      const zone = target.closest(HANDLE);
      if (zone === null || !panel.contains(zone)) return;

      cleanupRef.current?.();
      const scrim = optionsRef.current.scrimRef?.current;
      const pointerId = event.pointerId;
      const start = event.clientY;
      const startCross = event.clientX;
      let dragging = false;
      let offset = 0;
      let samples: { t: number; d: number }[] = [];
      // Measured once: the panel's size does not change while it is dragged.
      const full = panel.offsetHeight;

      const write = (value: number, progress = full > 0 ? value / full : value > 0 ? 1 : 0) => {
        panel.style.setProperty(SWIPE_OFFSET_VAR, `${value}px`);
        scrim?.style.setProperty("--swipe-progress", `${Math.min(1, Math.max(0, progress))}`);
      };

      const finish = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        cleanupRef.current = null;
      };

      const settle = (dismiss: boolean) => {
        mark([panel, scrim], "data-swiping", false);
        if (dismiss && optionsRef.current.guard !== "dirty") {
          // The panel glides the rest of the way out from where the finger left it (the CSS
          // transition on `transform`); its keyframe exit, which would start over, is switched off.
          mark([panel, scrim], "data-swipe-dismissed", true);
          write(full, 1);
          optionsRef.current.onDismiss();
          return;
        }
        // Back to rest: the panel CSS transitions `transform` while not swiping. A dirty panel
        // asks on its way back.
        write(0);
        if (dismiss) optionsRef.current.onDismiss();
      };

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== pointerId) return;
        const along = move.clientY - start;
        const across = move.clientX - startCross;
        if (!dragging) {
          if (Math.abs(along) < SLOP_PX && Math.abs(across) < SLOP_PX) return;
          // Sideways: a scroll, not a swipe.
          if (Math.abs(across) > Math.abs(along)) {
            finish();
            return;
          }
          dragging = true;
          mark([panel, scrim], "data-swiping", true);
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
    [active],
  );

  return {
    enabled,
    onPointerDown,
    panelProps: enabled && guard === "busy" ? { "data-swipe-disabled": "" } : {},
  };
}
