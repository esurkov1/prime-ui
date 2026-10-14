import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { motionTiming } from "@/internal/motionTiming";

import { layoutRect, ownNodes } from "./geometry";

type Box = { left: number; top: number; width: number; height: number };

/** FLIP key of the gap: it glides between places like an item, so the landing spot never jumps. */
const GAP_KEY = "\u0000gap";

/**
 * Animates layout changes of list items (`data-dnd-item`) and of the gap (`data-dnd-gap`) from the position currently on screen. Hit testing still uses
 * `layoutRect`, so visual easing never changes a drop decision.
 */
export function useFlipList(
  container: HTMLElement | null,
  layoutKey: string,
  selector: string,
  enabled: boolean,
  /**
   * A new value animates this layout change with no drag in flight: a keyboard move, or a drop the
   * owner refused gliding back.
   */
  settle = 0,
) {
  const previous = React.useRef(new Map<string, Box>());
  const running = React.useRef(new Map<HTMLElement, Animation>());
  const wasEnabled = React.useRef(false);
  const lastSettle = React.useRef(settle);

  // biome-ignore lint/correctness/useExhaustiveDependencies: layoutKey is the trigger by design.
  React.useLayoutEffect(() => {
    if (!container) return;
    const next = new Map<string, Box>();
    // The frame a drag starts is not a layout change: the gap takes the lifted item's place. And the
    // baseline recorded before it may be stale (page scrolled, fonts loaded, container resized), so
    // this frame only refreshes it.
    const justStarted = enabled && !wasEnabled.current;
    wasEnabled.current = enabled;
    const settling = settle !== lastSettle.current;
    lastSettle.current = settle;
    const reduced = prefersReducedMotion();
    const glides = (enabled && !justStarted) || settling;
    const timing = glides && !reduced ? motionTiming("base") : null;
    // Positions are kept relative to the container, so scrolling the page or the list (auto-scroll
    // during a drag) never reads as items moving.
    const box = container.getBoundingClientRect();
    // Every read first, then every write: starting a glide restyles its node, and a read after it
    // would force that style pass once per item instead of once per list.
    const measured: { node: HTMLElement; rect: Box; drawn: DOMRect; before: Box }[] = [];
    for (const node of ownNodes(container, selector)) {
      const id = node.dataset.dndItem ?? (node.dataset.dndGap !== undefined ? GAP_KEY : undefined);
      if (id === undefined) continue;
      const rect = layoutRect(node);
      if (rect.width === 0 && rect.height === 0) continue;
      const left = rect.left - box.left + container.scrollLeft;
      const top = rect.top - box.top + container.scrollTop;
      next.set(id, { left, top, width: rect.width, height: rect.height });
      const before = previous.current.get(id);
      // `animate` is missing in jsdom, where consumers test screens built with the kit.
      if (!timing || !before || typeof node.animate !== "function") continue;
      // Where the node is drawn right now, its running glide included.
      measured.push({ node, rect, drawn: node.getBoundingClientRect(), before });
    }
    for (const { node, rect, drawn, before } of measured) {
      if (!timing) break;
      const dx = before.left - (rect.left - box.left + container.scrollLeft);
      const dy = before.top - (rect.top - box.top + container.scrollTop);
      // The running glide was set against the previous layout, so the drawn box is mapped back
      // onto it: the next glide starts from what is on screen, and a reversal mid-way never
      // compounds offsets or scales.
      const drawnScaleX = rect.width > 0 ? drawn.width / rect.width : 1;
      const drawnScaleY = rect.height > 0 ? drawn.height / rect.height : 1;
      const fromWidth = before.width * drawnScaleX;
      const fromHeight = before.height * drawnScaleY;
      const fromX = dx + (drawn.left - rect.left);
      const fromY = dy + (drawn.top - rect.top);
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
    previous.current = next;
  }, [container, layoutKey, selector, enabled, settle]);

  React.useLayoutEffect(() => {
    const animations = running.current;
    return () => {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
    };
  }, []);
}
