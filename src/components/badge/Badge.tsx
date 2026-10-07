import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor, Variant } from "@/internal/states";

import styles from "./Badge.module.css";
import { useBadgeTier } from "./tier";

export type BadgeRootProps = {
  /** Palette hue (categorization, not status). Default `gray`. */
  color?: PaletteColor;
  /** Treatment. Default `soft`. */
  variant?: Exclude<Variant, "ghost">;
  /** Badge tier; without it the badge follows the surrounding control one tier down. */
  size?: ControlSize;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type BadgeIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export type BadgeDotProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

const BadgeRoot = React.forwardRef<HTMLSpanElement, BadgeRootProps>(
  (
    { color = "gray", variant = "soft", size: sizeProp, disabled, children, className, ...rest },
    ref,
  ) => {
    const { size, tier } = useBadgeTier(sizeProp);
    const iconOnly =
      React.Children.count(children) > 0 &&
      React.Children.toArray(children).every(
        (child) => React.isValidElement(child) && child.type === BadgeIcon,
      );

    return (
      <span
        ref={ref}
        className={cx(styles.root, className)}
        {...toDataAttributes({
          color,
          variant,
          size,
          tier,
          "icon-only": iconOnly || undefined,
          disabled: disabled || undefined,
        })}
        {...rest}
      >
        <ControlSizeProvider value={tier}>{children}</ControlSizeProvider>
      </span>
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
