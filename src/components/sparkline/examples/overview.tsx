/** Revenue for 30 days in a dashboard card: at rest the total for the period against the previous 30 days, drag across the chart to see a day — `data`, `label`, `summary`, `compareTo`, `formatValue`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

/** Daily revenue, 9 September — 8 October 2026. */
const REVENUE: SparklinePoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(2026, 8, 9 + i);
  return {
    label: `${day.getDate()} ${MONTHS[day.getMonth()]}`,
    value: Math.round(260 + 40 * Math.sin(i / 3.2) + 28 * Math.sin(i / 1.4 + 1) + i * 2.6) * 1000,
  };
});

/** Revenue for the 30 days before, 10 August — 8 September 2026. */
const PREVIOUS_TOTAL = 8_240_000;

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineOverviewExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <Sparkline
          data={REVENUE}
          label="Выручка за 30 дней"
          summary="sum"
          compareTo={PREVIOUS_TOTAL}
          formatValue={formatRubles}
        />
      </Card.Body>
    </Card.Root>
  );
}
