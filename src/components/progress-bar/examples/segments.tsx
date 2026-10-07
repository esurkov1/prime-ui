/** Parts of a whole in one bar: joined or separate pills, free capacity up to `max` and an empty list — `segments`, `segmentGap`, `max`. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const REVIEW: ProgressSegment[] = [
  { value: 40, label: "Принято", tone: "success" },
  { value: 35, label: "На проверке", tone: "warning" },
  { value: 25, label: "Отклонено", tone: "danger" },
];

const STORAGE: ProgressSegment[] = [
  { value: 38, label: "Видео" },
  { value: 21, label: "Документы", tone: "success" },
  { value: 12, label: "Архивы", tone: "warning" },
];

export default function ProgressBarSegmentsExample() {
  return (
    <div className={styles.column}>
      <ProgressBar segments={REVIEW} label="Заявки по статусам" />
      <ProgressBar
        segments={STORAGE}
        segmentGap="hairline"
        max={100}
        label="Хранилище: 71 из 100 ГБ"
        showValue
      />
      <ProgressBar segments={[]} label="Нет данных за период" />
    </div>
  );
}
