import * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./ScrollContainer.module.css";

export type ScrollContainerAxis = "vertical" | "horizontal" | "both";

export type ScrollContainerProps = Omit<React.HTMLAttributes<HTMLElement>, "className"> & {
  /** Root element. Default `div`; `AppShell.Main` renders `main`. */
  as?: "div" | "main" | "aside" | "section" | "nav" | "article";
  /** Scroll axis. Default `vertical`. */
  axis?: ScrollContainerAxis;
  /** `overscroll-behavior`. Default `contain`: nested panels do not chain scroll into the page. */
  overscrollBehavior?: "auto" | "contain" | "none";
  className?: string;
};

const axisClass: Record<ScrollContainerAxis, string> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
  both: styles.both,
};

/** Scroll region with the kit's thin scrollbars; shrinks inside flex/grid parents. */
const ScrollContainer = React.forwardRef<HTMLElement, ScrollContainerProps>(
  function ScrollContainer(
    {
      as: Component = "div",
      axis = "vertical",
      overscrollBehavior = "contain",
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Component
        ref={ref as never}
        className={cx(
          styles.root,
          axisClass[axis],
          overscrollBehavior === "contain" && styles.overscrollContain,
          overscrollBehavior === "none" && styles.overscrollNone,
          className,
        )}
        {...rest}
      />
    );
  },
);

ScrollContainer.displayName = "ScrollContainer";

export { ScrollContainer };
