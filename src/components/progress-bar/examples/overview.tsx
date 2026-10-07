/** An import in progress with its name and percentage — `value`, `label`, `showValue`. */
import { ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ProgressBarOverviewExample() {
  return (
    <div className={styles.column}>
      <ProgressBar value={42} label="Импорт контактов" showValue />
    </div>
  );
}
