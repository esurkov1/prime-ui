import type * as React from "react";

import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./LinkButton.module.css";

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Tier. Default: the tier of the surrounding control or text host, else `m`. */
  size?: ControlSize;
  /** `accent` — a regular link; `neutral` — quiet links in footers, metadata and dense navigation. */
  tone?: Extract<Tone, "accent" | "neutral">;
  disabled?: boolean;
  /**
   * Merges the link look onto its single child instead of rendering `<a>`: a router link, or a
   * `<button type="button">` for an inline action that is not navigation («выберите файл»).
   * `disabled` becomes `aria-disabled` and swallows the click.
   */
  asChild?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

export function LinkButton({
  size: sizeProp,
  tone = "accent",
  disabled = false,
  asChild = false,
  children,
  className,
  href,
  onClick,
  ref,
  ...rest
}: LinkButtonProps) {
  const size = useControlSize(sizeProp);
  const shared = {
    className: cx(styles.root, className),
    ...toDataAttributes({ size, tone, disabled: disabled || undefined }),
  };
  const swallowClick = (event: React.MouseEvent) => event.preventDefault();

  if (asChild) {
    return (
      <ControlSizeProvider value={size}>
        <Slot
          {...rest}
          {...shared}
          href={href}
          ref={ref as React.Ref<HTMLElement>}
          aria-disabled={disabled || undefined}
          onClick={disabled ? swallowClick : onClick}
        >
          {children}
        </Slot>
      </ControlSizeProvider>
    );
  }

  // A disabled link keeps its element, id and ARIA but loses `href`, the tab stop and the click.
  return (
    <a
      {...rest}
      {...shared}
      ref={ref}
      href={disabled ? undefined : href}
      role={disabled ? "link" : rest.role}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
      onClick={disabled ? swallowClick : onClick}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </a>
  );
}

LinkButton.displayName = "LinkButton";
