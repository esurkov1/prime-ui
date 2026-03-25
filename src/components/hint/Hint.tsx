import type * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { HintSize } from "@/internal/states";

import styles from "./Hint.module.css";

export type HintVariant = "default" | "error" | "disabled";

export type { HintSize };

export type HintRootProps = {
  size?: HintSize;
  variant?: HintVariant;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>;

function HintRoot({
  className,
  size = "m",
  variant = "default",
  children,
  ...rest
}: HintRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <p className={cx(styles.root, className)} {...rest} {...toDataAttributes({ variant, size })}>
        {children}
      </p>
    </ControlSizeProvider>
  );
}
HintRoot.displayName = "HintRoot";

export type HintIconProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

function HintIcon({ className, children, ...rest }: HintIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}
HintIcon.displayName = "HintIcon";

export const Hint = { Root: HintRoot, Icon: HintIcon };
