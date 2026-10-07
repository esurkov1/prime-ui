/** A required zone with a hint, a rejected file whose error replaces the hint and an optional zone — `required`, `hint`, `error`, `optional`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadValidationExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="Скан договора" required hint="PDF до 20 МБ, все страницы" />
      <FileUpload.Root
        label="Счёт на оплату"
        required
        error="Файл не подошёл: нужен PDF до 20 МБ"
        labels={{ title: "Выберите другой файл" }}
      />
      <FileUpload.Root label="Доверенность" optional hint="Если подписывает не директор" />
    </div>
  );
}
