/** Revenue this year as an area against last year dotted and the plan dashed: each line has its color and look, the legend names them and gives their values at the point — `series`. */
import {
  Card,
  Sparkline,
  type SparklinePoint,
  type SparklineSeries,
  useSparkline,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

const byMonth = (values: number[]): SparklinePoint[] =>
  values.map((value, i) => ({ label: MONTHS[i], value: value * 1000 }));

/** Revenue by month, 2026 up to October. */
const REVENUE = byMonth([2140, 2310, 2480, 2420, 2650, 2810, 2760, 2930, 3120, 3280]);

const COMPARISON: SparklineSeries[] = [
  {
    id: "last-year",
    label: "2025",
    data: byMonth([1980, 2050, 2190, 2240, 2310, 2400, 2380, 2510, 2620, 2700]),
    variant: "dotted",
    color: "gray",
  },
  {
    id: "plan",
    label: "План",
    data: byMonth([2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100]),
    variant: "dashed",
    color: "orange",
  },
];

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineSeriesExample() {
  const revenue = useSparkline({ data: REVENUE, series: COMPARISON, formatValue: formatRubles });

  return (
    <Card.Root variant="stat-trend" className={styles.card}>
      <Card.Label>Выручка по месяцам</Card.Label>
      <Card.Value>{revenue.valueText}</Card.Value>
      <Sparkline {...revenue.plot} label="2026" />
      <Card.Meta>{revenue.date}</Card.Meta>
    </Card.Root>
  );
}
