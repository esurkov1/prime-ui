/** Metric cards: `mini` (icon + title-l value), `metric` (badge + heading-m value), `stat-trend` (large value + delta colored by `tone`). Use for KPI rows on dashboards. */

import { Users } from "lucide-react";
import { Badge, Card } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardMetricsExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini">
        <Card.IconBox>
          <Users aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Активные сессии</Card.Label>
          <Card.Value>1 248</Card.Value>
        </Card.Stack>
      </Card.Root>

      <Card.Root variant="metric">
        <Card.HeaderRow>
          <Card.Lead>
            <Badge.Root color="green">SLA</Badge.Root>
          </Card.Lead>
          <Card.Value>99,95%</Card.Value>
        </Card.HeaderRow>
        <Card.Description>Доступность API за 30 дней</Card.Description>
      </Card.Root>

      <Card.Root variant="stat-trend">
        <Card.Label>Выручка за месяц</Card.Label>
        <Card.Value>₽ 4,2 млн</Card.Value>
        <Card.Delta tone="success">+18% к сентябрю</Card.Delta>
      </Card.Root>

      <Card.Root variant="stat-trend">
        <Card.Label>Отток</Card.Label>
        <Card.Value>3,1%</Card.Value>
        <Card.Delta tone="danger">+0,6 п. п. за неделю</Card.Delta>
      </Card.Root>
    </div>
  );
}
