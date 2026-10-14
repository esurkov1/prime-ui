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

/**
 * A slot that holds a glyph the kit does not draw (a raw `<svg>` of an app's own icon set): the
 * svg takes the host's `--prime-icon-size`, like a kit `Icon` in the same place. A kit `Icon`
 * keeps its own box (the slot rule has no specificity).
 */
export const iconSlotClass: string = styles.slot;

export { styles as iconBoxStyles };
