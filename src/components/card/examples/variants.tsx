/** KPI templates: an icon tile with a value, a badge with a value, and a large value with its change — `variant`, `Card.Delta`. */
import { Badge, Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardVariantsExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini">
        <Card.Icon>
          <Icon name="object.users" />
        </Card.Icon>
        <Card.Label>Активные сессии</Card.Label>
        <Card.Value>1 248</Card.Value>
      </Card.Root>

      <Card.Root variant="metric">
        <Card.Header>
          <Badge.Root color="green">SLA</Badge.Root>
          <Card.Value>99,95%</Card.Value>
        </Card.Header>
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
