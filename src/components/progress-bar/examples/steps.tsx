/** The scale as whole cells that fill one after another: 2 of 5 onboarding steps, forward and back — `steps`, `max`. */
import { Button, ProgressBar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TOTAL = 5;

export default function ProgressBarStepsExample() {
  const [done, setDone] = React.useState(2);

  return (
    <div className={styles.column}>
      <ProgressBar
        steps
        value={done}
        max={TOTAL}
        label={`Настройка компании: ${done} из ${TOTAL}`}
      />
      <div className={styles.actions}>
        <Button.Root
          variant="soft"
          tone="neutral"
          disabled={done === 0}
          onClick={() => setDone(done - 1)}
        >
          Назад
        </Button.Root>
        <Button.Root disabled={done === TOTAL} onClick={() => setDone(done + 1)}>
          Следующий шаг
        </Button.Root>
      </div>
    </div>
  );
}
