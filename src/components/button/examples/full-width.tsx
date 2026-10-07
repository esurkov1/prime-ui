/** `fullWidth` stretches buttons to the column width. Use in narrow forms, cards and mobile footers. */
import { Button } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonFullWidthExample() {
  return (
    <div className={styles.stack}>
      <Button.Root fullWidth>Продолжить</Button.Root>
      <Button.Root variant="outline" tone="neutral" fullWidth>
        Войти другим способом
      </Button.Root>
    </div>
  );
}
