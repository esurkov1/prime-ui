/**
 * The boxes a person can scroll around an element: the one walk behind a layer that follows its
 * anchor through scrolling (`usePosition`) and a gesture that scrolls the box under the pointer
 * (`edgeAutoScroll`). `hidden` and `clip` are not scrolling: a locked region or one whose content
 * fits never counts.
 */

const SCROLLS = /^(auto|scroll|overlay)$/;

export type ScrollAxes = { x: boolean; y: boolean };

/** The axes a person can scroll `element` along. */
export function scrollAxes(element: Element): ScrollAxes {
  const style = getComputedStyle(element);
  return { x: SCROLLS.test(style.overflowX), y: SCROLLS.test(style.overflowY) };
}

/** Scrollable boxes from `element` itself up to the root, innermost first. */
export function scrollableAncestors(element: Element | null): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (let node = element; node instanceof HTMLElement; node = node.parentElement) {
    const axes = scrollAxes(node);
    if (axes.x || axes.y) found.push(node);
  }
  return found;
}

/** `window` and the scrolling ancestors of the anchor: where a fixed layer listens for scroll. */
export function getScrollContainers(
  node: Element | null,
): Array<Element | Window | VisualViewport> {
  if (typeof window === "undefined") return [];
  const out: Array<Element | Window | VisualViewport> = [
    window,
    ...scrollableAncestors(node?.parentElement ?? null),
  ];
  if (window.visualViewport) out.push(window.visualViewport);
  return out;
}
