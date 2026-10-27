import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DisabledProvider, useInheritedDisabled } from "@/internal/disabledContext";
import { hasContent } from "@/internal/hasContent";
import textRole from "@/internal/textRole.module.css";

import styles from "./Fieldset.module.css";

export type FieldsetProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "disabled"
> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  layout?: "stack" | "pair";
  children: React.ReactNode;
  ref?: React.Ref<HTMLFieldSetElement>;
};

/**
 * A frameless group of fields: native `<fieldset>` + `<legend>` heading, the kit's field rhythm
 * between the children, one `disabled` for all of them (passed to the kit controls inside through
 * `DisabledProvider`; the `<fieldset>` itself only says `aria-disabled`). No border, no padding,
 * no fill. Without a `label` it is the plain field column of a form. `layout="pair"` sets the
 * fields two to a row: a field left alone in the last row spans it, and a narrow group stacks them
 * in one column.
 */
export function Fieldset({
  label,
  description,
  disabled: disabledProp = false,
  layout = "stack",
  className,
  children,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: FieldsetProps) {
  const disabled = useInheritedDisabled(disabledProp);
  const descriptionId = React.useId();
  const hasDescription = hasContent(description);
  const describedBy =
    [ariaDescribedBy, hasDescription ? descriptionId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset
      {...rest}
      className={cx(styles.root, className)}
      // No native `disabled`: it would take every button inside out of reach, so a tooltip's
      // trigger would have to re-parent a control as the group flips. Each kit control disables
      // itself from the context (native `disabled` on its inputs, so the form skips them).
      aria-disabled={disabled || undefined}
      aria-describedby={describedBy}
      {...toDataAttributes({ disabled: disabled || undefined, layout })}
    >
      {hasContent(label) ? (
        <legend className={cx(textRole.titleS, styles.legend)}>{label}</legend>
      ) : null}
      <div className={styles.body}>
        {hasDescription ? (
          <p id={descriptionId} className={cx(textRole.bodyS, styles.description)}>
            {description}
          </p>
        ) : null}
        <div className={styles.fields}>
          <DisabledProvider disabled={disabled}>{children}</DisabledProvider>
        </div>
      </div>
    </fieldset>
  );
}

Fieldset.displayName = "Fieldset";
