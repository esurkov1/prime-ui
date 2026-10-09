import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DisabledProvider, useInheritedDisabled } from "@/internal/disabledContext";
import textRole from "@/internal/textRole.module.css";

import styles from "./Fieldset.module.css";

export type FieldsetProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "disabled"
> & {
  /** Group heading (`title-s`) in the native `<legend>`; it names the group. */
  label?: React.ReactNode;
  /** Secondary text under the heading; linked to the group through `aria-describedby`. */
  description?: React.ReactNode;
  /**
   * Disables every control inside: native `disabled` on the `<fieldset>` (native controls) plus the
   * kit's disabled context, so kit controls render, announce and behave disabled. Use it while the
   * form's request runs.
   */
  disabled?: boolean;
  /** The fields; they stack at the form rhythm (field → field 20). */
  children: React.ReactNode;
  ref?: React.Ref<HTMLFieldSetElement>;
};

/**
 * A frameless group of fields: native `<fieldset>` + `<legend>` heading, the kit's field rhythm
 * between the children, one `disabled` for all of them. No border, no padding, no fill.
 */
export function Fieldset({
  label,
  description,
  disabled: disabledProp = false,
  className,
  children,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: FieldsetProps) {
  const disabled = useInheritedDisabled(disabledProp);
  const descriptionId = React.useId();
  const hasLabel = label != null && label !== false && label !== "";
  const hasDescription = description != null && description !== false && description !== "";
  const describedBy =
    [ariaDescribedBy, hasDescription ? descriptionId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset
      {...rest}
      className={cx(styles.root, className)}
      disabled={disabled || undefined}
      aria-describedby={describedBy}
      {...toDataAttributes({ disabled: disabled || undefined })}
    >
      {hasLabel ? <legend className={cx(textRole.titleS, styles.legend)}>{label}</legend> : null}
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
