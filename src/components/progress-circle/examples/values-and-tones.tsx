/** `tone` colors the arc; at `0` only the track remains; `max` changes the scale (7 of 12); the center holds text or an icon. Always pass `label`: it is the ring's only accessible name. */
import { Check } from "lucide-react";
import { ProgressCircle, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function Caption({ children }: { children: string }) {
  return (
    <Typography.Root as="span" variant="caption" tone="muted">
      {children}
    </Typography.Root>
  );
}

export default function ProgressCircleValuesAndTonesExample() {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={0} label="Не начато">
          0%
        </ProgressCircle.Root>
        <Caption>0</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={45} label="В процессе">
          45%
        </ProgressCircle.Root>
        <Caption>default</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={100} tone="success" label="Готово">
          <Check aria-hidden />
        </ProgressCircle.Root>
        <Caption>success</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={88} tone="warning" label="Квота">
          88%
        </ProgressCircle.Root>
        <Caption>warning</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={20} tone="danger" label="Сбой">
          20%
        </ProgressCircle.Root>
        <Caption>danger</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="l" value={7} max={12} label="Месяцев оплачено">
          7/12
        </ProgressCircle.Root>
        <Caption>max=12</Caption>
      </div>
    </div>
  );
}
