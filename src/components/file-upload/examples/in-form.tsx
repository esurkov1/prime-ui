/** A contract upload form: submit checks the required scan, its error shakes in and leaves once a valid file is picked or removed — `required`, `error`, `name`. */
import { Button, FileUpload, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const HINT = "PDF до 20 МБ, все страницы";
const MAX_SIZE = 20 * 1024 * 1024;

/** The scan error on submit, or nothing when exactly a PDF within the limit is attached. */
function scanError(files: File[]) {
  if (files.length === 0) return "Приложите скан договора";
  if (files.some((file) => !file.name.toLowerCase().endsWith(".pdf")))
    return "Нужен файл в формате PDF";
  if (files.some((file) => file.size > MAX_SIZE)) return "Файл больше 20 МБ";
  return undefined;
}

export default function FileUploadInFormExample() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = scanError(files);
    setError(next);
    setSent(next === undefined);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography as="h3" variant="title-m">
          Договор поставки
        </Typography>
        <Typography as="p" variant="body-s" tone="secondary">
          Подписанный скан нужен до первой отгрузки.
        </Typography>
      </div>
      <div className={styles.column}>
        <FileUpload.Root
          label="Скан договора"
          name="contract"
          accept=".pdf"
          required
          hint={HINT}
          error={error}
          onFilesChange={(next) => {
            setFiles(next);
            setError(undefined);
            setSent(false);
          }}
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
                onClick={() => {
                  setFiles([]);
                  setError(undefined);
                  setSent(false);
                }}
              >
                <Button.Icon>
                  <Icon name="action.close" />
                </Button.Icon>
              </Button.Root>
            </FileUpload.ItemActions>
          </FileUpload.Item>
        ))}
      </div>
      {sent ? (
        <Typography as="p" variant="body-s" tone="secondary" role="status">
          Договор отправлен на проверку.
        </Typography>
      ) : null}
      <div className={styles.formActions}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setFiles([]);
            setError(undefined);
            setSent(false);
          }}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit">Отправить</Button.Root>
      </div>
    </form>
  );
}
