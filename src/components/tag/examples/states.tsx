/** Read-only, removable and `disabled` tags. Only the remove button takes hover and focus; use `disabled` when the value cannot be changed right now. */
import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TagStatesExample() {
  return (
    <div className={styles.tags}>
      <Tag.Root>Только чтение</Tag.Root>
      <Tag.Root labels={{ remove: "Убрать «Удаляемый»" }} onRemove={() => undefined}>
        Удаляемый
      </Tag.Root>
      <Tag.Root disabled>Отключён</Tag.Root>
      <Tag.Root labels={{ remove: "Убрать «Заблокирован»" }} disabled onRemove={() => undefined}>
        Заблокирован
      </Tag.Root>
    </div>
  );
}
