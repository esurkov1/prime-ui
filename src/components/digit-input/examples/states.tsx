/** Empty, partly filled, filled, invalid and disabled codes. Use it to check every state of a code field. */
import { DigitInput, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DigitInputStatesExample() {
  return (
    <div className={styles.statesGrid}>
      <div className={styles.cell}>
        <DigitInput.Root length={4} labels={{ group: "Пустой код" }} />
        <Typography.Root variant="caption" tone="muted">
          Пустое
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <DigitInput.Root
          length={4}
          defaultValue="42"
          labels={{ group: "Частично введённый код" }}
        />
        <Typography.Root variant="caption" tone="muted">
          Частично заполнено
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <DigitInput.Root length={4} defaultValue="4207" labels={{ group: "Введённый код" }} />
        <Typography.Root variant="caption" tone="muted">
          Заполнено
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <DigitInput.Root
          invalid
          length={4}
          defaultValue="1111"
          labels={{ group: "Неверный код" }}
        />
        <Typography.Root variant="caption" tone="muted">
          invalid
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <DigitInput.Root
          length={4}
          defaultValue="99"
          disabled
          labels={{ group: "Код недоступен" }}
        />
        <Typography.Root variant="caption" tone="muted">
          disabled
        </Typography.Root>
      </div>
    </div>
  );
}
