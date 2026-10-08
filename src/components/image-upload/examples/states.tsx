/** An empty set is one wide drop tile, a missing minimum shows the error, a published listing is read-only — `error`, `disabled`. */
import { ImageUpload, type ImageUploadItem, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const PHOTOS: ImageUploadItem[] = [
  { id: "vespa-front", src: "https://picsum.photos/seed/vespa-front/480/480", alt: "Спереди" },
  { id: "vespa-side", src: "https://picsum.photos/seed/vespa-side/480/480", alt: "Сбоку" },
];

export default function ImageUploadStatesExample() {
  return (
    <>
      <div>
        <div className={styles.column}>
          <ImageUpload
            label="Фотографии"
            hint="Добавьте 3–10 фото"
            max={10}
            onFilesAdd={() => {}}
          />
          <Typography as="span" variant="caption" tone="muted">
            пусто
          </Typography>
        </div>
      </div>
      <div>
        <div className={styles.column}>
          <ImageUpload
            label="Фотографии"
            defaultValue={PHOTOS}
            error="Добавьте ещё хотя бы одно фото: нужно не меньше трёх"
            max={10}
            onFilesAdd={() => {}}
          />
          <Typography as="span" variant="caption" tone="muted">
            error
          </Typography>
        </div>
      </div>
      <div>
        <div className={styles.column}>
          <ImageUpload label="Фотографии" variant="cover" defaultValue={PHOTOS} disabled />
          <Typography as="span" variant="caption" tone="muted">
            disabled
          </Typography>
        </div>
      </div>
    </>
  );
}
