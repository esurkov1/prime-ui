/** A record's figures in a drawer-width column, two and four to a row, every value one denser step — `valueSize`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTH = [
  { title: "Выручка", value: "48 600 ₽", change: 12, delta: "+12%" },
  { title: "Аренд", value: "18", change: 3, delta: "+3" },
];

const FLEET = [
  { title: "Загрузка", value: "92 %" },
  { title: "Рейтинг", value: "4,8" },
  { title: "Ремонтов", value: "2" },
  { title: "Простой", value: "3 д" },
];

export default function KpiFixedSizeExample() {
  return (
    <div className={styles.drawer}>
      <div className={styles.pair}>
        {MONTH.map((kpi) => (
          <Kpi.Root key={kpi.title} valueSize="m">
            <Kpi.Title>{kpi.title}</Kpi.Title>
            <Kpi.Period>Октябрь</Kpi.Period>
            <Kpi.Value>{kpi.value}</Kpi.Value>
            <Kpi.Delta value={kpi.change} tone="success">
              {kpi.delta}
            </Kpi.Delta>
          </Kpi.Root>
        ))}
      </div>
      <div className={styles.quad}>
        {FLEET.map((kpi) => (
          <Kpi.Root key={kpi.title} valueSize="m">
            <Kpi.Title>{kpi.title}</Kpi.Title>
            <Kpi.Value>{kpi.value}</Kpi.Value>
          </Kpi.Root>
        ))}
      </div>
    </div>
  );
}
