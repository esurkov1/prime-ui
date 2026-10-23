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

const THOUSANDS = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** An M card writes a sum short: thousands, the unit stands in `Kpi.Unit`. */
const formatThousands = (value: number) => THOUSANDS.format(value / 1000);

export default function SparklineComboExample() {
  const revenue = useSparkline({
    data: REVENUE,
    series: PLAN,
    change: "previous",
    formatValue: formatThousands,
  });

  return (
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Выручка против плана</Kpi.Title>
      <Kpi.Value>
        {revenue.valueText}
        <Kpi.Unit>тыс. ₽</Kpi.Unit>
      </Kpi.Value>
      <Kpi.Delta reading={revenue} />
      <Kpi.Period>{revenue.date}</Kpi.Period>
      <Kpi.Media>
        <Sparkline {...revenue.plot} label="Выручка" variant="bars" />
      </Kpi.Media>
    </Kpi.Root>
  );
}
