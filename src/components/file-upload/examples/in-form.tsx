/** A contract upload form: the required scan is checked on submit and its error replaces the hint — `required`, `error`, `name`. */
import { Button, FileUpload, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const HINT = "PDF до 20 МБ, все страницы";

export default function FileUploadInFormExample() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(files.length === 0 ? "Приложите скан договора" : undefined);
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
          }}
        />
        {files.map((file) => (
          <FileUpload.Item key={file.name}>
            <FileUpload.FormatBadge format="pdf" color="red" />
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
      </div>
      <div className={styles.formActions}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setFiles([]);
            setError(undefined);
          }}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit">Отправить</Button.Root>
      </div>
    </form>
  );
}
