import * as React from "react";

/** Body children that stay usable under a modal layer: live regions (the toast viewport). */
export const LIVE_REGION_ATTR = "data-prime-live-region";

/**
 * Every element some open modal layer holds inert, with the number of layers holding it and its
 * own value from before the first. Nested layers (a confirm over a drawer) may close in one commit
 * in either order: an element gets its value back only when the last layer lets go of it.
 */
const holds = new Map<HTMLElement, { count: number; inert: boolean }>();

function hold(el: HTMLElement) {
  const entry = holds.get(el);
  if (entry) entry.count += 1;
  else holds.set(el, { count: 1, inert: el.inert });
  el.inert = true;
}

function release(el: HTMLElement) {
  const entry = holds.get(el);
  if (!entry) return;
  entry.count -= 1;
  if (entry.count > 0) return;
  holds.delete(el);
  el.inert = entry.inert;
}

/**
 * While `enabled`, makes every `<body>` child inert except the one that holds `ref` (its portal)
 * and live regions, then restores the previous values. `inert` already removes the content from
 * the accessibility tree, so no `aria-hidden` is added. Part of `useModalLayer`.
 */
export function useInertSiblings(enabled: boolean, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    let portalRoot: Element | null = node;
    while (portalRoot && portalRoot.parentElement !== document.body) {
      portalRoot = portalRoot.parentElement;
    }

    const siblings = Array.from(document.body.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .filter((el) => el !== portalRoot && !el.hasAttribute(LIVE_REGION_ATTR));

    for (const el of siblings) hold(el);

    return () => {
      for (const el of siblings) release(el);
    };
  }, [enabled, ref]);
}
