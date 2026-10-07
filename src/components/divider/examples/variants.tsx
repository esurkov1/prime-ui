/** Plain line, label positions (start · center · end), a line inside a gap column and a vertical divider between toolbar groups. Use as a reference for every Divider shape. */
import { Button, Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DividerVariantsExample() {
  return (
    <div className={styles.column}>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          без подписи
        </Typography.Root>
        <Divider.Root />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          align: start · center · end
        </Typography.Root>
        <Divider.Root align="start">Начало</Divider.Root>
        <Divider.Root>По центру</Divider.Root>
        <Divider.Root align="end">Конец</Divider.Root>
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          align=&quot;start&quot; — заголовок секции
        </Typography.Root>
        <Divider.Root align="start">Уведомления</Divider.Root>
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          в колонке — ритм задаёт gap родителя
        </Typography.Root>
        <div className={styles.lineSpacingColumn}>
          <Typography.Root as="span" variant="body-m" tone="secondary">
            Первый пункт
          </Typography.Root>
          <Divider.Root />
          <Typography.Root as="span" variant="body-m" tone="secondary">
            Второй пункт
          </Typography.Root>
        </div>
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          orientation=&quot;vertical&quot; — между группами в ряду
        </Typography.Root>
        <div className={styles.toolbar}>
          <Button.Root variant="ghost" tone="neutral">
            Вырезать
          </Button.Root>
          <Button.Root variant="ghost" tone="neutral">
            Копировать
          </Button.Root>
          <Divider.Root orientation="vertical" />
          <Button.Root variant="ghost" tone="neutral">
            Удалить
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
