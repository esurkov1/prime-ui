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
  children: React.ReactNode;
  ref?: React.Ref<HTMLFieldSetElement>;
};

/**
 * A frameless group of fields: native `<fieldset>` + `<legend>` heading, the kit's field rhythm
 * between the children, one `disabled` for all of them. No border, no padding, no fill. Without a
 * `label` it is the plain field column of a form.
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
  const hasDescription = hasContent(description);
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
