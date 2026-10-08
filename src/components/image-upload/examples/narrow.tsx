/** On a phone-width screen the tiles go three across and then two, the cover keeps two columns, and the actions stay on the photos without hover. */
import { ImageUpload, type ImageUploadItem } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PHOTOS: ImageUploadItem[] = [
  { id: "sh-front", src: "https://picsum.photos/seed/sh-front/480/480", alt: "Спереди" },
  { id: "sh-side", src: "https://picsum.photos/seed/sh-side/480/480", alt: "Сбоку" },
  { id: "sh-back", src: "https://picsum.photos/seed/sh-back/480/480", alt: "Сзади" },
  { id: "sh-seat", src: "https://picsum.photos/seed/sh-seat/480/480", alt: "Сиденье" },
];

/** New files as items: an object URL stands in until the upload answers. */
const toItems = (files: File[]): ImageUploadItem[] =>
  files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    src: URL.createObjectURL(file),
    alt: file.name,
  }));

export default function ImageUploadNarrowExample() {
  const [photos, setPhotos] = React.useState<readonly ImageUploadItem[]>(PHOTOS);

  return (
    <div className={styles.phone}>
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
