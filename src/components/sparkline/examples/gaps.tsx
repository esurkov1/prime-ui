/** Daily API requests with days the collector was down: the line breaks over a missing day and the reading says there is no data — `data`, `labels`. */
import { Card, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

const REQUESTS: SparklinePoint[] = [
  { label: "29 сен", value: 182_400 },
  { label: "30 сен", value: 191_800 },
  { label: "1 окт", value: 176_300 },
  { label: "2 окт", value: null },
  { label: "3 окт", value: 168_900 },
  { label: "4 окт", value: 203_500 },
  { label: "5 окт", value: 214_100 },
  { label: "6 окт", value: null },
  { label: "7 окт", value: null },
  { label: "8 окт", value: 226_700 },
  { label: "9 окт", value: 219_200 },
  { label: "10 окт", value: 238_600 },
];

const LABELS = { empty: "Сборщик не работал" };

export default function SparklineGapsExample() {
  const requests = useSparkline({ data: REQUESTS, labels: LABELS });

  return (
    <Card.Root variant="stat-trend" className={styles.card}>
      <Card.Label>Запросы к API в день</Card.Label>
      <Card.Value>{requests.valueText}</Card.Value>
      <Sparkline {...requests.plot} label="Запросы по дням" />
      <Card.Meta>{requests.date}</Card.Meta>
    </Card.Root>
  );
}
