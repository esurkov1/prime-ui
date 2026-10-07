import * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

type ButtonGroupContextValue = {
  size: ControlSize;
};

const [ButtonGroupProvider, useButtonGroupContext] =
  createComponentContext<ButtonGroupContextValue>("ButtonGroup");

export type ButtonGroupRootProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  size?: ControlSize;
  /** Stretch the group to its container; horizontal segments share the width equally. */
  fullWidth?: boolean;
  children: React.ReactNode;
};

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  (
    {
      orientation = "horizontal",
      size = "m",
      fullWidth,
      children,
      className,
      role = "group",
      ...rest
    },
    ref,
  ) => {
    const value = React.useMemo(() => ({ size }), [size]);

    return (
      <ButtonGroupProvider value={value}>
        <div
          ref={ref}
          role={role}
          className={cx(styles.root, className)}
          data-orientation={orientation === "vertical" ? "vertical" : undefined}
          data-size={size}
          data-full-width={fullWidth ? "true" : undefined}
          {...rest}
        >
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </div>
      </ButtonGroupProvider>
    );
  },
);

ButtonGroupRoot.displayName = "ButtonGroupRoot";

export type ButtonGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Toggle state of the segment: `aria-pressed` and `data-state="active" | "inactive"`. */
  pressed?: boolean;
};

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, pressed, type = "button", children, ...rest }, ref) => {
    useButtonGroupContext();

    const items = React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === ""),
    );
    const isIcon = (child: React.ReactNode) =>
      React.isValidElement(child) && child.type === ButtonGroupIcon;
    const iconOnly = items.length > 0 && items.every(isIcon);
    const leadingIcon = !iconOnly && items.length > 0 && isIcon(items[0]);
    const trailingIcon = !iconOnly && items.length > 0 && isIcon(items[items.length - 1]);

    return (
      <button
        ref={ref}
        type={type}
        className={cx(styles.item, className)}
        data-state={pressed === undefined ? undefined : pressed ? "active" : "inactive"}
        data-icon-only={iconOnly ? "true" : undefined}
        data-leading-icon={leadingIcon ? "true" : undefined}
        data-trailing-icon={trailingIcon ? "true" : undefined}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

ButtonGroupItem.displayName = "ButtonGroupItem";

export type ButtonGroupIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function ButtonGroupIcon({ children, className, ...rest }: ButtonGroupIconProps) {
  useButtonGroupContext();

  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonGroupIcon.displayName = "ButtonGroupIcon";

export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem, Icon: ButtonGroupIcon };
