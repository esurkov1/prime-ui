/** Revenue by day with its trend: the card reads the series — the total of 1–22 October against the same days of September at rest, a day against the day before while scrubbing — and switches the step in its actions; orders by week as bars — `useSparkline`, `Kpi.Period`, `Kpi.Delta`, `Kpi.Actions`, `Kpi.Media`. */
import {
  Kpi,
  SegmentedControl,
  Sparkline,
  type SparklineGrain,
  type SparklinePoint,
  useSparkline,
} from "prime-ui-kit";

import styles from "./examples.module.css";

/** Daily revenue of 22 days from the 1st of a month: weekends are quieter. */
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

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function KpiChartExample() {
  const revenue = useSparkline({
    data: OCTOBER,
    defaultGrain: "day",
    summary: "sum",
    compareTo: SEPTEMBER_TOTAL,
    change: "previous",
    formatValue: formatRubles,
  });
  const orders = useSparkline({
    data: ORDERS,
    grain: "week",
    aggregate: "sum",
    change: "previous",
  });

  return (
    <div className={styles.wide}>
      <Kpi.Root>
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Description>Оплаченные счета</Kpi.Description>
        <Kpi.Period>{revenue.date}</Kpi.Period>
        <Kpi.Actions>
          <SegmentedControl.Root
            size="xs"
            value={revenue.grain}
            onValueChange={(value) => revenue.setGrain(value as SparklineGrain)}
            aria-label="Шаг графика"
          >
            <SegmentedControl.Item value="day">Дни</SegmentedControl.Item>
            <SegmentedControl.Item value="week">Недели</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Kpi.Actions>
        <Kpi.Value>{revenue.valueText}</Kpi.Value>
        <Kpi.Delta reading={revenue} />
        <Kpi.Meta>{revenue.atRest ? "к 1–22 сен" : "к предыдущей точке"}</Kpi.Meta>
        <Kpi.Media>
          <Sparkline {...revenue.plot} label="Выручка" />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Заказы</Kpi.Title>
        <Kpi.Description>По неделям</Kpi.Description>
        <Kpi.Period>{orders.date}</Kpi.Period>
        <Kpi.Value>{orders.valueText}</Kpi.Value>
        <Kpi.Delta reading={orders} />
        <Kpi.Meta>
          {orders.atRest ? "к тем же дням прошлой недели" : "к предыдущей неделе"}
        </Kpi.Meta>
        <Kpi.Media>
          <Sparkline {...orders.plot} label="Заказы по неделям" variant="bars" />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
