/** Every aspect ratio at the same height; keep one ratio per list — `ratio`. */
import { Icon, Thumbnail, type ThumbnailRatio, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const RATIOS: ThumbnailRatio[] = ["1:1", "4:3", "3:2", "16:9", "3:4"];

export default function ThumbnailRatiosExample() {
  return (
    <div className={styles.row}>
      {RATIOS.map((ratio) => (
        <div key={ratio} className={styles.cell}>
          <Thumbnail.Root size="xl" ratio={ratio} color="blue">
            <Thumbnail.Fallback>
              <Icon name="object.image" />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
          <Typography as="span" variant="caption" tone="muted">
            {ratio}
          </Typography>
        </div>
      ))}
    </div>
  );
}
