/** A KPI with a sparkline or a fill level in the bottom slot of `mini` — `Card.Media`. */
import { Card, Icon, ProgressBar, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

const REQUESTS: SparklinePoint[] = [
  { label: "12:00", value: 9_120 },
  { label: "12:10", value: 9_640 },
  { label: "12:20", value: 9_380 },
  { label: "12:30", value: 10_910 },
  { label: "12:40", value: 10_470 },
  { label: "12:50", value: 11_760 },
  { label: "13:00", value: 11_290 },
  { label: "13:10", value: 12_310 },
  { label: "13:20", value: 12_840 },
];

export default function CardKpiMediaExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini">
        <Card.Icon>
          <Icon name="object.activity" />
        </Card.Icon>
        <Card.Label>Запросы в минуту</Card.Label>
        <Card.Value>12 840</Card.Value>
        <Card.Media>
          <Sparkline layout="compact" data={REQUESTS} label="Запросы в минуту за час" />
        </Card.Media>
      </Card.Root>

      <Card.Root variant="mini">
        <Card.Icon>
          <Icon name="object.storage" />
        </Card.Icon>
        <Card.Label>Хранилище</Card.Label>
        <Card.Value>72 из 100 ГБ</Card.Value>
        <Card.Media>
          <ProgressBar value={72} size="s" label="Занято" showValue />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
