import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { motionTiming } from "@/internal/motionTiming";

/** A box in viewport coordinates. */
type LayoutBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

type Box = { left: number; top: number; width: number; height: number };

/** A running glide on the element: its scale and move, and the point it scales around. */
function currentTransform(
  element: Element,
): { a: number; d: number; tx: number; ty: number; ox: number; oy: number } | null {
  // Only an element mid-animation is drawn away from its layout box; skipping the style read for the
  // rest keeps a long list cheap to measure on every pointer move.
  // `getAnimations` is missing in jsdom, where consumers test screens built with the kit.
  if (!element.getAnimations || element.getAnimations().length === 0) return null;
  const style = getComputedStyle(element);
  if (!style.transform || style.transform === "none") return null;
  try {
    const m = new DOMMatrixReadOnly(style.transform);
    const [ox = 0, oy = 0] = style.transformOrigin.split(" ").map((v) => Number.parseFloat(v) || 0);
    return { a: m.a || 1, d: m.d || 1, tx: m.m41, ty: m.m42, ox, oy };
  } catch {
    return null;
  }
}

/**
 * Where an element sits in the layout with any animation transform taken back out — its glide and
 * its growth (a tile growing into the cover cell is drawn smaller until it gets there). A decision
 * that depends on where things stand (a drop position) is measured against this: reading the drawn
 * box makes each answer depend on the glide the previous answer started.
 */
export function layoutRect(element: Element): LayoutBox {
  const { left, top, width, height } = element.getBoundingClientRect();
  const t = currentTransform(element);
  if (!t) return { left, top, right: left + width, bottom: top + height, width, height };
  // drawn = layout scaled by (a, d) around the origin, then moved by (tx, ty).
  const w = width / t.a;
  const h = height / t.d;
  const l = left - t.tx - t.ox * (1 - t.a);
  const tp = top - t.ty - t.oy * (1 - t.d);
  return { left: l, top: tp, right: l + w, bottom: tp + h, width: w, height: h };
}

type FlipListOptions = {
  /** The element the items move inside; positions are kept relative to it. */
  container: HTMLElement | null;
  /** The items that glide, in the container (read on every layout change). */
  nodes: (container: HTMLElement) => Iterable<HTMLElement>;
  /** The stable key of an item; an item without one does not glide. */
  keyOf: (node: HTMLElement) => string | undefined;
  /**
   * Changes when the items may have moved. While `enabled`, every change glides; the first one
   * after `enabled` turns on only takes the baseline (the frame a drag starts is no layout change).
   */
  layoutKey?: string;
  enabled?: boolean;
  /** A new value glides this layout change while not `enabled` (a keyboard move, a rollback). */
  settle?: number;
};

/**
 * Animates layout changes of a list's items from the position currently on screen (FLIP): the
 * items of a sortable list and its drop gap, a list whose order changed, cards a refused move
 * puts back. `capture()` reads where the items stand now; the next commit glides every item that
 * moved from there — a host calls it right before it changes the order itself. A glide reversed
 * midway starts from where the item is drawn, so offsets never compound. Reduced motion: nothing
 * glides.
 */
export function useFlipList({
  container,
  nodes,
  keyOf,
  layoutKey = "",
  enabled = false,
  settle = 0,
}: FlipListOptions): { capture: () => void } {
  const previous = React.useRef(new Map<string, Box>());
  const running = React.useRef(new Map<HTMLElement, Animation>());
  const wasEnabled = React.useRef(false);
  const lastSettle = React.useRef(settle);
  const lastKey = React.useRef(layoutKey);
  const [captured, setCaptured] = React.useState(0);
  const lastCaptured = React.useRef(captured);
  const read = React.useRef({ nodes, keyOf });
  React.useLayoutEffect(() => {
    read.current = { nodes, keyOf };
  });

  /** Every keyed item with its layout box, relative to the container. */
  const measure = React.useCallback((root: HTMLElement) => {
    const box = root.getBoundingClientRect();
    const out: { node: HTMLElement; key: string; rect: LayoutBox; at: Box }[] = [];
    for (const node of read.current.nodes(root)) {
      const key = read.current.keyOf(node);
      if (key === undefined) continue;
      const rect = layoutRect(node);
      if (rect.width === 0 && rect.height === 0) continue;
      // Relative to the container, so scrolling the page or the list (auto-scroll during a drag)
      // never reads as items moving.
      const left = rect.left - box.left + root.scrollLeft;
      const top = rect.top - box.top + root.scrollTop;
      out.push({ node, key, rect, at: { left, top, width: rect.width, height: rect.height } });
    }
    return out;
  }, []);

  const capture = React.useCallback(() => {
    if (!container) return;
    previous.current = new Map(measure(container).map(({ key, at }) => [key, at]));
    setCaptured((value) => value + 1);
  }, [container, measure]);

  React.useLayoutEffect(() => {
    if (!container) return;
    // The frame a drag starts is not a layout change: the gap takes the lifted item's place. And the
    // baseline recorded before it may be stale (page scrolled, fonts loaded, container resized), so
    // this frame only refreshes it.
    const justStarted = enabled && !wasEnabled.current;
    wasEnabled.current = enabled;
    const settling = settle !== lastSettle.current || captured !== lastCaptured.current;
    lastSettle.current = settle;
    lastCaptured.current = captured;
    const moved = layoutKey !== lastKey.current;
    lastKey.current = layoutKey;
    const reduced = prefersReducedMotion();
    const glides = (enabled && !justStarted && moved) || settling;
    const timing = glides && !reduced ? motionTiming("base") : null;
    const items = measure(container);
    // Every read first, then every write: starting a glide restyles its node, and a read after it
    // would force that style pass once per item instead of once per list.
    const moves: { node: HTMLElement; rect: LayoutBox; drawn: DOMRect; before: Box; at: Box }[] =
      [];
    for (const { node, rect, key, at } of items) {
      const before = previous.current.get(key);
      // `animate` is missing in jsdom, where consumers test screens built with the kit.
      if (!timing || !before || typeof node.animate !== "function") continue;
      // Where the node is drawn right now, its running glide included.
      moves.push({ node, rect, drawn: node.getBoundingClientRect(), before, at });
    }
    for (const { node, rect, drawn, before, at } of moves) {
      if (!timing) break;
      // The running glide was set against the previous layout, so the drawn box is mapped back
      // onto it: the next glide starts from what is on screen, and a reversal mid-way never
      // compounds offsets or scales.
      const drawnScaleX = rect.width > 0 ? drawn.width / rect.width : 1;
      const drawnScaleY = rect.height > 0 ? drawn.height / rect.height : 1;
      const fromWidth = before.width * drawnScaleX;
      const fromHeight = before.height * drawnScaleY;
      const fromX = before.left - at.left + (drawn.left - rect.left);
      const fromY = before.top - at.top + (drawn.top - rect.top);
      // A cell of a grid may change size on the way. One that grows (a tile that becomes the cover)
      // grows from its old box: it is drawn at its new, larger size, so the scaled-down start stays
      // sharp. One that shrinks would have to be blown up past the size it is drawn at, blurring the
      // picture and its labels: it takes its new size at once and glides there. No fade: a pointer
      // crossing the cover's edge back and forth would make it blink.
      const sx = fromWidth / rect.width;
      const sy = fromHeight / rect.height;
      const resized = Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01;
      const grows = resized && sx <= 1 && sy <= 1;
      if (Math.abs(fromX) < 1 && Math.abs(fromY) < 1 && !resized) continue;
      running.current.get(node)?.cancel();
      const from = `translate(${fromX}px, ${fromY}px)`;
      const animation = node.animate(
        grows
          ? [
              { transform: `${from} scale(${sx}, ${sy})`, transformOrigin: "0 0" },
              { transform: "none", transformOrigin: "0 0" },
            ]
          : [{ transform: from }, { transform: "none" }],
        timing,
      );
      running.current.set(node, animation);
      const forget = () => {
        if (running.current.get(node) === animation) running.current.delete(node);
      };
      animation.addEventListener("finish", forget, { once: true });
      animation.addEventListener("cancel", forget, { once: true });
    }
    for (const [node, animation] of running.current) {
      if (!node.isConnected || node.hasAttribute("data-lifted") || reduced) {
        animation.cancel();
        running.current.delete(node);
      }
    }
    previous.current = new Map(items.map(({ key, at }) => [key, at]));
  }, [container, layoutKey, enabled, settle, captured, measure]);

  React.useLayoutEffect(() => {
    const animations = running.current;
    return () => {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
    };
  }, []);

  return { capture };
}
