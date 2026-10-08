/** The listing editor keeps the photos: the cover and the order are saved on every change, and a button brings back the published set — `value`, `onValueChange`, `variant`. */
import { Button, ImageUpload, type ImageUploadItem, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PUBLISHED: readonly ImageUploadItem[] = [
  { id: "pcx-front", src: "https://picsum.photos/seed/pcx-front/480/480", alt: "Спереди" },
  { id: "pcx-side", src: "https://picsum.photos/seed/pcx-side/480/480", alt: "Сбоку" },
  { id: "pcx-back", src: "https://picsum.photos/seed/pcx-back/480/480", alt: "Сзади" },
  { id: "pcx-dash", src: "https://picsum.photos/seed/pcx-dash/480/480", alt: "Приборная панель" },
];

/** New files as items: an object URL stands in until the upload answers. */
const toItems = (files: File[]): ImageUploadItem[] =>
  files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    src: URL.createObjectURL(file),
    alt: file.name,
  }));

export default function ImageUploadControlledExample() {
  const [photos, setPhotos] = React.useState<readonly ImageUploadItem[]>(PUBLISHED);
  const cover = photos[0];

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {photos === PUBLISHED
            ? "Опубликованный набор"
            : `Сохранено: ${photos.length} фото, обложка — ${cover?.alt ?? "нет"}`}
        </Typography>
        <div className={styles.spacer} />
        <Button.Root
          variant="ghost"
          tone="neutral"
          disabled={photos === PUBLISHED}
          onClick={() => setPhotos(PUBLISHED)}
        >
          Вернуть
        </Button.Root>
      </div>
      <ImageUpload
        label="Фотографии"
        variant="cover"
        max={10}
        value={photos}
        onValueChange={setPhotos}
        onFilesAdd={(files) => setPhotos((current) => [...current, ...toItems(files)])}
      />
    </div>
  );
}
