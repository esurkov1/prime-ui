/** How files are added: the dashed drop zone, the zone with only its fill for cards and modals, the compact picker button and the add tile after the files — `variant`, `trigger`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";

import styles from "./examples.module.css";

const PHOTOS: readonly FileUploadFile[] = [
  {
    id: "dock",
    name: "Рампа.jpg",
    type: "image/jpeg",
    size: 412_000,
    src: "https://picsum.photos/seed/variants-dock/320/320",
  },
  {
    id: "racks",
    name: "Стеллажи.jpg",
    type: "image/jpeg",
    size: 388_000,
    src: "https://picsum.photos/seed/variants-racks/320/320",
  },
];

export default function FileUploadVariantsExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="dashed" variant="dashed" />
      <FileUpload.Root label="solid" variant="solid" />
      <FileUpload.Root label="button" trigger="button" />
      <FileUpload.Root label="tile" trigger="tile" layout="grid" defaultValue={PHOTOS} />
    </div>
  );
}
