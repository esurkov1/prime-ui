/** `segments` instead of `value`: parts of a whole clockwise from the top — a closed ring, `max` above the sum leaves the rest as track, `segmentGap="hairline"` separates categories. Pass `label` for the name; screen readers also get the shares as text. */
import { ProgressCircle, type ProgressSegment, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const review: ProgressSegment[] = [
  { value: 40, label: "Принято", tone: "success" },
  { value: 35, label: "На проверке", tone: "warning" },
  { value: 25, label: "Отклонено", tone: "danger" },
];

const sprint: ProgressSegment[] = [
  { value: 12, label: "Готово", tone: "success" },
  { value: 6, label: "В работе" },
];

const storage: ProgressSegment[] = [
  { value: 38, label: "Видео" },
  { value: 21, label: "Документы", tone: "success" },
  { value: 12, label: "Архивы", tone: "warning" },
];

function Caption({ children }: { children: string }) {
  return (
    <Typography.Root as="span" variant="caption" tone="muted">
      {children}
    </Typography.Root>
  );
}

export default function ProgressCircleSegmentsExample() {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <ProgressCircle.Root size="xl" segments={review} label="Заявки">
          100
        </ProgressCircle.Root>
        <Caption>Заявки</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="xl" segments={sprint} max={30} label="Спринт">
          18/30
        </ProgressCircle.Root>
        <Caption>Спринт, max=30</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root
          size="xl"
          segments={storage}
          max={100}
          segmentGap="hairline"
          label="Хранилище"
        >
          71%
        </ProgressCircle.Root>
        <Caption>Хранилище, hairline</Caption>
      </div>
      <div className={styles.item}>
        <ProgressCircle.Root size="xl" segments={[]} label="Нет данных" />
        <Caption>Пусто</Caption>
      </div>
    </div>
  );
}
