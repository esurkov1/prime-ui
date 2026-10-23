/** A figure against its target: a progress bar to the plan under the value, the plan and the time left in the line — `Kpi.Media`, `ProgressBar`. */
import { Kpi, ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiPlanExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root>
        <Kpi.Title>План продаж</Kpi.Title>
        <Kpi.Value>
          8,7<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={9.6} tone="success">
          +9,6 %
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Meta>план 12 млн ₽</Kpi.Meta>
        <Kpi.Media>
          <ProgressBar value={73} aria-label="План продаж выполнен на 73 %" showValue />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Закрыто задач</Kpi.Title>
        <Kpi.Value>
          41<Kpi.Unit>из 56</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>Спринт 42</Kpi.Period>
        <Kpi.Meta>осталось 3 дня</Kpi.Meta>
        <Kpi.Media>
          <ProgressBar value={41} max={56} aria-label="Закрыто 41 задача из 56" showValue />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
