/** A selected segment, a group without a selection, a disabled item and a disabled group. Use it as a reference for every state. */
import { SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SegmentedControlStatesExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="week" aria-label="Период">
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Выбран сегмент
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <SegmentedControl.Root aria-label="Период без выбора">
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Без выбора
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="active" aria-label="Статус кампании">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="paused" disabled>
            На паузе
          </SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Архив</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Item disabled
        </Typography.Root>
      </div>
      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="week" disabled aria-label="Период недоступен">
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Root disabled
        </Typography.Root>
      </div>
    </div>
  );
}
