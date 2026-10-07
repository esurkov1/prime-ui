/** A vertical line between groups of toolbar buttons — `orientation`. */
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
      <Button.Root variant="ghost" tone="danger">
        Удалить
      </Button.Root>
    </div>
  );
}
