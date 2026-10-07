/** Fallbacks: an icon on a palette fill, a short label, and an image that fails to load and falls back by itself. Use a color that means something (category, vehicle color), gray otherwise. */
import { FileText, Package } from "lucide-react";
import { Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ThumbnailFallbackExample() {
  return (
    <div className={styles.row}>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="4:3" size="l" color="green">
          <Thumbnail.Fallback>
            <Package aria-hidden />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography.Root variant="caption" tone="muted">
          Иконка
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="3:4" size="l" color="purple">
          <Thumbnail.Fallback>PDF</Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography.Root variant="caption" tone="muted">
          Подпись
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <Thumbnail.Root ratio="4:3" size="l">
          <Thumbnail.Image src="/missing-image.jpg" />
          <Thumbnail.Fallback>
            <FileText aria-hidden />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography.Root variant="caption" tone="muted">
          Ошибка загрузки
        </Typography.Root>
      </div>
    </div>
  );
}
