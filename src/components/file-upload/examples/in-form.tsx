/** A contract upload form: submit checks the required scan, its error shakes in and leaves once a file is picked or removed — `required`, `error`, `name`, `value`. */
import { Button, FileUpload, type FileUploadFile, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** The hint names the formats the check takes. */
const HINT = "PDF до 20 МБ, все страницы с подписями обеих сторон";
const MAX_SIZE = 20 * 1024 * 1024;

/** A picked file as a file of the set. */
const toFile = (file: File): FileUploadFile => ({
  id: `${file.name}-${file.size}-${file.lastModified}`,
  name: file.name,
  size: file.size,
  type: file.type,
});

/** The scan error on submit, or nothing when exactly a PDF within the limit is attached. */
function scanError(files: readonly FileUploadFile[]) {
  if (files.length === 0) return "Приложите скан договора";
  if (files.some((file) => !file.name.toLowerCase().endsWith(".pdf")))
    return "Нужен файл в формате PDF";
  if (files.some((file) => (file.size ?? 0) > MAX_SIZE)) return "Файл больше 20 МБ";
  return undefined;
}

export default function FileUploadInFormExample() {
  const [scan, setScan] = React.useState<readonly FileUploadFile[]>([]);
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  const change = (next: readonly FileUploadFile[]) => {
    setScan(next);
    setError(undefined);
    setSent(false);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = scanError(scan);
    setError(next);
    setSent(next === undefined);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit} onReset={() => change([])}>
      <FileUpload.Root
        label="Скан договора"
        name="contract"
        accept=".pdf"
        required
        hint={HINT}
        error={error}
        value={scan}
        onValueChange={change}
        onFilesChange={(files) => change(files.map(toFile))}
      />
      {sent ? (
        <Typography as="p" variant="body-s" tone="secondary" role="status">
          Договор отправлен на проверку.
        </Typography>
      ) : null}
      <div className={styles.formActions}>
        <Button.Root variant="soft" tone="neutral" type="reset">
          Отменить
        </Button.Root>
        <Button.Root type="submit">Отправить</Button.Root>
      </div>
    </form>
  );
}
