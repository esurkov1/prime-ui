import * as React from "react";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./ScrollContainer.module.css";
import { useFitFlag } from "./useFitFlag";
import { type ScrollEdgeHandler, ScrollRegionContext, useScrollEdges } from "./useScrollEdges";

export type ScrollContainerAxis = "vertical" | "horizontal" | "both";

export type ScrollContainerProps = React.HTMLAttributes<HTMLElement> & {
  /** Root element. Default `div`; `AppShell.Main` renders `main`. */
  as?: "div" | "main" | "aside" | "section" | "nav" | "article";
  /** Scroll axis. Default `vertical`. */
  axis?: ScrollContainerAxis;
  /** `overscroll-behavior`. Default `contain`: nested panels do not chain scroll into the page. */
  overscrollBehavior?: "auto" | "contain" | "none";
  /**
   * Fade the edges where more content is hidden (`data-overflow-start` / `data-overflow-end`):
   * along the horizontal axis for `axis="horizontal"`, along the vertical one otherwise.
   */
  fade?: boolean;
  /** `thin` — the kit's quiet scrollbar (default); `hidden` — no scrollbar (pair it with `fade`). */
  scrollbar?: "thin" | "hidden";
  /**
   * `end` — a chat or a log: the region starts at the end and stays there while content arrives,
   * as long as the person is at the end; scrolled away, what they look at stays put. Default `start`.
   */
  anchor?: "start" | "end";
  /**
   * The scroll position came near the start (older messages). A returned promise is pending until
   * it settles: no new call meanwhile, `aria-busy`. Content added above keeps the view in place.
   */
  onReachStart?: ScrollEdgeHandler;
  /** The scroll position came near the end (the next page of a feed); a promise works the same. */
  onReachEnd?: ScrollEdgeHandler;
  ref?: React.Ref<HTMLElement>;
};

const axisClass: Record<ScrollContainerAxis, string> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
  both: styles.both,
};

/** Scroll region with the kit's thin scrollbars; shrinks inside flex/grid parents. */
export function ScrollContainer({
  as: Component = "div",
  axis = "vertical",
  overscrollBehavior = "contain",
  fade = false,
  scrollbar = "thin",
  anchor = "start",
  onReachStart,
  onReachEnd,
  className,
  ref,
  ...rest
}: ScrollContainerProps) {
  const innerRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(innerRef, ref);
  const horizontal = axis === "horizontal";
  const overflow = useEdgeOverflow(innerRef, fade, horizontal, fade);
  const edges = useScrollEdges(innerRef, { anchor, horizontal, onReachStart, onReachEnd });
  // A region that follows its content (a chat, a feed that loads more) is always a scroller: a
  // moment of fitting content must never turn it into `overflow: hidden` under the reader.
  useFitFlag(innerRef, axis, !edges.keepPosition && !onReachEnd);

  return (
    <ScrollRegionContext.Provider value={edges.region}>
      <Component
        ref={mergedRef}
        className={cx(
          styles.root,
          axisClass[axis],
          overscrollBehavior === "contain" && styles.overscrollContain,
          overscrollBehavior === "none" && styles.overscrollNone,
          scrollbar === "hidden" && styles.scrollbarHidden,
          className,
        )}
        aria-busy={edges.busy || undefined}
        {...toDataAttributes({
          fade: fade ? (horizontal ? "horizontal" : "vertical") : undefined,
          "overflow-start": overflow.start || undefined,
          "overflow-end": overflow.end || undefined,
          anchor: edges.keepPosition ? anchor : undefined,
        })}
        {...rest}
      />
    </ScrollRegionContext.Provider>
  );
}
