import * as React from "react";

/** Body children that stay usable under a modal layer: live regions (the toast viewport). */
export const LIVE_REGION_ATTR = "data-prime-live-region";

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

    const previous = Array.from(document.body.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .filter((el) => el !== portalRoot && !el.hasAttribute(LIVE_REGION_ATTR))
      .map((el) => ({ el, inert: el.inert }));

    for (const { el } of previous) el.inert = true;

    return () => {
      for (const { el, inert } of previous) el.inert = inert;
    };
  }, [enabled, ref]);
}
