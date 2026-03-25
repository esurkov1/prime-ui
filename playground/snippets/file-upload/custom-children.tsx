import { FileUpload } from "@/components/file-upload/FileUpload";

import styles from "./custom-children.module.css";

export default function FileUploadCustomChildrenSnippet() {
  return (
    <FileUpload.Root accept="image/*">
      <div className={styles.customDrop}>Custom drop area — images only</div>
    </FileUpload.Root>
  );
}
