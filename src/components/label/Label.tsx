import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { LabelSize } from "@/internal/states";

import styles from "./Label.module.css";

export type { LabelSize };

const LabelSizeContext = React.createContext<LabelSize>("m");

export type LabelRootProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size"> & {
  disabled?: boolean;
  size?: LabelSize;
};

const LabelRoot = React.forwardRef<HTMLLabelElement, LabelRootProps>(
  ({ className, disabled, children, size = "m", ...rest }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: field label primitive; association via htmlFor or wrapping control is caller responsibility
      <label
        ref={ref}
        className={cx(styles.root, className)}
        aria-disabled={disabled || undefined}
        {...rest}
        {...toDataAttributes({ disabled, size })}
      >
        <LabelSizeContext.Provider value={size}>{children}</LabelSizeContext.Provider>
      </label>
    );
  },
);
LabelRoot.displayName = "LabelRoot";

function LabelIcon({ className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  const size = React.useContext(LabelSizeContext);
  return (
    <span className={cx(styles.iconSlot, className)} {...rest}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </span>
  );
}
LabelIcon.displayName = "LabelIcon";

function LabelAsterisk({ className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(styles.asterisk, className)} {...rest}>
      {children ?? "*"}
    </span>
  );
}
LabelAsterisk.displayName = "LabelAsterisk";

function LabelSub({ className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(styles.sub, className)} {...rest}>
      {children}
    </span>
  );
}
LabelSub.displayName = "LabelSub";

export const Label = { Root: LabelRoot, Icon: LabelIcon, Asterisk: LabelAsterisk, Sub: LabelSub };
