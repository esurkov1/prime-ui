/** `multiple` + `accept`: every `onFilesChange` call appends files to state and each row can be removed. Use it when the app keeps the selected files before sending them. */
import { Button, FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} КБ`
    : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export default function FileUploadFileListExample() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className={styles.column}>
      <FileUpload.Root
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onFilesChange={(next) =>
          setFiles((prev) => {
            const known = new Set(prev.map(fileKey));
            return [...prev, ...next.filter((file) => !known.has(fileKey(file)))];
          })
        }
      >
        <FileUpload.DropBody>
          <FileUpload.Icon>
            <Icon name="action.upload" size="m" tone="secondary" />
          </FileUpload.Icon>
          <div className={styles.copy}>
            <FileUpload.Title>Перетащите файлы или выберите на компьютере</FileUpload.Title>
            <FileUpload.Hint>PDF, PNG или JPG — можно несколько</FileUpload.Hint>
          </div>
          <FileUpload.BrowseLabel>Выбрать файлы</FileUpload.BrowseLabel>
        </FileUpload.DropBody>
      </FileUpload.Root>

      {files.map((file) => (
        <FileUpload.Item key={fileKey(file)}>
          <FileUpload.ItemRow>
            <FileUpload.FormatBadge format={file.name.split(".").pop() ?? "file"} />
            <FileUpload.ItemMain>
              <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
              <FileUpload.ItemMeta>{formatSize(file.size)}</FileUpload.ItemMeta>
            </FileUpload.ItemMain>
            <FileUpload.ItemActions>
              <Button.Root
                variant="ghost"
                tone="neutral"
                aria-label={`Удалить ${file.name}`}
                onClick={() => setFiles((prev) => prev.filter((f) => f !== file))}
              >
                <Button.Icon>
                  <Icon name="action.close" />
                </Button.Icon>
              </Button.Root>
            </FileUpload.ItemActions>
          </FileUpload.ItemRow>
        </FileUpload.Item>
      ))}
    </div>
  );
}
