import { cx } from "@/internal/cx";

import styles from "./CheckMark.module.css";

export type CheckMarkState = "checked" | "unchecked" | "indeterminate";

/**
 * The kit's check and indeterminate bar, drawn in with a stroke reveal (foundation §7 rule 8: a
 * check draws in, it does not pop). Both paths stay in the DOM so the mark animates both ways;
 * `state` picks the one that shows. Color is `currentColor`; size comes from the host box.
 * Shared by Checkbox and the color swatches. Own SVG instead of `Icon`: the motion needs
 * `pathLength` on the paths.
 */
export function CheckMark({ state, className }: { state: CheckMarkState; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx(styles.svg, className)}
      data-state={state}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.5 12.5l4.25 4.25L18.5 8" pathLength={1} className={styles.check} />
      <path d="M7 12h10" pathLength={1} className={styles.bar} />
    </svg>
  );
}
