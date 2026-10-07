import * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupRootProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  size?: ControlSize;
  /** Stretch the group to its container; horizontal segments share the width equally. */
  fullWidth?: boolean;
};

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ orientation = "horizontal", size = "m", fullWidth, children, className, ...rest }, ref) => (
    // biome-ignore lint/a11y/useSemanticElements: a group of buttons, not a form fieldset
    <div
      ref={ref}
      role="group"
      className={cx(styles.root, className)}
      {...toDataAttributes({
        orientation: orientation === "vertical" ? orientation : undefined,
        size,
        "full-width": fullWidth,
      })}
      {...rest}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </div>
  ),
);

ButtonGroupRoot.displayName = "ButtonGroup.Root";

export type ButtonGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Toggle state of the segment: `aria-pressed` and `data-state="active" | "inactive"`. */
  pressed?: boolean;
};

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, pressed, type = "button", children, ...rest }, ref) => {
    // Icon placement drives optical padding and the square icon-only segment (as in Button).
    const items = React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === ""),
    );
    const isIcon = (child: React.ReactNode) =>
      React.isValidElement(child) && child.type === ButtonGroupIcon;
    const iconOnly = items.length > 0 && items.every(isIcon);

    return (
      <button
        ref={ref}
        type={type}
        className={cx(styles.item, className)}
        aria-pressed={pressed}
        {...toDataAttributes({
          state: pressed === undefined ? undefined : pressed ? "active" : "inactive",
          "icon-only": iconOnly || undefined,
          "leading-icon": (!iconOnly && isIcon(items[0])) || undefined,
          "trailing-icon": (!iconOnly && isIcon(items[items.length - 1])) || undefined,
        })}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

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
