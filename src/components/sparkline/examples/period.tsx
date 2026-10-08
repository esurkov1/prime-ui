/** Another period swaps the series: the line cross-fades in and the headline digits roll to the new total — `data`. */
import { Card, SegmentedControl, Sparkline, type SparklinePoint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Period = "week" | "month" | "quarter";

const series = (labels: string[], base: number, swing: number): SparklinePoint[] =>
  labels.map((label, i) => ({
    label,
    value: Math.round((base + swing * Math.sin(i / 1.7) + (swing / 4) * i) / 100) * 100,
  }));

const SERIES: Record<Period, SparklinePoint[]> = {
  week: series(["2 окт", "3 окт", "4 окт", "5 окт", "6 окт", "7 окт", "8 окт"], 41_000, 6_000),
  month: series(
    ["сен, 1 нед.", "сен, 2 нед.", "сен, 3 нед.", "сен, 4 нед.", "окт, 1 нед."],
    286_000,
    32_000,
  ),
  quarter: series(["авг", "сен", "окт"], 1_240_000, 160_000),
};

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklinePeriodExample() {
  const [period, setPeriod] = React.useState<Period>("month");

  return (
    <Card.Root className={styles.card}>
      <Card.Body className={styles.body}>
        <SegmentedControl.Root
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
          aria-label="Период"
        >
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Sparkline data={SERIES[period]} label="Новые заказы" formatValue={formatRubles} />
      </Card.Body>
    </Card.Root>
  );
}
