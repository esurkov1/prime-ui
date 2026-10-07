/** The dashed drop line next to a zone with only the fill, for cards and modals — `variant`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadVariantsExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="dashed" variant="dashed" />
      <FileUpload.Root label="solid" variant="solid" />
    </div>
  );
}
