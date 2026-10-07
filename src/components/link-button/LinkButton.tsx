import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./LinkButton.module.css";

export type LinkButtonRootProps = {
  size?: ControlSize;
  /** `accent` — a regular link; `neutral` — quiet links in footers, metadata and dense navigation. */
  tone?: Extract<Tone, "accent" | "neutral">;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const LinkButtonRoot = React.forwardRef<HTMLAnchorElement, LinkButtonRootProps>(
  (
    {
      size = "m",
      tone = "accent",
      disabled = false,
      children,
      className,
      tabIndex,
      "aria-disabled": ariaDisabled,
      ...rest
    },
    ref,
  ) => {
    const cls = cx(styles.root, className);
    const dataProps = toDataAttributes({
      size,
      tone,
      ...(disabled ? { disabled: true } : {}),
    });

    if (disabled) {
      return (
        // biome-ignore lint/a11y/useSemanticElements: disabled state is not a navigable <a>; span keeps cursor + a11y without href
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          role="link"
          aria-disabled="true"
          tabIndex={-1}
          className={cls}
          {...dataProps}
        >
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </span>
      );
    }

    return (
      <a
        {...rest}
        ref={ref}
        className={cls}
        aria-disabled={ariaDisabled}
        tabIndex={tabIndex}
        {...dataProps}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </a>
    );
  },
);

LinkButtonRoot.displayName = "LinkButton.Root";

export const LinkButton = {
  Root: LinkButtonRoot,
};
