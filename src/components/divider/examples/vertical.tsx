/** Vertical lines between groups of toolbar buttons: one as tall as the row, one inset to a text line — `orientation`, `inset`. */
import { Button, Divider } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DividerVerticalExample() {
  return (
    <div className={styles.toolbar}>
      <Button.Root variant="ghost" tone="neutral">
        Вырезать
      </Button.Root>
      <Button.Root variant="ghost" tone="neutral">
        Копировать
      </Button.Root>
      <Divider orientation="vertical" />
      <Button.Root variant="ghost" tone="neutral">
        Архив
      </Button.Root>
      <Divider orientation="vertical" inset />
      <Button.Root variant="ghost" tone="danger">
        Удалить
      </Button.Root>
    </div>
  );
}
