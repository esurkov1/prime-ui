/** A required scan checked as soon as it is picked: a wrong type or a large file shakes in an error that leaves when the file is removed; a hint and an optional zone — `required`, `hint`, `error`, `optional`. */
import { Button, FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX_SIZE = 20 * 1024 * 1024;

/** The scan error, or nothing when every picked file is a PDF within the limit. */
function scanError(files: File[]) {
  if (files.some((file) => !file.name.toLowerCase().endsWith(".pdf")))
    return "Нужен файл в формате PDF";
  if (files.some((file) => file.size > MAX_SIZE)) return "Файл больше 20 МБ";
  return undefined;
}

export default function FileUploadValidationExample() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className={styles.column}>
      <FileUpload.Root
        label="Скан договора"
        required
        hint="PDF до 20 МБ, все страницы"
        error={scanError(files)}
        onFilesChange={setFiles}
      />
      {files.map((file) => (
        <FileUpload.Item key={file.name}>
          <FileUpload.FormatBadge format={file.name.split(".").pop() ?? ""} color="red" />
          <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
          <FileUpload.ItemActions>
            <Button.Root
              variant="ghost"
              tone="neutral"
              aria-label={`Удалить ${file.name}`}
              onClick={() => setFiles([])}
            >
              <Button.Icon>
                <Icon name="action.close" />
              </Button.Icon>
            </Button.Root>
          </FileUpload.ItemActions>
        </FileUpload.Item>
      ))}
      <FileUpload.Root label="Доверенность" optional hint="Если подписывает не директор" />
    </div>
  );
}
