/** The same scale as ProgressBar: track 4px for xs–m and 8px for l–xl, label by control tier. Match the size to the surrounding text. */
import {
  type ControlSize,
  SegmentedProgressBar,
  type SegmentedProgressSegment,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

const segments: SegmentedProgressSegment[] = [
  { value: 55, label: "Выполнено", tone: "success" },
  { value: 25, label: "В работе", tone: "accent" },
  { value: 20, label: "Просрочено", tone: "danger" },
];

export default function SegmentedProgressBarSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <SegmentedProgressBar.Root
          key={size}
          size={size}
          segments={segments}
          label={`Задачи · ${size}`}
        />
      ))}
    </div>
  );
}
