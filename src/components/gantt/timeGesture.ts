import * as React from "react";

import { DRAG_THRESHOLD_PX } from "@/internal/longPress";

/**
 * What a hand does to the Gantt's time axis (`timeCore`): the wheel, Ctrl / ⌘ + wheel and a
 * trackpad pinch, Safari's gesture events, one and two fingers, and a drag along the head. The
 * chart answers three things (`TimeSurface`): zoom by a factor around a point, slide by some
 * pixels, and «the zoom came to rest». What a pixel is worth in days is the chart's business.
 *
 * A zoom is gathered and answered once a frame (a trackpad sends wheel events faster than the
 * screen refreshes; the factors multiply). A slide is answered from the event itself: it is a
 * transform on a few layers, and one left for the next frame reaches the screen a frame behind
 * the hand. Up and down stay the browser's: the rows scroll natively.
 */

/** A trackpad pinch, per px of it: the slow half of a pinch, where a hand lands, sends very little. */
const PINCH_ZOOM_PER_PX = 0.039;
/** A mouse wheel asking for a zoom (Ctrl / ⌘ held), per px: a notch arrives as one large delta. */
const WHEEL_ZOOM_PER_PX = 0.005;
/** A Ctrl + wheel delta this large is a mouse notch, not two fingers. */
const NOTCH_PX = 50;
/** A drag along the head, per px of vertical travel: down comes closer, up pulls back. */
const DRAG_ZOOM_PER_PX = 0.006;
/** A wheel delta in lines (`deltaMode` 1) as px. */
const WHEEL_LINE_PX = 16;
/**
 * A zoom wheel this long still ends the zoom — long enough that a pinch pausing between two
 * sweeps stays one gesture.
 */
const ZOOM_IDLE_MS = 180;
/** Wheel events further apart than this start another swipe (a trackpad's momentum is closer). */
const SWIPE_GAP_MS = 120;

/** One press of `+` or `−`. */
export const KEY_ZOOM_STEP = 1.25;

/** The factor one zoom wheel event zooms by; exponential, so a sweep out and back lands home. */
export function wheelZoomFactor(deltaY: number, pinch: boolean): number {
  return Math.exp(-deltaY * (pinch ? PINCH_ZOOM_PER_PX : WHEEL_ZOOM_PER_PX));
}

/** The factor of a drag along the head `dyPx` down (exponential: down and back cancel). */
export function dragZoomFactor(dyPx: number): number {
  return Math.exp(dyPx * DRAG_ZOOM_PER_PX);
}

export type TimeSurface = {
  /** Zoom by `factor` (above one is closer) holding still the day under `clientX`. */
  zoom: (factor: number, clientX: number) => void;
  /** Slide along time by `deltaPx` at the zoom standing now; positive goes later. */
  pan: (deltaPx: number) => void;
  /** A zoom gesture came to rest: the fingers left, the wheel went still, the drag ended. */
  settle: () => void;
  /** A touch pointer one of the chart's own gestures holds (a bar picked up, a bar drawn). */
  claimed: (pointerId: number) => boolean;
  /** −1 in a right-to-left chart: time runs against the screen's x. */
  dir: () => 1 | -1;
};

type Point = { x: number; y: number };
type Finger = Point & { target: EventTarget | null };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const middle = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Safari's trackpad pinch (`gesturestart` / `gesturechange`); not in the DOM types. */
type GestureEvent = UIEvent & { scale: number; clientX: number };

/**
 * Reads every time gesture over `ref` (the chart's scroller) for as long as it is mounted;
 * `headSelector` names the head, where a mouse or a pen drags to zoom and slide. The element sets
 * `touch-action: pan-y`: the browser keeps the vertical finger, the chart takes the rest.
 */
export function useTimeGestures(
  ref: React.RefObject<HTMLElement | null>,
  surface: TimeSurface,
  headSelector: string,
): void {
  const held = React.useRef(surface);
  held.current = surface;

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let factor = 1;
    let anchorX = 0;
    let frame = 0;
    let idle = 0;
    /** A zoom is under way: `settle` is owed when it comes to rest. */
    let zooming = false;

    const apply = () => {
      frame = 0;
      if (factor === 1) return;
      const value = factor;
      factor = 1;
      held.current.zoom(value, anchorX);
    };
    const zoom = (by: number, clientX: number) => {
      factor *= by;
      anchorX = clientX;
      zooming = true;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const settle = () => {
      window.clearTimeout(idle);
      if (frame) {
        cancelAnimationFrame(frame);
        apply();
      }
      if (!zooming) return;
      zooming = false;
      held.current.settle();
    };

    // ── The wheel ──
    let swipeAt = Number.NEGATIVE_INFINITY;
    let sideways = false;
    let gesture = false;
    const onWheel = (event: WheelEvent) => {
      const unit =
        event.deltaMode === 1 ? WHEEL_LINE_PX : event.deltaMode === 2 ? node.clientHeight : 1;
      const dx = event.deltaX * unit;
      const dy = event.deltaY * unit;
      if (event.ctrlKey || event.metaKey) {
        if (gesture) return;
        event.preventDefault();
        zoom(wheelZoomFactor(dy, event.ctrlKey && Math.abs(dy) < NOTCH_PX), event.clientX);
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, ZOOM_IDLE_MS);
        return;
      }
      // Which events are cancelled is decided once a swipe, at its first event: an engine decides
      // there whether the page scrolls for the rest of it, and a swipe cancelled in part jams the
      // vertical axis. A sideways swipe is the chart's — the rows it also carries up or down are
      // scrolled here, and the browser never takes it for «back».
      if (event.timeStamp - swipeAt > SWIPE_GAP_MS) sideways = Math.abs(dx) > Math.abs(dy);
      swipeAt = event.timeStamp;
      let travel = dx;
      if (event.shiftKey && dx === 0) travel = dy;
      if (sideways || (event.shiftKey && dx === 0)) {
        event.preventDefault();
        if (!event.shiftKey && dy !== 0) node.scrollTop += dy;
      }
      if (travel !== 0) held.current.pan(travel * held.current.dir());
    };

    // ── Safari's trackpad pinch ──
    let gestureScale = 1;
    const onGestureStart = (event: Event) => {
      event.preventDefault();
      gesture = true;
      gestureScale = 1;
    };
    const onGestureChange = (event: Event) => {
      event.preventDefault();
      const { scale, clientX } = event as GestureEvent;
      if (!gesture || !(scale > 0)) return;
      zoom(scale / gestureScale, clientX);
      gestureScale = scale;
    };
    const onGestureEnd = (event: Event) => {
      event.preventDefault();
      gesture = false;
      settle();
    };

    // ── Fingers, and a drag along the head ──
    const fingers = new Map<number, Finger>();
    /** Two fingers: their distance and middle the last time they moved. */
    let pinch: { distance: number; middle: Point } | null = null;
    /** One finger sliding the view: the x it was last at. */
    let slide: { pointerId: number; x: number; from: Point; moving: boolean } | null = null;
    let head: { pointerId: number; x: number; y: number; from: Point; moving: boolean } | null =
      null;
    /** The click that ends a drag along the head. */
    let swallow = false;
    /** The `pointercancel` the pinch sends to what a finger began is its own: it ends nothing. */
    let cancelling = false;

    const onPointerDown = (event: PointerEvent) => {
      if (cancelling) return;
      swallow = false;
      if (event.pointerType !== "touch") {
        const target = event.target as Element | null;
        if (event.button !== 0 || !target?.closest?.(headSelector)) return;
        // A press on the dates is a gesture: the browser starts no selection under it.
        event.preventDefault();
        head = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          from: { x: event.clientX, y: event.clientY },
          moving: false,
        };
        return;
      }
      fingers.set(event.pointerId, { x: event.clientX, y: event.clientY, target: event.target });
      if (fingers.size === 1) {
        slide = {
          pointerId: event.pointerId,
          x: event.clientX,
          from: { x: event.clientX, y: event.clientY },
          moving: false,
        };
        return;
      }
      if (fingers.size !== 2 || pinch) return;
      const [a, b] = [...fingers.values()];
      if (distance(a, b) <= 0) return;
      // The fingers are the pinch's: what one of them began (a long press, a drag) is cancelled.
      cancelling = true;
      for (const [pointerId, finger] of fingers) {
        finger.target?.dispatchEvent(
          new PointerEvent("pointercancel", { bubbles: true, pointerId }),
        );
      }
      cancelling = false;
      slide = null;
      pinch = { distance: distance(a, b), middle: middle(a, b) };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (head && event.pointerId === head.pointerId) {
        const dx = event.clientX - head.x;
        const dy = event.clientY - head.y;
        if (!head.moving) {
          const travel = Math.hypot(event.clientX - head.from.x, event.clientY - head.from.y);
          if (travel < DRAG_THRESHOLD_PX) return;
          head.moving = true;
          (event.target as Element | null)?.setPointerCapture?.(event.pointerId);
        }
        head.x = event.clientX;
        head.y = event.clientY;
        if (dx !== 0) held.current.pan(-dx * held.current.dir());
        // The day under the hand travels with it: a zoom still to come holds that day.
        if (dy !== 0) zoom(dragZoomFactor(dy), head.x);
        else if (frame) anchorX = head.x;
        return;
      }
      const finger = fingers.get(event.pointerId);
      if (!finger) return;
      finger.x = event.clientX;
      finger.y = event.clientY;
      if (pinch && fingers.size >= 2) {
        const [a, b] = [...fingers.values()];
        const now = { distance: distance(a, b), middle: middle(a, b) };
        // The middle travels: the view slides with it; the distance changes: it zooms about it.
        held.current.pan(-(now.middle.x - pinch.middle.x) * held.current.dir());
        if (now.distance > 0 && pinch.distance > 0)
          zoom(now.distance / pinch.distance, now.middle.x);
        pinch = now;
        return;
      }
      if (!slide || slide.pointerId !== event.pointerId) return;
      if (held.current.claimed(event.pointerId)) {
        slide = null;
        return;
      }
      if (!slide.moving) {
        const dx = Math.abs(event.clientX - slide.from.x);
        if (dx < DRAG_THRESHOLD_PX || dx < Math.abs(event.clientY - slide.from.y)) return;
        slide.moving = true;
      }
      held.current.pan(-(event.clientX - slide.x) * held.current.dir());
      slide.x = event.clientX;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (cancelling) return;
      if (head && event.pointerId === head.pointerId) {
        const moved = head.moving;
        head = null;
        swallow = moved;
        if (moved) settle();
        return;
      }
      if (!fingers.delete(event.pointerId)) return;
      if (slide?.pointerId === event.pointerId) slide = null;
      if (pinch && fingers.size < 2) {
        pinch = null;
        settle();
      }
    };

    // Two fingers, or one sliding the view, are the chart's: the page neither pans nor zooms.
    const onTouchMove = (event: TouchEvent) => {
      if ((pinch || slide?.moving) && event.cancelable) event.preventDefault();
    };
    // A drag along the head is not a click on what lies under it.
    const onClick = (event: MouseEvent) => {
      if (!swallow) return;
      swallow = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const capture = { capture: true };
    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("gesturestart", onGestureStart);
    node.addEventListener("gesturechange", onGestureChange);
    node.addEventListener("gestureend", onGestureEnd);
    node.addEventListener("pointerdown", onPointerDown, capture);
    node.addEventListener("pointermove", onPointerMove, capture);
    node.addEventListener("pointerup", onPointerUp, capture);
    node.addEventListener("pointercancel", onPointerUp, capture);
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("click", onClick, capture);
    return () => {
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("gesturestart", onGestureStart);
      node.removeEventListener("gesturechange", onGestureChange);
      node.removeEventListener("gestureend", onGestureEnd);
      node.removeEventListener("pointerdown", onPointerDown, capture);
      node.removeEventListener("pointermove", onPointerMove, capture);
      node.removeEventListener("pointerup", onPointerUp, capture);
      node.removeEventListener("pointercancel", onPointerUp, capture);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("click", onClick, capture);
      window.clearTimeout(idle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, headSelector]);
}
