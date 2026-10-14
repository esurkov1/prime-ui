import { cx } from "./cx";
import fieldTier from "./fieldTier.module.css";
import styles from "./iconBox.module.css";
import type { ControlSize } from "./states";

/** The control icon of each tier (`--field-icon`), for an icon that carries no `data-size`. */
const TIER_ICON: Record<ControlSize, string> = {
  xs: fieldTier.iconXs,
  s: fieldTier.iconS,
  m: fieldTier.iconM,
  l: fieldTier.iconL,
  xl: fieldTier.iconXl,
};

/**
 * Class names of the shared icon box (Icon, Spinner). An explicit `size` takes the global icon
 * scale; without it the box follows the host's `--prime-icon-size`, else `tier` (the nearest
 * `ControlSizeProvider`), else `m`.
 */
export function iconBoxClass(size: ControlSize | undefined, tier: ControlSize | undefined): string {
  if (size !== undefined) return cx(styles.box, styles[size]);
  return cx(styles.box, styles.inherit, TIER_ICON[tier ?? "m"]);
}

/**
 * A slot that holds a glyph the kit does not draw (a raw `<svg>` of an app's own icon set): the
 * svg takes the host's `--prime-icon-size`, like a kit `Icon` in the same place. A kit `Icon`
 * keeps its own box (the slot rule has no specificity).
 */
export const iconSlotClass: string = styles.slot;

export { styles as iconBoxStyles };
