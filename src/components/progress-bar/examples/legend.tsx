/** Shares of categories in their chart colors with a legend of color · name · value · share — `color`, `legend`, `formatValue`. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const DEALS_BY_SOURCE: ProgressSegment[] = [
  { value: 1_840_000, label: "Сайт", color: "blue" },
  { value: 1_120_000, label: "Входящие звонки", color: "orange" },
  { value: 640_000, label: "Партнёры", color: "teal" },
  { value: 310_000, label: "Выставки", color: "yellow" },
  { value: 190_000, label: "Прочее", color: "gray" },
];

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function ProgressBarLegendExample() {
  return (
    <div className={styles.column}>
      <ProgressBar
        segments={DEALS_BY_SOURCE}
        segmentGap="hairline"
        label="Сделки за октябрь по источникам"
        legend
        formatValue={formatRubles}
      />
    </div>
  );
}
