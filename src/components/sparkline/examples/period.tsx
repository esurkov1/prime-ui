/** Another period swaps the days and the step follows them — a month by days, a quarter by weeks, a year by months; the line cross-fades in and the card reads the new total — `data`, `summary`. */
import { Card, SegmentedControl, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Period = "month" | "quarter" | "year";

const DAYS: Record<Period, number> = { month: 30, quarter: 91, year: 365 };

/** Daily orders up to 22 October 2026, `count` days back. */
const orders = (count: number): SparklinePoint[] =>
  Array.from({ length: count }, (_, i) => {
    const day = 365 - count + i;
    return {
      date: new Date(2026, 9, 22 - (count - 1 - i)),
      value: Math.round(42 + 8 * Math.sin(day / 3.1) + 5 * Math.sin(day / 1.3 + 1) + day * 0.05),
    };
  });

const SERIES: Record<Period, SparklinePoint[]> = {
  month: orders(DAYS.month),
  quarter: orders(DAYS.quarter),
  year: orders(DAYS.year),
};

export default function SparklinePeriodExample() {
  const [period, setPeriod] = React.useState<Period>("quarter");
  const orders = useSparkline({ data: SERIES[period], summary: "sum" });

  return (
    <Card.Root variant="stat-trend" className={styles.card}>
      <SegmentedControl.Root
        value={period}
        onValueChange={(value) => setPeriod(value as Period)}
        aria-label="Период"
      >
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
        <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Card.Label>Новые заказы</Card.Label>
      <Card.Value>{orders.valueText}</Card.Value>
      <Sparkline {...orders.plot} label="Новые заказы по периодам" />
      <Card.Meta>{orders.date}</Card.Meta>
    </Card.Root>
  );
}
