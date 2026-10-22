/** Revenue by month as bars with the plan as a dashed line over them, both on one scale and named in the legend — `variant`, `series`. */
import {
  Kpi,
  Sparkline,
  type SparklinePoint,
  type SparklineSeries,
  useSparkline,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTHS = ["май", "июн", "июл", "авг", "сен", "окт"];

const byMonth = (values: number[]): SparklinePoint[] =>
  values.map((value, i) => ({ label: MONTHS[i], value: value * 1000 }));

const REVENUE = byMonth([2650, 2810, 2760, 2930, 3120, 3280]);

const PLAN: SparklineSeries[] = [
  {
    id: "plan",
    label: "План",
    data: byMonth([2600, 2700, 2800, 2900, 3000, 3100]),
    variant: "dashed",
    color: "orange",
  },
];

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineComboExample() {
  const revenue = useSparkline({
    data: REVENUE,
    series: PLAN,
    change: "previous",
    formatValue: formatRubles,
  });

  return (
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Выручка против плана</Kpi.Title>
      <Kpi.Period>{revenue.date}</Kpi.Period>
      <Kpi.Value>{revenue.valueText}</Kpi.Value>
      <Kpi.Delta reading={revenue} />
      <Kpi.Media>
        <Sparkline {...revenue.plot} label="Выручка" variant="bars" />
      </Kpi.Media>
    </Kpi.Root>
  );
}
