/** Photos of a rental scooter: numbered tiles in their order, the last tile adds more; drag to reorder, the corner button removes — `label`, `hint`, `max`, `onFilesAdd`, `onValueChange`. */
import { ImageUpload, type ImageUploadItem } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PHOTOS: ImageUploadItem[] = [
  { id: "nmax-front", src: "https://picsum.photos/seed/nmax-front/480/480", alt: "Спереди" },
  { id: "nmax-side", src: "https://picsum.photos/seed/nmax-side/480/480", alt: "Сбоку" },
  { id: "nmax-back", src: "https://picsum.photos/seed/nmax-back/480/480", alt: "Сзади" },
];

/** New files as items: an object URL stands in until the upload answers. */
const toItems = (files: File[]): ImageUploadItem[] =>
  files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    src: URL.createObjectURL(file),
    alt: file.name,
  }));

export default function ImageUploadOverviewExample() {
  const [photos, setPhotos] = React.useState<readonly ImageUploadItem[]>(PHOTOS);

  return (
    <div className={styles.column}>
      <ImageUpload
        label="Фотографии"
        hint="JPG, PNG или WebP · до 10 МБ"
        max={10}
        value={photos}
        onValueChange={setPhotos}
        onFilesAdd={(files) => setPhotos((current) => [...current, ...toItems(files)])}
      />
    </div>
  );
}
