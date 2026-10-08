import type * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./VisuallyHidden.module.css";

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The sr-only recipe as a class, for an element that must stay itself (a focusable file input). */
export const visuallyHiddenClass = styles.root;

/**
 * Text for screen readers only: spoken counters, live-region messages, names of icon-only parts.
 * Replaces the per-component `.srOnly` / `.visuallyHidden` CSS copies.
 */
export function VisuallyHidden({ className, ...rest }: VisuallyHiddenProps) {
  return <span className={cx(styles.root, className)} {...rest} />;
}
