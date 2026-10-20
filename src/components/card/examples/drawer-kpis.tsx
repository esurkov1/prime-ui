/** A record's KPIs in a drawer-width column, two and four to a row, every value one fixed size — `stat-trend`, `valueSize`. */
import { Card } from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTH = [
  { label: "Выручка за месяц", value: "48 600 ₽", delta: "+12 %" },
  { label: "Аренд за месяц", value: "18", delta: "+3" },
];

const FLEET = [
  { label: "Загрузка", value: "92 %" },
  { label: "Рейтинг", value: "4,8" },
  { label: "Ремонтов", value: "2" },
  { label: "Простой", value: "3 д" },
];

export default function CardDrawerKpisExample() {
  return (
    <div className={styles.drawer}>
      <div className={styles.pair}>
        {MONTH.map((kpi) => (
          <Card.Root key={kpi.label} variant="stat-trend" valueSize="m">
            <Card.Label>{kpi.label}</Card.Label>
            <Card.Value>{kpi.value}</Card.Value>
            <Card.Delta tone="success">{kpi.delta}</Card.Delta>
          </Card.Root>
        ))}
      </div>
      <div className={styles.quad}>
        {FLEET.map((kpi) => (
          <Card.Root key={kpi.label} variant="stat-trend" valueSize="m">
            <Card.Label>{kpi.label}</Card.Label>
            <Card.Value>{kpi.value}</Card.Value>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}
