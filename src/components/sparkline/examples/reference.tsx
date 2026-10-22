/** Checkout conversion against its plan: a dashed reference line, the scale from zero to 5% and the change over the whole period in percentage points — `reference`, `min`, `max`, `change`, `changeUnit`. */
import { Kpi, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

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
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Конверсия оформления заказа</Kpi.Title>
      <Kpi.Period>{conversion.date}</Kpi.Period>
      <Kpi.Value>{conversion.valueText}</Kpi.Value>
      <Kpi.Delta reading={conversion} />
      <Kpi.Media>
        <Sparkline
          {...conversion.plot}
          label="Конверсия по месяцам"
          reference={PLAN}
          min={0}
          max={5}
          labels={{ reference: "План: {value}" }}
        />
      </Kpi.Media>
    </Kpi.Root>
  );
}
