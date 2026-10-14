/**
 * A gesture that ends with the pointer released over the page (a drag, a dragged scroll) is
 * followed by a click on whatever the pointer was released over. That click is not a press: it is
 * taken here, once, and only when it lands inside `source` or `scope` (the list an item was dropped
 * into renders it anew, so the click lands on a new element there). The next press or key ends the
 * watch, so a later click (a keyboard activation among them) is never taken. Returns a function
 * that ends the watch early.
 */
export function swallowNextClick(source: Element, scope?: Element | null): () => void {
  const stop = () => {
    window.removeEventListener("click", swallow, true);
    window.removeEventListener("pointerdown", stop, true);
    window.removeEventListener("keydown", stop, true);
  };
  function swallow(event: MouseEvent) {
    stop();
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!source.contains(target) && !scope?.contains(target)) return;
    event.preventDefault();
    event.stopPropagation();
  }
  window.addEventListener("click", swallow, true);
  window.addEventListener("pointerdown", stop, true);
  window.addEventListener("keydown", stop, true);
  return stop;
}
