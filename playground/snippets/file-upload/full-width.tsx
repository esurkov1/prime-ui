import { FileUpload } from "@/components/file-upload/FileUpload";

import styles from "./full-width.module.css";

export default function FileUploadFullWidthSnippet() {
  return (
    <div className={styles.shell}>
      <p className={styles.caption}>
        Родитель на всю колонку: у <code>Root</code> уже <code>width: 100%</code> — зона тянется
        вместе с формой или панелью.
      </p>
      <FileUpload.Root appearance="solid" />
    </div>
  );
}
