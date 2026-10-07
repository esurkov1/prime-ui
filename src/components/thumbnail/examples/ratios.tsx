/** Five aspect ratios at the same height: 1:1 · 4:3 · 3:2 · 16:9 · 3:4. Pick the ratio of the source images, keep one ratio per list. */
import { Image } from "lucide-react";
import { Thumbnail, type ThumbnailRatio, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ratios: ThumbnailRatio[] = ["1:1", "4:3", "3:2", "16:9", "3:4"];

export default function ThumbnailRatiosExample() {
  return (
    <div className={styles.row}>
      {ratios.map((ratio) => (
        <div key={ratio} className={styles.cell}>
          <Thumbnail.Root size="xl" ratio={ratio} color="blue">
            <Thumbnail.Fallback>
              <Image aria-hidden />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
          <Typography.Root variant="code" tone="muted">
            {ratio}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
