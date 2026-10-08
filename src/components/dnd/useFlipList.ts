import * as React from "react";

import { motionDurationMs, prefersReducedMotion } from "@/hooks/usePresence";

import { layoutRect, ownNodes } from "./geometry";

/**
 * WAAPI timing from the motion tokens (`--prime-motion-duration-<token>`,
 * `--prime-motion-easing-<curve>`), read at animation time so theme and app overrides apply;
 * WAAPI cannot take `var()`.
 */
export function motionTiming(
  duration: "fast" | "base",
  curve: "standard" | "enter" | "exit" = "standard",
): KeyframeAnimationOptions {
  const easing = getComputedStyle(document.documentElement)
    .getPropertyValue(`--prime-motion-easing-${curve}`)
    .trim();
  return easing
    ? { duration: motionDurationMs(duration), easing }
    : { duration: motionDurationMs(duration) };
}

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
) {
  const previous = React.useRef(new Map<string, Box>());
  const running = React.useRef(new Map<HTMLElement, Animation>());
  const wasEnabled = React.useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: layoutKey is the trigger by design.
  React.useLayoutEffect(() => {
    if (!container) return;
    const next = new Map<string, Box>();
    // The frame a drag starts is not a layout change: the gap takes the lifted item's place. And the
    // baseline recorded before it may be stale (page scrolled, fonts loaded, container resized), so
    // this frame only refreshes it.
    const justStarted = enabled && !wasEnabled.current;
    wasEnabled.current = enabled;
    const reduced = prefersReducedMotion();
    const timing = enabled && !justStarted && !reduced ? motionTiming("base") : null;
    // Positions are kept relative to the container, so scrolling the page or the list (auto-scroll
    // during a drag) never reads as items moving.
    const box = container.getBoundingClientRect();
    for (const node of ownNodes(container, selector)) {
      const id = node.dataset.dndItem ?? (node.dataset.dndGap !== undefined ? GAP_KEY : undefined);
      if (id === undefined) continue;
      const rect = layoutRect(node);
      if (rect.width === 0 && rect.height === 0) continue;
      const left = rect.left - box.left + container.scrollLeft;
      const top = rect.top - box.top + container.scrollTop;
      next.set(id, { left, top, width: rect.width, height: rect.height });
      const before = previous.current.get(id);
      if (!timing || !before) continue;
      const dx = before.left - left;
      const dy = before.top - top;
      // Where the node is drawn right now, its running glide included. That glide was set against
      // the previous layout, so the drawn box is mapped back onto it: the next glide starts from
      // what is on screen, and a reversal mid-way never compounds offsets or scales.
      const drawn = node.getBoundingClientRect();
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
  }, [container, layoutKey, selector, enabled]);

  React.useLayoutEffect(() => {
    const animations = running.current;
    return () => {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
    };
  }, []);
}
