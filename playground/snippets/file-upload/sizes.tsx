import { Loader2 } from "lucide-react";

import { FileUpload, type FileUploadSize } from "@/components/file-upload/FileUpload";
import uploadStyles from "@/components/file-upload/FileUpload.module.css";
import { cx } from "@/internal/cx";

import styles from "./sizes.module.css";

function FileItemSizeRow({ size }: { size: FileUploadSize }) {
  return (
    <FileUpload.Item size={size}>
      <FileUpload.ItemRow>
        <FileUpload.FormatBadge format="PDF" color="red" />
        <FileUpload.ItemMain>
          <FileUpload.ItemName className={uploadStyles.itemNameRow}>
            <span>my-cv.pdf</span>
            <span className={uploadStyles.itemInlineStatus}>
              <Loader2
                aria-hidden
                className={cx(uploadStyles.itemStatusIcon, uploadStyles.statusIconSpin)}
                strokeWidth={2}
                color="var(--prime-sys-color-action-primaryBackground)"
              />
              <strong>Uploading…</strong>
            </span>
          </FileUpload.ItemName>
          <FileUpload.ItemMeta>
            <span>0 KB of 120 KB</span>
          </FileUpload.ItemMeta>
        </FileUpload.ItemMain>
      </FileUpload.ItemRow>
      <FileUpload.ItemProgress value={10} />
    </FileUpload.Item>
  );
}

export default function FileUploadSizesSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <p className={styles.label}>Зона выбора (Root)</p>
        <div className={styles.roots}>
          <FileUpload.Root size="s" />
          <FileUpload.Root size="m" />
          <FileUpload.Root size="l" />
          <FileUpload.Root size="xl" />
        </div>
      </div>
      <div className={styles.group}>
        <p className={styles.label}>Карточка файла (Item)</p>
        <div className={styles.items}>
          <FileItemSizeRow size="s" />
          <FileItemSizeRow size="m" />
          <FileItemSizeRow size="l" />
          <FileItemSizeRow size="xl" />
        </div>
      </div>
    </div>
  );
}
