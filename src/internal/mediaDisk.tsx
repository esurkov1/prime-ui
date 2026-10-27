import { Play } from "@/icons/glyphs/play";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import pill from "@/internal/mediaPill.module.css";

import styles from "./mediaDisk.module.css";

/**
 * The still disk over media: the look of `Button shape="circle" variant="shade"` (`l`) for a disk
 * that is not a control. Join it with `data-size="l"` (the control tier it takes its diameter
 * from). A host positions it; it may shrink it to a small frame (the glyph follows at half the
 * diameter).
 */
export const mediaDiskClass = cx(fieldTierClass, pill.ink, styles.disk);

/**
 * The play mark of a video frame: the still media disk with the play glyph — the same size, ground
 * and glyph as the play and transfer disks over media. Decorative: the tile around it is the
 * button and says what it opens. Always mounted: `shown={false}` fades and shrinks it away (the
 * frame plays, a transfer takes the middle) and it comes back the same way.
 */
export function MediaPlayMark({
  shown = true,
  className,
}: {
  shown?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(mediaDiskClass, className)}
      data-size="l"
      data-shown={shown}
      aria-hidden="true"
    >
      <Play fill="currentColor" />
    </span>
  );
}
