/** A default zone next to a disabled one and one with an error under it — `disabled`, `error`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadStatesExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="default" hint="PDF или PNG до 20 МБ" />
      <FileUpload.Root label="disabled" disabled hint="Станет доступно после выбора заказа" />
      <FileUpload.Root
        label="error"
        error="Файл не подошёл: нужен PDF или PNG до 20 МБ"
        labels={{ title: "Выберите другой файл" }}
      />
    </div>
  );
}
