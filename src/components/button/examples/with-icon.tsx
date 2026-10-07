/** `Button.Icon` before or after the label; the icon side gets 4px less padding and `Icon` without `size` takes the button tier. Use when an icon clarifies the action. */
import { Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonWithIconExample() {
  return (
    <div className={styles.row}>
      <Button.Root>
        <Button.Icon>
          <Icon name="action.upload" />
        </Button.Icon>
        Загрузить файл
      </Button.Root>
      <Button.Root variant="outline" tone="neutral">
        <Button.Icon>
          <Icon name="field.email" tone="secondary" />
        </Button.Icon>
        Написать
      </Button.Root>
      <Button.Root variant="soft" tone="neutral">
        Далее
        <Button.Icon>
          <Icon name="nav.chevronRight" />
        </Button.Icon>
      </Button.Root>
    </div>
  );
}
