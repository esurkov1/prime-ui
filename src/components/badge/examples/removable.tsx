/** `onRemove` adds a full-height remove segment: the whole end of the badge is the hit area. Read-only, removable, `disabled`, and a leading `Badge.Icon` segment with remove. Use for selected values and applied filters; pass `labels.remove` with the badge text. */
import { Badge, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeRemovableExample() {
  return (
    <div className={styles.badges}>
      <Badge.Root>Только чтение</Badge.Root>
      <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={() => undefined}>
        Москва
      </Badge.Root>
      <Badge.Root color="blue" labels={{ remove: "Убрать «Дизайн»" }} onRemove={() => undefined}>
        Дизайн
      </Badge.Root>
      <Badge.Root labels={{ remove: "Убрать «Приватные»" }} onRemove={() => undefined}>
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Приватные
      </Badge.Root>
      <Badge.Root labels={{ remove: "Убрать «Заблокирован»" }} disabled onRemove={() => undefined}>
        Заблокирован
      </Badge.Root>
    </div>
  );
}
