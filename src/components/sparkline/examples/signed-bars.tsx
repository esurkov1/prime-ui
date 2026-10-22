/** Monthly profit with a sign: losses go below the zero line, the current month rests highlighted and any bar shows its value under the pointer or the arrows — `variant`, `highlight`. */
import { Kpi, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

const PROFIT: SparklinePoint[] = [
  { label: "янв", value: 420_000 },
  { label: "фев", value: 310_000 },
  { label: "мар", value: -120_000 },
  { label: "апр", value: 180_000 },
  { label: "мая", value: 540_000 },
  { label: "июн", value: 610_000 },
  { label: "июл", value: -60_000 },
  { label: "авг", value: 280_000 },
  { label: "сен", value: 470_000 },
  { label: "окт", value: 390_000 },
  { label: "ноя", value: null },
  { label: "дек", value: null },
];

/** October is the current month: November and December are still empty. */
const CURRENT_MONTH = 9;

const formatRubles = (value: number) =>
  `${value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("ru-RU")} ₽`;

export default function SparklineSignedBarsExample() {
  const profit = useSparkline({
    data: PROFIT,
    highlight: CURRENT_MONTH,
    formatValue: formatRubles,
  });

  return (
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Прибыль, 2026</Kpi.Title>
      <Kpi.Period>{profit.date}</Kpi.Period>
      <Kpi.Value>{profit.valueText}</Kpi.Value>
      <Kpi.Media>
        <Sparkline {...profit.plot} label="Прибыль по месяцам" variant="bars" />
      </Kpi.Media>
    </Kpi.Root>
  );
}
