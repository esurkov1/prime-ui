import * as React from "react";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";

import { Spinner } from "../spinner/Spinner";
import styles from "./Button.module.css";

type ButtonLayout = {
  iconOnly: boolean;
  leadingIcon: boolean;
  trailingIcon: boolean;
};

/**
 * Reads the direct children to drive optical padding (icon side = padX − 4px),
 * the square icon-only shape and where the loading spinner goes.
 */
function getButtonLayout(children: React.ReactNode): ButtonLayout {
  const content = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const isIcon = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === ButtonIcon;
  const iconOnly = content.length > 0 && content.every(isIcon);

  return {
    iconOnly,
    leadingIcon: !iconOnly && content.length > 0 && isIcon(content[0]),
    trailingIcon: !iconOnly && content.length > 0 && isIcon(content[content.length - 1]),
  };
}

export type ButtonRootProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  /** Visual treatment. Default `solid`. */
  variant?: Variant;
  /** Semantic color. Default `accent`; `danger` for destructive actions. */
  tone?: Extract<Tone, "accent" | "neutral" | "danger">;
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
};

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
  (
    {
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
      ...rest
    },
    ref,
  ) => {
    // Without an explicit size the button takes the tier of its host (a form, a panel, a field).
    const hostSize = useOptionalControlSize();
    const size = sizeProp ?? hostSize ?? "m";
    const isDisabled = disabled || loading;
    const layout = getButtonLayout(children);
    const dataAttrs = toDataAttributes({
      variant,
      tone,
      size,
      disabled: isDisabled || undefined,
      loading,
      "full-width": fullWidth,
      "icon-only": layout.iconOnly || undefined,
      "leading-icon": layout.leadingIcon || undefined,
      "trailing-icon": layout.trailingIcon || undefined,
      // Without a leading icon the spinner is centered over the hidden label: width stays put.
      "loading-overlay":
        (loading && !asChild && !layout.leadingIcon && !layout.iconOnly) || undefined,
    });

    if (asChild) {
      return (
        <ControlSizeProvider value={size}>
          <Slot
            {...rest}
            ref={ref as React.Ref<HTMLElement>}
            className={cx(styles.root, className)}
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
        className={cx(styles.root, className)}
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
  },
);

ButtonRoot.displayName = "Button.Root";

export type ButtonIconProps = {
  children: React.ReactNode;
  className?: string;
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
