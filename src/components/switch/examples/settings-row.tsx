/** A settings row with text on the left and the track on the right, named via aria-labelledby and aria-describedby. Use it in settings lists. */
import { Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SwitchSettingsRowExample() {
  const id = React.useId();

  return (
    <div className={styles.column}>
      <div className={styles.row}>
        <div className={styles.rowText}>
          <Typography.Root id={`${id}-title`} variant="title-s">
            Двухфакторная защита
          </Typography.Root>
          <Typography.Root id={`${id}-description`} variant="body-s" tone="secondary">
            Код из приложения при каждом входе.
          </Typography.Root>
        </div>
        <Switch.Root
          className={styles.rowControl}
          defaultChecked
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
        >
          <Switch.Label />
        </Switch.Root>
      </div>
    </div>
  );
}
