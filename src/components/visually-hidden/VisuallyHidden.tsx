import type * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./VisuallyHidden.module.css";

export type VisuallyHiddenProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "role" | "aria-live" | "aria-atomic" | "aria-relevant"
> & {
  live?: "polite" | "assertive";
  ref?: React.Ref<HTMLSpanElement>;
};

/** The sr-only recipe as a class, for an element that must stay itself (a focusable file input). */
export const visuallyHiddenClass = styles.root;

/**
 * Text for screen readers only: spoken counters, live-region messages, names of icon-only parts.
 * The one sr-only recipe and the one announcement region of the kit: a live region is
 * `live="polite"` / `live="assertive"`, never a hand-set `role` / `aria-live` (the props type has
 * none, and the region attributes win over the rest).
 */
export function VisuallyHidden({ className, live, ...rest }: VisuallyHiddenProps) {
  const region = live
    ? ({
        role: live === "assertive" ? "alert" : "status",
        "aria-live": live,
        "aria-atomic": true,
      } as const)
    : null;
  return <span {...rest} className={cx(styles.root, className)} {...region} />;
}
VisuallyHidden.displayName = "VisuallyHidden";
