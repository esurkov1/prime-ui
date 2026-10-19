/** A ranking whose values already are percents: fleet load per model, each row its value alone — `layout`, `scale`, `showShare`, `formatValue`. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const LOAD_TODAY: ProgressSegment[] = [
  { value: 94, label: "КАМАЗ 54901", tone: "warning" },
  { value: 79, label: "Газель Next" },
  { value: 62, label: "ГАЗ Валдай" },
  { value: 41, label: "ГАЗон Next" },
  { value: 18, label: "Fuso Canter" },
];

const formatPercent = (value: number) => `${value}%`;

export default function ProgressBarPercentRowsExample() {
  return (
    <div className={styles.column}>
      <ProgressBar
        layout="rows"
        scale="own"
        showShare={false}
        formatValue={formatPercent}
        segments={LOAD_TODAY}
        label="Загрузка по моделям сегодня"
      />
    </div>
  );
}
