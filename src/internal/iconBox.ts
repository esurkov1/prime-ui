import { cx } from "./cx";
import styles from "./iconBox.module.css";
import type { ControlSize } from "./states";

/**
 * Class names of the shared icon box (Icon, Spinner). An explicit `size` takes the global icon
 * scale; without it the box follows the host's `--prime-icon-size`, else `tier` (the nearest
 * `ControlSizeProvider`), else `m`.
 */
export function iconBoxClass(size: ControlSize | undefined, tier: ControlSize | undefined): string {
  return cx(styles.box, styles[size ?? tier ?? "m"], size === undefined && styles.inherit);
}

export { styles as iconBoxStyles };
