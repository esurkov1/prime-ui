import * as React from "react";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ScrollRegionContext } from "@/hooks/useScrollRegion";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { namedRole } from "@/internal/namedRole";

import styles from "./ScrollContainer.module.css";
import { useFitFlag } from "./useFitFlag";
import { type ScrollEdgeHandler, useScrollEdges } from "./useScrollEdges";
import { useWheelToInline } from "./useWheelToInline";

export type ScrollContainerAxis = "vertical" | "horizontal" | "both";

/**
 * How an edge that hides content looks. `fade` — the content dissolves (a mask, any background);
 * `shadow` — a soft shadow falls over it on the region's own fill (`--prime-color-layer-current`),
 * for a region that is itself a surface; `none` — the edge is plain.
 */
export type ScrollContainerEdges = "fade" | "shadow" | "none";

export type ScrollContainerProps = React.HTMLAttributes<HTMLElement> & {
  /** Root element. Default `div`; `AppShell.Main` renders `main`, CodeBlock `pre`. */
  as?: "div" | "main" | "aside" | "section" | "nav" | "article" | "pre";
  /** Scroll axis. Default `vertical`. */
  axis?: ScrollContainerAxis;
  /** `overscroll-behavior`. Default `contain`: nested panels do not chain scroll into the page. */
  overscrollBehavior?: "auto" | "contain" | "none";
  /** The edges where more content is hidden, along every scroll axis. Default `fade`. */
  edges?: ScrollContainerEdges;
  /** `thin` — the kit's quiet scrollbar (default); `hidden` — no scrollbar (keep `edges`). */
  scrollbar?: "thin" | "hidden";
  /** The person cannot scroll the region (wheel, touch, keys, autoscroll); it keeps its place. */
  lock?: boolean;
  /**
   * Scrolling comes to rest on the start of a child: `true` when it ends near one (strips of
   * tiles), `"mandatory"` always on one (board columns, a carousel). A drag of the kit's Dnd
   * inside the region turns it off while it lasts.
   */
  snap?: boolean | "mandatory";
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

/** Scroll region with the kit's thin scrollbars and soft hidden edges; shrinks inside flex/grid. */
export function ScrollContainer({
  as: Component = "div",
  axis = "vertical",
  overscrollBehavior = "contain",
  edges = "fade",
  scrollbar = "thin",
  lock = false,
  snap = false,
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
  // Only a fade reads the hidden edges; a shadow is drawn by the region's backgrounds alone.
  const fade = edges === "fade";
  const overflow = useEdgeOverflow(innerRef, fade ? axis : null, fade);
  const scroll = useScrollEdges(innerRef, { anchor, horizontal, onReachStart, onReachEnd });
  // A region that follows its content (a chat, a feed that loads more) is always a scroller: a
  // moment of fitting content must never turn it into `overflow: hidden` under the reader.
  useFitFlag(innerRef, axis, !scroll.keepPosition && !onReachEnd);
  useWheelToInline(innerRef, horizontal && !lock);

  return (
    <ScrollRegionContext.Provider value={scroll.region}>
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
        aria-busy={scroll.busy || undefined}
        // A named region is a landmark a screen reader can reach (`region`); a role of its own wins.
        role={namedRole(rest, "region")}
        {...toDataAttributes({
          edges: edges === "none" ? undefined : edges,
          "overflow-top": overflow.top || undefined,
          "overflow-bottom": overflow.bottom || undefined,
          "overflow-start": overflow.start || undefined,
          "overflow-end": overflow.end || undefined,
          lock: lock || undefined,
          snap: snap === "mandatory" ? "mandatory" : snap ? "proximity" : undefined,
          anchor: scroll.keepPosition ? anchor : undefined,
        })}
        {...rest}
      />
    </ScrollRegionContext.Provider>
  );
}
