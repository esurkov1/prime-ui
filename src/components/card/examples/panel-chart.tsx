/** A chart widget: a header with a period switch, a summary line and an edge-to-edge chart — `Card.Header`, `Card.Media`. */
import { Card, SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const POINTS = [42, 48, 45, 60, 58, 72, 66, 80, 76, 88, 84, 96];

/** An area chart path in a 100 × 100 box; the SVG stretches over the whole `Card.Media`. */
const LINE = POINTS.map(
  (value, i) => `${i === 0 ? "M" : "L"}${(i * 100) / (POINTS.length - 1)} ${100 - value}`,
).join(" ");

export default function CardPanelChartExample() {
  return (
    <div className={styles.panel}>
      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title>Выручка</Card.Title>
          <SegmentedControl.Root size="xs" defaultValue="month" aria-label="Период">
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Card.Header>
        <Card.Body>
          <Typography variant="body-s" tone="secondary">
            С начала квартала: 12,6 млн ₽, план выполнен на 84%.
          </Typography>
        </Card.Body>
        <Card.Media>
          <svg
            className={styles.chart}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className={styles.chartFill} d={`${LINE} L100 100 L0 100 Z`} />
            <path className={styles.chartLine} d={LINE} />
          </svg>
        </Card.Media>
      </Card.Root>
    </div>
  );
}
