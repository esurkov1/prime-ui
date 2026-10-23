/** Ticks as many as the width holds: a match score and an index that has no data yet — `variant`, `size`, `tone`. */
import { ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ProgressBarTicksExample() {
  return (
    <div className={styles.column}>
      <ProgressBar
        variant="ticks"
        size="l"
        value={97}
        tone="success"
        label="Совпадение с запросом"
        showValue
      />
      <ProgressBar
        variant="ticks"
        size="l"
        value={0}
        label="Индекс надёжности клиента — появится после первой оплаты"
      />
    </div>
  );
}
