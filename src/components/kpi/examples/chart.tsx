/** A chart under the value, read from the series: the value, the period and the change come from the reading at rest and follow a scrubbed point; revenue by day as a line, orders by week as bars — `Kpi.Media`, `Kpi.Delta`, `reading`, `useSparkline`. */
import { Kpi, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Daily revenue of 22 days from the 1st of a month, rubles: weekends are quieter. */
const revenueOf = (month: number, base: number): SparklinePoint[] =>
  Array.from({ length: 22 }, (_, i) => {
    const date = new Date(2026, month, 1 + i);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const value = base + 60_000 * Math.sin(i / 3.4) + i * 2_400;
    return { date, value: Math.round((weekend ? value * 0.45 : value) / 1000) * 1000 };
  });

const OCTOBER = revenueOf(9, 440_000);

/** 1–22 September: the same days of the month before, the base of the change at rest. */
const SEPTEMBER_TOTAL = revenueOf(8, 400_000).reduce((sum, point) => sum + (point.value ?? 0), 0);

/** Orders per day over the same October days. */
const ORDERS: SparklinePoint[] = OCTOBER.map((point, i) => ({
  date: new Date(2026, 9, 1 + i),
  value: Math.round(((point.value ?? 0) / 1000) * 0.11 + (i % 3)),
}));

const formatAmount = (value: number) => value.toLocaleString("ru-RU");

export default function KpiChartExample() {
  const revenue = useSparkline({
    data: OCTOBER,
    summary: "sum",
    compareTo: SEPTEMBER_TOTAL,
    change: "previous",
    formatValue: formatAmount,
  });
  const orders = useSparkline({
    data: ORDERS,
    grain: "week",
    aggregate: "sum",
    change: "previous",
  });

  return (
    <div className={styles.wide}>
      <Kpi.Root size="l">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Description>Оплаченные счета</Kpi.Description>
        <Kpi.Value>
          {revenue.valueText}
          <Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta reading={revenue} />
        <Kpi.Period>{revenue.date}</Kpi.Period>
        <Kpi.Media>
          <Sparkline {...revenue.plot} label="Выручка по дням" />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root size="l">
        <Kpi.Title>Заказы</Kpi.Title>
        <Kpi.Description>По неделям</Kpi.Description>
        <Kpi.Value>{orders.valueText}</Kpi.Value>
        <Kpi.Delta reading={orders} />
        <Kpi.Period>{orders.date}</Kpi.Period>
        <Kpi.Media>
          <Sparkline {...orders.plot} variant="bars" label="Заказы по неделям" />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
