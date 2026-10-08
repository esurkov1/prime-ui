import * as React from "react";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./ScrollContainer.module.css";

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
  className,
  ref,
  ...rest
}: ScrollContainerProps) {
  const innerRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(innerRef, ref);
  const horizontal = axis === "horizontal";
  const overflow = useEdgeOverflow(innerRef, fade, horizontal);

  return (
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
      {...toDataAttributes({
        fade: fade ? (horizontal ? "horizontal" : "vertical") : undefined,
        "overflow-start": overflow.start || undefined,
        "overflow-end": overflow.end || undefined,
      })}
      {...rest}
    />
  );
}
