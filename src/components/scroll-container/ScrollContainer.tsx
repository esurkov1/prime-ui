import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./ScrollContainer.module.css";

export type ScrollContainerAxis = "vertical" | "horizontal" | "both";

export type ScrollContainerProps = Omit<React.HTMLAttributes<HTMLElement>, "className"> & {
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
  className?: string;
};

const axisClass: Record<ScrollContainerAxis, string> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
  both: styles.both,
};

type Overflow = { start: boolean; end: boolean };

/** Tracks whether content is hidden before / after the visible part along one axis. */
function useEdgeOverflow(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  horizontal: boolean,
): Overflow {
  const [overflow, setOverflow] = React.useState<Overflow>({ start: false, end: false });

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    const update = () => {
      const position = horizontal ? node.scrollLeft : node.scrollTop;
      const max = horizontal
        ? node.scrollWidth - node.clientWidth
        : node.scrollHeight - node.clientHeight;
      const start = position > 1;
      const end = max - position > 1;
      setOverflow((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(node);
    for (const child of Array.from(node.children)) observer?.observe(child);
    return () => {
      node.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [ref, enabled, horizontal]);

  return enabled ? overflow : { start: false, end: false };
}

/** Scroll region with the kit's thin scrollbars; shrinks inside flex/grid parents. */
const ScrollContainer = React.forwardRef<HTMLElement, ScrollContainerProps>(
  function ScrollContainer(
    {
      as: Component = "div",
      axis = "vertical",
      overscrollBehavior = "contain",
      fade = false,
      scrollbar = "thin",
      className,
      ...rest
    },
    ref,
  ) {
    const innerRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(innerRef, ref);
    const horizontal = axis === "horizontal";
    const overflow = useEdgeOverflow(innerRef, fade, horizontal);

    return (
      <Component
        ref={mergedRef as never}
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
  },
);

ScrollContainer.displayName = "ScrollContainer";

export { ScrollContainer };
