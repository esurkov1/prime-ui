import type * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./VisuallyHidden.module.css";

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement> & {
  /**
   * An announcement region: `polite` — `role="status"`, read after what is being said; `assertive`
   * — `role="alert"`, read at once. Both are atomic: the whole text is read on every change.
   */
  live?: "polite" | "assertive";
  ref?: React.Ref<HTMLSpanElement>;
};

/** The sr-only recipe as a class, for an element that must stay itself (a focusable file input). */
export const visuallyHiddenClass = styles.root;

/**
 * Text for screen readers only: spoken counters, live-region messages, names of icon-only parts.
 * Public as `VisuallyHidden` (docs in `src/components/visually-hidden/`); inside the kit it replaces
 * the per-component `.srOnly` / `.visuallyHidden` CSS copies.
 */
export function VisuallyHidden({ className, live, ...rest }: VisuallyHiddenProps) {
  const region = live
    ? ({
        role: live === "assertive" ? "alert" : "status",
        "aria-live": live,
        "aria-atomic": true,
      } as const)
    : null;
  return <span className={cx(styles.root, className)} {...region} {...rest} />;
}
VisuallyHidden.displayName = "VisuallyHidden";
