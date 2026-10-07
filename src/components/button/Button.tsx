import * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";

import styles from "./Button.module.css";

type ButtonContextValue = {
  loading: boolean;
};

const [ButtonProvider, useButtonContext] = createComponentContext<ButtonContextValue>("Button");

type ButtonLayout = {
  iconOnly: boolean;
  leadingIcon: boolean;
  trailingIcon: boolean;
  hasSpinner: boolean;
};

/**
 * Reads the direct children to drive optical padding (icon side = padX − 4px),
 * the square icon-only shape and where the loading spinner goes.
 */
function getButtonLayout(children: React.ReactNode): ButtonLayout {
  const items = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const isIcon = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === ButtonIcon;
  const isSpinner = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === ButtonSpinner;
  const content = items.filter((child) => !isSpinner(child));
  const iconOnly = content.length > 0 && content.every(isIcon);

  return {
    iconOnly,
    leadingIcon: !iconOnly && content.length > 0 && isIcon(content[0]),
    trailingIcon: !iconOnly && content.length > 0 && isIcon(content[content.length - 1]),
    hasSpinner: items.some(isSpinner),
  };
}

export type ButtonRootProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  /** Visual treatment. Default `solid`. */
  variant?: Variant;
  /** Semantic color. Default `accent`; `danger` for destructive actions. */
  tone?: Extract<Tone, "accent" | "neutral" | "danger">;
  size?: ControlSize;
  fullWidth?: boolean;
  loading?: boolean;
  /**
   * Merges Button props onto its single child element instead of rendering `<button>`.
   * Use when the trigger must be a different element (e.g. `<a>`, React Router `<Link>`).
   *
   * - `disabled` / `loading` → `aria-disabled="true"` + `pointer-events: none` (CSS);
   *   native `disabled` attribute is NOT set (invalid on non-button elements).
   * - `type` is not forwarded (irrelevant for non-button elements).
   * - The child must accept `className`, `aria-*`, `data-*`, and event handler props.
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
      size = "m",
      fullWidth,
      type = "button",
      loading = false,
      disabled,
      asChild = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const contextValue = React.useMemo(() => ({ loading }), [loading]);

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
      // Auto spinner without a leading icon is centered over the hidden label: width stays put.
      "loading-overlay":
        (loading && !asChild && !layout.hasSpinner && !layout.leadingIcon && !layout.iconOnly) ||
        undefined,
    });

    if (asChild) {
      const { onClick: userOnClick, ...restWithoutClick } = rest;
      return (
        <ButtonProvider value={contextValue}>
          <ControlSizeProvider value={size}>
            <Slot
              {...restWithoutClick}
              ref={ref as React.Ref<HTMLElement>}
              className={cx(styles.root, className)}
              aria-disabled={isDisabled || undefined}
              aria-busy={loading || undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              onClick={
                isDisabled
                  ? (e: React.MouseEvent) => {
                      e.preventDefault();
                    }
                  : userOnClick
              }
              {...dataAttrs}
            >
              {children}
            </Slot>
          </ControlSizeProvider>
        </ButtonProvider>
      );
    }

    return (
      <ButtonProvider value={contextValue}>
        <button
          {...rest}
          ref={ref}
          type={type}
          className={cx(styles.root, className)}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...dataAttrs}
        >
          <ControlSizeProvider value={size}>
            {loading && !layout.hasSpinner ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            {children}
          </ControlSizeProvider>
        </button>
      </ButtonProvider>
    );
  },
);

ButtonRoot.displayName = "ButtonRoot";

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

ButtonIcon.displayName = "ButtonIcon";

export type ButtonSpinnerProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

function ButtonSpinner({ className, ...rest }: ButtonSpinnerProps) {
  const { loading } = useButtonContext();
  if (!loading) return null;
  return <span className={cx(styles.spinner, className)} aria-hidden="true" {...rest} />;
}

ButtonSpinner.displayName = "ButtonSpinner";

export const Button = { Root: ButtonRoot, Icon: ButtonIcon, Spinner: ButtonSpinner };
