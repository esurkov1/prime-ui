import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./LinkButton.module.css";

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
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
};

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      size = "m",
      tone = "accent",
      disabled = false,
      asChild = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const shared = {
      className: cx(styles.root, className),
      ...toDataAttributes({ size, tone, disabled: disabled || undefined }),
    };

    if (asChild) {
      return (
        <ControlSizeProvider value={size}>
          <Slot
            {...rest}
            {...shared}
            ref={ref as React.Ref<HTMLElement>}
            aria-disabled={disabled || undefined}
            onClick={disabled ? (event: React.MouseEvent) => event.preventDefault() : rest.onClick}
          >
            {children}
          </Slot>
        </ControlSizeProvider>
      );
    }

    const content = <ControlSizeProvider value={size}>{children}</ControlSizeProvider>;

    if (disabled) {
      return (
        // biome-ignore lint/a11y/useSemanticElements: a disabled link has no href; the span keeps the link role without navigation
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          role="link"
          aria-disabled="true"
          tabIndex={-1}
          {...shared}
        >
          {content}
        </span>
      );
    }

    return (
      <a {...rest} ref={ref} {...shared}>
        {content}
      </a>
    );
  },
);

LinkButton.displayName = "LinkButton";
