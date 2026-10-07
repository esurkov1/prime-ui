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
      {/* `Label.Icon` (and any kit icon inside) takes the label tier. */}
      <ControlSizeProvider value={size}>
        {children}
        {required ? (
          <span className={styles.asterisk} aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? (
          <span className={styles.optional}>{labels?.optional ?? LABEL_LABELS.optional}</span>
        ) : null}
      </ControlSizeProvider>
    </label>
  ),
);
LabelRoot.displayName = "Label.Root";

export type LabelIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

function LabelIcon({ className, ...rest }: LabelIconProps) {
  return <span className={cx(styles.icon, className)} aria-hidden="true" {...rest} />;
}
LabelIcon.displayName = "Label.Icon";

export type LabelDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Secondary inline text inside the label (units, short clarification). */
function LabelDescription({ className, ...rest }: LabelDescriptionProps) {
  return <span className={cx(styles.description, className)} {...rest} />;
}
LabelDescription.displayName = "Label.Description";

export const Label = {
  Root: LabelRoot,
  Icon: LabelIcon,
  Description: LabelDescription,
};
