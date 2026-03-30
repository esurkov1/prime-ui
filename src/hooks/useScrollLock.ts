import * as React from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

function lockScroll() {
  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount++;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
}

/**
 * Locks body scroll when enabled. Supports multiple concurrent callers via
 * a reference-counted lock — the last caller to unmount restores scroll.
 * Compensates for scrollbar width to prevent layout shift.
 * Shared by modal/drawer overlays.
 */
export function useScrollLock(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    lockScroll();
    return () => unlockScroll();
  }, [enabled]);
}
