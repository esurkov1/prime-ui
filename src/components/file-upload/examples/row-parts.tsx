/** Rows the set does not draw, built from parts: order documents with a download button, a photo with its preview, a report still being prepared and one that failed with a retry — `FileUpload.Item`, `FileUpload.FormatBadge`, `FileUpload.ItemPreview`, `FileUpload.ItemActions`, `FileUpload.ItemProgress`, `invalid`, `tone`. */
import { Button, FileUpload, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadRowPartsExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Item>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemText>Счёт № 318.pdf</FileUpload.ItemText>
        <FileUpload.ItemDescription>1,2 МБ · выставлен 12 марта</FileUpload.ItemDescription>
        <FileUpload.ItemActions>
          <Button.Root variant="ghost" tone="neutral" aria-label="Скачать Счёт № 318.pdf">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
          </Button.Root>
        </FileUpload.ItemActions>
      </FileUpload.Item>
      <FileUpload.Item>
        <FileUpload.ItemPreview src="https://picsum.photos/seed/warehouse-gate/160/160" />
        <FileUpload.ItemText>Отгрузка, паллет 4.jpg</FileUpload.ItemText>
        <FileUpload.ItemDescription>820 КБ · снято при отгрузке</FileUpload.ItemDescription>
        <FileUpload.ItemActions>
          <Button.Root variant="ghost" tone="neutral" aria-label="Скачать Отгрузка, паллет 4.jpg">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
          </Button.Root>
        </FileUpload.ItemActions>
      </FileUpload.Item>
      <FileUpload.Item>
        <FileUpload.FormatBadge format="xlsx" color="green" />
        <FileUpload.ItemText>Отчёт по заказу.xlsx</FileUpload.ItemText>
        <FileUpload.ItemDescription>Формируется · 60%</FileUpload.ItemDescription>
        <FileUpload.ItemProgress value={60} aria-label="Формируется: Отчёт по заказу.xlsx" />
      </FileUpload.Item>
      <FileUpload.Item invalid>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemText>Акт сверки за март.pdf</FileUpload.ItemText>
        <FileUpload.ItemDescription>
          Не удалось сформировать: нет данных за 31 марта
        </FileUpload.ItemDescription>
        <FileUpload.ItemActions>
          <Button.Root
            variant="ghost"
            tone="neutral"
            aria-label="Сформировать заново: Акт сверки за март.pdf"
          >
            <Button.Icon>
              <Icon name="action.refresh" />
            </Button.Icon>
          </Button.Root>
        </FileUpload.ItemActions>
        <FileUpload.ItemProgress
          value={35}
          tone="danger"
          aria-label="Остановлено: Акт сверки за март.pdf"
        />
      </FileUpload.Item>
    </div>
  );
}
