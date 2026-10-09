/** A required scan checked as soon as it is picked: a wrong type or a large file shakes in an error that leaves when the file is removed; a hint and an optional zone — `required`, `hint`, `error`, `optional`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX_SIZE = 20 * 1024 * 1024;

/** A picked file as a file of the set. */
const toFile = (file: File): FileUploadFile => ({
  id: `${file.name}-${file.size}-${file.lastModified}`,
  name: file.name,
  size: file.size,
  type: file.type,
});

/** The scan error, or nothing when every file is a PDF within the limit. */
function scanError(files: readonly FileUploadFile[]) {
  if (files.some((file) => !file.name.toLowerCase().endsWith(".pdf")))
    return "Нужен файл в формате PDF";
  if (files.some((file) => (file.size ?? 0) > MAX_SIZE)) return "Файл больше 20 МБ";
  return undefined;
}

export default function FileUploadValidationExample() {
  const [scan, setScan] = React.useState<readonly FileUploadFile[]>([]);

  return (
    <div className={styles.column}>
      <FileUpload.Root
        label="Скан договора"
        required
        hint="PDF до 20 МБ, все страницы"
        error={scanError(scan)}
        value={scan}
        onValueChange={setScan}
        onFilesChange={(files) => setScan(files.map(toFile))}
      />
      <FileUpload.Root label="Доверенность" optional hint="Если подписывает не директор" />
    </div>
  );
}
