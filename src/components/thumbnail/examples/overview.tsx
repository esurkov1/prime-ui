/** A vehicle next to its name: the photo with an icon fallback underneath — `Thumbnail.Image`, `Thumbnail.Fallback`, `ratio`. */
import { Bike } from "lucide-react";
import { Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const PHOTO = "https://picsum.photos/seed/nmax/320/180";

export default function ThumbnailOverviewExample() {
  return (
    <div className={styles.entity}>
      <Thumbnail.Root ratio="16:9" color="gray">
        <Thumbnail.Image src={PHOTO} />
        <Thumbnail.Fallback>
          <Bike aria-hidden />
        </Thumbnail.Fallback>
      </Thumbnail.Root>
      <div className={styles.entityText}>
        <Typography.Root variant="body-m" weight="medium" truncate>
          Yamaha NMAX 155 · 2026
        </Typography.Root>
        <Typography.Root variant="caption" tone="secondary" truncate>
          Серый · Пробег 3 200 км
        </Typography.Root>
      </div>
    </div>
  );
}
