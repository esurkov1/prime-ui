import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./LinkButton.module.css";

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ControlSize;
  /** `accent` — a regular link; `neutral` — quiet links in footers, metadata and dense navigation. */
  tone?: Extract<Tone, "accent" | "neutral">;
  disabled?: boolean;
};

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ size = "m", tone = "accent", disabled = false, children, className, ...rest }, ref) => {
    const shared = {
      className: cx(styles.root, className),
      ...toDataAttributes({ size, tone, disabled: disabled || undefined }),
    };
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
