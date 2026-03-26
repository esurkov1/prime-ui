import { Loader2 } from "lucide-react";
import type * as React from "react";

import { FileUpload, type FileUploadSize } from "@/components/file-upload/FileUpload";

import styles from "./sizes.module.css";

const fileNameRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--prime-sys-spacing-x2)",
  width: "100%",
};

const inlineStatusStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
  flexShrink: 0,
  fontSize: "var(--prime-sys-typography-support-2xs)",
  lineHeight: "var(--prime-sys-typography-body-lineHeight)",
};

const statusIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
};

function FileItemSizeRow({ size }: { size: FileUploadSize }) {
  return (
    <FileUpload.Item size={size}>
      <FileUpload.ItemRow>
        <FileUpload.FormatBadge format="PDF" color="red" />
        <FileUpload.ItemMain>
          <FileUpload.ItemName style={fileNameRowStyle}>
            <span>my-cv.pdf</span>
            <span style={inlineStatusStyle}>
              <Loader2
                aria-hidden
                style={statusIconStyle}
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
