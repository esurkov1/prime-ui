/** `length`, `onComplete` and keyboard navigation (typing, Backspace, arrow keys, paste). Use `onComplete` to submit the code as soon as the last cell is filled. */
import { DigitInput, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DigitInputLengthAndCompleteExample() {
  const [completed, setCompleted] = React.useState<string | null>(null);

  return (
    <div className={styles.statesGrid}>
      <div className={styles.cell}>
        <DigitInput.Root length={6} defaultValue="12" labels={{ group: "Код из шести цифр" }} />
        <Typography.Root variant="caption" tone="muted">
          length=6 · ← → ходят по ячейкам
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <DigitInput.Root
          length={4}
          onComplete={setCompleted}
          labels={{ group: "Код подтверждения" }}
        />
        <Typography.Root variant="caption" tone="muted">
          {completed ? `onComplete: ${completed}` : "Введите или вставьте 4 цифры"}
        </Typography.Root>
      </div>
    </div>
  );
}
