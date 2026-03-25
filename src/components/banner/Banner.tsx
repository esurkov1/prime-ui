import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { BannerSize } from "@/internal/states";

import styles from "./Banner.module.css";

export type BannerVariant = "filled" | "light" | "lighter" | "stroke";

export type BannerStatus = "information" | "warning" | "error" | "success" | "feature";

export type { BannerSize };

export type BannerRootProps = {
  variant?: BannerVariant;
  status?: BannerStatus;
  size?: BannerSize;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function childHasCloseButton(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (c) => React.isValidElement(c) && c.type === BannerCloseButton,
  );
}

const BannerRoot = React.forwardRef<HTMLDivElement, BannerRootProps>(function BannerRoot(
  {
    variant = "filled",
    status = "information",
    size = "m",
    onDismiss,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const showInjectedClose = Boolean(onDismiss) && !childHasCloseButton(children);

  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, status, size })}
    >
      <ControlSizeProvider value={size}>
        {children}
        {showInjectedClose ? (
          <BannerCloseButton aria-label="Dismiss" type="button" onClick={onDismiss} />
        ) : null}
      </ControlSizeProvider>
    </div>
  );
});
BannerRoot.displayName = "BannerRoot";

export type BannerContentProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function BannerContent({ className, children, ...rest }: BannerContentProps) {
  return (
    <div className={cx(styles.content, className)} {...rest}>
      {children}
    </div>
  );
}
BannerContent.displayName = "BannerContent";

export type BannerIconProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function BannerIcon<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: BannerIconProps<T>) {
  const Component = (as ?? "div") as React.ElementType;

  return (
    <Component className={cx(styles.icon, className)} {...rest}>
      {children}
    </Component>
  );
}
BannerIcon.displayName = "BannerIcon";

export type BannerTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function BannerTitle({ className, children, ...rest }: BannerTitleProps) {
  return (
    <span className={cx(styles.title, className)} {...rest}>
      {children}
    </span>
  );
}
BannerTitle.displayName = "BannerTitle";

export type BannerDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function BannerDescription({ className, children, ...rest }: BannerDescriptionProps) {
  return (
    <span className={cx(styles.description, className)} {...rest}>
      {children}
    </span>
  );
}
BannerDescription.displayName = "BannerDescription";

export type BannerActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function BannerActions({ className, children, ...rest }: BannerActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
BannerActions.displayName = "BannerActions";

export type BannerCloseButtonProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">;

const BannerCloseButton = React.forwardRef<HTMLButtonElement, BannerCloseButtonProps>(
  function BannerCloseButton({ className, children, type = "button", ...rest }, forwardedRef) {
    const controlSize = useOptionalControlSize() ?? "m";
    const buttonSize = controlSize === "xs" ? "s" : controlSize;

    return (
      <Button.Root
        ref={forwardedRef}
        type={type}
        size={buttonSize}
        mode="ghost"
        variant="neutral"
        className={cx(styles.closeButton, className)}
        {...rest}
      >
        {children ?? (
          <Button.Icon>
            <X aria-hidden strokeWidth={2} />
          </Button.Icon>
        )}
      </Button.Root>
    );
  },
);
BannerCloseButton.displayName = "BannerCloseButton";

export const Banner = {
  Root: BannerRoot,
  Content: BannerContent,
  Icon: BannerIcon,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
  CloseButton: BannerCloseButton,
};
