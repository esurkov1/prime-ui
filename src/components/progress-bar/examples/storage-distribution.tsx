/** Storage usage in a card: `segments` split the used space by type, `max` is the disk size so the free space stays track, a legend repeats the colors in text. Use it for "used by type" breakdowns. */
import { ProgressBar, type ProgressSegment, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const segments: ProgressSegment[] = [
  { value: 38, label: "Видео", tone: "accent" },
  { value: 21, label: "Документы", tone: "success" },
  { value: 12, label: "Архивы", tone: "warning" },
];

export default function ProgressBarStorageDistributionExample() {
  return (
    <div className={styles.card}>
      <Typography.Root as="h3" variant="title-s">
        Хранилище: 71 из 100 ГБ
      </Typography.Root>
      <ProgressBar.Root
        segments={segments}
        max={100}
        label="Занято по типам файлов"
        showValue
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
