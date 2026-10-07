/** `segmentGap="none"` is one solid bar, `"hairline"` separates segments with a 4px gap; an empty `segments` array shows only the track. Use `hairline` when segments are distinct categories. */
import { SegmentedProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

const segments = [
  { value: 40, label: "Принято", tone: "success" },
  { value: 35, label: "На проверке", tone: "warning" },
  { value: 25, label: "Отклонено", tone: "danger" },
] as const;

export default function SegmentedProgressBarSegmentGapExample() {
  return (
    <div className={styles.stack}>
      <SegmentedProgressBar.Root segments={[...segments]} label='segmentGap="none"' />
      <SegmentedProgressBar.Root
        segments={[...segments]}
        segmentGap="hairline"
        label='segmentGap="hairline"'
      />
      <SegmentedProgressBar.Root segments={[]} label="Нет данных" />
    </div>
  );
}
