import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { DividerContentContext } from "@/internal/DividerContentContext";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "start" | "center" | "end";

export type DividerRootProps = {
  orientation?: DividerOrientation;
  /** Position of the label (children) on the line. Default `center`. */
  align?: DividerAlign;
  size?: ControlSize;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DividerRoot = React.forwardRef<HTMLDivElement, DividerRootProps>(
  (
    {
      orientation = "horizontal",
      align = "center",
      size = "m",
      children,
      className,
      role = "separator",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cx(styles.root, className)}
        role={role}
        {...(orientation === "vertical" ? { "aria-orientation": "vertical" as const } : {})}
        {...toDataAttributes({ orientation, align, size })}
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
