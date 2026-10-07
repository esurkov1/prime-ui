/** Content-width group, fullWidth group with equal truncating segments, and a group scrolling in a narrow container. Use it to decide how the group fills its container. */
import { SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SegmentedControlFullWidthExample() {
  return (
    <div className={styles.stackStart}>
      <div className={styles.labeled}>
        <Typography.Root variant="caption" tone="muted">
          По содержимому
        </Typography.Root>
        <SegmentedControl.Root defaultValue="card" aria-label="Способ оплаты">
          <SegmentedControl.Item value="card">Картой</SegmentedControl.Item>
          <SegmentedControl.Item value="sbp">СБП</SegmentedControl.Item>
          <SegmentedControl.Item value="cash">Наличными курьеру</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.labeled}>
        <Typography.Root variant="caption" tone="muted">
          fullWidth
        </Typography.Root>
        <SegmentedControl.Root
          fullWidth
          defaultValue="card"
          aria-label="Способ оплаты, на всю ширину"
        >
          <SegmentedControl.Item value="card">Картой</SegmentedControl.Item>
          <SegmentedControl.Item value="sbp">СБП</SegmentedControl.Item>
          <SegmentedControl.Item value="cash">Наличными курьеру</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.labeled}>
        <Typography.Root variant="caption" tone="muted">
          Узкий контейнер: прокрутка
        </Typography.Root>
        <div className={styles.tight}>
          <SegmentedControl.Root defaultValue="1m" aria-label="Диапазон графика">
            <SegmentedControl.Item value="1d">1 день</SegmentedControl.Item>
            <SegmentedControl.Item value="1w">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="1m">Месяц</SegmentedControl.Item>
            <SegmentedControl.Item value="1y">Год</SegmentedControl.Item>
            <SegmentedControl.Item value="all">Всё время</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </div>
    </div>
  );
}
