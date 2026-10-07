import * as React from "react";

/**
 * While `enabled`, makes every `<body>` child except the portal that holds `ref` inert and
 * `aria-hidden`, then restores the previous values. Shared by Modal and Drawer.
 */
export function useInertSiblings(enabled: boolean, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    let portalRoot: Element | null = node;
    while (portalRoot && portalRoot.parentElement !== document.body) {
      portalRoot = portalRoot.parentElement;
    }

    const previous = Array.from(document.body.children)
      .filter((el) => el !== portalRoot)
      .map((el) => ({
        el: el as HTMLElement,
        inert: (el as HTMLElement).inert,
        ariaHidden: el.getAttribute("aria-hidden"),
      }));

    for (const { el } of previous) {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    }

    return () => {
      for (const { el, inert, ariaHidden } of previous) {
        el.inert = inert;
        if (ariaHidden === null) el.removeAttribute("aria-hidden");
        else el.setAttribute("aria-hidden", ariaHidden);
      }
    };
  }, [enabled, ref]);
}
