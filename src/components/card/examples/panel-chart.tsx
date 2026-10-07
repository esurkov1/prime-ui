/** `panel`: a section header with a period switch, text in `Card.Body` and an edge-to-edge chart in `Card.Chart`. Use for chart widgets on dashboards. */

import { Card, SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const points = [42, 48, 45, 60, 58, 72, 66, 80, 76, 88, 84, 96];

/** An area chart without libraries: stretches over the whole `Card.Chart`. */
function AreaChart() {
  const max = 100;
  const step = 100 / (points.length - 1);
  const line = points.map((v, i) => `${i === 0 ? "M" : "L"}${i * step} ${max - v}`).join(" ");
  return (
    <svg
      className={styles.chart}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.chartFill} d={`${line} L100 100 L0 100 Z`} />
      <path className={styles.chartLine} d={line} />
    </svg>
  );
}

export default function CardPanelChartExample() {
  return (
    <div className={styles.panel}>
      <Card.Root variant="panel">
        <Card.SectionHeader>
          <Card.SectionTitle>Выручка</Card.SectionTitle>
          <Card.SectionTrailing>
            <SegmentedControl.Root size="xs" defaultValue="month" aria-label="Период">
              <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
              <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Card.SectionTrailing>
        </Card.SectionHeader>
        <Card.Body>
          <Typography.Root variant="body-s" tone="secondary">
            С начала квартала: ₽ 12,6 млн, план выполнен на 84%.
          </Typography.Root>
        </Card.Body>
        <Card.Chart>
          <AreaChart />
        </Card.Chart>
      </Card.Root>
    </div>
  );
}
