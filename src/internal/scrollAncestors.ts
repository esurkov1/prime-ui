const SCROLLABLE = /^(auto|scroll|overlay)$/;

/** `window` and the scrolling ancestors of the anchor: where a fixed layer listens for scroll. */
export function getScrollContainers(
  node: Element | null,
): Array<Element | Window | VisualViewport> {
  const out: Array<Element | Window | VisualViewport> = [window];
  if (!node || typeof window === "undefined") return out;

  for (let el: Element | null = node.parentElement; el; el = el.parentElement) {
    const { overflowX, overflowY } = window.getComputedStyle(el);
    if (SCROLLABLE.test(overflowY) || SCROLLABLE.test(overflowX)) {
      out.push(el);
    }
  }

  if (window.visualViewport) out.push(window.visualViewport);
  return out;
}
