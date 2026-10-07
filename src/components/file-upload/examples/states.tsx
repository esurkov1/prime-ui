/** A default zone, a disabled one and an invalid one without a message — `disabled`, `invalid`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function FileUploadStatesExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root label="default" hint="PDF или PNG до 20 МБ" />
      <FileUpload.Root label="disabled" disabled hint="Станет доступно после выбора заказа" />
      <FileUpload.Root label="invalid" invalid hint="PDF или PNG до 20 МБ" />
    </div>
  );
}
