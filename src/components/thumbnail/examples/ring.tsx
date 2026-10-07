/** A faint inner ring for a white-background photo on a light surface, where the edge would vanish — `ring`. */
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
        <Typography as="span" variant="caption" tone="muted">
          Без кольца
        </Typography>
      </div>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="4:3" size="xl" ring>
          <Thumbnail.Image src={PHOTO} />
        </Thumbnail.Root>
        <Typography as="span" variant="caption" tone="muted">
          С кольцом
        </Typography>
      </div>
    </div>
  );
}
