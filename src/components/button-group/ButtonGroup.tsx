import type * as React from "react";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconLayout } from "@/internal/iconLayout";
import type { ControlSize } from "@/internal/states";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupRootProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  /** Tier. Default: the tier of the surrounding control (a toolbar, a panel), else `m`. */
  size?: ControlSize;
  /** Stretch the group to its container; horizontal segments share the width equally. */
  fullWidth?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function ButtonGroupRoot({
  orientation = "horizontal",
  size: sizeProp,
  fullWidth,
  children,
  className,
  ref,
  ...rest
}: ButtonGroupRootProps) {
  const size = useControlSize(sizeProp);
  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of buttons, not a form fieldset
    <div
      ref={ref}
      role="group"
      className={cx(fieldTierClass, styles.root, className)}
      {...toDataAttributes({
        orientation: orientation === "vertical" ? orientation : undefined,
        size,
        "full-width": fullWidth,
      })}
      {...rest}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </div>
  );
}

ButtonGroupRoot.displayName = "ButtonGroup.Root";

export type ButtonGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Toggle state of the segment: `aria-pressed` and `data-state="active" | "inactive"`. */
  pressed?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

function ButtonGroupItem({
  className,
  pressed,
  type = "button",
  children,
  ref,
  ...rest
}: ButtonGroupItemProps) {
  // Icon placement drives optical padding and the square icon-only segment (as in Button).
  const layout = iconLayout(children, ButtonGroupIcon);

  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.item, className)}
      aria-pressed={pressed}
      {...toDataAttributes({
        state: pressed === undefined ? undefined : pressed ? "active" : "inactive",
        "icon-only": layout.iconOnly || undefined,
        "leading-icon": layout.leadingIcon || undefined,
        "trailing-icon": layout.trailingIcon || undefined,
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

ButtonGroupItem.displayName = "ButtonGroup.Item";

export type ButtonGroupIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function ButtonGroupIcon({ children, className, ...rest }: ButtonGroupIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonGroupIcon.displayName = "ButtonGroup.Icon";

export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem, Icon: ButtonGroupIcon };
