/** The center holds a percentage, a count on its own scale or an icon — `children`, `max`. */
import { Icon, ProgressCircle, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ProgressCircleInnerContentExample() {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <ProgressCircle size="l" value={45} aria-label="Загрузка отчёта">
          45%
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Отчёт
        </Typography.Root>
      </div>
      <div className={styles.item}>
        <ProgressCircle size="l" value={7} max={12} aria-label="Оплачено месяцев">
          7/12
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Подписка
        </Typography.Root>
      </div>
      <div className={styles.item}>
        <ProgressCircle size="l" value={100} tone="success" aria-label="Онбординг завершён">
          <Icon name="action.check" />
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Онбординг
        </Typography.Root>
      </div>
    </div>
  );
}
