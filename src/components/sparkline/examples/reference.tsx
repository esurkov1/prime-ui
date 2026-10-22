/** Checkout conversion against its plan: a dashed reference line, the scale from zero to 5% and the change over the whole period in percentage points — `reference`, `min`, `max`, `change`, `changeUnit`. */
import { Card, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

const CONVERSION: SparklinePoint[] = [
  { label: "май", value: 2.1 },
  { label: "июн", value: 2.4 },
  { label: "июл", value: 2.2 },
  { label: "авг", value: 2.8 },
  { label: "сен", value: 3.1 },
  { label: "окт", value: 3.4 },
];

const PLAN = 3;

const PERCENT = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

const formatPercent = (value: number) => `${PERCENT.format(value)}%`;

export default function SparklineReferenceExample() {
  const conversion = useSparkline({
    data: CONVERSION,
    change: "first",
    changeUnit: "points",
    formatValue: formatPercent,
  });

  return (
    <Card.Root variant="stat-trend" className={styles.card}>
      <Card.Label>Конверсия оформления заказа</Card.Label>
      <Card.Value>{conversion.valueText}</Card.Value>
      {conversion.changeText ? (
        <Card.Delta tone={conversion.changeTone}>{conversion.changeText}</Card.Delta>
      ) : null}
      <Sparkline
        {...conversion.plot}
        label="Конверсия по месяцам"
        reference={PLAN}
        min={0}
        max={5}
        labels={{ reference: "План: {value}" }}
      />
      <Card.Meta>{conversion.date}</Card.Meta>
    </Card.Root>
  );
}
