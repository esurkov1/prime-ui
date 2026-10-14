/** A custom body: a secondary title with a browse link and the formats line and source buttons instead of the built-in one; the gallery button picks only images — `FileUpload.Body`, `FileUpload.Title`, `FileUpload.Description`, `picker`. */
import { Button, FileUpload, type FileUploadPicker, Icon, LinkButton } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function FileUploadCustomBodyExample() {
  const picker = React.useRef<FileUploadPicker>(null);
  const openPicker = () => picker.current?.open();

  return (
    <div className={styles.column}>
      <FileUpload.Root label="Сканы документов" picker={picker} variant="solid" multiple>
        <FileUpload.Body>
          <FileUpload.Icon>
            <Icon name="action.upload" tone="secondary" />
          </FileUpload.Icon>
          <FileUpload.Title tone="secondary">
            Перетащите файлы сюда или{" "}
            <LinkButton asChild>
              <button type="button" onClick={openPicker}>
                выберите на компьютере
              </button>
            </LinkButton>
          </FileUpload.Title>
          <FileUpload.Description>PDF, JPG или PNG до 20 МБ</FileUpload.Description>
          <div className={styles.sources}>
            <Button.Root
              variant="soft"
              tone="neutral"
              size="s"
              onClick={() => picker.current?.open({ accept: "image/*" })}
            >
              <Button.Icon>
                <Icon name="nav.layoutGrid" />
              </Button.Icon>
              Из галереи
            </Button.Root>
            <Button.Root variant="soft" tone="neutral" size="s" onClick={openPicker}>
              <Button.Icon>
                <Icon name="field.email" />
              </Button.Icon>
              Из почты
            </Button.Root>
          </div>
        </FileUpload.Body>
      </FileUpload.Root>
    </div>
  );
}
