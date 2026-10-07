/** `Tag.Icon` puts a leading icon in the tag text color, sized to the tag tier. Use when the icon tells the value type (email, privacy, page). */
import { Icon, Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TagWithIconExample() {
  return (
    <div className={styles.tags}>
      <Tag.Root>
        <Tag.Icon>
          <Icon name="field.email" />
        </Tag.Icon>
        anna@example.ru
      </Tag.Root>
      <Tag.Root labels={{ remove: "Убрать «Приватные»" }} onRemove={() => undefined}>
        <Tag.Icon>
          <Icon name="status.locked" />
        </Tag.Icon>
        Приватные
      </Tag.Root>
      <Tag.Root size="s">
        <Tag.Icon>
          <Icon name="nav.home" />
        </Tag.Icon>
        Главная
      </Tag.Root>
    </div>
  );
}
