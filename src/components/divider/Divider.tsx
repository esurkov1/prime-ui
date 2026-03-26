import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { DividerContentContext } from "@/internal/DividerContentContext";
import { toDataAttributes } from "@/internal/data-attributes";
import type { DividerSize } from "@/internal/states";

import styles from "./Divider.module.css";

export type { DividerSize };

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "start" | "center" | "end";

/** `line-spacing` — маркер для линии между секциями (ритм соседей — через `gap` у flex-родителя); `text` — подпись секции. */
export type DividerVariant = "default" | "line-spacing" | "text";

export type DividerRootProps = {
  orientation?: DividerOrientation;
  align?: DividerAlign;
  variant?: DividerVariant;
  size?: DividerSize;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DividerRoot = React.forwardRef<HTMLDivElement, DividerRootProps>(
  (
    {
      orientation = "horizontal",
      align: alignProp,
      variant = "default",
      size = "m",
      children,
      className,
      role = "separator",
      ...rest
    },
    ref,
  ) => {
    const align: DividerAlign = alignProp ?? (variant === "text" ? "start" : "center");

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(styles.root, className)}
        role={role}
        {...(orientation === "vertical" ? { "aria-orientation": "vertical" as const } : {})}
        {...toDataAttributes({ orientation, align, variant, size })}
      >
        {children != null ? (
          <ControlSizeProvider value={size}>
            <DividerContentContext.Provider value>
              <span className={styles.content}>{children}</span>
            </DividerContentContext.Provider>
          </ControlSizeProvider>
        ) : null}
      </div>
    );
  },
);

DividerRoot.displayName = "Divider.Root";

export const Divider = { Root: DividerRoot };
