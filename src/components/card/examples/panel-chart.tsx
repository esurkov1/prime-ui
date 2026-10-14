/** A chart widget: a header with a short description and a period switch, and a Sparkline with the period total over its chart — `Card.Header`, `Card.Description`, `Card.Body`. */
import { Card, SegmentedControl, Sparkline, type SparklinePoint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Period = "week" | "month";

const REVENUE: Record<Period, SparklinePoint[]> = {
  week: [
    { label: "6 окт", value: 412_000 },
    { label: "7 окт", value: 468_000 },
    { label: "8 окт", value: 445_000 },
    { label: "9 окт", value: 603_000 },
    { label: "10 окт", value: 581_000 },
    { label: "11 окт", value: 214_000 },
    { label: "12 окт", value: 187_000 },
  ],
  month: [
    { label: "сен, 1 нед.", value: 2_480_000 },
    { label: "сен, 2 нед.", value: 2_760_000 },
    { label: "сен, 3 нед.", value: 2_610_000 },
    { label: "сен, 4 нед.", value: 3_140_000 },
    { label: "окт, 1 нед.", value: 2_910_000 },
  ],
};

/** The same total for the period before: the badge at rest compares the headline with it. */
const PREVIOUS: Record<Period, number> = {
  week: 2_640_000,
  month: 12_900_000,
};

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function CardPanelChartExample() {
  const [period, setPeriod] = React.useState<Period>("month");

  return (
    <div className={styles.panel}>
      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title>Выручка</Card.Title>
          <Card.Description>Оплаченные счета, без возвратов</Card.Description>
          <SegmentedControl.Root
            size="xs"
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
            aria-label="Период"
          >
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Card.Header>
        <Card.Body>
          <Sparkline
            data={REVENUE[period]}
            label="Оплачено за период"
            summary="sum"
            compareTo={PREVIOUS[period]}
            formatValue={formatRubles}
          />
        </Card.Body>
      </Card.Root>
    </div>
  );
}
