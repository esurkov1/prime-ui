/** In a phone-width column the zone text wraps, a long file name truncates, and a gallery goes three across and then two, the cover keeping two columns and the remove buttons shown without hover — `layout`, `cover`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PHOTOS: FileUploadFile[] = [
  {
    id: "sh-front",
    name: "Спереди.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sh-front/480/480",
  },
  {
    id: "sh-side",
    name: "Сбоку.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sh-side/480/480",
  },
  {
    id: "sh-back",
    name: "Сзади.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sh-back/480/480",
  },
  {
    id: "sh-seat",
    name: "Сиденье.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sh-seat/480/480",
  },
];

const RECEIPT: readonly FileUploadFile[] = [
  {
    id: "receipt",
    name: "Кассовый чек от 12 марта, заказ 48210.pdf",
    size: 180_000,
    type: "application/pdf",
  },
];

/** New files as items: an object URL stands in until the upload answers. */
const toFiles = (files: File[]): FileUploadFile[] =>
  files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    size: file.size,
    type: file.type,
    src: URL.createObjectURL(file),
  }));

export default function FileUploadNarrowExample() {
  const [photos, setPhotos] = React.useState<readonly FileUploadFile[]>(PHOTOS);

  return (
    <div className={styles.narrow}>
      <FileUpload.Root label="Чек об оплате" defaultValue={RECEIPT} />
      <FileUpload.Root
        label="Фотографии скутера"
        hint="До 10 фото"
        trigger="tile"
        layout="grid"
        cover
        accept="image/*"
        multiple
        max={10}
        value={photos}
        onValueChange={setPhotos}
        onFilesChange={(files) => setPhotos((current) => [...current, ...toFiles(files)])}
      />
    </div>
  );
}
