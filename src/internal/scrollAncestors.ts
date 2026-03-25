const SCROLLABLE = /^(auto|scroll|overlay)$/;

/** window, прокручиваемые предки якоря и visualViewport — для пересчёта fixed при scroll. */
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
