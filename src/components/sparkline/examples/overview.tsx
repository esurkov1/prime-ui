/** Revenue for 30 days in a KPI card: the card lays out the reading — the total against the previous 30 days and the period — and the plot under it; drag across the plot to see a day — `useSparkline`, `summary`, `compareTo`, `formatValue`, `label`. */
import { Card, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Daily revenue, 9 September — 8 October 2026. */
const REVENUE: SparklinePoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2026, 8, 9 + i),
  value: Math.round(260 + 40 * Math.sin(i / 3.2) + 28 * Math.sin(i / 1.4 + 1) + i * 2.6) * 1000,
}));

/** Revenue for the 30 days before, 10 August — 8 September 2026. */
const PREVIOUS_TOTAL = 8_240_000;

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineOverviewExample() {
  const revenue = useSparkline({
    data: REVENUE,
    summary: "sum",
    compareTo: PREVIOUS_TOTAL,
    change: "previous",
    formatValue: formatRubles,
  });

  return (
    <Card.Root variant="stat-trend" className={styles.card}>
      <Card.Label>Выручка за 30 дней</Card.Label>
      <Card.Value>{revenue.valueText}</Card.Value>
      {revenue.changeText ? (
        <Card.Delta tone={revenue.changeTone}>{revenue.changeText}</Card.Delta>
      ) : null}
      <Sparkline {...revenue.plot} label="Выручка по дням" />
      <Card.Meta>{revenue.date}</Card.Meta>
    </Card.Root>
  );
}
