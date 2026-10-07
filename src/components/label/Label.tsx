import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Label.module.css";

export type LabelLabels = {
  /** Muted marker after the label text when `optional`. */
  optional: string;
};

const LABEL_LABELS: LabelLabels = { optional: "необязательно" };

const LabelSizeContext = React.createContext<ControlSize>("m");

export type LabelRootProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size"> & {
  disabled?: boolean;
  size?: ControlSize;
  /** Appends a red `*` (decorative, `aria-hidden`). Put native `required` on the control itself. */
  required?: boolean;
  /** Appends the muted optional marker (`labels.optional`). */
  optional?: boolean;
  labels?: Partial<LabelLabels>;
};

const LabelRoot = React.forwardRef<HTMLLabelElement, LabelRootProps>(
  ({ className, disabled, children, size = "m", required, optional, labels, ...rest }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: field label primitive; association via htmlFor or wrapping control is caller responsibility
    <label
      ref={ref}
      className={cx(styles.root, className)}
      aria-disabled={disabled || undefined}
      {...rest}
      {...toDataAttributes({ disabled: disabled || undefined, size })}
    >
      <LabelSizeContext.Provider value={size}>
        {children}
        {required ? (
          <span className={styles.asterisk} aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? (
          <span className={styles.optional}>{labels?.optional ?? LABEL_LABELS.optional}</span>
        ) : null}
      </LabelSizeContext.Provider>
    </label>
  ),
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

/** Secondary inline text inside the label (units, short clarification). */
function LabelSub({ className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(styles.sub, className)} {...rest}>
      {children}
    </span>
  );
}
LabelSub.displayName = "LabelSub";

export const Label = {
  Root: LabelRoot,
  Icon: LabelIcon,
  Sub: LabelSub,
};
