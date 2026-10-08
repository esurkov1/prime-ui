/** The same photos in both looks: equal numbered tiles, and the cover two rows tall with a make-cover plate on every other photo — `variant`. */
import {
  ImageUpload,
  type ImageUploadItem,
  type ImageUploadVariant,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const VARIANTS: ImageUploadVariant[] = ["grid", "cover"];

const PHOTOS: ImageUploadItem[] = [
  { id: "ninja-front", src: "https://picsum.photos/seed/ninja-front/480/480", alt: "Спереди" },
  { id: "ninja-side", src: "https://picsum.photos/seed/ninja-side/480/480", alt: "Сбоку" },
  { id: "ninja-back", src: "https://picsum.photos/seed/ninja-back/480/480", alt: "Сзади" },
  {
    id: "ninja-dash",
    src: "https://picsum.photos/seed/ninja-dash/480/480",
    alt: "Приборная панель",
  },
  { id: "ninja-seat", src: "https://picsum.photos/seed/ninja-seat/480/480", alt: "Сиденье" },
  { id: "ninja-wheel", src: "https://picsum.photos/seed/ninja-wheel/480/480", alt: "Колесо" },
];

/** New files as items: an object URL stands in until the upload answers. */
const toItems = (files: File[]): ImageUploadItem[] =>
  files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    src: URL.createObjectURL(file),
    alt: file.name,
  }));

export default function ImageUploadVariantsExample() {
  const [sets, setSets] = React.useState<Record<ImageUploadVariant, readonly ImageUploadItem[]>>({
    grid: PHOTOS,
    cover: PHOTOS,
  });

  return VARIANTS.map((variant) => (
    <div key={variant}>
      <div className={styles.column}>
        <ImageUpload
          label="Фотографии"
          variant={variant}
          value={sets[variant]}
          max={10}
          onValueChange={(next) => setSets((current) => ({ ...current, [variant]: next }))}
          onFilesAdd={(files) =>
            setSets((current) => ({
              ...current,
              [variant]: [...current[variant], ...toItems(files)],
            }))
          }
        />
        <Typography as="span" variant="caption" tone="muted">
          {variant}
        </Typography>
      </div>
    </div>
  ));
}
