/** `asChild` renders the button look on a real `<a>`; `disabled` becomes `aria-disabled` and blocks navigation. Use when an action-styled control navigates. */
import { Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonAsChildExample() {
  return (
    <>
      <div className={styles.row}>
        <Button.Root asChild>
          <a href="/dashboard">Перейти</a>
        </Button.Root>

        <Button.Root variant="outline" tone="neutral" asChild>
          <a href="/next-step">
            Далее
            <Button.Icon>
              <Icon name="nav.chevronRight" tone="secondary" />
            </Button.Icon>
          </a>
        </Button.Root>

        <Button.Root variant="ghost" tone="neutral" asChild>
          <a href="/settings">Настройки</a>
        </Button.Root>
      </div>

      <div className={styles.row}>
        <Button.Root asChild disabled>
          <a href="/forbidden">Нет доступа</a>
        </Button.Root>

        <Button.Root variant="outline" tone="neutral" asChild disabled>
          <a href="/disabled">Отключено</a>
        </Button.Root>
      </div>
    </>
  );
}
