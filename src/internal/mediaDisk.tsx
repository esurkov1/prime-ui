import { Icon } from "@/icons";
import { cx } from "@/internal/cx";

import styles from "./mediaDisk.module.css";

/**
 * The still disk over media: the look of `Button shape="circle" variant="shade"` (`l`) for a disk
 * that is not a control. A host positions it; it may shrink it to a small frame (the glyph follows
 * at half the diameter).
 */
export const mediaDiskClass = styles.disk;

/**
 * The play mark of a video frame: the still media disk with the play glyph — the same size, ground
 * and glyph as the play and transfer disks over media. Decorative: the tile around it is the
 * button and says what it opens.
 */
export function MediaPlayMark({ className }: { className?: string }) {
  return (
    <span className={cx(styles.disk, className)} aria-hidden="true">
      <Icon name="action.play" fill="currentColor" />
    </span>
  );
}
