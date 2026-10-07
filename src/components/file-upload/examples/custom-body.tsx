/** A custom body: a muted title with a browse link and source buttons instead of the built-in one — `FileUpload.Body`, `FileUpload.Title`, `FileUpload.BrowseLink`. */
import { Button, FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function FileUploadCustomBodyExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <div className={styles.column}>
      <FileUpload.Root label="Сканы документов" inputRef={inputRef} variant="solid" multiple>
        <FileUpload.Body>
          <FileUpload.Icon>
            <Icon name="action.upload" tone="secondary" />
          </FileUpload.Icon>
          <FileUpload.Title tone="muted">
            Перетащите файлы сюда или{" "}
            <FileUpload.BrowseLink onClick={openPicker}>
              выберите на компьютере
            </FileUpload.BrowseLink>
          </FileUpload.Title>
          <div className={styles.sources}>
            <Button.Root variant="soft" tone="neutral" size="s" onClick={openPicker}>
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
