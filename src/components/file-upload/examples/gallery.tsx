/** An image gallery of an office listing: the first photo is the cover on two tiles and a photo dragged first takes its place, new photos upload in their tiles, one fails and retries, and the add tile counts up to the limit and then says so — `trigger`, `layout`, `cover`, `max`, `value`, `queue`. */
import { FileUpload, type FileUploadFile, type UploadContext, useUploadQueue } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PUBLISHED: FileUploadFile[] = [
  {
    id: "loft-hall",
    name: "Холл.jpg",
    type: "image/jpeg",
    size: 412_000,
    src: "https://picsum.photos/seed/loft-hall/480/480",
  },
  {
    id: "loft-office",
    name: "Опенспейс.jpg",
    type: "image/jpeg",
    size: 388_000,
    src: "https://picsum.photos/seed/loft-office/480/480",
  },
];

/** Photos the manager has just taken: they start uploading as the example opens. */
const NEW_PHOTOS = ["loft-kitchen", "loft-meeting", "loft-terrace", "loft-parking"];

/** Upload attempts per file: the stand-in server drops the first try of one photo. */
const attempts = new WeakMap<File, number>();

/** A stand-in for the server: sends a photo in steps and answers with its address. */
function sendPhoto(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  const attempt = (attempts.get(file) ?? 0) + 1;
  attempts.set(file, attempt);
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.06 + Math.random() * 0.08);
      if (file.name.startsWith("loft-terrace") && attempt === 1 && sent > 0.5) {
        window.clearInterval(timer);
        reject(new Error("Нет связи с сервером"));
        return;
      }
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(`https://cdn.example.com/listings/${encodeURIComponent(file.name)}`);
    }, 400);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

/** A sample photo as a file, as if picked from the phone. */
async function samplePhoto(seed: string): Promise<File> {
  const response = await fetch(`https://picsum.photos/seed/${seed}/480/480`);
  return new File([await response.blob()], `${seed}.jpg`, { type: "image/jpeg" });
}

export default function FileUploadGalleryExample() {
  const queue = useUploadQueue({ upload: sendPhoto, concurrency: 2 });
  const [photos, setPhotos] = React.useState<readonly FileUploadFile[]>(PUBLISHED);
  const started = React.useRef(false);
  const { add } = queue;

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    void Promise.all(NEW_PHOTOS.map(samplePhoto)).then(
      (files) => {
        const added = add(files).map(
          (upload): FileUploadFile => ({
            id: upload.id,
            name: upload.file.name,
            type: upload.file.type,
            size: upload.file.size,
            src: upload.preview,
          }),
        );
        setPhotos((current) => [...current, ...added]);
      },
      () => {},
    );
  }, [add]);

  return (
    <div className={styles.wide}>
      <FileUpload.Root
        label="Фотографии помещения"
        hint="JPG или PNG, первое фото — обложка в каталоге"
        trigger="tile"
        layout="grid"
        cover
        accept="image/*"
        multiple
        max={6}
        value={photos}
        onValueChange={setPhotos}
        queue={queue}
      />
    </div>
  );
}
