/** The parent toggles `invalid` and the text of the same element, so the error replaces the hint without a layout jump; `role="alert"` announces it. Use it for validation after a user action. */
import { Button, Hint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintHintOrErrorExample() {
  const [invalid, setInvalid] = React.useState(false);

  return (
    <div className={styles.list}>
      <div className={styles.actions}>
        <Button.Root variant="outline" tone="neutral" size="s" onClick={() => setInvalid(true)}>
          Проверить
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => setInvalid(false)}>
          Сбросить
        </Button.Root>
      </div>
      <Hint.Root invalid={invalid} role={invalid ? "alert" : undefined}>
        {invalid
          ? "Заполните название перед публикацией."
          : "Черновик можно сохранить без названия."}
      </Hint.Root>
    </div>
  );
}
