/** Five tiers: height 24 · 32 · 40 · 48 · 64, radius 4 · 6 · 8 · 8 · 12. Default m (40) fits a two-line table cell. */
import { Package } from "lucide-react";
import { Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function ThumbnailSizesExample() {
  return (
    <div className={styles.row}>
      {sizes.map((size) => (
        <div key={size} className={styles.cell}>
          <Thumbnail.Root size={size} ratio="4:3" color="orange">
            <Thumbnail.Fallback>
              <Package aria-hidden />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
          <Typography.Root variant="code" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
