import * as React from "react";

import { motionDurationMs, prefersReducedMotion } from "@/hooks/usePresence";

import { layoutRect } from "./geometry";

/**
 * WAAPI timing from the motion tokens (`--prime-motion-duration-<token>`,
 * `--prime-motion-easing-<curve>`), read at animation time so theme and app overrides apply;
 * WAAPI cannot take `var()`.
 */
export function motionTiming(
  duration: "fast" | "base",
  curve: "standard" | "enter" = "standard",
): KeyframeAnimationOptions {
  const easing = getComputedStyle(document.documentElement)
    .getPropertyValue(`--prime-motion-easing-${curve}`)
    .trim();
  return easing
    ? { duration: motionDurationMs(duration), easing }
    : { duration: motionDurationMs(duration) };
}

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
  const previous = React.useRef(new Map<string, { left: number; top: number }>());
  const running = React.useRef(new Map<HTMLElement, Animation>());
  const wasEnabled = React.useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: layoutKey is the trigger by design.
  React.useLayoutEffect(() => {
    if (!container) return;
    const next = new Map<string, { left: number; top: number }>();
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
    for (const node of container.querySelectorAll<HTMLElement>(selector)) {
      const id = node.dataset.dndItem ?? (node.dataset.dndGap !== undefined ? GAP_KEY : undefined);
      if (id === undefined) continue;
      const rect = layoutRect(node);
      if (rect.width === 0 && rect.height === 0) continue;
      const left = rect.left - box.left + container.scrollLeft;
      const top = rect.top - box.top + container.scrollTop;
      next.set(id, { left, top });
      const before = previous.current.get(id);
      if (!timing || !before) continue;
      const dx = before.left - left;
      const dy = before.top - top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      // A rapid reversal interrupts the old glide at its current visual offset.
      const drawn = node.getBoundingClientRect();
      const offsetX = drawn.left - rect.left;
      const offsetY = drawn.top - rect.top;
      running.current.get(node)?.cancel();
      const animation = node.animate(
        [{ transform: `translate(${dx + offsetX}px, ${dy + offsetY}px)` }, { transform: "none" }],
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
