/** A settings row with text on the left and a bare track on the right — `aria-labelledby`, `aria-describedby`. */
import { Switch, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SwitchSettingsRowExample() {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <Typography.Root id="two-factor-title" variant="title-s">
          Двухфакторная защита
        </Typography.Root>
        <Typography.Root id="two-factor-description" variant="body-s" tone="secondary">
          Код из приложения при каждом входе
        </Typography.Root>
      </div>
      <Switch.Root
        defaultChecked
        aria-labelledby="two-factor-title"
        aria-describedby="two-factor-description"
      />
    </div>
  );
}
