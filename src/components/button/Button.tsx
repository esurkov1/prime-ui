import type * as React from "react";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconLayout } from "@/internal/iconLayout";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";
import { touchTargetClass } from "@/internal/touchTarget";

import { Spinner } from "../spinner/Spinner";
import styles from "./Button.module.css";

/**
 * `tone="inherit"` takes the host's text color (a close button on a solid Banner): fills are a
 * `currentColor` wash, so it has no `solid` treatment.
 */
type ButtonColorProps =
  | {
      /** Visual treatment. Default `solid`. */
      variant?: Variant;
      /** Semantic color. Default `accent`; `danger` for destructive actions. */
      tone?: Extract<Tone, "accent" | "neutral" | "danger">;
    }
  | {
      variant: Exclude<Variant, "solid">;
      /** Takes the host's text color; for actions placed on a colored host. */
      tone: "inherit";
    };

export type ButtonRootProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> &
  ButtonColorProps & {
    /** Tier. Default: the tier of the surrounding control (a form, a panel, a field), else `m`. */
    size?: ControlSize;
    fullWidth?: boolean;
    loading?: boolean;
    /**
     * Merges Button props onto its single child element instead of rendering `<button>`.
     * `disabled` / `loading` become `aria-disabled` (a link has no native `disabled`), `type` is
     * dropped, and no spinner is added — the child owns its content.
     */
    asChild?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  };

function ButtonRoot({
  children,
  className,
  variant = "solid",
  tone = "accent",
  size: sizeProp,
  fullWidth,
  type = "button",
  loading = false,
  disabled,
  asChild = false,
  onClick,
  ref,
  ...rest
}: ButtonRootProps) {
  const size = useControlSize(sizeProp);
  const isDisabled = disabled || loading;
  const layout = iconLayout(children, ButtonIcon);
  const dataAttrs = toDataAttributes({
    variant,
    tone,
    size,
    // `disabled` only: a loading button is busy, not unavailable, and keeps its colors.
    disabled: disabled || undefined,
    loading,
    "full-width": fullWidth,
    "icon-only": layout.iconOnly || undefined,
    "leading-icon": layout.leadingIcon || undefined,
    "trailing-icon": layout.trailingIcon || undefined,
    // Without a leading icon the spinner is centered over the hidden label: width stays put.
    "loading-overlay":
      (loading && !asChild && !layout.leadingIcon && !layout.iconOnly) || undefined,
  });
  const classes = cx(fieldTierClass, touchTargetClass, styles.root, className);

  if (asChild) {
    return (
      <ControlSizeProvider value={size}>
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={classes}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          onClick={isDisabled ? (event: React.MouseEvent) => event.preventDefault() : onClick}
          {...dataAttrs}
        >
          {children}
        </Slot>
      </ControlSizeProvider>
    );
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...dataAttrs}
    >
      <ControlSizeProvider value={size}>
        {loading ? <Spinner className={styles.spinner} aria-hidden="true" /> : null}
        {children}
      </ControlSizeProvider>
    </button>
  );
}

ButtonRoot.displayName = "Button.Root";

export type ButtonIconProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function ButtonIcon({ children, className, ...rest }: ButtonIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonIcon.displayName = "Button.Icon";

export const Button = { Root: ButtonRoot, Icon: ButtonIcon };
