/** `reserveSupportRow` keeps space for the error, so the block below does not jump. Use it for fields validated on the fly. */
import { Switch, Textarea, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function TextareaReservedSupportRowExample() {
  const [showError, setShowError] = React.useState(false);
  const error = showError ? "Слишком коротко." : undefined;

  return (
    <div className={styles.column}>
      <Switch.Root checked={showError} onCheckedChange={setShowError}>
        <Switch.Label>Показать ошибку</Switch.Label>
      </Switch.Root>
      <div className={styles.pair}>
        <div className={styles.cell}>
          <Textarea.Root label="Без резерва" placeholder="Комментарий" error={error} />
          <Typography.Root variant="caption" tone="secondary" className={styles.marker}>
            Этот блок сдвигается
          </Typography.Root>
        </div>
        <div className={styles.cell}>
          <Textarea.Root
            label="reserveSupportRow"
            reserveSupportRow
            placeholder="Комментарий"
            error={error}
          />
          <Typography.Root variant="caption" tone="secondary" className={styles.marker}>
            Этот блок на месте
          </Typography.Root>
        </div>
      </div>
    </div>
  );
}
