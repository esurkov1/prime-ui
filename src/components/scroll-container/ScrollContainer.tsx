import * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./ScrollContainer.module.css";

export type ScrollContainerAxis = "vertical" | "horizontal" | "both";

export type ScrollContainerProps = {
  /**
   * Корневой элемент. По умолчанию `div`; для `PageShell.ContentArea` используйте `main`.
   */
  as?: "div" | "main" | "aside" | "section" | "nav" | "article";
  /** Ось прокрутки. По умолчанию вертикальная. */
  axis?: ScrollContainerAxis;
  /** `-webkit-overflow-scrolling: touch` (полезно для вложенных скроллов на iOS). По умолчанию включено. */
  touch?: boolean;
  /** Значение `overscroll-behavior`. По умолчанию `contain` для вложенных панелей. */
  overscrollBehavior?: "auto" | "contain" | "none";
  /**
   * `min-height: 0` и `min-width: 0` — типично для flex/grid-ребёнка, чтобы скролл не «ломал» раскладку.
   * По умолчанию true.
   */
  flexItem?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

const axisClass: Record<ScrollContainerAxis, string> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
  both: styles.both,
};

const ScrollContainer = React.forwardRef<HTMLElement, ScrollContainerProps>(
  function ScrollContainer(
    {
      as: Component = "div",
      axis = "vertical",
      touch = true,
      overscrollBehavior = "contain",
      flexItem = true,
      className,
      children,
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
          flexItem && styles.flexItem,
          touch && styles.touch,
          overscrollBehavior === "contain" && styles.overscrollContain,
          overscrollBehavior === "none" && styles.overscrollNone,
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ScrollContainer.displayName = "ScrollContainer";

export { ScrollContainer };
