/** Attachments of a request: a labelled drop zone and the chosen files as rows with a remove button — `label`, `hint`, `multiple`, `onFilesChange`, `FileUpload.Item`. */
import { Button, FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} КБ`
    : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export default function FileUploadOverviewExample() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className={styles.column}>
      <FileUpload.Root
        label="Документы к заявке"
        hint="PDF, PNG или JPG, можно несколько"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onFilesChange={(next) =>
          setFiles((current) => {
            const known = new Set(current.map(fileKey));
            return [...current, ...next.filter((file) => !known.has(fileKey(file)))];
          })
        }
      />
      {files.map((file) => (
        <FileUpload.Item key={fileKey(file)}>
          <FileUpload.FormatBadge format={file.name.split(".").pop() ?? "file"} />
          <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
          <FileUpload.ItemDescription>{formatSize(file.size)}</FileUpload.ItemDescription>
          <FileUpload.ItemActions>
            <Button.Root
              variant="ghost"
              tone="neutral"
              aria-label={`Удалить ${file.name}`}
              onClick={() => setFiles((current) => current.filter((item) => item !== file))}
            >
              <Button.Icon>
                <Icon name="action.close" />
              </Button.Icon>
            </Button.Root>
          </FileUpload.ItemActions>
        </FileUpload.Item>
      ))}
    </div>
  );
}
