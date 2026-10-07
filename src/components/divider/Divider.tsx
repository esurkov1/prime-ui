import type * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { DividerContentContext } from "@/internal/DividerContentContext";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "start" | "center" | "end";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Default `horizontal`. */
  orientation?: DividerOrientation;
  /** Position of the label (children) on the line. Default `center`. */
  align?: DividerAlign;
  /** Tier of the label: type, gap and icon size. Default `m`. */
  size?: ControlSize;
  ref?: React.Ref<HTMLDivElement>;
};

/** A hairline with an optional label; `role="separator"` unless the consumer overrides `role`. */
export function Divider({
  orientation = "horizontal",
  align = "center",
  size = "m",
  children,
  className,
  role = "separator",
  ...rest
}: DividerProps) {
  return (
    <div
      {...rest}
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
}
