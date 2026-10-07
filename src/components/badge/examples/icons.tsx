/** A leading dot, a leading or trailing icon, and square icon-only badges with `aria-label`. Use an icon when it speeds up recognition of the label. */
import { Badge, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeIconsExample() {
  return (
    <div className={styles.badges}>
      <Badge.Root color="green">
        <Badge.Dot />
        Активен
      </Badge.Root>
      <Badge.Root color="purple">
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Приватный
      </Badge.Root>
      <Badge.Root variant="outline" color="blue">
        Подробнее
        <Badge.Icon>
          <Icon name="nav.chevronRight" />
        </Badge.Icon>
      </Badge.Root>
      <Badge.Root color="sky" aria-label="Почта">
        <Badge.Icon>
          <Icon name="field.email" />
        </Badge.Icon>
      </Badge.Root>
      <Badge.Root variant="solid" color="orange" aria-label="Загрузка">
        <Badge.Icon>
          <Icon name="action.upload" />
        </Badge.Icon>
      </Badge.Root>
    </div>
  );
}
