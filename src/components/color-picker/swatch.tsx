import { Icon } from "@/icons";

import styles from "./swatch.module.css";

/*
 * One color swatch for ColorSwatches, ColorPresets and ColorPicker: the color layer (an SVG rect,
 * so no inline style; a checkerboard for "no color"), the selected check and the shared swatch
 * button look. Hosts size it with `--swatch-size` / `--swatch-radius` and mark the selection
 * with `data-state="checked"` and the check contrast with `data-contrast`.
 */

/** Class of a selectable swatch (button or option) sized by `--swatch-size` / `--swatch-radius`. */
export const swatchClass = styles.swatch;

/** Color layer of a swatch; `null` draws the "no color" checkerboard. */
export function SwatchFill({ value }: { value: string | null }) {
  if (value == null) return <span aria-hidden className={styles.checker} />;
  return (
    <svg className={styles.fill} aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect width="1" height="1" fill={value} />
    </svg>
  );
}

/** Check mark of the selected swatch; its color contrasts with the swatch (`data-contrast`). */
export function SwatchCheck() {
  return <Icon name="action.check" strokeWidth={3} className={styles.check} />;
}
