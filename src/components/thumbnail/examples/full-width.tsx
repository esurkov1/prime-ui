/** Covers in a card grid take the card width and keep 16:9, so every cover has one height — `fullWidth`. */
import { Bike } from "lucide-react";
import { Card, type PaletteColor, Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const BIKES: { id: string; title: string; meta: string; color: PaletteColor; photo?: string }[] = [
  { id: "1", title: "Honda ADV 350", meta: "2026 · 5672", color: "red" },
  {
    id: "2",
    title: "Yamaha NMAX 155",
    meta: "2026 · 1408",
    color: "gray",
    photo: "https://picsum.photos/seed/nmax/640/360",
  },
  { id: "3", title: "Honda PCX 160", meta: "2025 · 9031", color: "blue" },
];

export default function ThumbnailFullWidthExample() {
  return (
    <div className={styles.grid}>
      {BIKES.map((bike) => (
        <Card.Root key={bike.id} variant="panel">
          <Card.Body>
            <div className={styles.cardContent}>
              <Thumbnail.Root ratio="16:9" color={bike.color} fullWidth>
                {bike.photo ? <Thumbnail.Image src={bike.photo} /> : null}
                <Thumbnail.Fallback>
                  <Bike aria-hidden />
                </Thumbnail.Fallback>
              </Thumbnail.Root>
              <div className={styles.entityText}>
                <Typography.Root as="h3" variant="title-s" truncate>
                  {bike.title}
                </Typography.Root>
                <Typography.Root variant="caption" tone="secondary">
                  {bike.meta}
                </Typography.Root>
              </div>
            </div>
          </Card.Body>
        </Card.Root>
      ))}
    </div>
  );
}
