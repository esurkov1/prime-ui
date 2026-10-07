/** Parts of a whole clockwise from the top: a closed ring, free capacity up to `max`, separate arcs and an empty list — `segments`, `segmentGap`. */
import { ProgressCircle, type ProgressSegment, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const REVIEW: ProgressSegment[] = [
  { value: 40, label: "Принято", tone: "success" },
  { value: 35, label: "На проверке", tone: "warning" },
  { value: 25, label: "Отклонено", tone: "danger" },
];

const SPRINT: ProgressSegment[] = [
  { value: 12, label: "Готово", tone: "success" },
  { value: 6, label: "В работе" },
];

const STORAGE: ProgressSegment[] = [
  { value: 38, label: "Видео" },
  { value: 21, label: "Документы", tone: "success" },
  { value: 12, label: "Архивы", tone: "warning" },
];

export default function ProgressCircleSegmentsExample() {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <ProgressCircle size="xl" segments={REVIEW} aria-label="Заявки">
          100
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Заявки
        </Typography.Root>
      </div>
      <div className={styles.item}>
        <ProgressCircle size="xl" segments={SPRINT} max={30} aria-label="Спринт">
          18/30
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Спринт
        </Typography.Root>
      </div>
      <div className={styles.item}>
        <ProgressCircle
          size="xl"
          segments={STORAGE}
          max={100}
          segmentGap="hairline"
          aria-label="Хранилище"
        >
          71%
        </ProgressCircle>
        <Typography.Root as="span" variant="caption" tone="muted">
          Хранилище
        </Typography.Root>
      </div>
      <div className={styles.item}>
        <ProgressCircle size="xl" segments={[]} aria-label="Нет данных" />
        <Typography.Root as="span" variant="caption" tone="muted">
          Нет данных
        </Typography.Root>
      </div>
    </div>
  );
}
