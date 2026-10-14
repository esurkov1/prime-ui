/** Checkout conversion against its plan: a dashed reference line, the scale from zero to 5% and the change over the whole period — `reference`, `min`, `max`, `change`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";

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
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <Sparkline
          data={CONVERSION}
          label="Конверсия оформления заказа"
          reference={PLAN}
          min={0}
          max={5}
          change="first"
          formatValue={formatPercent}
          labels={{ reference: "План: {value}" }}
        />
      </Card.Body>
    </Card.Root>
  );
}
