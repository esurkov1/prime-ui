import type * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Hint.module.css";

export type HintRootProps = {
  size?: ControlSize;
  /** Error message styling (`danger-text`). */
  invalid?: boolean;
  /** Dimmed text next to a disabled control. */
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>;

function HintRoot({ className, size = "m", invalid, disabled, children, ...rest }: HintRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <p
        className={cx(styles.root, className)}
        {...rest}
        {...toDataAttributes({
          size,
          invalid: invalid || undefined,
          disabled: disabled || undefined,
        })}
      >
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
