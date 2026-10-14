import * as React from "react";

/**
 * The touch gesture thresholds of the kit, one set for every host: a finger that rests opens a
 * row's menu (Message, ChatList) or draws a bar (Gantt); a finger that holds less before it moves
 * picks a thing up to carry (Dnd, a Gantt bar); a mouse or a pen turns a press into a drag after a
 * few pixels of travel. Gesture thresholds, not style lengths: they live here, not in tokens.
 */

/** A finger resting this long opens what a right click would (a menu) or creates in place. */
const LONG_PRESS_MS = 500;
/**
 * A finger held this long picks up what it rests on to carry it: shorter than a long press, so a
 * grab never feels like waiting, longer than the slow start of a scroll.
 */
export const DRAG_HOLD_MS = 280;
/** A finger that moves further than this (px) before its hold ends is scrolling, not pressing. */
export const PRESS_SLOP_PX = 8;
/** Pointer travel (px) that turns a mouse or pen press into a drag: past the tremor of a click. */
export const DRAG_THRESHOLD_PX = 4;

type LongPressPoint = { x: number; y: number };

type LongPressOptions = {
  /** Off: a press does nothing. */
  enabled?: boolean;
  /** The hold ended without the finger moving: the point it rests on, in client coordinates. */
  onLongPress: (point: LongPressPoint) => void;
  /** How long the finger rests. */
  delay?: number;
};

type LongPressHandlers = {
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
};

/**
 * A long press of a finger on an element (a mouse has its right click): the hold starts on a touch
 * press, ends in `onLongPress` when the finger rests for `delay`, and is given up when the finger
 * moves past `PRESS_SLOP_PX` (it scrolls), lifts or is cancelled. `takeFired()` answers once
 * whether the last press ended as a long press, so the click that follows the lift does not also
 * activate the element. Spread `handlers` on the element; a host that has its own pointer
 * handlers calls them from its own.
 */
export function useLongPress({
  enabled = true,
  onLongPress,
  delay = LONG_PRESS_MS,
}: LongPressOptions) {
  const press = React.useRef<{ x: number; y: number; timer: number } | null>(null);
  const fired = React.useRef(false);
  const latest = React.useRef(onLongPress);
  latest.current = onLongPress;

  const cancel = React.useCallback(() => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  }, []);

  React.useEffect(() => cancel, [cancel]);

  const handlers = React.useMemo<LongPressHandlers>(
    () => ({
      onPointerDown: (event) => {
        fired.current = false;
        cancel();
        if (!enabled || event.pointerType !== "touch") return;
        const point = { x: event.clientX, y: event.clientY };
        press.current = {
          ...point,
          timer: window.setTimeout(() => {
            press.current = null;
            fired.current = true;
            latest.current(point);
          }, delay),
        };
      },
      onPointerMove: (event) => {
        const start = press.current;
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > PRESS_SLOP_PX) {
          cancel();
        }
      },
      onPointerUp: cancel,
      onPointerCancel: cancel,
    }),
    [enabled, delay, cancel],
  );

  const takeFired = React.useCallback(() => {
    const was = fired.current;
    fired.current = false;
    return was;
  }, []);

  return { handlers, cancel, takeFired };
}
