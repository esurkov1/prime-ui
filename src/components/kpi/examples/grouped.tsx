/** Related figures of one block in one card, a faint line between them: each figure keeps its own title, value and change — `Kpi.Group`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiGroupedExample() {
  return (
    <div className={styles.w40}>
      <Kpi.Group>
        <Kpi.Root>
          <Kpi.Title>Конверсия</Kpi.Title>
          <Kpi.Period>Октябрь</Kpi.Period>
          <Kpi.Value>3,8%</Kpi.Value>
          <Kpi.Delta value={0.4} tone="success">
            +0,4 п. п.
          </Kpi.Delta>
        </Kpi.Root>
        <Kpi.Root>
          <Kpi.Title>Средний чек</Kpi.Title>
          <Kpi.Period>Октябрь</Kpi.Period>
          <Kpi.Value>2 450 ₽</Kpi.Value>
          <Kpi.Delta value={-3} tone="danger">
            −3%
          </Kpi.Delta>
        </Kpi.Root>
      </Kpi.Group>
    </div>
  );
}
