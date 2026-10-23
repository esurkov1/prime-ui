import type * as React from "react";

import { cx } from "@/internal/cx";
import type { Tone } from "@/internal/states";

import styles from "./StatusDot.module.css";

export type StatusDotTone = Extract<Tone, "neutral" | "accent" | "success" | "warning" | "danger">;

export type StatusDotProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusDotTone;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A state in a line of text: a dot of the tone and the word that names it («● Работает»). The
 * word carries the meaning, the dot only repeats it; it takes the type and the color of the text
 * around it.
 */
export function StatusDot({ tone = "neutral", className, children, ...rest }: StatusDotProps) {
  return (
    <span {...rest} className={cx(styles.root, className)} data-tone={tone}>
      <span aria-hidden="true" className={styles.dot} />
      {children}
    </span>
  );
}
StatusDot.displayName = "StatusDot";
