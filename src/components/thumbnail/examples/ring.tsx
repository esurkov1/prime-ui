/** No outline by default: depth comes from the fill. `ring` adds a faint inner ring for photos with a white background on a light surface, where the edge would otherwise vanish. Use it only for such images. */
import { Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const PHOTO = "https://picsum.photos/seed/studio-white/320/240?grayscale";

export default function ThumbnailRingExample() {
  return (
    <div className={styles.row}>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="4:3" size="xl">
          <Thumbnail.Image src={PHOTO} />
        </Thumbnail.Root>
        <Typography.Root variant="caption" tone="muted">
          По умолчанию
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="4:3" size="xl" ring>
          <Thumbnail.Image src={PHOTO} />
        </Thumbnail.Root>
        <Typography.Root variant="caption" tone="muted">
          ring
        </Typography.Root>
      </div>
    </div>
  );
}
