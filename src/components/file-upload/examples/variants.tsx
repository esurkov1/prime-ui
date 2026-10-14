/** How files are added: the dashed drop zone, the zone with only its fill for cards and modals, the compact picker button and the add tile that starts an empty set of tiles — `variant`, `trigger`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadVariantsExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="dashed" variant="dashed" />
      <FileUpload.Root label="solid" variant="solid" />
      <FileUpload.Root label="button" trigger="button" />
      <FileUpload.Root label="tile" trigger="tile" layout="grid" multiple />
    </div>
  );
}
