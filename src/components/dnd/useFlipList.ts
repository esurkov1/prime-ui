import * as React from "react";

import { layoutRect } from "./geometry";
import { motionAllowed, readDragMotion } from "./motion";

/**
 * Animates layout changes of list items from the position currently on screen. Hit testing still uses
 * `layoutRect`, so visual easing never changes a drop decision.
 */
export function useFlipList(
  container: HTMLElement | null,
  layoutKey: string,
  selector = "[data-dnd-item]",
  enabled = true,
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
    const animate = enabled && !justStarted && motionAllowed();
    // Positions are kept relative to the container, so scrolling the page or the list (auto-scroll
    // during a drag) never reads as items moving.
    const box = container.getBoundingClientRect();
    const motion = animate ? readDragMotion() : null;
    for (const node of container.querySelectorAll<HTMLElement>(selector)) {
      const id = node.dataset.dndItem;
      if (id === undefined) continue;
      const rect = layoutRect(node);
      if (rect.width === 0 && rect.height === 0) continue;
      const left = rect.left - box.left + container.scrollLeft;
      const top = rect.top - box.top + container.scrollTop;
      next.set(id, { left, top });
      const before = previous.current.get(id);
      if (!motion || !before || typeof node.animate !== "function") continue;
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
        { duration: motion.shift, easing: motion.easing },
      );
      running.current.set(node, animation);
      const forget = () => {
        if (running.current.get(node) === animation) running.current.delete(node);
      };
      animation.addEventListener("finish", forget, { once: true });
      animation.addEventListener("cancel", forget, { once: true });
    }
    for (const [node, animation] of running.current) {
      if (!node.isConnected || node.hasAttribute("data-lifted") || !motionAllowed()) {
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
