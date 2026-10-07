/** Editor toolbar and form footer: secondary actions ghost/outline/soft, one solid accent primary, the destructive action set apart. Use as the hierarchy template for a screen area. */
import { Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonCompositionExample() {
  return (
    <div className={`${styles.stack} ${styles.composition}`}>
      <div role="toolbar" aria-label="Действия с документом" className={styles.editorBar}>
        <Button.Root variant="ghost" tone="neutral" aria-label="Копировать ссылку">
          <Button.Icon>
            <Icon name="action.copy" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" aria-label="Доступ">
          <Button.Icon>
            <Icon name="status.locked" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral">
          Предпросмотр
        </Button.Root>
        <span className={styles.spacer} aria-hidden />
        <Button.Root variant="outline" tone="neutral">
          Черновик
        </Button.Root>
        <Button.Root>
          <Button.Icon>
            <Icon name="action.upload" />
          </Button.Icon>
          Опубликовать
        </Button.Root>
      </div>
      <div className={styles.footer}>
        <Button.Root variant="ghost" tone="danger">
          Удалить проект
        </Button.Root>
        <span className={styles.spacer} aria-hidden />
        <Button.Root variant="soft" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root type="submit">Сохранить изменения</Button.Root>
      </div>
    </div>
  );
}
