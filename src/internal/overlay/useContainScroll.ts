import * as React from "react";

/** Whether the element itself can scroll in the wheel's direction. */
function canScroll(el: HTMLElement, deltaY: number): boolean {
  const { overflowY } = getComputedStyle(el);
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  if (el.scrollHeight <= el.clientHeight) return false;
  return deltaY < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight;
}

/**
 * The wheel over an open anchored panel does not scroll the page under it; scrolling areas inside
 * it (a list, the panel itself when it overflows) work as usual. `overscroll-behavior: contain` is
 * not enough: it only holds while the panel overflows, and a panel that fits chains the wheel to
 * the page. `panel` is the boundary; `null` turns it off.
 */
export function useContainScroll(panel: HTMLElement | null): void {
  React.useEffect(() => {
    if (!panel) return;
    const onWheel = (event: WheelEvent) => {
      for (let el = event.target as HTMLElement | null; el; el = el.parentElement) {
        if (canScroll(el, event.deltaY)) return;
        if (el === panel) break;
      }
      event.preventDefault();
    };
    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => panel.removeEventListener("wheel", onWheel);
  }, [panel]);
}
