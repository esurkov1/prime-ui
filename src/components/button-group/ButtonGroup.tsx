import type * as React from "react";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconLayout } from "@/internal/iconLayout";
import type { ControlSize } from "@/internal/states";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const BUTTON_GROUP_LABELS: ButtonGroupLabels = { optional: "необязательно" };

export type ButtonGroupRootProps = Omit<FieldRootDomProps, "dir"> &
  Omit<FieldFrameProps, "focusRing"> & {
    orientation?: ButtonGroupOrientation;
    /** Tier. Default: the tier of the surrounding control (a toolbar, a panel), else `m`. */
    size?: ControlSize;
    /** Stretch the group to its container; horizontal segments share the width equally. */
    fullWidth?: boolean;
    /** Invalid state: a danger ring on every segment and `aria-invalid` on the group. */
    invalid?: boolean;
    /** Always render the support row so an appearing error does not shift the layout. */
    reserveSupportRow?: boolean;
    /** Id of the `role="group"` element; generated when omitted. */
    id?: string;
    labels?: Partial<ButtonGroupLabels>;
    /** `ButtonGroup.Item` segments. */
    children?: React.ReactNode;
  };

/**
 * The field: label · the segments · hint or error. `className`, `ref` and the rest go to the frame;
 * `id`, `role` and the `aria-label*` / `aria-describedby` names to the `role="group"` element.
 */
function ButtonGroupRoot({
  orientation = "horizontal",
  size: sizeProp,
  fullWidth,
  label,
  required = false,
  optional = false,
  hint,
  error,
  invalid,
  reserveSupportRow = false,
  id,
  labels: labelsProp,
  children,
  className,
  role = "group",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ButtonGroupRootProps) {
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  return (
    <FieldFrame
      {...rest}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      reserveSupportRow={reserveSupportRow}
      optionalLabel={labelsProp?.optional ?? BUTTON_GROUP_LABELS.optional}
      group
      className={cx(styles.field, className)}
      data-full-width={fullWidth || undefined}
    >
      {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: `role` is `group` or the consumer's `toolbar`, both take a name */}
      <div
        id={ids.controlId}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? ids.labelledBy}
        aria-describedby={ids.describedBy}
        aria-invalid={ids.invalid || undefined}
        aria-required={required || undefined}
        className={cx(fieldTierClass, styles.root)}
        {...toDataAttributes({
          orientation: orientation === "vertical" ? orientation : undefined,
          size,
          invalid: ids.invalid || undefined,
          "full-width": fullWidth,
        })}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </div>
    </FieldFrame>
  );
}

ButtonGroupRoot.displayName = "ButtonGroup.Root";

export type ButtonGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Toggle state of the segment: `aria-pressed` and `data-state="active" | "inactive"`. */
  pressed?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

function ButtonGroupItem({
  className,
  pressed,
  type = "button",
  disabled: disabledProp,
  children,
  ref,
  ...rest
}: ButtonGroupItemProps) {
  const disabled = useInheritedDisabled(disabledProp);
  // Icon placement drives optical padding and the square icon-only segment (as in Button).
  const layout = iconLayout(children, ButtonGroupIcon);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || undefined}
      className={cx(styles.item, className)}
      aria-pressed={pressed}
      {...toDataAttributes({
        state: pressed === undefined ? undefined : pressed ? "active" : "inactive",
        "icon-only": layout.iconOnly || undefined,
        "leading-icon": layout.leadingIcon || undefined,
        "trailing-icon": layout.trailingIcon || undefined,
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

ButtonGroupItem.displayName = "ButtonGroup.Item";

export type ButtonGroupIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function ButtonGroupIcon({ children, className, ...rest }: ButtonGroupIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonGroupIcon.displayName = "ButtonGroup.Icon";

export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem, Icon: ButtonGroupIcon };
