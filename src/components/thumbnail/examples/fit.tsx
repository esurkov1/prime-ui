/** A supplier's wide banner in a square frame: cropped to fill or shown whole on the fill — `fit`. */
import { Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const BANNER = "https://picsum.photos/seed/supplier-banner/480/160";
const FITS = ["cover", "contain"] as const;

export default function ThumbnailFitExample() {
  return (
    <div className={styles.row}>
      {FITS.map((fit) => (
        <div key={fit} className={styles.cell}>
          <Thumbnail.Root size="xl" color="gray">
            <Thumbnail.Image src={BANNER} fit={fit} alt="Ферма поставщика «Северное хозяйство»" />
          </Thumbnail.Root>
          <Typography as="span" variant="caption" tone="muted">
            {fit}
          </Typography>
        </div>
      ))}
    </div>
  );
}
