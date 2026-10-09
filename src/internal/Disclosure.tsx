import type * as React from "react";

import { cx } from "./cx";
import styles from "./disclosure.module.css";

export type DisclosureProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  /** Classes of the clip (a host that lets focus rings reach past it widens it). */
  clipClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A part that opens and closes in place: its height glides (`0fr ↔ 1fr`) while its content fades
 * and slides on the same clock — one stroke both ways. Always mounted; closed, the content keeps its
 * last state and leaves the accessibility tree once the close has played. The host sets the clock
 * with `--disclosure-duration` / `--disclosure-ease` (see `disclosure.module.css`). An open one on
 * its first render stands open: nothing plays on mount.
 */
export function Disclosure({ open, clipClassName, className, children, ...rest }: DisclosureProps) {
  return (
    <div className={cx(styles.root, className)} data-state={open ? "open" : "closed"} {...rest}>
      <div className={cx(styles.clip, clipClassName)}>{children}</div>
    </div>
  );
}
