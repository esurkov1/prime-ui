/** After a check the error replaces the hint in the same element, without a layout jump, and a polite region reads it — `invalid`, `aria-live`. */
import { Button, Hint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintHintOrErrorExample() {
  const [invalid, setInvalid] = React.useState(false);

  return (
    <div className={styles.field}>
      <div className={styles.actions}>
        <Button.Root variant="soft" tone="neutral" onClick={() => setInvalid(true)}>
          Опубликовать
        </Button.Root>
        <Button.Root variant="soft" tone="neutral" onClick={() => setInvalid(false)}>
          Сбросить
        </Button.Root>
      </div>
      <Hint.Root invalid={invalid} aria-live="polite">
        {invalid
          ? "Заполните название перед публикацией."
          : "Черновик можно сохранить без названия."}
      </Hint.Root>
    </div>
  );
}
