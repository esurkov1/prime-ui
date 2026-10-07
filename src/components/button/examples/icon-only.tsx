/** Square icon-only buttons in a toolbar at every size. Use for compact toolbars; always give each button an `aria-label`. */
import { Button, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function ButtonIconOnlyExample() {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <div role="toolbar" aria-label={`Действия, размер ${size}`} className={styles.toolbar}>
            <Button.Root variant="ghost" tone="neutral" size={size} aria-label="Копировать">
              <Button.Icon>
                <Icon name="action.copy" />
              </Button.Icon>
            </Button.Root>
            <Button.Root variant="ghost" tone="neutral" size={size} aria-label="Загрузить">
              <Button.Icon>
                <Icon name="action.upload" />
              </Button.Icon>
            </Button.Root>
            <Button.Root variant="ghost" tone="neutral" size={size} aria-label="Скрыть">
              <Button.Icon>
                <Icon name="field.password.hide" />
              </Button.Icon>
            </Button.Root>
            <Button.Root variant="outline" tone="neutral" size={size} aria-label="Закрыть">
              <Button.Icon>
                <Icon name="action.close" />
              </Button.Icon>
            </Button.Root>
          </div>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
