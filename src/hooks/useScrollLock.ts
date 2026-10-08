import * as React from "react";

let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

function lockScroll() {
  if (lockCount === 0) {
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    if (scrollbarWidth > 0) {
      // Added to the body's own padding, not written over it.
      const padding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${padding + scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
  }
  lockCount++;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && saved) {
    document.body.style.overflow = saved.overflow;
    document.body.style.paddingRight = saved.paddingRight;
    saved = null;
  }
}

/**
 * Locks document scroll while enabled. Reference-counted: nested modal layers share one lock and
 * the last one restores it. The scrollbar width is added to the body's right padding, so the page
 * does not shift. Part of `useModalLayer`.
 */
export function useScrollLock(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    lockScroll();
    return unlockScroll;
  }, [enabled]);
}
