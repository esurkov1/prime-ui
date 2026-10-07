/** Zone states (default, disabled, invalid with custom labels) and file rows (uploading with progress, uploaded with a remove action, failed with retry). Use it as the reference for upload feedback. */
import { Button, FileUpload, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function ZoneBody() {
  return (
    <FileUpload.DropBody>
      <FileUpload.Icon>
        <Icon name="action.upload" size="m" tone="secondary" />
      </FileUpload.Icon>
      <div className={styles.copy}>
        <FileUpload.Title>Перетащите файл сюда</FileUpload.Title>
        <FileUpload.Hint>PDF или PNG до 20 МБ</FileUpload.Hint>
      </div>
      <FileUpload.BrowseLabel>Выбрать файл</FileUpload.BrowseLabel>
    </FileUpload.DropBody>
  );
}

export default function FileUploadStatesExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.zones}>
        <div className={styles.sizeCell}>
          <FileUpload.Root>
            <ZoneBody />
          </FileUpload.Root>
          <Typography.Root as="span" variant="caption" tone="muted" className={styles.caption}>
            По умолчанию
          </Typography.Root>
        </div>
        <div className={styles.sizeCell}>
          <FileUpload.Root disabled>
            <ZoneBody />
          </FileUpload.Root>
          <Typography.Root as="span" variant="caption" tone="muted" className={styles.caption}>
            disabled
          </Typography.Root>
        </div>
        <div className={styles.sizeCell}>
          <FileUpload.Root
            invalid
            labels={{ title: "Файл не подошёл", hint: "Нужен PDF или PNG до 20 МБ" }}
          />
          <Typography.Root as="span" variant="caption" tone="muted" className={styles.caption}>
            invalid + labels
          </Typography.Root>
        </div>
      </div>

      <div className={styles.column}>
        <FileUpload.Item>
          <FileUpload.ItemRow>
            <FileUpload.FormatBadge format="pdf" color="red" />
            <FileUpload.ItemMain>
              <FileUpload.ItemName>Отчёт за квартал.pdf</FileUpload.ItemName>
              <FileUpload.ItemMeta>
                <span>1,2 МБ из 3 МБ</span>
                <FileUpload.ItemMetaSep />
                <strong>Загрузка 40%</strong>
              </FileUpload.ItemMeta>
            </FileUpload.ItemMain>
          </FileUpload.ItemRow>
          <FileUpload.ItemProgress value={40} />
        </FileUpload.Item>

        <FileUpload.Item>
          <FileUpload.ItemRow>
            <FileUpload.FormatBadge format="png" color="blue" />
            <FileUpload.ItemMain>
              <FileUpload.ItemName>Схема проезда.png</FileUpload.ItemName>
              <FileUpload.ItemMeta>
                <span>820 КБ</span>
                <FileUpload.ItemMetaSep />
                <span>Загружено</span>
              </FileUpload.ItemMeta>
            </FileUpload.ItemMain>
            <FileUpload.ItemActions>
              <Button.Root variant="ghost" tone="neutral" aria-label="Удалить файл">
                <Button.Icon>
                  <Icon name="action.close" />
                </Button.Icon>
              </Button.Root>
            </FileUpload.ItemActions>
          </FileUpload.ItemRow>
        </FileUpload.Item>

        <FileUpload.Item invalid>
          <FileUpload.ItemRow>
            <FileUpload.FormatBadge format="mp4" color="purple" />
            <FileUpload.ItemMain>
              <FileUpload.ItemStack>
                <FileUpload.ItemTextGroup>
                  <FileUpload.ItemName>Презентация.mp4</FileUpload.ItemName>
                  <FileUpload.ItemMeta>Файл больше 20 МБ</FileUpload.ItemMeta>
                </FileUpload.ItemTextGroup>
                <FileUpload.ItemTryAgain>Попробовать снова</FileUpload.ItemTryAgain>
              </FileUpload.ItemStack>
            </FileUpload.ItemMain>
          </FileUpload.ItemRow>
        </FileUpload.Item>
      </div>
    </div>
  );
}
