import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { GIVE_WAY_ANIMATION } from "@/internal/messageList";
import { motionToken, readElementDurationMs } from "@/internal/motionTiming";

/** A row is a message's row of the list (`data-message-row`); spacers and dates only follow. */
const ROW = "[data-message-row]";

/**
 * A row that changes its height outside its message's own morph — a picture that loads, a late
 * measure, a part that grows by itself — gives way the way a morph does (`bubbleMorph`), so every
 * size change of the list has one motion: the scroller anchors the view first (the end, or the
 * first row in view — `ScrollContainer`), then everything else in the list that moved on screen
 * glides once from where it was seen to where it stands, on the message clock. A date stuck at the
 * top did not move and stays; a row the change moved in a short conversation (pushed to the end
 * of its pane) slides instead of jumping. The changed row itself just stands at its new size.
 *
 * Its ResizeObserver is made after the scroller's own (a passive effect), so it reads the layout
 * the scroller has already corrected in the same frame, before paint.
 *
 * Only what the reader saw moving glides. A list in a hidden pane (`display: none`, an inactive
 * tab of the app) has no layout: its rows read as zero high and stand at the top, so nothing is
 * recorded or glided while it is hidden, and the batch that shows it again only records where the
 * rows stand. A page the browser hid (another tab) resumes from where the rows stand on return:
 * whatever changed meanwhile is simply in place.
 */
export function useRowGlide(listRef: React.RefObject<HTMLElement | null>): void {
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    // The reader's scroll moves every row: that is where they are seen now.
    const scroller = list.parentElement;
    /** Whether the list has a layout: a hidden pane (or a hidden ancestor) has none. */
    const shown = () => (scroller ?? list).getBoundingClientRect().height > 0;
    /** Where a child stands in the scroller's view (its glide included; the page's scroll aside). */
    const topOf = (child: Element) =>
      child.getBoundingClientRect().top - (scroller?.getBoundingClientRect().top ?? 0);
    /** Where each child of the list was last seen. */
    const seen = new Map<Element, number>();
    const heights = new Map<Element, number>();
    const record = () => {
      if (!shown()) return;
      for (const child of list.children) seen.set(child, topOf(child));
    };
    /** Set while the list is hidden: the batch that shows it again glides nothing. */
    let hidden = false;
    const glide = (changed: Set<Element>) => {
      const duration = readElementDurationMs(
        document.documentElement,
        "--prime-message-morph-duration",
      );
      if (duration <= 0 || prefersReducedMotion()) return;
      const easing = motionToken("--prime-motion-easing-standard");
      for (const child of list.children) {
        if (changed.has(child) || !(child instanceof HTMLElement)) continue;
        const top = seen.get(child);
        if (top === undefined || typeof child.animate !== "function") continue;
        for (const animation of child.getAnimations?.() ?? []) {
          if (animation.id === GIVE_WAY_ANIMATION) animation.cancel();
        }
        const dy = top - topOf(child);
        if (Math.abs(dy) < 0.5) continue;
        const animation = child.animate(
          [{ transform: `translate(0px, ${dy}px)` }, { transform: "translate(0px, 0px)" }],
          easing ? { duration, easing, composite: "add" } : { duration, composite: "add" },
        );
        animation.id = GIVE_WAY_ANIMATION;
      }
    };
    const resize = new ResizeObserver((entries) => {
      if (!shown()) {
        // Zero sizes of a hidden pane are no sizes: the rows keep the ones last seen.
        hidden = true;
        return;
      }
      const changed = new Set<Element>();
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        const was = heights.get(entry.target);
        heights.set(entry.target, height);
        // A row its message is morphing gives way by itself (`bubbleMorph`).
        if (
          was !== undefined &&
          Math.abs(height - was) >= 0.5 &&
          entry.target.matches(ROW) &&
          !entry.target.hasAttribute("data-morphing")
        ) {
          changed.add(entry.target);
        }
      }
      if (changed.size > 0 && !hidden) glide(changed);
      hidden = false;
      record();
    });
    const observe = () => {
      for (const child of list.children) resize.observe(child);
    };
    observe();
    record();
    // Rows the window renders, and every commit of the list: observed and seen afresh.
    const mutation = new MutationObserver(() => {
      observe();
      record();
    });
    mutation.observe(list, { childList: true });
    scroller?.addEventListener("scroll", record, { passive: true });
    // Back from another tab: the rows are seen where they stand now, before any late size batch.
    const resume = () => {
      if (document.visibilityState === "visible") record();
    };
    document.addEventListener("visibilitychange", resume);
    return () => {
      resize.disconnect();
      mutation.disconnect();
      scroller?.removeEventListener("scroll", record);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [listRef]);
}
