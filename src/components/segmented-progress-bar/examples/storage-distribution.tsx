/** Storage usage in a card: segment weights are shares of the total, a legend repeats the colors in text and screen readers get the distribution as text. Use it for "used by type" breakdowns. */
import { SegmentedProgressBar, type SegmentedProgressSegment, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const segments: SegmentedProgressSegment[] = [
  { value: 38, label: "Видео", tone: "accent" },
  { value: 21, label: "Документы", tone: "success" },
  { value: 12, label: "Архивы", tone: "warning" },
  { value: 29, label: "Свободно", tone: "neutral" },
];

export default function SegmentedProgressBarStorageDistributionExample() {
  return (
    <div className={styles.card}>
      <Typography.Root as="h3" variant="title-s">
        Хранилище: 71 из 100 ГБ
      </Typography.Root>
      <SegmentedProgressBar.Root
        segments={segments}
        label="Занято по типам файлов"
        segmentGap="hairline"
      />
      <ul className={styles.legend}>
        {segments.map((s) => (
          <li key={s.label} className={styles.legendItem}>
            <span className={styles.dot} data-tone={s.tone} aria-hidden />
            <Typography.Root
              as="span"
              variant="caption"
              tone="secondary"
              className={styles.legendValue}
            >
              {s.label} · {s.value} ГБ
            </Typography.Root>
          </li>
        ))}
      </ul>
    </div>
  );
}
