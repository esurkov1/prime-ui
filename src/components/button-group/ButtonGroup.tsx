import * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { ButtonGroupSize } from "@/internal/states";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

type ButtonGroupContextValue = {
  size: ButtonGroupSize;
};

const [ButtonGroupProvider, useButtonGroupContext] =
  createComponentContext<ButtonGroupContextValue>("ButtonGroup");

export type ButtonGroupRootProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
  children: React.ReactNode;
};

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ orientation = "horizontal", size = "m", children, className, ...rest }, ref) => {
    const value = React.useMemo(() => ({ size }), [size]);

    return (
      <ButtonGroupProvider value={value}>
        <div
          ref={ref}
          className={cx(styles.root, className)}
          data-orientation={orientation === "vertical" ? "vertical" : undefined}
          data-size={size}
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
  /** Включённое состояние сегмента: `data-state="on"` и синхронный `aria-pressed`. */
  pressed?: boolean;
};

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, pressed, type = "button", ...rest }, ref) => {
    useButtonGroupContext();

    return (
      <button
        ref={ref}
        type={type}
        className={cx(styles.item, className)}
        data-state={pressed === true ? "on" : undefined}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        {...rest}
      />
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

export type { ButtonGroupSize };

export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem, Icon: ButtonGroupIcon };
