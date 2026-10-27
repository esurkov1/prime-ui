import type * as React from "react";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useDisabledControl, useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconSlotClass } from "@/internal/iconBox";
import { iconLayout } from "@/internal/iconLayout";
import { useLabels } from "@/internal/labels";
import { press } from "@/internal/press";
import { SwitcherScroller } from "@/internal/SwitcherScroller";
import type { ControlSize } from "@/internal/states";
import { usePendingValue } from "@/internal/usePendingChanges";

import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const BUTTON_GROUP_LABELS: ButtonGroupLabels = { optional: "необязательно" };

export type ButtonGroupRootProps = Omit<FieldRootDomProps, "dir"> &
  FieldFrameProps & {
    orientation?: ButtonGroupOrientation;
    size?: ControlSize;
    fullWidth?: boolean;
    invalid?: boolean;
    reserveSupportRow?: boolean;
    id?: string;
    labels?: Partial<ButtonGroupLabels>;
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
  hintTone,
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
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const labels = useLabels(BUTTON_GROUP_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const horizontal = orientation !== "vertical";
  // A row is a switcher: it scrolls inside itself, never wraps (foundation §9). A column stacks.
  const Group = horizontal ? SwitcherScroller : "div";
  return (
    <FieldFrame
      {...rest}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      hintTone={hintTone}
      error={error}
      reserveSupportRow={reserveSupportRow}
      optionalLabel={labels.optional}
      group
      className={cx(styles.field, className)}
      data-full-width={fullWidth || undefined}
    >
      <Group
        id={ids.controlId}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? ids.labelledBy}
        aria-describedby={ids.describedBy}
        aria-invalid={ids.invalid || undefined}
        aria-required={required || undefined}
        className={cx(fieldTierClass, styles.root)}
        {...toDataAttributes({
          orientation: horizontal ? undefined : orientation,
          size,
          invalid: ids.invalid || undefined,
          "full-width": fullWidth,
        })}
      >
        {tier.provide(children)}
      </Group>
    </FieldFrame>
  );
}

ButtonGroupRoot.displayName = "ButtonGroup.Root";

export type ButtonGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void | Promise<void>;
  ref?: React.Ref<HTMLButtonElement>;
};

function ButtonGroupItem({
  className,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  type = "button",
  disabled: disabledProp,
  onClick,
  children,
  ref,
  ...rest
}: ButtonGroupItemProps) {
  const disabled = useInheritedDisabled(disabledProp);
  const off = useDisabledControl(disabled);
  // Icon placement drives optical padding and the square icon-only segment (as in Button).
  const layout = iconLayout(children, ButtonGroupIcon);
  // A toggle when any part of the pressed triad is given; a plain action segment otherwise. A
  // state the owner is still saving is drawn ahead of its answer.
  const toggle =
    pressedProp !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;
  const state = usePendingValue({
    value: pressedProp,
    defaultValue: defaultPressed ?? false,
    onChange: onPressedChange,
  });
  const pressed = toggle ? state.value : undefined;

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={off.native || undefined}
      aria-disabled={off.ariaDisabled ?? rest["aria-disabled"]}
      className={cx(styles.item, layout.iconOnly ? press.pressCompact : press.press, className)}
      aria-pressed={pressed}
      aria-busy={state.saving || undefined}
      {...toDataAttributes({
        state: pressed === undefined ? undefined : pressed ? "active" : "inactive",
        "icon-only": layout.iconOnly || undefined,
        "leading-icon": layout.leadingIcon || undefined,
        "trailing-icon": layout.trailingIcon || undefined,
      })}
      onClick={(event) => {
        // A reachable disabled segment (under a tooltip's trigger) takes no press, nor submits.
        if (off.reachable) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        if (toggle && !state.saving && !event.defaultPrevented) state.commit(!state.value);
      }}
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
    <span className={cx(iconSlotClass, styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonGroupIcon.displayName = "ButtonGroup.Icon";

export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem, Icon: ButtonGroupIcon };
