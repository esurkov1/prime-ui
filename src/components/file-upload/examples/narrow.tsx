/** In a phone-width column the zone text wraps and a long file name truncates. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadNarrowExample() {
  return (
    <div className={styles.narrow}>
      <FileUpload.Root label="Чек об оплате" size="s" />
      <FileUpload.Item size="s">
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemName>Кассовый чек от 12 марта, заказ 48210.pdf</FileUpload.ItemName>
        <FileUpload.ItemDescription>180 КБ</FileUpload.ItemDescription>
      </FileUpload.Item>
    </div>
  );
}
