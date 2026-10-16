import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { motionTiming } from "@/internal/motionTiming";

import { ownNodes } from "./geometry";

/**
 * A table's head row whose cells reorder (`Dnd.Sortable as="tr"`): every cell keeps its column in
 * the layout while one is carried, so the body under it stays still. The others are drawn shifted
 * aside by transforms to where they stand if the drag ends now, and the carried cell — drawn as the
 * kit's gap, see CSS — to the place it would take.
 */

const ITEM = "[data-dnd-item]";

type Shift = { animation: Animation; x: number };

/** The drawn horizontal offset of a node: its running shift, read as it is drawn now. */
function drawnX(node: HTMLElement): number {
  const transform = getComputedStyle(node).transform;
  if (!transform || transform === "none") return 0;
  try {
    return new DOMMatrixReadOnly(transform).m41;
  } catch {
    return 0;
  }
}

/** `order` with `id` moved in front of `before` (`null`: last; `id` itself: where it is). */
function visualOrder(order: readonly string[], id: string, before: string | null): string[] {
  if (before === id) return [...order];
  const rest = order.filter((each) => each !== id);
  const at = before === null ? rest.length : rest.indexOf(before);
  rest.splice(at === -1 ? rest.length : at, 0, id);
  return rest;
}

const isRtl = (row: HTMLElement) => getComputedStyle(row).direction === "rtl";

/**
 * Shifts the cells of `row` while `draggingId` is carried and the gap stands in front of
 * `gapBefore`. A drop (the order changed) takes the shifts off in the same frame the cells take
 * their new places, which are the places they were drawn at (each column keeps its width); a
 * cancel glides them back.
 */
export function useInPlaceShift(
  row: HTMLElement | null,
  order: readonly string[],
  draggingId: string | null,
  gapBefore: string | null | undefined,
) {
  const shifts = React.useRef(new Map<HTMLElement, Shift>());
  /** The order when the drag began: a release with another order is a drop. */
  const startOrder = React.useRef<string | null>(null);
  const orderKey = order.join("\u0000");

  React.useLayoutEffect(() => {
    if (!row) return;
    const running = shifts.current;
    const reduced = prefersReducedMotion();
    const glide = (node: HTMLElement, to: number) => {
      const current = running.get(node);
      if (current && Math.abs(current.x - to) < 0.5) return;
      if (!current && Math.abs(to) < 0.5) return;
      // `animate` is missing in jsdom, where consumers test screens built with the kit.
      if (typeof node.animate !== "function") return;
      const from = current ? drawnX(node) : 0;
      current?.animation.cancel();
      // A finished shift stays applied (`forwards`) and stays an animation, so `layoutRect`
      // reads the cell's own column, never its drawn place.
      const animation = node.animate(
        [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
        { ...(reduced ? { duration: 0 } : motionTiming("base")), fill: "forwards" },
      );
      running.set(node, { animation, x: to });
      if (Math.abs(to) < 0.5) {
        // Back home: nothing stays applied.
        animation.addEventListener(
          "finish",
          () => {
            if (running.get(node)?.animation !== animation) return;
            animation.cancel();
            running.delete(node);
          },
          { once: true },
        );
      }
    };

    if (draggingId === null || gapBefore === undefined) {
      const dropped = startOrder.current !== null && startOrder.current !== orderKey;
      startOrder.current = null;
      for (const [node, shift] of running) {
        if (dropped || reduced || !node.isConnected) {
          shift.animation.cancel();
          running.delete(node);
        } else {
          glide(node, 0);
        }
      }
      return;
    }
    startOrder.current ??= orderKey;
    const cells = new Map(
      ownNodes(row, ITEM).map((node) => [node.dataset.dndItem ?? "", node] as const),
    );
    const widthOf = (id: string) => cells.get(id)?.offsetWidth ?? 0;
    const startOf = (list: readonly string[]) => {
      const at = new Map<string, number>();
      let sum = 0;
      for (const id of list) {
        at.set(id, sum);
        sum += widthOf(id);
      }
      return at;
    };
    const now = startOf(order);
    const then = startOf(visualOrder(order, draggingId, gapBefore));
    const sign = isRtl(row) ? -1 : 1;
    for (const [id, node] of cells) {
      glide(node, sign * ((then.get(id) ?? 0) - (now.get(id) ?? 0)));
    }
  }, [row, orderKey, order, draggingId, gapBefore]);

  React.useLayoutEffect(() => {
    const running = shifts.current;
    return () => {
      for (const shift of running.values()) shift.animation.cancel();
      running.clear();
    };
  }, []);
}
