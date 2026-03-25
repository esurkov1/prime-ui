import * as React from "react";

import {
  ControlSizeProvider,
  controlSurfaceToInputSize,
  useOptionalControlSize,
} from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Badge.module.css";

export type BadgeColor =
  | "gray"
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "purple"
  | "sky"
  | "pink"
  | "teal";

/** Состояние индикатора при `variant="status"`. */
export type BadgeStatus = "online" | "offline" | "away" | "busy";

export type BadgeVariant = "filled" | "light" | "lighter" | "stroke" | "status";

export type BadgeSize = "s" | "m" | "l" | "xl";

export type BadgeRootProps = {
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  disabled?: boolean;
  /** При `variant="status"` — цвет точки (online / offline / away / busy). */
  status?: BadgeStatus;
  /** При `variant="status"` — `aria-label` на корне (`role="status"`). */
  label?: string;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type BadgeIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export type BadgeDotProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

const BadgeRoot = React.forwardRef<HTMLDivElement, BadgeRootProps>(
  (
    {
      color = "gray",
      variant = "light",
      size: sizeProp,
      disabled,
      status,
      label,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const controlSurface = useOptionalControlSize();
    const size =
      sizeProp ?? (controlSurface !== undefined ? controlSurfaceToInputSize(controlSurface) : "m");

    const isStatus = variant === "status";
    const presence = isStatus ? (status ?? "online") : undefined;

    const dataProps = isStatus
      ? toDataAttributes({
          variant: "status",
          status: presence,
          size,
          disabled: disabled ? true : undefined,
        })
      : toDataAttributes({
          color,
          variant,
          size,
          disabled: disabled ? true : undefined,
        });

    if (isStatus) {
      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={cx(styles.root, className)}
          {...dataProps}
          {...rest}
        >
          <span className={styles.statusDot} aria-hidden="true" />
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </div>
      );
    }

    return (
      <div ref={ref} className={cx(styles.root, className)} {...dataProps} {...rest}>
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </div>
    );
  },
);

BadgeRoot.displayName = "BadgeRoot";

function BadgeIcon({ children, className, ...rest }: BadgeIconProps) {
  return (
    <span className={cx(styles.icon, className)} {...rest}>
      {children}
    </span>
  );
}

BadgeIcon.displayName = "BadgeIcon";

function BadgeDot({ className, ...rest }: BadgeDotProps) {
  return <span className={cx(styles.dot, className)} aria-hidden="true" {...rest} />;
}

BadgeDot.displayName = "BadgeDot";

export const Badge = { Root: BadgeRoot, Icon: BadgeIcon, Dot: BadgeDot };
