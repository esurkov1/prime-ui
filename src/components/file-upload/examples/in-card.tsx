/** A `solid` zone in a card with a custom body (`DropBody`, muted `Title` with `BrowseLink`, source `Chip`s) and file rows below. Use it for document attachments in a request form. */
import { Button, Card, FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function FileUploadInCardExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Документы к заявке</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <FileUpload.Root inputRef={inputRef} variant="solid" multiple>
          <FileUpload.DropBody>
            <FileUpload.Title tone="muted">
              Перетащите файлы сюда или{" "}
              <FileUpload.BrowseLink onClick={openPicker}>
                выберите на компьютере
              </FileUpload.BrowseLink>
            </FileUpload.Title>
            <FileUpload.ActionsRow>
              <FileUpload.Chip onClick={openPicker}>
                <span className={styles.chipGlyph}>
                  <Icon name="nav.layoutGrid" size="s" tone="secondary" />
                </span>
                <FileUpload.ChipLabel>Из галереи</FileUpload.ChipLabel>
              </FileUpload.Chip>
              <FileUpload.Chip onClick={openPicker}>
                <span className={styles.chipGlyph}>
                  <Icon name="field.email" size="s" tone="secondary" />
                </span>
                <FileUpload.ChipLabel>Из почты</FileUpload.ChipLabel>
              </FileUpload.Chip>
            </FileUpload.ActionsRow>
          </FileUpload.DropBody>
        </FileUpload.Root>

        <div className={styles.list}>
          <FileUpload.Item>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="pdf" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName>Паспорт, разворот.pdf</FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>640 КБ из 1,6 МБ</span>
                  <FileUpload.ItemMetaSep />
                  <strong>Загрузка 40%</strong>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
            <FileUpload.ItemProgress value={40} />
          </FileUpload.Item>
          <FileUpload.Item>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="jpg" color="green" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName>СНИЛС.jpg</FileUpload.ItemName>
                <FileUpload.ItemMeta>420 КБ</FileUpload.ItemMeta>
              </FileUpload.ItemMain>
              <FileUpload.ItemActions>
                <Button.Root variant="ghost" tone="neutral" aria-label="Удалить СНИЛС.jpg">
                  <Button.Icon>
                    <Icon name="action.close" />
                  </Button.Icon>
                </Button.Root>
              </FileUpload.ItemActions>
            </FileUpload.ItemRow>
          </FileUpload.Item>
        </div>

        <Card.Actions>
          <Button.Root>Отправить заявку</Button.Root>
          <Button.Root variant="ghost" tone="neutral">
            Отмена
          </Button.Root>
        </Card.Actions>
      </Card.Body>
    </Card.Root>
  );
}
