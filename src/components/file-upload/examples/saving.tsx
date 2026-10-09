/** Published listing photos with no picker, every change saved on the server: a moved or removed photo waits busy, and a change the server refuses puts the set back — `FileUpload.Queue`, `onValueChange`, `value`, `cover`. */
import { FileUpload, type FileUploadFile, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PHOTOS: readonly FileUploadFile[] = [
  {
    id: "sedan-front",
    name: "Спереди.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sedan-front/480/480",
  },
  {
    id: "sedan-side",
    name: "Сбоку.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sedan-side/480/480",
  },
  {
    id: "sedan-back",
    name: "Сзади.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sedan-back/480/480",
  },
  {
    id: "sedan-salon",
    name: "Салон.jpg",
    type: "image/jpeg",
    src: "https://picsum.photos/seed/sedan-salon/480/480",
  },
];

/** The server saving the set a beat later: moderation needs the front photo in the listing. */
function savePhotos(photos: readonly FileUploadFile[]) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (photos.some((photo) => photo.id === "sedan-front")) resolve();
      else reject(new Error("Фото «Спереди» нужно для модерации — его не удалить"));
    }, 900);
  });
}

export default function FileUploadSavingExample() {
  const [photos, setPhotos] = React.useState(PHOTOS);
  const [failure, setFailure] = React.useState<string | null>(null);

  return (
    <div className={styles.wide}>
      <Typography as="p" variant="body-s" tone={failure ? "danger" : "muted"}>
        {failure ?? "Порядок и удаление сохраняются на сервере сразу"}
      </Typography>
      <FileUpload.Queue
        aria-label="Фотографии объявления"
        layout="grid"
        cover
        value={photos}
        onValueChange={async (next) => {
          setFailure(null);
          try {
            await savePhotos(next);
          } catch (error) {
            setFailure(error instanceof Error ? error.message : String(error));
            throw error;
          }
          setPhotos(next);
        }}
      />
    </div>
  );
}
