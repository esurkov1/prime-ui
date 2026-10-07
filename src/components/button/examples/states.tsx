/** Default, disabled and loading (centered spinner, spinner in place of the leading icon, icon-only). Use to see that `loading` needs no `Button.Spinner` and keeps the width. */
import { Button, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function Caption({ children }: { children: string }) {
  return (
    <Typography.Root as="span" variant="caption" tone="muted">
      {children}
    </Typography.Root>
  );
}

export default function ButtonStatesExample() {
  return (
    <div className={styles.sizeRow}>
      <div className={styles.sizeCell}>
        <Button.Root>Сохранить</Button.Root>
        <Caption>default</Caption>
      </div>
      <div className={styles.sizeCell}>
        <Button.Root disabled>Сохранить</Button.Root>
        <Caption>disabled</Caption>
      </div>
      <div className={styles.sizeCell}>
        <Button.Root loading>Сохранить</Button.Root>
        <Caption>loading</Caption>
      </div>
      <div className={styles.sizeCell}>
        <Button.Root variant="outline" tone="neutral" loading>
          <Button.Icon>
            <Icon name="action.upload" />
          </Button.Icon>
          Загрузить
        </Button.Root>
        <Caption>loading + иконка</Caption>
      </div>
      <div className={styles.sizeCell}>
        <Button.Root variant="ghost" tone="neutral" loading aria-label="Копировать">
          <Button.Icon>
            <Icon name="action.copy" />
          </Button.Icon>
        </Button.Root>
        <Caption>loading, icon-only</Caption>
      </div>
    </div>
  );
}
