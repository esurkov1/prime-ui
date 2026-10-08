/** File rows while uploading, uploaded and failed with a retry — `FileUpload.ItemProgress`, `invalid`, `FileUpload.ItemActions`. */
import { Button, FileUpload, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadUploadProgressExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Item>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemName>Отчёт за квартал.pdf</FileUpload.ItemName>
        <FileUpload.ItemDescription>1,2 МБ из 3 МБ · загрузка 40%</FileUpload.ItemDescription>
        <FileUpload.ItemProgress value={40} aria-label="Загрузка: Отчёт за квартал.pdf" />
      </FileUpload.Item>
      <FileUpload.Item>
        <FileUpload.FormatBadge format="png" color="blue" />
        <FileUpload.ItemName>Схема проезда.png</FileUpload.ItemName>
        <FileUpload.ItemDescription>820 КБ · загружено</FileUpload.ItemDescription>
        <FileUpload.ItemActions>
          <Button.Root variant="ghost" tone="neutral" aria-label="Удалить Схема проезда.png">
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        </FileUpload.ItemActions>
      </FileUpload.Item>
      <FileUpload.Item invalid>
        <FileUpload.FormatBadge format="mp4" color="purple" />
        <FileUpload.ItemName>Презентация продукта.mp4</FileUpload.ItemName>
        <FileUpload.ItemDescription>Файл больше 20 МБ</FileUpload.ItemDescription>
        <FileUpload.ItemActions>
          <Button.Root variant="soft" tone="danger" size="s">
            Повторить
          </Button.Root>
        </FileUpload.ItemActions>
      </FileUpload.Item>
    </div>
  );
}
