import type * as React from "react";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { fieldLabelTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import styles from "./Label.module.css";

export type LabelLabels = {
  /** Muted marker after the label text when `optional`. */
  optional: string;
};

export const LABEL_LABELS: LabelLabels = { optional: "необязательно" };

export type LabelRootProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size"> & {
  disabled?: boolean;
  size?: ControlSize;
  required?: boolean;
  optional?: boolean;
  secondary?: boolean;
  labels?: Partial<LabelLabels>;
  ref?: React.Ref<HTMLLabelElement>;
};

function LabelRoot({
  className,
  disabled: disabledProp,
  children,
  size: sizeProp,
  required,
  optional,
  secondary,
  labels: labelsProp,
  ref,
  ...rest
}: LabelRootProps) {
  const tier = useHostTier(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(LABEL_LABELS, labelsProp);
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: field label primitive; association via htmlFor or wrapping control is caller responsibility
    <label
      ref={ref}
      className={cx(fieldTierClass, fieldLabelTextClass, styles.root, className)}
      aria-disabled={disabled || undefined}
      {...rest}
      {...toDataAttributes({
        disabled: disabled || undefined,
        secondary: secondary || undefined,
        size: tier.size,
      })}
    >
      {/* `Label.Icon` (and any kit icon inside) takes the label tier. */}
      {tier.provide(
        <>
          {children}
          <LabelMarks required={required} optional={optional} optionalLabel={labels.optional} />
        </>,
      )}
    </label>
  );
}
LabelRoot.displayName = "Label.Root";

/**
 * The marks after a field name: the red `*` of a required field (decorative, `aria-hidden`; the
 * control carries `required`) or the muted optional marker (visible text, part of the name). The
 * one copy of the kit — Label and the choice rows (Checkbox, Switch) draw them. Inside a Label the
 * marks dim with it; elsewhere `disabled` dims them.
 */
export function LabelMarks({
  required,
  optional,
  optionalLabel,
  disabled,
}: {
  required?: boolean;
  optional?: boolean;
  optionalLabel: string;
  disabled?: boolean;
}) {
  const dim = disabled || undefined;
  return (
    <>
      {required ? (
        <span className={styles.asterisk} aria-hidden="true" data-disabled={dim}>
          *
        </span>
      ) : null}
      {optional ? (
        <span className={styles.optional} data-disabled={dim}>
          {optionalLabel}
        </span>
      ) : null}
    </>
  );
}

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
