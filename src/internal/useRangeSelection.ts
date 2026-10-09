import * as React from "react";

import { autoScrollStep, scrollableAncestors } from "@/internal/edgeAutoScroll";

/** A drag paints along the list: only up and down scroll it. */
const VERTICAL = { x: false, y: true };

export type RangeSelectionOptions<K> = {
  /**
   * The items in their visual order: ranges and drags run over them. A function is read at the
   * moment of the press (items whose order lives in the DOM).
   */
  keys: readonly K[] | (() => readonly K[]);
  isSelected: (key: K) => boolean;
  /** Set every key of `keys` to `value` (one commit per pointer step or click). */
  apply: (keys: K[], value: boolean) => void;
  /** The list: a drag paints only items inside it. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** The element under the pointer that stands for an item, with its index in `keys`. */
  hit: (element: Element) => number | null;
  /** A finger sliding from the pressed item paints too (its start sets `touch-action: none`). */
  touch?: boolean;
  /** The list's scroller follows a drag held at its top or bottom edge. */
  autoScroll?: boolean;
};

export type RangeSelectionHandlers = {
  /** A press on an item: starts a drag that sets every item it passes to the first one's new state. */
  onPointerDown: (index: number, event: React.PointerEvent<HTMLElement>) => void;
  /**
   * A click on an item: toggles it, Shift sets the range from the anchor (the last clicked or
   * dragged-over item) to it. A click that ends a drag is no toggle (the drag applied it).
   */
  onClick: (index: number, event: { shiftKey: boolean; detail: number }) => void;
};

/**
 * Selection of a list like a file manager's (DataTable rows, chat messages in selection mode):
 * click toggles, Shift+click selects the range from the anchor, press-and-drag (mouse, pen, a
 * sliding finger when `touch`) paints every item it passes with the first item's new state, and a
 * drag held at the scroller's edge scrolls it. The handlers are stable across renders.
 */
export function useRangeSelection<K>(options: RangeSelectionOptions<K>) {
  const latest = React.useRef(options);
  latest.current = options;
  const [dragging, setDragging] = React.useState(false);
  const session = React.useRef<{
    anchor: K | null;
    stop: (() => void) | null;
    dragged: boolean;
  }>({ anchor: null, stop: null, dragged: false });
  React.useEffect(() => () => session.current.stop?.(), []);

  const handlers = React.useMemo<RangeSelectionHandlers>(() => {
    const keysNow = () => {
      const { keys } = latest.current;
      return typeof keys === "function" ? keys() : keys;
    };
    const applyRange = (from: number, to: number, value: boolean) => {
      const { apply } = latest.current;
      const keys = keysNow();
      const range: K[] = [];
      for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
        const key = keys[i];
        if (key !== undefined) range.push(key);
      }
      apply(range, value);
    };

    return {
      onPointerDown(index, event) {
        const { isSelected, containerRef, touch, autoScroll } = latest.current;
        if (event.button !== 0 || (event.pointerType === "touch" && !touch)) return;
        const startKey = keysNow()[index];
        if (startKey === undefined) return;
        // No native text selection or focus jump while pressing / dragging.
        if (event.pointerType !== "touch") event.preventDefault();
        // A finger keeps its pointer for the slide (the browser would take it for a scroll).
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        const value = !isSelected(startKey);
        session.current.dragged = false;
        let last = index;
        let x = event.clientX;
        let y = event.clientY;
        let frame = 0;
        const scrollers = autoScroll ? scrollableAncestors(containerRef.current) : [];
        let lastTime = 0;

        const paintAt = (clientX: number, clientY: number) => {
          const element = document.elementFromPoint(clientX, clientY);
          const container = latest.current.containerRef.current;
          if (!element || !container?.contains(element)) return;
          const next = latest.current.hit(element);
          if (next === null || next === last) return;
          if (!session.current.dragged) {
            session.current.dragged = true;
            setDragging(true);
          }
          applyRange(last, next, value);
          last = next;
          session.current.anchor = keysNow()[next] ?? session.current.anchor;
        };
        const scroll = (time: number) => {
          frame = 0;
          const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16;
          lastTime = time;
          if (!autoScrollStep(scrollers, { x, y }, elapsed, VERTICAL)) {
            lastTime = 0;
            return;
          }
          paintAt(x, y);
          frame = requestAnimationFrame(scroll);
        };
        const onMove = (move: PointerEvent) => {
          x = move.clientX;
          y = move.clientY;
          paintAt(move.clientX, move.clientY);
          if (scrollers.length > 0 && !frame) frame = requestAnimationFrame(scroll);
        };
        const stop = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", stop);
          window.removeEventListener("pointercancel", stop);
          if (frame) cancelAnimationFrame(frame);
          session.current.stop = null;
          setDragging(false);
        };
        session.current.stop?.();
        session.current.stop = stop;
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
      },

      onClick(index, event) {
        // A drag already applied its range; a pointer click that ends it is no toggle.
        if (session.current.dragged && event.detail > 0) {
          session.current.dragged = false;
          return;
        }
        const { isSelected } = latest.current;
        const keys = keysNow();
        const key = keys[index];
        if (key === undefined) return;
        const anchorIndex =
          event.shiftKey && session.current.anchor !== null
            ? keys.indexOf(session.current.anchor)
            : -1;
        applyRange(anchorIndex >= 0 ? anchorIndex : index, index, !isSelected(key));
        session.current.anchor = key;
      },
    };
  }, []);

  return { handlers, dragging };
}
