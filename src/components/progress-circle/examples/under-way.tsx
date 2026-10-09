/** An import whose share is not known yet turns a quarter arc, then fills and swaps its icon; a sync turns while its share grows — `value`, `spin`, `children`. */
import { Icon, ProgressCircle, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Orders synced at each tick, out of `ORDERS`. */
const SYNCED = [0, 18, 41, 57, 74, 96, 118, 131, 140];
const ORDERS = 140;

/** Steps of the invoice import: unknown while the file is read, then the share. */
const IMPORT: (number | null)[] = [null, null, null, 24, 52, 81, 100];

export default function ProgressCircleUnderWayExample() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    // Runs again from the start after a pause on the finished state.
    const timer = window.setTimeout(() => setStep((step + 1) % (SYNCED.length + 4)), 700);
    return () => window.clearTimeout(timer);
  }, [step]);

  const imported = IMPORT[Math.min(step, IMPORT.length - 1)];
  const synced = SYNCED[Math.min(step, SYNCED.length - 1)];
  const syncing = synced < ORDERS;

  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <ProgressCircle size="l" value={imported} aria-label="Импорт счетов">
          <Icon name={imported === 100 ? "action.check" : "action.download"} />
        </ProgressCircle>
        <Typography as="span" variant="caption" tone="muted">
          Импорт счетов
        </Typography>
      </div>
      <div className={styles.item}>
        <ProgressCircle
          size="l"
          value={synced}
          max={ORDERS}
          spin={syncing}
          tone={syncing ? "accent" : "success"}
          aria-label="Синхронизация заказов"
        >
          {`${synced}`}
        </ProgressCircle>
        <Typography as="span" variant="caption" tone="muted">
          Заказы
        </Typography>
      </div>
    </div>
  );
}
